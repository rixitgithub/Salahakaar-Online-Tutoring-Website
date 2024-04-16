import React from "react";
import { useNavigate } from "react-router-dom";
import "./Performance1.css";

function Performance1() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/tutor");
  };
  return (
    <>
      <div className="banner">
        <h2>
          Book a free meet with a tutor and see how beautiful and smooth your
          academic transformation can be!
        </h2>
        <button onClick={handleClick}>CONNECT NOW</button>
      </div>
    </>
  );
}

export default Performance1;
