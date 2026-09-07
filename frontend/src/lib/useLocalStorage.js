"use client";
import { useState, useEffect, useCallback } from "react";

/**
 * SSR-safe localStorage hook with JSON serialization.
 * @param {string} key - localStorage key
 * @param {*} initialValue - default value if key doesn't exist
 */
export default function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);

  // Hydrate from localStorage on mount (client only)
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item));
      }
    } catch (err) {
      console.warn("useLocalStorage read error:", err);
    }
  }, [key]);

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (err) {
        console.warn("useLocalStorage write error:", err);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (err) {
      console.warn("useLocalStorage remove error:", err);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
