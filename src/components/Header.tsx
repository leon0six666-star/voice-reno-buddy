import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  cartItemCount?: number;
  onSearch?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ cartItemCount = 0, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-background/95">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-2 text-sm text-muted-foreground">
          <div className="hidden md:flex items-center space-x-4">
            <span>Free Delivery on Orders Over $45</span>
            <span>•</span>
            <span>Pro Services Available</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Find a Store</span>
            <span>•</span>
            <span>Order Status</span>
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">H</span>
              </div>
              <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                HomeHub Pro
              </span>
            </div>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for tools, hardware, paint and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-12 bg-muted/50 border-0 focus:bg-background transition-colors"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Heart className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <User className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Categories Navigation */}
        <nav className="hidden md:flex items-center space-x-8 py-3 border-t border-border">
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Tools</a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Hardware</a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Plumbing</a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Electrical</a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Paint</a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Garden</a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Lumber</a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Appliances</a>
        </nav>

        {/* Mobile search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 bg-muted/50 border-0"
              />
            </div>
          </form>
        </div>
      </div>
    </header>
  );
};