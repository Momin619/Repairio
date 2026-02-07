"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaTools, FaImage } from "react-icons/fa";
import API from "../../../api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function RepairItemForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onChange" });

  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null); // store single image

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("itemName", data.itemName);
      formData.append("problem", data.problem);
      formData.append("repairCost", data.repairCost);
      formData.append(
        "customer",
        JSON.stringify({
          name: data.customerName,
          phone: data.customerPhone,
        }),
      );

      // ✅ Append single image if selected
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const res = await API.post("/repair-item", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message);
      navigate("/dashboard");

      if (res.data.whatsappLink) {
        setTimeout(() => {
          window.open(res.data.whatsappLink, "_blank");
        }, 300); // small delay
      }

      reset();
      setSelectedImage(null); // reset selected image
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating repair item");
    }
  };

  return (
    <div className="w-full px-4 pt-16 pb-32 sm:pt-12 md:pt-16">
      <div className="max-w-2xl p-5 mx-auto bg-white border shadow-sm sm:p-6 md:p-6 rounded-xl dark:bg-gray-900 dark:border-gray-700">
        {/* Heading */}
        <h2 className="flex items-center gap-2 mb-5 overflow-hidden text-xl font-bold text-gray-800 sm:text-2xl md:text-2xl dark:text-white whitespace-nowrap text-ellipsis">
          <FaTools className="text-blue-500" />
          Create Repair Item
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-5"
        >
          {/* Item Name */}
          <div>
            <input
              {...register("itemName", { required: "Item name is required" })}
              placeholder="Item name (e.g. iPhone 16)"
              className="w-full p-2 border rounded-lg placeholder:text-black dark:placeholder:text-white sm:p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
            {errors.itemName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.itemName.message}
              </p>
            )}
          </div>

          {/* Problem */}
          <div>
            <textarea
              {...register("problem", {
                required: "Problem description is required",
              })}
              placeholder="Describe the problem clearly"
              rows={3}
              className="w-full p-2 border rounded-lg placeholder:text-black dark:placeholder:text-white sm:p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
            {errors.problem && (
              <p className="mt-1 text-sm text-red-500">
                {errors.problem.message}
              </p>
            )}
          </div>

          {/* Repair Cost */}
          <div>
            <input
              type="number"
              {...register("repairCost", {
                required: "Repair Cost is required",
              })}
              placeholder="Repair cost (in PKR)"
              className="w-full p-2 border rounded-lg placeholder:text-black dark:placeholder:text-white sm:p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
            {errors.repairCost && (
              <p className="mt-1 text-sm text-red-500">
                {errors.repairCost.message}
              </p>
            )}
          </div>

          {/* Customer Name */}
          <div>
            <input
              {...register("customerName", {
                required: "Customer name is required",
              })}
              placeholder="Customer name"
              className="w-full p-2 border rounded-lg placeholder:text-black dark:placeholder:text-white sm:p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
            {errors.customerName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.customerName.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <input
              type="number"
              {...register("customerPhone", {
                required: "Phone number is required",
                pattern: {
                  value: /^03\d{9}$/,
                  message: "Enter valid Pakistani number (03XXXXXXXXX)",
                },
              })}
              placeholder="Customer phone (03XXXXXXXXX)"
              className="w-full p-2 border rounded-lg sm:p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-black dark:placeholder:text-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
            {errors.customerPhone && (
              <p className="mt-1 text-sm text-red-500">
                {errors.customerPhone.message}
              </p>
            )}
          </div>

          {/* Image */}
          <div>
            <label className="flex items-center gap-2 mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              <FaImage />
              Upload image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => setSelectedImage(e.target.files[0])} // handle single image
              className="w-full p-2 border rounded-lg cursor-pointer dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 sm:py-3 font-semibold text-white transition bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-500 active:scale-[0.98] dark:bg-blue-500 dark:hover:bg-blue-400"
          >
            {isSubmitting ? "Creating Item..." : "Create Repair Item"}
          </button>
        </form>
      </div>
    </div>
  );
}
