import React from 'react'
import "./css/welcome.css"
const Welcome = () => {
  return (
    <div className='start'>
        <div className='content'>
            <p>async</p>
            <span>tic tac toe</span>
        </div>
        <div className="bttn">
            <a href="/login" className='loginbtn'><button>Login</button></a>
            <a href="/signup" className='signupbtn'><button>Register</button></a>
        </div>
    </div>
  )
}

export default Welcome