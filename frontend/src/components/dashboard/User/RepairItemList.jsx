"use client";
import { useState, useEffect, useCallback } from "react";
import RepairItemCard from "./RepairItemCard";
import API from "../../../api/api";
import toast from "react-hot-toast";
import Loader from "@/components/ui/Loader";
import { FaSearch } from "react-icons/fa";
import debounce from "lodash.debounce";

export default function RepairItemList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch items with search and pagination
  const fetchItems = useCallback(async (searchTerm = "", pageNum = 1) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await API.get(
        `/repair-items?search=${searchTerm}&page=${pageNum}&limit=12`,
      );

      const fetchedItems = res.data.items || [];

      if (pageNum === 1) setItems(fetchedItems);
      else setItems((prev) => [...prev, ...fetchedItems]);

      setTotalPages(res.data.totalPages);
      setHasMore(pageNum < res.data.totalPages);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch items");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value) => {
      setPage(1);
      fetchItems(value, 1);
    }, 500),
    [fetchItems],
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  const loadMore = () => {
    if (page >= totalPages) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchItems(search, nextPage);
  };

  const handleItemCompleted = (completedItemId) => {
    setItems((prev) => prev.filter((item) => item._id !== completedItemId));
  };

  useEffect(() => {
    fetchItems();
    return () => debouncedSearch.cancel(); // cancel debounce on unmount
  }, [fetchItems, debouncedSearch]);

  if (loading && page === 1) return <Loader />;

  return (
    <div className="max-w-6xl px-4 pb-24 mx-auto space-y-6 pt-14 sm:pt-16 md:pt-20 lg:pt-24 xl:pt-28 md:pb-8">
      {/* Search Bar */}
      <div className="relative max-w-md mx-auto mb-6">
        <FaSearch className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2 dark:text-gray-500" />
        <input
          type="text"
          placeholder="Search by item, customer, or phone"
          value={search}
          onChange={handleSearchChange}
          aria-label="Search repairs by item name, customer name, or phone"
          className="w-full px-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
        />
      </div>

      {items.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No items currently in repair
        </p>
      ) : (
        <>
          {/* Stacked Full-Width Cards */}
          <div className="flex flex-col gap-6">
            {items.map((item) => (
              <RepairItemCard
                key={item._id}
                itemData={item}
                onCompleted={handleItemCompleted}
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
                disabled={loadingMore}
              >
                {loadingMore ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
