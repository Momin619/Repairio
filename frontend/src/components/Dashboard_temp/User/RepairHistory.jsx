"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import API from "../../../api/api.js";
import { toast } from "react-hot-toast";
import Loader from "../../ui/Loader.jsx";
import debounce from "lodash.debounce";
import {
  FaWhatsapp,
  FaSearch,
  FaHourglassStart,
  FaCheckCircle,
  FaStopwatch,
} from "react-icons/fa";

const optimizeImage = (url, width = 200) => {
  if (!url) return "";
  return url.replace(
    "/upload/",
    `/upload/f_auto,q_auto,w_${width},h_${width},c_fill,g_auto/`,
  );
};

export default function RepairHistory() {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const controllerRef = useRef(null);

  const fetchRepairs = useCallback(
    async (searchTerm = "", pageNum = 1, controller) => {
      try {
        if (pageNum === 1) setLoading(true);
        else setLoadingMore(true);

        const res = await API.get(
          `/repair-items/history/completed?search=${searchTerm}&page=${pageNum}&limit=12`,
          { signal: controller.signal },
        );

        if (controller.signal.aborted) return;

        const fetched = res.data.items || [];
        if (pageNum === 1) setRepairs(fetched);
        else setRepairs((prev) => [...prev, ...fetched]);

        setTotalPages(res.data.totalPages);
        setHasMore(pageNum < res.data.totalPages);
      } catch (err) {
        if (!controller.signal.aborted) {
          toast.error(
            err?.response?.data?.message || "Failed to fetch repairs",
          );
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

  const debouncedSearchRef = useRef(
    debounce((value, controller) => {
      setPage(1);
      fetchRepairs(value, 1, controller);
    }, 800),
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    debouncedSearchRef.current(value, controller);
  };

  const loadMore = () => {
    if (page >= totalPages) return;
    const nextPage = page + 1;
    setPage(nextPage);

    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    fetchRepairs(search, nextPage, controller);
  };

  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current = controller;
    fetchRepairs("", 1, controller);

    return () => {
      controller.abort();
      debouncedSearchRef.current.cancel();
    };
  }, [fetchRepairs]);

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const optionsDate = { day: "numeric", month: "short", year: "numeric" };
    const optionsTime = { hour: "numeric", minute: "numeric", hour12: true };
    return `${date.toLocaleDateString(undefined, optionsDate)} at ${date.toLocaleTimeString(
      undefined,
      optionsTime,
    )}`;
  };

  if (loading && page === 1) return <Loader />;

  return (
    <div className="min-h-screen px-4 py-8 pb-24 bg-gray-50 dark:bg-black md:pb-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">
        Repair History
      </h1>

      {/* Search */}
      <div className="relative max-w-md mx-auto mb-6">
        <FaSearch className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2 dark:text-gray-500" />
        <input
          type="text"
          placeholder="Search by item, customer, phone"
          value={search}
          onChange={handleSearchChange}
          className="w-full px-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
        />
      </div>

      {repairs.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">
          No completed repairs found.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {repairs.map((item) => (
            <div
              key={item._id}
              className="flex flex-col p-4 transition bg-white rounded-lg shadow hover:shadow-lg dark:bg-gray-900"
            >
              {/* Image */}
              <div className="w-full mx-auto mb-4 overflow-hidden rounded max-h-56 sm:max-h-48 md:max-h-56 lg:max-h-64">
                {item.images?.[0] ? (
                  <img
                    src={optimizeImage(item.images[0].url, 200)}
                    alt={item.itemName}
                    className="object-cover w-full h-full transition-transform duration-200 hover:scale-105"
                    loading="lazy"
                    srcSet={`
          ${optimizeImage(item.images[0].url, 150)} 150w,
          ${optimizeImage(item.images[0].url, 200)} 200w,
          ${optimizeImage(item.images[0].url, 400)} 400w
        `}
                    sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 33vw, 200px"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-32 bg-gray-200 rounded dark:bg-gray-700">
                    <span className="text-gray-500 dark:text-gray-300">
                      No Image
                    </span>
                  </div>
                )}
              </div>

              {/* Item Info */}
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

              {/* Repair times */}
              <div className="pt-3 mt-3 space-y-1 text-sm text-gray-600 border-t dark:border-gray-700 dark:text-gray-400">
                {item.startedAt && (
                  <p className="flex items-center gap-2">
                    <FaHourglassStart className="text-yellow-500" />
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      Repair started: {formatDateTime(item.startedAt)}
                    </span>
                  </p>
                )}
                {item.completedAt && (
                  <p className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" />
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      Repair completed: {formatDateTime(item.completedAt)}
                    </span>
                  </p>
                )}
                {item.duration && (
                  <p className="flex items-center gap-2">
                    <FaStopwatch className="text-blue-500" />
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      Duration: {item.duration}
                    </span>
                  </p>
                )}
              </div>

              {/* Status + WhatsApp */}
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
      )}

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
