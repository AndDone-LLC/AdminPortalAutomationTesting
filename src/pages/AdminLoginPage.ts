import { Page } from "@playwright/test";
// import { commonUtils } from "@siddheshwar.anajekar/common-base";
import { CommonUtils } from '@anddone/coretestautomation/dist';
import { BasePage } from "./BasePage";

export class AdminPage extends BasePage {
    public utils: CommonUtils;

    constructor(page: Page) {
        super(page);
        this.utils = new CommonUtils();
    }

    usernameInput = this.page.getByRole('textbox', { name: '*Username' });
    passwordInput = this.page.getByRole('textbox', { name: '*Password' });
    loginBtn = this.page.getByRole('button', { name: 'Sign In' });

    /**
     * method to login
     * @param username of the admin
     * @param password of the admin
     */
    async login(username: string, password: string) {

        await CommonUtils.fill(this.usernameInput, username);
        await CommonUtils.fill(this.passwordInput, password);
        await CommonUtils.click(this.loginBtn);
        // Wait for URL change instead of networkidle
        await this.page.waitForURL(url => !url.toString().includes('/login'), { timeout: 10000 }).catch(() => {});
        await this.page.waitForURL('**/admin/**', { timeout: 30000 });
    }

    
}