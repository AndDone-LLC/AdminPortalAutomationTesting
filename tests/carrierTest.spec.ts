import { test, expect } from "@playwright/test";
import { AdminPage } from "../src/pages/AdminLoginPage";
import { AdminHomePage } from "../src/pages/AdminHomePage";
import { AdminEditMerchantPage } from "../src/pages/AdminEditMerchantPage";
import { CarrierPage } from "../src/pages/CarrierPage";


test.describe("Carrier Filter and Sorting", () => {
    let adminPage: AdminPage;
    let adminHomePage: AdminHomePage;
    let adminEditMerchantPage: AdminEditMerchantPage;
    let carrierPage: CarrierPage;

    test.beforeEach(async ({ page }) => {
        test.setTimeout(120000);

        adminPage = new AdminPage(page);
        adminHomePage = new AdminHomePage(page);
        adminEditMerchantPage = new AdminEditMerchantPage(page);
        carrierPage = new CarrierPage(page);

        await page.goto("https://admin.qat.anddone.com/#/login", {
            waitUntil: "domcontentloaded",
        });

        await adminPage.login("AdminTejasUser", "Tejasadmin@1111");

        await expect(adminHomePage.logo).toBeVisible({ timeout: 10000 });
        const isLogoVisible = await adminHomePage.isLogoDisplayed();
        expect(isLogoVisible).toBeTruthy();
        console.log(" Homepage logo is displayed");

        await expect(adminHomePage.searchInput).toBeVisible({ timeout: 10000 });
        await page.waitForTimeout(1000);

        await adminHomePage.searchByDBAAndValidate("tejasmerchant3");
        await adminHomePage.openActionDropdownAndValidate();
        await adminHomePage.clickEditSubMerchantDetails();
        console.log(" Navigated to Edit Merchant Page");

        await adminEditMerchantPage.goToDataSynchronization();
        await adminEditMerchantPage.handleNoResultsAndSyncIfNeeded();
        console.log(" Navigated to Data Synchronization");

        await expect(adminEditMerchantPage.carrierTabButton).toBeVisible({ timeout: 15000 });
        await adminEditMerchantPage.carrierTabButton.click();
        await page.waitForTimeout(3000);
        console.log(" Switched to Carrier tab");

        await expect(carrierPage.carrierTable).toBeVisible({ timeout: 15000 });
        console.log(" Carrier table is visible");
    });

    test("AN - 27286:should open Name filter popup and validate filter behavior", async () => {
        const initialNames = await carrierPage.getCarrierNames();
        console.log(`Initial names in table: ${initialNames.join(", ")}`);

       
        // Name Filter: Enter input in Name filter and validate results
        await carrierPage.enterInputInNameFilterAndValidateResults();
        await carrierPage.clearNameFilterAndValidateResults();

         //ADID Filter: Enter input in ADID filter and validate results
        await carrierPage.enterInputInADIDFilterAndValidateResults();
        await carrierPage.clearADIDFilterAndValidateResults();

        //IPFS Name Filter: Enter input in IPFS Name filter and validate results
        await carrierPage.enterInputInIPFSNameFilterAndValidateResults();
        await carrierPage.clearIPFSNameFilterAndValidateResults();
    });

    test("AN - 27283:should filter by IPFS Mapped YES and verify all pages show only YES records", async () => {
        console.log("\n=== Testing IPFS Mapped Filter: YES ===");

        await carrierPage.selectIpfsMappedFilterAndApply("YES");
        await carrierPage.verifyIpfsMappedValuesAcrossAllPages("YES");

        await carrierPage.clickToCloseIpfsFilterPopup();

        await carrierPage.selectIpfsMappedFilterAndApply("NO");
        await carrierPage.verifyIpfsMappedValuesAcrossAllPages("NO");
    });

    test("AN - 27286:should filter by Status Active and verify all pages show only Active records", async () => {
        console.log("\n=== Testing Status Filter: Active ===");

        await carrierPage.selectStatusFilterAndApply("Active");
        await carrierPage.verifyStatusValuesAcrossAllPages("Active");

        await carrierPage.selectStatusFilterAndApply("Inactive");
        await carrierPage.verifyStatusValuesAcrossAllPages("Inactive");
    });

    test("AN - 27286:should filter by Portal Status Active and verify all pages show only Active records", async () => {
        console.log("\n=== Testing Portal Status Filter: Active ===");

        await carrierPage.selectPortalStatusFilterAndApply("Active");
        await carrierPage.verifyPortalStatusValuesAcrossAllPages("Active");

        await carrierPage.clickToClosePortalStatusFilterPopup();

        await carrierPage.selectPortalStatusFilterAndApply("Inactive");
        await carrierPage.verifyPortalStatusValuesAcrossAllPages("Inactive");
    });

    test("AN - 27285:should sort columns with ascending/descending toggle", async ({ page }) => {
        console.log("\n=== TESTING COLUMN SORTING WITH TOGGLE ===");

        console.log("\n--- NAME COLUMN SORT TOGGLE ---");
        await carrierPage.clickNameFilter();
        await page.waitForTimeout(2000);
        let names = await carrierPage.getCarrierNames();
        console.log(`After 1st click (Name): ${names.join(", ")}`);
        expect(carrierPage.isAscendingOrder(names)).toBeTruthy();
        console.log("✓ Names sorted in ascending order");

        await carrierPage.clickNameFilter();
        await page.waitForTimeout(2000);
        names = await carrierPage.getCarrierNames();
        console.log(`After 2nd click (Name): ${names.join(", ")}`);
        expect(carrierPage.isDescendingOrder(names)).toBeTruthy();
        console.log("✓ Names sorted in descending order");

        await carrierPage.clickNameFilter();
        await page.waitForTimeout(2000);
        names = await carrierPage.getCarrierNames();
        console.log(`After 3rd click (Name): ${names.join(", ")}`);
        expect(carrierPage.isAscendingOrder(names)).toBeTruthy();
        console.log("✓ Names toggled back to ascending order");

        console.log("\n--- UPDATED ON COLUMN SORT TOGGLE ---");
        await carrierPage.clickUpdatedOnFilter();
        await page.waitForTimeout(2000);
        let dates = await carrierPage.getUpdatedOnDates();
        console.log(`After 1st click (Updated On): ${dates.join(", ")}`);
        expect(carrierPage.isDateAscendingOrder(dates)).toBeTruthy();
        console.log("✓ Dates sorted in ascending order");

        await carrierPage.clickUpdatedOnFilter();
        await page.waitForTimeout(2000);
        dates = await carrierPage.getUpdatedOnDates();
        console.log(`After 2nd click (Updated On): ${dates.join(", ")}`);
        expect(carrierPage.isDateDescendingOrder(dates)).toBeTruthy();
        console.log("✓ Dates sorted in descending order");

        await carrierPage.clickUpdatedOnFilter();
        await page.waitForTimeout(2000);
        dates = await carrierPage.getUpdatedOnDates();
        console.log(`After 3rd click (Updated On): ${dates.join(", ")}`);
        expect(carrierPage.isDateAscendingOrder(dates)).toBeTruthy();
        console.log("✓ Dates toggled back to ascending order");

        console.log("\n--- CREATED ON COLUMN SORT TOGGLE ---");
        await carrierPage.clickCreatedOnFilter();
        await page.waitForTimeout(2000);
        let createdDates = await carrierPage.getCreatedOnDates();
        console.log(`After 1st click (Created On): ${createdDates.join(", ")}`);
        expect(carrierPage.isDateAscendingOrder(createdDates)).toBeTruthy();
        console.log("✓ Created On sorted in ascending order");

        await carrierPage.clickCreatedOnFilter();
        await page.waitForTimeout(2000);
        createdDates = await carrierPage.getCreatedOnDates();
        console.log(`After 2nd click (Created On): ${createdDates.join(", ")}`);
        expect(carrierPage.isDateDescendingOrder(createdDates)).toBeTruthy();
        console.log("✓ Created On sorted in descending order");

        await carrierPage.clickCreatedOnFilter();
        await page.waitForTimeout(2000);
        createdDates = await carrierPage.getCreatedOnDates();
        console.log(`After 3rd click (Created On): ${createdDates.join(", ")}`);
        expect(carrierPage.isDateAscendingOrder(createdDates)).toBeTruthy();
        console.log("✓ Created On toggled back to ascending order");

        console.log("\n=== ALL SORTING TESTS PASSED ===");
    });

    test("AN - 27282:should verify pagination controls and navigation", async () => {
        console.log("\n=== TESTING PAGINATION CONTROLS ===");

        const paginationInfo = await carrierPage.verifyPaginationControls();

        console.log("\n--- Testing Previous Button (should be disabled on page 1) ---");
        const isPrevDisabled = await carrierPage.isPreviousButtonDisabled();
        expect(isPrevDisabled).toBeTruthy();
        console.log("✓ Previous button is disabled on first page");

        const page1Names = await carrierPage.getCarrierNames();
        const page1ItemCount = page1Names.length;
        console.log(`\nPage 1 has ${page1ItemCount} items`);
        console.log(`Page 1 names: ${page1Names.join(", ")}`);

        if (paginationInfo.totalPages > 1) {
            console.log("\n--- Testing Next Button Navigation ---");
            const clickedNext = await carrierPage.clickNextPage();
            expect(clickedNext).toBeTruthy();

            const currentPage = await carrierPage.getCurrentPageNumber();
            expect(currentPage).toBeGreaterThan(1);
            console.log("✓ Successfully navigated to next page");

            const page2Names = await carrierPage.getCarrierNames();
            console.log(`Page 2 has ${page2Names.length} items`);
            console.log(`Page 2 names: ${page2Names.join(", ")}`);

            expect(page1Names).not.toEqual(page2Names);
            console.log("✓ Page 2 data is different from page 1");

            console.log("\n--- Testing Previous Button Navigation ---");
            const clickedPrev = await carrierPage.clickPreviousPage();
            expect(clickedPrev).toBeTruthy();

            const backToPage1 = await carrierPage.getCurrentPageNumber();
            expect(backToPage1).toBe(1);
            console.log("✓ Successfully navigated back to page 1");

            const page1NamesAgain = await carrierPage.getCarrierNames();
            expect(page1NamesAgain).toEqual(page1Names);
            console.log("✓ Page 1 data matches original page 1 data");
        } else {
            console.log("\n⚠ Total pages reported as 1 - verifying by checking Next behavior");

            const currentPageBefore = await carrierPage.getCurrentPageNumber();
            const clickedNext = await carrierPage.clickNextPage();
            const currentPageAfter = await carrierPage.getCurrentPageNumber();

            if (clickedNext && currentPageAfter !== currentPageBefore) {
                console.log("⚠ Next moved to another page - pagination exists despite totalPages=1");
                expect(currentPageAfter).toBeGreaterThan(currentPageBefore);
            } else {
                expect(currentPageAfter).toBe(currentPageBefore);
                console.log("✓ Next button does not change the page when only one page exists");
            }
        }

        console.log("\n=== PAGINATION TESTS PASSED ===");
    });

    test("AN -27287:should verify items per page functionality", async ({ page }) => {
        const paginationInfo = await carrierPage.verifyPaginationControls();
        console.log(`\nInitial pagination: ${paginationInfo.totalPages} total pages`);

        console.log("\n--- Testing 25 Items Per Page ---");
        await carrierPage.changeItemsPerPageTo25();
        await page.waitForTimeout(2000);

        let newPaginationInfo = await carrierPage.verifyPaginationControls();
        console.log(`Pagination after changing to 25: ${newPaginationInfo.totalPages} total pages`);

        let itemsCount = await carrierPage.getCurrentItemsPerPage();
        expect(itemsCount).toBeLessThanOrEqual(25);
        console.log(`✓ Items displayed: ${itemsCount} (≤ 25)`);

        console.log("\n--- Testing 50 Items Per Page ---");
        await carrierPage.changeItemsPerPageTo50();
        await page.waitForTimeout(2000);

        newPaginationInfo = await carrierPage.verifyPaginationControls();
        console.log(`Pagination after changing to 50: ${newPaginationInfo.totalPages} total pages`);

        itemsCount = await carrierPage.getCurrentItemsPerPage();
        expect(itemsCount).toBeLessThanOrEqual(50);
        console.log(`✓ Items displayed: ${itemsCount} (≤ 50)`);

        console.log("\n=== ITEMS PER PAGE TEST COMPLETED ===");
    });

    test("AN - 27282, AN - 27286:should verify that filter and pagination work together correctly", async () => {
        console.log("\n=== TESTING FILTER AND PAGINATION TOGETHER ===");
        await carrierPage.enterNameInFilterAndApply("A");
        const filteredNames = await carrierPage.getCarrierNames();
        console.log(`Filtered names (with 'A'): ${filteredNames.join(", ")}`);
        const paginationInfo = await carrierPage.verifyPaginationControls();
        console.log(`Pagination after filtering: ${paginationInfo.totalPages} total pages`);
        if (paginationInfo.totalPages > 1) {
            const clickedNext = await carrierPage.clickNextPage();
            expect(clickedNext).toBeTruthy();
            const currentPage = await carrierPage.getCurrentPageNumber();
            expect(currentPage).toBeGreaterThan(1);
            console.log("✓ Successfully navigated to next page with filter applied");
        }
        console.log("\n=== FILTER AND PAGINATION TOGETHER TEST COMPLETED ===");
    });
});

