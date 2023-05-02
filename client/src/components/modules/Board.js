import React, { Component, useState } from "react";
import url from "socket.io-client/lib/url";
import "./Board.css";
import Cell from "./Cell";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities";

/**
* PropTypes
* @param {Number} height should be 16
* @param {Number} width should be 30
* @param {Number} mines
* @param {String} room this is the room ID
* @param {Array[Number]} mineList List of 0's and 1's where the 1's indicate mines
* @param {Boolean} frozen tells you whether or not you are on a freeze.
* setProgress sets the state of progress
*/

const Board = (props) => {
    let currentProgress = 0;

    let data = Array(props.height*props.width).fill(0);

    const bounds = (x,y) => {
        let ok = (0 <= x) && (x < props.height) && (0 <= y) && (y < props.width);
        return ok;
    }

    const startsquare = [5,5];
    
    const getInitState = () => {
        let initState = [];
        for(let i=0;i<props.height;++i){
            let row = [];
            for(let j=0;j<props.width;++j){
                row.push({
                    hidden: true,
                    mine: false, 
                    flag: false,
                    adjMines: 0,
                    status: 'block',
                    
                });
            }
            initState.push(row);
        }

        for(let i=0;i<props.height;++i){
            for(let j=0;j<props.width;++j){
                if(props.mineList[i][j] === 1){
                    initState[i][j].mine = true;
                }
            }
        }
        
        
        for(let i=0;i<props.height;++i){
            for(let j=0;j<props.width;++j){
                let adjCount = 0;
                for(let x=-1;x<=1;++x){
                    for(let y=-1;y<=1;++y){
                        if(bounds(i+x,j+y) && initState[i+x][j+y].mine){
                            ++adjCount;
                        }
                    }
                }
                initState[i][j].adjMines = adjCount;
            }
        }

        initState[startsquare[0]][startsquare[1]].status = "golden"; // this is the square that must be an interior square.
        return initState;
    }

    const [cellState, setCellState] = useState(getInitState());
    
    const handleClick = (i,j) => {
        if(props.frozen > 0 || props.countdown > 0){
            return;
        }else{
            revealCell(i,j);
        }
    };

    const revealCell = (i,j) => {
        if(cellState[i][j].flag){
            return;
        }

        let uCellState = [...cellState];
        
        if(cellState[i][j].hidden){

            uCellState[i][j].hidden = false;
            if(cellState[i][j].mine){
                uCellState[i][j].status = 'mine';
                
                socket.emit("frozenUpdate", {room: props.room, time: props.freezeTime});
            }else{
                currentProgress++;

                let mines = cellState[i][j].adjMines;

                if(mines !== 0){
                    uCellState[i][j].status = 'num-' + mines.toString(); 
                }else{
                    uCellState[i][j].status = 'empty';
                    for(let x=-1;x<=1;++x){
                        for(let y=-1;y<=1;++y){
                            if(bounds(i+x,j+y) && cellState[i+x][j+y].hidden){
                                revealCell(i+x,j+y);
                            }
                        }
                    }
                }
                
            }
            
        }else{
            if(!cellState[i][j].mine && cellState[i][j].adjMines !== 0){
                let adjCount = 0;
                for(let x=-1;x<=1;++x){
                    for(let y=-1;y<=1;++y){
                        if(bounds(i+x,j+y) && (cellState[i+x][j+y].flag || (cellState[i+x][j+y].mine && !cellState[i+x][j+y].hidden))){
                            adjCount++;
                        }
                    }
                }
                if(adjCount === cellState[i][j].adjMines){
                    for(let x=-1;x<=1;++x){
                        for(let y=-1;y<=1;++y){
                            if(bounds(i+x,j+y) && cellState[i+x][j+y].hidden){
                                revealCell(i+x,j+y);
                            }
                        }
                    }
                }
            }
        }

        setCellState(uCellState);
        props.setProgress(currentProgress+props.progress);
    }

    const flagCell = (i,j) => {
        let uCellState = [...cellState];

        if(cellState[i][j].hidden){
            if(cellState[i][j].flag){
                uCellState[i][j].flag = false;
                uCellState[i][j].status = 'block';
            }else{
                uCellState[i][j].flag = true;
                uCellState[i][j].status = 'flag';
            }
        }

        setCellState(uCellState);
    }
    
    return (
        <>
            {data.map((x, i) => (
                <div key = {i} className = { 'cell '+ cellState[Math.floor(i/props.width)][i%props.width].status} onClick = {() => handleClick(Math.floor(i/props.width), i%props.width)} onContextMenu = {(e) => {e.preventDefault(), flagCell(Math.floor(i/props.width), i%props.width)}}>
                    <Cell />
                </div>
                    
            ))}
        </>
    );
};

export default Board;