const mongoose = require("mongoose");

//define a Room schema for the database
const RoomSchema = new mongoose.Schema({ // it still gets an _id in addition to this roomId thing
    name: String,
    code: String,
    isPrivate: Boolean,
    boardSize: String, // can be small, medium, large
    status: String,
});

// compile model from schema
module.exports = mongoose.model("room", RoomSchema);