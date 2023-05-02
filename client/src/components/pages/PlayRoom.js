import React, { useState, useEffect } from "react";
import { get } from "../../utilities";
import Board from "../modules/Board.js";
import { socket } from "../../client-socket.js";
import { post } from "../../utilities";
import { Link } from "@reach/router";
import Chat from "../modules/Chat.js";
import NavBar from "../modules/NavBar.js"
import { useNavigate } from "@reach/router"
import Confetti from 'react-confetti'

import "../../utilities.css";
import "./PlayRoom.css";
import "./Game.css"
import "../modules/ProgressBars.css";
import "./Chatbook.css";

/** PropTypes
* @param {String} _id, gives the id of the room
* @param name, gives the room name
* @param userId
* @param userName
* @param handleLogin
* @param handleLogout
* PlayRoom should take in a HOST
*/

const PlayRoom = (props) => {
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);
  const [progressList, setProgressList] = useState({});
  const [myFrozen, setMyFrozen] = useState(0);
  const [frozenList, setFrozenList] = useState({});
  const [progress, setProgress] = useState(0);
  const [gameState, setGameState] = useState("before");
  const [gameTime, setGameTime] = useState(0);
  const [mineList, setMineList] = useState([]);
  const [roomCode, setRoomCode] = useState("");
  const [endStats, setEndStats] = useState({});
  const [height, setHeight] = useState(16);
  const [width, setWidth] = useState(30);
  const [mines, setMines] = useState(99);
  const [freezeTime, setFreezeTime] = useState(10);
  const [countdown, setCountdown] = useState(3000);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const stylename = "game-board-"+props.boardSize;

  useEffect(() => {
    if (props.boardSize === "small") {
      setHeight(9);
      setWidth(9);
      setMines(10);
      setFreezeTime(2000);
    }
    else if (props.boardSize === "medium") {
      setHeight(16);
      setWidth(16);
      setMines(40);
      setFreezeTime(5000);
    }
    else if (props.boardSize === "large") {
      setHeight(16);
      setWidth(30);
      setMines(99);
      setFreezeTime(10000);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0,0);
    return () => {
      navigate("/");
    };
  }, []);

  const kickCallback = () => {
    props.refresh();
    navigate("/");
  };

  useEffect(() => {
    socket.on("kick", kickCallback);
    return () => {
      socket.off("kick", kickCallback);
    }
  });

  useEffect(() => {
    get("/api/roomstatus", {room: props._id}).then((thing) => {
      if (thing.status) {
        if(thing.status !== "before"){
          props.refresh();
          navigate("/");
        }
      } else {
        props.refresh();
        navigate("/");
      }
    });
  }, []);

  useEffect(() => {
    get("/api/roomcode", {room: props._id}).then((thing) => {
      setRoomCode(thing.code);
    });
  }, []);

  const gameTimeCallback = (newTime) => {
    setGameTime(newTime);
  };
  
  useEffect(() => {
      socket.on("timeUpdate", gameTimeCallback);
      return () => {
        socket.off("timeUpdate", gameTimeCallback);
      }
  }, [gameTime]);

  const Userlistcallback = (userList) => {
    if(gameState === "before"){
      setUserList(userList);
    }
    
  }
  useEffect(() => {
     socket.on("roomupdate", Userlistcallback);
     return () => {
       socket.off("roomupdate", Userlistcallback);
     };
   }, [userList, gameState]);

  useEffect(() => {
    socket.emit("joinroomSock", props._id);
    return () => {
      socket.emit("leaveroomSock", props._id);

    }
  },[]);
  const mineListCallback = (newMineList) => {
    setMineList(newMineList);
  };
  
  useEffect(() => {
    socket.on("initmines", mineListCallback);
    return () => {
      socket.off("initmines", mineListCallback);
    }
  }, []);

  const showGamecallback = () => {
    setGameState("during");
  };
  
  useEffect(() => {
    socket.on("showgame", showGamecallback);
    return () => {
      socket.off("showgame", showGamecallback);
    }
  }, []);

  const hideGamecallback = ({winner, winTime}) => {
    let newEndStats = {...endStats};
  //  newEndStats[winner._id] = {time: winTime, place: Object.keys(newEndStats).length + 1};
    newEndStats[winner._id] = {time: winTime, place: Object.keys(endStats).length+1};
    setEndStats(newEndStats);
    // console.log(endStats);
  };
  
  useEffect(() => {
    socket.on("hidegame", hideGamecallback);
    return () => {
      socket.off("hidegame", hideGamecallback);
    }
  }, [endStats]);


  useEffect(() => {
    socket.emit("progressUpdate",{progress: progress, room: props._id});
    if (progress >= (height*width-mines)) {
      setGameState("after");
      socket.emit("endGame", {room: props._id, socketid: socket.id});
      const body = {userId: props.userId, room: props._id, boardSize: props.boardSize};
      post("/api/addHighScore", body).then((newRecord) => {
        setIsNewRecord(newRecord);
      });
    }
  },[progress]);

  const ProgressCallback = ({user, progress}) => {
    let newProgressList = {...progressList};
    newProgressList[user] = progress;
    setProgressList(newProgressList);
  };

  useEffect(() => {
    socket.on("newProgressUpdate", ProgressCallback);
    return () => {
      socket.off("newProgressUpdate", ProgressCallback);
    }
  }, [progressList, frozenList]);
  
  const [activeChat, setActiveChat] = useState({
    recipient: {
      _id: props._id,
      name: `Room ${props.name}`,
    },
    messages: [],
  });

  const addMessages = (data) => {
    setActiveChat(prevActiveChat => ({
      recipient: prevActiveChat.recipient,
      messages: prevActiveChat.messages.concat(data),
    }));
  };

  useEffect(() => {
    document.title = "Multimine";
  }, []);

  useEffect(() => {
    socket.on("newRoomMessage", addMessages); //just replace message
    return () => {
      socket.off("newRoomMessage", addMessages);
    };
  }, []);


  const frozenUpdateCallback = (newList) => {
    setFrozenList(newList);
    if(newList && props.userId in newList){
      setMyFrozen(newList[props.userId]);
    }
  };

  useEffect(() => {
    socket.on("roomFrozenUpdate", frozenUpdateCallback);
    return () => {
      socket.off("roomFrozenUpdate", frozenUpdateCallback);
    };
  }, [frozenList, myFrozen]);

  const countdownUpdateCallback = (newTime) => {
    setCountdown(newTime);
  };

  useEffect(() => {
    socket.on("countdownUpdate", countdownUpdateCallback);
    return () => {
      socket.off("countdownUpdate", countdownUpdateCallback);
    };
  }, [countdown]);


  const YeetProgressList = userList.map((user) => {
    let pro = 0;
    let endTime = 0;
    let place = 0;
    if(progressList[user._id]){
      pro = progressList[user._id];
    }
    if(user._id in endStats){
      endTime = endStats[user._id].time;
      place = endStats[user._id].place;
    }
    return (
      (pro === height*width-mines) ? (
      <>
        <h3>{user.name}</h3>
        <div className="progressHolderDone">
          <div style={{width: `${pro*100/(height*width-mines)}%`}}><h4>{place}. Finished in {endTime/1000}s</h4></div>
        </div>
      </>
      ) : ( (frozenList && frozenList[user._id]) ? (
      <>
        <h3>{user.name}</h3>
        <div className="progressHolderFrozen">
          <div style={{width: `${pro*100/(height*width-mines)}%`}}></div>
        </div>
      </>
      ) : (
      <>
        <h3>{user.name}</h3>
        <div className="progressHolder">
          <div style={{width: `${pro*100/(height*width-mines)}%`}}></div>
        </div>
      </>
      )
      )
    )
  });

 

  if (!props.userId) {
    return (
    <>
    <NavBar
      handleLogin={props.handleLogin}
      handleLogout={props.handleLogout}
      userId={props.userId}
    />
    <h3>Please navigate to the lobby and log in before using Multimine</h3>

    </>
    );
  }
  
  const handleLeave = (event) => {
    event.preventDefault();
    props.refresh();
    navigate("/");
  }

  const handleStart = (event) => {
    event.preventDefault();
    socket.emit('startGame', {room: props._id, height: height, width: width, mines: mines});
  }

  return (
    <>
      <div>
        <h1 className="u-textCenter">Room {props.name}</h1>
        <button type="button" className="button leaveRoomButton" onClick={handleLeave}>
        Leave Room
        </button>  
        <div className ="gameRoom">

            <div className="gameChat u-flex u-relative Chatbook-container-2">
              <div className="Chatbook-chatContainer u-relative">
                <Chat data={activeChat} userId={props.userId} userName={props.userName}/>
              </div>
            </div>

           { (gameState === "before") ? (<>
              <div className={`game-board-${props.boardSize} displayBlock`}>
              <div className = "board-and-stats">
               <div className={`u-flex ${props.boardSize} settings`}>
                <div className="info">
               { (props.isPrivate === true) ? (
                 <h3>
                 Room Code: {roomCode}
               </h3>
               ) : (
                <>
                </>
                )
               }
               <h3>
                 Dimensions: {width} x {height}
               </h3>
               <h3>
                 Number of Mines: {mines}
               </h3>
               <h3>
                 Mine Penalty: {freezeTime/1000} seconds
               </h3>
               </div>
               <button type="button" className="button" onClick = {handleStart}><h3>Start Game</h3></button>
               
               </div>
               </div>
               </div>
               </>
              ) : (
                <>

            <div className = "board-and-stats">
             <div className={`game-board-${props.boardSize} ${props.boardSize}`}>
                {(countdown) ? (<div className={`coverUp u-flex ${props.boardSize} u-flex-alignCenter`}><h1>{Math.ceil(countdown/1000)}</h1></div>) : (<> </>)}
                {(myFrozen) ? (<div className={`coverUp u-flex ${props.boardSize} u-flex-alignCenter`}><h1>{Math.ceil(myFrozen/1000)}</h1></div>) : (<> </>)}
                {(progress >= height*width-mines) ? (<><div className={`coverUpGameOver u-flex ${props.boardSize} u-flex-alignCenter`}><h1> </h1></div></>) : (<></>)}
                <Board
                  height = {height}
                  width = {width}
                  mines = {mines}
                  room = {props._id}
                  setProgress = {setProgress}
                  progress = {progress}
                  mineList = {mineList}
                  setGameState = {setGameState}
                  userId = {props.userId}
                  freezeTime = {freezeTime}
                  frozen = {myFrozen}
                  countdown = {countdown}/>   
                  
              </div>
              <div className="u-flex timeAndProgress">
                <h1>{Math.ceil(gameTime/1000)}s</h1> <h1> {progress}/{height*width-mines}</h1>
              </div>
              </div>
           
              </>
              )
              }
        <div className="progressBars">
              
          {YeetProgressList}

          
        </div>

        </div>
        
        {(progress >= height*width-mines) ? (<Confetti numberOfPieces={500} recycle={false}/>) : (<></>)}
        
        {(isNewRecord) ? (<><div className="best"><h1>PERSONAL RECORD!!!!</h1></div></>) : (<></>)}
        
      </div>
    </>
  );
};

export default PlayRoom;
