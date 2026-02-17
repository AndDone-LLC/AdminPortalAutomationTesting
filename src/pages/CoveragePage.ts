import { expect, Locator, Page } from "@playwright/test";
import { commonUtils, TableUtils } from "@siddheshwar.anajekar/common-base";
import { BasePage } from "./BasePage";
import {AdminEditMerchantPage} from "./AdminEditMerchantPage";

export class CoveragePage extends BasePage {
    public utils: commonUtils;
    private adminEditMerchantPage: AdminEditMerchantPage;
    private basePage: BasePage;

    constructor(page: Page) {
        super(page);
        this.utils = new commonUtils(page);
        this.adminEditMerchantPage = new AdminEditMerchantPage(page);
        this.basePage = new BasePage(page);
    }   


// Coverage table
    coverageContainer = this.page.locator('app-data-synchronization');
    coverageTable = this.coverageContainer.locator('table');
    coverageRows = this.coverageContainer.locator('tbody tr');
    coverageHeaders = this.coverageContainer.locator('thead th');

    // Filter/Sort icons in table headers
    //nameColumnHeader = this.coverageTable.locator('thead th').filter({ hasText: 'Name' });
    nameColumnHeader = this.coverageTable.locator('#nameDropdownCoverage span.date');
    nameFilterIcon = this.nameColumnHeader.locator('i, svg, .sort-icon, [class*="sort"]').first();
    
    updatedOnColumnHeader = this.coverageTable.locator('thead th').filter({ hasText: 'Updated On' });
    updatedOnFilterIcon = this.updatedOnColumnHeader.locator('i, svg, .sort-icon, [class*="sort"]').first();

    // Name filter popup/modal
    nameFilterPopup = this.page.locator('[class*="filter"], [class*="modal"], [class*="dropdown"]').filter({ hasText: 'Name' });
    nameFilterInput = this.page.locator('#inputNameCoverage');
    nameFilterApplyBtn=this.page.locator("//div[@aria-labelledby='nameDropdownBtnCoverage']/div[@class='filter-button-holder']/a[contains(text(),'Apply')]");
    nameFilterClearBtn=this.page.locator("//div[@aria-labelledby='nameDropdownBtnCoverage']/div[@class='filter-button-holder']/a[contains(text(),'Clear')]");
    
    // IPFS Mapped filter
    ipfsMappedColumnHeader = this.coverageTable.locator('#ipfsMappedDropdownCoverage .date');
    //ipfsMappedDropdownBtn = this.page.locator('#ipfsMappedDropdownBtn, button').filter({ hasText: 'IPFS Mapped' }).first();
    ipfsMappedYesOption = this.page.locator("//div[@aria-labelledby='ipfsMappedDropdownCoverage']//span").first();
    ipfsMappedNoOption = this.page.locator("//div[@aria-labelledby='ipfsMappedDropdownCoverage']//span[contains(@class,'yellow')]");
    ipfsMappedApplyBtn = this.page.locator("//div[@aria-labelledby='ipfsMappedDropdownCoverage']//following::div/a").first();
    ipfsMappedCloseBtn=this.page.locator("//button[@id='ipfsMappedDropdownCoverage']//following::div[@class='filter-popup show']//following-sibling::span[@class='close-popup']");
    // Status filter
    statusColumnHeader = this.coverageTable.locator('#statusDropdownCoverage .date');
    statusActiveOption = this.page.locator("//div[@aria-labelledby='statusDropdownCoverage']//span[contains(text(),'Active')]");
    statusInactiveOption = this.page.locator("//div[@aria-labelledby='statusDropdownCoverage']//span[contains(text(),'Inactive')]");
    statusApplyBtn = this.page.locator("//div[@aria-labelledby='statusDropdownCoverage']//following::div/a").first();
    statusCloseBtn = this.page.locator("//button[@id='statusDropdownCoverage']//following::div[@class='filter-popup show']//following-sibling::span[@class='close-popup']");
    
    // Portal Status filter
    portalStatusColumnHeader = this.coverageTable.locator('#portalStatusDropdownCoverage .date');
    portalStatusActiveOption = this.page.locator("//div[@aria-labelledby='portalStatusDropdownCoverage']//span[contains(text(),'Active')]");
    portalStatusInactiveOption = this.page.locator("//div[@aria-labelledby='portalStatusDropdownCoverage']//span[contains(text(),'Inactive')]");
    portalStatusApplyBtn = this.page.locator("//div[@aria-labelledby='portalStatusDropdownCoverage']//following::div/a").first();
    portalStatusCloseBtn = this.page.locator("//button[@id='portalStatusDropdownCoverage']//following::div[@class='filter-popup show']//following-sibling::span[@class='close-popup']");
    
    //Filter table data
    firstRowTableData=this.page.locator('tbody tr').first();
    tableData=this.page.locator('tbody tr td');

    //No result Found locator
    noResultsFoundMsg = this.page.locator('#noResultsMsg').first();

    //sort-icon
    nameHeaderSortIcon = this.page.locator("//button[@id='nameDropdownBtnCoverage']//following-sibling::span[contains(@class,'sort-icon')]");
    updatedOnHeaderSortIcon = this.page.locator("//span[contains(text(),'Updated On')]//following::span[contains(@class,'sort-icon')]").first();
    createdOnHeaderSortIcon = this.page.locator("//span[contains(text(),'Created On')]//following::span[contains(@class,'sort-icon')]").last();

    // Pagination controls
    paginationNext = this.page.locator('button[data-page="next"]');
    paginationPrev = this.page.locator('button[data-page="prev"]');
    paginationButtons = this.page.locator('#pagination');
    itemsPerPageDropdown = this.page.locator('#rowsPerPageSelect');
    itemsPerPageOption10 = this.page.locator('#rowsPerPageSelect option[value="10"]');
    itemsPerPageOption25 = this.page.locator('#rowsPerPageSelect option[value="25"]');
    itemsPerPageOption50 = this.page.locator('#rowsPerPageSelect option[value="50"]');
    currentPageNumber = this.page.locator('.current-page, .active-page, button.active');
    pageNumbers = this.page.locator('.page-number, .pagination button[data-page]');




