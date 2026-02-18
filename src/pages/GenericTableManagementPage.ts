import { Page, expect, Locator } from "@playwright/test";
import { CommonUtils } from "@anddone/coretestautomation/dist";
export class GenericTableManager {
  private table: Locator;
  private tbody: Locator;
  private paginationNext: Locator;
  private paginationPrev: Locator;
  private itemsPerPage: Locator;

  constructor(private page: Page, tableSelector: string) {
    this.table = page.locator(tableSelector);
    this.tbody = this.table.locator("tbody");
    this.paginationNext = page.locator('button[data-page="next"]');
    this.paginationPrev = page.locator('button[data-page="prev"]');
    this.itemsPerPage = page.locator("#rowsPerPageSelect");
  }

  /* ===========================
     BASIC TABLE
  ============================ */

  async waitForTable() {
    await expect(this.table).toBeVisible({ timeout: 15000 });
  }

  // Filters

  async applyColumnFilter(columnHeader: string, value: string) {

    // Locate header strictly
    const header = this.table.getByRole("columnheader", {
      name: columnHeader,
      exact: true
    });

    await expect(header).toBeVisible();

    // Click header button to open dropdown
    const headerButton = header.getByRole("button", { exact: true });
    await headerButton.click();

    // Scope to the visible dropdown only
    const dropdown = this.page.locator("div.dropdown-menu.show");
    await expect(dropdown).toBeVisible();

    // Look for text input inside dropdown
    const input = dropdown.locator("input[type='text']");

    // ===============================
    // CASE 1: TEXT FILTER
    // ===============================
    if (await input.count() > 0) {

      await input.first().click();
      await input.first().fill(value);

      await Promise.all([
        this.page.waitForResponse(resp =>
          resp.url().includes("/broker") && resp.status() === 200
        ),
        dropdown.locator("a.filter-button.apply").click()
      ]);

    }
    // ===============================
    // CASE 2: DROPDOWN FILTER
    // ===============================
    else {

      await dropdown.getByText(value, { exact: true }).click();

      await Promise.all([
        this.page.waitForResponse(resp =>
          resp.url().includes("/broker") && resp.status() === 200
        ),
        dropdown.locator("a.filter-button.apply").click()
      ]);
    }

    console.log(`✓ Filter applied on ${columnHeader}: ${value}`);
  }

  async clearColumnFilter(columnHeader: string) {
    const header = this.table.getByRole("columnheader", {
      name: columnHeader,
      exact: true
    });

    await expect(header).toBeVisible();
    await header.getByRole("button").click();
    const inputId = "input" + columnHeader.replace(/\s/g, "") + "Broker";
    const input = this.page.locator(`#${inputId}`);

    if (await input.count() > 0) {
      await input.fill("");
    }

    await this.page.locator(
      `div.dropdown-menu.show a.filter-button.clear`
    ).click();

    await this.page.waitForLoadState("networkidle");

    console.log(`✓ Cleared filter for ${columnHeader}`);
  }


  async getColumnValues(columnHeader: string): Promise<string[]> {
    // Get column index using ARIA role (robust)
    const columnIndex = await this.getColumnIndex(columnHeader);
    const cells = this.page.locator(`tbody#dataSection tr td:nth-child(${columnIndex})`);

    const values: string[] = [];
    const count = await cells.count();

    for (let i = 0; i < count; i++) {
      values.push((await cells.nth(i).innerText()).trim());
    }

    return values;
  }


  validateColumnContains(values: string[], expected: string): boolean {

    if (values.length === 0) return true;
    const lowerExpected = expected.toLowerCase();
    return values.every(v =>
      v.toLowerCase().includes(lowerExpected)
    );
  }


  async getColumnIndex(headerText: string): Promise<number> {

    const headers = this.table.getByRole("columnheader");
    const count = await headers.count();

    const target = headerText.trim().toLowerCase();

    for (let i = 0; i < count; i++) {

      const text = (await headers.nth(i).innerText())
        .trim()
        .toLowerCase();

      // Match only beginning of header (ignore filter text)
      if (text.startsWith(target)) {
        return i + 1;
      }
    }

    throw new Error(`Header "${headerText}" not found`);
  }

