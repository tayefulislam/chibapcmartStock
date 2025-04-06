import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="">
        <div className="flex justify-between mx-3 my-5">
          <h1 className="text-3xl font-serif px-3">Chiba PC Mart</h1>
          <svg
            onClick={() => navigate("/createNewOrder")}
            xmlns="http://www.w3.org/2000/svg"
            height="40px"
            viewBox="0 -960 960 960"
            width="40px"
            fill="#FFFFFF"
            className="bg-green-500 rounded-full"
          >
            <path d="M450-450H200v-60h250v-250h60v250h250v60H510v250h-60v-250Z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Header;
