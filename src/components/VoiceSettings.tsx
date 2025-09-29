import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Mic, MicOff, CheckCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface VoiceSettingsProps {
  onCredentialsChange: (apiKey: string, agentId: string) => void;
}

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export const VoiceSettings: React.FC<VoiceSettingsProps> = ({ onCredentialsChange }) => {
  const [apiKey, setApiKey] = useState('');
  const [agentId, setAgentId] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Load saved credentials on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('elevenlabs-api-key');
    const savedAgentId = localStorage.getItem('elevenlabs-agent-id');
    
    if (savedApiKey && savedAgentId) {
      setApiKey(savedApiKey);
      setAgentId(savedAgentId);
      setConnectionStatus('connected');
      onCredentialsChange(savedApiKey, savedAgentId);
    }
  }, [onCredentialsChange]);

  const handleConnect = async () => {
    if (!apiKey.trim() || !agentId.trim()) {
      setErrorMessage('Please enter both API Key and Agent ID');
      return;
    }

    setConnectionStatus('connecting');
    setErrorMessage('');

    try {
      // Validate API key format (basic check)
      if (!apiKey.startsWith('sk-') && !apiKey.includes('elevenlabs')) {
        throw new Error('API Key format appears invalid');
      }

      // Save credentials to localStorage
      localStorage.setItem('elevenlabs-api-key', apiKey);
      localStorage.setItem('elevenlabs-agent-id', agentId);

      // Notify parent component
      onCredentialsChange(apiKey, agentId);

      setConnectionStatus('connected');
      setIsOpen(false);
    } catch (error) {
      setConnectionStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Connection failed');
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('elevenlabs-api-key');
    localStorage.removeItem('elevenlabs-agent-id');
    setApiKey('');
    setAgentId('');
    setConnectionStatus('disconnected');
    setErrorMessage('');
    onCredentialsChange('', '');
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'connecting':
        return <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <MicOff className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Voice Connected';
      case 'connecting':
        return 'Connecting...';
      case 'error':
        return 'Connection Failed';
      default:
        return 'Voice Disabled';
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Status Indicator */}
      <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-md">
        {getStatusIcon()}
        <span className="text-sm font-medium">{getStatusText()}</span>
      </div>

      {/* Settings Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
            <span className="ml-2">Voice Settings</span>
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              ElevenLabs Voice Configuration
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Instructions */}
            <Alert>
              <AlertDescription>
                Enter your ElevenLabs credentials to enable voice features. 
                Get your API key and Agent ID from your{' '}
                <a 
                  href="https://elevenlabs.io/app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  ElevenLabs Dashboard
                </a>.
              </AlertDescription>
            </Alert>

            {/* API Key Input */}
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your ElevenLabs API key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="font-mono text-sm"
              />
            </div>

            {/* Agent ID Input */}
            <div className="space-y-2">
              <Label htmlFor="agentId">Agent ID</Label>
              <Input
                id="agentId"
                placeholder="Enter your ElevenLabs Agent ID..."
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                className="font-mono text-sm"
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              {connectionStatus === 'connected' ? (
                <Button 
                  onClick={handleDisconnect}
                  variant="outline"
                  className="flex-1"
                >
                  Disconnect Voice
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={() => setIsOpen(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleConnect}
                    disabled={connectionStatus === 'connecting'}
                    className="flex-1"
                  >
                    {connectionStatus === 'connecting' ? 'Connecting...' : 'Connect Voice'}
                  </Button>
                </>
              )}
            </div>

            {/* Help Text */}
            <div className="text-xs text-gray-500 mt-4">
              <p>Your credentials are stored locally in your browser and never sent to our servers.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};