import productDatabase from '@/data/productDatabase.json';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  specs: Record<string, string | number | boolean>;
  compatibilities: number[];
  incompatibilities: number[];
  requires: number[];
  suggested_upsells: number[];
  variants: Record<string, string[]>;
  project_tags: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
}

export class ProductService {
  private products: Product[] = productDatabase.products;
  private projects = productDatabase.projects;

  // Get all products
  getAllProducts(): Product[] {
    return this.products;
  }

  // Get product by ID
  getProductById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  // Get products by category
  getProductsByCategory(category: string): Product[] {
    return this.products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  // Get products for a specific project
  getProductsForProject(projectTag: string): Product[] {
    const projectProductIds = this.projects[projectTag as keyof typeof this.projects] || [];
    return projectProductIds.map(id => this.getProductById(id)).filter(Boolean) as Product[];
  }

  // Check if products are compatible
  areProductsCompatible(product1Id: number, product2Id: number): boolean {
    const product1 = this.getProductById(product1Id);
    const product2 = this.getProductById(product2Id);
    
    if (!product1 || !product2) return false;
    
    // Check if product1 is incompatible with product2
    if (product1.incompatibilities.includes(product2Id)) return false;
    if (product2.incompatibilities.includes(product1Id)) return false;
    
    return true;
  }

  // Get required products for a given product
  getRequiredProducts(productId: number): Product[] {
    const product = this.getProductById(productId);
    if (!product) return [];
    
    return product.requires.map(id => this.getProductById(id)).filter(Boolean) as Product[];
  }

  // Get compatible products
  getCompatibleProducts(productId: number): Product[] {
    const product = this.getProductById(productId);
    if (!product) return [];
    
    return product.compatibilities.map(id => this.getProductById(id)).filter(Boolean) as Product[];
  }

  // Get suggested upsells
  getSuggestedUpsells(productId: number): Product[] {
    const product = this.getProductById(productId);
    if (!product) return [];
    
    return product.suggested_upsells.map(id => this.getProductById(id)).filter(Boolean) as Product[];
  }

  // Get incompatible products
  getIncompatibleProducts(productId: number): Product[] {
    const product = this.getProductById(productId);
    if (!product) return [];
    
    return product.incompatibilities.map(id => this.getProductById(id)).filter(Boolean) as Product[];
  }

  // Search products by name or description
  searchProducts(query: string): Product[] {
    const lowercaseQuery = query.toLowerCase();
    return this.products.filter(product => 
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery) ||
      product.project_tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Validate cart for compatibility issues
  validateCart(cartProductIds: number[]): {
    isValid: boolean;
    conflicts: Array<{product1: Product; product2: Product; reason: string}>;
    missing: Array<{product: Product; required: Product[]}>;
  } {
    const conflicts: Array<{product1: Product; product2: Product; reason: string}> = [];
    const missing: Array<{product: Product; required: Product[]}> = [];

    // Check for incompatibilities
    for (let i = 0; i < cartProductIds.length; i++) {
      for (let j = i + 1; j < cartProductIds.length; j++) {
        if (!this.areProductsCompatible(cartProductIds[i], cartProductIds[j])) {
          const product1 = this.getProductById(cartProductIds[i])!;
          const product2 = this.getProductById(cartProductIds[j])!;
          conflicts.push({
            product1,
            product2,
            reason: "These products are not compatible with each other"
          });
        }
      }
    }

    // Check for missing required products
    cartProductIds.forEach(productId => {
      const requiredProducts = this.getRequiredProducts(productId);
      const missingRequired = requiredProducts.filter(req => !cartProductIds.includes(req.id));
      if (missingRequired.length > 0) {
        const product = this.getProductById(productId)!;
        missing.push({
          product,
          required: missingRequired
        });
      }
    });

    return {
      isValid: conflicts.length === 0 && missing.length === 0,
      conflicts,
      missing
    };
  }

  // Get smart recommendations based on current cart
  getSmartRecommendations(cartProductIds: number[]): Product[] {
    const recommendations = new Set<Product>();

    cartProductIds.forEach(productId => {
      // Add compatible products
      this.getCompatibleProducts(productId).forEach(p => recommendations.add(p));
      
      // Add suggested upsells
      this.getSuggestedUpsells(productId).forEach(p => recommendations.add(p));
      
      // Add required products if not already in cart
      this.getRequiredProducts(productId).forEach(p => {
        if (!cartProductIds.includes(p.id)) {
          recommendations.add(p);
        }
      });
    });

    // Remove products already in cart
    return Array.from(recommendations).filter(p => !cartProductIds.includes(p.id));
  }

  // Process voice commands
  processVoiceCommand(command: string, currentCart: number[] = []): {
    action: string;
    products: Product[];
    message: string;
    suggestions?: Product[];
  } {
    const lowerCommand = command.toLowerCase();

    // Search for products
    if (lowerCommand.includes('find') || lowerCommand.includes('search') || lowerCommand.includes('show me')) {
      const searchResults = this.searchProducts(command);
      return {
        action: 'search',
        products: searchResults.slice(0, 6),
        message: `Found ${searchResults.length} products matching your search.`,
      };
    }

    // Project-based searches
    if (lowerCommand.includes('bathroom') || lowerCommand.includes('kitchen') || lowerCommand.includes('paint')) {
      let projectTag = '';
      if (lowerCommand.includes('bathroom')) projectTag = 'bathroom_remodel';
      else if (lowerCommand.includes('kitchen')) projectTag = 'kitchen_remodel';
      else if (lowerCommand.includes('paint')) projectTag = 'room_painting';

      const projectProducts = this.getProductsForProject(projectTag);
      return {
        action: 'project',
        products: projectProducts,
        message: `Here are the recommended products for your ${projectTag.replace('_', ' ')} project.`,
      };
    }

    // Compatibility checks
    if (lowerCommand.includes('compatible') || lowerCommand.includes('work with')) {
      if (currentCart.length > 0) {
        const recommendations = this.getSmartRecommendations(currentCart);
        return {
          action: 'compatibility',
          products: recommendations.slice(0, 6),
          message: 'Here are products that work well with items in your cart.',
        };
      }
    }

    // Cart validation
    if (lowerCommand.includes('check cart') || lowerCommand.includes('validate')) {
      const validation = this.validateCart(currentCart);
      let message = 'Your cart looks good!';
      
      if (!validation.isValid) {
        const issues = [];
        if (validation.conflicts.length > 0) {
          issues.push(`${validation.conflicts.length} compatibility issues`);
        }
        if (validation.missing.length > 0) {
          issues.push(`${validation.missing.length} missing required items`);
        }
        message = `Found ${issues.join(' and ')} in your cart.`;
      }

      return {
        action: 'validate',
        products: [],
        message,
        suggestions: validation.missing.flatMap(m => m.required)
      };
    }

    // Default search fallback
    const searchResults = this.searchProducts(command);
    return {
      action: 'search',
      products: searchResults.slice(0, 6),
      message: searchResults.length > 0 
        ? `Found ${searchResults.length} products that might help.`
        : "I couldn't find specific products. Try asking about tools, plumbing, electrical, or paint supplies.",
    };
  }
}

export const productService = new ProductService();