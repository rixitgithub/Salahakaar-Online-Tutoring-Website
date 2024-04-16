import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Inbox.css";

const Inbox = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [usernames, setUsernames] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const [isTutor, setIsTutor] = useState(false);
  const [showcreateOfferPopup, setShowCreateOfferPopup] = useState(false);
  const [showcreateMeetingrPopup, setShowCreateMeetingPopup] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [uniqueCode, setUniqueCode] = useState("");
  const [price, setPrice] = useState("");
  const [numberOfSessions, setNumberOfSessions] = useState("");
  const [description, setDescription] = useState("");
  const [offers, setOffers] = useState([]);
  const navigate = useNavigate();

  const [roomCode, setRoomCode] = useState("");

  const handleEnterRoom = useCallback(() => {
    navigate(`/room/${roomCode}`);
  }, [navigate, roomCode]);

  useEffect(() => {
    fetchUsernames();
    checkIfTutor();
  }, []);

  useEffect(() => {
    if (selectedUser !== null) {
      fetchConversation(usernames[selectedUser].id);
      fetchOffers(usernames[selectedUser].id);
    }
  }, [selectedUser]);

  const fetchUsernames = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8531/inbox/usernames", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUsernames(data.users);
    } catch (error) {
      console.error("Error fetching usernames:", error);
    }
  };

  const fetchConversation = async (selectedUserId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8531/inbox/conversation/${selectedUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setConversation(data.messages);
    } catch (error) {
      console.error("Error fetching conversation:", error);
    }
  };

  const fetchOffers = async (selectedUserId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8531/offers/${selectedUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setOffers(data.offers);
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  const checkIfTutor = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8531/check-user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setIsTutor(data.isTutor);
    } catch (error) {
      console.error("Error checking if user is a tutor:", error);
    }
  };

  const handleUsernameClick = async (userId, index) => {
    setSelectedUser(index);
  };

  const sendMessage = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8531/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sender: localStorage.getItem("userId"),
          receiver: usernames[selectedUser].id,
          content: messageContent,
        }),
      });
      const data = await response.json();
      setMessageContent("");
      const queryParams = new URLSearchParams({
        userId: usernames[selectedUser].id,
      });
      window.history.replaceState(
        null,
        null,
        `${window.location.pathname}?${queryParams}`
      );
      window.location.reload();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleCreateOffer = () => {
    setShowCreateOfferPopup(true);
    setUniqueCode(generateUniqueCode());
  };

  const handleCreateMeeting = () => {
    setShowCreateMeetingPopup(true);
    setUniqueCode(generateUniqueCode());
  };

  const handleClosePopup = () => {
    setShowCreateOfferPopup(false);
    setShowCreateMeetingPopup(false);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleOffer = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8531/create-offer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uniqueCode: uniqueCode,
          student: usernames[selectedUser].id,
          description: description,
          type: selectedOption,
          numberOfSessions:
            selectedOption === "multiple" ? numberOfSessions : null,
          price: price,
        }),
      });
      const data = await response.json();
      setShowCreateOfferPopup(false);
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  };

  const generateUniqueCode = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  return (
    <div className="inbox-container">
      <div className="user-list">
        <h2>Users</h2>
        {usernames.map((user, index) => (
          <div
            key={index}
            className={`user ${selectedUser === index ? "active" : ""}`}
            onClick={() => handleUsernameClick(user.id, index)}
          >
            <Link to={`/inbox/${user.id}`}>{user.username}</Link>
          </div>
        ))}
      </div>
      <div className="conversation">
        <h2>Conversation</h2>
        {conversation.map((message, index) => (
          <div key={index} className="message">
            <div className="sender">{message.sender}</div>
            <div className="content">{message.content}</div>
            <div className="timestamp">{message.timestamp}</div>
          </div>
        ))}
        <input
          type="text"
          placeholder="Type your message here"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
        {isTutor && (
          <>
            <button onClick={handleCreateMeeting}>Create Meeting</button>
            <button onClick={handleCreateOffer}>Create Offer</button>
          </>
        )}
      </div>
      {!isTutor && (
        <div className="enter-room">
          <input
            type="text"
            placeholder="Enter room code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />
          <button onClick={handleEnterRoom}>Enter Room</button>
        </div>
      )}

      {showcreateMeetingrPopup && (
        <div className="popup-overlay" onClick={handleClosePopup}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={handleClosePopup}>
              &times;
            </span>
            <div className="popup-content">
              <h2>Create Meeting</h2>
              {/* Content of the popup */}
              {/* Add your content for creating a meeting here */}
            </div>
          </div>
        </div>
      )}

      {showcreateOfferPopup && (
        <div className="popup-overlay" onClick={handleClosePopup}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={handleClosePopup}>
              &times;
            </span>
            <div className="popup-content">
              <h2>#{uniqueCode}</h2>
              <div>
                <button
                  className={selectedOption === "single" ? "selected" : ""}
                  onClick={() => handleOptionSelect("single")}
                >
                  Single Lesson
                </button>
                <button
                  className={selectedOption === "multiple" ? "selected" : ""}
                  onClick={() => handleOptionSelect("multiple")}
                >
                  Multiple Lessons
                </button>
              </div>
              <textarea
                placeholder="Description about the service"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              {selectedOption === "single" && (
                <div>
                  <label>Price:</label>
                  <input
                    type="number"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
              )}
              {selectedOption === "multiple" && (
                <div>
                  <label>Number of Sessions:</label>
                  <input
                    type="number"
                    placeholder="Enter number of sessions"
                    value={numberOfSessions}
                    onChange={(e) => setNumberOfSessions(e.target.value)}
                    required
                  />
                  <label>Price:</label>
                  <input
                    type="number"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
              )}
              <button onClick={handleOffer}>Offer</button>
            </div>
          </div>
        </div>
      )}
      <div className="offers">
        <h2>Offers</h2>
        {offers.map((offer, index) => (
          <div key={index} className="offer">
            <div>Description: {offer.description}</div>
            <div>Type: {offer.type}</div>
            <div>Price: {offer.price}</div>
            {offer.numberOfSessions && (
              <div>Number of Sessions: {offer.numberOfSessions}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inbox;
