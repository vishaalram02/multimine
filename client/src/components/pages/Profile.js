import React, { useState, useEffect } from "react";
import { get } from "../../utilities"
import NavBar from "../modules/NavBar.js"

import "../../utilities.css";
import "./Profile.css";

const Profile = (props) => {
  const [user, setUser] = useState();
  const [userSmallScores, setUserSmallScores] = useState();
  const [avgSmallScore, setAvgSmallScore] = useState(0);
  const [userMediumScores, setUserMediumScores] = useState();
  const [avgMediumScore, setAvgMediumScore] = useState(0);
  const [userLargeScores, setUserLargeScores] = useState();
  const [avgLargeScore, setAvgLargeScore] = useState(0);
  const [smallDisplay, setSmallDisplay] = useState({display: 'block'});
  const [mediumDisplay, setMediumDisplay] = useState({display: 'none'});
  const [largeDisplay, setLargeDisplay] = useState({display: 'none'});
  const [smallButton, setSmallButton] = useState({backgroundColor: 'var(--purple1)'})
  const [mediumButton, setMediumButton] = useState({backgroundColor: 'var(--pink)'})
  const [largeButton, setLargeButton] = useState({backgroundColor: 'var(--pink)'})

  const openSmall = () => {
    setSmallDisplay({display: 'block'});
    setMediumDisplay({display: 'none'});
    setLargeDisplay({display: 'none'});
    setSmallButton({backgroundColor: 'var(--purple1)'})
    setMediumButton({backgroundColor: 'var(--pink)'})
    setLargeButton({backgroundColor: 'var(--pink)'})
  }
  
  const openMedium = () => {
    setSmallDisplay({display: 'none'});
    setMediumDisplay({display: 'block'});
    setLargeDisplay({display: 'none'});
    setSmallButton({backgroundColor: 'var(--pink)'})
    setMediumButton({backgroundColor: 'var(--purple1)'})
    setLargeButton({backgroundColor: 'var(--pink)'})
  }

  const openLarge = () => {
    setSmallDisplay({display: 'none'});
    setMediumDisplay({display: 'none'});
    setLargeDisplay({display: 'block'});
    setSmallButton({backgroundColor: 'var(--pink)'})
    setMediumButton({backgroundColor: 'var(--pink)'})
    setLargeButton({backgroundColor: 'var(--purple1)'})
  }

  useEffect(() => {
    document.title = "Profile Page";
    let avgSmallCounter = 0;
    get(`/api/user`, { userid: props.userId }).then((userObj) => {
      setUser(userObj);
      userObj.smallTimes.map((round) => {
        avgSmallCounter=avgSmallCounter+round.score/1000;
      });
      if (userObj.smallTimes.length>0) { // Checks to make sure length of the array is nonzero
        setAvgSmallScore(avgSmallCounter/userObj.smallTimes.length);
      }
      userObj.smallTimes.sort((a,b) => {
        return a.score-b.score;
      });
      const newUserSmallScores = (userObj.smallTimes.length>0) ? (userObj.smallTimes.map((round) => (
        <>
        <tr>
         <td>
           {(round.score)/1000} seconds
         </td>
         <td>
          {round.gameTime.substring(0,10)} {round.gameTime.substring(11, 19)} UTC
          </td>

          </tr>
       </>
      ))) : (
        <>
          <tr>
          <td></td>
            <td>No completed games :(</td>
          </tr>
        </>
      );
      setUserSmallScores(newUserSmallScores);

    });
  }, []);

  useEffect(() => {
    let avgMediumCounter = 0;
    get(`/api/user`, { userid: props.userId }).then((userObj) => {
      setUser(userObj);
      userObj.mediumTimes.map((round) => {
        avgMediumCounter=avgMediumCounter+round.score/1000;
      });
      if (userObj.mediumTimes.length>0) {
        setAvgMediumScore(avgMediumCounter/userObj.mediumTimes.length);
      }
      userObj.mediumTimes.sort((a,b) => {
        return a.score-b.score;
      });
      const newUserMediumScores = (userObj.mediumTimes.length>0) ? (userObj.mediumTimes.map((round) => (
        <>
        <tr>
         <td>
           {(round.score)/1000} seconds
         </td>
         <td>
          {round.gameTime.substring(0,10)} {round.gameTime.substring(11, 19)} UTC
          </td>

          </tr>
       </>
      ))) : (
        <>
          <tr>
          <td></td>
          <td>No completed games :(</td>
          </tr>
        </>
      );
      setUserMediumScores(newUserMediumScores);

    });
  }, []);

  useEffect(() => {
    let avgLargeCounter = 0;
    get(`/api/user`, { userid: props.userId }).then((userObj) => {
      setUser(userObj);
      userObj.largeTimes.map((round) => {
        avgLargeCounter=avgLargeCounter+round.score/1000;
      });
      if (userObj.largeTimes.length>0) {
        setAvgLargeScore(avgLargeCounter/userObj.largeTimes.length);
      }
      userObj.largeTimes.sort((a,b) => {
        return a.score-b.score;
      });
      const newUserLargeScores = (userObj.largeTimes.length>0) ? (userObj.largeTimes.map((round) => (
        <>
        <tr>
         <td>
           {(round.score)/1000} seconds
         </td>
         <td>
          {round.gameTime.substring(0,10)} {round.gameTime.substring(11, 19)} UTC
          </td>

          </tr>
       </>
      ))) : (
        <>
          <tr>
            <td></td>
          <td>No completed games :(</td>
          </tr>
        </>
      );
      setUserLargeScores(newUserLargeScores);
    });
  }, []);

  if (!user) {
    return (
    <>
      <NavBar
        handleLogin={props.handleLogin}
        handleLogout={props.handleLogout}
        userId={props.userId}
        logStable={false}
        />
      <div> <h3 className="loadingPage"> Loading... </h3> </div>
    </>
    );
  }
  return (
    <>
      <NavBar
        handleLogin={props.handleLogin}
        handleLogout={props.handleLogout}
        userId={props.userId}
        logStable={false}
        />

      <div className="u-flex profile">

      <div className="u-flex profileContainer">
      <div className="name">
        <h1 className="Profile-name u-textCenter">{user.name}</h1>
        <h2 className="u-textCenter">Account created: {user.dateCreated.substring(5,7)}/{user.dateCreated.substring(8,10)}/{user.dateCreated.substring(0,4)}</h2>
        <h2 className="u-textCenter">Total number of games: {user.smallTimes.length+user.mediumTimes.length+user.largeTimes.length}</h2>
        </div>        
      </div>


      <div className="u-flex boardSummary">

      <div className="tabBar">
        <button className="tabItem" style={smallButton} onClick={openSmall}>Small</button>
        <button className="tabItem" style={mediumButton} onClick={openMedium}>Medium</button>
        <button className="tabItem"  style={largeButton} onClick={openLarge}>Large</button>
      </div>

      <div className="statContainer" style={smallDisplay}>
        <div className="stats">
          <h1>Small</h1>
          <h3>9x9, 10 mines</h3>
          <div className="scoresBox u-flex">

          <div>
          <h2> Number of games: {user.smallTimes.length}</h2>
          <h2> Average time: {Math.ceil(avgSmallScore*1000)/1000} seconds</h2>
          <h2> Best time: {user.topscoreSmall.score/1000} seconds</h2>
          </div>
         
          <div className="profileScrollTable">
          <table>
            <tr className="header">
            <th>Time:</th>
            <th>Date:</th>
            </tr>
            {userSmallScores}
          </table>
          </div>

          </div>
        </div>
      </div>
      

      <div className="mediumScores statContainer" style={mediumDisplay}>
        <div className="stats">
          <h1> Medium</h1>
          <h3>16x16, 40 mines</h3>

          <div className="scoresBox u-flex">
          <div>
          <h2> Number of games: {user.mediumTimes.length}</h2>
          <h2> Average time: {Math.ceil(avgMediumScore*1000)/1000} seconds</h2>
          <h2> Best time: {user.topscoreMedium.score/1000} seconds</h2>

          </div>
          <div className="profileScrollTable">
          <table>
          <tr className="header">
            <th>Time:</th>
            <th>Date:</th>
            </tr>
            {userMediumScores}
            
          </table>
          </div>
          </div>
        </div>
      </div>
      <div className="largeScores statContainer" style={largeDisplay}>
        <div className="stats">
          <h1> Large</h1>
          <h3> 30x16, 99 mines</h3>

          <div className="scoresBox u-flex">
          <div>
          <h2> Number of games: {user.largeTimes.length}</h2>
          <h2> Average time: {Math.ceil(avgLargeScore*1000)/1000} seconds</h2>
          <h2> Best time: {user.topscoreLarge.score/1000} seconds</h2>
          </div>
          <div className="profileScrollTable">
          <table>
            <tr className="header">
            <th>Time:</th>
            <th>Date:</th>
            </tr>
            {userLargeScores}
          </table>
          </div>
          </div>
        </div>
      </div>
      </div>
      </div>
    </>
  );
};

export default Profile;
