import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./TutorDetails.css";

function TutorDetails() {
  const { tutorId } = useParams();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullBio, setShowFullBio] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    fetchTutorDetails();
  }, []);

  const fetchTutorDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:8531/tutor-details/${tutorId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch tutor details");
      }
      const data = await response.json();
      setTutor(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const toggleBio = () => {
    setShowFullBio(!showFullBio);
  };

  const sendMessage = async () => {
    console.log(localStorage.getItem("token"));
    try {
      const response = await fetch("http://localhost:8531/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you store the token in localStorage after login
        },
        body: JSON.stringify({
          sender: tutorId, // Assuming sender ID is the tutor's ID
          receiver: tutor.user, // Assuming receiver ID is the tutor's user ID
          content: messageContent,
        }),
      });
      console.log(tutor.user);
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      setMessageContent("");
      setMessageSent(true);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.detailsContainer}>
        {loading ? (
          <p style={styles.message}>Loading...</p>
        ) : error ? (
          <p style={styles.message}>Error: {error}</p>
        ) : (
          tutor && (
            <div className="divcontainer">
              {/* Existing tutor details UI */}
              <div className="left-container">
                <div className="upperdetails">
                  <img src="" alt="helllooooooo" className="profile-image" />
                  <div className="upperinfo">
                    <div className="name">
                      <h3>{tutor.name}</h3>
                    </div>
                    <div className="upperinfo1">
                      <div className="qualifications">
                        {tutor.qualifications}
                      </div>
                      <div className="location">{tutor.location}</div>
                    </div>
                  </div>
                  <div className="price">{tutor.hourlyRate}</div>
                </div>
                <div className="bio">
                  <h5>About me</h5>
                  {showFullBio ? tutor.bio : `${tutor.bio.slice(0, 100)}...`}
                  <button onClick={toggleBio}>
                    {showFullBio ? "Show Less" : "Show Full"}
                  </button>
                </div>
                <div className="socials">
                  <h5>My socials</h5>
                  <div className="links">
                    <div className="linkedin">{tutor.linkedinId}</div>
                    <div className="github">{tutor.githubAccount}</div>
                    <div className="number">+91-{tutor.phoneNumber}</div>
                  </div>
                </div>
                <div className="reviews">
                  <h5>My reviews</h5>
                  {tutor.reviews.length === 0 ? (
                    <p>No reviews yet</p>
                  ) : (
                    tutor.reviews.map((review, index) => (
                      <div key={index}>
                        <p>{review}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="subjects">
                  <h5>Subjects offered</h5>
                  <ul>
                    {tutor.subjectsTaught.map((subject, index) => (
                      <li key={index}>{subject}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="spacing"></div>
              {/* Message input */}
              <div className="right-container">
                <h4>Send a Message</h4>
                <textarea
                  placeholder="Type your message here..."
                  rows={4}
                  style={{ width: "100%", marginBottom: "10px" }}
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                ></textarea>
                <button style={{ width: "100%" }} onClick={sendMessage}>
                  Send Message
                </button>
                {messageSent && <p>Message sent successfully!</p>}
              </div>
            </div>
          )
        )}
      </div>
      <div style={styles.spacing}></div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
  },
  detailsContainer: {
    width: "90%",
    display: "inline-block",
    textAlign: "left",
    verticalAlign: "top",
  },
  spacing: {
    width: "50px", // Adjust as needed
    display: "inline-block",
  },
  message: {
    fontSize: "18px",
    color: "red",
  },
};

export default TutorDetails;
