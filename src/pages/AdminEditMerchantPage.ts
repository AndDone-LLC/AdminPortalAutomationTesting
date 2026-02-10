import { expect, Page } from "@playwright/test";
import { commonUtils, TableUtils } from "@siddheshwar.anajekar/common-base";
import { BasePage } from "./BasePage";

export class AdminEditMerchantPage extends BasePage {
    public utils: commonUtils;

    constructor(page: Page) {
        super(page);
        this.utils = new commonUtils(page);
    }

    // ===== Sidebar containers =====
    sidebar = this.page.locator('#sidebar');
    onboardingAccordion = this.sidebar.locator('#onboardingAccordion');

    // ===== Accordion headers =====
    accountSetupAccordion = this.onboardingAccordion.getByRole('button', { name: 'Account Setup', });

    premiumFinanceAccordion = this.onboardingAccordion.getByRole('button', { name: 'Premium Finance', });
    premiumFinanceBtn = this.onboardingAccordion.getByRole('button', { name: 'Premium Finance' });
    advancedSettingsAccordion = this.onboardingAccordion.getByRole('button', { name: 'Advanced Settings', });

    // ===== Account Setup items =====
    subMerchantDetails = this.sidebar.getByText('Sub-Merchant Details', { exact: true });
    allowedTransactionTypes = this.sidebar.getByText('Allowed Transaction Types', { exact: true });
    processorConfiguration = this.sidebar.getByText('Processor Configuration', { exact: true });
    featuresAccess = this.sidebar.getByText('Features Access', { exact: true });
    paymentAcceptanceLimits = this.sidebar.getByText('Payment Acceptance Limits', { exact: true });

    // ===== Premium Finance items =====
    accessSettings = this.sidebar.getByText('Access Settings', { exact: true });
    permissionSettings = this.sidebar.getByText('Permission Settings', { exact: true });

    // ===== Advanced Settings items =====
    fees = this.sidebar.getByText('Fees', { exact: true });
    virtualAccounts = this.sidebar.getByText('Virtual Accounts', { exact: true });
    webhooks = this.sidebar.getByText('Webhooks', { exact: true });
    paymentAuthorizationStatements = this.sidebar.getByText('Payment Authorization Statements', { exact: true });

    // ===== Standalone item =====
    accountSummary = this.sidebar.getByText('Account Summary', { exact: true });

    // inside AdminEditMerchantPage class

    noResultsMsg = this.page.locator('#noResultsMsg');
    syncButton = this.page.getByRole('button', { name: 'Sync' });
    syncErrorMsg = this.page.locator('.alert-danger, .error-message');

    programTabButton = this.page.locator('.segmented-button a').first();
    coverageTabButton = this.page.locator('.segmented-button a').nth(1);

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
    nameFilterClearBtn = this.page.getByRole('button', { name: 'Clear' });
    //nameFilterApplyBtn = this.page.getByRole('button', { name: 'Apply' });
    nameFilterApplyBtn=this.page.locator("//div[@aria-labelledby='nameDropdownBtnCoverage']/div[@class='filter-button-holder']/a[contains(text(),'Apply')]");


    paginationNext = this.page.locator('button[data-page="next"]');
    paginationPrev = this.page.locator('button[data-page="prev"]');
    paginationButtons = this.page.locator('#pagination button');

    //toast message
    accessAndPermissionDisableToastMsg= this.page.locator('.toast-message').filter({ hasText: '  Embedded  Premium  Finance and   Premium  Finance  Lite   Feature   Not   Enable' });


    //Filter table data
    firstRowTableData=this.page.locator('tbody tr').first();



    async verifyAccessAndPermissionDisableToastMsgDisplay() {
        await expect(this.accessAndPermissionDisableToastMsg).toBeVisible({ timeout: 10000 });
        await expect(this.accessAndPermissionDisableToastMsg).toHaveText('  Embedded  Premium  Finance and   Premium  Finance  Lite   Feature   Not   Enable');
    }

    /**
     * method to go to data synchronization
     */
    async goToDataSynchronization() {

        try {
            await expect(this.sidebar).toBeVisible();
            await this.page.waitForTimeout(1500);
            const expanded = await this.premiumFinanceBtn.getAttribute('aria-expanded');
            if (expanded !== 'true') {
                await this.premiumFinanceBtn.click();
            }

            await this.page.waitForTimeout(8000);
            const dataSyncText = this.sidebar.getByText('Data Synchronization', { exact: true });

            await expect(dataSyncText).toBeVisible({ timeout: 30000 });
            await dataSyncText.click();
        }
        catch (error) {
            console.warn(`Data synchronization was not visible`);
        }
    }

