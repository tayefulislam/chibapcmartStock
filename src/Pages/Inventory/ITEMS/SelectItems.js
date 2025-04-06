import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const SelectItems = () => {
  const navigate = useNavigate();
  let [searchKeyWord, setSearchKeyWord] = useState("");

  const { supplierId, stockOrderId } = useParams();

  const handleSearch = (value) => {
    console.log(value);
  };

  const url = `${process.env.REACT_APP_apiLink}/api/v1/item/getAllItems?s=${searchKeyWord}`;

  // GET ALL ORDER DETAILS
  const { isPending, error, data, refetch } = useQuery({
    queryKey: [`getAllItems`],
    queryFn: () => fetch(url).then((res) => res.json()),
  });

  console.log(data);

  return (
    <div>
      <div>
        <h1>Select Items</h1>
      </div>

      <div>
        <h1 className="text-center text-2xl font-semibold my-2">
          Select / Add Items
        </h1>
        {/* Action : Create New Supplier */}
        <div
          className="flex justify-center text-black"
          onClick={() => navigate("/items/NewItem")}
        >
          <div className="stats shadow-lg w-full mx-2 bg-[#f4e8fe] my-2  max-w-lg">
            <div className="stat place-items-center">
              <div className="stat-title ">Create New Items</div>
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
          {data?.map((item) => (
            <div
              onClick={() =>
                navigate(
                  `/newStock/CreateNewStock/${stockOrderId}/${supplierId}/${item?._id}`
                )
              }
              key={item?._id}
              className="card w-full bg-base-100 card-xs shadow-lg"
            >
              <div className="card-body">
                <h2 className="card-title">{item?.brand} </h2>

                <p>{item?.model}</p>
                <p className="text-red-600 font-semibold">{item?.ram}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectItems;
