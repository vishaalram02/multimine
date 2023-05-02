import React, { useState, useEffect } from "react";
// import { Link } from "@reach/router";

import "./SingleMessage.css";

/**
 * Renders a single chat message
 *
 * Proptypes
 * @param {MessageObject} message
 */
const SingleMessage = (props) => {
  return (
    <>
      <div className="messageyeet">
      <b>{props.message.sender.name}</b>: {props.message.content}
      </div>
    </>
  );
}

export default SingleMessage;