   async enterNameInFilterAndApply(name: string) {
        await this.openNameFilterPopup();
        await expect(this.nameFilterClearBtn).toBeVisible({ timeout: 5000 });
        await this.nameFilterClearBtn.click();
        await this.openNameFilterPopup();
        await expect(this.nameFilterInput).toBeVisible({ timeout: 5000 });
        await this.nameFilterInput.fill(name);
        await expect(this.nameFilterApplyBtn).toBeVisible({ timeout: 5000 });
        await this.nameFilterApplyBtn.click();
        //await this.page.waitForTimeout(1500);
        await this.basePage.loaderSign.waitFor({state:'hidden', timeout: 10000}).catch(() => {});
        await expect(this.firstRowTableData).toBeVisible({timeout: 15000});
        await this.verifyFilteredResultsContainText(name);

    }

    async enterInvalidNameInFilterAndApply(name: string) {
        await this.openNameFilterPopup();
        await expect(this.nameFilterClearBtn).toBeVisible({ timeout: 5000 });
        await this.nameFilterClearBtn.click();
        await this.openNameFilterPopup();
        await expect(this.nameFilterInput).toBeVisible({ timeout: 5000 });
        await this.nameFilterInput.fill(name);
        await expect(this.nameFilterApplyBtn).toBeVisible({ timeout: 5000 });
        await this.nameFilterApplyBtn.click();  
        await expect(this.noResultsFoundMsg).toBeVisible({ timeout: 10000 });
    }

    async clickToCloseIpfsFilterPopup() {  
        await expect(this.ipfsMappedCloseBtn).toBeVisible({ timeout: 5000 });
        await this.ipfsMappedCloseBtn.scrollIntoViewIfNeeded();
        await this.ipfsMappedCloseBtn.click({ force: true });
        await this.page.waitForTimeout(500);
        await expect(this.basePage.loaderSign).toBeHidden({ timeout: 10000 });
    }

    async clickToCloseStatusFilterPopup() {  
        await expect(this.statusCloseBtn).toBeVisible({ timeout: 5000 });
        await this.statusCloseBtn.scrollIntoViewIfNeeded();
        await this.statusCloseBtn.click({ force: true });
        await this.page.waitForTimeout(500);
        await expect(this.basePage.loaderSign).toBeHidden({ timeout: 10000 });
    }

    async clickToClosePortalStatusFilterPopup() {
        await expect(this.portalStatusCloseBtn).toBeVisible({ timeout: 5000 });
        await this.portalStatusCloseBtn.scrollIntoViewIfNeeded();
        await this.portalStatusCloseBtn.click({ force: true });
        await this.page.waitForTimeout(500);
        await expect(this.basePage.loaderSign).toBeHidden({ timeout: 10000 });
    }


    /**
     * Clear filter using Clear button and verify table reset
     */
    async clearNameFilterAndVerify() {
        await this.openNameFilterPopup();
        await this.clickNameFilterClear();
        
        // Clear button should clear the input
        const inputValue = await this.nameFilterInput.inputValue();
        expect(inputValue).toBe('');
        console.log("✓ Filter cleared successfully");
    }

    /**
     * Apply filter, then clear it and verify all data is displayed again
     * @param filterText Text to filter by
     */
    async filterDataAndVerifyClearRestoresAllData(filterText: string) {
        console.log(`\n--- Testing: Filter and Clear functionality ---`);
        
        // Step 0: Clear any existing filters to start fresh
        await this.openNameFilterPopup();
        await this.clickNameFilterClear();
        await this.page.waitForTimeout(2000);
        console.log(`✓ Pre-cleared any existing filters`);
        
        // Step 1: Get initial data count (all data)
        const initialNames = await this.getCoverageNames();
        const initialCount = initialNames.length;
        console.log(`Initial data count (before filter): ${initialCount}`);
        console.log(`Initial names: ${initialNames.join(', ')}`);
        
        // Step 2: Apply filter
        const filteredResults = await this.filterByNameAndValidate(filterText);
        const filteredCount = filteredResults.length;
        console.log(`\nFiltered data count (with filter): ${filteredCount}`);
        console.log(`Filtered names: ${filteredResults.join(', ')}`);
        
        // Verify that filter reduced the data (or returned no results if data doesn't exist)
        if (filteredCount > 0) {
            expect(filteredCount).toBeLessThanOrEqual(initialCount);
            console.log(`✓ Filter worked: ${initialCount} results → ${filteredCount} results`);
        } else {
            console.log(`⚠ No results found for filter: "${filterText}"`);
        }
        
        // Step 3: Open filter popup again and clear it
        await this.openNameFilterPopup();
        await this.clickNameFilterClear();
        
        // Verify input is cleared
        const clearedInputValue = await this.nameFilterInput.inputValue();
        expect(clearedInputValue).toBe('');
        console.log(`\n✓ Filter input cleared`);
        
        // Step 4: Filter is auto-applied when cleared (no need to click Apply button)
        // Wait for UI to update with all data
        await this.page.waitForTimeout(2000);
        
        // Step 5: Get data count after clearing filter
        const restoredNames = await this.getCoverageNames();
        const restoredCount = restoredNames.length;
        console.log(`\nData count after clearing filter: ${restoredCount}`);
        console.log(`Restored names: ${restoredNames.join(', ')}`);
        
        // Step 6: Verify all data is restored
        expect(restoredCount).toBe(initialCount);
        console.log(`\n✓ All data restored successfully: ${restoredCount} rows displayed`);
        console.log(`✓ Data consistency verified: Before=${initialCount}, After=${restoredCount}`);
    }

