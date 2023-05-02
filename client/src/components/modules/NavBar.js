import React, { Component } from "react";
import { Link } from "@reach/router";
//import GoogleLogin, { GoogleLogout } from "react-google-login";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";

import { get, post } from "../../utilities";
import "./NavBar.css";

const GOOGLE_CLIENT_ID = "357833659047-2tc0dviuahgabo8s31s0b7ifj1i8pjb3.apps.googleusercontent.com"

const NavBar = (props) => {
    return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <nav className="NavBar-container">
        <div className="NavBar-linkContainer">
        
          {/* <Link to="/chat/" className="NavBar-link">
            Chat
          </Link> */}
          <Link to="/howtoplay/" className="NavBar-link linkAnimation">
            How to Play
          </Link>
          <Link to="/leaderboard/" className="NavBar-link linkAnimation">
            Leaderboard
          </Link>
          <div className="spacer"></div>

        </div>

        <span className="NavBar-title titleAnime">
        <Link to="/" className="NavBar-link">
            MULTIMINE
          </Link>
          </span>

        <div className="userStuff">
           {/* {props.userId && (
            <Link to={`/profile/${props.userId}`} className="NavBar-link">
              Profile
            </Link>
          )} */}
          {(props.logStable) ? (props.userId ? (
            <>
            <Link to={`/profile/${props.userId}`} className="NavBar-link linkAnimation">
              Profile
            </Link>
            <div className="spacer"></div>

            <button style={{background: "none", border: "none"}} className="NavBar-link linkAnimation"
              onClick={() => {
            googleLogout();
            props.handleLogout();
          }}
        >
          <h1>Logout</h1>
        </button>
            </>
          ) : (
            <>
            <GoogleLogin onSuccess={props.handleLogin} onError={(err) => console.log(err)} />
            <div className="spacer"></div>
            </>
          )) : (
            <><div className="spacer"></div></>
          )}

          </div>
      </nav>
      </GoogleOAuthProvider>
    );
  };
  
  export default NavBar;