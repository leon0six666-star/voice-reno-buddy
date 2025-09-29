import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { CategoryGrid } from '@/components/CategoryGrid';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { VoiceSettings } from '@/components/VoiceSettings';
import { DynamicElevenLabsWidget } from '@/components/DynamicElevenLabsWidget';
import { SearchResults } from '@/components/SearchResults';
import { productService, Product } from '@/utils/productUtils';
import { useToast } from '@/hooks/use-toast';

const IndexWithUI = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchMessage, setSearchMessage] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { toast } = useToast();

  // Voice credentials state
  const [voiceApiKey, setVoiceApiKey] = useState('');
  const [voiceAgentId, setVoiceAgentId] = useState('');
  const [voiceStatus, setVoiceStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  // Handle voice credentials change
  const handleCredentialsChange = useCallback((apiKey: string, agentId: string) => {
    setVoiceApiKey(apiKey);
    setVoiceAgentId(agentId);
  }, []);

  // Handle voice widget status change
  const handleVoiceStatusChange = useCallback((status: 'loading' | 'ready' | 'error') => {
    setVoiceStatus(status);
  }, []);

  // Enhanced voice tool call handler
  const handleVoiceToolCall = useCallback((toolName: string, args: Record<string, unknown>) => {
    console.log(`Voice tool called: ${toolName}`, args);

    switch (toolName) {
      case 'navigate_to_page':
        handleNavigateToPage(args);
        break;
      case 'search_products':
        handleSearchProducts(args);
        break;
      case 'filter_products':
        handleFilterProducts(args);
        break;
      case 'view_product_details':
        handleViewProductDetails(args);
        break;
      case 'add_to_cart':
        handleAddToCart(args);
        break;
      case 'remove_from_cart':
        handleRemoveFromCart(args);
        break;
      case 'get_cart_info':
        handleGetCartInfo();
        break;
      case 'check_compatibility':
        handleCheckCompatibility(args);
        break;
      case 'get_recommendations':
        handleGetRecommendations(args);
        break;
      case 'clear_cart':
        handleClearCart();
        break;
      case 'get_project_products':
        handleGetProjectProducts(args);
        break;
      case 'compare_products':
        handleCompareProducts(args);
        break;
      default:
        console.log(`Unknown voice tool: ${toolName}`);
        toast({
          title: "Unknown Voice Command",
          description: `The command "${toolName}" is not recognized.`,
          variant: "destructive",
        });
    }
  }, [toast]);

  // Voice tool handlers
  const handleNavigateToPage = (args: Record<string, unknown>) => {
    const page = args.page as string;
    if (page === 'home') {
      setShowSearchResults(false);
      toast({ title: "Navigation", description: "Returned to home page" });
    }
  };

  const handleSearchProducts = (args: Record<string, unknown>) => {
    const query = args.query as string;
    if (!query) return;

    const results = productService.searchProducts(query);
    setSearchResults(results);
    setSearchMessage(`Found ${results.length} products matching "${query}"`);
    setShowSearchResults(true);
    
    toast({
      title: "Search Complete",
      description: `Found ${results.length} products for "${query}"`,
    });
  };

  const handleFilterProducts = (args: Record<string, unknown>) => {
    const category = args.category as string;
    const type = args.type as string;
    
    let results: Product[] = [];
    
    if (category) {
      results = productService.getProductsByCategory(category);
      setSearchMessage(`Products in ${category} category`);
    } else if (type) {
      results = productService.getProductsByType(type);
      setSearchMessage(`${type} products`);
    }
    
    if (results.length > 0) {
      setSearchResults(results);
      setShowSearchResults(true);
      toast({
        title: "Filter Applied", 
        description: `Showing ${results.length} filtered products`,
      });
    }
  };

  const handleViewProductDetails = (args: Record<string, unknown>) => {
    const productId = args.productId as string;
    if (!productId) return;

    const product = productService.getProductById(productId);
    if (product) {
      toast({
        title: product.name,
        description: `${product.description} - $${product.price}`,
      });
    }
  };

  const handleAddToCart = (args: Record<string, unknown>) => {
    const productId = args.productId as string;
    const quantity = parseInt(args.quantity as string) || 1;
    
    if (!productId) return;

    const product = productService.getProductById(productId);
    if (product) {
      // Add to cart logic
      for (let i = 0; i < quantity; i++) {
        setCartItems(prev => [...prev, product]);
      }
      
      toast({
        title: "Added to Cart",
        description: `${quantity}x ${product.name} added to cart`,
      });
    }
  };

  const handleRemoveFromCart = (args: Record<string, unknown>) => {
    const productId = args.productId as string;
    if (!productId) return;

    setCartItems(prev => {
      const index = prev.findIndex(item => item.id === productId);
      if (index > -1) {
        const newItems = [...prev];
        const removedItem = newItems.splice(index, 1)[0];
        toast({
          title: "Removed from Cart",
          description: `${removedItem.name} removed from cart`,
        });
        return newItems;
      }
      return prev;
    });
  };

  const handleGetCartInfo = () => {
    const totalItems = cartItems.length;
    const totalValue = cartItems.reduce((sum, item) => sum + item.price, 0);
    
    toast({
      title: "Cart Summary",
      description: `${totalItems} items, Total: $${totalValue.toFixed(2)}`,
    });
  };

  const handleCheckCompatibility = (args: Record<string, unknown>) => {
    const productId1 = args.productId1 as string;
    const productId2 = args.productId2 as string;
    
    if (productId1 && productId2) {
      const isCompatible = productService.checkCompatibility(productId1, productId2);
      toast({
        title: "Compatibility Check",
        description: isCompatible ? "Products are compatible" : "Products may not be compatible",
        variant: isCompatible ? "default" : "destructive",
      });
    }
  };

  const handleGetRecommendations = (args: Record<string, unknown>) => {
    const productId = args.productId as string;
    const projectType = args.projectType as string;
    
    let recommendations: Product[] = [];
    
    if (productId) {
      recommendations = productService.getRecommendations(productId);
    } else if (projectType) {
      recommendations = productService.getProductsByCategory(projectType).slice(0, 5);
    }
    
    if (recommendations.length > 0) {
      setSearchResults(recommendations);
      setSearchMessage('Recommended products for you');
      setShowSearchResults(true);
      
      toast({
        title: "Recommendations Ready",
        description: `Found ${recommendations.length} recommended products`,
      });
    }
  };

  const handleClearCart = () => {
    setCartItems([]);
    toast({
      title: "Cart Cleared",
      description: "All items removed from cart",
    });
  };

  const handleGetProjectProducts = (args: Record<string, unknown>) => {
    const projectType = args.projectType as string;
    if (!projectType) return;

    const products = productService.getProductsByCategory(projectType);
    setSearchResults(products);
    setSearchMessage(`Products for ${projectType} projects`);
    setShowSearchResults(true);
    
    toast({
      title: "Project Products",
      description: `Found ${products.length} products for ${projectType}`,
    });
  };

  const handleCompareProducts = (args: Record<string, unknown>) => {
    const productIds = args.productIds as string[];
    if (!productIds || productIds.length < 2) return;

    const products = productIds.map(id => productService.getProductById(id)).filter(Boolean);
    if (products.length >= 2) {
      setSearchResults(products);
      setSearchMessage('Product comparison');
      setShowSearchResults(true);
      
      toast({
        title: "Product Comparison",
        description: `Comparing ${products.length} products`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header 
        cartItemCount={cartItems.length}
        onSearch={(query) => handleSearchProducts({ query })}
      />
      
      {/* Voice Settings Section */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Voice Reno Buddy</h1>
          <VoiceSettings onCredentialsChange={handleCredentialsChange} />
        </div>
        
        {/* Voice Widget */}
        {voiceApiKey && voiceAgentId && (
          <div className="mb-8">
            <DynamicElevenLabsWidget
              apiKey={voiceApiKey}
              agentId={voiceAgentId}
              onToolCall={handleVoiceToolCall}
              onStatusChange={handleVoiceStatusChange}
            />
          </div>
        )}
      </div>

      <main className="container mx-auto px-4 py-8">
        {showSearchResults ? (
          <SearchResults 
            results={searchResults}
            message={searchMessage}
            onAddToCart={(product) => handleAddToCart({ productId: product.id, quantity: 1 })}
            onToggleFavorite={(productId) => {
              setFavorites(prev => 
                prev.includes(productId) 
                  ? prev.filter(id => id !== productId)
                  : [...prev, productId]
              );
            }}
            favorites={favorites}
            onBackToHome={() => setShowSearchResults(false)}
          />
        ) : (
          <>
            <HeroSection />
            <CategoryGrid onCategoryClick={(category) => handleFilterProducts({ category })} />
            <FeaturedProducts 
              onAddToCart={(product) => handleAddToCart({ productId: product.id, quantity: 1 })}
              onToggleFavorite={(productId) => {
                setFavorites(prev => 
                  prev.includes(productId) 
                    ? prev.filter(id => id !== productId)
                    : [...prev, productId]
                );
              }}
              favorites={favorites}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default IndexWithUI;