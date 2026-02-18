import { expect, Page } from "@playwright/test";
import { commonUtils } from "@siddheshwar.anajekar/common-base";
import { BasePage } from "./BasePage";
import { AdminEditMerchantPage } from "./AdminEditMerchantPage";

export class CarrierPage extends BasePage {
    public utils: commonUtils;
    private adminEditMerchantPage: AdminEditMerchantPage;
    private basePage: BasePage;

    constructor(page: Page) {
        super(page);
        this.utils = new commonUtils(page);
        this.adminEditMerchantPage = new AdminEditMerchantPage(page);
        this.basePage = new BasePage(page);
    }

    //Table header
    tableHeaders=this.page.locator("thead");
    nameHeader= this.page.locator("//div[@id='nameDropdown']//span[@class='date']");
    nameHeaderBtn=this.page.locator("//button[@id='nameDropdownBtn']");
    nameSortIcon=this.page.locator("//div[@id='nameDropdown']//following-sibling::span[contains(@class,'sort-icon')]");
    ipfsNameHeader=this.page.locator("//button[@id='ipfsNameDropdownBtn']");
    ipfsMappedHeader=this.page.locator("//button[@id='ipfsMappedDropdown']");
    customerIDHeader=this.page.locator("//button[@id='customerIdDropdownBtn']");
    adidHeader=this.page.locator("//button[@id='adIdDropdownBtn']");
    statusHeader=this.page.locator("//button[@id='statusDropdown']");
    portalStatusHeader=this.page.locator("//button[@id='portalStatusDropdown']");

    // Carrier table
    carrierContainer = this.page.locator("app-data-synchronization");
    carrierTable = this.carrierContainer.locator("table");
    carrierRows = this.carrierContainer.locator("tbody tr");
    carrierHeaders = this.carrierContainer.locator("thead th");

    // Filter/Sort icons in table headers
    nameColumnHeader = this.carrierTable.locator("#nameDropdown span.date");
    nameFilterIcon = this.nameColumnHeader.locator(".sort-icon").first();

    updatedOnColumnHeader = this.carrierTable.locator("thead th").filter({ hasText: "Updated On" });
    updatedOnFilterIcon = this.updatedOnColumnHeader.locator("i, svg, .sort-icon, [class*='sort']").first();

    createdOnColumnHeader = this.carrierTable.locator("thead th").filter({ hasText: "Created On" });
    createdOnFilterIcon = this.createdOnColumnHeader.locator("i, svg, .sort-icon, [class*='sort']").first();

    // Name filter popup/modal
    nameFilterPopup = this.page.locator("[class*='filter'], [class*='modal'], [class*='dropdown']").filter({ hasText: "Name" });
    nameFilterInput = this.page.locator("[aria-labelledby*='nameDropdownBtn'] [class*='filter-form']");
    nameFilterApplyBtn = this.page.locator("//div[@aria-labelledby='nameDropdownBtn']/div[@class='filter-button-holder']/a[contains(text(),'Apply')]");
    nameFilterClearBtn = this.page.locator("//div[@aria-labelledby='nameDropdownBtn']/div[@class='filter-button-holder']/a[contains(text(),'Clear')]");


    //Name Column
    firstNameFromTable=this.page.locator("//tbody[@id='dataSection']/tr/td[1]");

    // AD ID filter
    adIdFilterInput = this.page.locator("//div[@aria-labelledby='adIdDropdownBtn']//input[contains(@class,'filter-form')]");
    adIdFilterApplyBtn = this.page.locator("//div[@aria-labelledby='adIdDropdownBtn']/div[@class='filter-button-holder']/a[contains(text(),'Apply')]");
    adIdFilterClearBtn = this.page.locator("//div[@aria-labelledby='adIdDropdownBtn']/div[@class='filter-button-holder']/a[contains(text(),'Clear')]");

    // Customer ID filter
    customerIdFilterInput = this.page.locator("//div[@aria-labelledby='customerIdDropdownBtn']//input[contains(@class,'filter-form')]");
    customerIdFilterApplyBtn = this.page.locator("//div[@aria-labelledby='customerIdDropdownBtn']/div[@class='filter-button-holder']/a[contains(text(),'Apply')]");
    customerIdFilterClearBtn = this.page.locator("//div[@aria-labelledby='customerIdDropdownBtn']/div[@class='filter-button-holder']/a[contains(text(),'Clear')]");

    // IPFS Name filter
    ipfsNameFilterInput = this.page.locator("//div[@aria-labelledby='ipfsNameDropdownBtn']//input[contains(@class,'filter-form')]");
    ipfsNameFilterApplyBtn = this.page.locator("//div[@aria-labelledby='ipfsNameDropdownBtn']/div[@class='filter-button-holder']/a[contains(text(),'Apply')]");
    ipfsNameFilterClearBtn = this.page.locator("//div[@aria-labelledby='ipfsNameDropdownBtn']/div[@class='filter-button-holder']/a[contains(text(),'Clear')]");

    // IPFS Mapped filter
    ipfsMappedColumnHeader = this.carrierTable.locator("#ipfsMappedDropdown .date");
    ipfsMappedYesOption = this.page.locator("//div[@aria-labelledby='ipfsMappedDropdown']//span[contains(@class,'status settled')]");
    ipfsMappedNoOption = this.page.locator("//div[@aria-labelledby='ipfsMappedDropdown']//span[contains(@class,'yellow')]");
    ipfsMappedApplyBtn = this.page.locator("//div[@aria-labelledby='ipfsMappedDropdown']//following::div/a").first();
    ipfsMappedCloseBtn = this.page.locator("//button[@id='ipfsMappedDropdown']//following::div[@class='filter-popup show']//following-sibling::span[@class='close-popup']");

