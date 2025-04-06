import axios from "axios";

import React from "react";

const CreateNewItems = () => {
  function generateRandomSKU() {
    // Generate two random English characters (A-Z)
    const letters = String.fromCharCode(
      65 + Math.floor(Math.random() * 26)
      // 65 + Math.floor(Math.random() * 26)
    );

    // Generate six random digits (100000 to 999999)
    const numbers = Math.floor(10000 + Math.random() * 90000);

    // Combine letters and numbers to form the SKU
    const sku = "PI" + letters + numbers;
    return sku;
  }

  // Example usage
  const randomSKU = generateRandomSKU();
  console.log("Generated SKU:", randomSKU);

  const handleRequest = (event) => {
    event.preventDefault();

    const details = event?.target?.details?.value;

    const comment = event?.target?.comment?.value;

    console.log(details, comment);

    const newItem = {
      details,

      comment,
      productId: randomSKU,
      itemType: event?.target?.itemType?.value,
      model: event?.target?.model?.value,
      brand: event?.target?.brand?.value,
      storage2: event?.target?.storage2?.value,
      storage: event?.target?.storage?.value,
      ram: event?.target?.ram?.value,
    };

    const url = `http://localhost:5000/api/v1/item/createNewItem`;

    axios.post(url, newItem).then(function (response) {
      console.log(response);

      if (response.status === 200) {
        // navigate(`/requestDetails/${response.data._id}`);
        // toast.success(`Your Request for ${type} successfully placed`);

        event.target.reset();
      }

      if (response.status === 400) {
      }
    });

    console.log(newItem);
  };

  return (
    <div>
      <div>
        <div className="flex justify-center items-center">
          <div className="card w-96">
            <h1 className="text-center text-2xl font-bold">
              New Item #{randomSKU}
            </h1>

            <div className="card-body">
              <form onSubmit={handleRequest}>
                <div>
                  <div className="label">
                    <span className="label-text"> Item Type : </span>
                  </div>
                  <select
                    name="itemType"
                    className="select select-accent w-full max-w-xs"
                  >
                    <option>LAPTOP</option>
                    <option>MOBILE</option>
                    <option>TABLET</option>
                    <option>MONITOR</option>
                    <option>PC</option>
                  </select>
                </div>
                <div class="form-control w-full max-w-xs">
                  <label class="label">
                    <span class="label-text">BRAND NAME:</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="NAME"
                    name="brand"
                    class="input input-bordered input-error w-full max-w-xs"
                  />
                  <label class="label"></label>
                </div>

                <div class="form-control w-full max-w-xs">
                  <label class="label">
                    <span class="label-text">Model:</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Model Name"
                    name="model"
                    class="input input-bordered input-error w-full max-w-xs"
                  />
                  <label class="label"></label>
                </div>
                <div class="form-control w-full max-w-xs">
                  <label class="label">
                    <span class="label-text">RAM:</span>
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="RAM"
                    name="ram"
                    class="input input-bordered input-error w-full max-w-xs"
                  />
                  <label class="label"></label>
                </div>
                <div class="form-control w-full max-w-xs">
                  <label class="label">
                    <span class="label-text">Storage:</span>
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Storage"
                    name="storage"
                    class="input input-bordered input-error w-full max-w-xs"
                  />
                  <label class="label"></label>
                </div>
                <div class="form-control w-full max-w-xs">
                  <label class="label">
                    <span class="label-text">Storage 2:</span>
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="storage 2 "
                    name="storage2"
                    class="input input-bordered input-error w-full max-w-xs"
                  />
                  <label class="label"></label>
                </div>

                <div class="form-control w-full max-w-xs">
                  <label class="label">
                    <span class="label-text">Details:</span>
                  </label>
                  <textarea
                    type="text"
                    placeholder="Details"
                    name="details"
                    class="input input-bordered input-error w-full max-w-xs"
                  />
                  <label class="label"></label>
                </div>

                <div class="form-control w-full max-w-xs">
                  <label class="label">
                    <span class="label-text">Comment:</span>
                  </label>
                  <textarea
                    type="text"
                    placeholder="Comment"
                    name="comment"
                    className="input input-bordered input-error w-full max-w-xs"
                  />
                  <label class="label"></label>
                </div>

                <div className="flex justify-center items-center">
                  <input className="btn" type="submit" value="Create" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNewItems;
