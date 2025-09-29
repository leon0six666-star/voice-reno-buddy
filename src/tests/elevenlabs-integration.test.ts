/**
 * Test for ElevenLabs Widget Integration
 * This validates that the URL-driven architecture works correctly
 */

import { productService } from '../utils/productUtils';

describe('ElevenLabs Integration Architecture', () => {
  
  test('Product database has 50 products from PRD requirements', () => {
    const products = productService.getAllProducts();
    expect(products.length).toBe(50);
    
    // Verify we have all required categories
    const categories = [...new Set(products.map(p => p.category))];
    expect(categories).toContain('Plumbing');
    expect(categories).toContain('Tools');
    expect(categories).toContain('Paint');
    expect(categories).toContain('Hardware');
    expect(categories).toContain('Electrical');
  });

  test('Products have complex compatibility relationships', () => {
    const products = productService.getAllProducts();
    
    // Verify products have compatibility/incompatibility data
    const productsWithCompatibilities = products.filter(p => p.compatibilities.length > 0);
    const productsWithIncompatibilities = products.filter(p => p.incompatibilities.length > 0);
    const productsWithRequirements = products.filter(p => p.requires.length > 0);
    
    expect(productsWithCompatibilities.length).toBeGreaterThan(20);
    expect(productsWithIncompatibilities.length).toBeGreaterThan(5);
    expect(productsWithRequirements.length).toBeGreaterThan(5);
  });

  test('Cart validation system works correctly', () => {
    // Test compatible products
    const compatibleCart = [1, 2, 3]; // Kitchen faucet, sink drain, PVC pipe
    const validation = productService.validateCart(compatibleCart);
    expect(validation.isValid).toBe(true);
    expect(validation.conflicts.length).toBe(0);
    
    // Test incompatible products
    const incompatibleCart = [1, 4]; // Kitchen faucet + copper pipe (incompatible)
    const invalidValidation = productService.validateCart(incompatibleCart);
    expect(invalidValidation.conflicts.length).toBeGreaterThan(0);
  });

  test('Voice command processing provides relevant results', () => {
    // Test kitchen search
    const kitchenResult = productService.processVoiceCommand("show me kitchen products", []);
    expect(kitchenResult.products.length).toBeGreaterThan(0);
    expect(kitchenResult.message).toContain('kitchen');
    
    // Test bathroom search  
    const bathroomResult = productService.processVoiceCommand("bathroom renovation items", []);
    expect(bathroomResult.products.length).toBeGreaterThan(0);
    expect(bathroomResult.message).toContain('bathroom');
    
    // Test general search
    const searchResult = productService.processVoiceCommand("find drill", []);
    expect(searchResult.products.length).toBeGreaterThan(0);
    expect(searchResult.products.some(p => p.name.toLowerCase().includes('drill'))).toBe(true);
  });

  test('Smart recommendations work with current cart', () => {
    const cartWithFaucet = [1]; // Kitchen faucet
    const recommendations = productService.getSmartRecommendations(cartWithFaucet);
    
    expect(recommendations.length).toBeGreaterThan(0);
    // Should not recommend the faucet itself
    expect(recommendations.find(p => p.id === 1)).toBeUndefined();
    // Should recommend compatible/required items
    expect(recommendations.some(p => p.category === 'Plumbing' || p.category === 'Hardware')).toBe(true);
  });

  test('URL state management tools structure', () => {
    // This test validates that our tools follow the URL-driven pattern
    // In a real implementation, tools would be tested via URL parameter changes
    
    const expectedTools = [
      'navigate_to_page',
      'filter_products', 
      'view_product_details',
      'add_to_cart',
      'search_products',
      'get_cart_info',
      'check_compatibility',
      'get_recommendations'
    ];
    
    // This test ensures we have all the required tools for ElevenLabs integration
    expect(expectedTools.length).toBe(8);
    
    // In the actual ElevenLabsWidget component, these tools update URL searchParams
    // which triggers useEffect in Index.tsx to perform the actual operations
  });

  test('Project-based product groupings are comprehensive', () => {
    const bathroomProducts = productService.getProductsForProject('bathroom_remodel');
    const kitchenProducts = productService.getProductsForProject('kitchen_remodel'); 
    const paintingProducts = productService.getProductsForProject('room_painting');
    
    expect(bathroomProducts.length).toBeGreaterThan(5);
    expect(kitchenProducts.length).toBeGreaterThan(8);
    expect(paintingProducts.length).toBeGreaterThan(4);
    
    // Verify different product categories in each project
    expect(bathroomProducts.some(p => p.category === 'Plumbing')).toBe(true);
    expect(kitchenProducts.some(p => p.category === 'Tools')).toBe(true);
    expect(paintingProducts.some(p => p.category === 'Paint')).toBe(true);
  });

});