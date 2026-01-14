import { expect } from '@playwright/test';

export class AssertionUtils {
    /**
       * Verifies that two values are strictly equal.
       *
       * @typeParam T - Type of the compared values
       * @param actual - The actual value obtained during test execution
       * @param expected - The expected value to compare against
       * @param message - Optional custom failure message
       *
       * @throws AssertionError if values are not equal
       */
    static verifyEquals<T>(actual: T, expected: T, message?: string): void {
        expect(actual, message ?? `Expected [${expected}] but found [${actual}]`
        ).toBe(expected);
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
        expect(condition, message ?? 'Expected condition to be TRUE'
        ).toBeTruthy();
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
        expect(
            condition,
            message ?? 'Expected condition to be FALSE'
        ).toBeFalsy();
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
        expect(
            Math.abs(actual - expected),
            message ?? `Expected ${expected} ±${tolerance}, but found ${actual}`
        ).toBeLessThanOrEqual(tolerance);
    }

    /**
     * Verifies that the provided value is NOT NULL.
     *
     * @param value - Value to validate
     * @param message - Optional custom failure message
     *
     * @throws AssertionError if value is null
     */
    static verifyNotNull(value: unknown, message?: string): void {
        expect(value, message ?? 'Expected value to be NOT NULL'
        ).not.toBeNull();
    }

    /**
     * Verifies that the provided value is NULL.
     *
     * @param value - Value to validate
     * @param message - Optional custom failure message
     *
     * @throws AssertionError if value is not null
     */
    static verifyNull(value: unknown, message?: string): void {
        expect(value, message ?? 'Expected value to be NULL'
        ).toBeNull();
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
        expect(value, message ?? 'Expected value to be NOT EMPTY'
        ).not.toHaveLength(0);
    }

    /**
     * Softly verifies that two values are strictly equal.
     *
     * Test execution continues even if this assertion fails.
     *
     * @typeParam T - Type of the compared values
     * @param actual - The actual value obtained during test execution
     * @param expected - The expected value to compare against
     * @param message - Optional custom failure message
     */
    static softVerifyEquals<T>(actual: T, expected: T, message?: string): void {
        expect.soft(
            actual,
            message ?? `Expected [${expected}] but found [${actual}]`
        ).toBe(expected);
    }

    /**
     * Softly verifies that the given condition is TRUE.
     *
     * @param condition - Boolean condition to evaluate
     * @param message - Optional custom failure message
     */
    static softVerifyTrue(condition: boolean, message?: string): void {
        expect.soft(
            condition,
            message ?? 'Expected condition to be TRUE'
        ).toBeTruthy();
    }

    /**
     * Softly verifies that the given condition is FALSE.
     *
     * @param condition - Boolean condition to evaluate
     * @param message - Optional custom failure message
     */
    static softVerifyFalse(condition: boolean, message?: string): void {
        expect.soft(
            condition,
            message ?? 'Expected condition to be FALSE'
        ).toBeFalsy();
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
    static softVerifyAmount(
        actual: number,
        expected: number,
        tolerance: number,
        message?: string
    ): void {
        expect.soft(
            Math.abs(actual - expected),
            message ?? `Expected ${expected} ±${tolerance}, but found ${actual}`
        ).toBeLessThanOrEqual(tolerance);
    }

    /**
     * Softly verifies that the provided value is NOT NULL.
     *
     * @param value - Value to validate
     * @param message - Optional custom failure message
     */
    static softVerifyNotNull(value: unknown, message?: string): void {
        expect.soft(
            value,
            message ?? 'Expected value to be NOT NULL'
        ).not.toBeNull();
    }

    /**
     * Softly verifies that the provided value is NULL.
     *
     * @param value - Value to validate
     * @param message - Optional custom failure message
     */
    static softVerifyNull(value: unknown, message?: string): void {
        expect.soft(
            value,
            message ?? 'Expected value to be NULL'
        ).toBeNull();
    }

    /**
     * Softly verifies that the provided string or array is NOT EMPTY.
     *
     * @param value - String or array to validate
     * @param message - Optional custom failure message
     */
    static softVerifyNotEmpty(value: string | any[], message?: string): void {
        expect.soft(
            value,
            message ?? 'Expected value to be NOT EMPTY'
        ).not.toHaveLength(0);
    }
}


