import React from "react";
import { FaCheck, FaTrash } from "react-icons/fa";
import API from "../../../api/api";
import toast from "react-hot-toast";

export default function RepairItemCard({ itemData, onCompleted }) {
  const [item, setItem] = React.useState(itemData);

  const updateStatus = async () => {
    try {
      const res = await API.patch(`/repair-item/${item._id}/update-status`, {
        status: "completed",
      });
      toast.success(res.data.message);
      onCompleted(item._id);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating status");
    }
  };

  const deleteItem = async () => {
    try {
      await API.delete(`/repair-item/${item._id}/delete`);
      toast.success("Deleted successfully");
      setItem(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting item");
    }
  };

  if (!item) return null;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between w-full gap-4 p-4 transition bg-white border border-gray-200 shadow-md md:flex-row md:items-center dark:bg-gray-900 dark:border-gray-700 rounded-xl hover:shadow-lg md:p-6">
        {/* Image */}

        {/* Image */}
        {/* Image */}
        {item.images && item.images.length > 0 ? (
          <img
            src={`http://localhost:4500${item.images[0]}`} // use first image
            alt={item.itemName}
            className="flex-shrink-0 object-cover w-full h-40 rounded-lg md:w-40 md:h-40"
          />
        ) : (
          <div className="flex items-center justify-center flex-shrink-0 w-full h-40 bg-gray-200 rounded-lg md:w-40 md:h-40 dark:bg-gray-700">
            <span className="text-gray-500 dark:text-gray-300">No Image</span>
          </div>
        )}

        {/* Info */}
        <div className="flex-1 w-full">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {item.itemName}
          </h3>
          <p className="mt-1 text-gray-700 dark:text-gray-300">
            {item.problem}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Customer: {item.customer.name}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Status
            </span>

            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full capitalize
      ${
        item.status === "completed"
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
      }
    `}
            >
              {item.status.replace("-", " ")}
            </span>
          </div>

          {item.status === "completed" && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Time Taken:{" "}
              {item.timeTakenHours ??
                Math.round(
                  (new Date(item.completedAt) - new Date(item.createdAt)) /
                    (1000 * 60 * 60),
                )}{" "}
              hours
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4 md:mt-0">
          {item.status !== "completed" && (
            <button
              onClick={updateStatus}
              title="Mark Completed"
              className="flex items-center justify-center w-10 h-10 text-white transition bg-green-500 rounded-lg cursor-pointer hover:bg-green-600"
            >
              <FaCheck />
            </button>
          )}
          <button
            onClick={deleteItem}
            title="Delete"
            className="flex items-center justify-center w-10 h-10 text-white transition bg-red-500 rounded-lg cursor-pointer hover:bg-red-600"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
}
