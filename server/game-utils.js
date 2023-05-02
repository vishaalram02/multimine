const roomCode = {};
const gameStatus = {};
const gameTimer = {};
const frozenList = {};
const countdown = {};

const initMines = (height, width, mines) => {
    let mineArray = [];
    for(let i=0; i<height; i++) {
        let row = [];
        for (let j=0; j<width; j++) {
            row.push(0);
        }
        mineArray.push(row);
    }
    let curMines = 0;
    while(curMines < mines){
        let x = Math.floor(height*Math.random());
        let y = Math.floor(width*Math.random());
        if(mineArray[x][y] !== 1 && !(x==4 && y==4) && !(x==4 && y==5) && !(x==4 && y==6) && !(x==5 && y==4) && !(x==5 && y==5) && !(x==5 && y==6) && !(x==6 && y==4) && !(x==6 && y==5) && !(x==6 && y==6) ){
            curMines++;
            mineArray[x][y] = 1;
        }
    }
    return mineArray;
}

const genRoomCode = () => {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = "";
    for(let i=0;i<5;++i){
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

const setRoomCode = (room, code) => {
    roomCode[room] = code;
};

const getRoomCode = (room) => {
    return roomCode[room];
}
const setGameStatus = (room, status) => {
    gameStatus[room] = status;
};

const getGameStatus = (room) => {
    return gameStatus[room];
};

const updateGameTimer = () => {
    for(game in gameTimer){
        if(gameStatus[game] === "during"){
            gameTimer[game] += 100;

            for(user in frozenList[game]){
                if(frozenList[game][user] > 0){
                    frozenList[game][user] -= 100;
                }
            }
        }else if(gameStatus[game] === "countdown"){
            countdown[game] -= 100;
        }
    }
};

const setGameTimer = (room, time) => {
    gameTimer[room] = time;
};

const setCountdown = (room, time) => {
    countdown[room] = time;
};

const getCountdown = (room) => {
    return countdown[room];
};

const getGameTimer = () => {
    return gameTimer;
}

const updateFrozen = (room, user, time) => {
    if(!frozenList[room]){
        frozenList[room] = {};
    }
    if(!frozenList[room][user]){
        frozenList[room][user] = 0;
    }
    frozenList[room][user] += time;
};

const getFrozen = (room) => {
    return frozenList[room];
};

module.exports = {
    initMines: initMines, 
    genRoomCode: genRoomCode, 
    updateGameTimer: updateGameTimer,
    getGameTimer: getGameTimer,
    setGameStatus: setGameStatus, 
    getGameStatus: getGameStatus,
    setGameTimer: setGameTimer,
    getRoomCode: getRoomCode,
    setRoomCode: setRoomCode,
    updateFrozen: updateFrozen,
    getFrozen: getFrozen,
    setCountdown: setCountdown, 
    getCountdown: getCountdown,
};