import React from "react";
import { useForm } from "react-hook-form";
import { FaTools, FaImage } from "react-icons/fa";
import API from "../../../api/api";
import toast from "react-hot-toast";

export default function RepairItemForm() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("itemName", data.itemName);
      formData.append("problem", data.problem);

      // customer object must be stringified
      formData.append(
        "customer",
        JSON.stringify({
          name: data.customerName,
          phone: data.customerPhone,
          email: data.customerEmail,
        }),
      );

      // append images if selected
      if (data.images && data.images.length > 0) {
        Array.from(data.images).forEach((file) => {
          formData.append("images", file);
        });
      }

      const res = await API.post("/repair-item", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data.message);
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating repair item");
    }
  };

  return (
    <div className="max-w-xl p-6 mx-auto border rounded-lg dark:bg-gray-900 dark:border-gray-700">
      <h2 className="flex items-center gap-2 mb-4 text-xl font-bold dark:text-white">
        <FaTools /> Create Repair Item
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input
          {...register("itemName", { required: true })}
          placeholder="Item Name"
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />

        <textarea
          {...register("problem", { required: true })}
          placeholder="Problem Description"
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />

        <input
          {...register("customerName", { required: true })}
          placeholder="Customer Name"
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />

        <input
          {...register("customerPhone", { required: true })}
          placeholder="Customer Phone"
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />

        <input
          {...register("customerEmail", { required: true })}
          placeholder="Customer Email"
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />

        {/* Image Upload */}
        <label className="flex items-center gap-2 text-sm font-medium dark:text-white">
          <FaImage /> Upload Images (optional)
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          {...register("images")}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />

        <button
          type="submit"
          className="w-full py-2 mt-2 font-semibold text-white bg-black rounded hover:opacity-90 dark:bg-white dark:text-black"
        >
          Create Repair Item
        </button>
      </form>
    </div>
  );
}
