import type { Page, Locator } from '@playwright/test';

export class tableUtils {


    /**
     * Get all table headers
     */
    static async getTableHeaders(table: Locator): Promise<string[]> {
        try {
            const headers = table.locator('thead tr th');
            await headers.first().waitFor({ state: 'visible', timeout: 5000 });
            return (await headers.allInnerTexts())
                .map(header => header.trim());
        } catch (error) {
            return [];
        }
    }

    /**
     * Get column index based on column header name
     */
    static async getColumnIndex(table: Locator, columnName: string): Promise<number> {
        try {
            const headers = table.locator('thead tr th');
            await headers.first().waitFor({ state: 'visible', timeout: 5000 });
            const count = await headers.count();
            for (let i = 0; i < count; i++) {
                const headerText = (await headers.nth(i).innerText()).trim();
                if (headerText === columnName.trim()) {
                    return i;
                }
            }
            return -1;
        } catch (error) {
            return -1;
        }
    }
}



