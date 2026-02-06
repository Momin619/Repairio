// import React, { useState } from "react";
import { FaCheck, FaTrash } from "react-icons/fa";
import { useState } from "react";
import { FaScrewdriverWrench } from "react-icons/fa6";
import API from "../../../api/api";
import toast from "react-hot-toast";

export default function RepairItemCard({
  itemData,
  imageUrl,
  onStatusChange,
  previewUrl,
}) {
  const [item, setItem] = useState(itemData);
  const [previewOpen, setPreviewOpen] = useState(false);

  // START REPAIR
  const startRepair = async () => {
    try {
      const res = await API.patch(`/repair-item/${item._id}/start-repair`);
      toast.success(res.data.message);
      setItem(res.data.item);
      onStatusChange?.(res.data.item);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error starting repair");
    }
  };

  // COMPLETE REPAIR
  const completeRepair = async () => {
    try {
      const res = await API.patch(`/repair-item/${item._id}/complete-repair`, {
        status: "completed",
      });
      toast.success(res.data.message);

      if (res.data.whatsappLink) window.open(res.data.whatsappLink, "_blank");

      onStatusChange?.(res.data.item);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error completing repair");
    }
  };

  // DELETE ITEM
  const deleteItem = async () => {
    try {
      await API.delete(`/repair-item/${item._id}/delete`);
      toast.success("Deleted successfully");
      onStatusChange?.({ _id: item._id, removed: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting item");
    }
  };

  if (!item) return null;

  return (
    <>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between w-full gap-4 p-4 transition bg-white border border-gray-200 shadow-md md:flex-row md:items-center dark:bg-gray-900 dark:border-gray-700 rounded-xl hover:shadow-lg md:p-6">
          {/* IMAGE */}
          <div
            className="w-full overflow-hidden rounded-lg cursor-pointer md:w-40 aspect-square"
            onClick={() => setPreviewOpen(true)}
          >
            {imageUrl ? (
              <img
                loading="lazy"
                decoding="async"
                src={imageUrl}
                alt={item.itemName}
                className="object-cover w-full h-full transition-transform duration-200 hover:scale-105"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700">
                <span className="text-gray-500 dark:text-gray-300">
                  No Image
                </span>
              </div>
            )}
          </div>

          {/* INFO */}
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
                className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                  item.status === "completed"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : item.status === "in-repair"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                }`}
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

          {/* ACTIONS */}
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            {item.status === "pending" && (
              <button
                onClick={startRepair}
                className="flex items-center gap-2 px-3 py-2 text-white transition bg-yellow-400 rounded-lg dark:bg-yellow-500 hover:bg-yellow-500 dark:hover:bg-yellow-600"
              >
                <FaScrewdriverWrench />
                <span className="text-sm font-medium">Start Repair</span>
              </button>
            )}
            {item.status === "in-repair" && (
              <button
                onClick={completeRepair}
                className="flex items-center gap-2 px-3 py-2 text-white transition bg-green-500 rounded-lg hover:bg-green-600"
              >
                <FaCheck />
                <span className="text-sm font-medium">Complete</span>
              </button>
            )}
            <button
              onClick={deleteItem}
              className="flex items-center gap-2 px-3 py-2 text-white transition bg-red-500 rounded-lg hover:bg-red-600"
            >
              <FaTrash />
              <span className="text-sm font-medium">Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* IMAGE PREVIEW MODAL */}
      {/* IMAGE PREVIEW MODAL */}
      {previewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setPreviewOpen(false)} // click outside closes modal
        >
          <img
            src={previewUrl} // use large preview
            decoding="async"
            alt={item.itemName}
            className="max-h-[95vh] max-w-[95vw] rounded-lg shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()} // prevent modal closing when clicking image
          />
        </div>
      )}
    </>
  );
}
