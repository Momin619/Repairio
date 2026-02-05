"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import API from "../../../api/api.js";
import Loader from "@/components/ui/Loader";
import { FaWhatsapp, FaSearch } from "react-icons/fa";
import { toast } from "react-hot-toast";
import debounce from "lodash.debounce";

export default function RepairHistory() {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const controllerRef = useRef(null); // track current request

  // ---------------- FETCH REPAIRS ----------------
  const fetchRepairs = useCallback(
    async (searchTerm = "", pageNum = 1, controller) => {
      try {
        if (pageNum === 1) setLoading(true);
        else setLoadingMore(true);

        console.log("fetchRepairs: start", { searchTerm, pageNum });

        const res = await API.get(
          `/repair-items/history/completed?search=${searchTerm}&page=${pageNum}&limit=12`,
          { signal: controller.signal },
        );

        if (controller.signal.aborted) {
          console.log("fetchRepairs: aborted", { pageNum });
          return;
        }

        const fetched = res.data.items || [];

        if (pageNum === 1) setRepairs(fetched);
        else setRepairs((prev) => [...prev, ...fetched]);

        setTotalPages(res.data.totalPages);
        setHasMore(pageNum < res.data.totalPages);

        console.log("fetchRepairs: success", {
          pageNum,
          items: fetched.length,
        });
      } catch (err) {
        if (!controller.signal.aborted) {
          toast.error(
            err?.response?.data?.message || "Failed to fetch repairs",
          );
          console.error("fetchRepairs error:", err);
        } else {
          console.log("fetchRepairs: canceled", { pageNum });
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
  const debouncedSearch = useCallback(
    debounce((value, controller) => {
      setPage(1);
      fetchRepairs(value, 1, controller);
    }, 800),
    [fetchRepairs],
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    debouncedSearch(value, controller);
  };

  // ---------------- LOAD MORE ----------------
  const loadMore = () => {
    if (page >= totalPages) return;
    const nextPage = page + 1;
    setPage(nextPage);

    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    fetchRepairs(search, nextPage, controller);
  };

  // ---------------- INITIAL FETCH ----------------
  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current = controller;

    fetchRepairs("", 1, controller);

    return () => {
      controller.abort();
      debouncedSearch.cancel();
      console.log("RepairHistory: cleanup, canceled requests");
    };
  }, [fetchRepairs, debouncedSearch]);

  if (loading && page === 1) return <Loader />;

  return (
    <div className="min-h-screen px-4 py-8 pb-24 bg-gray-50 dark:bg-black md:pb-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">
        Repair History
      </h1>

      {/* Search */}
      <div className="mb-6 relative max-w-md mx-auto">
        <FaSearch className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2 dark:text-gray-500" />
        <input
          type="text"
          placeholder="Search by item, customer, or phone"
          value={search}
          onChange={handleSearchChange}
          className="w-full px-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
        />
      </div>

      {/* Repairs Grid */}
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
                className="flex flex-col p-4 bg-white rounded shadow dark:bg-gray-900"
              >
                <h2>{item.itemName}</h2>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
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
