import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const OrderDetails = () => {
  let updateState = true;

  // console.log("1st Update State", updateState);
  let [paymentType, setPaymentType] = React.useState();
  let [paymentStatus, setPaymentStatus] = React.useState();
  let [deliveryStatus, setDeliveryStatus] = React.useState();
  // let [deliveryDatePrevious, setDeliveryDatePrevious] = React.useState();

  const { orderId } = useParams();

  // api url  to GET ALL ORDER DETAILS
  let url = `${process.env.REACT_APP_apiLink}/api/v1/orders/getSingleOrderWithCustomerPaymentDetails/${orderId}`;
  //   console.log(url);

  // GET ALL ORDER DETAILS
  const { isPending, error, data, refetch } = useQuery({
    queryKey: [`getSingleOrderWithCustomerPaymentDetails/${orderId}`],
    queryFn: () => fetch(url).then((res) => res.json()),
  });

  console.log(data);

  // handle loading
  if (isPending)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex  w-52 flex-col gap-4">
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
      </div>
    );

  // handle error
  if (error) return <h1>{error.message}</h1>;

  // setPaymentStatus(data?.paymentObjId?.paymentStatus);
  // setPaymentType(data?.paymentObjId?.paymentType);

  const handlePaymentTypeAndStatus = (type, status) => {
    if (type === "Cash On Delivery") {
      setPaymentType("Cash On Delivery");
      setPaymentStatus("Unpaid");
    }

    if (type === "Bank Transfer") {
      setPaymentType("Bank Transfer");
      setPaymentStatus("Paid");
    }

    if (type === "In Shop") {
      setPaymentType("In Shop");
      // setPaymentStatus("");

      // setPaymentStatus === "" ? setPaymentStatus("Paid") : null;

      if (status) {
        setPaymentStatus(status);
      }
    }
  };

  const handleDeliveryStatus = (status) => {
    setDeliveryStatus(status);
  };

  if (updateState) {
    updateState = false;
  }

  // console.log("1st Update State", updateState);

  const handleUpdate = (e) => {
    e.preventDefault();

    const customerName = e.target?.customerName?.value;
    const itemsDetails = e.target?.itemsDetails?.value;
    const address = e.target?.address?.value;
    const postalCode = e.target?.postalCode?.value;
    const phoneNumber = e.target?.phoneNumber?.value;
    const deliveryDate = e.target?.deliveryDate?.value;
    const timeSlot = e.target?.timeSlot?.value;
    const orderType = e.target?.orderType?.value;
    const totalAmount = e.target?.totalAmount?.value;

    const trackId = e.target?.trackId?.value;
    const bankName = e.target?.bankName?.value;
    const transactionNumber = e.target?.transactionNumber?.value;
    const deliveryCost = e.target?.deliveryCost?.value;
    let deliveryStatus = e.target?.deliveryStatus?.value;
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
      customerId: data?.customerId?._id,
      orderId: data?._id,
      paymentObjId: data?.paymentObjId?._id,
      customerDetails: {
        customerName: customerName,
        address,
        postalCode,

        phoneNumber,
        socialMedia,
        profileLink,
      },
      orderDetails: {
        itemsDetails: [
          {
            itemName: itemsDetails,
          },
        ],
        totalAmount,
        deliveryCost,
        deliveryDate: new Date(deliveryDate),
        timeSlot,
        orderType,
        deliveryStatus,
        orderPostalCode: postalCode,
        searchKeyWord: searchKeyWord.replace(/\s+/g, " ").trim(),
      },
      paymentDetails: {
        paymentType,

        paymentStatus,
        paymentAmount: totalAmount,
        transactionNumber,
        trackId,
        bankName,
      },
    };

    const url = `${process.env.REACT_APP_apiLink}/api/v1/orders/updateOrderDetails`;

    axios
      .put(url, customerAndOrderDetails)
      .then(function (response) {
        console.log(response);

        if (response?.status === 200) {
          const closeButton = document.getElementById("closeButton");
          closeButton.click();
          refetch();
        }

        if (response?.status === 400) {
          alert("Order Created Failed");
        }
      })
      .catch(function (error) {
        console.log(error);
      });

    console.log(customerAndOrderDetails);
  };

  // console.log("paymentType", paymentType);

  // console.log("paymentStatus", paymentStatus);

  return (
    <>
      <div className="mx-2">
        <div>
          <div className="flex justify-between mt-2  text-2xl">
            <p className="font-semibold">{data?.customerId?.customerName}</p>
            <p className="font-extrabold">¥{data?.totalAmount}</p>
          </div>
          <div className="flex justify-between">
            <p>Order : {data?.orderId}</p>

            {data?.deliveryStatus === "Pending" ? (
              <div className="badge badge-secondary">Pending</div>
            ) : null}

            {data?.deliveryStatus === "Delivered" ? (
              <div className="badge badge-success text-neutral-50">
                Delivered
              </div>
            ) : null}

            {data?.deliveryStatus === "Redelivery Done" ? (
              <div className="badge badge-accent text-neutral-50">
                Redelivery Done
              </div>
            ) : null}

            {data?.deliveryStatus === "Returned" ? (
              <div className="badge badge-error text-neutral-50">Returned</div>
            ) : null}

            {data?.deliveryStatus === "Out for delivery" ? (
              <div className="badge badge-warning text-neutral-50">
                Out for delivery
              </div>
            ) : null}

            {data?.deliveryStatus === "Returning Back" ? (
              <div className="badge badge-error text-neutral-50">
                Returning Back
              </div>
            ) : null}

            {data?.deliveryStatus === "Absence" ? (
              <div className="badge badge-error text-neutral-50">Absence</div>
            ) : null}
            {data?.deliveryStatus === "Cancelled" ? (
              <div className="badge badge-error text-neutral-50">Cancelled</div>
            ) : null}

            {data?.deliveryStatus === "Reached Post Office" ? (
              <div className="badge badge-info text-neutral-50">
                Reached Post Office
              </div>
            ) : null}

            {data?.deliveryStatus === "En route" ? (
              <div className="badge badge-info text-neutral-50">En route</div>
            ) : null}

            {data?.deliveryStatus === "Post Office Drop" ? (
              <div className="badge badge-info text-neutral-50">
                Post Office Drop
              </div>
            ) : null}

            {data?.deliveryStatus === "Investigation" ? (
              <div className="badge badge-error text-neutral-50">
                Investigation
              </div>
            ) : null}

            {data?.deliveryStatus === "Created" ? (
              <div className="badge badge-info text-neutral-50">Created</div>
            ) : null}

            {data?.deliveryStatus === "Fraud" ? (
              <div className="badge badge-info text-neutral-50">Fraud</div>
            ) : null}

            {data?.deliveryStatus === "On Hold" ? (
              <div className="badge badge-info text-neutral-50">On Hold</div>
            ) : null}

            {data?.deliveryStatus === "Sended" ? (
              <div className="badge badge-info text-neutral-50">Sended</div>
            ) : null}
          </div>

          <div className="font-semibold">
            <div>
              {data?.customerId?.postalCode ? (
                <div>
                  <p>〒 {data?.customerId?.postalCode}</p>
                </div>
              ) : null}
            </div>

            <div>
              {data?.customerId?.address ? (
                <div>
                  <p>{data?.customerId?.address}</p>
                </div>
              ) : null}
              {data?.customerId?.phoneNumber ? (
                <div>
                  <p>{data?.customerId?.phoneNumber} </p>
                </div>
              ) : null}
            </div>
            {data?.deliveryDate ? (
              <div>
                <p className="flex">
                  {!data?.timeSlot
                    ? "Purchase Date"
                    : data?.deliveryStatus === "Delivered"
                    ? "Received Date"
                    : "Delivery Date"}{" "}
                  : <h1> {new Date(data?.deliveryDate).toDateString()}</h1>
                  {data?.timeSlot &&
                    ` | Time : ${
                      data?.deliveryStatus === "Delivered"
                        ? new Date(data?.deliveryDate)
                            .toTimeString()
                            .slice(0, 5)
                        : data?.timeSlot
                    }`}
                  {/* {
                    data?.deliveryStatus === "Delivered" ? new Date(data?.deliveryDate).toDateString() : data?.timeSlot
                  } */}
                </p>
              </div>
            ) : null}
          </div>

          <div className="border-t-4 border-blue-500 my-4"></div>

          <div>
            <p className="text-xl font-semibold">Items : </p>

            {data?.itemsDetails?.map((item, key) => (
              <div className="font-semibold" key={key}>
                {/* <p>
            {key + 1} : {item?.itemName}
              </p> */}

                <p>{item?.itemName}</p>
              </div>
            ))}
          </div>

          <div className="border-t-4 border-blue-500 my-4"></div>

          <div>
            <p className="text-xl font-semibold">Payment Details</p>

            {data?.paymentObjId?.paymentType ? (
              <p>Payment Type : {data?.paymentObjId?.paymentType}</p>
            ) : null}
            {data?.paymentObjId?.courierName ? (
              <p>Courier Name: {data?.paymentObjId?.courierName}</p>
            ) : null}
            {data?.paymentObjId?.trackId ? (
              <p>
                Track Id : {data?.paymentObjId?.trackId}|{" "}
                <Link
                  key={data?._id}
                  to={`https://trackings.post.japanpost.jp/services/srv/search/direct?reqCodeNo1=${data?.paymentObjId?.trackId}&searchKind=S002&locale=en`}
                >
                  WEB
                </Link>
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Update Order Details */}

      <div className="flex justify-center mt-2">
        <label
          onClick={() =>
            handlePaymentTypeAndStatus(
              data?.paymentObjId?.paymentType,
              data?.paymentObjId?.paymentStatus
            )
          }
          htmlFor="my_modal_6"
          className="btn items-center"
        >
          Update Details
        </label>
      </div>

      <div>
        {/* The button to open modal */}

        {/* Put this part before </body> tag */}
        <input type="checkbox" id="my_modal_6" className="modal-toggle" />
        <div className="modal " role="dialog">
          <div className="modal-box">
            <h3 className="text-lg font-bold">
              {data?.orderId} | {data?.customerId?.customerName}
            </h3>

            <div className="">
              <div className="flex justify-center items-center">
                <div className="card w-full">
                  <h1 className="text-center text-2xl font-bold">
                    Update Profile
                  </h1>

                  <div className="flex justify-center ">
                    {/* <form onSubmit={updateProfile}> */}
                    <form onSubmit={handleUpdate}>
                      <div class="form-control w-full max-w-xs">
                        <label class="label">
                          <span class="label-text"> CustomerName :</span>
                        </label>
                        <input
                          type="text"
                          required
                          defaultValue={data?.customerId?.customerName}
                          placeholder="Customer Name"
                          name="customerName"
                          class="input input-bordered input-error w-full max-w-xs"
                        />
                        <label class="label"></label>
                      </div>

                      <div className="label">
                        <span className="label-text">Items Details : </span>
                      </div>
                      <textarea
                        type="text"
                        name="itemsDetails"
                        defaultValue={data?.itemsDetails[0]?.itemName}
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
                        defaultValue={data?.customerId?.address}
                        className="textarea textarea-accent w-full max-w-xs"
                      />

                      <div className="label">
                        <span className="label-text"> Postal Code : </span>
                      </div>
                      <input
                        type="text"
                        name="postalCode"
                        placeholder="Type Postal Code ( 123-4533 )"
                        defaultValue={data?.customerId?.postalCode}
                        className="input input-accent w-full max-w-xs"
                      />

                      <div class="form-control w-full max-w-xs">
                        <label class="label">
                          <span class="label-text">
                            {paymentType === "In Shop"
                              ? "Purchase Date"
                              : "Delivery Date"}{" "}
                            : :
                          </span>
                        </label>
                        <input
                          type="date"
                          placeholder="Delivery Date "
                          name="deliveryDate"
                          defaultValue={
                            new Date(data?.deliveryDate)
                              .toISOString()
                              .split("T")[0]
                          }
                          class="input input-bordered input-success w-full max-w-xs"
                        />
                      </div>

                      <div class="form-control w-full max-w-xs">
                        <label class="label">
                          <span class="label-text">Phone Number:</span>
                        </label>
                        <input
                          type={"text"}
                          defaultValue={data?.customerId?.phoneNumber}
                          name="phoneNumber"
                          class="input input-bordered input-error w-full max-w-xs"
                        />
                        <label class="label"></label>
                      </div>

                      <div class="form-control w-full max-w-xs">
                        {/* Time Slot */}

                        {paymentType !== "In Shop" && (
                          <>
                            <label class="label">
                              <span class="label-text">Time Slot</span>
                            </label>

                            <select
                              name="timeSlot"
                              required
                              class="select select-error w-full max-w-xs"
                            >
                              {/* <option disabled selected>
                                Select Time Slot
                              </option> */}
                              <option
                                value="9-12"
                                selected={data?.timeSlot === "9-12"}
                              >
                                9-12
                              </option>
                              <option
                                value="12-14"
                                selected={data?.timeSlot === "12-14"}
                              >
                                12-2
                              </option>
                              <option
                                value="14-16"
                                selected={data?.timeSlot === "14-16"}
                              >
                                14-16
                              </option>
                              <option
                                value="16-18"
                                selected={data?.timeSlot === "16-18"}
                              >
                                16-18
                              </option>

                              <option
                                value="18-20"
                                selected={data?.timeSlot === "18-20"}
                              >
                                18-20
                              </option>
                              <option
                                value="19-21"
                                selected={data?.timeSlot === "19-21"}
                              >
                                19-21
                              </option>
                            </select>
                          </>
                        )}

                        {/* Order Type - Regular Or Pre-Order */}

                        <label class="label">
                          <span class="label-text">Order Type</span>
                        </label>

                        {data?.orderType && (
                          <select
                            name="orderType"
                            required
                            class="select select-error w-full max-w-xs"
                          >
                            {/* <option disabled selected>
                              Select Time Slot
                            </option> */}
                            <option
                              value="Regular"
                              selected={data?.orderType === "Regular"}
                            >
                              Regular
                            </option>
                            <option
                              value="Pre-Order"
                              selected={data?.orderType === "Pre-Order"}
                            >
                              Pre-Order
                            </option>
                          </select>
                        )}

                        <div className="label">
                          <span className="label-text"> Payment Type : </span>
                        </div>
                        <select
                          required
                          onChange={(e) =>
                            handlePaymentTypeAndStatus(
                              e?.target?.value,
                              data.paymentObjId.paymentStatus
                            )
                          }
                          name="paymentType"
                          className="select select-accent w-full max-w-xs"
                        >
                          <option
                            value="Cash On Delivery"
                            selected={paymentType === "Cash On Delivery"}
                          >
                            Cash On Delivery
                          </option>
                          <option
                            value="Bank Transfer"
                            selected={paymentType === "Bank Transfer"}
                          >
                            Bank Transfer
                          </option>
                          <option
                            value="In Shop"
                            selected={paymentType === "In Shop"}
                          >
                            In Shop
                          </option>
                        </select>

                        {paymentType === "Bank Transfer" && (
                          <>
                            <div>
                              <div className="label">
                                <span className="label-text">
                                  {" "}
                                  Bank Name :{" "}
                                </span>
                              </div>
                              <input
                                type="text"
                                name="bankName"
                                placeholder="Type Bank Name"
                                defaultValue={data?.paymentObjId?.bankName}
                                className="input input-accent w-full max-w-xs"
                              />
                            </div>
                            <div>
                              <div className="label">
                                <span className="label-text">
                                  {" "}
                                  transaction Number :{" "}
                                </span>
                              </div>
                              <input
                                type="text"
                                name="transactionNumber"
                                defaultValue={
                                  data?.paymentObjId?.transactionNumber
                                }
                                placeholder="Type transaction number"
                                className="input input-accent w-full max-w-xs"
                              />
                            </div>
                          </>
                        )}

                        {paymentType === "In Shop" && (
                          <div>
                            <div className="label">
                              <span className="label-text">
                                {" "}
                                Payment Status :{" "}
                              </span>
                            </div>
                            <select
                              required
                              name="paymentStatus"
                              className="select select-accent w-full max-w-xs"
                              defaultValue={paymentStatus}
                              onChange={(e) =>
                                setPaymentStatus(e?.target?.value)
                              }
                            >
                              <option
                                value="Paid"
                                selected={paymentStatus === "Paid"}
                              >
                                Paid
                              </option>
                              <option
                                value="Unpaid"
                                selected={paymentStatus === "Unpaid"}
                              >
                                Unpaid
                              </option>
                            </select>
                          </div>
                        )}

                        {}

                        {paymentType !== "In Shop" && (
                          <>
                            <div className="label">
                              <span className="label-text">Track Id : </span>
                            </div>
                            <input
                              type="number"
                              name="trackId"
                              placeholder="Type Track Id Code"
                              defaultValue={data?.paymentObjId?.trackId}
                              className="input input-accent w-full max-w-xs"
                            />
                            <div className="label">
                              <span className="label-text">
                                Social Media :{" "}
                              </span>
                            </div>
                            <input
                              type="text"
                              name="socialMedia"
                              placeholder="Type SocialMedia Id if have"
                              defaultValue={data?.customerId?.socialMedia}
                              className="input input-accent w-full max-w-xs"
                            />
                            <div className="label">
                              <span className="label-text">
                                {" "}
                                Profile Link :{" "}
                              </span>
                            </div>
                            <input
                              type="text"
                              name="profileLink"
                              placeholder="Type profile Link if have"
                              defaultValue={data?.customerId?.profileLink}
                              className="input input-accent w-full max-w-xs"
                            />
                            <div className="label">
                              <span className="label-text">
                                {" "}
                                Shipping Fee :{" "}
                              </span>
                            </div>
                            <input
                              type="number"
                              name="deliveryCost"
                              placeholder="Type Shipping Fee"
                              defaultValue={data?.deliveryCost}
                              className="input input-accent w-full max-w-xs"
                            />{" "}
                          </>
                        )}

                        <>
                          <label class="label">
                            <span class="label-text">Delivery Status</span>
                          </label>

                          {data?.deliveryStatus && (
                            <select
                              name="deliveryStatus"
                              required
                              defaultValue={data?.deliveryStatus}
                              class="select select-error w-full max-w-xs"
                            >
                              {/* <option disabled selected>
                                Select Time Slot
                              </option> */}

                              <option
                                value="Redelivery Done"
                                selected={
                                  data?.deliveryStatus === "Redelivery Done"
                                }
                              >
                                Redelivery Done
                              </option>
                              <option
                                value="Reached Post Office"
                                selected={
                                  data?.deliveryStatus === "Reached Post Office"
                                }
                              >
                                Reached Post Office
                              </option>

                              <option
                                value="Out for delivery"
                                selected={
                                  data?.deliveryStatus === "Out for delivery"
                                }
                              >
                                Out for delivery
                              </option>

                              <option
                                value="En route"
                                selected={data?.deliveryStatus === "En route"}
                              >
                                En route
                              </option>

                              <option
                                value="Posting/Collection"
                                selected={
                                  data?.deliveryStatus === "Posting/Collection"
                                }
                              >
                                Posting/Collection
                              </option>
                              <option
                                value="Investigation"
                                selected={
                                  data?.deliveryStatus === "Investigation"
                                }
                              >
                                Investigation
                              </option>
                              <option
                                value="Returned"
                                selected={data?.deliveryStatus === "Returned"}
                              >
                                Returned
                              </option>

                              <option
                                value="Delivered"
                                selected={data?.deliveryStatus === "Delivered"}
                              >
                                Delivered
                              </option>
                              <option
                                value="Cancelled"
                                selected={data?.deliveryStatus === "Cancelled"}
                              >
                                Cancelled
                              </option>
                              <option
                                value="Sended"
                                selected={data?.deliveryStatus === "Sended"}
                              >
                                Sended
                              </option>
                              <option
                                value="Absence"
                                selected={data?.deliveryStatus === "Absence"}
                              >
                                Absence
                              </option>

                              <option
                                value="Pending"
                                selected={data?.deliveryStatus === "Pending"}
                              >
                                Pending
                              </option>

                              <option
                                value="On Hold"
                                selected={data?.deliveryStatus === "On Hold"}
                              >
                                On Hold
                              </option>

                              <option
                                value="Fraud"
                                selected={data?.deliveryStatus === "Fraud"}
                              >
                                Fraud
                              </option>

                              <option
                                value="Created"
                                selected={data?.deliveryStatus === "Created"}
                              >
                                Created
                              </option>
                            </select>
                          )}
                        </>

                        <div className="label">
                          <span className="label-text"> Total : </span>
                        </div>
                        <input
                          type="number"
                          name="totalAmount"
                          placeholder="Type Shipping Fee"
                          defaultValue={data?.totalAmount}
                          className="input input-accent w-full max-w-xs"
                        />
                      </div>

                      <div className="flex justify-around mt-2">
                        <input className="btn" type="submit" value="Submit" />
                        <label
                          id="closeButton"
                          htmlFor="my_modal_6"
                          className="btn"
                        >
                          Close!
                        </label>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
