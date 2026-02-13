import { test, expect, Page } from '@playwright/test';
import { AdminHomePage } from './AdminHomePage';
import { AdminPage } from './AdminLoginPage';
import { AdminEditMerchantPage } from './AdminEditMerchantPage';
import { ApiUtils, LoginPayload, LoginRequest, VariableFactory } from 'anddonejs1';
import { LoginResponse } from 'anddonejs1/dist/api/response/login.response';
import { GetProgramsRequest } from '../api/request/GetProgramsRequest';
import { GetCoverageRequest } from '../api/request/GetCoverageRequests';
import { CoverageValidator } from '../validators/CoverageValidator';
import { BasePage } from "./BasePage";
import { CommonUtils, TableUtils } from '@anddone/coretestautomation/dist';

export class GAPage extends BasePage {

    public utils: CommonUtils;
    public basePage: BasePage;

    constructor(page: Page) {
        super(page);
        this.utils = new CommonUtils();
        this.basePage = new BasePage(page);
    }
    
    //Table locator for No results found
    noResultsFoundMsg=this.page.locator("//h3[@id='noResultsMsg']");

    //Table header
    tableHeaders=this.page.locator("thead");
    nameHeader= this.page.locator("//div[@id='nameDropdownGa']//span[@class='date']");
    nameHeaderBtn=this.page.locator("//button[@id='nameDropdownBtnGa']");
    nameSortIcon=this.page.locator("//div[@id='nameDropdownGa']//following-sibling::span[contains(@class,'sort-icon')]");
    ipfsMappedHeader=this.page.locator("//button[@id='ipfsMappedDropdownGa']");
    customerIDHeader=this.page.locator("//button[@id='customerIdDropdownBtnGa']");
    adidHeader=this.page.locator("//button[@id='adIdDropdownBtnGa']");
    statusHeader=this.page.locator("//button[@id='statusDropdownGa']");
    portalStatusHeader=this.page.locator("//button[@id='portalStatusDropdownGa']");
    
    //Clickable header buttons for opening filters
    ADIDHeaderBtn=this.page.locator("//button[@id='adIdDropdownBtnGa']");
    CustomerIDHeaderBtn=this.page.locator("//button[@id='customerIdDropdownBtnGa']");
    IPFSNameHeaderBtn=this.page.locator("//button[@id='ipfsNameDropdownBtnGa']");


    //Filter popup locators
    nameFilterPopup=this.page.locator("//div[@aria-labelledby='nameDropdownBtnGa']");
    adidFilterPopup=this.page.locator("//div[@aria-labelledby='adIdDropdownBtnGa']");
    customerIDFilterPopup=this.page.locator("//div[@aria-labelledby='customerIdDropdownBtnGa']");
   


   //Name filter options
   nameFilterInput=this.page.locator("//div[@aria-labelledby='nameDropdownBtnGa']//following-sibling::input[@id='inputNameGa']");
   nameFilterApplyButton=this.page.locator("//div[@aria-labelledby='nameDropdownBtnGa']//following-sibling::div/a[contains(@class,'apply')]");
   nameFilterClearButton=this.page.locator("//div[@aria-labelledby='nameDropdownBtnGa']//following-sibling::div/a[contains(@class,'clear')]");
   firstNameFromTable=this.page.locator("//tbody[@id='dataSection']/tr/td[1]");
   nameSortingIcon=this.page.locator("//button[@id='nameDropdownBtnGa']//following-sibling::span[@class='sort-icon']");

   //AD ID
   ADIDHeader=this.page.locator("//div[@id='adIdDropdownGa']//span[@class='date']");
   firstADIDFromTable=this.page.locator("//tbody[@id='dataSection']/tr/td[2]");
   ADIDFilterInput=this.page.locator("//div[@aria-labelledby='adIdDropdownBtnGa']//following-sibling::input[@id='inputAdIdGa']");
   ADIDFilterApplyButton=this.page.locator("//div[@aria-labelledby='adIdDropdownBtnGa']//following-sibling::div/a[contains(@class,'apply')]");
   ADIDFilterClearButton=this.page.locator("//div[@aria-labelledby='adIdDropdownBtnGa']//following-sibling::div/a[contains(@class,'clear')]");

