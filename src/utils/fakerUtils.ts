import { COUNTRY_CODES, EMAIL_DOMAINS, FIRST_NAMES, INDIA_LOCATIONS, LAST_NAMES, LOREM_WORDS, STREET_NAMES, USA_LOCATIONS } from "./fakerStaticData";

export class FakerUtils {

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
        if (min > max) {
            throw new Error("min cannot be greater than max");
        }

        return Math.floor(Math.random() * (max - min + 1)) + min;
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
        if (min > max) {
            throw new Error("min cannot be greater than max");
        }

        const value = Math.random() * (max - min) + min;
        return Number(value.toFixed(decimals));
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
        return Math.random() < 0.5;
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
        if (!values || values.length === 0) return null;

        const index = Math.floor(Math.random() * values.length);
        return values[index];
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
        if (max <= 0) {
            throw new Error("max must be greater than 0");
        }

        return Math.floor(Math.random() * max);
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
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        return this.generateRandomFromCharset(chars, length);
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
        const chars = "0123456789";
        return this.generateRandomFromCharset(chars, length);
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
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        return this.generateRandomFromCharset(chars, length);
    }

    /**
     * Internal helper to generate random string from a given character set.
     *
     * @param chars Allowed characters
     * @param length Length of string
     * @returns Random string
     */
    private static generateRandomFromCharset(chars: string, length: number): string {
        if (length <= 0) return "";

        let result = "";
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
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
        return FIRST_NAMES[
            Math.floor(Math.random() * FIRST_NAMES.length)
        ];
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
        return LAST_NAMES[
            Math.floor(Math.random() * LAST_NAMES.length)
        ];
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
        return `${this.randomFirstName()} ${this.randomLastName()}`;
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
        const first = this.randomFirstName().toLowerCase();
        const last = this.randomLastName().toLowerCase();
        const number = Math.floor(Math.random() * 1000);

        return `${first}.${last}${number}`;
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
        const first = this.randomFirstName().toLowerCase();
        const last = this.randomLastName().toLowerCase();
        const number = Math.floor(Math.random() * 1000);
        const domain = EMAIL_DOMAINS[
            Math.floor(Math.random() * EMAIL_DOMAINS.length)
        ];

        return `${first}.${last}${number}@${domain}`;
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
        return COUNTRY_CODES[
            Math.floor(Math.random() * COUNTRY_CODES.length)
        ];
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
        const countryCode = this.randomCountryCode();

        // Generate a 10-digit phone number
        let number = "";
        for (let i = 0; i < 10; i++) {
            number += Math.floor(Math.random() * 10);
        }

        return `${countryCode} ${number}`;
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
        var firstName = this.randomFirstName();
        var lastName = this.randomLastName();

        var fullName = firstName + " " + lastName;
        const number = Math.floor(Math.random() * 1000);
        var username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${number}`;
        const domain = EMAIL_DOMAINS[Math.floor(Math.random() * EMAIL_DOMAINS.length)];

        var email = `${firstName}.${lastName}${number}@${domain}`;
        var phoneNo = this.randomPhoneNumber();

        var usPhone = this.getRandomUSPhoneNumber();
        return {
            firstName,
            lastName,
            fullName,
            username,
            email,
            phoneNo,
            usPhone,
        }
    }

    private static generateIndiaPincode(prefix: string): string {
        let pincode = prefix;
        for (let i = 0; i < 5; i++) {
            pincode += Math.floor(Math.random() * 10);
        }
        return pincode;
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
        const stateObj = INDIA_LOCATIONS[Math.floor(Math.random() * INDIA_LOCATIONS.length)];

        const city = stateObj.cities[Math.floor(Math.random() * stateObj.cities.length)];
        const pincode = this.generateIndiaPincode(stateObj.pincodePrefix);

        return {
            country: "India",
            state: stateObj.state,
            city,
            pincode
        };
    }


    private static generateUSZipCode(): string {
        let zip = "";
        for (let i = 0; i < 5; i++) {
            zip += Math.floor(Math.random() * 10);
        }
        return zip;
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
        const stateObj = USA_LOCATIONS[Math.floor(Math.random() * USA_LOCATIONS.length)];

        const city = stateObj.cities[Math.floor(Math.random() * stateObj.cities.length)];

        return {
            country: "United States",
            state: stateObj.state,
            city,
            zipCode: this.generateUSZipCode()
        };
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
        const buildingNumber = Math.floor(Math.random() * 900) + 100;
        const street =
            STREET_NAMES[Math.floor(Math.random() * STREET_NAMES.length)];

        return `Flat ${buildingNumber}, ${street}`;
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
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, char => {
            const rand = Math.random() * 16 | 0;
            const value = char === "x" ? rand : (rand & 0x3 | 0x8);
            return value.toString(16);
        });
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
    }


}
