import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const RoomPage = () => {
  const { roomCode } = useParams();
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Make a request to your backend to fetch the user details
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8531/userdetails", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = await response.json();
        console.log({ userData });
        // Set the userId and userName from the fetched data
        console.log(userData.userId);
        setUserId(userData.userId);
        setUserName(userData.username);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserData();
  }, []);

  const myMeeting = async (element) => {
    const appID = 1760435792;
    const serverSecret = "dc34312ab6b49b5a843935e577bfbfc2";
    // Generate the kit token using the fetched userId and userName
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomCode,
      userId,
      userName
    );
    const zc = ZegoUIKitPrebuilt.create(kitToken);
    zc.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "Copy Link",
          url: `http://localhost:3001/room/${roomCode}`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
    });
  };

  return <div ref={myMeeting}></div>;
};

export default RoomPage;
