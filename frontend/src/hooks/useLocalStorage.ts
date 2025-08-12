import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = T | ((val: T) => T);

/**
 * Custom hook for localStorage with automatic JSON serialization
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        // Save state
        setStoredValue(valueToStore);
        
        // Save to local storage
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Remove from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes to the localStorage key from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
}

/**
 * Hook for managing user preferences in localStorage
 */
export function useUserPreferences() {
  const [preferences, setPreferences, removePreferences] = useLocalStorage('userPreferences', {
    theme: 'light' as 'light' | 'dark',
    language: 'en',
    emailNotifications: true,
    jobAlerts: true,
    searchFilters: {} as Record<string, any>,
  });

  const updatePreference = useCallback(
    <K extends keyof typeof preferences>(key: K, value: typeof preferences[K]) => {
      setPreferences(prev => ({ ...prev, [key]: value }));
    },
    [setPreferences]
  );

  return {
    preferences,
    updatePreference,
    resetPreferences: removePreferences,
  };
}

/**
 * Hook for managing recent searches
 */
export function useRecentSearches(maxItems: number = 5) {
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>('recentSearches', []);

  const addSearch = useCallback(
    (searchTerm: string) => {
      if (!searchTerm.trim()) return;
      
      setRecentSearches(prev => {
        const filtered = prev.filter(term => term !== searchTerm);
        const updated = [searchTerm, ...filtered];
        return updated.slice(0, maxItems);
      });
    },
    [setRecentSearches, maxItems]
  );

  const removeSearch = useCallback(
    (searchTerm: string) => {
      setRecentSearches(prev => prev.filter(term => term !== searchTerm));
    },
    [setRecentSearches]
  );

  const clearSearches = useCallback(() => {
    setRecentSearches([]);
  }, [setRecentSearches]);

  return {
    recentSearches,
    addSearch,
    removeSearch,
    clearSearches,
  };
}

export default useLocalStorage;