    //Customer ID
   CustomerIDHeader=this.page.locator("//div[@id='customerIdDropdownGa']//span[@class='date']");
   firstCustomerIDFromTable=this.page.locator("//tbody[@id='dataSection']/tr/td[3]");
   CustomerIDFilterInput=this.page.locator("//div[@aria-labelledby='customerIdDropdownBtnGa']//following-sibling::input[@id='inputCustomerIdGa']");
   CustomerIDFilterApplyButton=this.page.locator("//div[@aria-labelledby='customerIdDropdownBtnGa']//following-sibling::div/a[contains(@class,'apply')]");
   customerIDFilterClearButton=this.page.locator("//div[@aria-labelledby='customerIdDropdownBtnGa']//following-sibling::div/a[contains(@class,'clear')]");

   //IPFS Name
   IPFSNameHeader=this.page.locator("//div[@id='ipfsNameDropdownGa']//span[@class='date']");
   firstIPFSNameFromTable=this.page.locator("//tbody[@id='dataSection']/tr/td[4]");
   IPFSNameFilterInput=this.page.locator("//div[@aria-labelledby='ipfsNameDropdownBtnGa']//following-sibling::input[@id='inputIpfsNameGa']");
   IPFSNameFilterApplyButton=this.page.locator("//div[@aria-labelledby='ipfsNameDropdownBtnGa']//following-sibling::div/a[contains(@class,'apply')]");
   IPFSNameFilterClearButton=this.page.locator("//div[@aria-labelledby='ipfsNameDropdownBtnGa']//following-sibling::div/a[contains(@class,'clear')]");

   //IPFS Mapped
    IPFSMappedHeader=this.page.locator("//button[@id='ipfsMappedDropdownGa']//span[@class='date']");
    ipfsMappedYESBtn=this.page.locator("//div[@aria-labelledby='ipfsMappedDropdownGa']//span[contains(text(),'YES')]");
    ipfsMappedNOBtn=this.page.locator("//div[@aria-labelledby='ipfsMappedDropdownGa']//span[contains(text(),'NO')]");
    ipfsMappedApplyBtn=this.page.locator("//div[@aria-labelledby='ipfsMappedDropdownGa']//div[@class='filter-button-holder']/a");

    //Status Options
    statusActiveBtn=this.page.locator("//div[@aria-labelledby='statusDropdownGa']//span[@class='status settled']");
    statusInactiveBtn=this.page.locator("//div[@aria-labelledby='statusDropdownGa']//span[@class='status failed']");
    statusApplyBtn=this.page.locator("//div[@aria-labelledby='statusDropdownGa']//a[contains(@class,'apply')]");

    //Portal Status Options
    portalStatusActiveBtn=this.page.locator("//div[@aria-labelledby='portalStatusDropdownGa']//span[@class='status settled']");
    portalStatusInactiveBtn=this.page.locator("//div[@aria-labelledby='portalStatusDropdownGa']//span[@class='status failed']");
    portalStatusApplyBtn=this.page.locator("//div[@aria-labelledby='portalStatusDropdownGa']//a[contains(@class,'apply')]"); 

   //Filtered results locator
   filteredResultsInTable=this.page.locator("//tbody[@id='dataSection']/tr");

   //Close button for filter popups
   nameFilterCloseButton=this.page.locator("//div[@id='nameDropdownGa']//following-sibling::div[contains(@class,'filter-popup')]//span[@class='close-popup']/img");

   //Sync button locator
   syncButton=this.page.locator("//button[@id='syncBtn']");

   //Toast message locator after sync is clicked
   toastMessage=this.page.locator("//div[@role='alert' and contains(@class,'toast-message')]");

   //pagination locators
   paginationNextBtn=this.page.locator("//button[@data-page='next']");
   paginationLastBtn=this.page.locator("//button[@data-page='last']");
   paginationStartBtn=this.page.locator("//button[@data-page='start']");
   paginationPrevBtn=this.page.locator("//button[@data-page='prev']");
   paginationFirstBtn=this.page.locator("//button[@data-page='first']");
   paginationContainer=this.page.locator("//div[@id='pagination']");
   paginationInfo=this.page.locator("//div[@class='pagination-info']");
   activePageNumber=this.page.locator("//button[contains(@class,'active')][@data-page]");
   