    /**
     * Apply multiple filters sequentially and verify data changes correctly
     * @param filterTexts Array of filter texts to apply sequentially
     */
    async filterMultipleTimesAndVerify(filterTexts: string[]) {
        console.log(`\n--- Testing: Multiple sequential filters ---`);
        
        // Get initial count
        const initialNames = await this.getCoverageNames();
        const initialCount = initialNames.length;
        console.log(`Initial data count: ${initialCount}`);
        
        for (let i = 0; i < filterTexts.length; i++) {
            const filterText = filterTexts[i];
            console.log(`\nFilter ${i + 1}: "${filterText}"`);
            
            // Apply filter
            const filteredResults = await this.filterByNameAndValidate(filterText);
            console.log(`  Results: ${filteredResults.length} records found`);
            
            // Verify results contain the filter text
            if (filteredResults.length > 0) {
                expect(this.isValidFilterResult(filteredResults, filterText)).toBeTruthy();
                console.log(`  ✓ All results contain "${filterText}"`);
            } else {
                console.log(`  ⚠ No results found`);
            }
            
            // If not the last filter, clear for next iteration
            if (i < filterTexts.length - 1) {
                await this.openNameFilterPopup();
                await this.clickNameFilterClear();
                // Filter auto-applies when cleared
                await this.page.waitForTimeout(1500);
            }
        }
        
        // Finally, clear all filters
        await this.openNameFilterPopup();
        await this.clickNameFilterClear();
        // Filter auto-applies when cleared
        await this.page.waitForTimeout(2000);
        
        const finalNames = await this.getCoverageNames();
        expect(finalNames.length).toBe(initialCount);
        console.log(`\n✓ Final verification: All data restored (${finalNames.length} records)`);
    }

    async getAllCoverageData(): Promise<any> {

        await expect(this.adminEditMerchantPage.coverageTabButton).toBeVisible({ timeout: 15000 });
        //await this.coverageTabButton.click();

        await this.page.waitForTimeout(3000);

        const table = this.page.locator('app-data-synchronization table');

        if (await table.count() === 0) {
            console.log("Coverage table not found");
            return {
                value: {
                    records: [],
                    recordCount: 0
                }
            };
        }

        await expect(table).toBeVisible({ timeout: 15000 });

        const records: any[] = [];
        let pageIndex = 1;

        while (true) {

            console.log(`Reading coverage page: ${pageIndex}`);

            const headers = await table.locator('thead th').allInnerTexts();
            const rows = table.locator('tbody tr');
            const rowCount = await rows.count();

            for (let i = 0; i < rowCount; i++) {

                const cells = rows.nth(i).locator('td');
                const cellCount = await cells.count();

                const rowObj: any = {};

                for (let j = 0; j < cellCount; j++) {
                    const header = headers[j] || `Column${j}`;
                    rowObj[header] = (await cells.nth(j).innerText()).trim();
                }

                const formattedRecord = {
                    adUniqueId: rowObj["AD ID"] || "",
                    name: rowObj["Name"] || "",
                    lineOfBusiness: rowObj["Line of Business"] || "",
                    ipfsName: rowObj["IPFS Name"] || "",
                    isMapped: rowObj["IPFS Mapped"] === "YES",
                    updatedOn: rowObj["Updated On"] || "",
                    createdOn: rowObj["Created On"] || "",
                    status: rowObj["Status"] || "",
                    portalStatus: rowObj["Portal Status"] || "",
                    isLocked: rowObj["Locked"] === "YES"
                };

                records.push(formattedRecord);
            }

            // Check if next button is disabled
            const isNextDisabled = await this.paginationNext
                .getAttribute('class')
                .then(cls => cls?.includes('disabled'));

            if (isNextDisabled) {
                console.log("Reached last page of coverage");
                break;
            }

            await this.paginationNext.click();
            await this.page.waitForTimeout(2000);

            pageIndex++;
        }

        return {
            value: {
                records: records,
                currentPage: 1,
                totalPages: 1,
                pageSize: records.length,
                recordCount: records.length,
                hasPrevious: false,
                hasNext: false
            },
            isSuccess: true,
            isFailure: false,
            error: null
        };
    }

     /**
     * Click on Name column dropdown to open filter popup
     */
    async openNameFilterPopup() {
        await expect(this.coverageTable).toBeVisible({ timeout: 15000 });
        
        // Click on Name column header to open filter popup
        await this.nameColumnHeader.click();
        await this.page.waitForTimeout(1000);
        
        // Wait for popup to appear
        await expect(this.nameFilterApplyBtn).toBeVisible({ timeout: 5000 });
        console.log("✓ Name filter popup opened successfully");
    }

    /**
     * Enter text in Name filter input field
     * @param searchText Text to enter in the filter field
     */
    async enterNameFilterText(searchText: string) {
        await expect(this.nameFilterInput).toBeVisible({ timeout: 5000 });
        await this.nameFilterInput.fill(searchText);
        await this.page.waitForTimeout(500);
        console.log(`✓ Entered text in filter: "${searchText}"`);
    }

    /**
     * Click Apply button in filter popup
     */
    async clickNameFilterApply() {
        await expect(this.nameFilterApplyBtn).toBeVisible({ timeout: 5000 });
        await this.nameFilterApplyBtn.click();
        await this.page.waitForTimeout(1500);
        console.log("✓ Clicked Apply button");
    }

    /**
     * Click Clear button in filter popup
     */
    async clickNameFilterClear() {
        await expect(this.nameFilterClearBtn).toBeVisible({ timeout: 5000 });
        await this.nameFilterClearBtn.click();
        await this.page.waitForTimeout(500);
        console.log("✓ Clicked Clear button");
    }

    /**
     * Filter coverage data by name and validate results
     * @param searchText Text to search in Name field
     * @returns Array of filtered coverage names
     */
    async filterByNameAndValidate(searchText: string): Promise<string[]> {
        await this.openNameFilterPopup();
        await this.enterNameFilterText(searchText);
        await this.clickNameFilterApply();
        
        await this.page.waitForTimeout(1500);
        
        const filteredNames = await this.getCoverageNames();
        console.log(`✓ Filtered results: ${filteredNames.join(', ')}`);
        
        return filteredNames;
    }

