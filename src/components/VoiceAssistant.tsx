import React, { useState, useCallback } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

import { productService, Product } from '@/utils/productUtils';

interface VoiceAssistantProps {
  onCommand?: (command: string) => void;
  onProductsFound?: (products: Product[], message: string) => void;
  currentCart?: number[];
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onCommand, onProductsFound, currentCart = [] }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Voice not supported",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setIsVisible(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onCommand?.(transcript);
      
      // Process voice command through product service
      const result = productService.processVoiceCommand(transcript, currentCart);
      onProductsFound?.(result.products, result.message);
      
      // Simulate AI response
      setTimeout(() => {
        setIsSpeaking(true);
        // Simulate speaking duration based on message length
        const speakingDuration = Math.max(2000, result.message.length * 50);
        setTimeout(() => {
          setIsSpeaking(false);
          setIsVisible(false);
        }, speakingDuration);
      }, 500);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      toast({
        title: "Voice error",
        description: "Could not process voice command. Please try again.",
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [onCommand, toast]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    setIsVisible(false);
  }, []);

  return (
    <>
      {/* Floating Voice Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          variant={isListening ? "destructive" : "default"}
          size="lg"
          className="h-16 w-16 rounded-full shadow-brand transition-all duration-300 hover:scale-110"
          onClick={isListening ? stopListening : startListening}
        >
          {isListening ? (
            <MicOff className="h-6 w-6" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Voice Assistant Interface */}
      {isVisible && (
        <Card className="fixed bottom-24 right-6 w-80 p-4 shadow-lg animate-in slide-in-from-bottom-2 z-40">
          <div className="flex items-center space-x-3">
            <div className={`flex-shrink-0 w-3 h-3 rounded-full ${
              isListening ? 'bg-destructive animate-pulse' : 
              isSpeaking ? 'bg-primary animate-pulse' : 'bg-muted'
            }`} />
            <div className="flex-1">
              <p className="text-sm font-medium">
                {isListening ? 'Listening...' : 
                 isSpeaking ? 'AI Assistant is speaking...' : 
                 'Voice Assistant'}
              </p>
              <p className="text-xs text-muted-foreground">
                {isListening ? 'Say something to get help' : 
                 isSpeaking ? 'Please wait for response' : 
                 'Click the mic to start'}
              </p>
            </div>
            {isSpeaking && (
              <Volume2 className="h-4 w-4 text-primary animate-pulse" />
            )}
          </div>
        </Card>
      )}
    </>
  );
};