    // Status filter
    statusColumnHeader = this.carrierTable.locator("#statusDropdown .date");
    statusActiveOption = this.page.locator("//div[@aria-labelledby='statusDropdown']//span[contains(text(),'Active')]");
    statusInactiveOption = this.page.locator("//div[@aria-labelledby='statusDropdown']//span[contains(text(),'Inactive')]");
    statusApplyBtn = this.page.locator("//div[@aria-labelledby='statusDropdown']//following::div/a").first();
    statusCloseBtn = this.page.locator("//button[@id='statusDropdown']//following::div[@class='filter-popup show']//following-sibling::span[@class='close-popup']");

    // Portal Status filter
    portalStatusColumnHeader = this.carrierTable.locator("#portalStatusDropdown .date");
    portalStatusActiveOption = this.page.locator("//div[@aria-labelledby='portalStatusDropdown']//span[contains(text(),'Active')]");
    portalStatusInactiveOption = this.page.locator("//div[@aria-labelledby='portalStatusDropdown']//span[contains(text(),'Inactive')]");
    portalStatusApplyBtn = this.page.locator("//div[@aria-labelledby='portalStatusDropdown']//following::div/a").first();
    portalStatusCloseBtn = this.page.locator("//button[@id='portalStatusDropdown']//following::div[@class='filter-popup show']//following-sibling::span[@class='close-popup']");

    // Filter table data
    firstRowTableData = this.page.locator("tbody tr").first();
    tableData = this.page.locator("tbody tr td");

    // No result Found locator
    noResultsFoundMsg = this.page.locator("#noResultsMsg").first();

    // Sort icon
    nameHeaderSortIcon = this.page.locator("//button[@id='nameDropdownBtnCarrier']//following-sibling::span[contains(@class,'sort-icon')]");
    updatedOnHeaderSortIcon = this.page.locator("//span[contains(text(),'Updated On')]//following::span[contains(@class,'sort-icon')]").first();
    createdOnHeaderSortIcon = this.page.locator("//span[contains(text(),'Created On')]//following::span[contains(@class,'sort-icon')]").last();

    // Pagination controls
    paginationNext = this.page.locator("button[data-page='next']");
    paginationPrev = this.page.locator("button[data-page='prev']");
    paginationButtons = this.page.locator("#pagination");
    itemsPerPageDropdown = this.page.locator("#rowsPerPageSelect");
    itemsPerPageOption10 = this.page.locator("#rowsPerPageSelect option[value='10']");
    itemsPerPageOption25 = this.page.locator("#rowsPerPageSelect option[value='25']");
    itemsPerPageOption50 = this.page.locator("#rowsPerPageSelect option[value='50']");
    currentPageNumber = this.page.locator(".current-page, .active-page, button.active");
    pageNumbers = this.page.locator(".page-number, .pagination button[data-page]");

    //Filtered results input locator
    //name
   filteredResultsInTable=this.page.locator("//tbody[@id='dataSection']/tr");

   //ADID
   firstADIDFromTable=this.page.locator("//tbody[@id='dataSection']/tr/td[2]");

   //Customer ID
   firstCustomerIDFromTable=this.page.locator("//tbody[@id='dataSection']/tr/td[3]");

   //IPFS Name
    firstIPFSNameFromTable=this.page.locator("//tbody[@id='dataSection']/tr/td[4]");

    async getAllTableHeadersText(){
        const headersCount = await this.carrierHeaders.count();
        const headersText = [];
        for(let i=0; i<headersCount; i++){
            headersText.push(await this.carrierHeaders.nth(i).innerText());
        }
        return headersText;
    }

    async enterInputInNameFilterAndValidateResults(){
        const firstName = await this.firstNameFromTable.first().innerText();
        await expect(this.nameHeaderBtn).toBeVisible({ timeout: 15000 });
        await this.nameHeaderBtn.click();
        // Wait for the dropdown popup to become visible with computed styles
        await this.page.waitForFunction(() => {
            const popup = document.querySelector("div[aria-labelledby='nameDropdownBtn']");
            if (!popup) return false;
            const style = window.getComputedStyle(popup);
            return style.display !== 'none' && style.visibility !== 'hidden';
        }, { timeout: 10000 });
        await this.nameFilterInput.fill(firstName);
        await this.nameFilterApplyBtn.click();
        await this.loaderSign.waitFor({state:'hidden', timeout: 10000}).catch(() => {});
        const allNames = await this.filteredResultsInTable.allInnerTexts();
        const isAllNamesContainInput = allNames.every(name => name.includes(firstName));
        expect(isAllNamesContainInput).toBeTruthy();
    }

    
    async clearNameFilterAndValidateResults(){
        await this.nameHeaderBtn.click();
        // Wait for the dropdown popup to become visible with computed styles
        await this.page.waitForFunction(() => {
            const popup = document.querySelector("div[aria-labelledby='nameDropdownBtn']");
            if (!popup) return false;
            const style = window.getComputedStyle(popup);
            return style.display !== 'none' && style.visibility !== 'hidden';
        }, { timeout: 10000 });
        await this.nameFilterClearBtn.click();
        await this.loaderSign.waitFor({state:'hidden', timeout: 10000}).catch(() => {});
        const allNames = await this.firstNameFromTable.allInnerTexts();
        console.log("All names after clearing filter:", allNames);
        const isAllNamesContainInput = allNames.every(name => name.length > 0);
        expect(isAllNamesContainInput).toBeTruthy();
    }


    
    async enterInputInADIDFilterAndValidateResults(){
        const firstADID = await this.firstADIDFromTable.first().innerText();
        await this.adidHeader.click();
        // Wait for the dropdown popup to become visible with computed styles
        await this.page.waitForFunction(() => {
            const popup = document.querySelector("div[aria-labelledby='adIdDropdownBtn']");
            if (!popup) return false;
            const style = window.getComputedStyle(popup);
            return style.display !== 'none' && style.visibility !== 'hidden';
        }, { timeout: 10000 });
        await this.adIdFilterInput.fill(firstADID);
        await this.adIdFilterApplyBtn.click();
        await this.loaderSign.waitFor({state:'hidden', timeout: 10000}).catch(() => {});
        const allADIDs = await this.firstADIDFromTable.allInnerTexts();
        const isAllADIDsContainInput = allADIDs.every(adId => adId.includes(firstADID));
        expect(isAllADIDsContainInput).toBeTruthy();
    }

