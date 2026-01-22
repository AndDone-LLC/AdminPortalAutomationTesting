import { addDays, addMonths, addYears, format, isValid, parse } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

import {
    COUNTRY_CODES, EMAIL_DOMAINS, FIRST_NAMES, INDIA_LOCATIONS,
    LAST_NAMES, LOREM_WORDS, STREET_NAMES, USA_LOCATIONS
} from "./fakerStaticData";

export class GenerationUtils {
    /**
         * Returns a random integer between min and max (inclusive).
         *
         * @param min Minimum number (inclusive)
         * @param max Maximum number (inclusive)
         * @returns Random number between min and max
         *
         * Example:
         * randomNumber(1, 10) → 7
         */
    static randomNumber(min: number, max: number): number {
        try {
            if (min > max) {
                return 0;
            }

            return Math.floor(Math.random() * (max - min + 1)) + min;
        } catch {
            return 0;
        }
    }

    /**
     * Returns a random floating-point number between min and max.
     *
     * @param min Minimum number
     * @param max Maximum number
     * @param decimals Number of decimal places (default: 2)
     * @returns Random float between min and max
     *
     * Example:
     * randomFloat(1, 5, 2) → 3.47
     */
    static randomFloat(min: number, max: number, decimals: number = 2): number {
        try {
            if (min > max) {
                return 0;
            }

            const value = Math.random() * (max - min) + min;
            return Number(value.toFixed(decimals));
        } catch {
            return 0;
        }
    }

    /**
     * Returns a random boolean value.
     *
     * @returns true or false
     *
     * Example:
     * randomBoolean() → true
     */
    static randomBoolean(): boolean {
        try {
            return Math.random() < 0.5;
        } catch {
            return false;
        }
    }

    /**
     * Returns a random element from an array.
     *
     * @param values Array of values
     * @returns Random element or null if array is empty
     *
     * Example:
     * randomFromArray(["A", "B", "C"]) → "B"
     */
    static randomFromArray<T>(values: T[]): T | null {
        try {
            if (!values || values.length === 0) return null;

            const index = Math.floor(Math.random() * values.length);
            return values[index];
        } catch {
            return null;
        }
    }

    /**
     * Returns a random valid index for an array.
     *
     * @param max Length of the array       
     * @returns Random index between 0 and max - 1
     *
     * Example:
     * randomIndex(5) → 3
     */
    static randomIndex(max: number): number {
        try {
            if (max <= 0) {
                return 0;
            }

            return Math.floor(Math.random() * max);
        } catch {
            return 0;
        }
    }

    /**
     * Returns a random alphabetic string (A–Z, a–z).
     *
     * @param length Length of the string
     * @returns Random alphabetic string
     *
     * Example:
     * randomAlphaString(5) → "aZxQe"
     */
    static randomAlphaString(length: number): string {
        try {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            return this.generateRandomFromCharset(chars, length);
        } catch {
            return "";
        }
    }

    /**
     * Returns a random numeric string (0–9).
     *
     * @param length Length of the string
     * @returns Random numeric string
     *
     * Example:
     * randomNumericString(4) → "4829"
     */
    static randomNumericString(length: number): string {
        try {
            const chars = "0123456789";
            return this.generateRandomFromCharset(chars, length);
        } catch {
            return "";
        }
    }

    /**
     * Returns a random alphanumeric string (letters + numbers).
     *
     * @param length Length of the string
     * @returns Random alphanumeric string
     *
     * Example:
     * randomAlphaNumericString(8) → "A9bX2Lq7"
     */
    static randomAlphaNumericString(length: number): string {
        try {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            return this.generateRandomFromCharset(chars, length);
        } catch {
            return "";
        }
    }

    /**
     * Internal helper to generate random string from a given character set.
     *
     * @param chars Allowed characters
     * @param length Length of string
     * @returns Random string
     */
    private static generateRandomFromCharset(chars: string, length: number): string {
        try {
            if (length <= 0) return "";

            let result = "";
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        } catch {
            return "";
        }
    }

