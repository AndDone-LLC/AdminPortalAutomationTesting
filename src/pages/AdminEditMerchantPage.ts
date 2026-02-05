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
    coverageRows = this.coverageContainer.locator('tbody tr');
    coverageHeaders = this.coverageContainer.locator('thead th');

    paginationNext = this.page.locator('button[data-page="next"]');
    paginationPrev = this.page.locator('button[data-page="prev"]');
    paginationButtons = this.page.locator('#pagination button');

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

}