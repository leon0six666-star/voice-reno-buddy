import React from 'react';
import { ArrowRight, Wrench, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-warehouse.jpg';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Professional home improvement warehouse"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-3xl">
          <div className="mb-6 flex items-center space-x-2">
            <Wrench className="h-6 w-6 text-primary" />
            <span className="text-primary font-semibold">Professional Tools & Supplies</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Your Next Project
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Starts Here
            </span>
          </h1>
          
          <p className="text-xl text-white/90 mb-8 max-w-xl">
            Experience shopping with our AI voice assistant. Get expert advice, find compatible products, 
            and complete your purchase hands-free.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4">
              Try Voice Shopping
              <Lightbulb className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white/20">
              Browse Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Wrench className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Voice-Guided Shopping</p>
                <p className="text-sm text-white/70">Natural conversation interface</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold">AI</span>
              </div>
              <div>
                <p className="font-semibold">Smart Recommendations</p>
                <p className="text-sm text-white/70">AI-powered product matching</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold">✓</span>
              </div>
              <div>
                <p className="font-semibold">Project Bundles</p>
                <p className="text-sm text-white/70">Complete solutions in one click</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};