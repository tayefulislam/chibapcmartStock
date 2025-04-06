import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const SelectSupplier = () => {
  const navigate = useNavigate();
  let [searchKeyWord, setSearchKeyWord] = useState("");
  let [accountStatus, setAccountStatus] = useState("");

  function generateRandomStockOrderID() {
    // Generate two random English characters (A-Z)
    const letters = String.fromCharCode(
      65 + Math.floor(Math.random() * 26)
      // 65 + Math.floor(Math.random() * 26)
    );

    // Generate six random digits (100000 to 999999)
    const numbers = Math.floor(10000 + Math.random() * 90000);

    // Combine letters and numbers to form the SKU
    const sku = "S" + letters + numbers;
    return sku;
  }

  const stockOrderID = generateRandomStockOrderID();

  const handleSearch = (value) => {
    console.log(value);
  };

  const fetchSuppliers = async () => {
    try {
      // Ensure the environment variable is set
      if (!process.env.REACT_APP_apiLink) {
        throw new Error(
          "REACT_APP_apiLink environment variable is not defined"
        );
      }

      const res = await fetch(
        `${process.env.REACT_APP_apiLink}/api/v1/supplier/getAllSupplier`
      );

      // Check if the response is OK (status code 2xx)
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      // Parse and return the JSON data
      return res.json();
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      throw error; // Re-throw the error so that `useQuery` can handle it
    }
  };

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["getAllSupplier"], // Consistent with the data being fetched
    queryFn: fetchSuppliers,
    keepPreviousData: true,
  });

  if (isPending) {
    return <div>Loading suppliers...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold my-2">
        Select / Create Supplier
      </h1>
      {/* Action : Create New Supplier */}
      <div
        className="flex justify-center text-black"
        onClick={() => navigate("/newStock/CreateNewSupplier")}
      >
        <div className="stats shadow-lg w-full mx-2 bg-[#f4e8fe] my-2  max-w-lg">
          <div className="stat place-items-center">
            <div className="stat-title ">Create New Supplier</div>
          </div>
        </div>
      </div>

      {/* Action : Search */}
      <div className="flex justify-center my-2">
        <input
          onChange={(e) => handleSearch(e?.target?.value)}
          className="input input-bordered join-item w-full max-w-xs"
          placeholder="Search"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mx-2">
        {data?.map((supplier) => (
          <div
            onClick={() =>
              navigate(
                `/newStock/CreateNewStock/${stockOrderID}/${supplier?._id}`
              )
            }
            key={supplier?._id}
            className="card w-full bg-base-100 card-xs shadow-lg"
          >
            <div className="card-body">
              <h2 className="card-title">{supplier?.name}</h2>
              <p>{supplier?.address}</p>
              <p className="text-red-600 font-semibold">
                {supplier?.phoneNumber}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectSupplier;
