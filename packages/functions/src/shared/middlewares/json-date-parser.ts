
import { DateTime } from "luxon";

// Reviver function to convert string dates to Date objects
export const dateReviver = (_: string, value: unknown) => {
  if (typeof value === 'string') {
    // Check if the string is in a valid date format
    const date = DateTime.fromISO(value) || DateTime.fromSQL(value) || DateTime.fromRFC2822(value) || DateTime.fromHTTP(value);
    if (date.isValid) {
      return date.toJSDate();
    }
  }
  return value;
};
