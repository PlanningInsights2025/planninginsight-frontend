import { useState, useEffect } from 'react';

/**
 * Custom hook for managing state with localStorage persistence
 * @param {string} key - localStorage key
 * @param {*} initialValue - Initial value
 * @returns {Array} [value, setValue, removeValue]
 */
export const useLocalStorage = (key, initialValue) => {
  // State to store our value
  const [storedValue, setStoredValue] = useState(initialValue);

  /**
   * Initialize value from localStorage
   */
  useEffect(() => {
    try {
      // Get from localStorage by key
      const item = window.localStorage.getItem(key);
      
      // Parse stored json or if none return initialValue
      if (item) {
        setStoredValue(JSON.parse(item));
      } else {
        setStoredValue(initialValue);
      }
    } catch (error) {
      // If error also return initialValue
      console.error(`Error reading localStorage key "${key}":`, error);
      setStoredValue(initialValue);
    }
  }, [key, initialValue]);

  /**
   * Return a wrapped version of useState's setter function that persists the new value to localStorage
   */
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  /**
   * Remove value from localStorage and reset to initial value
   */
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
};

/**
 * Custom hook for managing boolean state with localStorage
 */
export const useLocalStorageBoolean = (key, initialValue = false) => {
  const [value, setValue, removeValue] = useLocalStorage(key, initialValue);
  
  const toggle = () => setValue(prev => !prev);
  
  return [value, setValue, toggle, removeValue];
};

/**
 * Custom hook for managing array state with localStorage
 */
export const useLocalStorageArray = (key, initialValue = []) => {
  const [value, setValue, removeValue] = useLocalStorage(key, initialValue);
  
  const addItem = (item) => setValue(prev => [...prev, item]);
  
  const removeItem = (index) => setValue(prev => prev.filter((_, i) => i !== index));
  
  const updateItem = (index, newItem) => setValue(prev => 
    prev.map((item, i) => i === index ? newItem : item)
  );
  
  const clear = () => setValue([]);
  
  return [
    value, 
    setValue, 
    {
      addItem,
      removeItem,
      updateItem,
      clear,
      removeValue
    }
  ];
};

/**
 * Custom hook for managing object state with localStorage
 */
export const useLocalStorageObject = (key, initialValue = {}) => {
  const [value, setValue, removeValue] = useLocalStorage(key, initialValue);
  
  const updateProperty = (property, newValue) => setValue(prev => ({
    ...prev,
    [property]: newValue
  }));
  
  const removeProperty = (property) => setValue(prev => {
    const newValue = { ...prev };
    delete newValue[property];
    return newValue;
  });
  
  const merge = (newObject) => setValue(prev => ({
    ...prev,
    ...newObject
  }));
  
  return [
    value, 
    setValue, 
    {
      updateProperty,
      removeProperty,
      merge,
      removeValue
    }
  ];
};

export default useLocalStorage;