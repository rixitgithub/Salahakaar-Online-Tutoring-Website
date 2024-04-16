import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./SelTutor.css";

function SelTutor() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
    qualifications: "",
    hourlyRate: "",
  });
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const subject = queryParams.get("subject");

  useEffect(() => {
    fetchTutors();
  }, [subject]);

  const fetchTutors = async () => {
    try {
      const response = await fetch(
        `http://localhost:8531/seltutor?subject=${subject}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch tutors");
      }
      const data = await response.json();
      setTutors(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    try {
      const response = await fetch("http://localhost:8531/tutors/filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      });
      if (!response.ok) {
        throw new Error("Failed to apply filters");
      }
      const data = await response.json();
      setTutors(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      name: "",
      qualifications: "",
      hourlyRate: "",
    });
    fetchTutors(); // Reload tutors without filters
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  return (
    <div className="tutor-cards-container">
      <h2>Tutors for {subject}</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="content-wrapper">
        <div className="tutor-cards">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="tutor-cards">
              {tutors.map((tutor) => (
                <div key={tutor.id} className="tutor-card">
                  <h3>{tutor.name}</h3>
                  <p>Name: {tutor.name}</p>
                  <p>Subjects Taught: {tutor.subjectsTaught.join(", ")}</p>
                  <p>Qualifications: {tutor.qualifications}</p>
                  <p>Hourly Rate: {tutor.hourlyRate}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="filter-panel">
          <h3>Filter</h3>
          <div className="filter-input">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={filters.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="filter-input">
            <label>Qualifications:</label>
            <input
              type="text"
              name="qualifications"
              value={filters.qualifications}
              onChange={handleInputChange}
            />
          </div>
          <div className="filter-input">
            <label>Hourly Rate:</label>
            <input
              type="text"
              name="hourlyRate"
              value={filters.hourlyRate}
              onChange={handleInputChange}
            />
          </div>
          <button onClick={handleFilter}>Apply Filters</button>
          <button onClick={handleResetFilters}>Reset Filters</button>
        </div>
      </div>
    </div>
  );
}

export default SelTutor;
