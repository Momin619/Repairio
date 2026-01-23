import { useState, useEffect } from "react";
import RepairItemCard from "./RepairItemCard";
import API from "../../../api/api";
import toast from "react-hot-toast";
import Loader from "@/components/ui/Loader";

export default function RepairItemList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await API.get("/repair-items"); // only in-repair
      setItems(res.data);
    } catch {
      toast.error("Error fetching repair items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // 🔥 REMOVE ITEM LOCALLY WHEN COMPLETED
  const handleItemCompleted = (completedItemId) => {
    setItems((prev) => prev.filter((item) => item._id !== completedItemId));
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl px-4 mx-auto space-y-6 pt-14 sm:pt-16 md:pt-20 lg:pt-24 xl:pt-28">
      {items.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No items currently in repair
        </p>
      ) : (
        items.map((item) => (
          <RepairItemCard
            key={item._id}
            itemData={item}
            onCompleted={handleItemCompleted} // 👈 pass callback
          />
        ))
      )}
    </div>
  );
}
