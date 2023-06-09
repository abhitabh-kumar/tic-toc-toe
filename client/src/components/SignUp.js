import React, { useEffect, useState } from 'react'
import Axios from "axios";
import Cookies from "universal-cookie"
import "./css/signup.css"
import Alert from './Alert';

function SignUp({ setIsAuth }) {
    const cookies = new Cookies();
    const [user, setUser] = useState(null);
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
    useEffect(()=>{
        const isAuth=cookies.get("isAuth");
        if(isAuth){
          let url=window.location.href;
          window.location=url.substring(0, url.lastIndexOf('/'));
        }
      },[])
    const signUp = () => {
        if (user === null) {
            showAlert("fill all field !", "danger");
        } else {

            Axios.post("https://tic-toc-toe-p0ls.onrender.com/signUp", user).then(res => {
                if (res.status===200) {
                    showAlert("Registration SuccessFull !", "success");
                    
                    const { token, userId, firstName, lastName, userName, email, hashedPassword, mess } = res.data;
    
                    cookies.set("token", token);
                    cookies.set("userId", userId);
                    cookies.set("firstName", firstName);
                    cookies.set("lastName", lastName);
                    cookies.set("userName", userName);
                    cookies.set("hashedPassword", hashedPassword);
                    cookies.set("email", email);
                    cookies.set("mess", mess);
                    cookies.set("isAuth",true);
                    setTimeout(() => {
                        let url=window.location.href;
                        window.location=url.substring(0, url.lastIndexOf('/'));
                        setIsAuth(true);
                    }, 2500);
                }
                else {
                    showAlert(res.data.mess, "danger");
                }
            })
                .catch((err) => {
                    showAlert(err.message, "danger");
                    console.log("error hai")
                    console.error(err);
                });
        }
    }
    return (
        <>
            <div className='signUp'>
                <label className="signUpText">
                    SignUp
                </label>
                <h1>Let's get to know you better!</h1>
                <p>First Name</p>
                <input placeholder='First Name' onChange={(e) => {
                    setUser({ ...user, firstName: e.target.value });
                }} />
                <p>Last Name</p>
                <input placeholder='Last Name' onChange={(e) => {
                    setUser({ ...user, lastName: e.target.value });
                }} />
                <p>username</p>
                <input placeholder='User Name' onChange={(e) => {
                    setUser({ ...user, userName: e.target.value });
                }} />
                <p>Email</p>
                <input type="email" placeholder='Email' onChange={(e) => {
                    setUser({ ...user, email: e.target.value });
                }} />
                <p>Password</p>
                <input type="password" placeholder='Password' style={{ marginBottom: "4rem" }} onChange={(e) => {
                    setUser({ ...user, password: e.target.value });
                }} />
            </div>
            <button onClick={signUp} className="signupButton">Sign Up</button>
            <Alert alert={alert} />
        </>
    )
}

export default SignUp