import React from "react";
import "./Performance.css";

function Performance() {
  return (
    <>
      <div className="banner">
        <div className="banner-text">
          <h2>Our Performance</h2>
        </div>
        <div className="banner-stats teach">
          <p className="stat-head">Teachers</p>
          <h2 className="stats">50</h2>
        </div>
        <div className="banner-stats stud">
          <p className="stat-head">Students</p>
          <h2 className="stats">100</h2>
        </div>
        <div className="banner-stats ment">
          <p className="stat-head">Mentorship</p>
          <h2 className="stats">1000+</h2>
        </div>
        <div className="resp-text">
          <h1>Guided 1000+ students!!!</h1>
        </div>
      </div>
    </>
  );
}

export default Performance;
