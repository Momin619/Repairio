"use client";
import { useState, useEffect, useCallback, useRef } from "react";
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

  const controllerRef = useRef(null); // track current request

  // ---------------- FETCH ITEMS ----------------
  const fetchItems = useCallback(
    async (searchTerm = "", pageNum = 1, controller) => {
      try {
        if (pageNum === 1) setLoading(true);
        else setLoadingMore(true);

        const res = await API.get(
          `/repair-items?search=${searchTerm}&page=${pageNum}&limit=12`,
          { signal: controller.signal },
        );

        if (controller.signal.aborted) return; // stop if aborted

        const fetchedItems = res.data.items.filter(
          (item) => item.status === "pending" || item.status === "in-repair",
        );
        if (pageNum === 1) setItems(fetchedItems);
        else setItems((prev) => [...prev, ...fetchedItems]);

        setTotalPages(res.data.totalPages);
        setHasMore(pageNum < res.data.totalPages);
      } catch (err) {
        if (!controller.signal.aborted) {
          toast.error(err?.response?.data?.message || "Failed to fetch items");
          console.error("Fetch error:", err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [],
  );

  // ---------------- DEBOUNCED SEARCH ----------------
  const debouncedSearchRef = useRef(
    debounce((value, controller) => {
      setPage(1);
      fetchItems(value, 1, controller);
    }, 800),
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    // Cancel previous request
    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    debouncedSearchRef.current(value, controller);
  };

  // ---------------- INITIAL FETCH ----------------
  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current = controller;

    fetchItems("", 1, controller);

    // Capture debouncedSearchRef.current for cleanup
    const currentDebounced = debouncedSearchRef.current;

    return () => {
      controller.abort(); // cancel ongoing request on unmount
      currentDebounced.cancel(); // cancel pending debounced calls
    };
  }, [fetchItems]);

  // ---------------- LOAD MORE ----------------
  const loadMore = () => {
    if (page >= totalPages) return;
    const nextPage = page + 1;
    setPage(nextPage);

    // cancel previous request
    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    fetchItems(search, nextPage, controller);
  };

  // ---------------- INITIAL FETCH ----------------

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
          {items.map((item) => (
            <RepairItemCard
              key={item._id}
              itemData={item}
              onStatusChange={(updatedItem) => {
                // 🔥 REMOVE if completed or deleted
                if (
                  updatedItem?.status === "completed" ||
                  updatedItem?.removed
                ) {
                  setItems((prev) =>
                    prev.filter((i) => i._id !== updatedItem._id),
                  );
                  return;
                }

                // 🔄 UPDATE if pending → in-repair
                setItems((prev) =>
                  prev.map((i) =>
                    i._id === updatedItem._id ? updatedItem : i,
                  ),
                );
              }}
            />
          ))}

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
