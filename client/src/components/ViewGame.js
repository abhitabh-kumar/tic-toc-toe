import React, { useEffect, useState } from 'react'
import Cookies from "universal-cookie"
import "./css/board.css"

const ViewGame = () => {
    const cookies = new Cookies();
    const [board,setBoard]=useState(["X","0","","","X","","0","X",""]);
    const [winner,setWinner]=useState(null);
    const [state,setState]=useState(null);
    const [your,setYour]=useState(null);
    const [opponentUser,setOpponentUser]=useState(null);
    useEffect(()=>{
        var url_string = window.location;
        var url = new URL(url_string);
        var id= url.searchParams.get("id");
        cookies.get("mess").map((val,indx)=>{
            if(id==indx){
                setWinner(val.winner);
                setState(val.state)
                setOpponentUser(val.opponentUser);
                setBoard(val.board);
                setYour(val.your);
                return "";
            }
            return "";
        });
    },[])

    const newGame=()=>{
        let url = window.location.href;
        window.location = url.substring(0, url.lastIndexOf('/'))+"/startGame";
    }
  return (
    <div className='gameGround'>
        <h1>Game with {opponentUser}</h1>
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
            state==="won"?<button className='moves'>{winner} win</button>:<button className='moves'>It's Draw</button>
            
        }  
        <div className="row">
            <div className='square' style={board[0]==="X"?{color: 'rgb(0, 153, 255)'}:{color:'red'}} > {board[0]} </div>
            <div className='square' style={board[1]==="X"?{color: 'rgb(0, 153, 255)'}:{color:'red'}} > {board[1]} </div>
            <div className='square' style={board[2]==="X"?{color: 'rgb(0, 153, 255)'}:{color:'red'}} > {board[2]} </div>
        </div>
        <div className="row">
             <div className='square' style={board[3]==="X"?{color: 'rgb(0, 153, 255)'}:{color:'red'}} > {board[3]} </div>
            <div className='square' style={board[4]==="X"?{color: 'rgb(0, 153, 255)'}:{color:'red'}} > {board[4]} </div>
            <div className='square' style={board[5]==="X"?{color: 'rgb(0, 153, 255)'}:{color:'red'}} > {board[5]} </div>
        </div>
        <div className="row">
            <div className='square' style={board[6]==="X"?{color: 'rgb(0, 153, 255)'}:{color:'red'}} > {board[6]} </div>
            <div className='square' style={board[7]==="X"?{color: 'rgb(0, 153, 255)'}:{color:'red'}} > {board[7]} </div>
            <div className='square' style={board[8]==="X"?{color: 'rgb(0, 153, 255)'}:{color:'red'}} > {board[8]} </div>
        </div>
    </div>
    <button className='viewGameBtn' onClick={newGame}>Start a new game</button>
    </div>
  )
}

export default ViewGame