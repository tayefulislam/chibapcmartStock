import React from "react";
import axios from "axios";

const CreateNewOrder = () => {
  const [paymentType, setPaymentType] = React.useState("");
  let [paymentStatus, setPaymentStatus] = React.useState("");
  let [courierName, setCourierName] = React.useState("");

  const handlePaymentTypeAndStatus = (type) => {
    if (type === "Cash On Delivery") {
      setPaymentType("Cash On Delivery");
      setPaymentStatus("Unpaid");
      setCourierName("JAPAN POST");
    }

    if (type === "Bank Transfer") {
      setPaymentType("Bank Transfer");
      setPaymentStatus("Paid");
      setCourierName("JAPAN POST");
    }

    if (type === "In Shop") {
      setPaymentType("In Shop");
      setPaymentStatus("");
      setCourierName("");
    }
  };

  console.log(paymentType);
  console.log(paymentStatus);

  const handleRequest = (e) => {
    e.preventDefault();
    const customerName = e.target?.customerName?.value || "";
    const itemsDetails = e.target?.itemsDetails?.value;
    const address = e.target?.address?.value || "";
    const postalCode = e.target?.postalCode?.value || "";
    const phoneNumber = e.target?.phoneNumber?.value || "";
    const deliveryDate = e.target?.deliveryDate?.value;
    const timeSlot = e.target?.timeSlot?.value;
    const orderType = e.target?.orderType?.value;
    const totalAmount = e.target?.totalAmount?.value;
    const paymentType = e.target?.paymentType?.value;
    const trackId = e.target?.trackId?.value || "";
    const bankName = e.target?.bankName?.value || "";
    const transactionNumber = e.target?.transactionNumber?.value || "";
    const deliveryCost = e.target?.deliveryCost?.value;
    const deliveryStatus = e.target?.deliveryStatus?.value;
    const socialMedia = e.target?.socialMedia?.value || "";
    const profileLink = e.target?.profileLink?.value || "";

    let searchKeyWord = `${customerName || " "}  "" ${address || " "}  ""${
      postalCode || " "
    }  " "${phoneNumber || " "}  "" ${trackId || " "}  ""${
      bankName || " "
    }  ""${transactionNumber || " "}  ""${bankName || " "}  ""${
      transactionNumber || " "
    }`;

    let customerAndOrderDetails = {
      customerDetails: {
        customerName,
        customerName,
        postalCode,
        phoneNumber,
        socialMedia,
        profileLink,
        address,
      },
      orderDetails: {
        itemsDetails: [
          {
            itemName: itemsDetails,
          },
        ],
        totalAmount,
        deliveryCost,
        orderPostalCode: postalCode,
        deliveryDate: new Date(deliveryDate),
        timeSlot,
        orderType,
        deliveryStatus,
        searchKeyWord,
      },
      paymentDetails: {
        paymentType,
        paymentStatus,
        paymentAmount: totalAmount,
        transactionNumber,
        courierName,
        trackId,
        bankName,
      },
    };

    console.log(customerAndOrderDetails);

    const url = `${process.env.REACT_APP_apiLink}/api/v1/orders/createOrder`;

    axios
      .post(url, customerAndOrderDetails)
      .then(function (response) {
        console.log(response);

        if (response?.status === 200) {
          e.target.reset();
        }

        if (response?.status === 400) {
          alert("Order Created Failed");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <div>
      {" "}
      <h1 className="text-center text-xl font-semibold">Create Order</h1>
      {/* Create Order */}
      <div className="flex justify-center items-center mb-8">
        <form onSubmit={handleRequest}>
          <label className="form-control w-96 max-w-xs">
            <div className="label">
              <span className="label-text">Customer Name : </span>
            </div>
            <input
              type="text"
              name="customerName"
              placeholder="Type here"
              className="input input-accent w-full max-w-xs"
            />

            <div className="label">
              <span className="label-text">Items Details : </span>
            </div>
            <textarea
              type="text"
              name="itemsDetails"
              placeholder="Type Items Details "
              className="textarea textarea-accent w-full max-w-xs"
            />

            <div className="label">
              <span className="label-text"> Address : </span>
            </div>
            <textarea
              type="text"
              name="address"
              placeholder="Type Address"
              className="textarea textarea-accent w-full max-w-xs"
            />

            <div className="label">
              <span className="label-text"> Postal Code : </span>
            </div>
            <input
              type="text"
              name="postalCode"
              placeholder="Type Postal Code ( 123-4533 )"
              className="input input-accent w-full max-w-xs"
            />

            <div className="label">
              <span className="label-text"> Phone Number: </span>
            </div>
            <input
              type="text"
              name="phoneNumber"
              placeholder="Type Phone Number"
              className="input input-accent w-full max-w-xs"
            />

            <div class="form-control w-full max-w-xs">
              <label class="label">
                <span class="label-text">
                  {paymentType === "In Shop"
                    ? "Purchase Date"
                    : "Delivery Date"}{" "}
                  :
                </span>
              </label>
              <input
                type="date"
                placeholder="Delivery Date "
                name="deliveryDate"
                class="input input-bordered input-success w-full max-w-xs"
              />
            </div>

            {paymentType !== "In Shop" && (
              <>
                {" "}
                <div className="label">
                  <span className="label-text"> Time Slot : </span>
                </div>
                <select
                  name="timeSlot"
                  className="select select-accent w-full max-w-xs"
                >
                  <option>9-12</option>
                  <option>12-14</option>
                  <option>14-16</option>
                  <option>16-18</option>
                  <option>18-20</option>
                  <option>19-21</option>
                </select>
              </>
            )}

            <div className="label">
              <span className="label-text"> Order Type : </span>
            </div>
            <select
              name="orderType"
              className="select select-accent w-full max-w-xs"
            >
              <option selected>Regular</option>
              <option>Pre-Order</option>
            </select>

            <div className="label">
              <span className="label-text"> Payment Type : </span>
            </div>
            <select
              required
              onChange={(e) => handlePaymentTypeAndStatus(e?.target?.value)}
              // onChange={(e) => setPaymentType(e?.target?.value)}
              name="paymentType"
              className="select select-accent w-full max-w-xs"
            >
              <option value="" disabled selected>
                Select Payment Type
              </option>
              <option value="Cash On Delivery">Cash On Delivery</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="In Shop">In Shop</option>
            </select>

            {paymentType === "Bank Transfer" && (
              <>
                <div>
                  <div className="label">
                    <span className="label-text"> Bank Name : </span>
                  </div>
                  <input
                    type="text"
                    name="bankName"
                    placeholder="Type Bank Name"
                    className="input input-accent w-full max-w-xs"
                  />
                </div>
                <div>
                  <div className="label">
                    <span className="label-text"> transaction Number : </span>
                  </div>
                  <input
                    type="text"
                    name="transactionNumber"
                    placeholder="Type transaction number"
                    className="input input-accent w-full max-w-xs"
                  />
                </div>
              </>
            )}

            {paymentType === "In Shop" && (
              <div>
                <div className="label">
                  <span className="label-text"> Payment Status : </span>
                </div>
                <select
                  required
                  name="paymentStatus"
                  className="select select-accent w-full max-w-xs"
                  onChange={(e) => setPaymentStatus(e?.target?.value)}
                >
                  <option value="" selected disabled>
                    Select Payment Status
                  </option>

                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>
            )}

            {paymentType !== "In Shop" && (
              <>
                <div className="label">
                  <span className="label-text">Track Id : </span>
                </div>
                <input
                  type="number"
                  name="trackId"
                  placeholder="Type Track Id Code"
                  className="input input-accent w-full max-w-xs"
                />
                <div className="label">
                  <span className="label-text">Social Media : </span>
                </div>
                <input
                  type="text"
                  name="socialMedia"
                  placeholder="Type Social Media Id if have"
                  className="input input-accent w-full max-w-xs"
                />

                <div className="label">
                  <span className="label-text"> Profile Link : </span>
                </div>
                <input
                  type="text"
                  name="profileLink"
                  placeholder="Type profile Link if have"
                  className="input input-accent w-full max-w-xs"
                />

                <div className="label">
                  <span className="label-text"> Shipping Fee : </span>
                </div>
                <input
                  type="number"
                  name="deliveryCost"
                  placeholder="Type Shipping Fee"
                  className="input input-accent w-full max-w-xs"
                />
              </>
            )}

            {/* Order Type - Regular Or Pre-Order */}

            {(paymentStatus === "Paid" || paymentStatus === "Unpaid") &&
            paymentType !== "Bank Transfer" &&
            paymentType !== "Cash On Delivery" ? (
              <>
                <label class="label">
                  <span class="label-text">Delivery Status</span>
                </label>

                <select
                  name="deliveryStatus"
                  required
                  class="select select-error w-full max-w-xs"
                >
                  {/* <option disabled selected>
                              Select Time Slot
                            </option> */}
                  {/* <option value="Created">Created</option> */}

                  {paymentStatus === "Paid" && (
                    <option value="Delivered" selected disabled>
                      Delivered
                    </option>
                  )}

                  {paymentStatus === "Unpaid" && (
                    <option value="Pending" selected disabled>
                      Pending
                    </option>
                  )}
                </select>
              </>
            ) : null}

            <div className="label">
              <span className="label-text"> In Total Amount : </span>
            </div>
            <input
              type="text"
              name="totalAmount"
              placeholder="Type Total Amount"
              className="input input-accent w-full max-w-xs"
            />
          </label>

          <div className="flex justify-center items-center mt-4">
            <button type="submit" className="btn btn-accent">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNewOrder;
