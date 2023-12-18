// Reviver function to convert string dates to Date objects
export const dateReviver = (_: string, value: unknown) => {
  if (typeof value === 'string') {
    // Check if the string is in a valid date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})?)?$/;
    if (dateRegex.test(value)) {
      return new Date(value);
    }
  }
  return value;
};
