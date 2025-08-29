// src/app/page.tsx
"use client";

import { useState } from "react";
import BookGrid from "./components/BookGrid";
import { books } from "./data/books";

export default function HomePage() {
  // Simple cart handler for demo purposes
  const handleAddToCart = (bookId: string) => {
    console.log(`Added book ${bookId} to cart`);
    // Here you would typically dispatch to a cart state or call an API
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <section className="relative bg-purple-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col items-center text-center py-16 px-6 md:px-12">
        {/* Decorative Circles for Layered Effect */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-400/20 rounded-full animate-pulse-slow"></div>
        <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-purple-500/20 rounded-full animate-pulse-slow"></div>

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-purple-800 mb-4 leading-tight animate-slideUp">
          Welcome to <span className="text-purple-600">Amana Bookstore</span>!
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-purple-700 opacity-90 mb-8 animate-slideUp delay-200">
          Discover new worlds, adventures, and the perfect reads for every mood.
        </p>

        {/* Call-to-Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4">
          <a
            href="/books"
            className="bg-purple-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-purple-700 hover:scale-105 transition-transform duration-200"
          >
            Browse Books
          </a>
          <a
            href="/about"
            className="bg-white text-purple-600 font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-purple-50 hover:scale-105 transition-transform duration-200"
          >
            About Us
          </a>
        </div>
      </section>

      {/* Book Grid */}
      <BookGrid books={books} onAddToCart={handleAddToCart} />
    </div>
  );
}
