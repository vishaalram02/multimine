import React, { useState, useEffect } from "react";
import { Link } from "@reach/router";

import "./SingleMessage.css";

/**
 * Renders a single chat message
 *
 * Proptypes
 * @param {MessageObject} message
 */
const SingleMessageAllChat = (props) => {
  return (
    <>
      <div className="messageyeet">
      <b><Link to={"/profile/"+props.message.sender._id}>{props.message.sender.name}</Link></b>: {props.message.content}
      </div>
    </>
  );
}

export default SingleMessageAllChat;