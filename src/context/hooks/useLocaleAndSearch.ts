
import { useState, useCallback } from 'react';
import { Language, Currency } from '../types';
import { defaultLanguage, defaultCurrency } from '../utils/defaults';
import { useToast } from '@/components/ui/use-toast';

export const useLocaleAndSearch = () => {
  const [language, setLanguage] = useState<Language>(defaultLanguage);
  const [currency, setCurrency] = useState<Currency>(defaultCurrency);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const handleSetLanguage = useCallback((newLang: Language) => {
    setLanguage(newLang);
    toast({
      title: "Ngôn ngữ đã thay đổi",
      description: `Ngôn ngữ đã được chuyển sang ${newLang.name}.`,
    });
  }, [toast]);

  const handleSetCurrency = useCallback((newCurr: Currency) => {
    setCurrency(newCurr);
    toast({
      title: "Đơn vị tiền tệ đã thay đổi",
      description: `Đơn vị tiền tệ đã được chuyển sang ${newCurr.code}.`,
    });
  }, [toast]);

  const handleSetSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return {
    language,
    currency,
    searchQuery,
    setLanguage: handleSetLanguage,
    setCurrency: handleSetCurrency,
    setSearchQuery: handleSetSearchQuery
  };
};
