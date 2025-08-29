// src/app/components/BookGrid.tsx
"use client";

import React, { useState, useMemo } from "react";
import { Book } from "../types";
import BookCard from "./BookCard";
import BookListItem from "./BookListItem";
import Pagination from "./Pagination";

interface BookGridProps {
  books: Book[];
  onAddToCart?: (bookId: string) => void;
}

const BookGrid: React.FC<BookGridProps> = ({ books, onAddToCart }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [featuredCarouselIndex, setFeaturedCarouselIndex] = useState(0);

  // Memoize featured books to prevent re-calculation on every render
  const featuredBooks = useMemo(
    () => books.filter((book) => book.featured),
    [books]
  );

  // Carousel settings for featured books
  const booksPerPage = 4;
  const totalFeaturedPages = Math.ceil(featuredBooks.length / booksPerPage);

  // Get current featured books to display
  const currentFeaturedBooks = useMemo(() => {
    const startIndex = featuredCarouselIndex * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    return featuredBooks.slice(startIndex, endIndex);
  }, [featuredBooks, featuredCarouselIndex]);

  // Carousel navigation functions
  const goToPreviousFeatured = () => {
    setFeaturedCarouselIndex((prev) =>
      prev === 0 ? totalFeaturedPages - 1 : prev - 1
    );
  };

  const goToNextFeatured = () => {
    setFeaturedCarouselIndex((prev) =>
      prev === totalFeaturedPages - 1 ? 0 : prev + 1
    );
  };

  const goToFeaturedPage = (pageIndex: number) => {
    setFeaturedCarouselIndex(pageIndex);
  };

  // Get all unique genres for the filter dropdown
  const genres = useMemo(() => {
    const allGenres = books.flatMap((book) => book.genre);
    return ["All", ...new Set(allGenres)];
  }, [books]);

  // Filter and sort books based on search query, selected genre, and sorting options
  const filteredAndSortedBooks = useMemo(() => {
    // First filter the books
    const filtered = books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGenre =
        selectedGenre === "All" || book.genre.includes(selectedGenre);

      return matchesSearch && matchesGenre;
    });

    // Then sort the filtered books
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "author":
          comparison = a.author.localeCompare(b.author);
          break;
        case "datePublished":
          comparison =
            new Date(a.datePublished).getTime() -
            new Date(b.datePublished).getTime();
          break;
        case "rating":
          comparison = a.rating - b.rating;
          break;
        case "reviewCount":
          comparison = a.reviewCount - b.reviewCount;
          break;
        case "price":
          comparison = a.price - b.price;
          break;
        default:
          comparison = 0;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [books, searchQuery, selectedGenre, sortBy, sortOrder]);

  // Paginate the filtered and sorted books
  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedBooks.slice(startIndex, endIndex);
  }, [filteredAndSortedBooks, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedBooks.length / itemsPerPage);

  // Reset to first page when filters or sorting change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedGenre, sortBy, sortOrder, itemsPerPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Featured Books Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Featured Books</h2>
          {totalFeaturedPages > 1 && (
            <div className="flex items-center gap-4">
              {/* Carousel Indicators */}
              <div className="flex gap-2">
                {Array.from({ length: totalFeaturedPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => goToFeaturedPage(index)}
                    className={`w-2 h-2 rounded-full transition-colors duration-200 cursor-pointer ${
                      index === featuredCarouselIndex
                        ? "bg-purple-600"
                        : "bg-purple-100 hover:bg-purple-200"
                    }`}
                    aria-label={`Go to featured books page ${index + 1}`}
                  />
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={goToPreviousFeatured}
                  className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  aria-label="Previous featured books"
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={goToNextFeatured}
                  className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  aria-label="Next featured books"
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Featured Books Carousel */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {currentFeaturedBooks.map((book) => (
              <BookCard key={book.id} book={book} onAddToCart={onAddToCart} />
            ))}
          </div>

          {/* Show current page info */}
          {totalFeaturedPages > 1 && (
            <div className="text-center mt-4 text-sm text-gray-600">
              Showing {featuredCarouselIndex * booksPerPage + 1} -{" "}
              {Math.min(
                (featuredCarouselIndex + 1) * booksPerPage,
                featuredBooks.length
              )}{" "}
              of {featuredBooks.length} featured books
            </div>
          )}
        </div>
      </section>

      {/* Search, Filter, and Sort Controls */}
      <section className="mb-8 space-y-4">
        {/* Search and Genre Filter Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="w-full md:w-1/4">
            <label
              htmlFor="genreFilter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Filter by Genre:
            </label>
            <select
              id="genreFilter"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            >
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sorting Controls Row */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Showing {filteredAndSortedBooks.length} books</span>
          </div>
          <div className="flex items-center gap-4">
            {/* Sort By Dropdown */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="sortBy"
                className="text-sm text-gray-600 whitespace-nowrap"
              >
                Sort by:
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-sm"
              >
                <option value="title">Title</option>
                <option value="author">Author</option>
                <option value="datePublished">Release Date</option>
                <option value="rating">Rating</option>
                <option value="reviewCount">Review Count</option>
                <option value="price">Price</option>
              </select>
            </div>

            {/* Sort Order Toggle */}
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm cursor-pointer"
              aria-label={`Sort ${
                sortOrder === "asc" ? "descending" : "ascending"
              }`}
            >
              {sortOrder === "asc" ? (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                  <span>Asc</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  <span>Desc</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* All Books List */}
      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">All Books</h2>
        {filteredAndSortedBooks.length > 0 ? (
          <>
            <div className="space-y-3">
              {paginatedBooks.map((book) => (
                <BookListItem
                  key={book.id}
                  book={book}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={filteredAndSortedBooks.length}
            />
          </>
        ) : (
          <p className="text-center text-gray-500 text-lg">
            No books found matching your criteria.
          </p>
        )}
      </section>
    </div>
  );
};

export default BookGrid;
