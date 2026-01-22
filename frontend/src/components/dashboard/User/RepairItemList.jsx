import React from "react";
import RepairItemCard from "./RepairItemCard";
import API from "../../../api/api";
import toast from "react-hot-toast";

export default function RepairItemList() {
  const [items, setItems] = React.useState([]);

  const fetchItems = async () => {
    try {
      const res = await API.get("/repair-items");
      setItems(res.data);
    } catch (err) {
      toast.error("Error fetching repair items");
    }
  };

  React.useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <RepairItemCard key={item._id} itemData={item} />
      ))}
    </div>
  );
}
