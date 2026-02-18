import { CommonUtils } from "@anddone/coretestautomation/dist";
import { expect, Page } from "@playwright/test";
import { BasePage } from "anddonejs1";
import { AdminEditMerchantPage } from "./AdminEditMerchantPage";
import { GenericTableManager } from "./GenericTableManager";

export class BrokerPage extends BasePage {
    public utils: CommonUtils;
    private adminEditMerchantPage: AdminEditMerchantPage;
    table: GenericTableManager;

    constructor(page: Page) {
        super(page);
        this.utils = new CommonUtils();
        this.adminEditMerchantPage = new AdminEditMerchantPage(page);

        this.table = new GenericTableManager(
            page,
            "table.data-sync-table"
        );
    }
    paginationNext = this.page.locator('button[data-page="next"]');
    paginationPrev = this.page.locator('button[data-page="prev"]');
    paginationButtons = this.page.locator('#pagination');

    // Broker table
    brokerContainer = this.page.locator('app-broker');
    brokerTable = this.brokerContainer.locator('table');
    brokerRows = this.brokerContainer.locator('tbody tr');

    // Name filter elements
    nameColumnHeader = this.brokerTable.locator('#nameDropdownBroker');
    nameFilterInput = this.page.locator('#inputNameBroker');
    nameFilterApplyBtn = this.page.locator("//div[@aria-labelledby='nameDropdownBroker']//a[contains(text(),'Apply')]");
    nameFilterClearBtn = this.page.locator("//div[@aria-labelledby='nameDropdownBroker']//a[contains(text(),'Clear')]");
    // No results message
    noResultsFoundMsg = this.page.locator('#noResultsMsg').first();

    async openNameFilterPopup() {
        await expect(this.brokerTable).toBeVisible({ timeout: 15000 });

        await this.nameColumnHeader.click();
        await this.page.waitForTimeout(800);
        await expect(this.nameFilterApplyBtn).toBeVisible({ timeout: 5000 });
        console.log("✓ Broker Name filter popup opened");
    }

    async getBrokerNames(): Promise<string[]> {
        await expect(this.brokerTable).toBeVisible({ timeout: 15000 });

        const nameLocator = this.page.locator("//tbody[@id='dataSection']/tr/td[1]");
        const names: string[] = [];
        const count = await nameLocator.count();

        for (let i = 0; i < count; i++) {
            const name = (await nameLocator.nth(i).innerText()).trim();
            if (name) names.push(name);
        }

        console.log(`✓ Retrieved ${names.length} broker names`);
        return names;
    }

    async filterByNameAndValidate(searchText: string): Promise<string[]> {
        await this.openNameFilterPopup();
        await expect(this.nameFilterInput).toBeVisible();
        await this.nameFilterInput.fill(searchText);
        await this.nameFilterApplyBtn.click();
        await this.page.waitForTimeout(1500);
        const names = await this.getBrokerNames();
        console.log(`Filtered Broker Names: ${names.join(', ')}`);
        return names;
    }

    async openBrokerTab() {
        await expect(this.adminEditMerchantPage.brokerTabButton).toBeVisible({ timeout: 15000 });
        await this.adminEditMerchantPage.brokerTabButton.click();
        console.log("Switched to Broker tab");
        await this.page.waitForTimeout(1500);
        const noResultsContainer = this.page.locator('#noResultsContainer');
        const rows = this.page.locator('tbody#dataSection tr');
        const isNoResultsVisible = await noResultsContainer.isVisible().catch(() => false);
        const rowCount = await rows.count();
        console.log("Row count:", rowCount);
        console.log("No results visible:", isNoResultsVisible);

        if (isNoResultsVisible || rowCount === 0) {
            console.log("No Broker records found. Clicking Sync...");
            const syncBtn = this.page.locator('#syncBtn');
            await expect(syncBtn).toBeVisible({ timeout: 5000 });
            await syncBtn.click();
            console.log("Sync triggered");
        }

        console.log("Broker table has records");
    }

    async getAllBrokerData(): Promise<any> {

        await this.openBrokerTab();
        const table = this.page.locator('table.data-sync-table');
        await expect(table).toBeVisible({ timeout: 15000 });

        const records: any[] = [];
        let previousPageNumber = "";

        while (true) {

            // Wait for rows
            await this.page.waitForSelector('tbody#dataSection tr');

            const headers = await table.locator('thead th').allInnerTexts();
            const rows = this.page.locator('tbody#dataSection tr');
            const rowCount = await rows.count();

            for (let i = 0; i < rowCount; i++) {

                const cells = rows.nth(i).locator('td');
                const cellCount = await cells.count();
                const rowObj: any = {};

                for (let j = 0; j < cellCount; j++) {
                    rowObj[headers[j]?.trim()] =
                        (await cells.nth(j).innerText()).trim();
                }

                records.push({
                    adUniqueId: rowObj["AD ID"] || "",
                    customerUniqueId: rowObj["Customer ID"] || "",
                    name: rowObj["Name"] || "",
                    pfBroker: {
                        brokerName: rowObj["IPFS Name"] || "",
                        lastUpdate: rowObj["Updated On"] || ""
                    },
                    pfBrokerEligibility: {
                        isMapped: rowObj["IPFS Mapped"]?.includes("YES")
                    },
                    status: rowObj["Status"] || "",
                    portalStatus: rowObj["Portal Status"] || "",
                    createdOn: rowObj["Created On"] || ""
                });
            }

            // Get current active page
            const activePageLocator = this.page.locator('#pagination button.active');
            const currentPage = await activePageLocator.innerText();

            // Stop if page did not change
            if (previousPageNumber === currentPage) {
                console.log("Reached last page");
                break;
            }

            previousPageNumber = currentPage;

            // Check if next button has disabled class
            const nextClass = await this.paginationNext.getAttribute("class");
            if (nextClass?.includes("disabled")) {
                console.log("Next button disabled → Last page reached");
                break;
            }

            // Click next
            await this.paginationNext.click();

            // Wait for page number to change
            await this.page.waitForFunction(
                (prev) => {
                    const active = document.querySelector('#pagination button.active');
                    return active && active.textContent !== prev;
                },
                previousPageNumber
            );
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