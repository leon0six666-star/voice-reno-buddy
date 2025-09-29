# Metadata
- Last Updated: 2025-01-27 14:30
- Version: 1.0
- Notes: Initial technical stack and tooling documentation

# Technical Context: Voice Reno Buddy

## Technology Stack

### Frontend Framework
- **React 18.3.1**: Modern hooks-based architecture
- **TypeScript 5.8.3**: Full type safety across application
- **Vite 5.4.19**: Fast build tool with HMR for development

### UI & Styling
- **shadcn/ui**: Component library built on Radix UI primitives
- **Tailwind CSS 3.4.17**: Utility-first styling approach
- **Radix UI**: Accessible component primitives (40+ packages)
- **Lucide React**: Icon system with 460+ icons

### Voice & AI Integration
- **Web Speech API**: Native browser speech recognition
- **@11labs/react 0.2.0**: Text-to-speech capabilities (not currently used)
- **Custom voice processing**: Natural language command parsing

### State Management & Data
- **React Query (TanStack) 5.83.0**: Server state management
- **React Hook Form 7.61.1**: Form validation with Zod schemas
- **JSON Database**: Local product data with structured relationships

### Development Tools
- **ESLint 9.32.0**: Code linting with React-specific rules
- **Bun**: Package manager and JavaScript runtime
- **PostCSS**: CSS processing with autoprefixer

## Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # shadcn/ui base components (40+ files)
│   ├── VoiceAssistant.tsx   # Voice interaction logic
│   ├── ProductCard.tsx      # Product display
│   └── SearchResults.tsx    # Search UI
├── data/                # Static data
│   ├── productDatabase.json # Product catalog
│   └── products.ts          # Product type definitions  
├── utils/               # Business logic
│   └── productUtils.ts      # ProductService class
├── hooks/               # Custom React hooks
├── pages/               # Route components
└── lib/                 # Utility functions
```

## Development Setup

### Package Manager
**Bun 1.2.22** (detected from user agent and lockfile)
- Faster than npm/yarn for installs
- Native TypeScript support
- Built-in bundler and test runner

### Build Configuration
```typescript
// vite.config.ts
- React SWC plugin for fast compilation
- Path aliases (@/components, @/utils)
- TypeScript strict mode enabled
```

### Code Quality Setup
```javascript
// eslint.config.js
- React hooks rules
- TypeScript ESLint integration
- Globals configuration for browser APIs
```

## Technical Constraints

### Browser Compatibility
- **Speech Recognition**: Chrome/Edge (webkit), limited Safari support
- **Modern JavaScript**: ES2022+ features used
- **Responsive Design**: Mobile-first approach required

### Performance Considerations
- **Bundle Size**: Large shadcn/ui component library
- **Voice Latency**: Web Speech API processing time
- **Product Database**: JSON parsing on client-side

### Development Environment
- **Node.js**: Required for Vite and tooling
- **Modern Browser**: Chrome/Firefox recommended for development
- **TypeScript**: Strict mode enforced

## External Dependencies

### Critical Dependencies
- **@radix-ui/***: 20+ packages for accessible components
- **class-variance-authority**: Component variant management  
- **cmdk**: Command palette functionality
- **react-router-dom**: Client-side routing

### Development Dependencies
- **@vitejs/plugin-react-swc**: Fast React compilation
- **typescript-eslint**: TypeScript linting rules
- **tailwindcss**: CSS framework with plugins

## Configuration Files

### Core Config Files
- `vite.config.ts`: Build configuration
- `tailwind.config.ts`: Styling configuration  
- `tsconfig.json`: TypeScript compiler options
- `components.json`: shadcn/ui component configuration

### Package Management
- `bun.lockb`: Bun lockfile (binary format)
- `package.json`: Dependencies and scripts
- `package-lock.json`: Legacy npm lockfile (should be removed)

## Tool Usage Patterns

### Development Workflow
```bash
bun install          # Install dependencies
bun run dev         # Start dev server with HMR
bun run build       # Production build
bun run lint        # Code quality checks
```

### Component Development
- Use shadcn/ui CLI for adding new components
- Follow Radix UI patterns for accessibility
- Implement proper TypeScript interfaces
- Style with Tailwind utility classes

### Voice Feature Development
- Test in Chrome/Edge for full Speech API support
- Implement fallback for unsupported browsers
- Consider microphone permissions and user privacy
- Handle speech recognition errors gracefully

## Integration Points

### Browser APIs Used
- **Web Speech API**: `SpeechRecognition` interface
- **Local Storage**: Cart/preferences persistence
- **Media Permissions**: Microphone access for voice

### External Services
- **None currently**: All functionality is client-side
- **Future**: Could integrate with supplier APIs, payment processing

### Data Sources
- **Static JSON**: Product database embedded in build
- **Future**: Could move to external API or database

## Known Technical Debt
- Dual lockfiles (bun.lockb + package-lock.json)
- Large component library bundle size
- Client-side product database scaling limitations
- Voice API browser compatibility constraints