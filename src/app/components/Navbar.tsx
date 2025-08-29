// src/app/components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { CartItem } from "../types";

const getCartItemCount = (): number => {
  try {
    const storedCart = localStorage.getItem("cart");
    if (!storedCart) return 0;
    const cart: CartItem[] = JSON.parse(storedCart);
    return cart.reduce((total, item) => total + item.quantity, 0);
  } catch (error) {
    console.error("Failed to parse cart from localStorage", error);
    return 0;
  }
};

const classNames = (...classes: string[]) => classes.filter(Boolean).join(" ");

const Navbar: React.FC = () => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const updateCartCount = () => setCartItemCount(getCartItemCount());

    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md fixed w-full top-0 z-10 transition-all duration-300">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-gray-800 cursor-pointer transform transition-transform duration-200 hover:scale-105"
        >
          Amana Bookstore
        </Link>

        {/* Links */}
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className={classNames(
              "relative text-gray-600 hover:text-purple-500 transition-colors duration-200 cursor-pointer after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-purple-500 after:transition-all after:duration-300 hover:after:w-full",
              pathname === "/"
                ? "text-purple-500 font-semibold after:w-full"
                : ""
            )}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Home
          </Link>

          <Link
            href="/cart"
            aria-label={`Cart with ${cartItemCount} items`}
            className={classNames(
              "text-gray-600 hover:text-purple-500 flex items-center transition-colors duration-200 cursor-pointer",
              pathname === "/cart" ? "text-purple-500 font-semibold" : ""
            )}
          >
            My Cart
            {cartItemCount > 0 && (
              <span className="ml-2 bg-purple-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform transition-transform duration-200 animate-pulse">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
