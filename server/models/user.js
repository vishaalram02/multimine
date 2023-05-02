const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  // times: [Number],
  smallTimes: [{ score: Number, boardSize: String, gameTime: {
    type: Date,
    // `Date.now()` returns the current unix timestamp as a number
    default: Date.now,
  } }],
  mediumTimes: [{ score: Number, boardSize: String, gameTime: {
    type: Date,
    // `Date.now()` returns the current unix timestamp as a number
    default: Date.now,
  } }],
  largeTimes: [{ score: Number, boardSize: String, gameTime: {
    type: Date,
    // `Date.now()` returns the current unix timestamp as a number
    default: Date.now,
  } }],
  topscoreSmall: { score: Number, boardSize: String, gameTime: {
    type: Date,
    default: Date.now
  }},
  topscoreMedium: { score: Number, boardSize: String, gameTime: {
    type: Date,
    default: Date.now
  }},
  topscoreLarge: { score: Number, boardSize: String, gameTime: {
    type: Date,
    default: Date.now
  }},
  dateCreated: {
    type: Date,
    default: Date.now
  },
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
