import React from "react";
import { FaCheck, FaTrash } from "react-icons/fa";
import API from "../../../api/api";
import toast from "react-hot-toast";

export default function RepairItemCard({ itemData }) {
  const [item, setItem] = React.useState(itemData);

  const updateStatus = async () => {
    try {
      const res = await API.patch(`/repair-item/${item._id}/update-status`, {
        status: "completed",
      });
      toast.success(res.data.message);
      setItem(res.data.item);
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
    <div className="flex items-center justify-between p-4 card dark:bg-gray-900 dark:border-gray-700">
      <div>
        <h3 className="font-bold">{item.itemName}</h3>
        <p>{item.problem}</p>
        <p className="text-sm">Customer: {item.customer.name}</p>
        <p className="text-sm">Status: {item.status}</p>
        {item.status === "completed" && (
          <p className="text-sm">
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
      <div className="flex gap-2">
        {item.status !== "completed" && (
          <button onClick={updateStatus} title="Mark Completed">
            <FaCheck />
          </button>
        )}
        <button onClick={deleteItem} title="Delete">
          <FaTrash />
        </button>
      </div>
    </div>
  );
}
