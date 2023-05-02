import React, { useState } from "react";

import "./NewPostInput.css"; // Maybe change this css at some point
import { post } from "../../utilities";

/**
 * New Page is a parent component for all page components
 *
 * Proptypes
 * @param {string} defaultText is the placeholder text
 * @param {string} storyId optional prop, used for comments
 * @param {({storyId, value}) => void} onSubmit: (function) triggered when this post is submitted, takes {storyId, value} as parameters
 * @param {} onSubmit
 */
const NewPageInput = (props) => {
  const [value, setValue] = useState("");

  // called whenever the user types in the new post input box
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const sizeChange = (event) => {
    props.setBoardSize(event.target.value);
  }

  // called when the user hits "Submit" for a new post
  const handleSubmit = (event) => {
    event.preventDefault();
    // props.onSubmit(value);
    props.onSubmit && props.onSubmit(value);
    setValue("");
  };

  const handleCheck = (event) => {
    // event.preventDefault();
    props.setRoomPrivate(!props.roomPrivate);
  };

  const keyDown = (event) => {
    if (event.key === "Enter" ) {
      props.onSubmit && props.onSubmit(value);
      setValue("");
    }
  };

  return (
    <>
      <h2>Create a Room</h2>
      
      <div>
        <label for="private"><h3>Private game
        <input type = "checkbox" className="checkbox" id="private" onChange={handleCheck} checked={props.roomPrivate}/></h3></label>
      </div>
      <div>
        <h3 className="u-textCenter">Game size</h3>
        <form className="u-flex" onChange={sizeChange} method="post" action="">
          <div><label for="large"><input type="radio" name="size" id="large" value="large" defaultChecked/>Large: 16x30, 99 mines</label></div>
          <div><label for="medium"><input type="radio" name="size" id="medium" value="medium"/>Medium: 16x16, 40 mines</label></div>
          <div><label for="small"><input type="radio" name="size" id="small" value="small"/>Small: 9x9, 10 mines</label></div>
        </form>
      </div>

      <button
          type="submit"
          className="NewPostInput-button u-pointer"
          value="Submit"
          onClick={handleSubmit}
        >
          Submit
        </button>
    </>
  );
};

/**
 * New Room creates a new room
 *
 * Proptypes
 * @param {function} addNewRoom
 */
const NewRoom = (props) => {
  const [roomPrivate, setRoomPrivate] = useState(false);
  const [boardSize, setBoardSize] = useState("large");

  const AddRoom = (value) => {
    const animals = [
      "Aardvark",
      "Alpaca",
      "Ant",
      "Anteater",
      "Antelope",
      "Ape",
      "Donkey",
      "Baboon",
      "Badger",
      "Bat",
      "Bear",
      "Beaver",
      "Bee",
      "Bison",
      "Boar",
      "Buffalo",
      "Camel",
      "Capybara",
      "Caribou",
      "Cat",
      "Cattle",
      "Chamois",
      "Cheetah",
      "Chicken",
      "Chough",
      "Clam",
      "Cobra",
      "Cockroach",
      "Cod",
      "Coyote",
      "Crab",
      "Crane",
      "Crow",
      "Curlew",
      "Deer",
      "Dinosaur",
      "Dog",
      "Dogfish",
      "Dolphin",
      "Dotterel",
      "Dove",
      "Duck",
      "Dugong",
      "Dunlin",
      "Eagle",
      "Echidna",
      "Eel",
      "Eland",
      "Elephant",
      "Elk",
      "Emu",
      "Falcon",
      "Ferret",
      "Finch",
      "Fish",
      "Flamingo",
      "Fly",
      "Fox",
      "Frog",
      "Gaur",
      "Gazelle",
      "Gerbil",
      "Giraffe",
      "Gnat",
      "Gnu",
      "Goat",
      "Goldfish",
      "Goose",
      "Gorilla",
      "Goshawk",
      "Grouse",
      "Guanaco",
      "Gull",
      "Hamster",
      "Hare",
      "Hawk",
      "Hedgehog",
      "Heron",
      "Herring",
      "Hornet",
      "Horse",
      "Hyena",
      "Ibex",
      "Ibis",
      "Jackal",
      "Jaguar",
      "Jay",
      "Kangaroo",
      "Koala",
      "Kouprey",
      "Kudu",
      "Lapwing",
      "Lark",
      "Lemur",
      "Leopard",
      "Lion",
      "Llama",
      "Lobster",
      "Locust",
      "Loris",
      "Louse",
      "Lyrebird",
      "Magpie",
      "Mallard",
      "Manatee",
      "Mandrill",
      "Mantis",
      "Marten",
      "Meerkat",
      "Mink",
      "Mole",
      "Mongoose",
      "Monkey",
      "Moose",
      "Mosquito",
      "Mouse",
      "Mule",
      "Narwhal",
      "Newt",
      "Octopus",
      "Okapi",
      "Opossum",
      "Oryx",
      "Ostrich",
      "Otter",
      "Owl",
      "Oyster",
      "Panther",
      "Parrot",
      "Partridge",
      "Peafowl",
      "Pelican",
      "Penguin",
      "Pheasant",
      "Pig",
      "Pigeon",
      "Pony",
      "Porcupine",
      "Porpoise",
      "Quail",
      "Quelea",
      "Quetzal",
      "Rabbit",
      "Raccoon",
      "Rail",
      "Ram",
      "Rat",
      "Raven",
      "Red deer",
      "Reindeer",
      "Rook",
      "Salmon",
      "Sardine",
      "Scorpion",
      "Seahorse",
      "Seal",
      "Shark",
      "Sheep",
      "Shrew",
      "Skunk",
      "Snail",
      "Snake",
      "Sparrow",
      "Spider",
      "Squid",
      "Squirrel",
      "Starling",
      "Stingray",
      "Stinkbug",
      "Stork",
      "Swallow",
      "Swan",
      "Tapir",
      "Tarsier",
      "Termite",
      "Tiger",
      "Toad",
      "Trout",
      "Turkey",
      "Turtle",
      "Viper",
      "Vishaal",
      "Vulture",
      "Wallaby",
      "Walrus",
      "Wasp",
      "Weasel",
      "Whale",
      "Wildcat",
      "Wolf",
      "Wombat",
      "Woodcock",
      "Worm",
      "Wren",
      "Yak",
      "Zebra"
  ];
    if (value === "") {
      value = animals[Math.floor(Math.random()*(animals.length))];
    }
    const body = { name: value, isPrivate: roomPrivate, boardSize: boardSize };
    post("/api/room", body).then((room) => {
      props.addNewRoomHost(room._id);
    });
  };

  return (
    <>
      <NewPageInput defaultText="Enter room name" onSubmit={AddRoom} setRoomPrivate={setRoomPrivate} setBoardSize={setBoardSize} roomPrivate={roomPrivate} />
    </>
  );
  //What will the props be?
}

export { NewRoom };