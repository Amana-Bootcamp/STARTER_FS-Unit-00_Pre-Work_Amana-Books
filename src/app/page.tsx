// src/app/page.tsx
'use client';

import { useState } from 'react';
import BookGrid from './components/BookGrid';
import { books } from './data/books';

export default function HomePage() {
  // Simple cart handler for demo purposes
  const handleAddToCart = (bookId: string) => {
    console.log(`Added book ${bookId} to cart`);
    // Here you would typically dispatch to a cart state or call an API
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <section className="text-center bg-blue-100 p-8 rounded-lg mb-12 shadow-md">
        <h1 className="text-4xl font-extrabold text-red-800 mb-2">Welcome to the Amana Bookstore!</h1>
        <p className="text-lg text-gray-600">
          Your one-stop shop for the best books. Discover new worlds and adventures.
        </p>
      </section>

      {/* Book Grid */}
      <BookGrid books={books} onAddToCart={handleAddToCart} />
    </div>
  );
}
