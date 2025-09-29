# ElevenLabs Voice Agent Knowledge Base
**Comprehensive knowledge for voice-controlled home improvement shopping**

## 🏪 Store Overview

### Business Context
Voice Reno Buddy is an AI-powered home improvement product catalog designed to help users find the right products for their renovation projects through intelligent voice interaction. The store specializes in comprehensive product relationships, compatibility validation, and project-based recommendations.

### Core Value Proposition
- **Intelligent Product Matching**: Advanced compatibility system prevents incompatible purchases
- **Project-Based Shopping**: Curated product collections for common home improvement projects  
- **Voice-First Experience**: Hands-free shopping ideal for users with dirty hands or in workshops
- **Expert Guidance**: AI assistant provides professional-level product recommendations

---

## 📦 Product Catalog

### Product Categories (50+ Products)

#### Plumbing (15 products)
- **Faucets**: Kitchen and bathroom faucets with various finishes
- **Pipes**: PVC, copper, and flexible supply lines
- **Fixtures**: Drains, shut-off valves, and connection hardware
- **Tools**: Pipe cutters, threading tools, and installation hardware

#### Tools (12 products) 
- **Power Tools**: Drills, saws, and sanders for various applications
- **Hand Tools**: Screwdrivers, wrenches, and measuring tools
- **Specialty Tools**: Pipe cutters, tile cutters, and installation tools
- **Safety Equipment**: Protective gear and safety accessories

#### Paint & Finishing (8 products)
- **Interior Paint**: Latex, primer, and specialty finishes
- **Exterior Paint**: Weather-resistant coatings and stains
- **Application Tools**: Brushes, rollers, and spray equipment
- **Preparation**: Sandpaper, drop cloths, and cleaning supplies

#### Hardware (10 products)
- **Fasteners**: Screws, bolts, and specialty fasteners
- **Brackets**: Shelf brackets, mounting hardware, and supports
- **Door Hardware**: Knobs, handles, and security hardware
- **Cabinet Hardware**: Hinges, drawer slides, and accessories

#### Electrical (5 products)
- **Wiring**: Electrical wire, conduit, and connection hardware
- **Switches & Outlets**: Standard and specialty electrical devices
- **Lighting**: Fixtures, bulbs, and installation hardware
- **Safety**: Circuit breakers, GFCI outlets, and surge protection

### Product Specifications
Each product includes:
- **Technical Specs**: Dimensions, materials, capacity, ratings
- **Compatibility Matrix**: Works with, incompatible with, requires
- **Project Tags**: Suitable home improvement project types
- **Ratings & Reviews**: Customer feedback and professional ratings
- **Pricing**: Current price, bulk discounts, seasonal offers

---

## 🔧 Product Relationships

### Compatibility System
The store uses a sophisticated relationship matrix:

#### Compatible Products
Products that work well together or complement each other:
- Kitchen faucet + flexible supply lines + shutoff valves
- Interior paint + primer + brushes + drop cloths
- Cordless drill + drill bits + screws + wall anchors

#### Incompatible Products  
Products that cannot be used together:
- PVC pipe + copper fittings (different connection types)
- Oil-based primer + latex paint (chemical incompatibility)
- High-voltage tools + low-amp extension cords (safety issues)

#### Required Dependencies
Products that require other products to function:
- Faucets require supply lines and shutoff valves
- Paint requires primer for proper adhesion
- Power tools require appropriate bits/blades

#### Suggested Upsells
Complementary products that enhance the primary purchase:
- Faucet → matching soap dispenser
- Drill → carrying case and bit set
- Paint → premium brushes and cleanup supplies

---

## 🏗️ Project Categories

### Bathroom Remodel
**Products**: Faucets, drains, pipes, tiles, paint, tools, hardware
**Common Tasks**: Replacing fixtures, updating plumbing, tiling, painting
**Typical Budget**: $500-3000 for DIY projects
**Duration**: 1-3 weekends
**Skill Level**: Intermediate (some plumbing knowledge helpful)

### Kitchen Remodel  
**Products**: Faucets, supply lines, tools, paint, hardware, electrical
**Common Tasks**: Fixture replacement, cabinet updates, countertop installation
**Typical Budget**: $800-5000 for DIY projects  
**Duration**: 2-4 weekends
**Skill Level**: Intermediate to Advanced

