# 🧪 Testing the UI Credentials ElevenLabs Widget

## 🎯 How to Test the Widget Implementation

### Prerequisites
1. **ElevenLabs Account** - Sign up at [elevenlabs.io](https://elevenlabs.io)
2. **Agent Created** - Create an agent in your ElevenLabs dashboard
3. **API Key & Agent ID** - Get these from your ElevenLabs account

### Testing Steps

#### 1. **Run the Application**
```bash
# Switch to UI credentials branch (if not already)
git checkout feature/ui-credentials-input

# Install dependencies and start
npm ci
npm run dev
```

#### 2. **Access the Test Page**
- Open browser to `http://localhost:5173`
- You should see the main Voice Reno Buddy page
- Look for "Voice Settings" button in the top-right area

#### 3. **Test the Widget Loading Process**

**Step 1: Check Initial State**
- Widget should NOT be visible initially
- No voice functionality should be present

**Step 2: Open Voice Settings**
- Click "Voice Settings" button
- Modal should open with form fields for:
  - ElevenLabs API Key
  - Agent ID

**Step 3: Input Credentials**
- Paste your real ElevenLabs API key
- Paste your real Agent ID
- Click "Connect Voice"

**Step 4: Verify Widget Loading**
- Modal should close
- You should see "Loading voice interface..." message
- After ~2-3 seconds, widget should appear
- Status should change to "🎙️ Voice interface ready - start speaking to interact"

#### 4. **Test Voice Functionality**
- Click the microphone button in the widget
- Grant microphone permissions when prompted
- Try speaking commands like:
  - "Search for tools"
  - "Show me kitchen products"  
  - "Add to cart"
  - "What's in my cart?"

#### 5. **Test Persistence**
- Refresh the page
- Widget should automatically reconnect with saved credentials
- No need to re-enter API key/Agent ID

### 🔧 Troubleshooting

#### Widget Won't Load
- **Check browser console** for error messages
- **Verify credentials** - wrong Agent ID is most common issue
- **Check network** - ensure unpkg.com is accessible
- **Try incognito mode** - clear any cached scripts

#### No Voice Recognition
- **Microphone permissions** - browser needs microphone access
- **HTTPS required** - some browsers require secure connection
- **ElevenLabs account** - ensure account has available credits

#### Widget Appears But Errors
- **Agent configuration** - check agent is properly configured in ElevenLabs dashboard
- **Tools setup** - ensure agent has proper tools configured
- **Domain allowlist** - check if your localhost is in agent's allowlist

### 🎯 Expected Widget Behavior

#### Successful Load Sequence:
1. **Loading state**: Blue spinner with "Loading voice interface..."
2. **Script loading**: ElevenLabs script loads from unpkg.com
3. **Element creation**: `elevenlabs-convai` element created with Agent ID
4. **Widget initialization**: ElevenLabs widget connects to servers
5. **Ready state**: "🎙️ Voice interface ready" message appears
6. **Voice active**: Microphone button ready for interaction

#### Widget Element Structure:
```html
<div class="elevenlabs-widget-container">
  <!-- Status message here -->
  <div class="elevenlabs-widget block">
    <elevenlabs-convai agent-id="your-agent-id">
      <!-- ElevenLabs injects content here -->
    </elevenlabs-convai>
  </div>
  <div class="text-center">
    🎙️ Voice interface ready - start speaking to interact
  </div>
</div>
```

### 🧪 Testing Different Scenarios

#### Test 1: Invalid Credentials
- Enter fake API key → should show error
- Enter valid API key + fake Agent ID → should fail to connect

#### Test 2: Network Issues  
- Block unpkg.com → should show script loading error
- Slow connection → should show loading state appropriately

#### Test 3: Disconnection/Reconnection
- Click "Disconnect" → widget should disappear
- Reconnect with same credentials → should work immediately
- Reconnect with different agent → should load new agent

#### Test 4: Multiple Sessions
- Open multiple tabs → each should work independently
- Close tab and reopen → should auto-reconnect

### ✅ Success Indicators

- ✅ **Clean UI**: No hardcoded credentials visible
- ✅ **User Control**: Users can connect/disconnect at will
- ✅ **Persistence**: Credentials remembered across sessions  
- ✅ **Error Handling**: Clear messages for failed states
- ✅ **Voice Active**: Microphone button responsive and working
- ✅ **Tool Integration**: Voice commands trigger expected actions

---

**The widget should work seamlessly once users input their own ElevenLabs credentials - no code changes or environment setup required!** 🎯