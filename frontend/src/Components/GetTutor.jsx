import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./GetTutor.css";
import cute from "../assets/cute.jpg";

function TutorCards() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
    subjectsTaught: "",
    qualifications: "",
    hourlyRate: "",
  });
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      const response = await fetch("http://localhost:8531/tutors/cards");
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
      subjectsTaught: "",
      qualifications: "",
      hourlyRate: "",
    });
    window.location.reload();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const navigate = useNavigate();

  const handleCardClick = (id) => {
    navigate(`/tutor-details/${id}`);
  };

  return (
    <div className="tutor-cards-container">
      <h1>Find the tutors that fit your needs</h1>
      <p className="tagline">
        Discover experienced tutors for personalized learning and book
        one-to-one online lessons to fit your schedule.
      </p>
      {error && <p className="error-message">{error}</p>}
      <div className="content-wrapper">
        <div className="tutor-cards">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="tutor-cards">
              {tutors.map((tutor) => (
                <div
                  key={tutor.id}
                  className="tutor-card"
                  onClick={() => handleCardClick(tutor.id)}
                  onMouseEnter={() => setHoveredCard(tutor.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="tutor-card-content">
                    <img src={cute} alt="Tutor" className="tutor-photo" />
                    <div className="tutor-details">
                      <h3>{tutor.name}</h3>
                      <p>Subjects Taught: {tutor.subjectsTaught.join(", ")}</p>
                      <p>Qualifications: {tutor.qualifications}</p>
                      {hoveredCard === tutor.id && (
                        <div className="hourly-rate-box">
                          <p>Hourly Rate: {tutor.hourlyRate}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="filter-panel">
          <h3>Filter</h3>
          <div className="filter-input">
            <label>Subjects Taught:</label>
            <input
              type="text"
              name="subjectsTaught"
              value={filters.subjectsTaught}
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

export default TutorCards;
