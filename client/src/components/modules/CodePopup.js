import React, {useEffect, useState} from "react";
import "./CodePopup.css";

import "./NewPostInput.css"

const CodePopup = (props) => {
    const [value, setValue] = useState("");
    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const keyDown = (event) => {
        // console.log(event.key)
        if (event.key === "Enter" ) {
            props.checkCode(value, props.room)
        }
    };

    return (
        <div className = "popup-box"> 
            <div className = "box">
                <span className = "close-icon" onClick = {props.handleClose}>x</span>
                <h3 className="u-textCenter"> Enter Code: </h3>
                <input type="text" className="NewPostInput-input" placeholder="Room Code"  onKeyDown={keyDown} value={value} onChange = {handleChange} />
                    <button
                        type="submit"
                        value="Submit"
                        className="NewPostInput-button"
                        onClick={() => props.checkCode(value, props.room)}
                    >
                    Submit
                    </button>
            </div>
        </div>
    );
};

export default CodePopup;