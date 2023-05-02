const mongoose = require("mongoose");

const RunSchema = new mongoose.Schema({
    userid: String,
    username: String,
    score: Number,
    gameTime: {
        type: Date,
        default: Date.now
    }
});

// compile model from schema
module.exports = mongoose.model("run", RunSchema);
