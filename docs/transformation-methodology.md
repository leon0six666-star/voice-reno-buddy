# ElevenLabs Transformation Methodology
**Step-by-Step Guide for LLMs to Transform Any Website**

## 🎯 Pre-Transformation Analysis

### Step 1: Project Assessment
```markdown
**Checklist for LLM:**
- [ ] Identify application type (React, Next.js, Vue, etc.)
- [ ] Locate routing system (React Router, Next.js, etc.)
- [ ] Map existing user actions (search, add to cart, navigate, etc.)
- [ ] Document data models (products, users, content)
- [ ] Identify state management approach (useState, Context, Redux)
- [ ] Check for TypeScript configuration
```

### Step 2: Voice Integration Planning
```markdown
**Define Voice Capabilities:**
- [ ] List primary user intents (what users want to accomplish)
- [ ] Map intents to existing app functions
- [ ] Identify required voice tools (typically 8-12 tools)
- [ ] Plan URL parameter structure for state management
- [ ] Define knowledge base requirements
```

---

## 🔧 Phase 1: Core Architecture Setup

### Step 3: Create ElevenLabs Widget Component

**File: `src/components/ElevenLabsWidget.tsx`**

```typescript
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface ElevenLabsWidgetProps {
  onToolCall?: (toolName: string, args: Record<string, unknown>) => void;
}

export const ElevenLabsWidget: React.FC<ElevenLabsWidgetProps> = ({ onToolCall }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // ElevenLabs widget configuration
    const widgetConfig = {
      agentId: process.env.REACT_APP_ELEVENLABS_AGENT_ID || "demo-agent",
      signedUrl: process.env.REACT_APP_ELEVENLABS_SIGNED_URL || "",
      onConnect: () => console.log('ElevenLabs widget connected'),
      onDisconnect: () => console.log('ElevenLabs widget disconnected'),
      onMessage: (message: string) => console.log('AI message:', message),
      onError: (error: Error | string) => console.error('ElevenLabs error:', error)
    };

    // Initialize widget
    const initializeWidget = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const windowWithElevenlabs = window as any;
      if (typeof window !== 'undefined' && windowWithElevenlabs.ElevenLabs) {
        windowWithElevenlabs.ElevenLabs.widget.create(widgetConfig);
      } else {
        const script = document.createElement('script');
        script.src = 'https://elevenlabs.io/widget/widget.js';
        script.async = true;
        script.onload = () => windowWithElevenlabs.ElevenLabs.widget.create(widgetConfig);
        document.head.appendChild(script);
      }
    };

    // Define voice tools (customize based on your app)
    const tools = {
      // Add your voice tools here - see template for examples
    };

    // Make tools globally available
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).voiceTools = tools;

    initializeWidget();

    return () => {
      // Cleanup
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const windowWithElevenlabs = window as any;
      if (windowWithElevenlabs.ElevenLabs) {
        try {
          windowWithElevenlabs.ElevenLabs.widget.destroy();
        } catch (e) {
          console.warn('Error destroying ElevenLabs widget:', e);
        }
      }
    };
  }, [onToolCall, setSearchParams]);

  return null; // Widget is managed by ElevenLabs
};
```

### Step 4: Define Voice Tools

**Create voice tools based on your app's functionality:**

```typescript
const tools = {
  search_products: (args: { query: string }) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('search', args.query);
      newParams.set('action', 'search');
      return newParams;
    });
    onToolCall?.('search_products', args);
  },

  add_to_cart: (args: { productId: string; quantity?: number }) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('productId', args.productId);
      newParams.set('quantity', (args.quantity || 1).toString());
      newParams.set('action', 'add_to_cart');
      return newParams;
    });
    onToolCall?.('add_to_cart', args);
  },

  // Add more tools based on your app's needs
  // Each tool should update URL parameters and call onToolCall
};
```

### Step 5: Integrate Widget into Main App

**Update your main page component (e.g., `src/pages/Index.tsx` or `src/App.tsx`):**

```typescript
import { ElevenLabsWidget } from '@/components/ElevenLabsWidget';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useCallback } from 'react';

export const YourMainComponent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Handle URL-driven actions from voice commands
  useEffect(() => {
    const action = searchParams.get('action');
    if (!action) return;

    switch (action) {
      case 'search':
        handleSearchFromURL();
        break;
      case 'add_to_cart':
        handleAddToCartFromURL();
        break;
      // Add cases for each voice action
    }

    // Clear action after processing
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.delete('action');
      return newParams;
    });
  }, [searchParams, setSearchParams]);

  // Define handlers for each voice action
  const handleSearchFromURL = useCallback(() => {
    const query = searchParams.get('search');
    if (query) {
      // Execute your existing search logic
      performSearch(query);
    }
  }, [searchParams]);

  const handleAddToCartFromURL = useCallback(() => {
    const productId = searchParams.get('productId');
    const quantity = parseInt(searchParams.get('quantity') || '1');
    if (productId) {
      // Execute your existing add-to-cart logic
      addProductToCart(productId, quantity);
    }
  }, [searchParams]);

  return (
    <div>
      {/* Your existing UI components */}
      <YourExistingComponents />
      
      {/* Add ElevenLabs Widget */}
      <ElevenLabsWidget 
        onToolCall={(toolName, args) => {
          console.log('Voice tool called:', toolName, args);
        }}
      />
    </div>
  );
};
```

---

## 🎛️ Phase 2: Voice Tools Configuration

### Step 6: Create Tools Definition JSON

**File: `docs/elevenlabs-tools.json`**

Based on your app's functionality, create a comprehensive tools definition. Use the template provided in `docs/elevenlabs-tools.json` and customize for your specific needs.

**Key principles:**
- Each tool should represent a single, specific user action
- Parameters should be strictly typed with validation
- Include enums for categorical values
- Add clear descriptions for the AI agent

