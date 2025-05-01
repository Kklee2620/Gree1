import { useState, useEffect } from 'react';
import { SearchSuggestion as ApiSearchSuggestion, getSearchSuggestions } from '@/lib/api';

// Định nghĩa lại kiểu SearchSuggestion để phù hợp với SearchBar component
export interface SearchSuggestion {
  id: string;
  name: string;
  type: 'product' | 'category';
  url: string;
}

export const useSearch = (query: string) => {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query || query.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setIsSearching(true);
      try {
        const apiSuggestions = await getSearchSuggestions(query);
        
        // Convert API suggestions to match SearchBar's expected format
        const convertedSuggestions: SearchSuggestion[] = apiSuggestions.map((suggestion: ApiSearchSuggestion) => ({
          id: suggestion.id || `${suggestion.type}-${suggestion.name}`, // Tạo id nếu không có
          name: suggestion.name,
          type: suggestion.type === 'query' ? 'category' : suggestion.type, // Đảm bảo type chỉ là 'product' hoặc 'category'
          url: suggestion.url
        }));
        
        setSuggestions(convertedSuggestions);
      } catch (error) {
        console.error('Lỗi khi lấy gợi ý tìm kiếm:', error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    };

    // Sử dụng debounce để không gọi API quá nhiều
    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [query]);

  return { suggestions, isSearching };
}; 