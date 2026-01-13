export class RegexUtils {
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
        if (!value || !delimiter) return [];

        return value
            .split(delimiter)
            .map(item => item.trim())
            .filter(item => item.length > 0);
    }


    /**
     * Checks whether a string matches a given regular expression.
     *
     * @param value Input string to test
     * @param pattern Regular expression pattern
     * @returns true if pattern matches, otherwise false
     *
     * Example:
     * matchRegex("test@example.com", /^[^\s@]+@[^\s@]+\.[^\s@]+$/) → true
     */
    static matchRegex(value: string, pattern: RegExp): boolean {
        if (!value || !pattern) return false;

        return pattern.test(value);
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
        if (!value || !pattern) return null;

        const match = value.match(pattern);
        return match ? match[0] : null;
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
        if (!value || !pattern) return [];

        const matches = value.match(pattern);
        return matches ? matches : [];
    }
}