# 🔧 Simple ElevenLabs Widget Integration Guide

**The Reality Check**: ElevenLabs integration is much simpler than complex architectures. 

## 3 Simple Components That Work Together

### 1. **API Key** 
- Get from your ElevenLabs account dashboard
- Used for authentication with ElevenLabs services

### 2. **Agent ID** 
- Created in ElevenLabs dashboard when you set up your conversational AI agent
- Unique identifier for your specific voice agent (e.g., `"gfxc5G8NfuhDmMvpv8tZ"`)

### 3. **Widget Code**
- Simple HTML snippet that embeds the voice interface
- No complex React components needed

```html
<elevenlabs-convai agent-id="YOUR_AGENT_ID"></elevenlabs-convai>
<script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>
```

**That's it!** The widget handles everything else automatically.

---

## 🎯 Integration Steps

### Step 1: ElevenLabs Dashboard Setup (Manual)
1. Go to [ElevenLabs Dashboard](https://elevenlabs.io)
2. Create new Conversational AI Agent  
3. Copy your Agent ID
4. **Manually configure in dashboard**:
   - Upload tools (use `elevenlabs-tools.json` as reference)
   - Set knowledge base (copy from `elevenlabs-knowledge.md`)
   - Configure system prompt (copy from `elevenlabs-system-prompt.md`)

### Step 2: Add Widget to Your Website
Just add the HTML snippet wherever you want the voice interface:

```jsx
// In your React component
<div className="voice-widget-container">
  <elevenlabs-convai agent-id="gfxc5G8NfuhDmMvpv8tZ"></elevenlabs-convai>
  <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>
</div>
```

### Step 3: Optional React Wrapper (For Cleaner Code)
If you want a reusable React component:

```tsx
interface VoiceWidgetProps {
  agentId: string;
  className?: string;
}

const VoiceWidget: React.FC<VoiceWidgetProps> = ({ agentId, className }) => {
  return (
    <div className={className}>
      <elevenlabs-convai agent-id={agentId}></elevenlabs-convai>
      <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>
    </div>
  );
};
```

**Usage**: `<VoiceWidget agentId="your-agent-id" className="fixed bottom-4 right-4" />`

---

## 🔄 How It All Works Together

```
1. User speaks to widget
2. ElevenLabs processes speech → text
3. Agent (configured in ElevenLabs dashboard) processes intent
4. Agent calls tools (if configured)
5. Tools trigger URL changes in your app
6. Your app responds to URL changes
7. UI updates accordingly
```

## 📝 Manual Configuration in ElevenLabs Dashboard

**Important**: All the JSON files and templates in this toolkit are **examples for manual setup**. You copy-paste them into the ElevenLabs web interface, not upload programmatically.

### Tools Configuration
- Go to Agent Settings → Tools
- Copy tools from `elevenlabs-tools.json` 
- Paste/configure each tool manually in the interface

### Knowledge Base
- Go to Agent Settings → Knowledge
- Copy content from `elevenlabs-knowledge.md`
- Paste into knowledge base section

### System Prompt
- Go to Agent Settings → System Prompt  
- Copy content from `elevenlabs-system-prompt.md`
- Configure behavioral guidelines

---

## 💡 Why This Simple Approach Works

### Benefits
- **No Complex Architecture**: Just HTML + manual dashboard setup
- **No API Management**: ElevenLabs handles all the complex voice processing
- **Easy Debugging**: Test directly in ElevenLabs dashboard
- **Quick Integration**: Add widget in minutes, not hours
- **Future-Proof**: ElevenLabs updates the widget automatically

### When You Need More Complex Architecture
The complex URL-driven architecture in this toolkit is useful when you need:
- Programmatic tool management
- Complex state synchronization
- Custom voice command routing
- Advanced debugging capabilities
- Integration with existing routing systems

For most use cases, the simple widget + manual dashboard configuration is sufficient.

---

## 🚨 Common Mistakes to Avoid

❌ **Don't** try to configure tools programmatically  
✅ **Do** use the ElevenLabs dashboard interface

❌ **Don't** create complex React components for basic integration  
✅ **Do** use the simple HTML snippet

❌ **Don't** overthink the architecture  
✅ **Do** start simple, add complexity only when needed

❌ **Don't** try to upload JSON files directly  
✅ **Do** copy-paste content into dashboard manually

---

## 🎯 Quick Start Summary

1. **Get ElevenLabs account** → Get API key
2. **Create agent in dashboard** → Get Agent ID  
3. **Configure agent manually** (tools, knowledge, prompt)
4. **Add widget HTML** to your website
5. **Test** → Done!

**Total time: 30 minutes for basic integration**

---

*This simple approach covers 90% of use cases. Use the complex architecture patterns only when you specifically need programmatic control or advanced features.*