   //Items per page dropdown
   itemsPerPageDropdown=this.page.locator("//select[@id='rowsPerPageSelect']");
   itemsPerPage10Option=this.page.locator("//select[@id='rowsPerPageSelect']/option[@value='10']");
   itemsPerPage25Option=this.page.locator("//select[@id='rowsPerPageSelect']/option[@value='25']");
   itemsPerPage50Option=this.page.locator("//select[@id='rowsPerPageSelect']/option[@value='50']");


   // Coverage table
    GAContainer = this.page.locator('app-data-synchronization');
    GATable = this.GAContainer.locator('table');
    GARows = this.GAContainer.locator('tbody tr');
    GAHeaders = this.GAContainer.locator('thead th'); 

    async verifyCarrierTabLoadswithTableHeaders(){
        await expect(this.tableHeaders).toBeVisible({ timeout: 10000 });
    }
    

    async enterInputInNameFilterAndValidateResults(){
        const firstName = await this.firstNameFromTable.first().innerText();
        await expect(this.nameHeaderBtn).toBeVisible({ timeout: 15000 });
        await this.nameHeaderBtn.click();
        // Wait for the dropdown popup to become visible with computed styles
        await this.page.waitForFunction(() => {
            const popup = document.querySelector("div[aria-labelledby='nameDropdownBtnGa']");
            if (!popup) return false;
            const style = window.getComputedStyle(popup);
            return style.display !== 'none' && style.visibility !== 'hidden';
        }, { timeout: 10000 });
        await this.nameFilterInput.fill(firstName);
        await this.nameFilterApplyButton.click();
        await this.loaderSign.waitFor({state:'hidden', timeout: 10000}).catch(() => {});
        const allNames = await this.filteredResultsInTable.allInnerTexts();
        const isAllNamesContainInput = allNames.every(name => name.includes(firstName));
        expect(isAllNamesContainInput).toBeTruthy();
    }

    async clearNameFilterAndValidateResults(){
        await this.nameHeaderBtn.click();
        // Wait for the dropdown popup to become visible with computed styles
        await this.page.waitForFunction(() => {
            const popup = document.querySelector("div[aria-labelledby='nameDropdownBtnGa']");
            if (!popup) return false;
            const style = window.getComputedStyle(popup);
            return style.display !== 'none' && style.visibility !== 'hidden';
        }, { timeout: 10000 });
        await this.nameFilterClearButton.click();
        await this.loaderSign.waitFor({state:'hidden', timeout: 10000}).catch(() => {});
        const allNames = await this.firstNameFromTable.allInnerTexts();
        console.log("All names after clearing filter:", allNames);
        const isAllNamesContainInput = allNames.every(name => name.length > 0);
        expect(isAllNamesContainInput).toBeTruthy();
    }

    async validateCloseButtonOnFilterPopup(){
        await expect(this.nameFilterCloseButton).toBeVisible({timeout:15000});
        await this.nameFilterCloseButton.click();

        //verify after close button is clicked, all data is restore and no filter is applied
        await this.loaderSign.waitFor({state:'hidden', timeout: 10000}).catch(() => {});
        const allNames = await this.firstNameFromTable.allInnerTexts();
        const isAllNamesContainInput = allNames.every(name => name.length > 0);
        expect(isAllNamesContainInput).toBeTruthy();

    }

    async enterInvalidInputInNameFilterAndValidateResults(invalidInput:string){
        await this.nameHeaderBtn.click();
        // Wait for the dropdown popup to become visible with computed styles
        await this.page.waitForFunction(() => {
            const popup = document.querySelector("div[aria-labelledby='nameDropdownBtnGa']");
            if (!popup) return false;
            const style = window.getComputedStyle(popup);
            return style.display !== 'none' && style.visibility !== 'hidden';
        }, { timeout: 10000 });
        await this.nameFilterInput.fill(invalidInput);
        await this.nameFilterApplyButton.click();   
        await this.loaderSign.waitFor({state:'hidden', timeout: 10000}).catch(() => {});
        await expect(this.noResultsFoundMsg).toBeVisible({ timeout: 10000 });
    }

