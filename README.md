# 🎙️ Voice Reno Buddy - AI-Powered Renovation Assistant

**A voice-enabled renovation planning tool that helps users find compatible building materials and tools through natural conversation**

## 🎯 Project Overview

Voice Reno Buddy is a smart renovation assistant that combines a comprehensive product database with ElevenLabs voice integration. Users can search for materials, check compatibility, manage shopping carts, and get recommendations - all through voice commands or traditional UI.

### ✅ Current Status: ElevenLabs Integration Complete

- **🎙️ Voice-Ready**: Configured with 12 voice tools and ElevenLabs integration
- **📦 Enhanced Database**: 50 products with complex compatibility relationships
- **🏗️ Production Ready**: TypeScript clean, build successful, zero breaking changes
- **📚 Complete Documentation**: Universal toolkit and project-specific guides

## 🚀 Quick Start

### For Developers
```sh
# Clone the repository
git clone https://github.com/leon0six666-star/voice-reno-buddy.git

# Navigate to project directory
cd voice-reno-buddy

# Install dependencies
npm ci

# Start development server
npm run dev

# Build for production
npm run build
```

### For Voice Integration
1. **Read**: [`PROJECT_STRUCTURE.md`](./PROJECT_STRUCTURE.md) - Complete organization overview
2. **Upload**: Configs from [`elevenlabs-upload-ready/`](./elevenlabs-upload-ready/) to ElevenLabs dashboard
3. **Configure**: Add Agent ID and widget HTML to activate voice features

## 🎮 Voice Features

### Voice Commands Available
- **Product Search**: "Find bathroom tiles" 
- **Compatibility Check**: "Is this tile compatible with my project?"
- **Cart Management**: "Add this to my cart", "Show my cart"
- **Recommendations**: "What tools do I need for this project?"
- **Navigation**: "Go to product details", "Show me categories"

### 12 Voice Tools Configured
`navigate_to_page`, `search_products`, `filter_products`, `view_product_details`, `add_to_cart`, `remove_from_cart`, `get_cart_info`, `check_compatibility`, `get_recommendations`, `clear_cart`, `get_project_products`, `compare_products`

## 📁 Project Structure

- **`voice-reno-buddy-docs/`** - Project-specific documentation for future LLM sessions
- **`universal-elevenlabs-toolkit/`** - Reusable toolkit for transforming any React app with ElevenLabs
- **`elevenlabs-upload-ready/`** - Copy-paste configs for ElevenLabs dashboard
- **`memory-bank/`** - Complete knowledge system for LLM context (20-min read)
- **`src/`** - Voice-ready application with enhanced features

## 🛠️ Technologies

### Core Stack
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn-ui components
- **Voice**: ElevenLabs ConvAI integration
- **State**: URL-driven voice control pattern
- **Database**: Enhanced product catalog with relationships

### Voice Architecture
```
User Voice → ElevenLabs Agent → Tool Call → URL Parameter → React State → UI Update
```

## 🎯 Use Cases

### For Homeowners
- Plan renovation projects with voice guidance
- Find compatible materials and tools
- Get expert recommendations
- Manage shopping lists hands-free

### For Developers  
- Example of ElevenLabs integration in React
- URL-driven voice control pattern
- Complete transformation methodology
- Universal toolkit for future projects

## 📊 Project Stats

- **Products**: 50 building materials and tools with compatibility data
- **Voice Tools**: 12 comprehensive interaction capabilities  
- **Architecture**: Clean separation of voice and UI logic
- **Quality**: 100% TypeScript coverage, build successful
- **Documentation**: Complete guides for project and universal use

## 🔧 Development

### Available Scripts
- `npm run dev` - Development server with hot reload
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - Code linting
- `npm test` - Run tests

### Key Components
- **`ElevenLabsWidget.tsx`** - Voice integration component
- **`productDatabase.json`** - Enhanced 50-product catalog
- **URL State Management** - Voice action handling via `useSearchParams`

## 📖 Documentation

### For New Sessions
👉 **Start**: [`voice-reno-buddy-docs/README.md`](./voice-reno-buddy-docs/README.md) - Quick project context

### For Future Projects  
👉 **Use**: [`universal-elevenlabs-toolkit/`](./universal-elevenlabs-toolkit/) - Generic ElevenLabs transformation guide

### For Complete Context
👉 **Read**: [`memory-bank/index.md`](./memory-bank/index.md) - Complete knowledge system (~20 min)

## 🌐 Deployment

### Lovable Platform
Visit the [Lovable Project](https://lovable.dev/projects/83f70fc8-ea7b-4623-ad01-82e0fc941e13) and click Share → Publish for instant deployment.

### Custom Domain
Navigate to Project > Settings > Domains in Lovable to connect your custom domain.
[Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## 💡 How to Edit This Project

### Use Lovable (Recommended)
Simply visit the [Lovable Project](https://lovable.dev/projects/83f70fc8-ea7b-4623-ad01-82e0fc941e13) and start prompting. Changes made via Lovable will be committed automatically to this repo.

### Use Your Preferred IDE
If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

### Other Options
- **GitHub Web Editor**: Click "Edit" button on any file
- **GitHub Codespaces**: Full development environment in browser

---

**🎯 This project demonstrates a complete transformation from basic web app to voice-enabled AI assistant with zero breaking changes and comprehensive documentation for future development.**