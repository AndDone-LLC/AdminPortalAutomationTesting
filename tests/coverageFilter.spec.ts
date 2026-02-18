import { test, expect } from '@playwright/test';
import { AdminPage } from '../src/pages/AdminLoginPage';
import { AdminHomePage } from '../src/pages/AdminHomePage';
import { AdminEditMerchantPage } from '../src/pages/AdminEditMerchantPage';
import { CoveragePage } from '../src/pages/CoveragePage';


test.describe('Coverage Name Filter Popup', () => {
    let adminPage: AdminPage;
    let adminHomePage: AdminHomePage;
    let adminEditMerchantPage: AdminEditMerchantPage;
    let coveragePage: CoveragePage;

    test.beforeEach(async ({ page }) => {
        test.setTimeout(120000);
        
        adminPage = new AdminPage(page);
        adminHomePage = new AdminHomePage(page);
        adminEditMerchantPage = new AdminEditMerchantPage(page);
        coveragePage = new CoveragePage(page);
        // Login to admin portal
        await page.goto('https://admin.qat.anddone.com/#/login', {
            waitUntil: 'domcontentloaded',
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
        await adminHomePage.searchByDBAAndValidate('tejasmerchant3');
        await adminHomePage.openActionDropdownAndValidate();
        await adminHomePage.clickEditSubMerchantDetails();
        console.log(" Navigated to Edit Merchant Page");

        // Navigate to Data Synchronization section
        await adminEditMerchantPage.goToDataSynchronization();
        await adminEditMerchantPage.handleNoResultsAndSyncIfNeeded();
        console.log(" Navigated to Data Synchronization");

        // Switch to Coverage tab
        await expect(adminEditMerchantPage.coverageTabButton).toBeVisible({ timeout: 15000 });
        await adminEditMerchantPage.coverageTabButton.click();
        await page.waitForTimeout(3000);
        console.log(" Switched to Coverage tab");

        // Verify coverage table is visible
        await expect(coveragePage.coverageTable).toBeVisible({ timeout: 15000 });
        console.log(" Coverage table is visible");
    });

    test('AN -27116 should open Name filter popup when clicking on Name column dropdown', async ({ page }) => {
        // Get initial data to know what to search for
        const initialNames = await coveragePage.getCoverageNames();
        console.log(`Initial names in table: ${initialNames.join(', ')}`);
        
        // Open Name filter popup
        await coveragePage.enterNameInFilterAndApply('TRUCK');
        
        //should filter with VALID data - partial match (LIABILITY)
        await coveragePage.enterNameInFilterAndApply('LIABILITY');

        //should filter with INVALID data (XYZABC)
        await coveragePage.enterInvalidNameInFilterAndApply('XYZABC');

        //should clear filter and restore all data - TRUCK
        await coveragePage.filterDataAndVerifyClearRestoresAllData('TRUCK');


        // Don't enter any text, just click Apply and verify all data is shown
        await coveragePage.enterNameInFilterAndApply('');   
        
        //should handle special characters in filter - space
        await coveragePage.enterNameInFilterAndApply('TRUCK LIABILITY');
    });

    test('should filter by IPFS Mapped YES and verify all pages show only YES records', async ({ page }) => {
        console.log('\n=== Testing IPFS Mapped Filter: YES ===');
        
        // Apply IPFS Mapped = YES filter
        await coveragePage.selectIpfsMappedFilterAndApply('YES');
        
        // Verify all records across all pagination pages have IPFS Mapped = YES
        await coveragePage.verifyIpfsMappedValuesAcrossAllPages('YES');

        await coveragePage.clickToCloseIpfsFilterPopup();
       
        // Apply IPFS Mapped = NO filter
        await coveragePage.selectIpfsMappedFilterAndApply('NO');
        
        // Verify all records across all pagination pages have IPFS Mapped = NO
        await coveragePage.verifyIpfsMappedValuesAcrossAllPages('NO');

    });


    test('should filter by Status Active and verify all pages show only Active records', async ({ page }) => {
        console.log('\n=== Testing Status Filter: Active ===');
        
        // Apply Status = Active filter
        await coveragePage.selectStatusFilterAndApply('Active');
        
        // Verify all records across all pagination pages have Status = Active
        await coveragePage.verifyStatusValuesAcrossAllPages('Active');

         // Apply Status = Inactive filter
        await coveragePage.selectStatusFilterAndApply('Inactive');
        
        // Verify all records across all pagination pages have Status = Inactive
        await coveragePage.verifyStatusValuesAcrossAllPages('Inactive');

    });

    // test('AN-XXXX should filter by Portal Status Active and verify all pages show only Active records', async ({ page }) => {
    //     console.log('\n=== Testing Portal Status Filter: Active ===');
        
    //     // Apply Portal Status = Active filter
    //     await coveragePage.selectPortalStatusFilterAndApply('Active');
        
    //     // Verify all records across all pagination pages have Portal Status = Active
    //     await coveragePage.verifyPortalStatusValuesAcrossAllPages('Active');

    //     await coveragePage.clickToClosePortalStatusFilterPopup();

    //      // Apply Portal Status = Inactive filter
    //     await coveragePage.selectPortalStatusFilterAndApply('Inactive');
        
    //     // Verify all records across all pagination pages have Portal Status = Inactive
    //     await coveragePage.verifyPortalStatusValuesAcrossAllPages('Inactive');
    // });

    // test('AN-XXXX should filter by Portal Status Inactive and verify all pages show only Inactive records', async ({ page }) => {
    //     console.log('\n=== Testing Portal Status Filter: Inactive ===');
        
    //     // Apply Portal Status = Inactive filter
    //     await coveragePage.selectPortalStatusFilterAndApply('Inactive');
        
    //     // Verify all records across all pagination pages have Portal Status = Inactive
    //     await coveragePage.verifyPortalStatusValuesAcrossAllPages('Inactive');
    // });

    


    // test('should restore all data after clearing filter - TRUCK', async ({ page }) => {
    //     await coveragePage.filterDataAndVerifyClearRestoresAllData('TRUCK');
    // });

    // test('should restore all data after clearing filter - LIABILITY', async ({ page }) => {
    //     await coveragePage.filterDataAndVerifyClearRestoresAllData('LIABILITY');
    // });

    // test('should restore all data after clearing filter - AIRCRAFT', async ({ page }) => {
    //     await coveragePage.filterDataAndVerifyClearRestoresAllData('AIRCRAFT');
    // });

    // test('should verify data consistency with multiple sequential filters', async ({ page }) => {
    //     await coveragePage.filterMultipleTimesAndVerify(['TRUCK', 'LIABILITY', 'AIRCRAFT']);
    // });

    // test('should verify each filter works independently and can be cleared', async ({ page }) => {
    //     const filterTexts = ['TRUCK', 'GENERAL', 'FIRE', 'ABUSIVE'];
        
    //     for (const filterText of filterTexts) {
    //         console.log(`\n--- Testing filter: "${filterText}" ---`);
    //         await coveragePage.filterDataAndVerifyClearRestoresAllData(filterText);
            
    //         // Small wait between tests
    //         await page.waitForTimeout(500);
    //     }
    // });

    test('AN 27118 should sort columns with ascending/descending toggle', async ({ page }) => {
        console.log('\n=== TESTING COLUMN SORTING WITH TOGGLE ===');
        
        // TEST 1: Name column sort toggle
        console.log('\n--- NAME COLUMN SORT TOGGLE ---');
        // Click Name filter icon first time - ascending
        await coveragePage.clickNameFilter();
        await page.waitForTimeout(2000);
        let names = await coveragePage.getCoverageNames();
        console.log(`After 1st click (Name): ${names.join(', ')}`);
        expect(coveragePage.isAscendingOrder(names)).toBeTruthy();
        console.log("✓ Names sorted in ascending order");
        
        // Click Name filter icon second time - descending
        await coveragePage.clickNameFilter();
        await page.waitForTimeout(2000);
        names = await coveragePage.getCoverageNames();
        console.log(`After 2nd click (Name): ${names.join(', ')}`);
        expect(coveragePage.isDescendingOrder(names)).toBeTruthy();
        console.log("✓ Names sorted in descending order");
        
        // Click Name filter icon third time - ascending again (toggle)
        await coveragePage.clickNameFilter();
        await page.waitForTimeout(2000);
        names = await coveragePage.getCoverageNames();
        console.log(`After 3rd click (Name): ${names.join(', ')}`);
        expect(coveragePage.isAscendingOrder(names)).toBeTruthy();
        console.log("✓ Names toggled back to ascending order");

        // TEST 2: Updated On column sort toggle
        console.log('\n--- UPDATED ON COLUMN SORT TOGGLE ---');
        // Click Updated On filter icon first time - ascending
        await coveragePage.clickUpdatedOnFilter();
        await page.waitForTimeout(2000);
        let dates = await coveragePage.getUpdatedOnDates();
        console.log(`After 1st click (Updated On): ${dates.join(', ')}`);
        expect(coveragePage.isDateAscendingOrder(dates)).toBeTruthy();
        console.log("✓ Dates sorted in ascending order");
        
        // Click Updated On filter icon second time - descending
        await coveragePage.clickUpdatedOnFilter();
        await page.waitForTimeout(2000);
        dates = await coveragePage.getUpdatedOnDates();
        console.log(`After 2nd click (Updated On): ${dates.join(', ')}`);
        expect(coveragePage.isDateDescendingOrder(dates)).toBeTruthy();
        console.log("✓ Dates sorted in descending order");
        
        // Click Updated On filter icon third time - ascending again (toggle)
        await coveragePage.clickUpdatedOnFilter();
        await page.waitForTimeout(2000);
        dates = await coveragePage.getUpdatedOnDates();
        console.log(`After 3rd click (Updated On): ${dates.join(', ')}`);
        expect(coveragePage.isDateAscendingOrder(dates)).toBeTruthy();
        console.log("✓ Dates toggled back to ascending order");
        
        console.log('\n=== ALL SORTING TESTS PASSED ===');
    });

    test('AN 27119 should verify pagination controls and navigation', async ({ page }) => {
        console.log('\n=== TESTING PAGINATION CONTROLS ===');
        
        // Verify pagination controls are visible
        const paginationInfo = await coveragePage.verifyPaginationControls();
        
        console.log('\n--- Testing Previous Button (should be disabled on page 1) ---');
        const isPrevDisabled = await coveragePage.isPreviousButtonDisabled();
        expect(isPrevDisabled).toBeTruthy();
        console.log('✓ Previous button is disabled on first page');
        
        // Get initial page data
        const page1Names = await coveragePage.getCoverageNames();
        const page1ItemCount = page1Names.length;
        console.log(`\nPage 1 has ${page1ItemCount} items`);
        console.log(`Page 1 names: ${page1Names.join(', ')}`);
        
        // Check if there are multiple pages
        if (paginationInfo.totalPages > 1) {
            console.log('\n--- Testing Next Button Navigation ---');
            const clickedNext = await coveragePage.clickNextPage();
            expect(clickedNext).toBeTruthy();
            
            // Verify we're now on page 2
            const currentPage = await coveragePage.getCurrentPageNumber();
            expect(currentPage).toBe(2);
            console.log('✓ Successfully navigated to page 2');
            
            // Get page 2 data
            const page2Names = await coveragePage.getCoverageNames();
            console.log(`Page 2 has ${page2Names.length} items`);
            console.log(`Page 2 names: ${page2Names.join(', ')}`);
            
            // Verify different data on different pages
            expect(page1Names).not.toEqual(page2Names);
            console.log('✓ Page 2 data is different from page 1');
            
            console.log('\n--- Testing Previous Button Navigation ---');
            const clickedPrev = await coveragePage.clickPreviousPage();
            expect(clickedPrev).toBeTruthy();
            
            // Verify we're back on page 1
            const backToPage1 = await coveragePage.getCurrentPageNumber();
            expect(backToPage1).toBe(1);
            console.log('✓ Successfully navigated back to page 1');
            
            // Verify same data as before
            const page1NamesAgain = await coveragePage.getCoverageNames();
            expect(page1NamesAgain).toEqual(page1Names);
            console.log('✓ Page 1 data matches original page 1 data');
        } else {
            console.log('\n⚠ Total pages reported as 1 - verifying by checking Next behavior');

            // If Next moves to a new page, treat as multi-page pagination
            const currentPageBefore = await coveragePage.getCurrentPageNumber();
            const clickedNext = await coveragePage.clickNextPage();
            const currentPageAfter = await coveragePage.getCurrentPageNumber();

            if (clickedNext && currentPageAfter !== currentPageBefore) {
                console.log('⚠ Next moved to another page - pagination exists despite totalPages=1');
                expect(currentPageAfter).toBeGreaterThan(currentPageBefore);
            } else {
                expect(currentPageAfter).toBe(currentPageBefore);
                console.log('✓ Next button does not change the page when only one page exists');
            }
        }
        
        console.log('\n=== PAGINATION TESTS PASSED ===');
    });

   
    test('AN 27120 should verify items per page functionality', async({page})=>{
         // Get initial pagination info
        const paginationInfo = await coveragePage.verifyPaginationControls();
        console.log(`\nInitial pagination: ${paginationInfo.totalPages} total pages`);

        // Test changing to 25 items per page
        console.log('\n--- Testing 25 Items Per Page ---');
        await coveragePage.changeItemsPerPageTo25();
        await page.waitForTimeout(2000);
        
        // Verify pagination updated for 25 items
        let newPaginationInfo = await coveragePage.verifyPaginationControls();
        console.log(`Pagination after changing to 25: ${newPaginationInfo.totalPages} total pages`);
        
        // Verify items count
        let itemsCount = await coveragePage.getCurrentItemsPerPage();
        expect(itemsCount).toBeLessThanOrEqual(25);
        console.log(`✓ Items displayed: ${itemsCount} (≤ 25)`);

        // Test changing to 50 items per page
        console.log('\n--- Testing 50 Items Per Page ---');
        await coveragePage.changeItemsPerPageTo50();
        await page.waitForTimeout(2000);
        
        // Verify pagination updated for 50 items
        newPaginationInfo = await coveragePage.verifyPaginationControls();
        console.log(`Pagination after changing to 50: ${newPaginationInfo.totalPages} total pages`);
        
        // Verify items count
        itemsCount = await coveragePage.getCurrentItemsPerPage();
        expect(itemsCount).toBeLessThanOrEqual(50);
        console.log(`✓ Items displayed: ${itemsCount} (≤ 50)`);

        console.log('\n=== ITEMS PER PAGE TEST COMPLETED ===');
    });

    test('AN 27121 should verify that filter and pagination work together correctly', async ({ page }) => {
        console.log('\n=== TESTING FILTER AND PAGINATION TOGETHER ===');
        // Apply a filter that results in multiple pages
        await coveragePage.enterNameInFilterAndApply('A');
        const filteredNames = await coveragePage.getCoverageNames();
        console.log(`Filtered names (with 'A'): ${filteredNames.join(', ')}`);
        const paginationInfo = await coveragePage.verifyPaginationControls();
        console.log(`Pagination after filtering: ${paginationInfo.totalPages} total pages`);
        if (paginationInfo.totalPages > 1) {
            const clickedNext = await coveragePage.clickNextPage();
            expect(clickedNext).toBeTruthy();   
            const currentPage = await coveragePage.getCurrentPageNumber();
            expect(currentPage).toBe(2);
            console.log('✓ Successfully navigated to page 2 with filter applied');
        }
        console.log('\n=== FILTER AND PAGINATION TOGETHER TEST COMPLETED ===');
    });


});

test.describe('Coverage Empty State', () => {
    let adminPage: AdminPage;
    let adminHomePage: AdminHomePage;
    let adminEditMerchantPage: AdminEditMerchantPage;
    let coveragePage: CoveragePage;

    const emptyStateUsername = 'AdminSachinG';
    const emptyStatePassword = 'Automation@1234';

    test.beforeEach(async ({ page }) => {
        test.setTimeout(120000);

        adminPage = new AdminPage(page);
        adminHomePage = new AdminHomePage(page);
        adminEditMerchantPage = new AdminEditMerchantPage(page);
        coveragePage = new CoveragePage(page);

        await page.goto('https://admin.qat.anddone.com/#/login', {
            waitUntil: 'domcontentloaded',
        });

        await adminPage.login(emptyStateUsername, emptyStatePassword);

        await expect(adminHomePage.logo).toBeVisible({ timeout: 10000 });
        const isLogoVisible = await adminHomePage.isLogoDisplayed();
        expect(isLogoVisible).toBeTruthy();
        console.log(' Homepage logo is displayed');

        await expect(adminHomePage.searchInput).toBeVisible({ timeout: 10000 });
        await page.waitForTimeout(1000);

        await adminHomePage.searchByDBAAndValidate('PFTADToggleOFFCN');
        await adminHomePage.openActionDropdownAndValidate();
        await adminHomePage.clickEditSubMerchantDetails();
        console.log(' Navigated to Edit Merchant Page');

        await adminEditMerchantPage.goToDataSynchronization();
        await adminEditMerchantPage.handleNoResultsAndSyncIfNeeded();
        console.log(' Navigated to Data Synchronization');

        await expect(adminEditMerchantPage.coverageTabButton).toBeVisible({ timeout: 15000 });
        await adminEditMerchantPage.coverageTabButton.click();
        await page.waitForTimeout(3000);
        console.log(' Switched to Coverage tab');

        await expect(coveragePage.coverageTable).toBeVisible({ timeout: 15000 });
        console.log(' Coverage table is visible');
    });

    test('AN 26426 should show empty state when no coverage records exist', async ({ page }) => {
        const headers = (await coveragePage.coverageHeaders.allInnerTexts())
            .map(header => header.trim())
            .filter(header => header.length > 0);

        const expectedHeaders = [
            'Name',
            'Line of Business',
            'AD ID',
            'IPFS Name',
            'IPFS Mapped',
            'Updated On',
            'Created On'
        ];

        for (const header of expectedHeaders) {
            expect(headers).toContain(header);
        }

        await expect(coveragePage.noResultsFoundMsg).toBeVisible({ timeout: 10000 });
        const names = await coveragePage.getCoverageNames();
        expect(names.length).toBe(0);
        console.log('✓ Empty state verified: No Results Found and no data rows');
    });

    test('Should verify validation message for access setting & permission setting off', async({ page })=>{
        await adminEditMerchantPage.goToDataSynchronization();
        await adminEditMerchantPage.handleNoResultsAndSyncIfNeeded();
        await adminEditMerchantPage.verifyAccessAndPermissionDisableToastMsgDisplay();
    }); 
});
