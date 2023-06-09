import React, { useEffect } from 'react'
import './css/history.css'

const History = (props) => {

  return (<>
    { props.opponentUser===undefined?<></>:
        <div className='box'>
              <h1>Game With {props.opponentUser}</h1>
          {    props.state==="won"?
              <h5>{props.winner} won the Game</h5>
              :
              <h5>Game Tied</h5>
          }
          <span>{props.currentDate} , {props.currentTime}</span>
          <a href={`/viewGame?id=${props.indx}`} className="viewGame"> <button id={props.indx}>View Game</button></a>
      </div>}
    </>
  )
}

export default History