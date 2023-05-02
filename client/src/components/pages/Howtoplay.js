import React from "react";
import NavBar from "../modules/NavBar.js"

import "../../utilities.css";
import "./Howtoplay.css";

const Howtoplay = (props) => {

  return (
    <>
      <NavBar
        handleLogin={props.handleLogin}
        handleLogout={props.handleLogout}
        userId={props.userId}
        logStable={true}
        />
      <div className="rulesBox">
      <h1> How To Play Multimine! </h1>
      <h2> Q: I've never played minesweeper before. What are the basic rules and strategy for the game?</h2>
      <h3> A: <a href="https://minesweepergame.com/strategy.php">See this resource!</a></h3>
      <h2> Q: How is Multimine different from typical minesweeper?</h2>
      <h3> A: All players in the same room have the <i>same layout</i> of mines. If you click on a mine, the game is <i>not over</i>. Instead, your board freezes for a few seconds as a penalty.</h3>
      <h2> Q: Why is one square different in the beginning? </h2>
      <h3> A: This square is an <i>interior square</i>. Typically in Minesweeper, your first clicked square is guaranteed to be an interior square. Since multiple people are playing with the same layout, we provide one interior square to start from. You are not <i>required</i> to click on it, but it usually helps!</h3>
      <h2> Q: What do the colors in the progress bars mean? </h2>
      <h3> A: Green means that the player is currently playing as normal. Blue means that they are frozen, having just clicked on a mine. Purple means they have completed the game!</h3>
    </div>
    </>
  );
};

export default Howtoplay;
