import Axios from "axios";
import React, { useEffect, useState } from 'react'
import Cookies from 'universal-cookie';
import "./css/login.css"
import Alert from './Alert';

function Login({setIsAuth}) {
    const cookies=new Cookies();
    const [email,setEmail]=useState(null);
    const [password,setPassword]=useState(null);
    const [alert,setAlert]=useState(null);
    useEffect(()=>{
        const isAuth=cookies.get("isAuth");
      if(isAuth){
        let url=window.location.href;
        window.location=url.substring(0, url.lastIndexOf('/'));
      }
    },[])
    const showAlert=(message,type)=>{
        setAlert({
          msg:message,
          type:type
        })
        setTimeout(() => {
          setAlert(null);
        },2000);
      }

    const login=()=>{
        Axios.post("http://localhost:3001/login",{email,password}).then(res=>{
            if(res.status===200){
                showAlert("Login SuccessFull !","success");
                const {token,firstName,lastName,userName,email,userId,mess}=res.data;
            cookies.set("token",token);
            cookies.set("userId",userId);
            cookies.set("firstName",firstName);
            cookies.set("lastName",lastName);
            cookies.set("userName",userName);
            cookies.set("email",email);
            cookies.set("mess",mess);
            cookies.set("isAuth",true);
            setTimeout(() => {
                let url=window.location.href;
                window.location=url.substring(0, url.lastIndexOf('/'));
                setIsAuth(true);
            },2500);
           
            }
            else{
                showAlert(res.data.message,"danger");
            }
        }).catch((err) => {
            showAlert(err.message,"danger");
                console.error(err);
            });
    }
  return (
    <>
    <div className='login'>
        <label className="loginText">
            Login
        </label>
        <h1>Please enter your details</h1>
        <p>email</p>
        <input type="email" placeholder='Type your email here' onChange={(e)=>{
            setEmail(e.target.value);
        }}/>
        <p>Password</p>
        <input type="password" placeholder='Type your password here' onChange={(e)=>{
            setPassword(e.target.value);
        }}/>
    </div>
        <button onClick={login} className="loginButton">Login</button>
        <Alert alert={alert}/>
        </>
  )
}

export default Login