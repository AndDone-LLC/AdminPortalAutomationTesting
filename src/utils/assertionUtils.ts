import { expect } from '@playwright/test';
import { commonUtils } from './commonUtils';

export class AssertionUtils extends commonUtils {
    /**
      * Verifies that the actual value matches the expected value using deep equality.
      *
      * This assertion supports comparison of all data types including primitives,
      * objects, arrays, and nested structures. It performs a hard assertion using
      * Playwright's `expect`, causing the test to fail immediately on mismatch.
      *
      * Values are normalized before comparison to ensure consistency across
      * UI and API validations.
      *
      * @typeParam T - Type of the compared values
      * @param actual - The actual value obtained during test execution
      * @param expected - The expected value to compare against
      * @param message - Optional custom failure message
      *
      * @throws AssertionError if values are not equal
      */
    static verifyEquals<T>(actual: T, expected: T, message?: string
    ): void {
        const finalMessage = message
            ? `${message} | Expected: [${this.stringify(expected)}] | Actual: [${this.stringify(actual)}]`
            : `Expected: [${this.stringify(expected)}] | Actual: [${this.stringify(actual)}]`;

        const normActual = this.normalize(actual);
        const normExpected = this.normalize(expected);

        // Deep equality assertion works for all data types
        expect(normActual, finalMessage).toEqual(normExpected);
    }


    /**
     * Verifies that the given condition is TRUE.
     *
     * @param condition - Boolean condition to evaluate
     * @param message - Optional custom failure message
     *
     * @throws AssertionError if condition is false
     */
    static verifyTrue(condition: boolean, message?: string): void {
        const finalMessage = message
            ? `${message} | Actual value: [${condition}]`
            : `Expected condition to be TRUE, Actual [${condition}]`;

        expect(condition, finalMessage).toBeTruthy();
    }

    /**
     * Verifies that the given condition is FALSE.
     *
     * @param condition - Boolean condition to evaluate
     * @param message - Optional custom failure message
     *
     * @throws AssertionError if condition is true
     */
    static verifyFalse(condition: boolean, message?: string): void {
        const finalMessage = message
            ? `${message} | Actual value: [${condition}]`
            : `Expected condition to be FALSE, Actual [${condition}]`;

        expect(condition, finalMessage).toBeFalsy();
    }

    /**
     * Verifies that the actual numeric value is within the allowed tolerance.
     *
     * Commonly used for validating monetary amounts or calculated values.
     *
     * @param actual - The actual numeric value
     * @param expected - The expected numeric value
     * @param tolerance - Allowed deviation from expected value
     * @param message - Optional custom failure message
     *
     * @throws AssertionError if actual value exceeds tolerance
     */
    static verifyAmount(actual: number, expected: number, tolerance: number, message?: string
    ): void {
        const finalMessage = message
            ? `${message} | Expected: ${expected} ±${tolerance}, Actual: ${actual}`
            : `Expected ${expected} ±${tolerance}, Actual ${actual}`;

        expect(Math.abs(actual - expected), finalMessage)
            .toBeLessThanOrEqual(tolerance);
    }

    /**
    * Verifies that the provided value is defined (neither NULL nor UNDEFINED).
    *
    * This assertion ensures the value is usable and prevents null/undefined errors.
    * It covers both `null` and `undefined` cases.
    *
    * @param value - Value to validate
    * @param message - Optional custom failure message
    *
    * @throws AssertionError if value is null or undefined
    */
    static verifyNotNull(value: unknown, message?: string): void {
        const isDefinedAndNotNull = value !== null && value !== undefined;

        const finalMessage = message
            ? `${message} | Actual value: [${String(value)}]`
            : `Expected value to be defined (NOT NULL or UNDEFINED), Actual [${String(value)}]`;

        expect(isDefinedAndNotNull, finalMessage).toBeTruthy();
    }

    /**
     * Verifies that the provided value is NULL or UNDEFINED.
     *
     * @param value - Value to validate
     * @param message - Optional custom failure message
     *
     * @throws AssertionError if value is neither null nor undefined
     */
    static verifyNullOrUndefined(value: unknown, message?: string): void {
        const isNullOrUndefined = value === null || value === undefined;

        const finalMessage = message
            ? `${message} | Actual value: [${String(value)}]`
            : `Expected value to be NULL or UNDEFINED, Actual [${String(value)}]`;

        expect(isNullOrUndefined, finalMessage).toBeTruthy();
    }
    /**
     * Verifies that the provided string or array is NOT EMPTY.
     *
     * @param value - String or array to validate
     * @param message - Optional custom failure message
     *
     * @throws AssertionError if value is empty
     */
    static verifyNotEmpty(value: string | any[], message?: string): void {
        const normalized = this.normalize(value);

        let isNotEmpty = false;
        let actualInfo = '';

        if (typeof normalized === 'string' || Array.isArray(normalized)) {
            isNotEmpty = normalized.length > 0;
            actualInfo = `length=${normalized.length}`;
        } else if (typeof normalized === 'object' && normalized !== null) {
            const keys = Object.keys(normalized);
            isNotEmpty = keys.length > 0;
            actualInfo = `keys=${keys.length}`;
        } else {
            actualInfo = String(normalized);
        }

        const finalMessage = message
            ? `${message} | Actual: ${actualInfo}`
            : `Expected value to be NOT EMPTY, Actual: ${actualInfo}`;

        expect(value, finalMessage).not.toHaveLength(0);
    }