    async enterInputInADIDFilterAndValidateResults(){
        const firstADID = await this.firstADIDFromTable.first().innerText();
        await this.ADIDHeaderBtn.click();
        // Wait for the dropdown popup to become visible with computed styles
        await this.page.waitForFunction(() => {
            const popup = document.querySelector("div[aria-labelledby='adIdDropdownBtnGa']");
            if (!popup) return false;
            const style = window.getComputedStyle(popup);
            return style.display !== 'none' && style.visibility !== 'hidden';
        }, { timeout: 10000 });
        await this.ADIDFilterInput.fill(firstADID);
        await this.ADIDFilterApplyButton.click();
        await this.loaderSign.waitFor({state:'hidden', timeout: 10000}).catch(() => {});
        const allADIDs = await this.firstADIDFromTable.allInnerTexts();
        const isAllADIDsContainInput = allADIDs.every(adId => adId.includes(firstADID));
        expect(isAllADIDsContainInput).toBeTruthy();
    }

    async clearADIDFilterAndValidateResults(){
        await this.ADIDHeaderBtn.click();
        // Wait for the dropdown popup to become visible with computed styles
        await this.page.waitForFunction(() => {
            const popup = document.querySelector("div[aria-labelledby='adIdDropdownBtnGa']");
            if (!popup) return false;
            const style = window.getComputedStyle(popup);
            return style.display !== 'none' && style.visibility !== 'hidden';
        }, { timeout: 10000 });
        await this.ADIDFilterClearButton.click();
        await this.loaderSign.waitFor({state:'hidden', timeout: 10000}).catch(() => {});
        const allADIDs = await this.firstADIDFromTable.allInnerTexts();
        const isAllADIDsContainInput = allADIDs.every(adId => adId.length > 0);
        expect(isAllADIDsContainInput).toBeTruthy();
    }

    async enterInputInCustomerIDFilterAndValidateResults(){
        const firstCustomerID = await this.firstCustomerIDFromTable.first().innerText();
        await this.CustomerIDHeaderBtn.click();
        // Wait for the dropdown popup to become visible with computed styles
        await this.page.waitForFunction(() => {
            const popup = document.querySelector("div[aria-labelledby='customerIdDropdownBtnGa']");
            if (!popup) return false;
            const style = window.getComputedStyle(popup);
            return style.display !== 'none' && style.visibility !== 'hidden';
        }, { timeout: 10000 });
        await this.CustomerIDFilterInput.fill(firstCustomerID);
        await this.CustomerIDFilterApplyButton.click();
        await this.loaderSign.waitFor({state:'hidden', timeout: 10000}).catch(() => {});
        const allCustomerIDs = await this.firstCustomerIDFromTable.allInnerTexts();
        const isAllCustomerIDsContainInput = allCustomerIDs.every(customerId => customerId.includes(firstCustomerID));
        expect(isAllCustomerIDsContainInput).toBeTruthy();
    }

    async clearCustomerIDFilterAndValidateResults(){
        await this.CustomerIDHeaderBtn.click();
        // Wait for the dropdown popup to become visible with computed styles
        await this.page.waitForFunction(() => {
            const popup = document.querySelector("div[aria-labelledby='customerIdDropdownBtnGa']");
            if (!popup) return false;
            const style = window.getComputedStyle(popup);
            return style.display !== 'none' && style.visibility !== 'hidden';
        }, { timeout: 10000 });
        await this.customerIDFilterClearButton.click();
        await this.loaderSign.waitFor({state:'hidden', timeout: 10000}).catch(() => {});
        const allCustomerIDs = await this.firstCustomerIDFromTable.allInnerTexts();
        const isAllCustomerIDsContainInput = allCustomerIDs.every(customerId => customerId.length > 0);
        expect(isAllCustomerIDsContainInput).toBeTruthy();
    }

