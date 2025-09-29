# UI Control Patterns for ElevenLabs Integration
**URL-Driven State Management Patterns for Voice-Controlled Applications**

## 🎯 Core Architecture Pattern

### URL-Driven State Management
The ElevenLabs integration uses URL parameters as the single source of truth for voice-triggered actions:

```
Voice Command → ElevenLabs Agent → Tool Call → URL Change → useEffect → App Action → UI Update
```

**Benefits:**
- ✅ Clean separation between voice and UI logic
- ✅ Debuggable state changes (visible in URL)
- ✅ Browser history compatibility  
- ✅ No interference with existing state management
- ✅ Easy to test and validate

---

## 🔧 Implementation Patterns

### Pattern 1: URL Parameter State Management

**Hook Setup:**
```typescript
import { useSearchParams } from 'react-router-dom';
import { useEffect, useCallback } from 'react';

const [searchParams, setSearchParams] = useSearchParams();
```

**Voice Tool Pattern:**
```typescript
const voiceTool = (args: ToolArgs) => {
  setSearchParams(prev => {
    const newParams = new URLSearchParams(prev);
    newParams.set('paramName', args.value);
    newParams.set('action', 'tool_name');
    return newParams;
  });
};
```

**Action Handler Pattern:**
```typescript
useEffect(() => {
  const action = searchParams.get('action');
  if (!action) return;

  switch (action) {
    case 'search':
      handleSearch();
      break;
    case 'add_to_cart':
      handleAddToCart();
      break;
  }

  // Clear action after processing
  setSearchParams(prev => {
    const newParams = new URLSearchParams(prev);
    newParams.delete('action');
    return newParams;
  });
}, [searchParams, setSearchParams]);
```

### Pattern 2: Parameterized Action Handlers

**Search Action:**
```typescript
const handleSearch = useCallback(() => {
  const query = searchParams.get('search');
  if (query) {
    // Execute existing search logic
    setSearchResults(performSearch(query));
    setShowResults(true);
  }
}, [searchParams]);
```

**Cart Management:**
```typescript
const handleAddToCart = useCallback(() => {
  const productId = searchParams.get('productId');
  const quantity = parseInt(searchParams.get('quantity') || '1');
  
  if (productId) {
    const product = getProductById(productId);
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addProductToCart(product);
      }
    }
  }
}, [searchParams]);
```

**Navigation Control:**
```typescript
const handleNavigation = useCallback(() => {
  const page = searchParams.get('page');
  if (page) {
    // Use your existing navigation system
    navigate(`/${page}`);
    // OR update state for single-page apps
    setCurrentPage(page);
  }
}, [searchParams, navigate]);
```

---

## 🎨 UI Component Integration Patterns

### Pattern 3: Non-Destructive UI Integration

**Principle:** Voice features should enhance, not replace existing UI

```typescript
const ProductList = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Existing UI functionality remains unchanged
  const handleUISearch = (query: string) => {
    const results = performSearch(query);
    setSearchResults(results);
    setShowSearchResults(true);
  };

  // Voice-triggered search uses same logic
  const handleVoiceSearch = useCallback(() => {
    const query = searchParams.get('search');
    if (query) {
      handleUISearch(query); // Reuse existing logic
    }
  }, [searchParams]);

  return (
    <div>
      {/* Existing search UI */}
      <SearchInput onSearch={handleUISearch} />
      
      {/* Results display (works for both UI and voice) */}
      {showSearchResults && (
        <SearchResults products={searchResults} />
      )}
      
      {/* Voice integration (invisible to user) */}
      <ElevenLabsWidget onToolCall={handleVoiceActions} />
    </div>
  );
};
```

### Pattern 4: State Synchronization

**Keep voice actions synchronized with UI state:**

```typescript
const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  
  // Existing cart logic
  const addToCart = useCallback((product: Product, quantity = 1) => {
    for (let i = 0; i < quantity; i++) {
      setCartItems(prev => [...prev, product]);
    }
    showToast(`Added ${product.name} to cart`);
  }, []);

  // Voice-triggered add to cart
  const handleVoiceAddToCart = useCallback(() => {
    const productId = searchParams.get('productId');
    const quantity = parseInt(searchParams.get('quantity') || '1');
    
    if (productId) {
      const product = findProductById(productId);
      if (product) {
        addToCart(product, quantity); // Use existing logic
      }
    }
  }, [searchParams, addToCart]);

  // Voice-triggered cart info
  const handleVoiceCartInfo = useCallback(() => {
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);
    showToast(`Cart: ${cartItems.length} items, $${total.toFixed(2)} total`);
  }, [cartItems]);

  return (
    <div>
      <CartDisplay items={cartItems} />
      <CartTotal total={cartItems.reduce((sum, item) => sum + item.price, 0)} />
    </div>
  );
};
```