  async applyTextFilter(headerText: string, value: string) {
    const header = this.table.locator("th").filter({ hasText: headerText });

    await header.locator(".custom-dropdown-toggle").click();
    await header.locator("input").fill(value);
    await header.locator(".filter-button.apply").click();
  }

  async clearTextFilter(headerText: string) {
    const header = this.table.locator("th").filter({ hasText: headerText });

    await header.locator(".custom-dropdown-toggle").click();
    await header.locator(".filter-button.clear").click();
  }

  async validateTextFilter(headerText: string, value: string) {
    const values = await this.getColumnValues(headerText);

    values.forEach(v =>
      expect(v.toLowerCase()).toContain(value.toLowerCase())
    );
  }

  /* ===========================
     DROPDOWN FILTER
  ============================ */

  async applyDropdownFilter(headerText: string, optionText: string) {

    const headerButton = this.table.getByRole("button", {
      name: headerText,
      exact: true
    });

    await expect(headerButton).toBeVisible();
    await headerButton.click();
    const dropdownId = await headerButton.getAttribute("id");
    const dropdown = this.page.locator(`.dropdown-menu[aria-labelledby="${dropdownId}"]`);

    await expect(dropdown).toBeVisible();
    await dropdown.getByText(optionText, { exact: true }).click();
    // Click APPLY ONLY ONCE and wait for API
    await Promise.all([
      this.page.waitForResponse(resp =>
        resp.url().includes('/broker') && resp.status() === 200
      ),
      dropdown.locator("a.filter-button.apply").click()
    ]);

    console.log(`${headerText} filter applied: ${optionText}`);
  }


  async verifyAllPagesColumnValue(headerText: string, expected: string) {

    const pagination = this.page.locator('#pagination');
    const noResults = this.page.locator('#noResultsContainer');

    // Wait for rows OR no results
    await Promise.race([
      this.tbody.locator('tr').first().waitFor({ state: 'visible' }).catch(() => { }),
      noResults.waitFor({ state: 'visible' }).catch(() => { })
    ]);

    if (await noResults.isVisible().catch(() => false)) {
      console.log(`No results found for ${expected}`);
      return;
    }
    let pageCounter = 1;
    while (true) {

      console.log(`Validating page ${pageCounter}`);
      const values = await this.getColumnValues(headerText);
      for (const value of values) {
        expect(value.trim()).toBe(expected);
      }

      // Try clicking next
      const moved = await CommonUtils.clickNextPagination(pagination);

      if (!moved) {
        console.log("Reached last page");
        break;
      }

      // Wait for table refresh
      await this.page.waitForTimeout(800);

      pageCounter++;

      // Safety cap (avoid infinite loop)
      if (pageCounter > 100) {
        console.warn("Pagination safety break triggered");
        break;
      }
    }

    console.log(`All pages validated`);

    // Return to first page cleanly
    await CommonUtils.clickStartPagination(pagination);
  }


  async clickSort(headerText: string) {

    const header = this.table.getByRole("columnheader", { name: headerText, exact: true });
    await expect(header).toBeVisible();

    const firstRowLocator = this.tbody.locator("tr").first();
    const firstRowBefore = await firstRowLocator.innerText();
    await header.locator(".sort-icon").click();
    await this.page.waitForFunction(
      ({ selector, previousText }) => {
        const row = document.querySelector(selector);
        return row && row.textContent !== previousText;
      },
      {
        selector: "tbody#dataSection tr",
        previousText: firstRowBefore
      }
    );
  }


