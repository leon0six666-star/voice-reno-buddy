import React from 'react';
import { Search, AlertTriangle, CheckCircle } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Product } from '@/utils/productUtils';

interface SearchResultsProps {
  products: Product[];
  message: string;
  isVisible: boolean;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (productId: string) => void;
  favorites?: string[];
  cartValidation?: {
    isValid: boolean;
    conflicts: Array<{product1: Product; product2: Product; reason: string}>;
    missing: Array<{product: Product; required: Product[]}>;
  };
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  products,
  message,
  isVisible,
  onAddToCart,
  onToggleFavorite,
  favorites = [],
  cartValidation
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader className="bg-gradient-primary text-primary-foreground">
          <div className="flex items-center space-x-3">
            <Search className="h-6 w-6" />
            <CardTitle>Voice Search Results</CardTitle>
          </div>
          <p className="text-primary-foreground/90">{message}</p>
        </CardHeader>
        
        <CardContent className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Cart Validation Alerts */}
          {cartValidation && !cartValidation.isValid && (
            <div className="mb-6 space-y-3">
              {cartValidation.conflicts.length > 0 && (
                <Alert className="border-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Compatibility Issues:</strong>
                    {cartValidation.conflicts.map((conflict, index) => (
                      <div key={index} className="mt-1">
                        {conflict.product1.name} and {conflict.product2.name} are not compatible
                      </div>
                    ))}
                  </AlertDescription>
                </Alert>
              )}
              
              {cartValidation.missing.length > 0 && (
                <Alert className="border-primary">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Missing Required Items:</strong>
                    {cartValidation.missing.map((missing, index) => (
                      <div key={index} className="mt-1">
                        {missing.product.name} requires: {missing.required.map(r => r.name).join(', ')}
                      </div>
                    ))}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard
                    product={{
                      id: product.id.toString(),
                      name: product.name,
                      price: product.price,
                      rating: product.rating,
                      reviewCount: product.reviewCount,
                      image: product.image,
                      category: product.category,
                      inStock: product.inStock,
                      features: Object.values(product.specs).slice(0, 2).map(String)
                    }}
                    onAddToCart={() => onAddToCart?.(product)}
                    onToggleFavorite={() => onToggleFavorite?.(product.id.toString())}
                    isFavorite={favorites.includes(product.id.toString())}
                  />
                  
                  {/* Product Tags */}
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {product.project_tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">No products found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Try asking about tools, plumbing, electrical, or paint supplies
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};