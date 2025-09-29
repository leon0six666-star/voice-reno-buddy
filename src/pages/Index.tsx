import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { CategoryGrid } from '@/components/CategoryGrid';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { VoiceAssistant } from '@/components/VoiceAssistant';
import { SearchResults } from '@/components/SearchResults';
import { productService, Product } from '@/utils/productUtils';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchMessage, setSearchMessage] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { toast } = useToast();

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => [...prev, product]);
    
    // Validate cart after adding item
    const cartIds = [...cartItems.map(p => p.id), product.id];
    const validation = productService.validateCart(cartIds);
    
    if (!validation.isValid) {
      let warningMessage = '';
      if (validation.conflicts.length > 0) {
        warningMessage += `Warning: Compatibility issues detected. `;
      }
      if (validation.missing.length > 0) {
        warningMessage += `This item requires additional products. `;
      }
      
      toast({
        title: "Item added with warnings",
        description: warningMessage + "Check your cart for details.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  const handleToggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleVoiceCommand = (command: string) => {
    console.log('Voice command:', command);
    toast({
      title: "Voice command received",
      description: `Processing: "${command}"`,
    });
  };

  const handleProductsFound = (products: Product[], message: string) => {
    setSearchResults(products);
    setSearchMessage(message);
    setShowSearchResults(true);
    
    // Auto-hide after 10 seconds if no interaction
    setTimeout(() => {
      setShowSearchResults(false);
    }, 10000);
  };

  const handleSearch = (query: string) => {
    const results = productService.searchProducts(query);
    setSearchResults(results);
    setSearchMessage(`Found ${results.length} products matching "${query}"`);
    setShowSearchResults(true);
  };

  const handleCategorySelect = (categoryId: string) => {
    const results = productService.getProductsByCategory(categoryId);
    setSearchResults(results);
    setSearchMessage(`${categoryId} products`);
    setShowSearchResults(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItemCount={cartItems.length} 
        onSearch={handleSearch}
      />
      
      <main>
        <HeroSection />
        <CategoryGrid onCategorySelect={handleCategorySelect} />
        <FeaturedProducts 
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
          favorites={favorites}
        />
      </main>

      {/* Voice Assistant */}
      <VoiceAssistant 
        onCommand={handleVoiceCommand}
        onProductsFound={handleProductsFound}
        currentCart={cartItems.map(item => item.id)}
      />

      {/* Search Results Overlay */}
      <SearchResults
        products={searchResults}
        message={searchMessage}
        isVisible={showSearchResults}
        onAddToCart={handleAddToCart}
        onToggleFavorite={handleToggleFavorite}
        favorites={favorites}
        cartValidation={productService.validateCart(cartItems.map(item => item.id))}
      />

      {/* Click to close search results */}
      {showSearchResults && (
        <div 
          className="fixed inset-0 z-20" 
          onClick={() => setShowSearchResults(false)}
        />
      )}
    </div>
  );
};

export default Index;
