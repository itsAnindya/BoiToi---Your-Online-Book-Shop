import React from 'react';
import './login_signup.css'

import user_icon from '../assets/person.png'
import email_icon from '../assets/email.png'
import password_icon from '../assets/password.png'

const LoginSignup = () => {
    return (
        <div className="container">
            <div className="header">
                <div className="text">SignUp</div>
                <div className="underline"></div>
            </div>
            <div className="input">
                <img src={user_icon} />
                <input type="text"/>
            </div>
            <div className="input">
                <img src={email_icon} />
                <input type="email"/>
            </div>
            <div className="input">
                <img src={password_icon} />
                <input type="password"/>
            </div>
            <div className="forgot-password">Lost Password? <span>Click here!</span></div>
            <div className="submit-container">
                <div className="submit">Sign Up</div>
                <div className="submit">Login</div>
            </div>
        </div>
    )
}

export default LoginSignup