test.describe("Carrier Access Setting and permission setting disable", () => {
    let adminPage: AdminPage;
    let adminHomePage: AdminHomePage;
    let adminEditMerchantPage: AdminEditMerchantPage;
    let carrierPage: CarrierPage;

    test.beforeEach(async ({ page }) => {
        test.setTimeout(120000);

        adminPage = new AdminPage(page);
        adminHomePage = new AdminHomePage(page);
        adminEditMerchantPage = new AdminEditMerchantPage(page);
        carrierPage = new CarrierPage(page);

        await page.goto("https://admin.qat.anddone.com/#/login", {
            waitUntil: "domcontentloaded",
        });

        await adminPage.login("AdminTejasUser", "Tejasadmin@1111");

        await expect(adminHomePage.logo).toBeVisible({ timeout: 10000 });
        const isLogoVisible = await adminHomePage.isLogoDisplayed();
        expect(isLogoVisible).toBeTruthy();
        console.log(" Homepage logo is displayed");

        await expect(adminHomePage.searchInput).toBeVisible({ timeout: 10000 });
        await page.waitForTimeout(1000);

        await adminHomePage.searchByDBAAndValidate("PFTADToggleOFFCN");
        await adminHomePage.openActionDropdownAndValidate();
        await adminHomePage.clickEditSubMerchantDetails();
        console.log(" Navigated to Edit Merchant Page");

        await adminEditMerchantPage.goToDataSynchronization();
        await adminEditMerchantPage.handleNoResultsAndSyncIfNeeded();
        console.log(" Navigated to Data Synchronization");

        await expect(adminEditMerchantPage.carrierTabButton).toBeVisible({ timeout: 15000 });
        await adminEditMerchantPage.carrierTabButton.click();
        await page.waitForTimeout(3000);
        console.log(" Switched to Carrier tab");

        await expect(carrierPage.carrierTable).toBeVisible({ timeout: 15000 });
        console.log(" Carrier table is visible");
    });

    test('AN - 27277, AN -27278:Carriers tab loads with table headers', async () => {
        const headers = await carrierPage.getAllTableHeadersText();
        expect(headers).toContain("Name");
        expect(headers).toContain("AD ID");
        expect(headers).toContain("Customer ID");
        expect(headers).toContain("IPFS Name");
        expect(headers).toContain("IPFS Mapped");
        expect(headers).toContain("Quote Eligible");
        expect(headers).toContain("Auto Eligible");
        expect(headers).toContain("Updated On");
        expect(headers).toContain("Created On");
        expect(headers).toContain("Status");
        expect(headers).toContain("Portal Status");
        console.log("✓ Carriers tab loads with table headers");

        expect(adminEditMerchantPage.noResultsMsg).toBeVisible({ timeout: 15000 });
        const noResultsText = await adminEditMerchantPage.noResultsMsg.innerText();
        expect(noResultsText.trim()).toBe("No Results Found");
        console.log("✓ 'No Results Found' message is displayed when there are no carriers");
    });

});
