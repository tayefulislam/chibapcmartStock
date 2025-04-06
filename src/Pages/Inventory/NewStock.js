import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const NewStock = () => {
  const { supplierId, itemId, stockOrderId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function declarations first
  function generateSKU() {
    const randomLetter1 = String.fromCharCode(
      65 + Math.floor(Math.random() * 26)
    );
    const randomLetter2 = String.fromCharCode(
      65 + Math.floor(Math.random() * 26)
    );
    const randomNumbers1 = Math.floor(100 + Math.random() * 900);
    const randomNumbers2 = Math.floor(1000 + Math.random() * 9000);

    return `${randomLetter1}${randomNumbers1}${randomLetter2}${randomNumbers2}`;
  }

  const createNewInput = (lastEntry = null) => ({
    id: uuidv4(),
    skuId: generateSKU(),
    description: lastEntry?.description || "",
    ram: lastEntry?.ram || "",
    storage: lastEntry?.storage || "",
    storage2: lastEntry?.storage2 || "",
    color: lastEntry?.color || "",
    purchasePrice: lastEntry?.purchasePrice || 0,
  });

  const [inputs, setInputs] = useState([createNewInput(0)]);

  // Calculate totals
  const { totalPurchasePrice, totalEntries } = useMemo(
    () => ({
      totalPurchasePrice: inputs.reduce(
        (sum, input) => sum + Number(input.purchasePrice),
        0
      ),
      totalEntries: inputs.length,
    }),
    [inputs]
  );

  // Add new input

  const addInput = () => {
    const lastInput = inputs[inputs.length - 1];
    setInputs([...inputs, createNewInput(lastInput)]);
  };

  // Remove input
  const removeInput = (id) => {
    if (inputs.length > 1) setInputs(inputs.filter((input) => input.id !== id));
  };

  // Handle description change
  // const handleInputChange = (id, event) => {
  //   setInputs(
  //     inputs.map((input) =>
  //       input.id === id ? { ...input, value: event.target.value } : input
  //     )
  //   );
  // };

  // Handle general input changes
  const handleInputChange = (id, field, value) => {
    setInputs(
      inputs.map((input) =>
        input.id === id ? { ...input, [field]: value } : input
      )
    );
  };

  // Handle price change
  // const handlePriceChange = (id, event) => {
  //   const value = Math.max(0, Number(event.target.value));
  //   setInputs(
  //     inputs.map((input) =>
  //       input.id === id ? { ...input, purchasePrice: value } : input
  //     )
  //   );
  // };

  const handlePriceChange = (id, value) => {
    const numericValue = Math.max(0, Number(value));
    setInputs(
      inputs.map((input) =>
        input.id === id ? { ...input, purchasePrice: numericValue } : input
      )
    );
  };

  // API URLs
  const itemUrl = `${process.env.REACT_APP_apiLink}/api/v1/item/getSingleItem/${itemId}`;
  const supplierUrl = `${process.env.REACT_APP_apiLink}/api/v1/supplier/getSupplierById/${supplierId}`;

  // Fetch supplier details
  const {
    isPending: isSupplierPending,
    error: supplierError,
    data: supplierDetails,
  } = useQuery({
    queryKey: [`GET_SINGLE_SUPPLIER${supplierId}`],
    queryFn: async () => {
      const response = await fetch(supplierUrl);
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
  });

  // Fetch item details
  const {
    isPending: isItemPending,
    error: itemError,
    data: item,
  } = useQuery({
    queryKey: [`GET_SINGLE_ITEM${itemId}`],
    queryFn: async () => {
      const response = await fetch(itemUrl);
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
  });

  // Handle form submission
  const handleSubmit = () => {
    const stockData = {
      stockOrder: {
        // supplier: supplierDetails,
        // productDetails: item,

        stockOrderId,
        pId: item.productId,

        sId: supplierDetails?.supplierId,
        supplierId: supplierId,
        productId: item?._id,

        totalPurchasePrice,
        stocks: inputs.map((input) => input.skuId),
        // stocks: inputs.map((input) => ({
        //   sku: input.skuId,
        // })),
      },

      entries: inputs.map((input) => ({
        sku: input.skuId,
        description: input.description,
        ram: input.ram,
        storage: input.storage,
        storage2: input.storage2,
        color: input.color,

        productId: item._id,
        supplierId: supplierDetails._id,
        stockOrderId,
        searchKeyWord:
          input.skuId +
          " " +
          item?.productId +
          " " +
          supplierDetails?.supplierId +
          " " +
          supplierDetails?.name +
          " " +
          item?.brand +
          " " +
          item?.model +
          " " +
          item?.details,

        purchasePrice: input.purchasePrice,
      })),

      // totals: {
      //   totalEntries,
      //   totalPurchasePrice,
      // },
    };

    console.log(stockData);

    const url = `http://localhost:5000/api/v1/stockOrder/createNewStockOrder`;

    axios.post(url, stockData).then(function (response) {
      console.log(response);

      if (response.status === 200) {
        // navigate(`/requestDetails/${response.data._id}`);
        // toast.success(`Your Request for successfully placed`);
        // Reset form on success
        setInputs([createNewInput(0)]);
      }

      if (response.status === 400) {
        // toast.error(`Error: ${response.data.message}`);
      }
    });

    // Add your API submission logic here
  };

  // Loading and error states
  if (isSupplierPending || isItemPending)
    return <div className="p-4 text-center">Loading...</div>;
  if (supplierError || itemError)
    return (
      <div className="p-4 text-red-500">
        Error: {supplierError?.message || itemError?.message}
      </div>
    );

  return (
    <div className="">
      {/* Supplier & Item Header */}
      <h1 className="text-center text-2xl font-bold">
        New StockOrder #{stockOrderId}
      </h1>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">{supplierDetails.name}</h1>
        <p className="text-gray-600">{supplierDetails.address}</p>
        <div className="my-4 border-t border-blue-300"></div>

        <h2 className="text-xl font-medium">
          {item.brand} {item.model}
        </h2>
        <div className="my-4 border-t border-blue-300"></div>
      </div>

      {/* Input Fields */}
      <div className="space-y-4">
        {inputs.map((input) => (
          <div key={input.id} className="grid grid-cols-8 gap-4 items-center">
            {/* SKU Display */}
            <span className="font-mono p-2 bg-gray-100 rounded col-span-1">
              {input.skuId}
            </span>

            {/* Description */}
            <input
              type="text"
              value={input.description}
              onChange={(e) =>
                handleInputChange(input.id, "description", e.target.value)
              }
              placeholder="Description"
              className="p-2 border rounded"
            />

            {/* RAM */}
            <input
              type="text"
              value={input.ram}
              onChange={(e) =>
                handleInputChange(input.id, "ram", e.target.value)
              }
              placeholder="ram"
              className="p-2 border rounded"
            />

            {/* Storage */}
            <input
              type="text"
              value={input.storage}
              onChange={(e) =>
                handleInputChange(input.id, "storage", e.target.value)
              }
              placeholder="Storage"
              className="p-2 border rounded"
            />

            <input
              type="text"
              value={input.storage2}
              onChange={(e) =>
                handleInputChange(input.id, "storage2", e.target.value)
              }
              placeholder="Storage 2( HDD ) "
              className="p-2 border rounded"
            />

            {/* Color */}
            <input
              type="text"
              value={input.color}
              onChange={(e) =>
                handleInputChange(input.id, "color", e.target.value)
              }
              placeholder="Color"
              className="p-2 border rounded"
            />

            {/* Price */}
            <input
              type="number"
              value={input.purchasePrice}
              onChange={(e) => handlePriceChange(input.id, e.target.value)} // Pass value directly
              className="pl-6 p-2 border rounded w-full"
              min="0"
              step="0.01"
            />

            {/* Remove Button */}
            <button
              onClick={() => removeInput(input.id)}
              className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
              disabled={inputs.length === 1}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Totals Section */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <p className="text-lg font-semibold">
              Total Entries: {totalEntries}
            </p>
            <p className="text-lg font-semibold">
              Total Purchase Price: ¥{totalPurchasePrice.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={addInput}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Add New Entry +
        </button>

        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Save All Entries
        </button>
      </div>
    </div>
  );
};

export default NewStock;