    async clearADIDFilterAndValidateResults(){
        await this.adidHeader.click();
        // Wait for the dropdown popup to become visible with computed styles
        await this.page.waitForFunction(() => {
            const popup = document.querySelector("div[aria-labelledby='adIdDropdownBtn']");
            if (!popup) return false;
            const style = window.getComputedStyle(popup);
            return style.display !== 'none' && style.visibility !== 'hidden';
        }, { timeout: 10000 });
        await this.adIdFilterClearBtn.click();
        await this.loaderSign.waitFor({state:'hidden', timeout: 10000}).catch(() => {});
        const allADIDs = await this.firstADIDFromTable.allInnerTexts();
        const isAllADIDsContainInput = allADIDs.every(adId => adId.length > 0);
        expect(isAllADIDsContainInput).toBeTruthy();
    }

    async enterInputInCustomerIDFilterAndValidateResults(){
        const firstCustomerID = await this.firstCustomerIDFromTable.first().innerText();
        await this.customerIDHeader.click();
        // Wait for the dropdown popup to become visible with computed styles
        await this.page.waitForFunction(() => {
            const popup = document.querySelector("div[aria-labelledby='customerIdDropdownBtn']");
            if (!popup) return false;
            const style = window.getComputedStyle(popup);
            return style.display !== 'none' && style.visibility !== 'hidden';
        }, { timeout: 10000 });
        await this.customerIdFilterInput.fill(firstCustomerID);
        await this.customerIdFilterApplyBtn.click();
        await this.loaderSign.waitFor({state:'hidden', timeout: 10000}).catch(() => {});
        const allCustomerIDs = await this.firstCustomerIDFromTable.allInnerTexts();
        const isAllCustomerIDsContainInput = allCustomerIDs.every(customerId => customerId.includes(firstCustomerID));
        expect(isAllCustomerIDsContainInput).toBeTruthy();
    }

    async clearCustomerIDFilterAndValidateResults(){
        await this.customerIDHeader.click();
        // Wait for the dropdown popup to become visible with computed styles
        await this.page.waitForFunction(() => {
            const popup = document.querySelector("div[aria-labelledby='ipfsNameDropdownBtn']");
            if (!popup) return false;
            const style = window.getComputedStyle(popup);
            return style.display !== 'none' && style.visibility !== 'hidden';
        }, { timeout: 10000 });
        await this.ipfsNameFilterClearBtn.click();
        await this.loaderSign.waitFor({state:'hidden', timeout: 10000}).catch(() => {});
        const allCustomerIDs = await this.firstCustomerIDFromTable.allInnerTexts();
        const isAllCustomerIDsContainInput = allCustomerIDs.every(customerId => customerId.length > 0);
        expect(isAllCustomerIDsContainInput).toBeTruthy();
    }


    async enterInputInIPFSNameFilterAndValidateResults(){
        const firstIPFSName = await this.firstIPFSNameFromTable.first().innerText();
        await this.ipfsNameHeader.click();
        // Wait for the dropdown popup to become visible with computed styles
        await this.page.waitForFunction(() => {
            const popup = document.querySelector("div[aria-labelledby='ipfsNameDropdownBtn']");
            if (!popup) return false;
            const style = window.getComputedStyle(popup);
            return style.display !== 'none' && style.visibility !== 'hidden';
        }, { timeout: 10000 });
        await this.ipfsNameFilterInput.fill(firstIPFSName);
        await this.ipfsNameFilterApplyBtn.click();
        await this.loaderSign.waitFor({state:'hidden', timeout: 10000}).catch(() => {});
        const allIPFSNames = await this.firstIPFSNameFromTable.allInnerTexts();
        const isAllIPFSNamesContainInput = allIPFSNames.every(ipfsName => ipfsName.includes(firstIPFSName));
        expect(isAllIPFSNamesContainInput).toBeTruthy();
    }

    async clearIPFSNameFilterAndValidateResults(){
        await this.ipfsNameHeader.click();
        // Wait for the dropdown popup to become visible with computed styles
        await this.page.waitForFunction(() => {
            const popup = document.querySelector("div[aria-labelledby='ipfsNameDropdownBtn']");
            if (!popup) return false;
            const style = window.getComputedStyle(popup);
            return style.display !== 'none' && style.visibility !== 'hidden';
        }, { timeout: 10000 });
        await this.ipfsNameFilterClearBtn.click();
        await this.loaderSign.waitFor({state:'hidden', timeout: 10000}).catch(() => {});
        const allIPFSNames = await this.firstIPFSNameFromTable.allInnerTexts();
        const isAllIPFSNamesContainInput = allIPFSNames.every(ipfsName => ipfsName.length > 0);
        expect(isAllIPFSNamesContainInput).toBeTruthy();
    }