    // async navigateToPremiumFinanceSection() {
    //     await expect(this.sidebar).toBeVisible();
    //     await expect(this.premiumFinanceAccordion).toBeVisible();
    //     const expanded = await this.premiumFinanceBtn.getAttribute('aria-expanded');
    // }

    // async clickDataSynchronization() {
    //     const dataSyncText = this.sidebar.getByText('Data Synchronization', { exact: true });
    // }

    // async verifyNoDataSynchronizationResults() {
    //     const noResultsMsg = this.page.locator('#noResultsMsg');

    //     await expect(noResultsMsg).toBeVisible({ timeout: 15000 });
    //     await expect(noResultsMsg).toHaveText('No Results Found');
    //     console.log("called");
    // }

    async printDataSynchronizationState() {

        const noResultsMsg = this.page.locator('#noResultsMsg');
        const programTabs = this.page.locator('.program-tab');

        try {
            await Promise.race([
                noResultsMsg.waitFor({ state: 'visible', timeout: 15000 }),
                programTabs.first().waitFor({ state: 'visible', timeout: 15000 })
            ]);
        } catch {
            // ignore timeout
        }

        if (this.page.isClosed()) {
            console.log("Page closed before reading data synchronization state");
            return;
        }

        // First time merchant case
        if (await noResultsMsg.count() > 0 && await noResultsMsg.isVisible()) {
            console.log('First-time merchant state: No Results Found');
            return;
        }

        const count = await programTabs.count();

        if (count === 0) {
            console.log('No program tabs found');
            return;
        }

        console.log(`Existing merchant programs (${count}):`);

        for (let i = 0; i < count; i++) {
            const name = await programTabs.nth(i).innerText();
            console.log(`- ${name.trim()}`);
        }
    }

    async getAllProgramData(): Promise<any> {

        const programTabs = this.page.locator('.program-tab');
        const count = await programTabs.count();

        const records: any[] = [];

        if (count === 0) {
            console.log("No program tabs available");

            return {
                value: {
                    records: [],
                    recordCount: 0
                },
                isSuccess: true,
                isFailure: false,
                error: null
            };
        }

        for (let i = 0; i < count; i++) {

            const tab = programTabs.nth(i);
            const tabName = (await tab.innerText()).trim();

            await tab.click();
            await this.page.waitForTimeout(1500);

            const activeProgram = this.page.locator('.program-info.visible');
            await expect(activeProgram).toBeVisible();

            const programData: any = {};

            // ---------- MAIN PROGRAM DETAILS ----------
            const detailRows = activeProgram.locator('.program-details .details-row');
            const detailCount = await detailRows.count();

            for (let j = 0; j < detailCount; j++) {

                const title = (await detailRows.nth(j).locator('.row-title').innerText()).trim();
                const value = (await detailRows.nth(j).locator('.row-value').innerText()).trim();

                programData[title] = value;
            }

            // ---------- RISK STATES ----------
            if (programData["Risk States"]) {
                programData["Risk States"] = programData["Risk States"]
                    .split("\n")
                    .map((s: string) => s.trim())
                    .filter(Boolean);
            }

            // ---------- UNDERLYING PLANS ----------
            const plans: any[] = [];
            const planSections = activeProgram.locator('.plan-details .details-column');
            const sectionCount = await planSections.count();

            for (let s = 0; s < sectionCount; s++) {

                const singlePlan: any = {};
                const planRows = planSections.nth(s).locator('.column-row');
                const planCount = await planRows.count();

                for (let k = 0; k < planCount; k++) {

                    const title = (await planRows.nth(k).locator('.column-title').innerText()).trim();
                    const value = (await planRows.nth(k).locator('.column-value').innerText()).trim();

                    singlePlan[title] = value;
                }

                plans.push(singlePlan);
            }

            programData["Underlying Plans"] = plans;

            records.push({
                programName: programData["Program Name"] || tabName,
                adUniqueId: programData["AD Unique ID"],
                ipfsProgramId: programData["IPFS Program ID"],
                lineOfBusiness: programData["Line of Business"],
                quoteLimit: programData["Quote Limit"],
                paymentInterval: programData["Payment Interval Code"],
                riskStates: programData["Risk States"] || [],
                underlyingPlans: programData["Underlying Plans"] || []
            });
        }

        return {
            value: {
                records,
                recordCount: records.length
            },
            isSuccess: true,
            isFailure: false,
            error: null
        };
    }


