let io;

const socket = require("socket.io-client/lib/socket");
const gameUtils = require("./game-utils.js");
const Room = require("./models/room");
const ObjectId = require('mongodb').ObjectId;

const userToSocketMap = {}; // maps user ID to socket ID
const socketToUserMap = {}; // maps socket ID to userID
const userToRoom = {} //  maps user to room
const roomToUser = {} //  maps room to users

const getAllConnectedUsers = () => Object.values(socketToUserMap);
const getSocketFromUserID = (userid) => userToSocketMap[userid];
const getUserFromSocketID = (socketid) => socketToUserMap[socketid];
const getSocketFromSocketID = (socketid) => io.sockets.connected[socketid];
const getRoomFromUser = (userid) => userToRoom[userid];
const getUserFromRoom = (room) => roomToUser[room];

const getNamesFromRoom = (room) => {
  let users = [];
  getUserFromRoom(room).map((user) => {
    users.push(user);
  });
  return users;
}

const addUser = (user, socket) => {
  const oldSocket = userToSocketMap[user._id];

  if (oldSocket && oldSocket.id !== socket.id) {
    // there was an old tab open for this user, force it to disconnect
    leaveRoom(user);
    io.to(oldSocket.id).emit("userDisconnect");
    delete socketToUserMap[oldSocket.id];
  }

  userToSocketMap[user._id] = socket;
  socketToUserMap[socket.id] = user;
};

const removeUser = (user, socket) => {
  if (user){
    if(socket === userToSocketMap[user._id]){
      delete userToSocketMap[user._id];
      delete socketToUserMap[socket.id];
    } 
  }
  io.emit("activeUsers", { activeUsers: getAllConnectedUsers() });
};

const addRoom = (user, room) => {
  let oldRoom = getRoomFromUser(user._id);
  if(oldRoom){
    getSocketFromUserID(user._id).leave(oldRoom);
    roomToUser[oldRoom] = roomToUser[oldRoom].filter((thing) => thing._id !== user._id);
  }
  // console.log(`${user.name} has joined room ${room}`);
  getSocketFromUserID(user._id).join(room);
  
  userToRoom[user._id] = room;
 
  if(roomToUser[room]){
    roomToUser[room].push(user);
  }else{
    roomToUser[room] = [user];
  }
  io.to(room).emit("roomupdate", getNamesFromRoom(room));
}

const leaveRoom = (user) => {
  if(userToRoom[user._id]){
    const room = userToRoom[user._id];
    getSocketFromUserID(user._id).leave(room);

    // console.log(`${user.name} has left room ${room}`);

    roomToUser[room] = roomToUser[room].filter((thing) => thing._id !== user._id);
   // console.log(`${room} array is now ${roomToUser[room]} with size ${roomToUser[room].length}`);
    
    delete userToRoom[user._id];
    io.to(room).emit("roomupdate", getNamesFromRoom(room));

    if(getUserFromRoom(room).length === 0){
      const query = {code: gameUtils.getRoomCode(room)};
      gameUtils.setGameStatus(room, "after");
      Room.deleteOne(query).then(() => {
        io.emit("removeRoom", room);
      });
    }
  }
}


module.exports = {
  init: (http) => {
    io = require("socket.io")(http);

    const updateTimes = () => {
      gameUtils.updateGameTimer();
      const times = gameUtils.getGameTimer();
      for(room in times){
        if(gameUtils.getGameStatus(room) === "during"){
          io.to(room).emit("timeUpdate", times[room]);
          io.to(room).emit("roomFrozenUpdate", gameUtils.getFrozen(room));
        }else if(gameUtils.getGameStatus(room) === "countdown"){
          io.to(room).emit("countdownUpdate", gameUtils.getCountdown(room));
          if(gameUtils.getCountdown(room) === 0){
            gameUtils.setGameStatus(room, "during");
          }
        }
      }
    };

    setInterval(updateTimes, 100);



    io.on("connection", (socket) => {
      console.log(`socket has connected ${socket.id}`);
      
      socket.on("disconnect", (reason) => {
        console.log(`socket has disconnected ${socket.id}`);
        const user = getUserFromSocketID(socket.id);
        
        if(user){
          leaveRoom(user);
          removeUser(user, socket.id);
          console.log(`goodbye ${user.name}`);
        }
      });


      socket.on("joinroomSock", (room) => {
        const user = getUserFromSocketID(socket.id);
        if(user){
          addRoom(user,room);
        }
      });

      socket.on("leaveroomSock", (room) => {
        const user = getUserFromSocketID(socket.id);
        if(user){
          leaveRoom(user);        
        }
      });

      socket.on("startGame", ({room, height, width, mines}) => {
        const query = {_id: ObjectId(room)};
        Room.findOne(query).then((thing) => {
          if (thing !== null) {
            thing.status = "ongoing";
            thing.save();
            const mineList = gameUtils.initMines(height, width, mines);
            io.to(room).emit("initmines", mineList);
            io.to(room).emit("showgame");
            io.emit("startstatus", room);
            gameUtils.setGameStatus(room, "countdown");
            gameUtils.setCountdown(room, 3000);
            gameUtils.setGameTimer(room, 0);
          }
        });  
      });

      socket.on("endGame", ({room, socketid}) => {
        const winner = getUserFromSocketID(socketid);
        const winTime = gameUtils.getGameTimer()[room];
        io.to(room).emit("hidegame", {winner: winner, winTime:winTime});
      });

      socket.on("progressUpdate", ({progress, room}) => {
        const user = getUserFromSocketID(socket.id);
        io.to(room).emit("newProgressUpdate", {user: user._id, progress: progress});
      });

      socket.on("frozenUpdate", ({room, time}) => {
        const user = getUserFromSocketID(socket.id);
        gameUtils.updateFrozen(room, user._id, time);
      });

      socket.on("roomMessage", ({message, room}) => {
        console.log(`The message ${message.content} reached the server socket at the room: ${room}`);
        io.to(room).emit("newRoomMessage", message);
      });
    });
  },

  roomToUser: roomToUser,
  addUser: addUser,
  removeUser: removeUser,
  addRoom: addRoom, 
  leaveRoom: leaveRoom, 

  getSocketFromUserID: getSocketFromUserID,
  getUserFromSocketID: getUserFromSocketID,
  getSocketFromSocketID: getSocketFromSocketID,
  getAllConnectedUsers: getAllConnectedUsers,
  getRoomFromUser: getRoomFromUser, 
  getUserFromRoom: getUserFromRoom,
  getNamesFromRoom: getNamesFromRoom,
  getIo: () => io,
};