    async selectIPFSMappedFilterOptionAndValidateResults(option:string){
        await this.ipfsMappedHeader.click();
        // Wait for the dropdown popup to become visible with computed styles
        await this.page.waitForFunction(() => { 
            const popup = document.querySelector("div[aria-labelledby='ipfsMappedDropdown']");
            if (!popup) return false;
            const style = window.getComputedStyle(popup);
            return style.display !== 'none' && style.visibility !== 'hidden';
        }, { timeout: 10000 });

        if(option.toUpperCase() === "YES"){
            await this.ipfsMappedYesOption.click();
        } else if(option.toUpperCase() === "NO"){
            await this.ipfsMappedNoOption.click();
        }
        await this.ipfsMappedApplyBtn.click();
        await this.loaderSign.waitFor({state:'hidden', timeout: 10000}).catch(() => {});
        const allIPFSMappedValues = await this.page.locator("//tbody[@id='dataSection']/tr/td[5]").allInnerTexts();
        if(allIPFSMappedValues.length === 0){
            // If there are no results, validate that the "No results found" message is displayed
            await expect(this.noResultsFoundMsg).toBeVisible({ timeout: 10000 });
            return;
        }
        const isAllValuesContainInput = allIPFSMappedValues.every(value => value.includes(option));
        expect(isAllValuesContainInput).toBeTruthy();
    }

    
    async selectStatusFilterOptionAndValidateResults(option:string){
        await this.ipfsMappedHeader.click();
        // Wait for the dropdown popup to become visible with computed styles
        await this.page.waitForFunction(() => { 
            const popup = document.querySelector("div[aria-labelledby='statusDropdown']");
            if (!popup) return false;
            const style = window.getComputedStyle(popup);
            return style.display !== 'none' && style.visibility !== 'hidden';
        }, { timeout: 10000 });

        if(option.toUpperCase() === "YES"){
            await this.statusActiveOption.click();
        } else if(option.toUpperCase() === "NO"){
            await this.statusInactiveOption.click();
        }
        await this.statusApplyBtn.click();
        await this.loaderSign.waitFor({state:'hidden', timeout: 10000}).catch(() => {});
        const allStatusValues = await this.page.locator("//tbody[@id='dataSection']/tr/td[10]").allInnerTexts();
        if(allStatusValues.length === 0){
            // If there are no results, validate that the "No results found" message is displayed
            await expect(this.noResultsFoundMsg).toBeVisible({ timeout: 10000 });
            return;
        }
        const isAllValuesContainInput = allStatusValues.every(value => value.includes(option));
        expect(isAllValuesContainInput).toBeTruthy();
    }


    async selectPortalStatusFilterOptionAndValidateResults(option:string){
        await this.portalStatusHeader.click();
        // Wait for the dropdown popup to become visible with computed styles
        await this.page.waitForFunction(() => { 
            const popup = document.querySelector("div[aria-labelledby='portalStatusDropdown']");
            if (!popup) return false;
            const style = window.getComputedStyle(popup);
            return style.display !== 'none' && style.visibility !== 'hidden';
        }, { timeout: 10000 });

        if(option.toUpperCase() === "YES"){
            await this.portalStatusActiveOption.click();
        } else if(option.toUpperCase() === "NO"){
            await this.portalStatusInactiveOption.click();
        }
        await this.portalStatusApplyBtn.click();
        await this.loaderSign.waitFor({state:'hidden', timeout: 10000}).catch(() => {});
        const allStatusValues = await this.page.locator("//tbody[@id='dataSection']/tr/td[11]").allInnerTexts();
        if(allStatusValues.length === 0){
            // If there are no results, validate that the "No results found" message is displayed
            await expect(this.noResultsFoundMsg).toBeVisible({ timeout: 10000 });
            return;
        }
        const isAllValuesContainInput = allStatusValues.every(value => value.includes(option));
        expect(isAllValuesContainInput).toBeTruthy();
    }


    async enterNameInFilterAndApply(name: string) {
        await this.openNameFilterPopup();
        await expect(this.nameFilterClearBtn).toBeVisible({ timeout: 5000 });
        await this.nameFilterClearBtn.click();
        await this.openNameFilterPopup();
        await expect(this.nameFilterInput).toBeVisible({ timeout: 5000 });
        await this.nameFilterInput.fill(name);
        await expect(this.nameFilterApplyBtn).toBeVisible({ timeout: 5000 });
        await this.nameFilterApplyBtn.click();
        await this.basePage.loaderSign.waitFor({ state: "hidden", timeout: 10000 }).catch(() => {});
        await expect(this.firstRowTableData).toBeVisible({ timeout: 15000 });
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

        const inputValue = await this.nameFilterInput.inputValue();
        expect(inputValue).toBe("");
        console.log("✓ Filter cleared successfully");
    }

    async filterDataAndVerifyClearRestoresAllData(filterText: string) {
        console.log("\n--- Testing: Filter and Clear functionality ---");

        await this.openNameFilterPopup();
        await this.clickNameFilterClear();
        await this.page.waitForTimeout(2000);
        console.log("✓ Pre-cleared any existing filters");

        const initialNames = await this.getCarrierNames();
        const initialCount = initialNames.length;
        console.log(`Initial data count (before filter): ${initialCount}`);

        const filteredResults = await this.filterByNameAndValidate(filterText);
        const filteredCount = filteredResults.length;
        console.log(`\nFiltered data count (with filter): ${filteredCount}`);

        if (filteredCount > 0) {
            expect(filteredCount).toBeLessThanOrEqual(initialCount);
            console.log(`✓ Filter worked: ${initialCount} results → ${filteredCount} results`);
        } else {
            console.log(`⚠ No results found for filter: "${filterText}"`);
        }

        await this.openNameFilterPopup();
        await this.clickNameFilterClear();

        const clearedInputValue = await this.nameFilterInput.inputValue();
        expect(clearedInputValue).toBe("");
        console.log("\n✓ Filter input cleared");

        await this.page.waitForTimeout(2000);

        const restoredNames = await this.getCarrierNames();
        const restoredCount = restoredNames.length;
        console.log(`\nData count after clearing filter: ${restoredCount}`);

        expect(restoredCount).toBe(initialCount);
        console.log(`\n✓ All data restored successfully: ${restoredCount} rows displayed`);
    }