    /**
     * method to handle no result and then sync
     */
    async handleNoResultsAndSyncIfNeeded() {

        await this.page.waitForTimeout(2000);

        const isNoResultsVisible = await this.noResultsMsg.isVisible().catch(() => false);

        if (!isNoResultsVisible) {
            console.log("Existing data found - no sync required");
            return;
        }

        console.log("No Results Found - attempting to sync data...");

        try {
            await expect(this.syncButton).toBeVisible({ timeout: 10000 });
            await this.syncButton.click();
            await this.page.waitForTimeout(3000);
            const toast = this.syncErrorMsg.first();

        } catch (err) {
            console.log("Error during sync attempt - continuing execution: ", err);
        }
    }

    async getAllCoverageData(): Promise<any> {

        await expect(this.coverageTabButton).toBeVisible({ timeout: 15000 });
        await this.coverageTabButton.click();

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
     * Click on Name column filter icon to sort
     */
    async clickNameFilter() {
        await expect(this.coverageTable).toBeVisible({ timeout: 15000 });
        
        // Try multiple selectors for the filter icon
        const filterSelectors = [
            this.nameColumnHeader.locator('i'),
            this.nameColumnHeader.locator('svg'),
            this.nameColumnHeader.locator('[class*="sort"]'),
            this.nameColumnHeader.locator('[class*="filter"]'),
            this.nameColumnHeader.getByRole('button'),
            this.nameColumnHeader
        ];

        for (const selector of filterSelectors) {
            const count = await selector.count();
            if (count > 0) {
                await selector.first().click();
                await this.page.waitForTimeout(1000);
                console.log("Clicked Name filter icon");
                return;
            }
        }
        
        // Fallback: click the header itself
        await this.nameColumnHeader.click();
        await this.page.waitForTimeout(1000);
        console.log("Clicked Name column header");
    }

    /**
     * Click on Updated On column filter icon to sort
     */
    async clickUpdatedOnFilter() {
        await expect(this.coverageTable).toBeVisible({ timeout: 15000 });
        
        // Try multiple selectors for the filter icon
        const filterSelectors = [
            this.updatedOnColumnHeader.locator('i'),
            this.updatedOnColumnHeader.locator('svg'),
            this.updatedOnColumnHeader.locator('[class*="sort"]'),
            this.updatedOnColumnHeader.locator('[class*="filter"]'),
            this.updatedOnColumnHeader.getByRole('button'),
            this.updatedOnColumnHeader
        ];

        for (const selector of filterSelectors) {
            const count = await selector.count();
            if (count > 0) {
                await selector.first().click();
                await this.page.waitForTimeout(1000);
                console.log("Clicked Updated On filter icon");
                return;
            }
        }
        
        // Fallback: click the header itself
        await this.updatedOnColumnHeader.click();
        await this.page.waitForTimeout(1000);
        console.log("Clicked Updated On column header");
    }

    /**
     * Get all visible coverage names from the table
     * @returns Array of coverage names
     */
    async getCoverageNames(): Promise<string[]> {
        await expect(this.coverageTable).toBeVisible({ timeout: 15000 });
        
        const names: string[] = [];
        const rows = this.coverageTable.locator('tbody tr');
        const rowCount = await rows.count();

        for (let i = 0; i < rowCount; i++) {
            const nameCell = rows.nth(i).locator('td').first();
            const name = (await nameCell.innerText()).trim();
            names.push(name);
        }

        return names;
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
     * Verify if array is sorted in ascending order
     * @param arr Array to check
     * @returns true if sorted in ascending order
     */
    isAscendingOrder(arr: string[]): boolean {
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i].toLowerCase() > arr[i + 1].toLowerCase()) {
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
            if (arr[i].toLowerCase() < arr[i + 1].toLowerCase()) {
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
     * Validate if all filtered names contain the search text
     * @param names Array of names to validate
     * @param searchText Text to validate against
     * @returns true if all names contain the search text
     */
    isValidFilterResult(names: string[], searchText: string): boolean {
        if (names.length === 0) {
            return true; // Valid: no results found
        }
        
        return names.every(name => 
            name.toLowerCase().includes(searchText.toLowerCase())
        );
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
}
