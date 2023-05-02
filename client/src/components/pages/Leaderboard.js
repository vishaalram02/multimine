import React, { useState, useEffect } from "react";
import { get } from "../../utilities"
import NavBar from "../modules/NavBar.js"

import "../../utilities.css";
import "./Leaderboard.css";
import { Link } from "@reach/router";


const Leaderboard = (props) => {
  const [allSmallRuns, setAllSmallRuns] = useState([]);
  const [allMediumRuns, setAllMediumRuns] = useState([]);
  const [allLargeRuns, setAllLargeRuns] = useState([]);

  useEffect(() => { // gets the top small scores
    document.title = "Leaderboard";
    
    get(`/api/allUsers`, {}).then((userObjs) => {
      userObjs.sort((a,b) => {
        if (a.topscoreSmall.score === 0 && b.topscoreSmall.score === 0) {
          return 0;
        }
        else if (a.topscoreSmall.score === 0) {
          return 1;
        }
        else if (b.topscoreSmall.score === 0) {
          return -1;
        }
        return a.topscoreSmall.score-b.topscoreSmall.score;
      });
      let bestSmallRunScores = userObjs.map((userObj) => (
        (userObj.topscoreSmall.score>0) ? (
        <>
          <tr>
            <td>
            <Link to={"/profile/"+userObj._id}>{userObj.name}</Link>
            </td>
            <td>
            {userObj.topscoreSmall.score/1000} seconds
            </td>
            <td>
            {userObj.topscoreSmall.gameTime.substring(5,7)}/{userObj.topscoreSmall.gameTime.substring(8,10)}/{userObj.topscoreSmall.gameTime.substring(0,4)}
            </td>
          </tr>
        </> ) : (<></>)
      ));
      setAllSmallRuns(bestSmallRunScores.slice(0,20));
      // console.log(bestSmallRunScores.length);
      // console.log(`best small runs: ${JSON.stringify(bestSmallRunScores)} and ${JSON.stringify(bestSmallRunScores.slice(0,4))}`);
    });
  }, []);

  useEffect(() => { // top medium scores
    
    get(`/api/allUsers`, {}).then((userObjs) => {
      userObjs.sort((a,b) => {
        if (a.topscoreMedium.score === 0 && b.topscoreMedium.score === 0) {
          return 0;
        }
        else if (a.topscoreMedium.score === 0) {
          return 1;
        }
        else if (b.topscoreMedium.score === 0) {
          return -1;
        }
        return a.topscoreMedium.score-b.topscoreMedium.score;
      });
      let bestMediumRunScores = userObjs.map((userObj) => (
        (userObj.topscoreMedium.score>0) ? (
        <>
          <tr>
            <td>
            <Link to={"/profile/"+userObj._id}>{userObj.name}</Link>
            </td>
            <td> {userObj.topscoreMedium.score/1000} seconds 
            </td>
            <td>{userObj.topscoreMedium.gameTime.substring(5,7)}/{userObj.topscoreMedium.gameTime.substring(8,10)}/{userObj.topscoreMedium.gameTime.substring(0,4)}
            </td>
          </tr>
        </> ) : (<></>)
      ));
      setAllMediumRuns(bestMediumRunScores.slice(0,20));
    });
  }, []);

  useEffect(() => { //top large scores
    document.title = "Leaderboard";
    
    get(`/api/allUsers`, {}).then((userObjs) => {
      userObjs.sort((a,b) => {
        if (a.topscoreLarge.score === 0 && b.topscoreLarge.score === 0) {
          return 0;
        }
        else if (a.topscoreLarge.score === 0) {
          return 1;
        }
        else if (b.topscoreLarge.score === 0) {
          return -1;
        }
        return a.topscoreLarge.score-b.topscoreLarge.score;
      });
      let bestLargeRunScores = userObjs.map((userObj) => (
        (userObj.topscoreLarge.score>0) ? (
        <>
          <tr>
            <td>
            <Link to={"/profile/"+userObj._id}>{userObj.name}</Link>
            </td>
            <td> {userObj.topscoreLarge.score/1000} seconds 
            </td>
            <td> {userObj.topscoreLarge.gameTime.substring(5,7)}/{userObj.topscoreLarge.gameTime.substring(8,10)}/{userObj.topscoreLarge.gameTime.substring(0,4)}
            </td>
          </tr>
        </> ) : (<></>)
      ));
      // console.log(`best large run ${JSON.stringify(bestLargeRunScores.slice(0,10))}`)
      setAllLargeRuns(bestLargeRunScores.slice(0,20));
    });
  }, []);



  return (
    <>
      <NavBar
        handleLogin={props.handleLogin}
        handleLogout={props.handleLogout}
        userId={props.userId}
        logStable={true}
        />
      
        <h1 className="leaderTitle u-textCenter">Global Leaderboard</h1>

        <div className="u-flex scoreHolder">
        <div id="small" className="scores">
          <h1 className="u-textCenter">SMALL</h1>
          <h3 className="u-textCenter">9x9, 10 mines</h3>
          <div className="scrollTable">
          <table>
              <tr className="header">
              <td>RUN</td>
              <td>TOP TIME</td>
              <td>DATE</td>
              </tr>
              {allSmallRuns}
           </table>
        </div>
        </div>
        <div id="medium" className="scores">
        <h1 className="u-textCenter">MEDIUM</h1>
        <h3 className="u-textCenter">16x16, 40 mines</h3> 
        <div className="scrollTable">
          <table>
            <tr className="header">
            <td>RUN</td>
            <td>TOP TIME</td>
            <td>DATE</td>
            </tr>
            {allMediumRuns}
          </table>
        </div>
         </div>

        <div id="large" className="scores">
        <h1 className="u-textCenter">LARGE</h1> 
        <h3 className="u-textCenter"> 30x16, 99 mines</h3>
        <div className="scrollTable">
        <table>
              <tr className="header">
              <td>RUN</td>
              <td>TOP TIME</td>
              <td>DATE</td>
              </tr>
            {allLargeRuns}
        </table>
        </div>
        </div>

        </div>

    </>
  );
};

export default Leaderboard;