    /**
     * Returns a random first name.
     *
     * @returns Random first name
     *
     * Example:
     * randomFirstName() → "Rahul"
     */
    static randomFirstName(): string {
        try {
            return FIRST_NAMES[
                Math.floor(Math.random() * FIRST_NAMES.length)
            ];
        } catch {
            return "";
        }
    }

    /**
     * Returns a random last name.
     *
     * @returns Random last name
     *
     * Example:
     * randomLastName() → "Sharma"
     */
    static randomLastName(): string {
        try {
            return LAST_NAMES[
                Math.floor(Math.random() * LAST_NAMES.length)
            ];
        } catch {
            return "";
        }
    }

    /**
     * Returns a random full name (first name + last name).
     *
     * @returns Random full name
     *
     * Example:
     * randomFullName() → "Rahul Sharma"
     */
    static randomFullName(): string {
        try {
            return `${this.randomFirstName()} ${this.randomLastName()}`;
        }
        catch {
            return "";
        }
    }

    /**
     * Returns a random username generated from name and number.
     *
     * @returns Random username
     *
     * Example:
     * randomUsername() → "rahul.sharma482"
     */
    static randomUsername(): string {
        try {
            const first = this.randomFirstName().toLowerCase();
            const last = this.randomLastName().toLowerCase();
            const number = Math.floor(Math.random() * 1000);

            return `${first}.${last}${number}`;
        } catch {
            return "";
        }
    }

    /**
     * Returns a random email address.
     *
     * @returns Random email string
     *
     * Example:
     * randomEmail() → "rahul.sharma482@gmail.com"
     */
    static randomEmail(): string {
        try {
            const first = this.randomFirstName().toLowerCase();
            const last = this.randomLastName().toLowerCase();
            const number = Math.floor(Math.random() * 1000);
            const domain = EMAIL_DOMAINS[
                Math.floor(Math.random() * EMAIL_DOMAINS.length)
            ];

            return `${first}.${last}${number}@${domain}`;
        } catch {
            return "";
        }
    }

    /**
     * Returns a random country calling code.
     *
     * @returns Country code string (e.g. "+91")
     *
     * Example:
     * randomCountryCode() → "+91"
     */
    static randomCountryCode(): string {
        try {
            return COUNTRY_CODES[
                Math.floor(Math.random() * COUNTRY_CODES.length)
            ];
        } catch {
            return "";
        }
    }

    /**
     * Returns a random phone number with country code.
     *
     * @returns Phone number string
     *
     * Example:
     * randomPhoneNumber() → "+91 9876543210"
     */
    static randomPhoneNumber(): string {
        try {
            const countryCode = this.randomCountryCode();

            // Generate a 10-digit phone number
            let number = "";
            for (let i = 0; i < 10; i++) {
                number += Math.floor(Math.random() * 10);
            }

            return `${countryCode} ${number}`;
        } catch {
            return "";
        }
    }

    /**
     * Returns a random US phone number.
     *
     * Format: +1 XXX-XXX-XXXX
     *
     * @returns US phone number string
     *
     * Example:
     * getRandomUSPhoneNumber() → "+1 415-782-3490"
     */
    static getRandomUSPhoneNumber(): string {
        try {
            const countryCode = "+1";

            // Area code (2–9 followed by 2 digits)
            const areaCode =
                Math.floor(Math.random() * 8 + 2).toString() +
                Math.floor(Math.random() * 10) +
                Math.floor(Math.random() * 10);

            // Exchange code (2–9 followed by 2 digits)
            const exchangeCode =
                Math.floor(Math.random() * 8 + 2).toString() +
                Math.floor(Math.random() * 10) +
                Math.floor(Math.random() * 10);

            // Line number (4 digits)
            const lineNumber =
                Math.floor(1000 + Math.random() * 9000);

            return `${countryCode} ${areaCode}-${exchangeCode}-${lineNumber}`;
        } catch {
            return "";
        }
    }

