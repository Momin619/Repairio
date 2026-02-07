import { useEffect, useState, useCallback, useRef } from "react";
import API from "../../../api/api";
import toast from "react-hot-toast";
import UsersTable from "../../ui/Tabel/UsersTable";
import Loader from "../../ui/Loader";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const controllerRef = useRef(null); // store the current controller

  const fetchUsers = useCallback(async (pageNum = 1) => {
    // Abort previous request if any
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await API.get(`/admin/users?page=${pageNum}&limit=12`, {
        signal: controller.signal,
      });

      if (!controller.signal.aborted) {
        const fetchedUsers = res.data.users || [];
        if (pageNum === 1) setUsers(fetchedUsers);
        else setUsers((prev) => [...prev, ...fetchedUsers]);

        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        toast.error(err);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchUsers(1);

    return () => {
      if (controllerRef.current) controllerRef.current.abort(); // cancel on unmount
    };
  }, [fetchUsers]);

  const loadMore = () => {
    if (page >= totalPages) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchUsers(nextPage);
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100 sm:p-6 md:p-8 dark:bg-black">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Admin Dashboard
      </h1>

      {loading && page === 1 ? (
        <Loader />
      ) : (
        <>
          <UsersTable users={users} />

          {page < totalPages && (
            <div className="flex justify-center mt-6">
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
