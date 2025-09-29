import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

interface DynamicElevenLabsWidgetProps {
  apiKey: string;
  agentId: string;
  onToolCall?: (toolName: string, args: Record<string, unknown>) => void;
  onStatusChange?: (status: 'loading' | 'ready' | 'error') => void;
}

// Declare global types for ElevenLabs
declare global {
  interface Window {
    ElevenLabs?: unknown;
  }
}

export const DynamicElevenLabsWidget: React.FC<DynamicElevenLabsWidgetProps> = ({ 
  apiKey, 
  agentId, 
  onToolCall,
  onStatusChange 
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [widgetStatus, setWidgetStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);
  const widgetInitializedRef = useRef(false);

  // Notify parent of status changes
  useEffect(() => {
    onStatusChange?.(widgetStatus);
  }, [widgetStatus, onStatusChange]);

  // Initialize widget when credentials are available
  useEffect(() => {
    if (!apiKey || !agentId) {
      setWidgetStatus('error');
      return;
    }

    initializeWidget();
  }, [apiKey, agentId, initializeWidget]);

  const loadElevenLabsScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (scriptLoadedRef.current) {
        resolve();
        return;
      }

      // Check if elevenlabs-convai element is already defined
      if (customElements.get('elevenlabs-convai')) {
        scriptLoadedRef.current = true;
        resolve();
        return;
      }

      // Remove existing script if any
      const existingScript = document.querySelector('script[src*="convai-widget-embed"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Load the ElevenLabs widget script
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
      script.async = true;
      script.type = 'text/javascript';

      script.onload = () => {
        scriptLoadedRef.current = true;
        // Wait for the custom element to be defined
        const checkElement = () => {
          if (customElements.get('elevenlabs-convai')) {
            resolve();
          } else {
            setTimeout(checkElement, 100);
          }
        };
        checkElement();
      };

      script.onerror = () => {
        console.error('Failed to load ElevenLabs script');
        reject(new Error('Failed to load ElevenLabs script'));
      };

      document.head.appendChild(script);
    });
  };

  const createWidgetElement = () => {
    if (!widgetContainerRef.current) return null;

    // Clear existing widget
    widgetContainerRef.current.innerHTML = '';

    // Create the elevenlabs-convai element
    const widgetElement = document.createElement('elevenlabs-convai') as HTMLElement;
    widgetElement.setAttribute('agent-id', agentId);
    
    // Add the widget to DOM first, then add event listeners
    widgetContainerRef.current.appendChild(widgetElement);
    
    // Try to add event listeners after a brief delay to ensure element is connected
    setTimeout(() => {
      try {
        // Check if the widget has loaded methods/properties
        if (widgetElement && typeof widgetElement.addEventListener === 'function') {
          widgetElement.addEventListener('ready', () => {
            console.log('ElevenLabs widget is ready');
            setWidgetStatus('ready');
          });

          widgetElement.addEventListener('error', (event: Event) => {
            console.error('ElevenLabs widget error:', event);
            setWidgetStatus('error');
          });
        }
      } catch (error) {
        console.warn('Could not add widget event listeners:', error);
      }
    }, 500);

    return widgetElement;
  };

  const initializeWidget = useCallback(async () => {
    try {
      setWidgetStatus('loading');

      // Load the ElevenLabs script
      await loadElevenLabsScript();

      // Create and configure the widget element
      createWidgetElement();

      widgetInitializedRef.current = true;
      
      // Set status to ready after a brief delay to allow widget to initialize
      setTimeout(() => {
        if (widgetContainerRef.current?.querySelector('elevenlabs-convai')) {
          setWidgetStatus('ready');
        } else {
          console.warn('Widget element not found after initialization');
          setWidgetStatus('error');
        }
      }, 1000);

    } catch (error) {
      console.error('Failed to initialize ElevenLabs widget:', error);
      setWidgetStatus('error');
    }
  }, [agentId]);

  // Handle URL-based tool calls (existing functionality)
  useEffect(() => {
    const action = searchParams.get('action');
    if (!action || !onToolCall) return;

    const handleVoiceAction = () => {
      const toolName = action;
      const params: Record<string, unknown> = {};

      // Extract parameters from URL
      searchParams.forEach((value, key) => {
        if (key !== 'action') {
          params[key] = value;
        }
      });

      console.log('Voice tool called:', toolName, params);
      onToolCall(toolName, params);
    };

    handleVoiceAction();

    // Clean up URL after processing
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('action');
    setSearchParams(newSearchParams, { replace: true });
  }, [searchParams, onToolCall, setSearchParams]);

  // Cleanup on unmount
  useEffect(() => {
    const containerElement = widgetContainerRef.current;
    return () => {
      if (containerElement) {
        containerElement.innerHTML = '';
      }
      widgetInitializedRef.current = false;
    };
  }, []);

  if (!apiKey || !agentId) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-sm text-yellow-800">
          Voice features disabled. Please configure your ElevenLabs credentials in settings.
        </p>
      </div>
    );
  }

  return (
    <div className="elevenlabs-widget-container">
      {widgetStatus === 'loading' && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
            <span className="text-sm text-blue-800">Loading voice interface...</span>
          </div>
        </div>
      )}

      {widgetStatus === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">
            Failed to load voice interface. Please check your credentials and try again.
          </p>
        </div>
      )}

      {/* Widget container - hidden until ready */}
      <div 
        ref={widgetContainerRef}
        className={`elevenlabs-widget ${widgetStatus === 'ready' ? 'block' : 'hidden'}`}
        style={{ minHeight: '60px' }}
      />
      
      {widgetStatus === 'ready' && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          🎙️ Voice interface ready - start speaking to interact
        </div>
      )}
    </div>
  );
};