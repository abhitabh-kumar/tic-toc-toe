import React, {useState } from 'react'
//allow us to use client details which are pass from app.js
//Channel work as Chat do in App.js
import { useChatContext, Channel } from 'stream-chat-react';
import Game from './Game';
import Cookies from "universal-cookie"
import History from './History';
import "./css/joinGame.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ViewGame from './ViewGame';
import Alert from './Alert';

const JoinGame = () => {
  const [rivalEmail, setRivalEmail] = useState("");
  const { client } = useChatContext();
  const [channel, setChannel] = useState(null);
  const [alert, setAlert] = useState(null);
  const showAlert = (message, type) => {
      setAlert({
          msg: message,
          type: type
      })
      setTimeout(() => {
          setAlert(null);
      }, 2000);
  }

  const cookies = new Cookies();
  const createChannel = async () => {
    const response = await client.queryUsers({ email: { $eq: rivalEmail } });
    if (response.users.length === 0) {
      showAlert("user Not Found", "danger");
      return;
    }
    const newChannel = await client.channel("messaging", {
      members: [client.userID, response.users[0].id],
    });
    await newChannel.watch();
    setChannel(newChannel);
    console.log(cookies.get("mess"));
    localStorage.setItem("opponentUser", response.users[0].name);
  }
  return (
    <>
      {channel ?
        <Channel channel={channel}>
          <Game channel={channel} setChannel={setChannel} />
        </Channel> : (
          <BrowserRouter>
            <Routes>
              <Route path='/' exact element={
                <div className="staterGame">
                  {
                    cookies.get("mess").length === 1 ?
                      <div className="gameFront">
                        <p>Your Games</p>
                        <h1>No Games Found</h1>
                        <a href="/startGame" className='gamebtn'><button>Start a new game</button></a>
                      </div> : (
                        <div className="allDetails">
                          <p>Your Games</p>
                          {
                            cookies.get("mess").map((val, indx) => {
                              return <History currentDate={val.currentDate} currentTime={val.currentTime} opponentUser={val.opponentUser} winner={val.winner} state={val.state} key={indx} indx={indx} />
                            })
                          }
                          <a href="/startGame" className='gamebtn2'><button>+ new game</button></a>
                        </div>
                      )
                  }
                </div>

              }></Route>
              <Route path='/startGame' exact element={
                <div className='joinGame'>
                  <label className="joinGameText">
                    Start a new game
                  </label>
                  <h1>Whom do You want to play with?</h1>
                  <p>Email</p>
                  <input type="text" placeholder='Type their email here' onChange={(e) => { setRivalEmail(e.target.value) }} />
                  <button className='nowGameStart' onClick={createChannel}>Start Game</button>
                </div>
              }></Route>
              <Route path='/viewGame' element={<ViewGame/>} ></Route>
            </Routes>
          </BrowserRouter>
        )}
        <Alert alert={alert} />
    </>
  )
}

export default JoinGame