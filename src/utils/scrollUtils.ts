import { commonUtils } from "./commonUtils";
import type { Page, Locator } from '@playwright/test';

export class ScrollUtils extends commonUtils {

/**
 * Scrolls the page until the given element is visible in the viewport.
 *
 * @param locator - Playwright locator of the target element
 * @param timeout - Maximum time (in ms) to wait for the element to be visible (default: 10000)
 * @param description - Readable name of the element (used for logs/errors)
 *
 * @throws Error if the element does not become visible or scrolling fails
 *
 * @example
 * await commonUtils.scrollToElement(loginButton, 15000, 'Login Button');
 */
    static async scrollToElement(locator: Locator, timeout = 10000, description: string = 'Element'): Promise<void> {
        try {
            //await this.waitForVisible(locator, timeout, description);
            await locator.scrollIntoViewIfNeeded();
        } catch (error) {
            console.error(`❌ Failed to scroll to ${description}`)
        }
    }

    /**
  * Scrolls the page or a specific scrollable container by a given number of pixels.
  *
  * This method supports both vertical and horizontal scrolling and works in
  * two modes:
  * 1️⃣ Page scrolling using mouse wheel (when container is not provided)
  * 2️⃣ Container scrolling using DOM scroll (when container is provided)
  *
  * @param direction - Scroll direction: 'vertical' or 'horizontal'
  * @param pixels - Number of pixels to scroll (default: 300)
  * @param container - Optional scrollable container locator (e.g. table body, modal, panel)
  *
  * @throws Error if scrolling fails
  *
  * @example - Scroll page vertically
  * await commonUtils.scrollByDirection();
  *
  * @example - Scroll page horizontally
  * await commonUtils.scrollByDirection('horizontal', 400);
  *
  * @example - Scroll inside a container
  * await commonUtils.scrollByDirection('vertical', 200, page.locator('.table-body'));
  */
    static async scrollByDirection(page: Page, direction: string = 'vertical', pixels: number = 300, container?: Locator
    ): Promise<void> {
        try {
            if (container) {
                await container.evaluate(
                    (el, { direction, pixels }) => {
                        direction === 'vertical'
                            ? el.scrollBy(0, pixels)
                            : el.scrollBy(pixels, 0);
                    },
                    { direction, pixels }
                );
            } else {
                await page.mouse.wheel(
                    direction === 'horizontal' ? pixels : 0,
                    direction === 'vertical' ? pixels : 0
                );
            }
        } catch {
            console.error(`❌ Failed to scroll to ${direction}`)
        }
    }

    static async scrollToEdge(page: Page,
        position: 'top' | 'bottom' = 'bottom',
        description: string = 'Page'
    ): Promise<void> {
        try {
            await page.evaluate(pos => {
                pos === 'bottom'
                    ? window.scrollTo(0, document.body.scrollHeight)
                    : window.scrollTo(0, 0);
            }, position);
        } catch {
            throw new Error(`❌ Failed to scroll ${description} to ${position}`);
        }
    }

    /**
    * Presses a single key on the keyboard.
    *
    * @param key - The key to press, e.g., 'Enter', 'Tab', 'Escape'
    * @param description - Optional description for logging
    */
    static async pressKey(page: Page, key: string, description: string = 'Key'): Promise<void> {
        try {
            await page.keyboard.press(key);
        } catch {
            console.error(`❌ Failed to press key: ${description}`);
        }
    }


    /**
     * Performs a keyboard shortcut (multiple keys pressed together).
     * @param page - Playwright Page object
     * @param keys - Array of keys to press together, e.g., ['Control', 'C'] or ['Meta', 'A']
     * @param description - Readable name for logging
     *
     * @example
     * await commonUtils.pressShortcutKey(['Control', 'C'], 'Copy');
     * await commonUtils.pressShortcutKey(['Control', 'V'], 'Paste');
     * await commonUtils.pressShortcutKey(['Control', 'Shift', 'S'], 'Save As');
     */
    static async pressShortcutKey(page: Page, keys: string[], description: string = 'Shortcut'): Promise<void> {
        try {
            const keyboard = page.keyboard;
            for (const key of keys) {
                await keyboard.down(key);
            }
            for (const key of keys.slice().reverse()) {
                await keyboard.up(key);
            }
        } catch {
            console.error(`❌ Failed to perform shortcut: ${description}`);
        }
    }

