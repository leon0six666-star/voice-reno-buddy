import React, { useEffect, useState, useRef } from 'react';
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
    ElevenLabs?: any;
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
  }, [apiKey, agentId]);

  const loadElevenLabsScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (scriptLoadedRef.current && window.ElevenLabs) {
        resolve();
        return;
      }

      // Remove existing script if any
      const existingScript = document.querySelector('script[src*="elevenlabs"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Load the ElevenLabs widget script
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
      script.async = true;

      script.onload = () => {
        scriptLoadedRef.current = true;
        // Give the script a moment to initialize
        setTimeout(() => resolve(), 100);
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
    const widgetElement = document.createElement('elevenlabs-convai');
    widgetElement.setAttribute('agent-id', agentId);
    
    // Add event listeners if needed
    widgetElement.addEventListener('ready', () => {
      console.log('ElevenLabs widget is ready');
      setWidgetStatus('ready');
    });

    widgetElement.addEventListener('error', (event) => {
      console.error('ElevenLabs widget error:', event);
      setWidgetStatus('error');
    });

    widgetContainerRef.current.appendChild(widgetElement);
    return widgetElement;
  };

  const initializeWidget = async () => {
    try {
      setWidgetStatus('loading');

      // Load the ElevenLabs script
      await loadElevenLabsScript();

      // Create and configure the widget element
      createWidgetElement();

      widgetInitializedRef.current = true;
      
      // Set status to ready after a brief delay to allow widget to initialize
      setTimeout(() => {
        setWidgetStatus('ready');
      }, 1000);

    } catch (error) {
      console.error('Failed to initialize ElevenLabs widget:', error);
      setWidgetStatus('error');
    }
  };

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
    return () => {
      if (widgetContainerRef.current) {
        widgetContainerRef.current.innerHTML = '';
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