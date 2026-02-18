import { test, expect, Page } from '@playwright/test';
import { AdminPage } from '../src/pages/AdminLoginPage';
import { AdminHomePage } from '../src/pages/AdminHomePage';
import { AdminEditMerchantPage } from '../src/pages/AdminEditMerchantPage';
import { CoveragePage } from '../src/pages/CoveragePage';
import { GAPage } from '../src/pages/GAPage.spec';
import { CommonUtils } from '@anddone/coretestautomation/dist/utils/commonUtils';
import { BasePage } from '../src/pages/BasePage';

test.describe('GA Test',()=>{
    let adminPage: AdminPage;
    let adminHomePage: AdminHomePage;
    let adminEditMerchantPage: AdminEditMerchantPage;
    let coveragePage: CoveragePage;
    let GApage: GAPage;
    let basePage: BasePage;
    let commonUtils: CommonUtils;

    test.beforeEach(async({page})=>{
        test.setTimeout(120000);

        adminPage = new AdminPage(page);
        adminHomePage = new AdminHomePage(page);
        adminEditMerchantPage = new AdminEditMerchantPage(page);
        coveragePage = new CoveragePage(page);
        GApage = new GAPage(page);
        basePage = new BasePage(page);
        commonUtils = new CommonUtils();

        await page.goto('https://admin.qat.anddone.com/#/login',{
            waitUntil:'domcontentloaded',
        });

                await adminPage.login('AdminTejasUser', 'Tejasadmin@1111');

        // Wait for and verify homepage logo is displayed
        await expect(adminHomePage.logo).toBeVisible({ timeout: 10000 });
        const isLogoVisible = await adminHomePage.isLogoDisplayed();
        expect(isLogoVisible).toBeTruthy();
        console.log(" Homepage logo is displayed");
        
        // Wait for search input to be ready
        await expect(adminHomePage.searchInput).toBeVisible({ timeout: 10000 });
        await page.waitForTimeout(1000);

        // Search for merchant and navigate to edit page
        await adminHomePage.searchByDBAAndValidate('PFTADNewMerchantCN');
        await adminHomePage.openActionDropdownAndValidate();
        await adminHomePage.clickEditSubMerchantDetails();
        console.log(" Navigated to Edit Merchant Page");

        // Navigate to Data Synchronization section
        await adminEditMerchantPage.goToDataSynchronization();
        await adminEditMerchantPage.handleNoResultsAndSyncIfNeeded();
        console.log(" Navigated to Data Synchronization");

        //switch to GA tab
        await expect(adminEditMerchantPage.GATabButton).toBeVisible({ timeout: 15000 });
        await adminEditMerchantPage.GATabButton.click();
        await expect(basePage.loaderSign).toBeHidden({ timeout: 15000 });
        console.log(" Switched to GA Tab");
    });


    test('AN -27307:should open Name filter popup when clicking on Name column dropdown', async()=>{
        
        // Name Filter: Enter input in Name filter and validate results
        await GApage.enterInputInNameFilterAndValidateResults();
        await GApage.clearNameFilterAndValidateResults();

        //ADID Filter: Enter input in ADID filter and validate results
        await GApage.enterInputInADIDFilterAndValidateResults();
        await GApage.clearADIDFilterAndValidateResults();

        //Customer ID Filter: Enter input in Customer ID filter and validate results
        await GApage.enterInputInCustomerIDFilterAndValidateResults();
        await GApage.clearCustomerIDFilterAndValidateResults();

        //Close button on filter popup: Validate close button on filter popup
        // await GApage.enterInputInNameFilterAndValidateResults();
        // await GApage.validateCloseButtonOnFilterPopup();

        //IPFS Mapped Filter: Validate IPFS Mapped filter options and results
        await GApage.selectIPFSMappedFilterOptionAndValidateResults("YES");
        await GApage.selectIPFSMappedFilterOptionAndValidateResults("NO");

    });

    test('AN-27304:should validate status filter options and results in GA tab', async()=>{
        //Status Filter: Validate Status filter options and results
        await GApage.validateStatusFilterOptionsAndResults("Active");
        await GApage.validateStatusFilterOptionsAndResults("Inactive");
    });

    test('AN-27304:should validate portal status filter options and results in GA tab', async()=>{
       //Portal Status Filter: Validate Portal Status filter options and results
       await GApage.validatePortalStatusFilterOptionsAndResults("Active");
       await GApage.validatePortalStatusFilterOptionsAndResults("Inactive");
    });

    test('AN -27303:should verify pagination functionality in GA tab', async () => {
        console.log('\n=== TESTING GA TAB PAGINATION FUNCTIONALITY ===');
        
        // Get pagination info
        const paginationInfo = await GApage.verifyPaginationControls();
        console.log(`Total Pages: ${paginationInfo.totalPages}`);
        console.log(`Current Page: ${paginationInfo.currentPage}`);
        
        // Verify we start on page 1
        expect(paginationInfo.currentPage).toBe(1);
        console.log('✓ Verified starting on page 1');
        
        // Verify Previous button is disabled on page 1
        const isPrevDisabled = await GApage.isPreviousButtonDisabled();
        expect(isPrevDisabled).toBeTruthy();
        console.log('✓ Previous button is disabled on page 1');
        
        // Get page 1 data
        const page1Names = await GApage.getGANames();
        console.log(`Page 1 has ${page1Names.length} GA records`);
        expect(page1Names.length).toBeGreaterThan(0);
        
        if (paginationInfo.totalPages > 1) {
            console.log('\n--- Testing Navigation to Page 2 ---');
            
            // Navigate to page 2
            const nextClicked = await GApage.clickNextPage();
            expect(nextClicked).toBeTruthy();
            console.log('✓ Successfully clicked Next button');
            
            // Verify we're on page 2
            const currentPage = await GApage.getCurrentPageNumber();
            expect(currentPage).toBe(2);
            console.log('✓ Now on page 2');
            
            // Get page 2 data
            const page2Names = await GApage.getGANames();
            console.log(`Page 2 has ${page2Names.length} GA records`);
            expect(page2Names.length).toBeGreaterThan(0);
            
            // Verify data is different on page 2
            expect(page1Names).not.toEqual(page2Names);
            console.log('✓ Page 2 data is different from page 1');
            
            console.log('\n--- Testing Navigation Back to Page 1 ---');
            
            // Navigate back to page 1
            const prevClicked = await GApage.clickPreviousPage();
            expect(prevClicked).toBeTruthy();
            console.log('✓ Successfully clicked Previous button');
            
            // Verify we're back on page 1
            const backToPage1 = await GApage.getCurrentPageNumber();
            expect(backToPage1).toBe(1);
            console.log('✓ Back on page 1');
            
            // Verify page 1 data is same as before
            const page1NamesAgain = await GApage.getGANames();
            expect(page1NamesAgain).toEqual(page1Names);
            console.log('✓ Page 1 data matches original page 1 data');
            
            // Test navigating to last page if more than 2 pages
            if (paginationInfo.totalPages > 1) {
                console.log('\n--- Testing Navigation to Last Page ---');
                
                // Navigate to last page using Last button
                const lastPageBtn = GApage.paginationLastBtn;
                const lastBtnVisible = await lastPageBtn.isVisible().catch(() => false);
                
                if (lastBtnVisible) {
                    await lastPageBtn.scrollIntoViewIfNeeded();
                    await lastPageBtn.click({ force: true });
                    await GApage.loaderSign.waitFor({state:'hidden', timeout: 10000}).catch(() => {});
                    await GApage.page.waitForTimeout(500);
                    
                    const lastPageNumber = await GApage.getCurrentPageNumber();
                    console.log(`✓ Successfully navigated to last page (page ${lastPageNumber})`);
                    
                    // Verify Next button is disabled on last page
                    const isNextDisabled = await GApage.isNextButtonDisabled();
                    expect(isNextDisabled).toBeTruthy();
                    console.log('✓ Next button is disabled on last page');
                    
                    // Verify we have data on the last page
                    const lastPageNames = await GApage.getGANames();
                    expect(lastPageNames.length).toBeGreaterThan(0);
                    console.log(`✓ Last page has ${lastPageNames.length} GA records`);
                }
            }
            
            console.log('\n=== ALL PAGINATION TESTS PASSED ===');
        } else {
            console.log('\n⚠ Only 1 page exists - skipping multi-page navigation tests');
            
            // Verify Next button is disabled when only one page
            const isNextDisabled = await GApage.isNextButtonDisabled();
            expect(isNextDisabled).toBeTruthy();
            console.log('✓ Next button is disabled (only 1 page exists)');
        }
    });

    test('AN - 27308, AN-27309:should verify items per page functionality in GA tab', async ({ page }) => {
        console.log('\n=== TESTING ITEMS PER PAGE FUNCTIONALITY ===');
        
        // Get initial pagination info
        const initialPaginationInfo = await GApage.verifyPaginationControls();
        console.log(`\nInitial pagination: ${initialPaginationInfo.totalPages} total pages`);
        
        // Get initial items count (default is usually 10)
        const initialItemsCount = await GApage.getCurrentItemsPerPage();
        console.log(`Initial items on page: ${initialItemsCount}`);
        
        // Test changing to 25 items per page
        console.log('\n--- Testing 25 Items Per Page ---');
        await GApage.changeItemsPerPageTo25();
        await page.waitForTimeout(1000);
        
        // Verify pagination updated for 25 items
        let newPaginationInfo = await GApage.verifyPaginationControls();
        console.log(`Pagination after changing to 25: ${newPaginationInfo.totalPages} total pages`);
        
        // Verify items count
        let itemsCount = await GApage.getCurrentItemsPerPage();
        expect(itemsCount).toBeLessThanOrEqual(25);
        console.log(`✓ Items displayed: ${itemsCount} (≤ 25)`);
        
        // Verify page numbers changed (should have fewer pages with more items per page)
        if (initialPaginationInfo.totalPages > 1) {
            expect(newPaginationInfo.totalPages).toBeLessThanOrEqual(initialPaginationInfo.totalPages);
            console.log(`✓ Total pages reduced from ${initialPaginationInfo.totalPages} to ${newPaginationInfo.totalPages}`);
        }
        
        // Test changing to 50 items per page
        console.log('\n--- Testing 50 Items Per Page ---');
        await GApage.changeItemsPerPageTo50();
        await page.waitForTimeout(1000);
        
        // Verify pagination updated for 50 items
        newPaginationInfo = await GApage.verifyPaginationControls();
        console.log(`Pagination after changing to 50: ${newPaginationInfo.totalPages} total pages`);
        
        // Verify items count
        itemsCount = await GApage.getCurrentItemsPerPage();
        expect(itemsCount).toBeLessThanOrEqual(50);
        console.log(`✓ Items displayed: ${itemsCount} (≤ 50)`);
        
        // Test changing back to 10 items per page
        console.log('\n--- Testing Back to 10 Items Per Page ---');
        await GApage.changeItemsPerPageTo10();
        await page.waitForTimeout(1000);
        
        // Verify pagination updated for 10 items
        newPaginationInfo = await GApage.verifyPaginationControls();
        console.log(`Pagination after changing to 10: ${newPaginationInfo.totalPages} total pages`);
        
        // Verify items count
        itemsCount = await GApage.getCurrentItemsPerPage();
        expect(itemsCount).toBeLessThanOrEqual(10);
        console.log(`✓ Items displayed: ${itemsCount} (≤ 10)`);
        
        console.log('\n=== ITEMS PER PAGE TESTS PASSED ===');
    });

    test('AN -27306:should verify Name column sorting with ascending/descending toggle', async ({ page }) => {
        console.log('\n=== TESTING NAME COLUMN SORTING ===');
        
        // Get initial state before any sorting (check all pages)
        console.log('\n--- Initial State (All Pages) ---');
        let initialNames = await GApage.getAllGANamesAcrossPages();
        console.log(`Initial names count: ${initialNames.length}`);
        console.log(`Initial first 5 names: ${initialNames.slice(0, 5).join(', ')}`);
        console.log(`Initial last 5 names: ${initialNames.slice(-5).join(', ')}`);
        
        // Click Name sort icon first time
        console.log('\n--- First Click ---');
        await GApage.clickNameSort();
        await page.waitForTimeout(2000);
        
        // Get all names across all pages after sort
        let namesAfterFirstClick = await GApage.getAllGANamesAcrossPages();
        console.log(`After 1st click count: ${namesAfterFirstClick.length}`);
        console.log(`After 1st click first 5: ${namesAfterFirstClick.slice(0, 5).join(', ')}`);
        console.log(`After 1st click last 5: ${namesAfterFirstClick.slice(-5).join(', ')}`);
        
        const isFirstClickAscending = GApage.isAscendingOrder(namesAfterFirstClick);
        const isFirstClickDescending = GApage.isDescendingOrder(namesAfterFirstClick);
        
        console.log(`Is Ascending: ${isFirstClickAscending}`);
        console.log(`Is Descending: ${isFirstClickDescending}`);
        
        // Always show first 15 pairs to understand the pattern
        console.log('\n--- First 15 Pairs Analysis ---');
        let ascViolations = 0;
        let descViolations = 0;
        for (let i = 0; i < Math.min(15, namesAfterFirstClick.length - 1); i++) {
            const current = namesAfterFirstClick[i].toLowerCase();
            const next = namesAfterFirstClick[i + 1].toLowerCase();
            const comparison = current === next ? 'EQUAL' : (current < next ? 'LESS' : 'GREATER');
            console.log(`[${i}] "${namesAfterFirstClick[i]}" ${comparison} "${namesAfterFirstClick[i + 1]}"`);
            
            if (current > next) ascViolations++;
            if (current < next) descViolations++;
        }
        console.log(`\nAscending violations: ${ascViolations}, Descending violations: ${descViolations}`);
        console.log(`Total pairs checked: ${Math.min(15, namesAfterFirstClick.length - 1)}`);
        
        if (isFirstClickAscending) {
            console.log("✓ First click: Names sorted in ascending order");
        } else if (isFirstClickDescending) {
            console.log("✓ First click: Names sorted in descending order");
        } else {
            console.log("⚠ Warning: Names are not sorted in either order after first click");
        }
        
        // Verify data is now sorted (either ascending or descending)
        expect(isFirstClickAscending || isFirstClickDescending).toBeTruthy();
        console.log("✓ Names are sorted after first click");
        
        // Click Name sort icon second time - should toggle to opposite order
        console.log('\n--- Second Click: Toggle Order ---');
        await GApage.clickNameSort();
        await page.waitForTimeout(2000);
        
        let namesAfterSecondClick = await GApage.getAllGANamesAcrossPages();
        console.log(`After 2nd click: ${namesAfterSecondClick.slice(0, 5).join(', ')} ... ${namesAfterSecondClick.slice(-5).join(', ')}`);
        
        // Verify it toggled to opposite order
        if (isFirstClickAscending) {
            expect(GApage.isDescendingOrder(namesAfterSecondClick)).toBeTruthy();
            console.log("✓ Toggled from ascending to descending");
        } else {
            expect(GApage.isAscendingOrder(namesAfterSecondClick)).toBeTruthy();
            console.log("✓ Toggled from descending to ascending");
        }
        
        // Click Name sort icon third time - should toggle back to original sorted order
        console.log('\n--- Third Click: Toggle Back ---');
        await GApage.clickNameSort();
        await page.waitForTimeout(2000);
        
        let namesAfterThirdClick = await GApage.getAllGANamesAcrossPages();
        console.log(`After 3rd click: ${namesAfterThirdClick.slice(0, 5).join(', ')} ... ${namesAfterThirdClick.slice(-5).join(', ')}`);
        
        // Verify it toggled back
        if (isFirstClickAscending) {
            expect(GApage.isAscendingOrder(namesAfterThirdClick)).toBeTruthy();
            console.log("✓ Toggled back to ascending order");
        } else {
            expect(GApage.isDescendingOrder(namesAfterThirdClick)).toBeTruthy();
            console.log("✓ Toggled back to descending order");
        }
        
        // Verify third click result matches first click result
        expect(namesAfterThirdClick).toEqual(namesAfterFirstClick);
        console.log("✓ Third click result matches first click result");
        
        console.log('\n=== NAME COLUMN SORTING TESTS PASSED ===');
    });

    


});

