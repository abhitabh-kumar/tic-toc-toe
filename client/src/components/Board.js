import React, { useEffect, useState } from 'react'
//beacuse you wrap with channel is JoinGame so here you don not need to take as props
import { useChannelStateContext,useChatContext} from 'stream-chat-react';
import Square from './Square'
import { Patterns } from './WinningPatterns';
import Cookies from 'universal-cookie';
import "./css/board.css"

const Board = ({result,setResult}) => {
    const cookies=new Cookies();

    const [board,setBoard]=useState(["","","","","","","","",""]);
    const [player,setPlayer]=useState("X");
    const [turn,setTurn]=useState("X");
    const {channel}=useChannelStateContext();
    const {client}=useChatContext();
    const [your,setYour]=useState(null);
    const [lastIndex,setLastIndex]=useState(100);

    useEffect(()=>{
        if(lastIndex===100){
            checkTie();
            checkWin();
        }
    },[board])

    const chooseSquare=async (square)=>{
        if(turn===player && board[square]===""){
            
            setBoard(board.map((val,idx)=>{
                if(idx===square && val===""){
                    return player;
                }
                else if(idx===lastIndex) return "";
                return val;
            }))
            setLastIndex(square);
        }
    }
    const submit=async (square)=>{
        setLastIndex(100);
        setTurn(player==="X"?"0":"X");
        //by this you can send data to other channel member
        await channel.sendEvent({
            type:"game-move",
            data:{square:square,player},
        })
        checkTie();
        checkWin();
    }
    const checkWin=()=>{
        Patterns.forEach(async (currentPattern)=>{
            const firstPlayer=board[currentPattern[0]];
            if(firstPlayer==="") return;
            let foundWinningPatter=true;
            currentPattern.forEach((idx)=>{
                if(board[idx]!==firstPlayer){
                    foundWinningPatter=false;
                }
            })
            if(foundWinningPatter){
                setResult({winner:board[currentPattern[0]]===your?"you":localStorage.getItem("opponentUser"),state:"won"});
                let currentDate = new Date().toJSON().slice(0, 10);
                let currentTime= new Date().toJSON().slice(11, 19);
                const update = {
                    id:client.userID,
                   set:{ 
                        mess:[{opponentUser:localStorage.getItem("opponentUser"),currentDate:currentDate,your:your,currentTime:currentTime,state:"won",board:board,winner:board[currentPattern[0]]===your?"you":localStorage.getItem("opponentUser")},...client.user.mess],
                     }
                          }
                const response = await client.partialUpdateUser(update);
                let users=response.users;
                cookies.set("mess",users[Object.keys(users)[0]].mess);
            }
        })
    }
    
    const checkTie=async()=>{
        let filled=true;
        board.forEach((square)=>{
            if(square===""){
                filled=false;
            }
        })
        if(filled){
            
            setResult({winner:"none",state:"tie"});
            let currentDate = new Date().toJSON().slice(0, 10);
                let currentTime= new Date().toJSON().slice(11, 19);
                const update = {
                    id:client.userID,
                   set:{ 
                        mess:[{opponentUser:localStorage.getItem("opponentUser"),currentDate:currentDate,your:your,currentTime:currentTime,state:"tie",winner:"none",board:board},...client.user.mess],
                     }
                          }
             const response = await client.partialUpdateUser(update);
             let users=response.users;
             cookies.set("mess",users[Object.keys(users)[0]].mess);
            console.log(users[Object.keys(users)[0]].mess);
        }
    }

    //listen that data comes or not
    let first=0;
    channel.on((event)=>{
        if(event.type==="game-move" && event.user.id!==client.userID){
            if(first===0 && event.data.player==="X") setYour("0");
            else if(first===0 && event.data.player==="0") setYour("X");
            first++;

            const currentPlayer=event.data.player==="X"?"0": "X";
            setPlayer(currentPlayer);
            setTurn(currentPlayer);

            setBoard(board.map((val,idx)=>{
                if(idx===event.data.square && val===""){
                    return event.data.player;
                }
                return val;
            }))
        }
    })
  return (
    <div className='gameGround'>
    <h1>Game with {localStorage.getItem("opponentUser")}</h1>
    <p>Your piece</p>
    {
        your===null?<h2>_</h2>:(
            <>
            {your==="X"?<h2 style={{color: 'rgb(0, 153, 255)'}}>X</h2>:<h2 style={{color: 'rgb(255, 77, 0)'}}>0</h2>}
            </>
        )
    }
    <div className='board'>
    {
            result.state==="none"?<>
            {
        turn===player?<button className='moves'>Your Move</button>:<button className='moves'>Their Move</button>
                 }
            </> :<>{
                result.state==="won"?<button className='moves'>{result.winner} win</button>:<button className='moves'>It's Draw</button>
            }
            </>
        }  
        <div className="row">
            <Square chooseSquare={()=>{chooseSquare(0)}} val={board[0]}/>
            <Square chooseSquare={()=>{chooseSquare(1)}} val={board[1]}/>
            <Square chooseSquare={()=>{chooseSquare(2)}} val={board[2]}/>
        </div>
        <div className="row">
            <Square chooseSquare={()=>{chooseSquare(3)}} val={board[3]}/>
            <Square chooseSquare={()=>{chooseSquare(4)}} val={board[4]}/>
            <Square chooseSquare={()=>{chooseSquare(5)}} val={board[5]}/>
        </div>
        <div className="row">
            <Square chooseSquare={()=>{chooseSquare(6)}} val={board[6]}/>
            <Square chooseSquare={()=>{chooseSquare(7)}} val={board[7]}/>
            <Square chooseSquare={()=>{chooseSquare(8)}} val={board[8]}/>
        </div>
    </div>
        {
            result.state==="none"?<>
            {turn===player?<button className='submitMove' id='btn1' onClick={()=>{submit(lastIndex)}}>submit</button>:<button id='btn2' className='submitMove' disabled>Waiting for {localStorage.getItem("opponentUser")}</button>}
            </> :<></>
        }    
    </div>
    
  )
}

export default Board