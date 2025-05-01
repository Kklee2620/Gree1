import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useShop } from '@/context/ShopContext';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { delay } from '@/lib/api';
import { useSearch } from '@/hooks/use-search';

import { SearchBar } from '@/components/header/SearchBar';
import { UserMenu } from '@/components/header/UserMenu';
import { NotificationMenu } from '@/components/header/NotificationMenu';
import { DesktopNavigation } from '@/components/header/DesktopNavigation';
import { MobileNavigation } from '@/components/header/MobileNavigation';
import { CartButton } from '@/components/header/CartButton';

// Import logo trực tiếp
import logoYapee from '/images/yapee-logo.png';

export const Header: React.FC = () => {
  const {
    cart,
    searchQuery,
    setSearchQuery,
  } = useShop();
  
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { suggestions, isSearching } = useSearch(searchQuery);
  
  const handleCartClick = () => {
    if (cart.length === 0) {
      toast({
        title: 'Giỏ hàng trống',
        description: 'Vui lòng thêm sản phẩm vào giỏ hàng',
        variant: 'destructive',
      });
      return;
    }
    
    // Navigate to cart page
    window.location.href = '/cart';
  };
  
  const cartItemCount = cart.length;
  const notificationCount = 0; // Mặc định là 0 nếu không có notifications trong ShopContext

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="block md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img 
                src={logoYapee}
                alt="Yapee" 
                className="h-10 w-auto"
                style={{ objectFit: 'contain' }}
              />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <DesktopNavigation />
          
          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <SearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isSearching={isSearching}
              suggestions={suggestions}
            />
          </div>
          
          {/* Right Navigation Items */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <NotificationMenu notificationCount={notificationCount} />
            
            {/* User Menu */}
            <UserMenu />
            
            {/* Cart */}
            <CartButton itemCount={cartItemCount} onClick={handleCartClick} />
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        <div className="mt-4 md:hidden">
          <SearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isSearching={isSearching}
            suggestions={suggestions}
            isMobile={true}
          />
        </div>
        
        {/* Mobile Menu */}
        <MobileNavigation isOpen={isMobileMenuOpen} />
      </div>
    </header>
  );
};

export default Header;
