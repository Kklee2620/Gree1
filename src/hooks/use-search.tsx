
import { useState, useEffect } from 'react';
import { getSearchSuggestions } from '@/lib/api';
import { SearchSuggestion } from '@/lib/api';

export const useSearch = (searchQuery: string) => {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      
      setIsSearching(true);
      try {
        const results = await getSearchSuggestions(searchQuery);
        setSuggestions(results);
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
      } finally {
        setIsSearching(false);
      }
    };
    
    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return { suggestions, isSearching };
};
