
import { DateTime } from "luxon";


const isValidTimeFormat = (time: string): boolean => {
  const timeRegex = /^(?:(?:[01]?\d|2[0-3]):[0-5]\d(?:\s?[APap][Mm])?)$/;
  return timeRegex.test(time);
}

// Reviver function to convert string dates to Date objects
export const dateReviver = (_: string, value: unknown) => {
  if (typeof value === 'string') {
    // Check if the string is in a valid date format
    // but is not a string representing an hour "HH:mm"
    const date = DateTime.fromISO(value) || DateTime.fromSQL(value) || DateTime.fromRFC2822(value) || DateTime.fromHTTP(value);
    if (date.isValid && !isValidTimeFormat(value)) {
      return date.toJSDate();
    }
  }
  return value;
};
