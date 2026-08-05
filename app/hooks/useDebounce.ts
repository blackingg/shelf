import { useState, useEffect } from "react";

/**
 * A custom hook that returns a debounced version of the provided value.
 * Useful for delaying expensive operations like API calls until a user
 * has stopped typing for a specified duration.
 *
 * @param value The value to debounce
 * @param delay The delay in milliseconds (default: 500)
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