### Room Painting
**Products**: Paint, primer, brushes, rollers, drop cloths, prep supplies
**Common Tasks**: Wall preparation, priming, painting, trim work
**Typical Budget**: $100-500 per room
**Duration**: 1 weekend
**Skill Level**: Beginner friendly

### Furniture Assembly
**Products**: Tools, screws, brackets, hardware, safety equipment
**Common Tasks**: Assembling flat-pack furniture, custom builds, repairs
**Typical Budget**: $50-200 for tools/supplies
**Duration**: Few hours to 1 day
**Skill Level**: Beginner to Intermediate

### Lighting Installation
**Products**: Fixtures, wire, switches, tools, safety equipment
**Common Tasks**: Installing ceiling fans, pendant lights, under-cabinet lighting
**Typical Budget**: $200-800 per project
**Duration**: Half day to full day
**Skill Level**: Intermediate (electrical knowledge required)

---

## 💬 Voice Interaction Patterns

### Common User Requests

#### Product Search
- "Find me a kitchen faucet"
- "Show me tools for bathroom renovation"
- "What paint do I need for a bedroom?"
- "I need plumbing supplies"

#### Project-Based Shopping
- "I'm remodeling my bathroom, what do I need?"
- "Help me plan a kitchen upgrade"
- "What tools do I need for painting?"
- "Show me lighting options for my living room"

#### Compatibility Questions
- "Will this faucet work with my existing plumbing?"
- "Can I use this paint over the current color?"
- "What tools do I need for this project?"
- "Are these products compatible?"

#### Cart Management
- "Add this to my cart"
- "What's in my cart?"
- "Remove the drill from my cart"
- "How much will this cost?"

### Response Patterns

#### Confirmations
- "I've added the [product] to your cart"
- "Your cart now contains [X] items totaling $[amount]"
- "I found [X] products matching your search"

#### Recommendations
- "Based on your selection, you might also need..."
- "Customers who bought this also purchased..."
- "For your [project], I recommend starting with..."

#### Warnings
- "Warning: These products may not be compatible"
- "You'll also need [required product] for this to work"
- "This project typically requires [skill level] experience"

---

## 🎯 User Intent Recognition

### Navigation Intents
- "Take me to..." → navigate_to_page
- "Show me the..." → navigate_to_page or filter_products
- "Go to cart" → navigate_to_page

### Search Intents  
- "Find...", "Search for...", "Show me..." → search_products
- "I need...", "Looking for..." → search_products
- "Do you have...?" → search_products

### Action Intents
- "Add to cart", "Buy this", "I'll take it" → add_to_cart
- "Remove from cart", "Delete this" → remove_from_cart
- "Empty my cart", "Clear cart" → clear_cart

### Information Intents
- "Tell me about...", "What is..." → view_product_details
- "How much...", "What's the price..." → view_product_details
- "What's in my cart?" → get_cart_info

### Comparison Intents
- "Compare these", "Which is better" → compare_products
- "What's the difference" → compare_products
- "Are these compatible?" → check_compatibility

---

## ⚠️ Important Guidelines

### Product Recommendations
- Always consider compatibility when suggesting products
- Mention required dependencies (supplies, tools, skills)
- Provide realistic project timelines and budgets
- Suggest appropriate skill level requirements

### Safety Considerations
- Emphasize safety equipment for appropriate projects
- Warn about electrical work requiring professional expertise
- Mention when projects may need permits or inspections
- Recommend protective gear for power tools and chemicals

### User Experience
- Ask clarifying questions for ambiguous requests
- Provide helpful context with product recommendations
- Explain why certain products work well together
- Offer alternatives when requested products are unavailable

### Conversation Flow
- Keep responses concise but informative
- Use natural, conversational language
- Confirm actions before executing them
- Provide clear next steps or follow-up options

---

## 📊 Inventory & Pricing Information

### Stock Status
- All products have real-time inventory status
- "In Stock" vs "Out of Stock" clearly indicated
- Estimated restock dates for out-of-stock items
- Quantity limits for bulk items

### Pricing Structure
- Competitive pricing with regular promotions
- Volume discounts for qualifying orders
- Seasonal sales on relevant product categories
- Price matching policy with major competitors

### Shipping & Delivery
- Free shipping on orders over $75
- Next-day delivery available in metro areas
- Specialized delivery for large/heavy items
- In-store pickup option available

---

*This knowledge base should be regularly updated based on inventory changes, new product additions, seasonal promotions, and user interaction patterns.*