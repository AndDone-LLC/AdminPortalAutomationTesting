import { expect, Locator, Page } from "@playwright/test";
import { commonUtils } from "@siddheshwar.anajekar/common-base";
import { BasePage } from "./BasePage";
// import { TableUtils } from "@siddheshwar.anajekar/common-base";
import { CommonUtils, TableUtils } from '@anddone/coretestautomation/dist';

export class AdminHomePage extends BasePage {
    public utils: commonUtils;
    //readonly logo: Locator;

    constructor(page: Page) {
        super(page);
           
        // Logo locator using the provided xpath
        //this.logo = page.locator("//img[contains(@src,'logo-new.png') and @alt='homepage']");

        this.utils = new commonUtils(page);
    }

    //HomePage logo
    logo = this.page.locator("//img[contains(@src,'logo-new.png') and @alt='homepage']");

    // locators for admin home page
    searchInput = this.page.getByRole('searchbox', { name: 'Company Name, DBA Name, Admin Name, Ally Name, ID or Email' });
    addSubMerchantBtn = this.page.getByText('Add Sub-Merchant', { exact: true });
    exportBtn = this.page.getByRole('button', { name: 'Export' });
    exportCsvOption = this.page.getByText('.CSV', { exact: true });
    exportPdfOption = this.page.getByText('.PDF', { exact: true });

    table = this.page.locator('table.table');
    tableBody = this.page.locator('#tableBody');

    // locators for table header
    companyNameHeader = this.page.getByRole('columnheader', { name: 'Company Name' });
    kycHeader = this.page.getByRole('columnheader', { name: 'KYC', exact: true, });
    kycDeadlineHeader = this.page.getByRole('columnheader', { name: 'KYC Deadline' });
    dbaNameHeader = this.page.getByRole('columnheader', { name: 'DBA Name' });
    merchantIdHeader = this.page.getByRole('columnheader', { name: 'ID' });
    adminNameHeader = this.page.getByRole('columnheader', { name: 'Admin Name' });
    adminEmailHeader = this.page.getByRole('columnheader', { name: 'Admin Email' });
    createdOnHeader = this.page.getByRole('columnheader', { name: 'Created On' });
    allyHeader = this.page.getByRole('columnheader', { name: 'Ally' });
    statusHeader = this.page.getByRole('columnheader', { name: 'Status' });

    // first row of the table
    firstTableRow = this.page.locator('#tableBody tr').first();

    // 3-dot button inside first row
    actionDropdownBtn = this.firstTableRow.locator('button#detailsDropdown');

    // Dropdown menu only inside the same row
    actionDropdownMenu = this.firstTableRow.locator('div.dropdown-menu.show');
    editSubMerchantOption = this.actionDropdownMenu.getByText('Edit Sub-Merchant Details', { exact: true });
    emulateOption = this.actionDropdownMenu.getByText('Emulate', { exact: true });
    viewTransactionsOption = this.actionDropdownMenu.getByText('View Transactions', { exact: true });
    resetPasswordOption = this.actionDropdownMenu.getByText('Reset Password', { exact: true });
    deactivateOption = this.actionDropdownMenu.getByText('Deactivate', { exact: true });

    tableRows = this.page.locator('#tableBody tr');
    dbaCells = this.page.locator('#tableBody tr td:nth-child(4)');


      /**
     * Verify that the homepage logo is displayed
     */
    async isLogoDisplayed(): Promise<boolean> {
        return await this.logo.isVisible();
    }

    /**
     * Method to search DBAName and validate whether it is present in table or not
     * @param dbaName to be searched
     */
    async searchByDBAAndValidate(dbaName: string) {

        await this.page.waitForTimeout(2000);
        
        await this.searchInput.fill(dbaName);
        await this.page.waitForTimeout(1000);
        await this.searchInput.press('Enter');

        await expect
            .poll(async () => {
                //await this.tableRows.first().waitFor({ state: 'visible', timeout: 5000 });
                const texts = await TableUtils.getColumnValuesByHeader(this.table, "DBA Name");
                return texts.some(text =>
                    text.toLowerCase().includes(dbaName.toLowerCase())
                );
            }, {
                timeout: 10000,
            })
            .toBeTruthy();
    }

    /**
     * method to print search result
     * @returns search result after calling searchByDBAAndValidate() method
     */
    async logSearchResults() {
        const rowsCount = await this.tableRows.count();
        console.log(`\nTotal rows after search: ${rowsCount}`);

        if (rowsCount === 0) {
            console.log('No records found');
            return;
        }

        const values = await TableUtils.getColumnValuesByHeader(
            this.table,
            "DBA Name"
        );

        console.log(`\nTotal rows after search: ${values.length}`);

        values.forEach((v, i) => {
            console.log(`Row ${i + 1}: ${v}`);
        });
    }

    /**
     * method to open action dropdown and validate
     */
    async openActionDropdownAndValidate() {
        await TableUtils.clickEllipsisByRowIndex(this.table, 1);
        await expect(this.editSubMerchantOption).toBeVisible();
        await expect(this.emulateOption).toBeVisible();
        await expect(this.viewTransactionsOption).toBeVisible();
        await expect(this.resetPasswordOption).toBeVisible();
        await expect(this.deactivateOption).toBeVisible();
    }

    /**
     * method to click on edit sub merchant details
     */
    async clickEditSubMerchantDetails() {
        await this.editSubMerchantOption.click();
        await expect(this.page).toHaveURL(
            /#\/admin\/add-edit-merchant$/,
            { timeout: 10000 }
        );
    }

}   