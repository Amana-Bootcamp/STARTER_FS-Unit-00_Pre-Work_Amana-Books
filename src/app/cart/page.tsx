// src/app/cart/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CartItem from "../components/CartItem";
import { books } from "../data/books";
import { Book, CartItem as CartItemType } from "../types";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<
    { book: Book; quantity: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load cart from localStorage
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        const cart: CartItemType[] = JSON.parse(storedCart);
        const itemsWithBooks = cart
          .map((item) => {
            const book = books.find((b) => b.id === item.bookId);
            return book ? { book, quantity: item.quantity } : null;
          })
          .filter(
            (item): item is { book: Book; quantity: number } => item !== null
          );

        setCartItems(itemsWithBooks);
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
        setCartItems([]);
      }
    }
    setIsLoading(false);
  }, []);

  const updateQuantity = (bookId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    // Update local state
    const updatedItems = cartItems.map((item) =>
      item.book.id === bookId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);

    // Update localStorage
    const cartForStorage = updatedItems.map((item) => ({
      id: `${item.book.id}-${Date.now()}`,
      bookId: item.book.id,
      quantity: item.quantity,
      addedAt: new Date().toISOString(),
    }));
    localStorage.setItem("cart", JSON.stringify(cartForStorage));

    // Notify navbar
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  const removeItem = (bookId: string) => {
    // Update local state
    const updatedItems = cartItems.filter((item) => item.book.id !== bookId);
    setCartItems(updatedItems);

    // Update localStorage
    const cartForStorage = updatedItems.map((item) => ({
      id: `${item.book.id}-${Date.now()}`,
      bookId: item.book.id,
      quantity: item.quantity,
      addedAt: new Date().toISOString(),
    }));
    localStorage.setItem("cart", JSON.stringify(cartForStorage));

    // Notify navbar
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.book.price * item.quantity,
    0
  );

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <h2 className="text-xl text-gray-600 mb-4">Your cart is empty</h2>
          <Link
            href="/"
            className="bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600 transition-colors cursor-pointer"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md">
            {cartItems.map((item) => (
              <CartItem
                key={item.book.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
              />
            ))}
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center text-xl font-bold mb-4 text-gray-800">
              <span>Total: ${totalPrice.toFixed(2)}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/"
                className="flex-1 bg-gray-500 text-white text-center py-3 rounded-md hover:bg-gray-600 transition-colors cursor-pointer"
              >
                Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="flex-1 bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition-colors cursor-pointer"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
