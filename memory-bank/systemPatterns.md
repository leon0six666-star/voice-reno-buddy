# Metadata
- Last Updated: 2025-01-27 14:30
- Version: 1.0
- Notes: Initial system architecture documentation

# System Patterns: Voice Reno Buddy

## Architecture Overview

### Component Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Presentation  │    │   Logic Layer   │    │   Data Layer    │
│   (React UI)    │◄──►│ (ProductService)│◄──►│ (JSON Database) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                       ▲
         │                       │
┌─────────────────┐    ┌─────────────────┐
│ Voice Interface │    │  Browser APIs   │
│ (Web Speech)    │    │   (Storage)     │
└─────────────────┘    └─────────────────┘
```

### Layered Design
- **Presentation Layer**: React components with shadcn/ui for consistent design
- **Voice Interface Layer**: Web Speech API integration with fallback handling
- **Business Logic Layer**: ProductService class with intelligent search/recommendations
- **Data Access Layer**: JSON-based product database with structured relationships

## Key Technical Decisions

### Voice Processing Strategy
- **Choice**: Web Speech API over external services
- **Rationale**: Reduces latency, no API costs, works offline
- **Trade-off**: Browser compatibility limitations vs. cost/privacy benefits

### State Management Pattern
- **Choice**: React useState with prop drilling
- **Rationale**: Simple application scope, avoiding complexity of Redux/Context
- **Trade-off**: Less scalable but more straightforward for current needs

### Product Recommendation Engine
- **Choice**: Rule-based compatibility system over ML
- **Rationale**: Deterministic results, easier to debug, no training data needed
- **Implementation**: Graph-based product relationships (compatibilities, requirements, conflicts)

### Data Structure Design
```typescript
interface Product {
  id: number;
  compatibilities: number[];    // Products that work well together
  incompatibilities: number[];  // Products that conflict
  requires: number[];          // Dependencies (primer before paint)
  suggested_upsells: number[]; // Revenue optimization
  project_tags: string[];     // Project categorization
}
```

## Component Relationships

### Core Component Flow
1. **Index** (Main Page): Orchestrates all other components
2. **VoiceAssistant**: Captures voice → ProductService → triggers search
3. **ProductService**: Processes commands → returns structured results
4. **SearchResults**: Displays results → allows cart interaction
5. **Cart Logic**: Validates compatibility → shows warnings

### Data Flow Patterns
```
Voice Input → Speech Recognition → Command Processing → Product Search → Results Display
     ↓              ↓                    ↓                  ↓             ↓
User speaks → transcript text → intent parsing → database query → UI update
```

### Error Handling Strategy
- **Voice Errors**: Graceful degradation to text search
- **Browser Compatibility**: Feature detection with fallback UI
- **Product Not Found**: Suggest alternatives based on partial matches
- **Cart Conflicts**: Warning system with suggested resolutions

## Design Patterns Used

### Service Layer Pattern
- `ProductService` encapsulates all business logic
- Clean separation between UI and data processing
- Testable business rules independent of React

### Observer Pattern (React State)
- Components subscribe to state changes via props
- Voice assistant triggers updates that propagate through component tree

### Strategy Pattern (Voice Processing)
- Different command types handled by specific processing strategies
- Extensible for adding new voice command categories

### Validation Pattern
- Cart validation returns structured feedback
- Separates validation logic from UI presentation

## Critical Implementation Paths

### Voice Command Processing
1. Voice capture via Web Speech API
2. Command classification (search, project, compatibility)
3. Entity extraction from natural language
4. Product database query execution
5. Results formatting and UI update

### Product Compatibility System
1. User adds product to cart
2. System checks all cart products for conflicts
3. Identifies missing required products
4. Generates warnings and suggestions
5. Updates UI with validation feedback

### Search and Discovery
1. Text/voice input normalization
2. Multi-field search (name, description, category, tags)
3. Relevance scoring and ranking
4. Results filtering and pagination

## Best Practices Applied

### React Component Design
- Single Responsibility: Each component has one clear purpose
- Props Interface: Well-defined TypeScript interfaces
- State Minimization: Only essential state in components
- Effect Management: Cleanup listeners and timeouts

### Performance Optimizations
- Lazy loading of large product database
- Debounced search input
- Component memoization where beneficial
- Efficient re-rendering through proper key usage

### Accessibility Patterns
- Screen reader support for voice status
- Keyboard navigation for all interactive elements  
- High contrast UI with clear visual hierarchy
- Fallback interactions when voice unavailable