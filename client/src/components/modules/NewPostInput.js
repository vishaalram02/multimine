import React, { useState } from "react";

import "./NewPostInput.css";
import { post } from "../../utilities";
import { socket } from "../../client-socket.js";


/**
 * New Post is a parent component for all input components
 *
 * Proptypes
 * @param {string} defaultText is the placeholder text
 * @param {string} storyId optional prop, used for comments
 * @param {({storyId, value}) => void} onSubmit: (function) triggered when this post is submitted, takes {storyId, value} as parameters
 */
const NewPostInput = (props) => {
  const [value, setValue] = useState("");

  // called whenever the user types in the new post input box
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  // called when the user hits "Submit" for a new post
  const handleSubmit = (event) => {
    event.preventDefault();
    if (value !== "") {
      props.onSubmit && props.onSubmit(value);
    }
    setValue("");
  };

  const keyDown = (event) => {
    if (event.key === "Enter" ) {
      if (value !== "") {
        props.onSubmit && props.onSubmit(value);
      }
      setValue("");
    }
  };
  
  return (
    <div className="inputBox u-flex">
      <input
        type="text"
        placeholder={props.defaultText}
        value={value}
        onChange={handleChange}
        onKeyDown={keyDown} 
        className="NewPostInput-input"
      />
    </div>
  );
};

/**
 * New Message is a New Message component for messages
 *
 * Proptypes
 * @param {UserObject} recipient is the intended recipient
 */
const NewMessage = (props) => {
  const sendMessage = (value) => {
    const body = { recipient: props.recipient, content: value };
    post("/api/message", body);
  };

  return <NewPostInput defaultText="New Message" onSubmit={sendMessage} />;
}

const NewRoomMessage = (props) => { // Sends a new message (object) to everybody in a room
  const sendMessage = (value) => {
    const message = {
      recipient: props.recipient,
      sender: {
        _id: props.userId,
        name: props.userName,
      },
      content: value,
    }
    socket.emit("roomMessage", {message: message, room: props.recipient._id});
  }
  return <NewPostInput defaultText="New Message" onSubmit={sendMessage} />;
}

export { NewMessage, NewRoomMessage };
