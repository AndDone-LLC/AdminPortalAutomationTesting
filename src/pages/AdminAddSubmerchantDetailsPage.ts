import { expect, Page } from "@playwright/test";
import { CommonUtils, TableUtils } from '@anddone/coretestautomation/dist';
import { BasePage } from "./BasePage";

export class AdminAddSubmerchantDetailsPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }
    sidebar = this.page.locator('#sidebar');
    subMerchantComopany_txt = this.page.locator('#selectedCompanyDBA');
    subMerchantCompanyPhone_txt = this.page.locator('#selectedPhone');
    subMerchantCompanyEmail_txt = this.page.locator('#selectedEmail');
    subMerchantSelect_dd = this.page.locator("//div[contains(@class,'app-status')]//app-dropdown//button");
    subMerchantSelect_ddbtn = this.page.locator("//button[contains(.,'Select or Search for a Merchant Application')]");
    subMerchant_txtbox = this.page.locator("//div[@id='list']/div[1]/input");
    applicationlist_ddoption = this.page.locator(".dropdown-item")
    pensil_btn = this.page.locator("i.bi.bi-pencil");
    enter_username = this.page.locator("//*[@formcontrolname='PortalUserName']");
    save_btn = this.page.locator("//button[@type='button' and normalize-space()='Save']");
    save_continue = this.page.locator("//a[normalize-space()='Save and Continue']");


    async clickondropdown(selectApplicationType:string) {

        //await CommonUtils.selectByText(this.subMerchantSelect_dd, "Approved and Boarded")

    await CommonUtils.selectByText(this.subMerchantSelect_dd, selectApplicationType)
    }
    async clickonsearchdropdown() {
        await CommonUtils.click(this.subMerchant_txtbox);
    }


    async fillApplicationName(applicationName:string) {
        await CommonUtils.fill(this.subMerchant_txtbox, applicationName);
        await CommonUtils.clickOnFilterOptionFromList(this.applicationlist_ddoption, "Dikhit");
    }

    async clickPensilicon() {

        await CommonUtils.click(this.pensil_btn);
    }


    async enterUsername() {

        await CommonUtils.fill(this.enter_username, "Hellouyser");

    }

    async clickSavebtn() {

        await CommonUtils.click(this.save_btn);
    }

    async clickSaveAndContinue() {

        await CommonUtils.click(this.save_continue);
    }

}