  async getColumnValuesAllPages(headerText: string): Promise<string[]> {

    const allValues: string[] = [];
    while (true) {

      // Always read fresh rows
      const values = await this.getColumnValues(headerText);
      allValues.push(...values);

      const pagination = this.page.locator('#pagination');
      const activePage = pagination.locator('button.active');
      const currentPageNumber = (await activePage.innerText()).trim();
      const nextButton = pagination.locator('button[data-page="next"]');

      const isDisabled = await nextButton.evaluate(btn =>
        btn.classList.contains('disabled')
      );

      if (isDisabled) {
        console.log("Reached last page");
        break;
      }

      await nextButton.click();

      // Wait until active page number changes
      await this.page.waitForFunction(
        (previousPage) => {
          const active = document.querySelector('#pagination button.active');
          return active && active.textContent.trim() !== previousPage;
        },
        currentPageNumber
      );
    }

    return allValues;
  }

  isAscending(values: string[]): boolean {
    return values.every((v, i) =>
      !i || values[i - 1].toLowerCase() <= v.toLowerCase()
    );
  }

  isDescending(values: string[]): boolean {
    return values.every((v, i) =>
      !i || values[i - 1].toLowerCase() >= v.toLowerCase()
    );
  }

  private parseDate(value: string): Date {
    const [month, day, year] = value.split("-");
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  isDateAscending(values: string[]): boolean {
    return values.every((v, i) =>
      !i || this.parseDate(values[i - 1]) <= this.parseDate(v)
    );
  }

  isDateDescending(values: string[]): boolean {
    return values.every((v, i) =>
      !i || this.parseDate(values[i - 1]) >= this.parseDate(v)
    );
  }

  async sortAndValidate(headerText: string, type: "text" | "date", order: "asc" | "desc") {

    await this.clickSort(headerText);
    const values = await this.getColumnValuesAllPages(headerText);

    if (type === "text") {
      if (order === "asc") {
        expect(this.isAscending(values)).toBeTruthy();
      } else {
        expect(this.isDescending(values)).toBeTruthy();
      }
    }

    if (type === "date") {
      if (order === "asc") {
        expect(this.isDateAscending(values)).toBeTruthy();
      } else {
        expect(this.isDateDescending(values)).toBeTruthy();
      }
    }

    console.log(`${headerText} sorted in ${order.toUpperCase()} order`);
  }

  /* ===========================
     ITEMS PER PAGE
  ============================ */

  async changeItemsPerPage(count: number) {
    await this.itemsPerPage.selectOption(count.toString());
    await this.page.waitForTimeout(1500);
  }

  /* ===========================
     EMPTY STATE
  ============================ */

  async validateNoResults() {
    const noData = this.page.locator(
      '[class*="no-result"], [class*="no-data"], .empty-state'
    );
    await expect(noData).toBeVisible();
  }

  /* ===========================
     FULL DATA EXTRACTION
  ============================ */

  async getAllTableData(): Promise<Record<string, string>[]> {

    // Check for No Results
    const noResults = this.page.locator(
      '[class*="no-result"], [class*="no-data"], .empty-state'
    );

    if (await noResults.isVisible().catch(() => false)) {
      console.log("⚠ No results found in table.");
      return [];
    }

    const headers = await this.table.locator("thead th").allInnerTexts();
    const records: Record<string, string>[] = [];
    const pagination = this.page.locator('#pagination');
    while (true) {

      //  Read rows of current page
      const rows = this.tbody.locator("tr");
      const rowCount = await rows.count();

      for (let i = 0; i < rowCount; i++) {
        const cells = rows.nth(i).locator("td");
        const cellCount = await cells.count();

        const rowObj: Record<string, string> = {};

        for (let j = 0; j < cellCount; j++) {
          rowObj[headers[j].trim()] =
            (await cells.nth(j).innerText()).trim();
        }

        records.push(rowObj);
      }

      const activePage = pagination.locator('button.active');
      const currentPageNumber = (await activePage.innerText()).trim();
      const nextButton = pagination.locator('button[data-page="next"]');
      await nextButton.click();

      try {
        await this.page.waitForFunction(
          (previousPage) => {
            const active = document.querySelector('#pagination button.active');
            return active && active.textContent.trim() !== previousPage;
          },
          currentPageNumber,
          { timeout: 1500 }
        );
      } catch {
        console.log("Reached last page");
        break;
      }
    }

    return records;
  }

}
