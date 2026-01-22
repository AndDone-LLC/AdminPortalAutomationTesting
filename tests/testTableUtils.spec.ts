import { test, expect ,Page,Locator} from '@playwright/test';
import { TableUtils } from '../src/utils/tableUtils';
import { AssertionUtils } from '../src/utils/assertionUtils'
import {commonUtils} from '../src/utils/commonUtils'

test('test table utils', async ({ page }) => {
  await page.goto('https://admin.qat.anddone.com/#/login');
  await page.getByRole('textbox', { name: '*Username' }).click();
  await page.getByRole('textbox', { name: '*Username' }).fill('AdminUser');
  await page.getByRole('textbox', { name: '*Password' }).click();
  await page.getByRole('textbox', { name: '*Password' }).fill('AdminQAT%12345');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForTimeout(3000);
  await expect(page.getByRole('heading', { name: 'Sub-Merchants' })).toBeVisible();
  await expect(page.getByText('Add Sub-Merchant')).toBeVisible();
  // await page.getByRole('link', { name: 'Payments' }).click();
  // await page.waitForTimeout(3000);
  // await expect(page.getByRole('heading', { name: 'Sub-Merchant Payments' })).toBeVisible();



  //**** table utils
  await page.waitForTimeout(3000); // waits for 3 seconds
  const tableLocator:Locator= page.getByRole('table');

    const tableHeader=await TableUtils.getTableHeaders(tableLocator)
    console.log('Table Header:'+tableHeader);


    const dbaName=await TableUtils.getColumnValuesByHeader(tableLocator,"Admin Email");
    console.log('Admin Email Names:'+dbaName);

    const authorizationDate:String[]=await TableUtils.getColumnValuesByHeader(tableLocator,"Company Name");
    console.log('Company Names:'+authorizationDate);

    const indexValues:String[]=await TableUtils.getColumnValuesByIndex(tableLocator,1);
    console.log('Index Values:'+indexValues);

    const i=await TableUtils.getColumnIndex(tableLocator,"Company Name");
    console.log('Index Column:'+i);

    // TableUtils.clickOnTableColumnHeader(page,tableLocator,"Admin Email");
    // await page.waitForTimeout(10000);
    

    // TableUtils.clickOnTableColumnHeader(page,tableLocator,"status");
    // await page.waitForTimeout(10000); // waits for 3 seconds

    // TableUtils.clickOnTableColumnHeader(page,tableLocator,"KYC Deadline");
    // await page.waitForTimeout(10000); // waits for 3 seconds

    // TableUtils.clickOnTableRowByValue(page,tableLocator,undefined,"Ashna Agrawal");
    // await page.waitForTimeout(10000);

    TableUtils.clickOnTableRowByIndex(page,tableLocator,undefined,9);
     await page.waitForTimeout(10000);
    // await TableUtils.clickCopyToClipboardByCellValue(tableLocator,'testmerchant1601',undefined,undefined,'div button#detailsDropdown',true);
    // await page.waitForTimeout(10000);
    
  
//     const headers: string[] = await tableUtils.getTableHeaders(tabelLocator);
//      console.log('Table Headers :', headers);
// console.log('Table Headers without span:', headers);
//   console.log('Table Headers length without span:',headers.length)


//     const headersTwo = await tableUtils.getTableHeaders(tabelLocator,'thead tr th', async th => th.locator('button').innerText()
//   );
//   console.log('Table Headers in Span:', headersTwo);
//   console.log('Table Headers length:',headersTwo.length)

//   const coloumnIndex=await tableUtils.getColumnIndex(tabelLocator,"Status");
//    console.log('Column index:',coloumnIndex);


//    const index = await tableUtils.getColumnIndex(tabelLocator,'Created On','thead tr th',async th => th.locator('div').innerText()
// );
//  console.log('Column index :',index);

//  const columnValues =await tableUtils.getColumnValuesByIndex(tabelLocator,3);
//  console.log('Column Values',columnValues);

//  const companyNames=await TableUtils.getColumnValuesByHeader(tableLocator,"Company Name");
//  console.log('Company Names',companyNames);

//  const columnValues =await TableUtils.getColumnValuesByIndex(tableLocator,3);
//  console.log('Column Values',columnValues);

//  const value=await TableUtils.getCellValueByIndex(tableLocator,1,0);
// console.log('Index Values',value);

// const statussValues =await TableUtils.getColumnValuesByHeader(tableLocator,"Status");
// console.log('Status Values',statussValues);

})
// const valueInSpan = await TableUtils.getCellValueByIndex( tableLocator,1, 0,'tbody tr','td',
//     async cell => cell.locator('span').innerText()
// );
// console.log('Value In span:', valueInSpan);






//   const values = await tableUtils.getColumnValuesByHeader(tabelLocator,'Company Name','thead tr th','tbody tr','td',
//   async cell => await cell.locator('span').innerText()
// );

// console.log('Company Names:', values);
// const table2 = page.getByRole('table');

// const values2 = await tableUtils.getColumnValuesByHeader(
//   tabelLocator,'Company Name'
// );
// console.log('Company Names2:', values2);