    /**
    * Clicks an element by Mouse action
    *
    * @param page - Playwright Page object
    * @param locator - Element to click
    * @param button - 'left' | 'right' | 'middle' (default: 'left')
    * @param clickCount - Number of clicks (1 for single, 2 for double)
    * @param description - Human-readable name for logging
    */
    static async clickByMouse(page: Page, locator: Locator, button: 'left' | 'right' | 'middle' = 'left',
        clickCount: number = 1, description: string = 'Element'
    ): Promise<void> {
        try {
            await this.waitForVisible(locator, undefined, description)
            await locator.click({ button, clickCount });
        } catch {
            console.error(`❌ Failed to click ${description}`);
        }
    }

    /**
    * Hovers over an element.
    *
    * @param page - Playwright Page object
    * @param locator - Element to hover
    * @param description - Readable Element name for logging
    */
    static async hover(page: Page, locator: Locator, description: string = 'Element'): Promise<void> {
        try {
            await this.waitForVisible(locator, undefined, description)
            await locator.hover();
        } catch {
            console.error(`❌ Failed to hover over ${description}`);
        }
    }

    /* Performs drag and drop from source to target element.
     *
     * @param page - Playwright Page object
     * @param source - Element to drag
     * @param target - Element to drop onto
     * @param description - Readable Element name for logging
     */
    static async dragAndDrop(page: Page, source: Locator, target: Locator, description: string = 'Element'
    ): Promise<void> {
        try {
            await source.waitFor({ state: 'visible', timeout: 10000 });
            await target.waitFor({ state: 'visible', timeout: 10000 });

            const sourceBox = await source.boundingBox();
            const targetBox = await target.boundingBox();
            if (!sourceBox || !targetBox) throw new Error('Bounding box not found');

            await page.mouse.move(
                sourceBox.x + sourceBox.width / 2,
                sourceBox.y + sourceBox.height / 2
            );
            await page.mouse.down();
            await page.mouse.move(
                targetBox.x + targetBox.width / 2,
                targetBox.y + targetBox.height / 2
            );
            await page.mouse.up();
        } catch {
            console.error(`❌ Failed to drag and drop ${description}`);
        }
    }
    /**
    * Scrolls the page using the mouse wheel.
    *
    * @param page - Playwright Page object
    * @param deltaX - Horizontal scroll pixels (default: 0)
    * @param deltaY - Vertical scroll pixels (default: 300)
    *
    * @example - Scroll the page vertically by 300 pixels
    * await commonUtils.scroll(page);
    *
    * @example - Scroll the page vertically by 500 pixels
    * await commonUtils.scroll(page, 0, 500);
    *
    * @example - Scroll the page horizontally by 400 pixels
    * await commonUtils.scroll(page, 400, 0);
    *
    * @example - Scroll both horizontally and vertically
    * await commonUtils.scroll(page, 200, 300);
    */
    static async scrollByMouseWheel(page: Page, deltaX: number = 0, deltaY: number = 300): Promise<void> {
        try {
            await page.mouse.wheel(deltaX, deltaY);
        } catch {
            console.error(`❌ Failed to scroll mouse by (${deltaX}, ${deltaY})`);
        }
    }
    static async scrollToBottom(page: Page, description = 'Page'): Promise<void> {
        try {
            for (let i = 0; i < 5; i++) {
                await page.mouse.wheel(0, 20000);
                await page.waitForTimeout(200);
            }
        } catch {
            throw new Error(`❌ Failed to scroll ${description} to bottom`);
        }
    }

    // static async isElementInViewport(locator: Locator): Promise<boolean> {
    //     return await locator.evaluate(el => {
    //       const rect = el.getBoundingClientRect();
    //       locato
    //       return (
    //         rect.top >= 0 &&
    //         rect.left >= 0 &&
    //         rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    //         rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    //       );
    //     });
    //   }
      

}