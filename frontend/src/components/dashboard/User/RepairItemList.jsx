import { useState, useRef, useCallback, useEffect } from "react";
import API from "../../../api/api.js";
import debounce from "lodash.debounce";
import { toast } from "react-hot-toast";
import { FaSearch } from "react-icons/fa";
import RepairItemCard from "./RepairItemCard.jsx";
import Loader from "@/components/ui/Loader.jsx";

const optimizeImage = (url, width = 300) => {
  if (!url) return "";
  return url.replace(
    "/upload/",
    `/upload/f_auto,q_auto,w_${width},h_${width},c_fill,g_auto/`,
  );
};

export default function RepairItemList() {
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [items, setItems] = useState([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const controllerRef = useRef(null);

  // FETCH ITEMS
  const fetchItems = useCallback(
    async (searchTerm = "", pageNum = 1, controller) => {
      try {
        if (pageNum === 1) setLoading(true);
        else setLoadingMore(true);

        const res = await API.get(
          `/repair-items?search=${searchTerm}&page=${pageNum}&limit=12`,
          { signal: controller.signal },
        );

        if (controller.signal.aborted) return;

        const fetchedItems = res.data.items.filter(
          (item) => item.status === "pending" || item.status === "in-repair",
        );

        // Update state
        setItems(
          pageNum === 1 ? fetchedItems : (prev) => [...prev, ...fetchedItems],
        );
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

  // DEBOUNCED SEARCH
  const debouncedSearchRef = useRef(
    debounce((value, controller) => {
      setPage(1);
      fetchItems(value, 1, controller);
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

  // INITIAL FETCH
  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current = controller;

    fetchItems("", 1, controller);

    return () => {
      controller.abort();
      debouncedSearchRef.current.cancel();
    };
  }, [fetchItems]);

  // LOAD MORE
  const loadMore = () => {
    if (page >= totalPages) return;
    const nextPage = page + 1;
    setPage(nextPage);

    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    fetchItems(search, nextPage, controller);
  };

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
          className="w-full px-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
        />
      </div>

      {items.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No items currently in repair
        </p>
      ) : (
        <>
          {items.map((item) => {
            const thumbnailUrl = item.images?.[0]
              ? optimizeImage(item.images[0].url, 300)
              : "";
            const previewUrl = item.images?.[0]
              ? optimizeImage(item.images[0].url, 1200)
              : "";

            return (
              <RepairItemCard
                key={item._id}
                itemData={item}
                imageUrl={thumbnailUrl}
                previewUrl={previewUrl}
                onStatusChange={(updatedItem) => {
                  if (
                    updatedItem?.status === "completed" ||
                    updatedItem?.removed
                  ) {
                    setItems((prev) =>
                      prev.filter((i) => i._id !== updatedItem._id),
                    );
                    return;
                  }
                  setItems((prev) =>
                    prev.map((i) =>
                      i._id === updatedItem._id ? updatedItem : i,
                    ),
                  );
                }}
              />
            );
          })}

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
