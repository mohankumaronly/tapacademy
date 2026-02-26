import { useState, useCallback, useRef } from 'react';
import { getPublicProfiles } from '../../../../services/profile.service';

export const useSearch = (onSearchComplete) => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const debounceTimerRef = useRef(null);

  const handleSearchChange = useCallback(async (value) => {
    setSearch(value);
    clearTimeout(debounceTimerRef.current);

    if (!value.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      onSearchComplete?.("", []);
      return;
    }

    setSearchLoading(true);
    
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const res = await getPublicProfiles(value, 1, 5);
        setSuggestions(res.data.data);
        setShowDropdown(true);
        onSearchComplete?.(value, res.data.data);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
  }, [onSearchComplete]);

  const clearSearch = useCallback(() => {
    setSearch("");
    setSuggestions([]);
    setShowDropdown(false);
    clearTimeout(debounceTimerRef.current);
    onSearchComplete?.("", []);
  }, [onSearchComplete]);

  return {
    search,
    suggestions,
    showDropdown,
    searchLoading,
    setShowDropdown,
    handleSearchChange,
    clearSearch
  };
};