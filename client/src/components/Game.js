import React, { useState } from 'react'
import Board from './Board';
import "./css/game.css"

const Game = ({channel,setChannel}) => {
    const [players,setPlayers]=useState(channel.state.watcher_count===2);
    const [result,setResult]=useState({winner:"none",state:"none"})
    
    channel.on("user.watching.start",(event)=>{
        setPlayers(event.watcher_count===2);
    })
   if(!players){
    return <div className='wait'>Waiting for Opponent Player...</div> 
   }
  return (
    <div className='gameContainer'>
        <Board result={result} setResult={setResult}/>
        {result.state==="none"?<></>:(<button className='otherGame' onClick={async()=>{
          await channel.stopWatching();
          setChannel(null);
        }}>start another game</button>)}
    </div>
  )
}

export default Game