### Step 7: Map Voice Actions to App Functions

**Create mapping between voice tools and existing app functions:**

```markdown
Voice Tool → App Function Mapping:
- search_products → existing search functionality
- add_to_cart → existing cart management
- navigate_to_page → existing routing logic
- filter_products → existing filtering system
- get_recommendations → existing recommendation engine
```

---

## 🧠 Phase 3: Knowledge Base Creation

### Step 8: Analyze Your App's Domain

**Document your app's knowledge domain:**

```markdown
Business Context:
- What does your app do?
- Who are your users?
- What problems does it solve?

Data Models:
- What are the main entities? (products, users, orders, etc.)
- What relationships exist between entities?
- What business rules apply?

User Workflows:
- What are the common user journeys?
- What decisions do users make?
- What information do they need?
```

### Step 9: Create Knowledge Base

**File: `docs/elevenlabs-knowledge.md`**

Use the template provided and customize with your app's specific information:

- Business context and value proposition
- Product/content categories and specifications  
- User interaction patterns and common requests
- Business rules and constraints
- Safety considerations or important warnings

---

## 🎭 Phase 4: System Prompt Development

### Step 10: Define Agent Personality

**Customize the system prompt template:**

```markdown
Core Identity:
- What is the agent's role?
- What expertise does it have?
- What personality traits are appropriate?

Behavioral Guidelines:
- How should it communicate?
- What tone and style to use?
- How to handle errors and edge cases?

Tool Usage:
- When to use each tool?
- How to combine tools effectively?
- What order to execute actions?
```

---

## ✅ Phase 5: Testing & Validation

### Step 11: Manual Testing Checklist

```markdown
URL State Management:
- [ ] Voice tools update URL parameters correctly
- [ ] URL changes trigger appropriate app actions  
- [ ] Actions don't interfere with existing functionality
- [ ] Browser back/forward works correctly

Voice Integration:
- [ ] Widget initializes without errors
- [ ] Tools are available to ElevenLabs agent
- [ ] Voice commands execute intended actions
- [ ] Error handling works gracefully

Code Quality:
- [ ] TypeScript compilation succeeds
- [ ] ESLint passes without errors
- [ ] Build process completes successfully
- [ ] No console errors in browser
```

### Step 12: Performance Validation

```markdown
Performance Checks:
- [ ] Initial page load < 3 seconds
- [ ] Voice action response < 2 seconds
- [ ] Memory usage doesn't increase significantly
- [ ] No infinite re-renders or loops
```

---

## 📦 Phase 6: Documentation & Deployment

### Step 13: Create Complete Documentation Package

**Required files:**
- `docs/elevenlabs-tools.json` - Tools definition for upload
- `docs/elevenlabs-knowledge.md` - Knowledge base content
- `docs/elevenlabs-system-prompt.md` - System prompt configuration
- `docs/implementation-notes.md` - Custom implementation details

### Step 14: ElevenLabs Platform Configuration

**Steps to configure ElevenLabs:**

1. **Upload Tools Definition**
   - Go to ElevenLabs platform
   - Navigate to agent configuration
   - Upload `elevenlabs-tools.json`
   - Test tool validation

2. **Configure Knowledge Base**
   - Add knowledge base content from `elevenlabs-knowledge.md`
   - Test knowledge retrieval
   - Validate agent responses

3. **Set System Prompt**
   - Copy content from `elevenlabs-system-prompt.md`
   - Configure in agent settings
   - Test behavioral guidelines

4. **Environment Variables**
   ```bash
   REACT_APP_ELEVENLABS_AGENT_ID=your-agent-id
   REACT_APP_ELEVENLABS_SIGNED_URL=your-signed-url
   ```

---

## 🚨 Common Issues & Solutions

### Issue: TypeScript Errors
**Solution:** Use the exact type definitions provided in templates and add eslint-disable comments for ElevenLabs window APIs

### Issue: URL Parameters Not Triggering Actions
**Solution:** Check useEffect dependencies and ensure searchParams is properly destructured

### Issue: Existing Functionality Breaks  
**Solution:** Ensure voice handlers don't interfere with existing event listeners; test all existing workflows

### Issue: Widget Doesn't Initialize
**Solution:** Check script loading, console errors, and ElevenLabs configuration

---

## 📈 Success Metrics & Optimization

### Technical Metrics
- All voice tools function correctly via URL parameters ✅
- Zero breaking changes to existing functionality ✅  
- TypeScript compilation without errors ✅
- Build process completes successfully ✅

### User Experience Metrics
- Voice commands execute intended actions ✅
- Response times < 2 seconds ✅
- Error handling manages failures gracefully ✅
- Conversation flow feels natural ✅

### Business Metrics
- Increased user engagement through voice features
- Reduced bounce rate with hands-free interaction
- Improved accessibility for users in various contexts
- Enhanced user satisfaction with intelligent assistance

---

## 🔄 Iterative Improvement

### After Initial Implementation
1. **Monitor user interactions** - Track which tools are used most frequently
2. **Identify pain points** - Note where voice commands fail or confuse users
3. **Enhance knowledge base** - Add information based on common questions
4. **Refine system prompt** - Improve agent responses based on user feedback
5. **Optimize performance** - Address any speed or reliability issues

### Long-term Evolution
1. **Add advanced features** - Multi-turn conversations, context memory
2. **Integrate analytics** - Track voice interaction patterns and success rates
3. **Expand tool set** - Add new voice capabilities based on user needs
4. **Enhance intelligence** - Improve natural language understanding and responses

---

**This methodology has been tested and validated through the successful transformation of voice-reno-buddy. Follow these steps systematically, and any LLM should be able to transform a website into a fully functional ElevenLabs voice application.**