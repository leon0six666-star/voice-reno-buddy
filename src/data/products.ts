export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  inStock: boolean;
  features?: string[];
  description: string;
  compatibility?: string[];
}

export const categories = [
  { id: 'tools', name: 'Tools', icon: '🔧' },
  { id: 'hardware', name: 'Hardware', icon: '⚙️' },
  { id: 'plumbing', name: 'Plumbing', icon: '🔧' },
  { id: 'electrical', name: 'Electrical', icon: '⚡' },
  { id: 'paint', name: 'Paint', icon: '🎨' },
  { id: 'garden', name: 'Garden', icon: '🌱' },
];

export const sampleProducts: Product[] = [
  {
    id: 'drill-001',
    name: 'Professional Cordless Drill Kit with 2 Batteries',
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.8,
    reviewCount: 1247,
    image: 'https://images.unsplash.com/photo-1558618666-e5c0075c2e65?auto=format&fit=crop&w=400&h=300',
    category: 'Tools',
    inStock: true,
    features: ['18V Battery', '21 Speed Settings', 'LED Light'],
    description: 'High-performance cordless drill with long-lasting battery and precision control.',
    compatibility: ['Standard drill bits', 'Screwdriver bits']
  },
  {
    id: 'pipe-001',
    name: 'Copper Pipe Fitting Set - 1/2 inch',
    price: 24.99,
    rating: 4.6,
    reviewCount: 432,
    image: 'https://images.unsplash.com/photo-1558618632-fbd21c2cd043?auto=format&fit=crop&w=400&h=300',
    category: 'Plumbing',
    inStock: true,
    features: ['Lead-free', 'Standard size', 'Durable'],
    description: 'Professional-grade copper pipe fittings for residential plumbing projects.',
    compatibility: ['1/2 inch copper pipes', 'Standard plumbing tools']
  },
  {
    id: 'paint-001',
    name: 'Premium Interior Paint - Eggshell White',
    price: 42.99,
    originalPrice: 54.99,
    rating: 4.7,
    reviewCount: 856,
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&h=300',
    category: 'Paint',
    inStock: true,
    features: ['One-coat coverage', 'Low VOC', 'Washable'],
    description: 'High-quality interior paint with excellent coverage and durability.',
    compatibility: ['Interior walls', 'Primer recommended']
  },
  {
    id: 'wire-001',
    name: '12 AWG Electrical Wire - 100ft Roll',
    price: 67.99,
    rating: 4.5,
    reviewCount: 234,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&h=300',
    category: 'Electrical',
    inStock: true,
    features: ['12 gauge', 'THHN rated', '100ft length'],
    description: 'Professional electrical wire suitable for residential and commercial use.',
    compatibility: ['Standard electrical boxes', '20A circuits']
  },
  {
    id: 'hammer-001',
    name: 'Steel Claw Hammer - 16oz',
    price: 18.99,
    rating: 4.9,
    reviewCount: 1053,
    image: 'https://images.unsplash.com/photo-1609979306937-3b8de87b9ba2?auto=format&fit=crop&w=400&h=300',
    category: 'Tools',
    inStock: true,
    features: ['Ergonomic grip', 'Steel construction', 'Balanced weight'],
    description: 'Classic steel claw hammer for general construction and repair work.',
  },
  {
    id: 'screws-001',
    name: 'Wood Screws Assortment Kit - 500 pieces',
    price: 29.99,
    rating: 4.4,
    reviewCount: 678,
    image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=400&h=300',
    category: 'Hardware',
    inStock: true,
    features: ['Various sizes', 'Phillips head', 'Zinc coated'],
    description: 'Complete assortment of wood screws for all your woodworking projects.',
    compatibility: ['Softwood', 'Hardwood', 'MDF']
  },
  {
    id: 'valve-001',
    name: 'Ball Valve 3/4 inch - Brass',
    price: 15.99,
    rating: 4.6,
    reviewCount: 345,
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=400&h=300',
    category: 'Plumbing',
    inStock: false,
    features: ['Full port', 'Lever handle', 'Brass construction'],
    description: 'Durable brass ball valve for water control in plumbing systems.',
    compatibility: ['3/4 inch pipes', 'Standard fittings']
  },
  {
    id: 'outlet-001',
    name: 'GFCI Outlet with USB Ports',
    price: 22.99,
    rating: 4.8,
    reviewCount: 567,
    image: 'https://images.unsplash.com/photo-1614957004893-ade9b1e3b2d3?auto=format&fit=crop&w=400&h=300',
    category: 'Electrical',
    inStock: true,
    features: ['GFCI protection', 'USB charging', 'Tamper resistant'],
    description: 'Modern GFCI outlet with built-in USB charging capability.',
    compatibility: ['Standard electrical boxes', 'GFCI circuits']
  }
];