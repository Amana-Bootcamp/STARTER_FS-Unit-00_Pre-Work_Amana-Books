// src/app/components/CartItem.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Book } from "../types";

interface CartItemProps {
  item: { book: Book; quantity: number };
  onUpdateQuantity: (bookId: string, quantity: number) => void;
  onRemoveItem: (bookId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const { book, quantity } = item;

  // Calculate subtotal for the cart item
  const subtotal = (book.price * quantity).toFixed(2);

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <div className="relative h-24 w-16 bg-gray-200 flex items-center justify-center rounded-md">
          {/* Book Icon Placeholder */}
          <div className="text-2xl text-gray-400">📚</div>
        </div>
        <div>
          <Link
            href={`/book/${book.id}`}
            className="text-lg font-semibold text-gray-800 hover:text-purple-500 cursor-pointer"
          >
            {book.title}
          </Link>
          <p className="text-sm text-gray-600">by {book.author}</p>
          <p className="text-md font-bold text-gray-900 mt-1">
            ${book.price.toFixed(2)}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onUpdateQuantity(book.id, quantity - 1)}
            disabled={quantity <= 1}
            className="px-2 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            onClick={() => onUpdateQuantity(book.id, quantity + 1)}
            className="px-2 py-1 border rounded-md hover:bg-gray-100 cursor-pointer"
          >
            +
          </button>
        </div>
        <p className="text-md font-semibold w-20 text-right">${subtotal}</p>
        <button
          onClick={() => onRemoveItem(book.id)}
          className="text-red-500 hover:text-red-700 font-semibold cursor-pointer"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