    /**
     *This method soft verify equality for any type of data and
     *  supports comparison of all data types including primitives, objects,
     * arrays, and nested structures. It uses Playwright's `expect.soft` assertion,
     * allowing test execution to continue even if the assertion fails.
     *
     * @param actual   Actual value
     * @param expected Expected value
     * @param message  Optional custom message
     */
    static softVerifyEquals<T>(actual: T, expected: T, message?: string
    ): void {
        const finalMessage = message
            ? `${message} | Expected: [${this.stringify(expected)}] | Actual: [${this.stringify(actual)}]`
            : `Expected: [${this.stringify(expected)}] | Actual: [${this.stringify(actual)}]`;

        const normActual = this.normalize(actual);
        const normExpected = this.normalize(expected);

        // toEqual works for all types
        expect.soft(normActual, finalMessage).toEqual(normExpected);
    }

    /**
     * Softly verifies that the given condition is TRUE.
     *
     * @param condition - Boolean condition to evaluate
     * @param message - Optional custom failure message
     */
    static softVerifyTrue(condition: boolean, message?: string): void {
        const finalMessage = message
            ? `${message} | Actual value: [${condition}]`
            : `Expected condition to be TRUE, Actual [${condition}]`;

        expect.soft(condition, finalMessage).toBeTruthy();
    }

    /**
     * Softly verifies that the given condition is FALSE.
     *
     * @param condition - Boolean condition to evaluate
     * @param message - Optional custom failure message
     */
    static softVerifyFalse(condition: boolean, message?: string): void {
        const finalMessage = message
            ? `${message} | Actual value: [${condition}]`
            : `Expected condition to be FALSE, Actual [${condition}]`;

        expect.soft(condition, finalMessage).toBeFalsy();
    }

    /**
     * Softly verifies that the actual numeric value is within the allowed tolerance.
     *
     * Commonly used for validating monetary amounts or calculated values.
     *
     * @param actual - The actual numeric value
     * @param expected - The expected numeric value
     * @param tolerance - Allowed deviation from expected value
     * @param message - Optional custom failure message
     */
    static softVerifyAmount(actual: number, expected: number, tolerance: number, message?: string
    ): void {
        const finalMessage = message
            ? `${message} | Expected: ${expected} ±${tolerance}, Actual: ${actual}`
            : `Expected ${expected} ±${tolerance}, Actual ${actual}`;
        expect.soft(
            Math.abs(actual - expected),
            finalMessage
        ).toBeLessThanOrEqual(tolerance);
    }
    /**
    *
    * This soft assertion ensures the value is usable and prevents null/undefined errors.
    * Unlike a hard assertion, the test continues even if the value is null or undefined.
    *
    * @param value - Value to validate
    * @param message - Optional custom failure message
    */
    static softVerifyNullOrUndefined(value: unknown, message?: string): void {
        const isNullOrUndefined = value === null || value === undefined;

        const finalMessage = message
            ? `${message} | Actual value: [${String(value)}]`
            : `Expected value to be NULL or UNDEFINED, but found [${String(value)}]`;

        expect.soft(isNullOrUndefined, finalMessage).toBeTruthy();
    }

    /**
     * Softly verifies that the provided value is NULL.
     *
     * @param value - Value to validate
     * @param message - Optional custom failure message
     */
    static softVerifyNull(value: unknown, message?: string): void {
        const finalMessage = message
            ? `${message} | Actual value: [${value}]`
            : `Expected value to be NULL, Actual [${value}]`;

        expect.soft(value, finalMessage).toBeNull();
    }

    /**
     * Softly verifies that the provided value is NOT EMPTY.
     *
     * Supports:
     * - string
     * - array
     * - object
     * - Map / Set (via normalize)
     *
     * @param value - Value to validate
     * @param message - Optional custom failure message
     */
    static softVerifyNotEmpty(value: unknown, message?: string): void {
        const normalized = this.normalize(value);

        let isNotEmpty = false;
        let actualInfo = '';

        if (typeof normalized === 'string' || Array.isArray(normalized)) {
            isNotEmpty = normalized.length > 0;
            actualInfo = `length=${normalized.length}`;
        } else if (typeof normalized === 'object' && normalized !== null) {
            const keys = Object.keys(normalized);
            isNotEmpty = keys.length > 0;
            actualInfo = `keys=${keys.length}`;
        } else {
            actualInfo = String(normalized);
        }

        const finalMessage = message
            ? `${message} | Actual: ${actualInfo}`
            : `Expected value to be NOT EMPTY, Actual: ${actualInfo}`;

        expect.soft(isNotEmpty, finalMessage).toBeTruthy();
    }
    /**
     * Softly verifies that the actual string contains the expected substring.
     *
     * @param actual - Actual string
     * @param expected - Substring expected to be present
     * @param message - Optional custom failure message
     */
    static softVerifyContains(actual: string, expected: string, message?: string
    ): void {
        const isContains = actual.includes(expected);
        const finalMessage = message
            ? `${message} | Expected to contain [${expected}], Actual [${actual}]`
            : `Expected string to contain [${expected}], Actual [${actual}]`;
        expect.soft(isContains, finalMessage).toBeTruthy();
    }