    /**
     * Validate if all filtered names contain the search text (case-insensitive)
     * @param names Array of names to validate
     * @param searchText Text to validate against (compared case-insensitively)
     * @returns true if all names contain the search text (ignoring case)
     */
    isValidFilterResult(names: string[], searchText: string): boolean {
        if (names.length === 0) {
            return true; // Valid: no results found
        }
        
        // Case-insensitive comparison
        const searchLower = searchText.toLowerCase();
        const allValid = names.every(name => 
            name.toLowerCase().includes(searchLower)
        );
        
        if (!allValid) {
            // Log which names failed validation for debugging
            const invalid = names.filter(name => !name.toLowerCase().includes(searchLower));
            console.log(`⚠ Invalid filter results found: ${invalid.join(', ')} do not contain "${searchText}"`);
        }
        
        return allValid;
    }

    /**
     * Verify filtered results contain the filter text (case-insensitive)
     * @param filterText The text used to filter
     */
    async verifyFilteredResultsContainText(filterText: string) {
        console.log(`\n--- Verifying filter results contain "${filterText}" (case-insensitive) ---`);
        
        const names = await this.getCoverageNames();
        console.log(`Filtered names: ${names.join(', ')}`);
        
        const isValid = this.isValidFilterResult(names, filterText);
        
        if (names.length === 0) {
            console.log(`⚠ No results found for filter: "${filterText}"`);
        } else {
            if (isValid) {
                console.log(`✓ All ${names.length} results contain "${filterText}" (case-insensitive match)`);
            } else {
                console.log(`✗ Some results do NOT contain "${filterText}"`);
            }
        }
        
        expect(isValid).toBeTruthy();
    }

    /**
     * Validate if no results are displayed
     * @returns true if no results message is visible
     */
    async isNoResultsDisplayed(): Promise<boolean> {
        const noResults = this.page.locator('[class*="no-result"], [class*="no-data"], .empty-state').first();
        
        try {
            await expect(noResults).toBeVisible({ timeout: 3000 });
            return true;
        } catch {
            return false;
        }
    }

   

    /**
     * Test filter with valid data (data that exists in table)
     * @param validSearchText Valid text to search
     */
    async testValidFilter(validSearchText: string) {
        console.log(`\n--- Testing VALID filter: "${validSearchText}" ---`);
        
        const results = await this.filterByNameAndValidate(validSearchText);
        
        // Verify results are returned
        expect(results.length).toBeGreaterThan(0);
        
        // Verify all results match the search text
        expect(this.isValidFilterResult(results, validSearchText)).toBeTruthy();
        
        console.log(`✓ VALID filter test passed: Found ${results.length} matching records`);
    }

    /**
     * Test filter with invalid data (data that doesn't exist in table)
     * @param invalidSearchText Invalid text to search
     */
    async testInvalidFilter(invalidSearchText: string) {
        console.log(`\n--- Testing INVALID filter: "${invalidSearchText}" ---`);
        
        const results = await this.filterByNameAndValidate(invalidSearchText);
        
        // Verify no results are returned
        expect(results.length).toBe(0);
        
        // Verify no results message is displayed
        const noResults = await this.isNoResultsDisplayed();
        console.log(`✓ INVALID filter test passed: No results found as expected (noResultsMsg visible: ${noResults})`);
    }

    /**
     * Test filter with partial/partial match
     * @param partialSearchText Partial text that should match multiple records
     */
    async testPartialFilter(partialSearchText: string) {
        console.log(`\n--- Testing PARTIAL filter: "${partialSearchText}" ---`);
        
        const results = await this.filterByNameAndValidate(partialSearchText);
        
        // Verify results are returned
        expect(results.length).toBeGreaterThan(0);
        
        // Verify all results match the partial search text
        expect(this.isValidFilterResult(results, partialSearchText)).toBeTruthy();
        
        console.log(`✓ PARTIAL filter test passed: Found ${results.length} matching records`);
    }

    /**
     * Test filter with case-insensitive search
     * @param searchText Text to search (in different case)
     */
    async testCaseInsensitiveFilter(searchText: string) {
        console.log(`\n--- Testing CASE-INSENSITIVE filter: "${searchText}" ---`);
        
        const results = await this.filterByNameAndValidate(searchText);
        
        // Verify results match regardless of case
        const isValid = this.isValidFilterResult(results, searchText);
        expect(isValid).toBeTruthy();
        
        console.log(`✓ CASE-INSENSITIVE filter test passed: Found ${results.length} matching records`);
    }

