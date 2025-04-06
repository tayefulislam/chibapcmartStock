import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Shared/Header/Header";
import Status from "../Admin/Status/Status";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-2">
      <Header></Header>

      {/* <div className="flex justify-center items-center mt-12">
        <div
          onClick={() => navigate("/recentRequests")}
          class="card w-96 bg-red-500 shadow-xl text-white"
        >
          <figure class="px-10 pt-10">
            <i class="fa-solid fa-users-between-lines"></i>
          </figure>
          <div class="card-body items-center text-center">
            <h2 class="card-title">Recent Requests</h2>
          </div>
        </div>
          </div> */}

      <Status></Status>
    </div>
  );
};

export default Home;