    async filterMultipleTimesAndVerify(filterTexts: string[]) {
        console.log("\n--- Testing: Multiple sequential filters ---");

        const initialNames = await this.getCarrierNames();
        const initialCount = initialNames.length;
        console.log(`Initial data count: ${initialCount}`);

        for (let i = 0; i < filterTexts.length; i++) {
            const filterText = filterTexts[i];
            console.log(`\nFilter ${i + 1}: "${filterText}"`);

            const filteredResults = await this.filterByNameAndValidate(filterText);
            console.log(`  Results: ${filteredResults.length} records found`);

            if (filteredResults.length > 0) {
                expect(this.isValidFilterResult(filteredResults, filterText)).toBeTruthy();
                console.log(`  ✓ All results contain "${filterText}"`);
            } else {
                console.log("  ⚠ No results found");
            }

            if (i < filterTexts.length - 1) {
                await this.openNameFilterPopup();
                await this.clickNameFilterClear();
                await this.page.waitForTimeout(1500);
            }
        }

        await this.openNameFilterPopup();
        await this.clickNameFilterClear();
        await this.page.waitForTimeout(2000);

        const finalNames = await this.getCarrierNames();
        expect(finalNames.length).toBe(initialCount);
        console.log(`\n✓ Final verification: All data restored (${finalNames.length} records)`);
    }

    /**
     * Click on Name column dropdown to open filter popup
     */
    async openNameFilterPopup() {
        await expect(this.carrierTable).toBeVisible({ timeout: 15000 });

        await this.nameColumnHeader.click();
        await this.page.waitForTimeout(1000);

        await expect(this.nameFilterApplyBtn).toBeVisible({ timeout: 5000 });
        console.log("✓ Name filter popup opened successfully");
    }

    async enterNameFilterText(searchText: string) {
        await expect(this.nameFilterInput).toBeVisible({ timeout: 5000 });
        await this.nameFilterInput.fill(searchText);
        await this.page.waitForTimeout(500);
        console.log(`✓ Entered text in filter: "${searchText}"`);
    }

    async clickNameFilterApply() {
        await expect(this.nameFilterApplyBtn).toBeVisible({ timeout: 5000 });
        await this.nameFilterApplyBtn.click();
        await this.page.waitForTimeout(1500);
        console.log("✓ Clicked Apply button");
    }

    async clickNameFilterClear() {
        await expect(this.nameFilterClearBtn).toBeVisible({ timeout: 5000 });
        await this.nameFilterClearBtn.click();
        await this.page.waitForTimeout(500);
        console.log("✓ Clicked Clear button");
    }

    async filterByNameAndValidate(searchText: string): Promise<string[]> {
        await this.openNameFilterPopup();
        await this.enterNameFilterText(searchText);
        await this.clickNameFilterApply();

        await this.page.waitForTimeout(1500);

        const filteredNames = await this.getCarrierNames();
        console.log(`✓ Filtered results: ${filteredNames.join(', ')}`);

        return filteredNames;
    }

    isValidFilterResult(names: string[], searchText: string): boolean {
        if (names.length === 0) {
            return true;
        }

        const searchLower = searchText.toLowerCase();
        const allValid = names.every(name => name.toLowerCase().includes(searchLower));

        if (!allValid) {
            const invalid = names.filter(name => !name.toLowerCase().includes(searchLower));
            console.log(`⚠ Invalid filter results found: ${invalid.join(', ')} do not contain "${searchText}"`);
        }

        return allValid;
    }

