export const REGEX_PATTERNS = {
    /* Strict email validation */
    EMAIL_STRICT: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    /* Extract first email from text */
    EMAIL_IN_TEXT: /[^\s@]+@[^\s@]+\.[^\s@]+/,
    /* Extract all emails from text */
    EMAIL_IN_TEXT_GLOBAL: /[^\s@]+@[^\s@]+\.[^\s@]+/g,
    /* Digits only (validation) */
    DIGITS_ONLY: /^\d+$/,
    /* First number inside text */
    NUMBER_IN_TEXT: /\d+/,
    /* All numbers inside text */
    NUMBER_IN_TEXT_GLOBAL: /\d+/g,
    /* Decimal number validation (e.g. 10, 10.5, 99.99) */
    DECIMAL_STRICT: /^\d+(\.\d{1,2})?$/,
    /* Amount inside text with optional currency */
    AMOUNT_IN_TEXT: /(?:₹|\$|€)?\s?\d+(?:\.\d{1,2})?/,
    /* Strict amount validation */
    AMOUNT_STRICT: /^(?:₹|\$|€)?\s?\d+(?:\.\d{1,2})?$/,
    /* Strict US phone format: +1 XXX-XXX-XXXX */
    US_PHONE_STRICT: /^\+1\s\d{3}-\d{3}-\d{4}$/,
    /* US phone number inside text */
    US_PHONE_IN_TEXT: /(\+1\s?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
    /* Indian phone number inside text */
    INDIA_PHONE_IN_TEXT: /(\+91[\s-]?)?[6-9]\d{9}/,
    /* ISO date validation: yyyy-MM-dd */
    ISO_DATE_STRICT: /^\d{4}-\d{2}-\d{2}$/,
    /* dd/MM/yyyy validation */
    DATE_DD_MM_YYYY_STRICT: /^\d{2}\/\d{2}\/\d{4}$/,
    /* Alphabets only */
    ALPHABETS_ONLY: /^[A-Za-z]+$/,
    /* Alphabets and spaces */
    ALPHABETS_WITH_SPACE: /^[A-Za-z\s]+$/,
    /* Alphanumeric */
    ALPHANUMERIC: /^[A-Za-z0-9]+$/,
    /* Common delimiters: comma, semicolon, pipe */
    COMMON_DELIMITERS: /[,;|]/,
    /* One or more whitespace characters */
    WHITESPACE: /\s+/,

} as const;