    async selectIPFSMappedFilterOptionAndValidateResults(option:string){
        await this.ipfsMappedHeader.click();
        // Wait for the dropdown popup to become visible with computed styles
        await this.page.waitForFunction(() => { 
            const popup = document.querySelector("div[aria-labelledby='ipfsMappedDropdownGa']");
            if (!popup) return false;
            const style = window.getComputedStyle(popup);
            return style.display !== 'none' && style.visibility !== 'hidden';
        }, { timeout: 10000 });

        if(option.toUpperCase() === "YES"){
            await this.ipfsMappedYESBtn.click();
        } else if(option.toUpperCase() === "NO"){
            await this.ipfsMappedNOBtn.click();
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

    async clickSyncButton(){
        await expect(this.syncButton).toBeVisible({ timeout: 15000 });
        await this.syncButton.click();
        await this.loaderSign.waitFor({state:'hidden', timeout: 10000}).catch(() => {});
    }

    async validateToastMessageAfterSync(expectedMessage: string){
        await expect(this.toastMessage).toBeVisible({ timeout: 10000 });
        const actualMessage = await this.toastMessage.innerText();
        expect(actualMessage.trim()).toBe(expectedMessage);
    }

    async validateStatusFilterOptionsAndResults(status:string){
        await expect(this.statusHeader).toBeVisible({ timeout: 15000 });
        await this.statusHeader.click();
    

        if(status.toUpperCase() === "ACTIVE"){
            await expect(this.statusActiveBtn).toBeVisible({ timeout: 10000 });
            await this.statusActiveBtn.click();
        } else if(status.toUpperCase() === "INACTIVE"){
            await expect(this.statusInactiveBtn).toBeVisible({ timeout: 10000 });
            await this.statusInactiveBtn.click();
        }
        await this.statusApplyBtn.click();
        await this.loaderSign.waitFor({state:'hidden', timeout: 10000}).catch(() => {});   
        const hasNextBtn = await this.paginationNextBtn.count();
        if (hasNextBtn > 0) {
            // If pagination is present, navigate through all pages and collect status values
            while (true) {
                const statusValues = await this.page.locator("//tbody[@id='dataSection']/tr/td[10]").allInnerTexts();
                const isAllValuesContainInput = statusValues.every(value => value.includes(status));
                expect(isAllValuesContainInput).toBeTruthy();

                const nextBtnClass = await this.paginationNextBtn.getAttribute('class');
                const isDisabledAttr = await this.paginationNextBtn.getAttribute('disabled');
                if ((nextBtnClass ?? '').includes('disabled') || isDisabledAttr !== null) {
                    break;
                }

                await this.paginationNextBtn.scrollIntoViewIfNeeded();
                await this.paginationNextBtn.click({ force: true });
                await this.loaderSign.waitFor({state:'hidden', timeout: 10000}).catch(() => {});
            }
        } else {
                // If no pagination, validate results on the single page
                const statusValues = await this.page.locator("//tbody[@id='dataSection']/tr/td[10]").allInnerTexts();
                const isAllValuesContainInput = statusValues.every(value => value.includes(status));
                expect(isAllValuesContainInput).toBeTruthy();
        }
    }

    async validatePortalStatusFilterOptionsAndResults(status:string)
    {
        await expect(this.portalStatusHeader).toBeVisible({ timeout: 15000 });
        await this.portalStatusHeader.click();
        
        // Wait for the dropdown popup to become visible with computed styles
        await this.page.waitForFunction(() => {
            const popup = document.querySelector("div[aria-labelledby='portalStatusDropdownGa']");
            if (!popup) return false;
            const style = window.getComputedStyle(popup);
            return style.display !== 'none' && style.visibility !== 'hidden';
        }, { timeout: 10000 });

        if(status.toUpperCase() === "ACTIVE"){
            await expect(this.portalStatusActiveBtn).toBeVisible({ timeout: 15000 });
            await this.portalStatusActiveBtn.click();
        } else if(status.toUpperCase() === "INACTIVE"){
            await expect(this.portalStatusInactiveBtn).toBeVisible({ timeout: 15000 });
            await this.portalStatusInactiveBtn.click();
        }
        await this.portalStatusApplyBtn.click();
        await this.loaderSign.waitFor({state:'hidden', timeout: 10000}).catch(() => {});   
        const hasNextBtn = await this.paginationNextBtn.count();
        if (hasNextBtn > 0) {
            // If pagination is present, navigate through all pages and collect status values
            while (true) {
                const statusValues = await this.page.locator("//tbody[@id='dataSection']/tr/td[11]").allInnerTexts();
                const isAllValuesContainInput = statusValues.every(value => value.includes(status));
                expect(isAllValuesContainInput).toBeTruthy();

                const nextBtnClass = await this.paginationNextBtn.getAttribute('class');
                const isDisabledAttr = await this.paginationNextBtn.getAttribute('disabled');
                if ((nextBtnClass ?? '').includes('disabled') || isDisabledAttr !== null) {
                    break;
                }

                await this.paginationNextBtn.scrollIntoViewIfNeeded();
                await this.paginationNextBtn.click({ force: true });
                await this.loaderSign.waitFor({state:'hidden', timeout: 10000}).catch(() => {});
            }
        } else {
                // If no pagination, validate results on the single page
                const statusValues = await this.page.locator("//tbody[@id='dataSection']/tr/td[11]").allInnerTexts();
                const isAllValuesContainInput = statusValues.every(value => value.includes(status));
                expect(isAllValuesContainInput).toBeTruthy();
        }
    }

    /**
     * Get list of GA names from current page
     */
    async getGANames(): Promise<string[]> {
        await this.page.waitForTimeout(500);
        const names = await this.firstNameFromTable.allInnerTexts();
        return names.filter(name => name.trim().length > 0);
    }

    /**
     * Get current page number from pagination
     */
    async getCurrentPageNumber(): Promise<number> {
        try {
            const pageText = await this.activePageNumber.innerText();
            return parseInt(pageText.trim(), 10) || 1;
        } catch {
            return 1;
        }
    }

    /**
     * Get total number of pages
     */
    async getTotalPages(): Promise<number> {
        try {
            const allPageBtns = await this.page.locator("//button[@data-page]").allInnerTexts();
            const pageNumbers = allPageBtns
                .filter(text => !isNaN(parseInt(text)))
                .map(text => parseInt(text));
            return pageNumbers.length > 0 ? Math.max(...pageNumbers) : 1;
        } catch {
            return 1;
        }
    }

    /**
     * Click next page button
     */
    async clickNextPage(): Promise<boolean> {
        try {
            const isDisabled = await this.isNextButtonDisabled();
            if (isDisabled) {
                console.log('Next button is disabled, cannot navigate');
                return false;
            }
            await this.paginationNextBtn.scrollIntoViewIfNeeded();
            await this.paginationNextBtn.click({ force: true });
            await this.loaderSign.waitFor({state:'hidden', timeout: 10000}).catch(() => {});
            await this.page.waitForTimeout(500);
            return true;
        } catch (error) {
            console.log(`Error clicking next page: ${error}`);
            return false;
        }
    }

    /**
     * Click previous page button
     */
    async clickPreviousPage(): Promise<boolean> {
        try {
            const isDisabled = await this.isPreviousButtonDisabled();
            if (isDisabled) {
                console.log('Previous button is disabled, cannot navigate');
                return false;
            }
            await this.paginationPrevBtn.scrollIntoViewIfNeeded();
            await this.paginationPrevBtn.click({ force: true });
            await this.loaderSign.waitFor({state:'hidden', timeout: 10000}).catch(() => {});
            await this.page.waitForTimeout(500);
            return true;
        } catch (error) {
            console.log(`Error clicking previous page: ${error}`);
            return false;
        }
    }

    /**
     * Check if Next button is disabled
     */
    async isNextButtonDisabled(): Promise<boolean> {
        try {
            const classAttr = await this.paginationNextBtn.getAttribute('class');
            const disabledAttr = await this.paginationNextBtn.getAttribute('disabled');
            const hasDisabledClass = classAttr?.includes('disabled') ?? false;
            const hasDisabledAttr = disabledAttr !== null;
            return hasDisabledClass || hasDisabledAttr;
        } catch (error) {
            return false;
        }
    }

    /**
     * Check if Previous button is disabled
     */
    async isPreviousButtonDisabled(): Promise<boolean> {
        try {
            const classAttr = await this.paginationPrevBtn.getAttribute('class');
            const disabledAttr = await this.paginationPrevBtn.getAttribute('disabled');
            const hasDisabledClass = classAttr?.includes('disabled') ?? false;
            const hasDisabledAttr = disabledAttr !== null;
            return hasDisabledClass || hasDisabledAttr;
        } catch (error) {
            return false;
        }
    }

    /**
     * Verify pagination controls are visible and return info
     */
    async verifyPaginationControls(): Promise<{ totalPages: number, currentPage: number }> {
        const count = await this.paginationContainer.count();
        if (count === 0) {
            return { totalPages: 1, currentPage: 1 };
        }
        
        await expect(this.paginationContainer).toBeVisible({ timeout: 10000 });
        const totalPages = await this.getTotalPages();
        const currentPage = await this.getCurrentPageNumber();
        
        console.log(`Pagination: Page ${currentPage} of ${totalPages}`);
        return { totalPages, currentPage };
    }

    /**
     * Navigate through all pages and collect all GA names
     */
    async getAllGANamesAcrossPages(): Promise<string[]> {
        const allNames: string[] = [];
        const paginationInfo = await this.verifyPaginationControls();
        
        for (let i = 1; i <= paginationInfo.totalPages; i++) {
            const currentPageNames = await this.getGANames();
            allNames.push(...currentPageNames);
            console.log(`Page ${i}: Collected ${currentPageNames.length} names`);
            
            if (i < paginationInfo.totalPages) {
                const clicked = await this.clickNextPage();
                if (!clicked) break;
            }
        }
        
        return allNames;
    }

    /**
     * Get current number of items displayed per page
     */
    async getCurrentItemsPerPage(): Promise<number> {
        const rowCount = await this.GARows.count();
        return rowCount;
    }

    /**
     * Change items per page to 10
     */
    async changeItemsPerPageTo10() {
        console.log(`\n--- Selecting 10 Items Per Page ---`);
        await expect(this.itemsPerPageDropdown).toBeVisible({ timeout: 5000 });
        
        await this.itemsPerPageDropdown.selectOption({ value: '10' });
        await this.page.waitForTimeout(2000);
        await this.loaderSign.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
        
        const selectedValue = await this.itemsPerPageDropdown.inputValue();
        expect(selectedValue).toBe('10');
        console.log(`✓ Items per page changed to 10`);
        
        const itemsOnPage = await this.getCurrentItemsPerPage();
        console.log(`✓ Current items displayed: ${itemsOnPage}`);
        expect(itemsOnPage).toBeLessThanOrEqual(10);
    }

    /**
     * Change items per page to 25
     */
    async changeItemsPerPageTo25() {
        console.log(`\n--- Selecting 25 Items Per Page ---`);
        await expect(this.itemsPerPageDropdown).toBeVisible({ timeout: 5000 });
        
        await this.itemsPerPageDropdown.selectOption({ value: '25' });
        await this.page.waitForTimeout(2000);
        await this.loaderSign.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
        
        const selectedValue = await this.itemsPerPageDropdown.inputValue();
        expect(selectedValue).toBe('25');
        console.log(`✓ Items per page changed to 25`);
        
        const itemsOnPage = await this.getCurrentItemsPerPage();
        console.log(`✓ Current items displayed: ${itemsOnPage}`);
        expect(itemsOnPage).toBeLessThanOrEqual(25);
    }

    /**
     * Change items per page to 50
     */
    async changeItemsPerPageTo50() {
        console.log(`\n--- Selecting 50 Items Per Page ---`);
        await expect(this.itemsPerPageDropdown).toBeVisible({ timeout: 5000 });
        
        await this.itemsPerPageDropdown.selectOption({ value: '50' });
        await this.page.waitForTimeout(2000);
        await this.loaderSign.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
        
        const selectedValue = await this.itemsPerPageDropdown.inputValue();
        expect(selectedValue).toBe('50');
        console.log(`✓ Items per page changed to 50`);
        
        const itemsOnPage = await this.getCurrentItemsPerPage();
        console.log(`✓ Current items displayed: ${itemsOnPage}`);
        expect(itemsOnPage).toBeLessThanOrEqual(50);
    }

    async clickNameSort()
    {
     await expect(this.nameHeaderBtn).toBeVisible({ timeout: 15000 });
    await this.nameHeaderBtn.click();
    // Wait for the dropdown popup to become visible with computed styles
    await this.page.waitForFunction(() => {

    const popup = document.querySelector("div[aria-labelledby='nameDropdownBtnGa']");
    if (!popup) return false;
    const style = window.getComputedStyle(popup);
    return style.display !== 'none' && style.visibility !== 'hidden';
    }, { timeout: 10000 });
    await this.nameSortingIcon.click();

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
   
}