test.describe('GA Test : For access setting and permission setting OFF',()=>{
    let adminPage: AdminPage;
    let adminHomePage: AdminHomePage;
    let adminEditMerchantPage: AdminEditMerchantPage;
    let coveragePage: CoveragePage;
    let GApage: GAPage;
    let basePage: BasePage;
    let commonUtils: CommonUtils;

    test.beforeEach(async({page})=>{
        test.setTimeout(120000);

        adminPage = new AdminPage(page);
        adminHomePage = new AdminHomePage(page);
        adminEditMerchantPage = new AdminEditMerchantPage(page);
        coveragePage = new CoveragePage(page);
        GApage = new GAPage(page);
        basePage = new BasePage(page);
        commonUtils = new CommonUtils();

        await page.goto('https://admin.qat.anddone.com/#/login',{
            waitUntil:'domcontentloaded',
        });

                await adminPage.login('AdminTejasUser', 'Tejasadmin@1111');

        // Wait for and verify homepage logo is displayed
        await expect(adminHomePage.logo).toBeVisible({ timeout: 10000 });
        const isLogoVisible = await adminHomePage.isLogoDisplayed();
        expect(isLogoVisible).toBeTruthy();
        console.log(" Homepage logo is displayed");
        
        // Wait for search input to be ready
        await expect(adminHomePage.searchInput).toBeVisible({ timeout: 10000 });
        await page.waitForTimeout(1000);

        // Search for merchant and navigate to edit page
        await adminHomePage.searchByDBAAndValidate('PFTADToggleOFFCN');
        await adminHomePage.openActionDropdownAndValidate();
        await adminHomePage.clickEditSubMerchantDetails();
        console.log(" Navigated to Edit Merchant Page");

        // Navigate to Data Synchronization section
        await adminEditMerchantPage.goToDataSynchronization();
        await adminEditMerchantPage.handleNoResultsAndSyncIfNeeded();
        console.log(" Navigated to Data Synchronization");

        //switch to GA tab
        await expect(adminEditMerchantPage.GATabButton).toBeVisible({ timeout: 15000 });
        await adminEditMerchantPage.GATabButton.click();
        await expect(basePage.loaderSign).toBeHidden({ timeout: 15000 });
        console.log(" Switched to GA Tab");
    });

    test('AN-27298:Verify GA tab loads with table headers', async()=>{
        await expect(GApage.verifyCarrierTabLoadswithTableHeaders()).toBeTruthy();
        console.log(" GA tab loaded with table headers");
    });

     test('AN-27299:Verify No results found message is displayed when there is no data in GA tab', async()=>{
        await expect(GApage.noResultsFoundMsg).toBeVisible({ timeout: 15000 });
        console.log(" No results found message is displayed when there is no data in GA tab");
    });

   test('Verify GA tab validation message when access and permission setting OFF', async()=>{

       await expect(GApage.noResultsFoundMsg).toBeVisible({timeout:15000});
       console.log(" No results found message is displayed when access and permission setting is OFF for GA tab");

       await GApage.clickSyncButton();
       await GApage.validateToastMessageAfterSync("Quoting feature not enabled on Merchant account");
   });

});