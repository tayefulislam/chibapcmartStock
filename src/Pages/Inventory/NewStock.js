import { useQuery } from "@tanstack/react-query";
import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const NewStock = () => {
  const { supplierId, itemId, stockOrderId } = useParams();

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

  const createNewInput = (lastPrice = 0) => {
    return {
      id: uuidv4(),
      skuId: generateSKU(),
      value: "",
      purchasePrice: lastPrice,
      placeholder: "Enter item description",
    };
  };

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
    const lastPrice =
      inputs.length > 0 ? inputs[inputs.length - 1].purchasePrice : 0;
    setInputs([...inputs, createNewInput(lastPrice)]);
  };

  // Remove input
  const removeInput = (id) => {
    if (inputs.length > 1) setInputs(inputs.filter((input) => input.id !== id));
  };

  // Handle description change
  const handleInputChange = (id, event) => {
    setInputs(
      inputs.map((input) =>
        input.id === id ? { ...input, value: event.target.value } : input
      )
    );
  };

  // Handle price change
  const handlePriceChange = (id, event) => {
    const value = Math.max(0, Number(event.target.value));
    setInputs(
      inputs.map((input) =>
        input.id === id ? { ...input, purchasePrice: value } : input
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
      supplier: supplierDetails,
      productDetails: item,
      entries: inputs.map((input) => ({
        sku: input.skuId,
        description: input.value,
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
      stocks: inputs.map((input) => ({
        sku: input.skuId,
      })),
      totals: {
        totalEntries,
        totalPurchasePrice,
      },
    };
    console.log("Submission Data:", stockData);
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
    <div className="container mx-auto p-4 max-w-4xl">
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
          <div key={input.id} className="flex gap-3 items-center">
            {/* SKU Display */}
            <span className="font-mono px-3 py-2 bg-gray-100 rounded w-32">
              {input.skuId}
            </span>

            {/* Description Input */}
            <input
              type="text"
              value={input.value}
              onChange={(e) => handleInputChange(input.id, e)}
              placeholder={input.placeholder}
              className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* Price Input */}
            <div className="relative w-32">
              <span className="absolute left-3 top-2 text-gray-400">¥</span>
              <input
                type="number"
                value={input.purchasePrice}
                onChange={(e) => handlePriceChange(input.id, e)}
                className="w-full pl-7 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                min="0"
                step="0.01"
              />
            </div>

            {/* Remove Button */}
            <button
              onClick={() => removeInput(input.id)}
              className="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:bg-gray-300"
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
