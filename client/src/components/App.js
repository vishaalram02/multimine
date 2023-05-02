import React, { useState, useEffect } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";
import NavBar from "./modules/NavBar.js";
import Profile from "./pages/Profile.js";
import Leaderboard from "./pages/Leaderboard.js";
import Howtoplay from "./pages/Howtoplay.js";
import PlayRoom from "./pages/PlayRoom.js";
import jwt_decode from "jwt-decode";

import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

/**
 * Define the "App" component
 */
const App = () => {
  const [userId, setUserId] = useState(undefined);
  const [userName, setUserName] = useState(undefined);
  const [roomList, setRoomList] = useState([]); // initializes a list of rooms
  const [reload, setReload] = useState(0);
  
  useEffect(() => {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        setUserId(user._id);
        setUserName(user.name);
      }
    });
  }, []);

  const handleLogin = (res) => { //changed from original
    const userToken = res.credential;
    const decodedCredential = jwt_decode(userToken)

    console.log(`Logged in as ${decodedCredential.name}`);
    post("/api/login", { token: userToken }).then((user) => {
      // the server knows we're logged in now
      setUserId(user._id);
      setUserName(user.name);
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  const handleLogout = () => { //changed from original
    console.log("Logged out successfully!");
    setUserId(null);
    setUserName(null);
    const body = {usersocket: socket.id};
    post("/api/logout", body);
  };

  useEffect(() => { // gets the Room ID's from the API
    get("/api/room").then((roomObjs) => {
      let reversedRoomObjs = roomObjs.reverse();
      setRoomList(reversedRoomObjs);
    });
    console.log("finding room list");
  }, [reload]);

  
  const disconnectCallback = () => {
    handleLogout();
  };

  useEffect(() => {
    socket.on("userDisconnect", disconnectCallback);
    return () => {
      socket.off("userDisconnect", disconnectCallback);
    };
  }, []);


  const activeRoomCallback = (data) => {
    setRoomList([data].concat(roomList));
  };
  useEffect(() => { // socket updates rooms when rooms are created
    socket.on("activeRoom", activeRoomCallback);
    return () => {
      socket.off("activeRoom", activeRoomCallback);
    };
  }, [roomList]);

  const removeRoomCallback = (roomid) => {
    let newRoomList = [...roomList];
    let index = 0;
    for(let i=0;i<roomList.length;++i){
      if(roomList[i]._id === roomid){
        index = i;
      }
    }
    newRoomList.splice(index,1);
    setRoomList(newRoomList);
  };
  useEffect(() => { // socket updates rooms when rooms are created
    socket.on("removeRoom", removeRoomCallback);
    return () => {
      socket.off("removeRoom", removeRoomCallback);
    };
  }, [roomList]);

  const startstatusCallback = (roomid) => {
    let newRoomList = [...roomList];
    let index = 0;
    for(let i=0;i<roomList.length;++i){
      if(roomList[i]._id === roomid){
        index = i;
      }
    }
    newRoomList[index].status = "ongoing";
    setRoomList(newRoomList);
  };

  useEffect(() => { 
    socket.on("startstatus", startstatusCallback);
    return () => {
      socket.off("startstatus", startstatusCallback);
    };
  }, [roomList]);


  const addNewRoom = (roomObj) => { // function for adding a room, this gets passed all the way down though
    setRoomList([roomObj].concat(roomList));
  };

  const refresh = () => {
    setReload(reload+1);
    console.log(`refreshing`);
  };

  const roomsList = roomList.map((roomObj) => ( // Creates the list of rooms that we can put into our router
    <PlayRoom
      path={"/room/" + roomObj._id}
      _id={roomObj._id}
      name={roomObj.name}
      isPrivate = {roomObj.isPrivate}
      boardSize={roomObj.boardSize}
      key="{roomObj._id}"
      userId={userId}
      userName={userName}
      refresh={refresh}/>
  ));

  return (
    < >    
      <Router> 
        <Skeleton 
          path="/"
          roomList = {roomList}
          addNewRoom={addNewRoom}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          userId={userId}
          userName={userName}/>
        <Profile
          path="/profile/:userId"
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          userId={userId}
          userName={userName}/>
        <Leaderboard path="/leaderboard/"
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          userId={userId}
          userName={userName}/>
        <Howtoplay path="/howtoplay/"
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          userId={userId}
          userName={userName}/>
        <NotFound default
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          userId={userId}
          userName={userName}/>
        {roomsList}
      </Router>
    </>
  );
};

export default App;