---

## 🔄 Advanced Patterns

### Pattern 5: Multi-Parameter Actions

**Complex filtering with multiple parameters:**

```typescript
const handleVoiceFilter = useCallback(() => {
  const category = searchParams.get('category');
  const priceRange = searchParams.get('priceRange');
  const inStock = searchParams.get('inStock') === 'true';
  
  let results = getAllProducts();
  
  if (category) {
    results = results.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  if (priceRange) {
    const [min, max] = priceRange.split('-').map(Number);
    results = results.filter(p => 
      p.price >= min && p.price <= max
    );
  }
  
  if (inStock) {
    results = results.filter(p => p.inStock);
  }
  
  setFilteredProducts(results);
  setShowResults(true);
}, [searchParams]);
```

### Pattern 6: Context-Aware Actions

**Actions that depend on current app state:**

```typescript
const handleVoiceRecommendations = useCallback(() => {
  const productId = searchParams.get('productId');
  const category = searchParams.get('category');
  
  let recommendations: Product[] = [];
  
  if (productId) {
    // Recommendations based on specific product
    const product = getProductById(productId);
    if (product) {
      recommendations = getRelatedProducts(product.id);
    }
  } else if (category) {
    // Recommendations based on category
    recommendations = getPopularInCategory(category);
  } else if (cartItems.length > 0) {
    // Recommendations based on current cart
    recommendations = getCartRecommendations(cartItems.map(item => item.id));
  } else {
    // Default recommendations
    recommendations = getFeaturedProducts();
  }
  
  setSearchResults(recommendations);
  setSearchMessage(`Here are some recommendations for you`);
  setShowSearchResults(true);
}, [searchParams, cartItems]);
```

### Pattern 7: Error Handling and Fallbacks

**Graceful error handling for voice actions:**

```typescript
const handleVoiceAction = useCallback(() => {
  try {
    const productId = searchParams.get('productId');
    
    if (!productId) {
      showToast('Product ID is required', 'error');
      return;
    }
    
    const product = getProductById(productId);
    
    if (!product) {
      showToast(`Product ${productId} not found`, 'error');
      return;
    }
    
    if (!product.inStock) {
      showToast(`${product.name} is currently out of stock`, 'warning');
      // Offer alternatives
      const alternatives = getSimilarProducts(product.category);
      if (alternatives.length > 0) {
        setSearchResults(alternatives);
        setSearchMessage('Here are similar products that are available:');
        setShowSearchResults(true);
      }
      return;
    }
    
    // Execute successful action
    addProductToCart(product);
    
  } catch (error) {
    console.error('Voice action failed:', error);
    showToast('Something went wrong. Please try again.', 'error');
  }
}, [searchParams]);
```

---

## 📱 Mobile & Responsive Patterns

### Pattern 8: Mobile-Optimized Voice UI

**Responsive voice integration:**

```typescript
const useVoiceIntegration = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const voiceWidgetConfig = {
    position: isMobile ? 'bottom-center' : 'bottom-right',
    size: isMobile ? 'large' : 'medium',
    showTranscription: isMobile, // Show text on mobile for clarity
  };
  
  return { isMobile, voiceWidgetConfig };
};
```

---

## ⚡ Performance Patterns

### Pattern 9: Optimized Re-renders

**Prevent unnecessary re-renders:**

```typescript
const OptimizedVoiceHandler = () => {
  // Memoize handlers to prevent recreation on every render
  const handleVoiceSearch = useCallback(() => {
    const query = searchParams.get('search');
    if (query && query !== currentQuery) {
      performSearch(query);
    }
  }, [searchParams.get('search'), currentQuery]);

  // Use useMemo for expensive computations
  const filteredProducts = useMemo(() => {
    const category = searchParams.get('category');
    const priceRange = searchParams.get('priceRange');
    
    if (!category && !priceRange) return products;
    
    return products.filter(product => {
      if (category && product.category !== category) return false;
      if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        if (product.price < min || product.price > max) return false;
      }
      return true;
    });
  }, [products, searchParams.get('category'), searchParams.get('priceRange')]);

  // Debounce rapid voice commands
  const debouncedVoiceAction = useMemo(
    () => debounce(handleVoiceAction, 300),
    [handleVoiceAction]
  );
};
```

### Pattern 10: Lazy Loading with Voice

