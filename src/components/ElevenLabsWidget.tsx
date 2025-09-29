import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface ElevenLabsWidgetProps {
  onToolCall?: (toolName: string, args: Record<string, unknown>) => void;
}

export const ElevenLabsWidget: React.FC<ElevenLabsWidgetProps> = ({ onToolCall }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // Create ElevenLabs widget configuration
    const widgetConfig = {
      agentId: process.env.ELEVENLABS_AGENT_ID || "demo-agent",
      signedUrl: process.env.ELEVENLABS_SIGNED_URL || "",
      onConnect: () => {
        console.log('ElevenLabs widget connected');
      },
      onDisconnect: () => {
        console.log('ElevenLabs widget disconnected');
      },
      onMessage: (message: string) => {
        console.log('AI message:', message);
      },
      onError: (error: Error | string) => {
        console.error('ElevenLabs error:', error);
      }
    };

    // Initialize ElevenLabs widget
    const initializeWidget = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const windowWithElevenlabs = window as any;
      if (typeof window !== 'undefined' && windowWithElevenlabs.ElevenLabs) {
        windowWithElevenlabs.ElevenLabs.widget.create(widgetConfig);
      } else {
        // Load ElevenLabs script if not already loaded
        const script = document.createElement('script');
        script.src = 'https://elevenlabs.io/widget/widget.js';
        script.async = true;
        script.onload = () => {
          windowWithElevenlabs.ElevenLabs.widget.create(widgetConfig);
        };
        document.head.appendChild(script);
      }
    };

    // Define available tools for the AI agent
    const tools = {
      navigate_to_page: (args: { page: string }) => {
        console.log('Navigate to page:', args.page);
        setSearchParams(prev => {
          const newParams = new URLSearchParams(prev);
          newParams.set('page', args.page);
          return newParams;
        });
        onToolCall?.('navigate_to_page', args);
      },

      filter_products: (args: { category?: string; priceRange?: string; inStock?: boolean }) => {
        console.log('Filter products:', args);
        setSearchParams(prev => {
          const newParams = new URLSearchParams(prev);
          if (args.category) newParams.set('category', args.category);
          if (args.priceRange) newParams.set('priceRange', args.priceRange);
          if (args.inStock !== undefined) newParams.set('inStock', args.inStock.toString());
          newParams.set('action', 'filter');
          return newParams;
        });
        onToolCall?.('filter_products', args);
      },

      view_product_details: (args: { productId: string }) => {
        console.log('View product details:', args.productId);
        setSearchParams(prev => {
          const newParams = new URLSearchParams(prev);
          newParams.set('productId', args.productId);
          newParams.set('action', 'view_details');
          return newParams;
        });
        onToolCall?.('view_product_details', args);
      },

      add_to_cart: (args: { productId: string; quantity?: number }) => {
        console.log('Add to cart:', args);
        setSearchParams(prev => {
          const newParams = new URLSearchParams(prev);
          newParams.set('productId', args.productId);
          newParams.set('quantity', (args.quantity || 1).toString());
          newParams.set('action', 'add_to_cart');
          return newParams;
        });
        onToolCall?.('add_to_cart', args);
      },

      search_products: (args: { query: string }) => {
        console.log('Search products:', args.query);
        setSearchParams(prev => {
          const newParams = new URLSearchParams(prev);
          newParams.set('search', args.query);
          newParams.set('action', 'search');
          return newParams;
        });
        onToolCall?.('search_products', args);
      },

      get_cart_info: (args: Record<string, never>) => {
        console.log('Get cart info');
        setSearchParams(prev => {
          const newParams = new URLSearchParams(prev);
          newParams.set('action', 'get_cart');
          return newParams;
        });
        onToolCall?.('get_cart_info', args);
      },

      check_compatibility: (args: { productIds: string[] }) => {
        console.log('Check compatibility:', args.productIds);
        setSearchParams(prev => {
          const newParams = new URLSearchParams(prev);
          newParams.set('productIds', args.productIds.join(','));
          newParams.set('action', 'check_compatibility');
          return newParams;
        });
        onToolCall?.('check_compatibility', args);
      },

      get_recommendations: (args: { productId?: string; category?: string }) => {
        console.log('Get recommendations:', args);
        setSearchParams(prev => {
          const newParams = new URLSearchParams(prev);
          if (args.productId) newParams.set('productId', args.productId);
          if (args.category) newParams.set('category', args.category);
          newParams.set('action', 'get_recommendations');
          return newParams;
        });
        onToolCall?.('get_recommendations', args);
      }
    };

    // Make tools available globally for the ElevenLabs agent
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).voiceRenoTools = tools;

    initializeWidget();

    return () => {
      // Cleanup widget if needed
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const windowWithElevenlabs = window as any;
      if (typeof window !== 'undefined' && windowWithElevenlabs.ElevenLabs) {
        try {
          windowWithElevenlabs.ElevenLabs.widget.destroy();
        } catch (e) {
          console.warn('Error destroying ElevenLabs widget:', e);
        }
      }
    };
  }, [onToolCall, setSearchParams]);

  // This component doesn't render anything visible - the widget is managed by ElevenLabs
  return null;
};