     /**
     * Click on Name column sort icon to sort
     */
    async clickNameFilter() {
        await expect(this.coverageTable).toBeVisible({ timeout: 15000 });
        
        // Try clicking the sort icon directly
        await expect(this.nameHeaderSortIcon).toBeVisible({ timeout: 5000 });
        await this.nameHeaderSortIcon.click();
            await this.page.waitForTimeout(2000);  // Wait for sort to take effect
            await this.basePage.loaderSign.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});  // Wait for loader to disappear
        console.log("Clicked Name sort icon");
    }

    /**
     * Click on Updated On column filter icon to sort
     */
    /**
     * Click on Updated On column sort icon to sort
     */
    async clickUpdatedOnFilter() {
        await expect(this.coverageTable).toBeVisible({ timeout: 15000 });
        
        // Try clicking the sort icon directly
        await expect(this.updatedOnHeaderSortIcon).toBeVisible({ timeout: 5000 });
        await this.updatedOnHeaderSortIcon.click();
        await this.page.waitForTimeout(2000);  // Wait for sort to take effect
        await this.basePage.loaderSign.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});  // Wait for loader to disappear
        console.log("Clicked Updated On sort icon");
    }

    /**
     * Get all visible coverage names from the table using XPath
     * XPath: //tbody[@id='dataSection']/tr/td[1]
     * @returns Array of coverage names
     */
    async getCoverageNames(): Promise<string[]> {
        await expect(this.coverageTable).toBeVisible({ timeout: 15000 });
        
        // Use the exact XPath provided to get name column values
        const nameLocator = this.page.locator("//tbody[@id='dataSection']/tr/td[1]");
        const names: string[] = [];
        const nameCount = await nameLocator.count();

        for (let i = 0; i < nameCount; i++) {
            const name = (await nameLocator.nth(i).innerText()).trim();
            if (name) {  // Only add non-empty names
                names.push(name);
            }
        }

        console.log(`✓ Retrieved ${names.length} names from coverage table`);
        return names;
    }

    /**
     * Get all visible IPFS Mapped values from the current page
     * IPFS Mapped is in column 5 (td[5])
     * @returns Array of IPFS Mapped values (YES/NO)
     */
    async getIpfsMappedValuesOnCurrentPage(): Promise<string[]> {
        await expect(this.coverageTable).toBeVisible({ timeout: 15000 });
        
        // IPFS Mapped is typically in column 5 (index 4, but XPath is 1-indexed so td[5])
        const ipfsMappedLocator = this.page.locator("//tbody[@id='dataSection']/tr/td[5]");
        const values: string[] = [];
        const valueCount = await ipfsMappedLocator.count();

        for (let i = 0; i < valueCount; i++) {
            const value = (await ipfsMappedLocator.nth(i).innerText()).trim();
            if (value) {
                values.push(value);
            }
        }

        console.log(`✓ Retrieved ${values.length} IPFS Mapped values from current page`);
        return values;
    }

    /**
     * Open IPFS Mapped filter dropdown
     */
    async openIpfsMappedFilterDropdown() {
        await expect(this.coverageTable).toBeVisible({ timeout: 15000 });
        
        // Click on IPFS Mapped column header to open dropdown
        await this.ipfsMappedColumnHeader.click();
        await this.page.waitForTimeout(1000);
        
        console.log("✓ IPFS Mapped filter dropdown opened");
    }

    /**
     * Select IPFS Mapped filter option and apply
     * @param option 'YES' or 'NO'
     */
    async selectIpfsMappedFilterAndApply(option: 'YES' | 'NO') {
        await this.openIpfsMappedFilterDropdown();
        
        // Wait for options to be visible
        if (option === 'YES') {
            await expect(this.ipfsMappedYesOption).toBeVisible({ timeout: 5000 });
            await this.ipfsMappedYesOption.click();
            console.log("✓ Selected YES option");
        } else {
            await expect(this.ipfsMappedNoOption).toBeVisible({ timeout: 5000 });
            await this.ipfsMappedNoOption.click();
            console.log("✓ Selected NO option");
        }
        
        await this.page.waitForTimeout(500);
        
        // Click Apply button
        await this.ipfsMappedApplyBtn.click();
        console.log("✓ Clicked Apply button");
        
        // Wait for loader to disappear
        await this.basePage.loaderSign.waitFor({state:'hidden', timeout: 10000}).catch(() => {});
        await this.page.waitForTimeout(2000);
    }

    /**
     * Verify all IPFS Mapped values across all pagination pages match the expected value
     * @param expectedValue 'YES' or 'NO'
     */
    async verifyIpfsMappedValuesAcrossAllPages(expectedValue: 'YES' | 'NO') {
        console.log(`\n--- Verifying all IPFS Mapped values are ${expectedValue} across all pages ---`);
        
        let pageNumber = 1;
        let totalRecordsChecked = 0;
        
        while (true) {
            console.log(`\nChecking page ${pageNumber}...`);
            
            // Get IPFS Mapped values on current page
            const values = await this.getIpfsMappedValuesOnCurrentPage();
            
            if (values.length === 0) {
                console.log("No records found on this page");
                break;
            }
            
            // Verify all values match expected value
            for (let i = 0; i < values.length; i++) {
                expect(values[i]).toBe(expectedValue);
            }
            
            console.log(`✓ Page ${pageNumber}: All ${values.length} records have IPFS Mapped = ${expectedValue}`);
            totalRecordsChecked += values.length;
            
            // Check if next button is disabled
            const isNextDisabled = await this.paginationNext
                .getAttribute('class')
                .then(cls => cls?.includes('disabled'))
                .catch(() => true);

            if (isNextDisabled) {
                console.log(`\n✓ Reached last page. Total records verified: ${totalRecordsChecked}`);
                break;
            }

            // Go to next page
            await this.paginationNext.click();
            await this.page.waitForTimeout(2000);
            pageNumber++;
        }
        
        console.log(`\n✓ SUCCESS: All ${totalRecordsChecked} records across ${pageNumber} page(s) have IPFS Mapped = ${expectedValue}`);
    }

    /**
     * Get all visible Status values from the current page
     * Status is in column 8 (td[8])
     * @returns Array of Status values (Active/Inactive)
     */
    async getStatusValuesOnCurrentPage(): Promise<string[]> {
        await expect(this.coverageTable).toBeVisible({ timeout: 15000 });
        
        // Status is in column 8 (XPath is 1-indexed so td[8])
        const statusLocator = this.page.locator("//tbody[@id='dataSection']/tr/td[8]");
        const values: string[] = [];
        const valueCount = await statusLocator.count();

        for (let i = 0; i < valueCount; i++) {
            const value = (await statusLocator.nth(i).innerText()).trim();
            if (value) {
                values.push(value);
            }
        }

        console.log(`✓ Retrieved ${values.length} Status values from current page`);
        return values;
    }

    /**
     * Open Status filter dropdown
     */
    async openStatusFilterDropdown() {
        await expect(this.coverageTable).toBeVisible({ timeout: 15000 });
        
        // Click on Status column header to open dropdown
        await this.statusColumnHeader.click();
        await this.page.waitForTimeout(1000);
        
        console.log("✓ Status filter dropdown opened");
    }

    /**
     * Select Status filter option and apply
     * @param option 'Active' or 'Inactive'
     */
    async selectStatusFilterAndApply(option: 'Active' | 'Inactive') {
        await this.openStatusFilterDropdown();
        
        // Wait for options to be visible
        if (option === 'Active') {
            await expect(this.statusActiveOption).toBeVisible({ timeout: 5000 });
            await this.statusActiveOption.click();
            console.log("✓ Selected Active option");
        } else {
            await expect(this.statusInactiveOption).toBeVisible({ timeout: 5000 });
            await this.statusInactiveOption.click();
            console.log("✓ Selected Inactive option");
        }
        
        await this.page.waitForTimeout(500);
        
        // Click Apply button
        await this.statusApplyBtn.click();
        console.log("✓ Clicked Apply button");
        
        // Wait for loader to disappear
        await this.basePage.loaderSign.waitFor({state:'hidden', timeout: 10000}).catch(() => {});
        await this.page.waitForTimeout(2000);
    }

    /**
     * Verify all Status values across all pagination pages match the expected value
     * @param expectedValue 'Active' or 'Inactive'
     */
    async verifyStatusValuesAcrossAllPages(expectedValue: 'Active' | 'Inactive') {
        console.log(`\n--- Verifying all Status values are ${expectedValue} across all pages ---`);
        
        let pageNumber = 1;
        let totalRecordsChecked = 0;
        
        while (true) {
            console.log(`\nChecking page ${pageNumber}...`);
            
            // Get Status values on current page
            const values = await this.getStatusValuesOnCurrentPage();
            
            if (values.length === 0) {
                console.log("No records found on this page");
                break;
            }
            
            // Verify all values match expected value
            for (let i = 0; i < values.length; i++) {
                expect(values[i]).toBe(expectedValue);
            }
            
            console.log(`✓ Page ${pageNumber}: All ${values.length} records have Status = ${expectedValue}`);
            totalRecordsChecked += values.length;
            
            // Check if next button is disabled
            const isNextDisabled = await this.paginationNext
                .getAttribute('class')
                .then(cls => cls?.includes('disabled'))
                .catch(() => true);

            if (isNextDisabled) {
                console.log(`\n✓ Reached last page. Total records verified: ${totalRecordsChecked}`);
                break;
            }

            // Go to next page
            await this.paginationNext.click();
            await this.page.waitForTimeout(2000);
            pageNumber++;
        }
        
        console.log(`\n✓ SUCCESS: All ${totalRecordsChecked} records across ${pageNumber} page(s) have Status = ${expectedValue}`);
    }

    /**
     * Get all visible Portal Status values from the current page
     * Portal Status is in column 9 (td[9])
     * @returns Array of Portal Status values (Active/Inactive)
     */
    async getPortalStatusValuesOnCurrentPage(): Promise<string[]> {
        await expect(this.coverageTable).toBeVisible({ timeout: 15000 });
        
        // Portal Status is in column 9 (XPath is 1-indexed so td[9])
        const portalStatusLocator = this.page.locator("//tbody[@id='dataSection']/tr/td[9]");
        const values: string[] = [];
        const valueCount = await portalStatusLocator.count();

        for (let i = 0; i < valueCount; i++) {
            const value = (await portalStatusLocator.nth(i).innerText()).trim();
            if (value) {
                values.push(value);
            }
        }

        console.log(`✓ Retrieved ${values.length} Portal Status values from current page`);
        return values;
    }

    /**
     * Open Portal Status filter dropdown
     */
    async openPortalStatusFilterDropdown() {
        await expect(this.coverageTable).toBeVisible({ timeout: 15000 });
        
        // Click on Portal Status column header to open dropdown
        await this.portalStatusColumnHeader.click();
        await this.page.waitForTimeout(1000);
        
        console.log("✓ Portal Status filter dropdown opened");
    }

    /**
     * Select Portal Status filter option and apply
     * @param option 'Active' or 'Inactive'
     */
    async selectPortalStatusFilterAndApply(option: 'Active' | 'Inactive') {
        await this.openPortalStatusFilterDropdown();
        
        // Wait for options to be visible
        if (option === 'Active') {
            await expect(this.portalStatusActiveOption).toBeVisible({ timeout: 5000 });
            await this.portalStatusActiveOption.click();
            console.log("✓ Selected Active option");
        } else {
            await expect(this.portalStatusInactiveOption).toBeVisible({ timeout: 5000 });
            await this.portalStatusInactiveOption.click();
            console.log("✓ Selected Inactive option");
        }
        
        await this.page.waitForTimeout(500);
        
        // Click Apply button
        await this.portalStatusApplyBtn.click();
        console.log("✓ Clicked Apply button");
        
        // Wait for loader to disappear
        await this.basePage.loaderSign.waitFor({state:'hidden', timeout: 10000}).catch(() => {});
        await this.page.waitForTimeout(2000);
    }

    /**
     * Verify all Portal Status values across all pagination pages match the expected value
     * @param expectedValue 'Active' or 'Inactive'
     */
    async verifyPortalStatusValuesAcrossAllPages(expectedValue: 'Active' | 'Inactive') {
        console.log(`\n--- Verifying all Portal Status values are ${expectedValue} across all pages ---`);
        
        let pageNumber = 1;
        let totalRecordsChecked = 0;
        
        while (true) {
            console.log(`\nChecking page ${pageNumber}...`);
            
            // Get Portal Status values on current page
            const values = await this.getPortalStatusValuesOnCurrentPage();
            
            if (values.length === 0) {
                console.log("No records found on this page");
                break;
            }
            
            // Verify all values match expected value
            for (let i = 0; i < values.length; i++) {
                expect(values[i]).toBe(expectedValue);
            }
            
            console.log(`✓ Page ${pageNumber}: All ${values.length} records have Portal Status = ${expectedValue}`);
            totalRecordsChecked += values.length;
            
            // Check if next button is disabled
            const isNextDisabled = await this.paginationNext
                .getAttribute('class')
                .then(cls => cls?.includes('disabled'))
                .catch(() => true);

            if (isNextDisabled) {
                console.log(`\n✓ Reached last page. Total records verified: ${totalRecordsChecked}`);
                break;
            }

            // Go to next page
            await this.paginationNext.click();
            await this.page.waitForTimeout(2000);
            pageNumber++;
        }
        
        console.log(`\n✓ SUCCESS: All ${totalRecordsChecked} records across ${pageNumber} page(s) have Portal Status = ${expectedValue}`);
    }

    /**
     * Get all visible Updated On dates from the table
     * @returns Array of Updated On dates
     */
    async getUpdatedOnDates(): Promise<string[]> {
        await expect(this.coverageTable).toBeVisible({ timeout: 15000 });
        
        const dates: string[] = [];
        const rows = this.coverageTable.locator('tbody tr');
        const rowCount = await rows.count();

        for (let i = 0; i < rowCount; i++) {
            const cells = rows.nth(i).locator('td');
            const cellCount = await cells.count();
            
            // Updated On is typically the last column
            const dateCell = cells.nth(cellCount - 1);
            const date = (await dateCell.innerText()).trim();
            dates.push(date);
        }

        return dates;
    }

    /**
     * Normalize values to match UI sort behavior (ignore punctuation and spaces)
     */
    private normalizeSortValue(value: string): string {
        return value.toLowerCase().replace(/[^a-z0-9]/g, '');
    }

    /**
     * Verify if array is sorted in ascending order
     * @param arr Array to check
     * @returns true if sorted in ascending order
     */
    isAscendingOrder(arr: string[]): boolean {
        for (let i = 0; i < arr.length - 1; i++) {
            const current = this.normalizeSortValue(arr[i]);
            const next = this.normalizeSortValue(arr[i + 1]);
            if (current > next) {
                return false;
            }
        }
        return true;
    }

    /**
     * Verify if array is sorted in descending order
     * @param arr Array to check
     * @returns true if sorted in descending order
     */
    isDescendingOrder(arr: string[]): boolean {
        for (let i = 0; i < arr.length - 1; i++) {
            const current = this.normalizeSortValue(arr[i]);
            const next = this.normalizeSortValue(arr[i + 1]);
            if (current < next) {
                return false;
            }
        }
        return true;
    }

    /**
     * Verify if dates are sorted in ascending order
     * @param dates Array of date strings
     * @returns true if sorted in ascending order
     */
    isDateAscendingOrder(dates: string[]): boolean {
        for (let i = 0; i < dates.length - 1; i++) {
            const date1 = new Date(dates[i]);
            const date2 = new Date(dates[i + 1]);
            
            if (date1 > date2) {
                return false;
            }
        }
        return true;
    }

    /**
     * Verify if dates are sorted in descending order
     * @param dates Array of date strings
     * @returns true if sorted in descending order
     */
    isDateDescendingOrder(dates: string[]): boolean {
        for (let i = 0; i < dates.length - 1; i++) {
            const date1 = new Date(dates[i]);
            const date2 = new Date(dates[i + 1]);
            
            if (date1 < date2) {
                return false;
            }
        }
        return true;
    }

    /**
     * Click Name filter and validate sorting
     * @param expectedOrder 'asc' or 'desc'
     */
    async clickNameFilterAndValidate(expectedOrder: 'asc' | 'desc') {
        await this.clickNameFilter();
        await this.page.waitForTimeout(1500);
        
        const names = await this.getCoverageNames();
        console.log(`Names after filter: ${names.join(', ')}`);
        
        if (expectedOrder === 'asc') {
            expect(this.isAscendingOrder(names)).toBeTruthy();
            console.log("✓ Names are sorted in ascending order");
        } else {
            expect(this.isDescendingOrder(names)).toBeTruthy();
            console.log("✓ Names are sorted in descending order");
        }
    }

    /**
     * Click Updated On filter and validate sorting
     * @param expectedOrder 'asc' or 'desc'
     */
    async clickUpdatedOnFilterAndValidate(expectedOrder: 'asc' | 'desc') {
        await this.clickUpdatedOnFilter();
        await this.page.waitForTimeout(1500);
        
        const dates = await this.getUpdatedOnDates();
        console.log(`Dates after filter: ${dates.join(', ')}`);
        
        if (expectedOrder === 'asc') {
            expect(this.isDateAscendingOrder(dates)).toBeTruthy();
            console.log("✓ Dates are sorted in ascending order");
        } else {
            expect(this.isDateDescendingOrder(dates)).toBeTruthy();
            console.log("✓ Dates are sorted in descending order");
        }
    }

    /**
     * PAGINATION METHODS
     */

    /**
     * Click the Next pagination button
     */
    async clickNextPage() {
        await expect(this.coverageTable).toBeVisible({ timeout: 15000 });
        
        const isDisabled = await this.isNextButtonDisabled();
        if (isDisabled) {
            console.log("⚠ Next button is disabled - already on last page");
            return false;
        }
        
        await this.paginationNext.click();
        await this.page.waitForTimeout(2000);
        await this.basePage.loaderSign.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
        console.log("✓ Clicked Next page button");
        return true;
    }

    /**
     * Click the Previous pagination button
     */
    async clickPreviousPage() {
        await expect(this.coverageTable).toBeVisible({ timeout: 15000 });
        
        const isDisabled = await this.isPreviousButtonDisabled();
        if (isDisabled) {
            console.log("⚠ Previous button is disabled - already on first page");
            return false;
        }
        
        await this.paginationPrev.click();
        await this.page.waitForTimeout(2000);
        await this.basePage.loaderSign.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
        console.log("✓ Clicked Previous page button");
        return true;
    }

    /**
     * Check if Next button is disabled
     */
    async isNextButtonDisabled(): Promise<boolean> {
        const classAttr = await this.paginationNext.getAttribute('class');
        const isDisabled = await this.paginationNext.isDisabled().catch(() => false);
        return isDisabled || (classAttr?.includes('disabled') ?? false);
    }

    /**
     * Check if Previous button is disabled
     */
    async isPreviousButtonDisabled(): Promise<boolean> {
        const classAttr = await this.paginationPrev.getAttribute('class');
        const isDisabled = await this.paginationPrev.isDisabled().catch(() => false);
        return isDisabled || (classAttr?.includes('disabled') ?? false);
    }

    /**
     * Get current page number from pagination UI
     */
    async getCurrentPageNumber(): Promise<number> {
        // Try to find active/current page button
        const activePageButton = this.page.locator('button.active[data-page], .page-number.active, .current-page').first();
        
        try {
            const pageText = await activePageButton.innerText({ timeout: 3000 });
            const pageNum = parseInt(pageText.trim());
            if (!isNaN(pageNum)) {
                return pageNum;
            }
        } catch { }
        
        // Fallback: assume page 1 if cannot determine
        console.log("⚠ Could not determine current page number, assuming page 1");
        return 1;
    }

    /**
     * Get total number of pages
     */
    async getTotalPages(): Promise<number> {
        const pageButtons = this.page.locator('button[data-page]:not([data-page="next"]):not([data-page="prev"])');
        const count = await pageButtons.count();
        
        if (count > 0) {
            // Get the last page number button
            const lastPageText = await pageButtons.last().innerText();
            const totalPages = parseInt(lastPageText.trim());
            if (!isNaN(totalPages)) {
                return totalPages;
            }
        }
        
        return 1; // Default to 1 page if cannot determine
    }

    /**
     * Click on a specific page number
     * @param pageNumber Page number to navigate to
     */
    async goToPage(pageNumber: number) {
        const pageButton = this.page.locator(`button[data-page="${pageNumber}"]`);
        
        await expect(pageButton).toBeVisible({ timeout: 5000 });
        await pageButton.click();
        await this.page.waitForTimeout(2000);
        await this.basePage.loaderSign.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
        console.log(`✓ Navigated to page ${pageNumber}`);
    }

    /**
     * Change items per page dropdown value
     * @param itemsCount Number of items per page (10, 25, or 50)
     */
    async changeItemsPerPage(itemsCount: number): Promise<boolean> {
        console.log(`\n--- Changing Items Per Page to ${itemsCount} ---`);
        
        try {
            await expect(this.itemsPerPageDropdown).toBeVisible({ timeout: 5000 });
            
            // Select option by value using Playwright's selectOption
            await this.itemsPerPageDropdown.selectOption({ value: itemsCount.toString() });
            
            await this.page.waitForTimeout(2000);
            await this.basePage.loaderSign.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
            
            // Verify the selection
            const selectedValue = await this.itemsPerPageDropdown.inputValue();
            expect(selectedValue).toBe(itemsCount.toString());
            console.log(`✓ Successfully changed items per page to ${itemsCount}`);
            console.log(`✓ Verified: Selected value is ${selectedValue}`);
            
            return true;
        } catch (error) {
            console.log(`⚠ Could not change items per page: ${error}`);
            return false;
        }
    }

    /**
     * Change items per page to 25 with assertion
     * XPath: //select[@id='rowsPerPageSelect']/option[@value='25']
     */
    async changeItemsPerPageTo25() {
        console.log(`\n--- Selecting 25 Items Per Page ---`);
        await expect(this.itemsPerPageDropdown).toBeVisible({ timeout: 5000 });
        
        // Select 25 using value
        await this.itemsPerPageDropdown.selectOption({ value: '25' });
        await this.page.waitForTimeout(2000);
        await this.basePage.loaderSign.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
        
        // Assert the selection
        const selectedValue = await this.itemsPerPageDropdown.inputValue();
        expect(selectedValue).toBe('25');
        console.log(`✓ Items per page changed to 25`);
        console.log(`✓ Assertion passed: Selected value = ${selectedValue}`);
        
        // Verify items count on page
        const itemsOnPage = await this.getCurrentItemsPerPage();
        console.log(`✓ Current items displayed on page: ${itemsOnPage}`);
        expect(itemsOnPage).toBeLessThanOrEqual(25);
    }

    /**
     * Change items per page to 50 with assertion
     * XPath: //select[@id='rowsPerPageSelect']/option[@value='50']
     */
    async changeItemsPerPageTo50() {
        console.log(`\n--- Selecting 50 Items Per Page ---`);
        await expect(this.itemsPerPageDropdown).toBeVisible({ timeout: 5000 });
        
        // Select 50 using value
        await this.itemsPerPageDropdown.selectOption({ value: '50' });
        await this.page.waitForTimeout(2000);
        await this.basePage.loaderSign.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
        
        // Assert the selection
        const selectedValue = await this.itemsPerPageDropdown.inputValue();
        expect(selectedValue).toBe('50');
        console.log(`✓ Items per page changed to 50`);
        console.log(`✓ Assertion passed: Selected value = ${selectedValue}`);
        
        // Verify items count on page
        const itemsOnPage = await this.getCurrentItemsPerPage();
        console.log(`✓ Current items displayed on page: ${itemsOnPage}`);
        expect(itemsOnPage).toBeLessThanOrEqual(50);
    }

    /**
     * Get current number of items displayed per page
     */
    async getCurrentItemsPerPage(): Promise<number> {
        const rowCount = await this.coverageRows.count();
        return rowCount;
    }

    /**
     * Verify pagination controls are visible and functional
     */
    async verifyPaginationControls() {
        console.log("\n--- Verifying Pagination Controls ---");
        
        // Check if pagination buttons are visible
        const nextVisible = await this.paginationNext.isVisible();
        const prevVisible = await this.paginationPrev.isVisible();
        
        console.log(`Next button visible: ${nextVisible}`);
        console.log(`Previous button visible: ${prevVisible}`);
        
        const currentPage = await this.getCurrentPageNumber();
        const totalPages = await this.getTotalPages();
        
        console.log(`Current page: ${currentPage}`);
        console.log(`Total pages: ${totalPages}`);
        
        return {
            nextVisible,
            prevVisible,
            currentPage,
            totalPages
        };
    }

    /**
     * Navigate through all pages and collect data
     */
    async navigateAllPages() {
        console.log("\n--- Navigating Through All Pages ---");
        
        const allData: string[][] = [];
        let pageNum = 1;
        
        // Get data from first page
        let names = await this.getCoverageNames();
        allData.push(names);
        console.log(`Page ${pageNum}: ${names.length} items`);
        
        // Navigate to next pages
        while (await this.clickNextPage()) {
            pageNum++;
            names = await this.getCoverageNames();
            allData.push(names);
            console.log(`Page ${pageNum}: ${names.length} items`);
        }
        
        console.log(`\n✓ Navigated through ${pageNum} pages`);
        return allData;
    }


}