**Load data on-demand based on voice requests:**

```typescript
const LazyVoiceProducts = () => {
  const [productCache, setProductCache] = useState<Map<string, Product[]>>(new Map());
  
  const handleVoiceCategoryRequest = useCallback(async () => {
    const category = searchParams.get('category');
    
    if (!category) return;
    
    // Check cache first
    if (productCache.has(category)) {
      setProducts(productCache.get(category)!);
      return;
    }
    
    // Load from API
    setLoading(true);
    try {
      const categoryProducts = await fetchProductsByCategory(category);
      setProductCache(prev => new Map(prev).set(category, categoryProducts));
      setProducts(categoryProducts);
    } catch (error) {
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  }, [searchParams.get('category'), productCache]);
};
```

---

## 🧪 Testing Patterns

### Pattern 11: Voice Integration Testing

**Test voice actions through URL manipulation:**

```typescript
// Test utilities
const simulateVoiceCommand = (action: string, params: Record<string, string>) => {
  const searchParams = new URLSearchParams();
  searchParams.set('action', action);
  
  Object.entries(params).forEach(([key, value]) => {
    searchParams.set(key, value);
  });
  
  // Simulate URL change
  window.history.pushState({}, '', `?${searchParams.toString()}`);
  window.dispatchEvent(new Event('popstate'));
};

// Test cases
test('voice search updates product list', () => {
  render(<ProductList />);
  
  simulateVoiceCommand('search', { search: 'drill' });
  
  expect(screen.getByText(/Found \d+ products matching "drill"/)).toBeInTheDocument();
});

test('voice add to cart updates cart state', () => {
  render(<ShoppingApp />);
  
  simulateVoiceCommand('add_to_cart', { 
    productId: '26', 
    quantity: '2' 
  });
  
  expect(screen.getByText(/Added to cart/)).toBeInTheDocument();
  expect(screen.getByText(/2 items/)).toBeInTheDocument();
});
```

---

## 🔒 Security & Validation Patterns

### Pattern 12: Input Validation for Voice Commands

**Validate voice parameters before processing:**

```typescript
const validateVoiceParameters = (action: string, params: URLSearchParams) => {
  switch (action) {
    case 'add_to_cart':
      const productId = params.get('productId');
      const quantity = params.get('quantity');
      
      if (!productId || !/^\d+$/.test(productId)) {
        throw new Error('Invalid product ID');
      }
      
      if (quantity && (!/^\d+$/.test(quantity) || parseInt(quantity) > 10)) {
        throw new Error('Invalid quantity');
      }
      break;
      
    case 'filter_products':
      const priceRange = params.get('priceRange');
      
      if (priceRange && !/^\d+-\d+$/.test(priceRange)) {
        throw new Error('Invalid price range format');
      }
      break;
      
    default:
      break;
  }
};

const handleVoiceAction = useCallback(() => {
  const action = searchParams.get('action');
  
  try {
    validateVoiceParameters(action, searchParams);
    // Process action...
  } catch (error) {
    console.error('Voice parameter validation failed:', error);
    showToast('Invalid voice command parameters', 'error');
  }
}, [searchParams]);
```

---

## 📚 Pattern Library Summary

### Quick Reference

1. **URL Parameter State** - Use searchParams as single source of truth
2. **Non-Destructive Integration** - Voice enhances, doesn't replace UI
3. **State Synchronization** - Voice actions use existing business logic  
4. **Multi-Parameter Actions** - Handle complex voice commands with multiple parameters
5. **Context-Aware Actions** - Actions adapt based on current app state
6. **Error Handling** - Graceful fallbacks for failed voice commands
7. **Mobile Optimization** - Responsive voice UI for different screen sizes
8. **Performance Optimization** - Prevent unnecessary re-renders and computations
9. **Lazy Loading** - Load data on-demand from voice requests
10. **Testing Integration** - Test voice features through URL manipulation
11. **Input Validation** - Validate voice parameters before processing

### Implementation Checklist

- [ ] Set up useSearchParams hook
- [ ] Create voice tools with URL parameter updates
- [ ] Add useEffect handler for action processing
- [ ] Implement individual action handlers with useCallback
- [ ] Add error handling and validation
- [ ] Test voice actions through URL changes
- [ ] Optimize performance with memoization
- [ ] Ensure mobile responsiveness
- [ ] Document custom patterns for your app

---

**These patterns have been tested and validated in the voice-reno-buddy transformation. They provide a solid foundation for any ElevenLabs voice integration while maintaining clean architecture and excellent user experience.**