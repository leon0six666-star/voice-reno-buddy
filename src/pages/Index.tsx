import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { CategoryGrid } from '@/components/CategoryGrid';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { VoiceAssistant } from '@/components/VoiceAssistant';
import { Product } from '@/data/products';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => [...prev, product]);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
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
      description: `You said: "${command}"`,
    });
  };

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    toast({
      title: "Search",
      description: `Searching for: "${query}"`,
    });
  };

  const handleCategorySelect = (categoryId: string) => {
    console.log('Category selected:', categoryId);
    toast({
      title: "Category selected",
      description: `Browsing ${categoryId} products`,
    });
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

      <VoiceAssistant onCommand={handleVoiceCommand} />
    </div>
  );
};

export default Index;
