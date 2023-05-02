import React, { useState, useEffect } from "react";
import SingleMessage from "./SingleMessage.js";
import SingleMessageAllChat from "./SingleMessageAllChat.js";
import { NewMessage, NewRoomMessage } from "./NewPostInput.js";

import "./Chat.css";

/**
 * @typedef UserObject
 * @property {string} _id
 * @property {string} name
 */
/**
 * @typedef MessageObject
 * @property {UserObject} sender
 * @property {string} content
 */
/**
 * @typedef ChatData
 * @property {MessageObject[]} messages
 * @property {UserObject} recipient
 */

/**
 * Renders main chat window including previous messages,
 * who is being chatted with, and the new message input.
 *
 * Proptypes
 * @param {ChatData} data
 * @param {String} userId 
 */
const Chat = (props) => {
  const submitNewMessage = (!props.userId) ? (
    <>
      <div className="Chat-newContainer">
        <h4 className="u-textCenter">Log in to chat!</h4>
      </div>
    </>
  ) : (
    <>
      <div className="Chat-newContainer">
        <NewMessage recipient={props.data.recipient}/>
      </div>
    </>
  )
  if (props.data.recipient._id === "ALL_CHAT") {
    return (
      <>
        <div className="u-flexColumn Chat-container">
          <h2>Lobby {props.data.recipient.name}</h2>
          <div className="Chat-historyContainer">
            {[...props.data.messages].slice(-50,).reverse().map((m, i) => (
              <SingleMessageAllChat message={m} key={i} />
            ))}
          </div>
          {submitNewMessage}
        </div>
      </>
    );
  }
  else {
    return (
      <>
        <div className="u-flexColumn Chat-container">
          <h2>Chat with {props.data.recipient.name}</h2>
          <div className="Chat-historyContainer">
            {[...props.data.messages].reverse().map((m, i) => (
              <SingleMessage message={m} key={i} />
            ))}
          </div>
          <div className="Chat-newContainer">
            <NewRoomMessage recipient={props.data.recipient} userId={props.userId} userName={props.userName}/>
            {/* change it to something that doesn't store in database */}
            {/* make this conditional later */}
          </div>
        </div>
      </>
    );
  }
}

export default Chat;
