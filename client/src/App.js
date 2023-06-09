import './App.css';
import Login from './components/Login';
import SignUp from './components/SignUp';
import { StreamChat } from "stream-chat";
//allow us to pass client as props
import {Chat} from "stream-chat-react"
import Cookies from "universal-cookie"
import { useState } from 'react';
import JoinGame from './components/JoinGame';
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Welcome from './components/Welcome';

function App() {
  const api_key = process.env.process.env.API_KEY;
  const cookies = new Cookies();
  const token = cookies.get("token");
  const client = StreamChat.getInstance(api_key);
  const [isAuth, setIsAuth] = useState(false);
  if (token) {
    client.connectUser({
      id: cookies.get("userId"),
      email: cookies.get("email"),
      name: cookies.get("userName"),
      firstName: cookies.get("firstName"),
      lastName: cookies.get("lastName"),
      hashedPassword: cookies.get("hashedPassword"),
      mess:cookies.get("mess"),
    }, token).then((user) => {
      setIsAuth(true);
    });
  }


  const logOut = () => {
      cookies.remove("userId")
      cookies.remove("email")
      cookies.remove("token")
      cookies.remove("userName")
      cookies.remove("firstName")
      cookies.remove("lastName")
      cookies.remove("channelName")
      cookies.remove("hashedPassword")
      cookies.remove("mess")
      cookies.remove("isAuth");
      client.disconnectUser();
      setIsAuth(false);
  }
  return (
    <div className="App">
      {isAuth ? (
        <Chat client={client}>
          <JoinGame/>
          <button className='logout' onClick={logOut}>Logout</button>
        </Chat>
      ) : (
        <>
          <BrowserRouter>
          <Routes>
            <Route path='/' exact element={<Welcome/>}></Route>
            <Route path='/signup' exact element={<SignUp setIsAuth={setIsAuth} />}></Route>
            <Route path='/login' exact element={<Login setIsAuth={setIsAuth} />}></Route>
          </Routes>
          </BrowserRouter>
        </>
      )}
    </div>
  );
}

export default App;
