
import { useState, useCallback } from 'react';
import { FavoriteItem, UserProfileSummary } from '../types';

export const useFavoriteActions = (user: UserProfileSummary) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  const addToFavorites = useCallback((product: Omit<FavoriteItem, 'id' | 'addedAt'>) => {
    if (!user.isLoggedIn) {
      return; // User must be logged in to add favorites
    }

    const isAlreadyInFavorites = favorites.some(item => item.productId === product.productId);
    
    if (!isAlreadyInFavorites) {
      const newFavorite: FavoriteItem = {
        ...product,
        id: `fav_${Date.now()}_${Math.round(Math.random() * 1000)}`,
        addedAt: new Date()
      };
      
      setFavorites(prev => [...prev, newFavorite]);
    }
  }, [favorites, user.isLoggedIn]);

  const removeFromFavorites = useCallback((productId: string) => {
    setFavorites(prev => prev.filter(item => item.productId !== productId));
  }, []);

  const isProductInFavorites = useCallback((productId: string) => {
    return favorites.some(item => item.productId === productId);
  }, [favorites]);

  return {
    favorites,
    setFavorites,
    addToFavorites,
    removeFromFavorites,
    isProductInFavorites
  };
};
