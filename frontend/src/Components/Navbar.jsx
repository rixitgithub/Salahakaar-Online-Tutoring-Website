import React, { useState, useEffect } from "react";
import "./Navbar.css";
import logo from "./logo.png";
import { Link } from "react-router-dom";
import { FaInbox } from "react-icons/fa"; // Import the inbox icon from react-icons/fa

function Navbar() {
  // State to hold the user's authentication status and username
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isTutor, setIsTutor] = useState(false); // New state to track if the user is a tutor

  // useEffect to check if user is logged in and set the username
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // User is logged in
      setIsLoggedIn(true);
      // Fetch user data to get username
      fetch("http://localhost:8531/auth/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUsername(data.username);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    } else {
      // User is not logged in
      setIsLoggedIn(false);
      setUsername("");
    }
  }, []); // Run once on component mount

  // useEffect to check if user is a tutor
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Fetch tutor status
      fetch("http://localhost:8531/check-user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setIsTutor(data.isTutor);
        })
        .catch((error) => {
          console.error("Error fetching tutor status:", error);
        });
    }
  }, []); // Run once on component mount

  // Function to handle logout
  const handleLogout = () => {
    // Clear token from local storage
    localStorage.removeItem("token");
    // Update authentication status
    setIsLoggedIn(false);
    setUsername("");
    // Reload the page
    window.location.reload();
  };

  return (
    <div className="hero">
      <nav className="navbar">
        <div className="left">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
        </div>
        <div className="center">
          <ul className="nav-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="#About">About</Link>
            </li>
            {!isTutor && (
              <li>
                <Link to="/tutors">Become a Tutor</Link>
              </li>
            )}
            {isTutor && (
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
            )}
            <li>
              <Link to="#Testimonials">Testimonials</Link>
            </li>
            <li>
              <Link to="/Forum">Forum</Link>
            </li>
            <li>
              <Link to="#ContactUs">Contact Us</Link>
            </li>
          </ul>
        </div>
        <div className="right">
          {!isLoggedIn ? (
            <Link to="/login" className="btn login-btn">
              LOGIN
            </Link>
          ) : (
            <>
              <span className="username">Welcome, {username}</span>
              <Link to="/inbox" className="inbox-icon">
                {" "}
                {/* Add Link to inbox */}
                <FaInbox className="inbox-icon" /> {/* Render inbox icon */}
              </Link>
              <button className="btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