    /**
     * Softly verifies that the actual string NOT contains the expected substring.
     *
     * @param actual - Actual string
     * @param expected - Substring expected to be present
     * @param message - Optional custom failure message
     */
    static softVerifyNotContains(actual: string, expected: string, message?: string
    ): void {
        const isNotContains = !actual.includes(expected);

        const finalMessage = message
            ? `${message} | Expected NOT to contain [${expected}], Actual [${actual}]`
            : `Expected string NOT to contain [${expected}], but found [${actual}]`;

        expect.soft(isNotContains, finalMessage).toBeTruthy();
    }

    /**
    * Softly verifies that two values are NOT equal.
    *
    * Supports all data types via normalization.
    *
    * @typeParam T - Type of compared values
    * @param actual - Actual value
    * @param expected - Value that actual must NOT equal
    * @param message - Optional custom failure message
     */
    static softVerifyNotEquals<T>(actual: T, expected: T, message?: string
    ): void {
        const normActual = this.normalize(actual);
        const normExpected = this.normalize(expected);

        const isNotEqual =
            JSON.stringify(normActual) !== JSON.stringify(normExpected);

        const finalMessage = message
            ? `${message} | Not Expected: [${this.stringify(expected)}], Actual: [${this.stringify(actual)}]`
            : `Expected values to be DIFFERENT, Actual both were [${this.stringify(actual)}]`;

        expect.soft(isNotEqual, finalMessage).toBeTruthy();
    }

    /**
     * Softly verifies that date list is sorted from newest to oldest.
     *
     * @param actual - Dates from UI
     * @param format - Date format
     * @param message - Optional failure message
     */
    static softVerifyDatesNewestToOldest(actual: string[], format: string, message?: string
    ): void {
        const expected = this.sortDateNewestToOldest(actual, format);

        const finalMessage = message
            ? `${message} | Actual order: [${actual.join(' | ')}]`
            : `Expected dates sorted from NEWEST to OLDEST but found [${actual.join(' | ')}]`;

        expect.soft(actual, finalMessage).toEqual(expected);
    }

    /**
     * Softly verifies that date list is sorted from oldest to newest.
     */
    static softVerifyDatesOldestToNewest(actual: string[], format: string, message?: string
    ): void {
        const expected = this.sortDateOldestToNewest(actual, format);

        const finalMessage = message
            ? `${message} | Actual order: [${actual.join(' | ')}]`
            : `Expected dates sorted from OLDEST to NEWEST but found [${actual.join(' | ')}]`;

        expect.soft(actual, finalMessage).toEqual(expected);
    }

    /**
    * Normalizes complex data types into comparable primitive or array formats.
    *
    * This method is used before assertions to ensure consistent comparisons
    * across different data types. It transforms certain objects into
    * standard representations that can be reliably compared using deep equality.
    *
    * Supported transformations:
    * - `Map` → Array of `[key, value]` pairs
    * - `Set` → Array of values
    * - `Date` → Unix timestamp (milliseconds)
    * - `RegExp` → String representation
    *
    * @param value - The value to normalize
    * @returns A normalized version of the value suitable for comparison
    */
    private static normalize(value: unknown): unknown {
        if (value instanceof Map) {
            return Array.from(value.entries());
        }
        if (value instanceof Set) {
            return Array.from(value.values());
        }
        if (value instanceof Date) {
            return value.getTime();
        }
        if (value instanceof RegExp) {
            return value.toString();
        }
        return value;
    }

    /**
     * Converts a value into a readable string representation for logging or
     * assertion messages.
     *
     * This method ensures that complex data types like `Map`, `Set`, and
     * objects are serialized into a human-readable JSON format, while
     * primitives are converted to strings. This helps in generating
     * meaningful assertion messages and logs.
     *
     * Supported transformations:
     * - `Map` → JSON array of `[key, value]` pairs
     * - `Set` → JSON array of values
     * - `Object` → JSON string
     * - Other types → String conversion
     *
     * @param value - The value to stringify
     * @returns A string representation of the value
     */
    private static stringify(value: unknown): string {
        try {
            if (value instanceof Map) {
                return JSON.stringify(Array.from(value.entries()));
            }
            if (value instanceof Set) {
                return JSON.stringify(Array.from(value.values()));
            }
            if (typeof value === 'object' && value !== null) {
                return JSON.stringify(value);
            }
            return String(value);
        } catch {
            return String(value);
        }
    }


}




