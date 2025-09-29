import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { CategoryGrid } from '@/components/CategoryGrid';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { ElevenLabsWidget } from '@/components/ElevenLabsWidget';
import { SearchResults } from '@/components/SearchResults';
import { productService, Product } from '@/utils/productUtils';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchMessage, setSearchMessage] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { toast } = useToast();

  // Handle URL-driven actions from ElevenLabs voice commands
  useEffect(() => {
    const action = searchParams.get('action');
    if (!action) return;

    switch (action) {
      case 'filter':
        handleFilterProducts();
        break;
      case 'view_details':
        handleViewProductDetails();
        break;
      case 'add_to_cart':
        handleAddToCartFromURL();
        break;
      case 'search':
        handleSearchFromURL();
        break;
      case 'get_cart':
        handleGetCartInfo();
        break;
      case 'check_compatibility':
        handleCheckCompatibility();
        break;
      case 'get_recommendations':
        handleGetRecommendations();
        break;
    }

    // Clear action after processing
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.delete('action');
      return newParams;
    });
  }, [searchParams, setSearchParams, handleFilterProducts, handleViewProductDetails, handleAddToCartFromURL, handleSearchFromURL, handleGetCartInfo, handleCheckCompatibility, handleGetRecommendations]);

  const handleFilterProducts = useCallback(() => {
    const category = searchParams.get('category');
    const priceRange = searchParams.get('priceRange');
    const inStock = searchParams.get('inStock');
    
    let results = productService.getAllProducts();
    
    if (category) {
      results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      results = results.filter(p => p.price >= min && p.price <= max);
    }
    if (inStock === 'true') {
      results = results.filter(p => p.inStock);
    }
    
    setSearchResults(results);
    setSearchMessage(`Filtered products: ${results.length} found`);
    setShowSearchResults(true);
  }, [searchParams]);

  const handleViewProductDetails = useCallback(() => {
    const productId = searchParams.get('productId');
    if (productId) {
      const product = productService.getProductById(parseInt(productId));
      if (product) {
        setSearchResults([product]);
        setSearchMessage(`Product details: ${product.name}`);
        setShowSearchResults(true);
      }
    }
  }, [searchParams]);

  const handleAddToCart = useCallback((product: Product) => {
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
  }, [cartItems, toast]);

  const handleAddToCartFromURL = useCallback(() => {
    const productId = searchParams.get('productId');
    const quantity = parseInt(searchParams.get('quantity') || '1');
    
    if (productId) {
      const product = productService.getProductById(parseInt(productId));
      if (product) {
        for (let i = 0; i < quantity; i++) {
          handleAddToCart(product);
        }
      }
    }
  }, [searchParams, handleAddToCart]);

  const handleSearch = useCallback((query: string) => {
    const results = productService.searchProducts(query);
    setSearchResults(results);
    setSearchMessage(`Found ${results.length} products matching "${query}"`);
    setShowSearchResults(true);
  }, []);

  const handleSearchFromURL = useCallback(() => {
    const query = searchParams.get('search');
    if (query) {
      handleSearch(query);
    }
  }, [searchParams, handleSearch]);

  const handleGetCartInfo = useCallback(() => {
    const message = `Cart contains ${cartItems.length} items. Total value: ${cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}`;
    toast({
      title: "Cart Information",
      description: message,
    });
  }, [cartItems, toast]);

  const handleCheckCompatibility = useCallback(() => {
    const productIds = searchParams.get('productIds')?.split(',').map(Number) || [];
    const validation = productService.validateCart(productIds);
    
    const message = validation.isValid 
      ? "All products are compatible!" 
      : `Compatibility issues found: ${validation.conflicts.length} conflicts, ${validation.missing.length} missing requirements`;
    
    toast({
      title: "Compatibility Check",
      description: message,
      variant: validation.isValid ? "default" : "destructive"
    });
  }, [searchParams, toast]);

  const handleGetRecommendations = useCallback(() => {
    const productId = searchParams.get('productId');
    const category = searchParams.get('category');
    
    let results: Product[] = [];
    let message = '';
    
    if (productId) {
      const product = productService.getProductById(parseInt(productId));
      if (product) {
        results = productService.getRecommendations(parseInt(productId));
        message = `Recommendations for ${product.name}`;
      }
    } else if (category) {
      results = productService.getProductsByCategory(category);
      message = `Recommendations in ${category}`;
    }
    
    setSearchResults(results);
    setSearchMessage(message);
    setShowSearchResults(true);
  }, [searchParams]);

  const handleToggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
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

      {/* ElevenLabs Voice Widget */}
      <ElevenLabsWidget 
        onToolCall={(toolName, args) => {
          console.log('Voice tool called:', toolName, args);
          // Additional logging or processing if needed
        }}
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