    /**
     * Generates a random user object containing basic identity and contact details.
     *
     * @returns Generated fields include:
     * - First name
     * - Last name
     * - Full name (first + last)
     * - Username (lowercased name with numeric suffix)
     * - Email address (using common email domains)
     * 
     * - Generic phone number (with random country code)
     * - US-specific phone number
     */
    static generateUserObject(): { firstName: string; lastName: string; fullName: string; username: string; email: string; phoneNo: string; usPhone: string; } {
        try {
            const firstName = this.randomFirstName();
            const lastName = this.randomLastName();

            const fullName = firstName + " " + lastName;
            const number = Math.floor(Math.random() * 1000);
            const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${number}`;
            const domain = EMAIL_DOMAINS[Math.floor(Math.random() * EMAIL_DOMAINS.length)];

            const email = `${firstName}.${lastName}${number}@${domain}`;
            const phoneNo = this.randomPhoneNumber();

            const usPhone = this.getRandomUSPhoneNumber();
            return {
                firstName,
                lastName,
                fullName,
                username,
                email,
                phoneNo,
                usPhone,
            }
        } catch {
            return {
                firstName: "",
                lastName: "",
                fullName: "",
                username: "",
                email: "",
                phoneNo: "",
                usPhone: "",
            };
        }
    }

    private static generateIndiaPincode(prefix: string): string {
        try {
            let pincode = prefix;
            for (let i = 0; i < 5; i++) {
                pincode += Math.floor(Math.random() * 10);
            }
            return pincode;
        } catch {
            return "";
        }
    }

    /**
     * Returns a random India location (country, state, city).
     *
     * @returns Object containing country, state, and city
     *
     * Example:
     * getRandomIndiaLocation()
     * → { country: "India", state: "Karnataka", city: "Bengaluru", pincode: "560102" }
     */
    static getRandomIndiaLocation(): { country: string; state: string; city: string; pincode: string; } {
        try {
            const stateObj = INDIA_LOCATIONS[Math.floor(Math.random() * INDIA_LOCATIONS.length)];

            const city = stateObj.cities[Math.floor(Math.random() * stateObj.cities.length)];
            const pincode = this.generateIndiaPincode(stateObj.pincodePrefix);

            return {
                country: "India",
                state: stateObj.state,
                city,
                pincode
            };
        } catch {
            return {
                country: "",
                state: "",
                city: "",
                pincode: ""
            };
        }
    }

    private static generateUSZipCode(): string {
        try {
            let zip = "";
            for (let i = 0; i < 5; i++) {
                zip += Math.floor(Math.random() * 10);
            }
            return zip;
        } catch {
            return "";
        }
    }


    /**
     * Returns a random USA location (country, state, city).
     *
     * @returns Object containing country, state, and city
     *
     * Example:
     * getRandomUSALocation()
     * → { country: "United States", state: "California", city: "San Diego" }
     */
    static getRandomUSALocation(): { country: string; state: string; city: string; zipCode: string; } {
        try {
            const stateObj = USA_LOCATIONS[Math.floor(Math.random() * USA_LOCATIONS.length)];

            const city = stateObj.cities[Math.floor(Math.random() * stateObj.cities.length)];

            return {
                country: "United States",
                state: stateObj.state,
                city,
                zipCode: this.generateUSZipCode()
            };
        } catch {
            return {
                country: "",
                state: "",
                city: "",
                zipCode: ""
            };
        }
    }

    /**
     * Returns a random address line.
     *
     * @returns Random address line
     *
     * Example:
     * randomAddressLine() → "Flat 302, MG Road"
     */
    static randomAddressLine(): string {
        try {
            const buildingNumber = Math.floor(Math.random() * 900) + 100;
            const street =
                STREET_NAMES[Math.floor(Math.random() * STREET_NAMES.length)];

            return `Flat ${buildingNumber}, ${street}`;
        } catch {
            return "";
        }
    }

    /**
     * Returns a random UUID.
     *
     * @returns Random UUID string
     *
     * Example:
     * randomUUID() → "f47ac10b-58cc-4372-a567-0e02b2c3d479"
     */
    static randomUUID(): string {
        try {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, char => {
                const rand = Math.random() * 16 | 0;
                const value = char === "x" ? rand : (rand & 0x3 | 0x8);
                return value.toString(16);
            });
        } catch {
            return "";
        }
    }

    /**
     * Returns a random lorem sentence.
     *
     * @param wordCount Optional number of words in the sentence
     * @returns Random lorem sentence string
     *
     * Example:
     * randomLoremSentence() → "Lorem ipsum dolor sit amet."
     * randomLoremSentence(8) → "Lorem ipsum dolor sit amet consectetur elit."
     */
    static randomLoremSentence(wordCount: number = 8): string {
        try {
            if (wordCount <= 0) return "";

            const words: string[] = [];

            for (let i = 0; i < wordCount; i++) {
                words.push(LOREM_WORDS[i % LOREM_WORDS.length]);
            }

            const sentence =
                words.join(" ").charAt(0).toUpperCase() +
                words.join(" ").slice(1) +
                ".";

            return sentence;
        } catch {
            return "";
        }
    }

    /**
     * Returns the current date formatted in the given timezone.
     *
     * @param timezone IANA timezone
     * @param format date-fns format string
     * @returns formatted date string
     *
     * Example:
     * getCurrentDateByTimezoneFormat("Asia/Kolkata", "dd/MM/yyyy") → "07/01/2026"
     */
    static getCurrentDateByTimezoneFormat(timezone: string, format: string): string {
        try {
            const currentDate = new Date();
            return formatInTimeZone(currentDate, timezone, format);
        } catch {
            return "";
        }
    }

    /**
     * Parses a date string using the provided format.
     *
     * @param dateStr input date string
     * @param format date-fns format describing the input
     * @returns Date object if valid, otherwise null
     *
     * Example:
     * parseDate("02/Jan/2003", "dd/MMM/yyyy") -> 2003-01-01T18:30:00.000Z
     */
    static parseDate(dateStr: string, format: string): Date | null {
        try {
            if (!dateStr || !format) return null;

            const parsedDate = parse(dateStr, format, new Date());
            return isValid(parsedDate) ? parsedDate : null;
        } catch {
            return null;
        }
    }

    /**
     * Converts a date string from one format to another.
     *
     * @param dateStr input date string
     * @param inputFormat format of input string
     * @param outputFormat desired output format
     * @returns formatted date string or null if invalid
     *
     * Example:
     * convertDateFormat("2026-01-07", "yyyy-MM-dd", "dd/MM/yyyy") → "07/01/2026"
     */
    static convertDateFormat(dateStr: string, inputFormat: string, outputFormat: string) {
        try {
            if (!dateStr || !inputFormat || !outputFormat) return null;

            const parsedDate = this.parseDate(dateStr, inputFormat);
            if (parsedDate == null) return null;

            return format(parsedDate, outputFormat);
        } catch {
            return null;
        }
    }

    /**
     * Removes the time portion from a Date and normalizes it to local midnight.
     *
     * @param date Date object
     * @returns Date with time set to 00:00 or null if invalid
     *
     * Example:
     * normalizeToDateOnly(new Date("2026-01-07T10:30:00")) -> 2024-01-14T18:30:00.000Z
     */
    static normalizeToDateOnly(date: Date): Date | null {
        try {
            if (!isValid(date)) return null;
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        } catch {
            return null;
        }
    }


    /**
     * Adjusts a date by adding or subtracting days, months, and/or years.
     *
     * Positive values add time, negative values subtract time.
     *
     * @param date Base date to adjust
     * @param options Object containing days, months, and/or years
     * @returns Adjusted Date or null if input date is invalid
     *
     * Example:
     * adjustDate(new Date(), { days: 5 })
     * adjustDate(new Date(), { months: -2 })
     * adjustDate(new Date(), { years: 1, days: 10 })
     */
    static adjustDate(date: Date, options: { days?: number; months?: number; years?: number }): Date | null {
        try {
            if (!isValid(date)) return null;

            let result = date;

            if (options.years) {
                result = addYears(result, options.years);
            }

            if (options.months) {
                result = addMonths(result, options.months);
            }

            if (options.days) {
                result = addDays(result, options.days);
            }

            return result;
        } catch {
            return null;
        }
    }

    /**
     * Extracts day, month, and year from a Date object.
     *
     * @param date Date object
     * @returns {{ day: number; month: number; year: number } | null}
     * Object containing day (1–31), month (1–12), and year
     */
    static getDayMonthYear(date: Date): { day: number; month: number; year: number } | null {
        try {
            if (!(date instanceof Date) || !isValid(date)) return null;

            return {
                day: date.getDate(),
                month: date.getMonth() + 1,
                year: date.getFullYear()
            };
        } catch {
            return null;
        }
    }

    /**
     * Splits a string using a string or regex delimiter.
     *
     * @param value Input string to split
     * @param delimiter String or RegExp used as delimiter
     * @returns Array of split values (trimmed, non-empty)
     *
     * Examples:
     * splitByDelimiter("A,B,C", ",") → ["A", "B", "C"]
     * splitByDelimiter("A | B | C", "|") → ["A", "B", "C"]
     * splitByDelimiter("A,B;C|D", /[,;|]/) → ["A", "B", "C", "D"]
     */
    static splitByDelimiter(value: string, delimiter: string | RegExp): string[] {
        try {
            if (!value || !delimiter) return [];

            return value
                .split(delimiter)
                .map(item => item.trim())
                .filter(item => item.length > 0);
        } catch {
            return [];
        }
    }

    /**
     * Returns the first regex match found in a string.
     *
     * If the regex contains capturing groups, the full match is returned.
     *
     * @param value Input string
     * @param pattern Regular expression
     * @returns First matched string or null if no match
     *
     * Example:
     * getFirstMatch("Amount: $250", /\d+/) → "250"
     */
    static getFirstMatch(value: string, pattern: RegExp): string | null {
        try {
            if (!value || !pattern) return null;

            const match = value.match(pattern);
            return match ? match[0] : null;
        } catch {
            return null;
        }
    }

    /**
     * Returns all matches of a regex pattern found in a string.
     *
     * Note: For full functionality, the regex should have the global (g) flag.
     *
     * @param value Input string
     * @param pattern Regular expression (preferably with /g)
     * @returns Array of matched strings (empty array if no matches)
     *
     * Example:
     * getAllMatches("IDs: 12, 45, 78", /\d+/g) → ["12", "45", "78"]
     */
    static getAllMatches(value: string, pattern: RegExp): string[] {
        try {
            if (!value || !pattern) return [];

            const matches = value.match(pattern);
            return matches ? matches : [];
        } catch {
            return [];
        }
    }

    /**
   * This method is to get total technology fee
   * @since 13-01-2026
   * @param fixedFee number
   * @param percentageFee number
   * @param amount number
   * @returns number | null
   */
    static getTotalFees(
        fixedFee: number,
        percentageFee: number,
        amount: number
    ): number | null {
        try {
            if (
                isNaN(fixedFee) ||
                isNaN(percentageFee) ||
                isNaN(amount)
            ) {
                throw new Error('Invalid number input');
            }

            const totalTechFees = (amount / 100) * percentageFee + fixedFee;
            return totalTechFees;

        } catch {
            return null;
        }
    }

    /**
     * This method is get total amount as per passed fixed & percentage fee and amount
     * @since 13-01-2026
     * @param fixedFee number
     * @param percentageFee number
     * @param amount number
     * @returns number | null
     */
    static getTotalAmount(
        fixedFee: number,
        percentageFee: number,
        amount: number
    ): number | null {
        try {
            const techFee = this.getTotalFees(
                fixedFee,
                percentageFee,
                amount
            );

            if (techFee === null) {
                throw new Error('Fee calculation failed');
            }

            return techFee + amount;

        } catch {
            return null;
        }
    }
}