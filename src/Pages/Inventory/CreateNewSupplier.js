import React from "react";
import axios from "axios";

const CreateNewSupplier = () => {
  const handleRequest = (event) => {
    event.preventDefault();

    const name = event?.target?.name?.value;
    const address = event?.target?.address?.value;
    const details = event?.target?.details?.value;
    const phoneNumber = event?.target?.number?.value;
    const comments = event?.target?.comments?.value;

    console.log(name, address, details, phoneNumber, comments);

    const newSupplier = {
      name,
      address,
      details,
      phoneNumber,
      comments,
    };

    const url = `http://localhost:5000/api/v1/supplier/createNewSupplier`;

    axios.post(url, newSupplier).then(function (response) {
      console.log(response);

      if (response.status === 200) {
        // navigate(`/requestDetails/${response.data._id}`);
        // toast.success(`Your Request for ${type} successfully placed`);

        event.target.reset();
      }
    });
  };
  return (
    <div>
      <div>
        <div className="flex justify-center items-center">
          <div className="card w-96">
            <h1 className="text-center text-2xl font-bold">
              Create New Supplier
            </h1>

            <div className="card-body">
              <form onSubmit={handleRequest}>
                <div class="form-control w-full max-w-xs">
                  <label class="label">
                    <span class="label-text">SHOP / OFFICE / AGENT NAME:</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="SHOP / OFFICE / AGENT NAME"
                    name="name"
                    class="input input-bordered input-error w-full max-w-xs"
                  />
                  <label class="label"></label>
                </div>

                <div class="form-control w-full max-w-xs">
                  <label class="label">
                    <span class="label-text">ADDRESS:</span>
                  </label>
                  <textarea
                    type="text"
                    placeholder="ADDRESS"
                    name="address"
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
                    <span class="label-text">Phone Number:</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Phone Number"
                    name="number"
                    class="input input-bordered input-error w-full max-w-xs"
                  />
                  <label class="label"></label>
                </div>

                <div class="form-control w-full max-w-xs">
                  <label class="label">
                    <span class="label-text">Comments :</span>
                  </label>
                  <textarea
                    type="text"
                    placeholder="Comments"
                    name="comments"
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

export default CreateNewSupplier;
