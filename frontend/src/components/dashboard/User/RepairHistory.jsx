"use client";
import { useState, useEffect, useCallback } from "react";
import API from "../../../api/api.js";
import Loader from "@/components/ui/Loader";
import { FaWhatsapp, FaSearch } from "react-icons/fa";
import { toast } from "react-hot-toast";
import debounce from "lodash.debounce";

export default function RepairHistory() {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRepairs = async (searchTerm = "", pageNum = 1) => {
    try {
      setLoading(true);
      const res = await API.get(
        `/repair-items/history/completed?search=${searchTerm}&page=${pageNum}&limit=12`,
      );
      if (pageNum === 1) {
        setRepairs(res.data.items);
      } else {
        setRepairs((prev) => [...prev, ...res.data.items]);
      }
      setTotalPages(res.data.totalPages);
      setHasMore(pageNum < res.data.totalPages);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch repairs");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((value) => {
      setPage(1);
      fetchRepairs(value, 1);
    }, 500),
    [],
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  // Load more for pagination
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRepairs(search, nextPage);
  };

  // Initial load
  useEffect(() => {
    fetchRepairs();
  }, []);

  if (loading && page === 1) return <Loader />;

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50 dark:bg-black">
      <h1 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">
        Repair History
      </h1>

      {/* Search Bar */}
      <div className="mb-6">
        <label htmlFor="repair-search" className="sr-only">
          Search repairs
        </label>
        <div className="relative max-w-md mx-auto">
          <FaSearch className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2 dark:text-gray-500" />
          <input
            id="repair-search"
            type="text"
            placeholder="Search by item name, customer name, or phone"
            value={search}
            onChange={handleSearchChange}
            aria-label="Search repairs by item name, customer name, or phone"
            className="w-full px-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
          />
        </div>
      </div>

      {repairs.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">
          No completed repairs found.
        </p>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {repairs.map((item) => (
              <div
                key={item._id}
                className="flex flex-col p-4 transition bg-white rounded-lg shadow hover:shadow-lg dark:bg-gray-900"
              >
                {item.images?.[0] && (
                  <img
                    src={`http://localhost:4500/${item.images[0]}`}
                    alt={item.itemName}
                    className="object-cover w-full h-40 mb-4 rounded"
                  />
                )}

                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {item.itemName}
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Problem: {item.problem}
                </p>

                <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  <p>
                    <span className="font-medium">Customer:</span>{" "}
                    {item.customer?.name}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {item.customer?.phone || "N/A"}
                  </p>
                </div>

                <div className="pt-3 mt-3 text-sm text-gray-600 border-t dark:border-gray-700 dark:text-gray-400">
                  {item.timeTakenValue && (
                    <p>
                      ⏱ Time Taken:{" "}
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {item.timeTakenValue} {item.timeTakenUnit}
                      </span>
                    </p>
                  )}

                  {item.completedDate && item.completedTime && (
                    <p className="mt-1">
                      📅 Completed on:{" "}
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {item.completedDate} at {item.completedTime}
                      </span>
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <span className="inline-block px-3 py-1 text-sm font-semibold text-green-700 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300">
                    Completed
                  </span>

                  {item.whatsappLink ? (
                    <a
                      href={item.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Send WhatsApp"
                      className="flex items-center justify-center w-10 h-10 text-white transition bg-green-600 rounded-lg hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                    >
                      <FaWhatsapp size={18} />
                    </a>
                  ) : (
                    <button
                      disabled
                      className="flex items-center justify-center w-10 h-10 text-white bg-gray-400 rounded-lg cursor-not-allowed"
                    >
                      <FaWhatsapp size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Load more button */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
