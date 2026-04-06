
import { expect, Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { CommonUtils } from '@anddone/coretestautomation/dist';

export class SubMerchantDetailsPage1 extends BasePage {
  public utils: CommonUtils;

  constructor(page: Page) {
    super(page);
    this.utils = new CommonUtils();
  }

  // --- Scope all locators to the Add/Edit Merchant form container ---
  // Keep for inputs that are reliably inside this component.
  private readonly formRoot = this.page.locator('app-add-edit-merchant');

  // “Create New Merchant” is a generic clickable text inside <main>, not a <button>.
  readonly createNewMerchantButton =
    this.page.getByRole('main').getByText('Create New Merchant', { exact: true });

  // --- Page readiness signal (H1) ---
  readonly merchantDetailsHeading = this.page.getByRole('heading', {
    level: 1,
    name: /merchant details/i,
  });

  // Merchant Type (custom dropdown)
  // Snapshot shows: button "Ally" (expanded) with adjacent text "Merchant Type".
  // Use robust locators scoped to <main> and fall back to the button name.
  readonly merchantTypeTrigger =
    this.page
      .getByRole('main')
      .locator('div:has-text("Merchant Type")')
      .getByRole('button')
      .first()
      .or(this.page.getByRole('button', { name: /ally/i }));

  // State dropdown: snapshot shows "Select for a State"
  readonly stateTrigger =
    this.page.getByRole('main').getByRole('button', { name: /select for a state/i });

  readonly dropdownOptionList = this.page.locator(
    "//ul[contains(@class,'dropdown-menu') and contains(@class,'inner') and contains(@class,'show')]"
  );

  // Inputs (label-relative first; fallback to id or accessible name in <main>)
  readonly companyNameInput =
    this.formRoot.getByLabel(/merchant company/i)
      .or(this.page.getByRole('textbox', { name: /\*?merchant company/i }));

  readonly adminUserNameInput =
    this.formRoot.getByLabel(/admin name/i).or(this.formRoot.locator("//input[@id='MERCHANT_ADMIN_NAME']"));

  readonly firstNameInput =
    this.formRoot.getByLabel(/first name/i).or(this.formRoot.locator("//input[@id='FIRST_NAME']"));

  readonly lastNameInput =
    this.formRoot.getByLabel(/last name/i).or(this.formRoot.locator("//input[@id='LAST_NAME']"));

  readonly phoneInput =
    this.formRoot.getByLabel(/phone/i).or(this.formRoot.locator("//input[@id='PHONE']"));

  readonly emailInput =
    this.formRoot.getByLabel(/email/i).or(this.formRoot.locator("//input[@id='email']"));

  readonly address1Input =
    this.formRoot.getByLabel(/address line 1/i).or(this.formRoot.locator("//input[@id='ADDRESS_LINE_1']"));

  readonly cityInput =
    this.formRoot.getByLabel(/city/i).or(this.formRoot.locator("//input[@id='CITY']"));

  readonly postalCodeInput =
    this.formRoot.getByLabel(/zip|postal code/i).or(this.formRoot.locator("//input[@id='ZIP']"));

  // Country (native select)
  readonly countrySelect =
    this.formRoot.getByLabel(/country/i).or(this.formRoot.locator("//select[@id='myDropdownState' or @formcontrolname='Country']"));

  readonly saveContinueBtn =
    this.page.getByRole('main').getByText(/save and continue|save/i)
      .or(this.formRoot.getByRole('button', { name: /save and continue|save/i }))
      .or(this.formRoot.locator("//a[@class='btn btn-dark-blue']"));

  // --- utilities ---
  private async ensureVisible(loc: Locator) {
    const target = loc.first(); // guard against multiple
    // Wait for the node to be attached before trying to scroll or assert visibility
    await expect(target).toBeAttached({ timeout: 15000 });
    await target.scrollIntoViewIfNeeded();
    await expect(target).toBeVisible({ timeout: 15000 });
  }

  private async openCustomDropdown(trigger: Locator) {
    await this.ensureVisible(trigger);
    await trigger.click();
    await expect(this.dropdownOptionList).toBeVisible({ timeout: 10000 });
  }

  private async pickCustomOptionByText(optionText: string) {
    const option = this.dropdownOptionList.locator(`.//span[normalize-space(.)='${optionText}']`).first()
      .or(this.dropdownOptionList.locator(`.//li[.//span[normalize-space(.)='${optionText}']]`).first());
    await this.ensureVisible(option);
    await option.click();
    // Wait for the dropdown to collapse (listbox hidden)
    await expect(this.dropdownOptionList).toBeHidden({ timeout: 10000 });
  }

  // --- steps ---
  async clickOnCreateNewMerchantButton(): Promise<void> {
    // Ensure page region is ready
    await expect(this.merchantDetailsHeading).toBeVisible({ timeout: 15000 });

    await this.ensureVisible(this.createNewMerchantButton);
    await this.createNewMerchantButton.click();

    // First interactive control on the form should be visible now
    await this.ensureVisible(this.merchantTypeTrigger);
  }

  async selectMerchantType(merchantType: string) {
    await this.openCustomDropdown(this.merchantTypeTrigger);
    await this.pickCustomOptionByText(merchantType);
  }

  async enterMerchantCompanyName(val: string) {
    await this.ensureVisible(this.companyNameInput);
    await CommonUtils.fill(this.companyNameInput, val);
  }

  async enterMerchantAdminUserName(val: string) {
    await this.ensureVisible(this.adminUserNameInput);
    await CommonUtils.fill(this.adminUserNameInput, val);
  }

  async enterMerchantFirstName(val: string) {
    await this.ensureVisible(this.firstNameInput);
    await CommonUtils.fill(this.firstNameInput, val);
  }

  async enterMerchantLastName(val: string) {
    await this.ensureVisible(this.lastNameInput);
    await CommonUtils.fill(this.lastNameInput, val);
  }

  async enterMerchantPhoneNumber(val: string) {
    await this.ensureVisible(this.phoneInput);
    await CommonUtils.fill(this.phoneInput, val);
  }

  async enterMerchantEmail(val: string) {
    await this.ensureVisible(this.emailInput);
    await CommonUtils.fill(this.emailInput, val);
  }

  async enterMerchantAddressLine1(val: string) {
    await this.ensureVisible(this.address1Input);
    await CommonUtils.fill(this.address1Input, val);
  }

  async enterMerchantCity(val: string) {
    await this.ensureVisible(this.cityInput);
    await CommonUtils.fill(this.cityInput, val);
  }

  async enterMerchantState(merchantStateValue: string) {
    await this.openCustomDropdown(this.stateTrigger);
    await this.pickCustomOptionByText(merchantStateValue);
  }

  async enterMerchantPostalCode(val: string) {
    await this.ensureVisible(this.postalCodeInput);
    await CommonUtils.fill(this.postalCodeInput, val);
  }

  async enterMerchantCountry(countryText: string) {
    // Ensure select is visible and its options are present
    await this.ensureVisible(this.countrySelect);

    // Wait until an <option> with the requested text exists
    const optionByText = this.countrySelect.locator(`option >> text="${countryText}"`);
    await expect(optionByText).toHaveCount(1, { timeout: 10000 });

    // Now select by label
    await this.countrySelect.selectOption({ label: countryText });
  }

  async clickOnSaveAndContinueButton() {
    await this.ensureVisible(this.saveContinueBtn);
    await CommonUtils.click(this.saveContinueBtn);
  }

  /**
   * One-call flow: clicks "Create New Merchant", fills everything, then save.
   */
  async createNewMerchant(
    merchantType: string,
    merchantCompanyName: string,
    adminUserName: string,
    merchantFirstName: string,
    merchantLastName: string,
    merchantPhoneNumber: string,
    merchantEmail: string,
    merchantAddressLine1: string,
    merchantCity: string,
    merchantState: string,
    merchantPostalCode: string,
    merchantCountry: string
  ) {
    await this.clickOnCreateNewMerchantButton();
    await this.selectMerchantType(merchantType);
    await this.enterMerchantCompanyName(merchantCompanyName);
    await this.enterMerchantAdminUserName(adminUserName);
    await this.enterMerchantFirstName(merchantFirstName);
    await this.enterMerchantLastName(merchantLastName);
    await this.enterMerchantPhoneNumber(merchantPhoneNumber);
    await this.enterMerchantEmail(merchantEmail);
    await this.enterMerchantAddressLine1(merchantAddressLine1);
    await this.enterMerchantCity(merchantCity);
    await this.enterMerchantState(merchantState);
    await this.enterMerchantPostalCode(merchantPostalCode);
    await this.enterMerchantCountry(merchantCountry);
    await this.clickOnSaveAndContinueButton();
  }
}