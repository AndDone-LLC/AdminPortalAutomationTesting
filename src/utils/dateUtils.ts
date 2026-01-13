import { isValid, parse, format, addDays, addMonths, addYears, subDays, subMonths, subYears, differenceInDays, differenceInMonths, differenceInYears } from "date-fns"
import { formatInTimeZone, toZonedTime } from "date-fns-tz";


export class DateUtils {

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
        const currentDate = new Date();
        return formatInTimeZone(currentDate, timezone, format);
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
        if (!dateStr || !format) return null;

        const parsedDate = parse(dateStr, format, new Date());
        return isValid(parsedDate) ? parsedDate : null;
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
        if (!dateStr || !inputFormat || !outputFormat) return null;

        const parsedDate = this.parseDate(dateStr, inputFormat);
        if (parsedDate == null) return null;

        return format(parsedDate, outputFormat);
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
        if (!isValid(date)) return null;
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
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
    }

    /**
     * Checks whether a Date object is valid.
     *
     * @param date Date object
     * @returns true if valid Date, false otherwise
     */
    static isValidDate(date: Date): boolean {
        return date instanceof Date && isValid(date);
    }

    /**
     * Checks whether two dates fall on the same calendar day.
     *
     * @param date1 First date
     * @param date2 Second date
     * @returns True if date1 is before date2
     */
    static isBefore(date1: Date, date2: Date): boolean {
        return isValid(date1) && isValid(date2) && date1.getTime() < date2.getTime();
    }

    /**
     * Checks whether two dates fall on the same calendar day.
     *
     * @param date1 First date
     * @param date2 Second date
     * @returns True if date1 is after date2
     */
    static isAfter(date1: Date, date2: Date): boolean {
        return isValid(date1) && isValid(date2) && date1.getTime() > date2.getTime();
    }

    /**
     * Checks whether two dates fall on the same calendar day.
     *
     * @param date1 First date
     * @param date2 Second date
     * @returns True if both dates are on the same day
     */
    static isSameDay(date1: Date, date2: Date): boolean {
        if (!isValid(date1) || !isValid(date2)) return false;

        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    }

    /**
     * Returns the difference between two dates in years.
     *
     * @param date1 Start date
     * @param date2 End date
     * @returns Difference in days or null if invalid
     */
    static differenceInDays(date1: Date, date2: Date): number | null {
        if (!isValid(date1) || !isValid(date2)) return null;
        return differenceInDays(date2, date1);
    }

    /**
     * Returns the difference between two dates in years.
     *
     * @param date1 Start date
     * @param date2 End date
     * @returns Difference in months or null if invalid
     */
    static differenceInMonths(date1: Date, date2: Date): number | null {
        if (!isValid(date1) || !isValid(date2)) return null;
        return differenceInMonths(date2, date1);
    }

    /**
     * Returns the difference between two dates in years.
     *
     * @param date1 Start date
     * @param date2 End date
     * @returns Difference in years or null if invalid
     */
    static differenceInYears(date1: Date, date2: Date): number | null {
        if (!isValid(date1) || !isValid(date2)) return null;
        return differenceInYears(date2, date1);
    }

    /**
     * Extracts day, month, and year from a Date object.
     *
     * @param date Date object
     * @returns {{ day: number; month: number; year: number } | null}
     * Object containing day (1–31), month (1–12), and year
     */
    static getDayMonthYear(date: Date): { day: number; month: number; year: number } | null {
        if (!(date instanceof Date) || !isValid(date)) return null;

        return {
            day: date.getDate(),
            month: date.getMonth() + 1,
            year: date.getFullYear()
        };
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
        if (!dateStr || !formatStr) return false;

        const parsedDate = parse(dateStr, formatStr, new Date());
        console.log("parsed Date", parsedDate);

        if (!isValid(parsedDate)) return false;
        const reformatted = format(parsedDate, formatStr);
        console.log("res", reformatted);

        return reformatted === dateStr;
    }

    /**
     * Checks whether a list of dates is in ascending order (oldest → newest).
     *
     * @param dates Array of Date objects
     * @returns true if dates are in ascending order
     */
    static isAscendingDateList(dates: Date[]): boolean {
        if (!Array.isArray(dates) || dates.length < 2) return true;

        for (let i = 1; i < dates.length; i++) {
            if (!this.isAfter(dates[i], dates[i - 1]) &&
                dates[i].getTime() !== dates[i - 1].getTime()) {
                return false;
            }
        }

        return true;
    }

    /**
     * Checks whether a list of dates is in descending order (newest → oldest).
     *
     * @param dates Array of Date objects
     * @returns true if dates are in descending order
     */
    static isDescendingDateList(dates: Date[]): boolean {
        if (!Array.isArray(dates) || dates.length < 2) return true;

        for (let i = 1; i < dates.length; i++) {
            if (!this.isBefore(dates[i], dates[i - 1]) &&
                dates[i].getTime() !== dates[i - 1].getTime()) {
                return false;
            }
        }

        return true;
    }


}