    async verifyFilteredResultsContainText(filterText: string) {
        console.log(`\n--- Verifying filter results contain "${filterText}" (case-insensitive) ---`);

        const names = await this.getCarrierNames();
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

    async isNoResultsDisplayed(): Promise<boolean> {
        const noResults = this.page.locator("[class*='no-result'], [class*='no-data'], .empty-state").first();

        try {
            await expect(noResults).toBeVisible({ timeout: 3000 });
            return true;
        } catch {
            return false;
        }
    }

    async getColumnIndexByHeader(headerText: string): Promise<number> {
        const headers = (await this.carrierHeaders.allInnerTexts())
            .map(header => header.trim());
        const index = headers.findIndex(header => header.toLowerCase() === headerText.toLowerCase());
        return index === -1 ? -1 : index + 1;
    }

    async getColumnValuesByHeader(headerText: string): Promise<string[]> {
        const index = await this.getColumnIndexByHeader(headerText);
        if (index === -1) {
            console.log(`⚠ Column not found: ${headerText}`);
            return [];
        }

        const columnLocator = this.page.locator(`//tbody[@id='dataSection']/tr/td[${index}]`);
        const values: string[] = [];
        const valueCount = await columnLocator.count();

        for (let i = 0; i < valueCount; i++) {
            const value = (await columnLocator.nth(i).innerText()).trim();
            if (value) {
                values.push(value);
            }
        }

        return values;
    }

    async getCarrierNames(): Promise<string[]> {
        await expect(this.carrierTable).toBeVisible({ timeout: 15000 });
        const names = await this.getColumnValuesByHeader("Name");
        console.log(`✓ Retrieved ${names.length} names from carrier table`);
        return names;
    }

    async getIpfsMappedValuesOnCurrentPage(): Promise<string[]> {
        await expect(this.carrierTable).toBeVisible({ timeout: 15000 });
        const values = await this.getColumnValuesByHeader("IPFS Mapped");
        console.log(`✓ Retrieved ${values.length} IPFS Mapped values from current page`);
        return values;
    }

    async openIpfsMappedFilterDropdown() {
        await expect(this.carrierTable).toBeVisible({ timeout: 15000 });

        await this.ipfsMappedColumnHeader.click();
        await this.page.waitForTimeout(1000);

        console.log("✓ IPFS Mapped filter dropdown opened");
    }

    async selectIpfsMappedFilterAndApply(option: "YES" | "NO") {
        await this.openIpfsMappedFilterDropdown();

        if (option === "YES") {
            await expect(this.ipfsMappedYesOption).toBeVisible({ timeout: 5000 });
            await this.ipfsMappedYesOption.click();
            console.log("✓ Selected YES option");
        } else {
            await expect(this.ipfsMappedNoOption).toBeVisible({ timeout: 5000 });
            await this.ipfsMappedNoOption.click();
            console.log("✓ Selected NO option");
        }

        await this.page.waitForTimeout(500);

        await this.ipfsMappedApplyBtn.click();
        console.log("✓ Clicked Apply button");

        await this.basePage.loaderSign.waitFor({ state: "hidden", timeout: 10000 }).catch(() => {});
        await this.page.waitForTimeout(2000);
    }

    async verifyIpfsMappedValuesAcrossAllPages(expectedValue: "YES" | "NO") {
        console.log(`\n--- Verifying all IPFS Mapped values are ${expectedValue} across all pages ---`);

        let pageNumber = 1;
        let totalRecordsChecked = 0;

        while (true) {
            console.log(`\nChecking page ${pageNumber}...`);

            const values = await this.getIpfsMappedValuesOnCurrentPage();

            if (values.length === 0) {
                console.log("No records found on this page");
                break;
            }

            for (let i = 0; i < values.length; i++) {
                expect(values[i]).toBe(expectedValue);
            }

            console.log(`✓ Page ${pageNumber}: All ${values.length} records have IPFS Mapped = ${expectedValue}`);
            totalRecordsChecked += values.length;

            const isNextDisabled = await this.paginationNext
                .getAttribute("class")
                .then(cls => cls?.includes("disabled"))
                .catch(() => true);

            if (isNextDisabled) {
                console.log(`\n✓ Reached last page. Total records verified: ${totalRecordsChecked}`);
                break;
            }

            await this.paginationNext.click();
            await this.page.waitForTimeout(2000);
            pageNumber++;
        }

        console.log(`\n✓ SUCCESS: All ${totalRecordsChecked} records across ${pageNumber} page(s) have IPFS Mapped = ${expectedValue}`);
    }

    async getStatusValuesOnCurrentPage(): Promise<string[]> {
        await expect(this.carrierTable).toBeVisible({ timeout: 15000 });
        const values = await this.getColumnValuesByHeader("Status");
        console.log(`✓ Retrieved ${values.length} Status values from current page`);
        return values;
    }

    async openStatusFilterDropdown() {
        await expect(this.carrierTable).toBeVisible({ timeout: 15000 });

        await this.statusColumnHeader.click();
        await this.page.waitForTimeout(1000);

        console.log("✓ Status filter dropdown opened");
    }

    async selectStatusFilterAndApply(option: "Active" | "Inactive") {
        await this.openStatusFilterDropdown();

        if (option === "Active") {
            await expect(this.statusActiveOption).toBeVisible({ timeout: 5000 });
            await this.statusActiveOption.click();
            console.log("✓ Selected Active option");
        } else {
            await expect(this.statusInactiveOption).toBeVisible({ timeout: 5000 });
            await this.statusInactiveOption.click();
            console.log("✓ Selected Inactive option");
        }

        await this.page.waitForTimeout(500);

        await this.statusApplyBtn.click();
        console.log("✓ Clicked Apply button");

        await this.basePage.loaderSign.waitFor({ state: "hidden", timeout: 10000 }).catch(() => {});
        await this.page.waitForTimeout(2000);
    }

    async verifyStatusValuesAcrossAllPages(expectedValue: "Active" | "Inactive") {
        console.log(`\n--- Verifying all Status values are ${expectedValue} across all pages ---`);

        let pageNumber = 1;
        let totalRecordsChecked = 0;

        while (true) {
            console.log(`\nChecking page ${pageNumber}...`);

            const values = await this.getStatusValuesOnCurrentPage();

            if (values.length === 0) {
                console.log("No records found on this page");
                break;
            }

            for (let i = 0; i < values.length; i++) {
                expect(values[i]).toBe(expectedValue);
            }

            console.log(`✓ Page ${pageNumber}: All ${values.length} records have Status = ${expectedValue}`);
            totalRecordsChecked += values.length;

            const isNextDisabled = await this.paginationNext
                .getAttribute("class")
                .then(cls => cls?.includes("disabled"))
                .catch(() => true);

            if (isNextDisabled) {
                console.log(`\n✓ Reached last page. Total records verified: ${totalRecordsChecked}`);
                break;
            }

            await this.paginationNext.click();
            await this.page.waitForTimeout(2000);
            pageNumber++;
        }

        console.log(`\n✓ SUCCESS: All ${totalRecordsChecked} records across ${pageNumber} page(s) have Status = ${expectedValue}`);
    }

    async getPortalStatusValuesOnCurrentPage(): Promise<string[]> {
        await expect(this.carrierTable).toBeVisible({ timeout: 15000 });
        const values = await this.getColumnValuesByHeader("Portal Status");
        console.log(`✓ Retrieved ${values.length} Portal Status values from current page`);
        return values;
    }

    async openPortalStatusFilterDropdown() {
        await expect(this.carrierTable).toBeVisible({ timeout: 15000 });

        await this.portalStatusColumnHeader.click();
        await this.page.waitForTimeout(1000);

        console.log("✓ Portal Status filter dropdown opened");
    }

    async selectPortalStatusFilterAndApply(option: "Active" | "Inactive") {
        await this.openPortalStatusFilterDropdown();

        if (option === "Active") {
            await expect(this.portalStatusActiveOption).toBeVisible({ timeout: 5000 });
            await this.portalStatusActiveOption.click();
            console.log("✓ Selected Active option");
        } else {
            await expect(this.portalStatusInactiveOption).toBeVisible({ timeout: 5000 });
            await this.portalStatusInactiveOption.click();
            console.log("✓ Selected Inactive option");
        }

        await this.page.waitForTimeout(500);

        await this.portalStatusApplyBtn.click();
        console.log("✓ Clicked Apply button");

        await this.basePage.loaderSign.waitFor({ state: "hidden", timeout: 10000 }).catch(() => {});
        await this.page.waitForTimeout(2000);
    }

    async verifyPortalStatusValuesAcrossAllPages(expectedValue: "Active" | "Inactive") {
        console.log(`\n--- Verifying all Portal Status values are ${expectedValue} across all pages ---`);

        let pageNumber = 1;
        let totalRecordsChecked = 0;

        while (true) {
            console.log(`\nChecking page ${pageNumber}...`);

            const values = await this.getPortalStatusValuesOnCurrentPage();

            if (values.length === 0) {
                console.log("No records found on this page");
                break;
            }

            for (let i = 0; i < values.length; i++) {
                expect(values[i]).toBe(expectedValue);
            }

            console.log(`✓ Page ${pageNumber}: All ${values.length} records have Portal Status = ${expectedValue}`);
            totalRecordsChecked += values.length;

            const isNextDisabled = await this.paginationNext
                .getAttribute("class")
                .then(cls => cls?.includes("disabled"))
                .catch(() => true);

            if (isNextDisabled) {
                console.log(`\n✓ Reached last page. Total records verified: ${totalRecordsChecked}`);
                break;
            }

            await this.paginationNext.click();
            await this.page.waitForTimeout(2000);
            pageNumber++;
        }

        console.log(`\n✓ SUCCESS: All ${totalRecordsChecked} records across ${pageNumber} page(s) have Portal Status = ${expectedValue}`);
    }

    async getUpdatedOnDates(): Promise<string[]> {
        await expect(this.carrierTable).toBeVisible({ timeout: 15000 });
        return await this.getColumnValuesByHeader("Updated On");
    }

    async getCreatedOnDates(): Promise<string[]> {
        await expect(this.carrierTable).toBeVisible({ timeout: 15000 });
        return await this.getColumnValuesByHeader("Created On");
    }

    private normalizeSortValue(value: string): string {
        return value.toLowerCase().replace(/[^a-z0-9]/g, "");
    }

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

    async clickNameFilter() {
        await expect(this.carrierTable).toBeVisible({ timeout: 15000 });

        await expect(this.nameSortIcon).toBeVisible({ timeout: 5000 });
        await this.nameSortIcon.click();
        await this.page.waitForTimeout(2000);
        await this.basePage.loaderSign.waitFor({ state: "hidden", timeout: 10000 }).catch(() => {});
        console.log("Clicked Name sort icon");
    }

    async clickUpdatedOnFilter() {
        await expect(this.carrierTable).toBeVisible({ timeout: 15000 });

        await expect(this.updatedOnHeaderSortIcon).toBeVisible({ timeout: 5000 });
        await this.updatedOnHeaderSortIcon.click();
        await this.page.waitForTimeout(2000);
        await this.basePage.loaderSign.waitFor({ state: "hidden", timeout: 10000 }).catch(() => {});
        console.log("Clicked Updated On sort icon");
    }

    async clickCreatedOnFilter() {
        await expect(this.carrierTable).toBeVisible({ timeout: 15000 });

        await expect(this.createdOnHeaderSortIcon).toBeVisible({ timeout: 5000 });
        await this.createdOnHeaderSortIcon.click();
        await this.page.waitForTimeout(2000);
        await this.basePage.loaderSign.waitFor({ state: "hidden", timeout: 10000 }).catch(() => {});
        console.log("Clicked Created On sort icon");
    }

    async clickNameFilterAndValidate(expectedOrder: "asc" | "desc") {
        await this.clickNameFilter();
        await this.page.waitForTimeout(1500);

        const names = await this.getCarrierNames();
        console.log(`Names after filter: ${names.join(', ')}`);

        if (expectedOrder === "asc") {
            expect(this.isAscendingOrder(names)).toBeTruthy();
            console.log("✓ Names are sorted in ascending order");
        } else {
            expect(this.isDescendingOrder(names)).toBeTruthy();
            console.log("✓ Names are sorted in descending order");
        }
    }

    async clickUpdatedOnFilterAndValidate(expectedOrder: "asc" | "desc") {
        await this.clickUpdatedOnFilter();
        await this.page.waitForTimeout(1500);

        const dates = await this.getUpdatedOnDates();
        console.log(`Dates after filter: ${dates.join(', ')}`);

        if (expectedOrder === "asc") {
            expect(this.isDateAscendingOrder(dates)).toBeTruthy();
            console.log("✓ Dates are sorted in ascending order");
        } else {
            expect(this.isDateDescendingOrder(dates)).toBeTruthy();
            console.log("✓ Dates are sorted in descending order");
        }
    }

    async clickCreatedOnFilterAndValidate(expectedOrder: "asc" | "desc") {
        await this.clickCreatedOnFilter();
        await this.page.waitForTimeout(1500);

        const dates = await this.getCreatedOnDates();
        console.log(`Dates after filter: ${dates.join(', ')}`);

        if (expectedOrder === "asc") {
            expect(this.isDateAscendingOrder(dates)).toBeTruthy();
            console.log("✓ Dates are sorted in ascending order");
        } else {
            expect(this.isDateDescendingOrder(dates)).toBeTruthy();
            console.log("✓ Dates are sorted in descending order");
        }
    }

    async clickNextPage() {
        await expect(this.carrierTable).toBeVisible({ timeout: 15000 });

        const isDisabled = await this.isNextButtonDisabled();
        if (isDisabled) {
            console.log("⚠ Next button is disabled - already on last page");
            return false;
        }

        await this.paginationNext.click();
        await this.page.waitForTimeout(2000);
        await this.basePage.loaderSign.waitFor({ state: "hidden", timeout: 10000 }).catch(() => {});
        console.log("✓ Clicked Next page button");
        return true;
    }

    async clickPreviousPage() {
        await expect(this.carrierTable).toBeVisible({ timeout: 15000 });

        const isDisabled = await this.isPreviousButtonDisabled();
        if (isDisabled) {
            console.log("⚠ Previous button is disabled - already on first page");
            return false;
        }

        await this.paginationPrev.click();
        await this.page.waitForTimeout(2000);
        await this.basePage.loaderSign.waitFor({ state: "hidden", timeout: 10000 }).catch(() => {});
        console.log("✓ Clicked Previous page button");
        return true;
    }

    async isNextButtonDisabled(): Promise<boolean> {
        const classAttr = await this.paginationNext.getAttribute("class");
        const isDisabled = await this.paginationNext.isDisabled().catch(() => false);
        return isDisabled || (classAttr?.includes("disabled") ?? false);
    }

    async isPreviousButtonDisabled(): Promise<boolean> {
        const classAttr = await this.paginationPrev.getAttribute("class");
        const isDisabled = await this.paginationPrev.isDisabled().catch(() => false);
        return isDisabled || (classAttr?.includes("disabled") ?? false);
    }

    async getCurrentPageNumber(): Promise<number> {
        const activePageButton = this.page.locator("button.active[data-page], .page-number.active, .current-page").first();

        try {
            const pageText = await activePageButton.innerText({ timeout: 3000 });
            const pageNum = parseInt(pageText.trim(), 10);
            if (!isNaN(pageNum)) {
                return pageNum;
            }
        } catch {
            // ignore
        }

        console.log("⚠ Could not determine current page number, assuming page 1");
        return 1;
    }

    async getTotalPages(): Promise<number> {
        const pageButtons = this.page.locator("button[data-page]:not([data-page='next']):not([data-page='prev'])");
        const count = await pageButtons.count();

        if (count > 0) {
            const lastPageText = await pageButtons.last().innerText();
            const totalPages = parseInt(lastPageText.trim(), 10);
            if (!isNaN(totalPages)) {
                return totalPages;
            }
        }

        return 1;
    }

    async verifyPaginationControls() {
        console.log("\n--- Verifying Pagination Controls ---");

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

    async changeItemsPerPageTo25() {
        console.log("\n--- Selecting 25 Items Per Page ---");
        await expect(this.itemsPerPageDropdown).toBeVisible({ timeout: 5000 });

        await this.itemsPerPageDropdown.selectOption({ value: "25" });
        await this.page.waitForTimeout(2000);
        await this.basePage.loaderSign.waitFor({ state: "hidden", timeout: 10000 }).catch(() => {});

        const selectedValue = await this.itemsPerPageDropdown.inputValue();
        expect(selectedValue).toBe("25");
        console.log("✓ Items per page changed to 25");

        const itemsOnPage = await this.getCurrentItemsPerPage();
        console.log(`✓ Current items displayed on page: ${itemsOnPage}`);
        expect(itemsOnPage).toBeLessThanOrEqual(25);
    }

    async changeItemsPerPageTo50() {
        console.log("\n--- Selecting 50 Items Per Page ---");
        await expect(this.itemsPerPageDropdown).toBeVisible({ timeout: 5000 });

        await this.itemsPerPageDropdown.selectOption({ value: "50" });
        await this.page.waitForTimeout(2000);
        await this.basePage.loaderSign.waitFor({ state: "hidden", timeout: 10000 }).catch(() => {});

        const selectedValue = await this.itemsPerPageDropdown.inputValue();
        expect(selectedValue).toBe("50");
        console.log("✓ Items per page changed to 50");

        const itemsOnPage = await this.getCurrentItemsPerPage();
        console.log(`✓ Current items displayed on page: ${itemsOnPage}`);
        expect(itemsOnPage).toBeLessThanOrEqual(50);
    }

    async getCurrentItemsPerPage(): Promise<number> {
        const rowCount = await this.carrierRows.count();
        return rowCount;
    }


    
    async getAllCarrierData(): Promise<any> {

        await expect(this.adminEditMerchantPage.carrierTabButton).toBeVisible({ timeout: 15000 });
        //await this.coverageTabButton.click();

        await this.page.waitForTimeout(3000);

        const table = this.page.locator('app-data-synchronization table');

        if (await table.count() === 0) {
            console.log("Carrier table not found");
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

            console.log(`Reading carrier page: ${pageIndex}`);

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
                    customerID:rowObj["Customer ID"] || "",
                    ipfsName: rowObj["IPFS Name"] || "",
                    ipfsMapped:rowObj["IPFS Mapped"] || "",
                    quoteEligible: rowObj["Quote Eligible"] || "YES",
                    autobookEligible: rowObj["Autobook Eligible"] || "YES",
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
                console.log("Reached last page of carrier");
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

}
