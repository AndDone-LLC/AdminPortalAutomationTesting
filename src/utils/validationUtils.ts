import { differenceInDays, differenceInMonths, differenceInYears, format, isValid, parse } from "date-fns";

export class ValidationUtils {
    /**
     * Checks whether a Date object is valid.
     *
     * @param date Date object
     * @returns true if valid Date, false otherwise
     */
    static isValidDate(date: Date): boolean {
        try {
            return date instanceof Date && isValid(date);
        } catch {
            return false;
        }
    }

    /**
     * Checks whether two dates fall on the same calendar day.
     *
     * @param date1 First date
     * @param date2 Second date
     * @returns True if date1 is before date2
     */
    static isBefore(date1: Date, date2: Date): boolean {
        try {
            return this.isValidDate(date1) && this.isValidDate(date2) && date1.getTime() < date2.getTime();
        } catch {
            return false;
        }
    }

    /**
     * Checks whether two dates fall on the same calendar day.
     *
     * @param date1 First date
     * @param date2 Second date
     * @returns True if date1 is after date2
     */
    static isAfter(date1: Date, date2: Date): boolean {
        try {
            return this.isValidDate(date1) && this.isValidDate(date2) && date1.getTime() > date2.getTime();
        } catch {
            return false;
        }
    }

    /**
     * Checks whether two dates fall on the same calendar day.
     *
     * @param date1 First date
     * @param date2 Second date
     * @returns True if both dates are on the same day
     */
    static isSameDay(date1: Date, date2: Date): boolean {
        try {
            if (!this.isValidDate(date1) || !this.isValidDate(date2)) return false;

            return (
                date1.getFullYear() === date2.getFullYear() &&
                date1.getMonth() === date2.getMonth() &&
                date1.getDate() === date2.getDate()
            );
        } catch {
            return false;
        }
    }

    /**
     * Returns the difference between two dates in years.
     *
     * @param date1 Start date
     * @param date2 End date
     * @returns Difference in days or null if invalid
     */
    static getDifferenceInDays(date1: Date, date2: Date): number | null {
        try {
            if (!this.isValidDate(date1) || !this.isValidDate(date2)) return null;
            return differenceInDays(date2, date1);
        } catch {
            return null;
        }
    }

    /**
     * Returns the difference between two dates in years.
     *
     * @param date1 Start date
     * @param date2 End date
     * @returns Difference in months or null if invalid
     */
    static getDifferenceInMonths(date1: Date, date2: Date): number | null {
        try {
            if (!this.isValidDate(date1) || !this.isValidDate(date2)) return null;
            return differenceInMonths(date2, date1);
        } catch {
            return null;
        }
    }

    /**
     * Returns the difference between two dates in years.
     *
     * @param date1 Start date
     * @param date2 End date
     * @returns Difference in years or null if invalid
     */
    static getDifferenceInYears(date1: Date, date2: Date): number | null {
        try {
            if (!this.isValidDate(date1) || !this.isValidDate(date2)) return null;
            return differenceInYears(date2, date1);
        } catch {
            return null;
        }
    }

    /**
     * Checks whether a list of dates is in ascending order (oldest → newest).
     *
     * @param dates Array of Date objects
     * @returns true if dates are in ascending order
     */
    static isAscendingDateList(dates: Date[]): boolean {
        try {
            if (!Array.isArray(dates) || dates.length < 2) return true;

            for (let i = 1; i < dates.length; i++) {
                if (!this.isAfter(dates[i], dates[i - 1]) &&
                    dates[i].getTime() !== dates[i - 1].getTime()) {
                    return false;
                }
            }

            return true;
        } catch {
            return false;
        }
    }

    /**
     * Checks whether a list of dates is in descending order (newest → oldest).
     *
     * @param dates Array of Date objects
     * @returns true if dates are in descending order
     */
    static isDescendingDateList(dates: Date[]): boolean {
        try {
            if (!Array.isArray(dates) || dates.length < 2) return true;

            for (let i = 1; i < dates.length; i++) {
                if (!this.isBefore(dates[i], dates[i - 1]) &&
                    dates[i].getTime() !== dates[i - 1].getTime()) {
                    return false;
                }
            }

            return true;
        }
        catch {
            return false;
        }
    }

    /**
     * Checks whether a date string strictly matches the given date format.
     *
     * @param dateStr input date string
     * @param formatStr expected date format
     * @returns true if date matches the format exactly, false otherwise
     *
     * Example:
     * doesDateMatchFormat("02/10/2003", "dd/MM/yyyy") → true
     * doesDateMatchFormat("2/10/2003", "dd/MM/yyyy") → false
     */
    static doesDateMatchFormat(dateStr: string, formatStr: string): boolean {
        try {
            if (!dateStr || !formatStr) return false;

            const parsedDate = parse(dateStr, formatStr, new Date());

            if (!this.isValidDate(parsedDate)) return false;
            const reformatted = format(parsedDate, formatStr);

            return reformatted === dateStr;
        }
        catch {
            return false;
        }
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
        try {
            if (!value || !pattern) return false;

            return pattern.test(value);
        } catch {
            return false;
        }
    }
}