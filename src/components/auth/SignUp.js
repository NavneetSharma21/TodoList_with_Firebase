import React, { useState } from "react";
import { NavLink } from 'react-router-dom'
import { useFirebase } from "./firebase";

const SignUp = () => {

  const Firebase = useFirebase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <form action="" className="SignUp">
        <h1>SignUp Page</h1>
        <input type="email" name="email" placeholder="enter your email" onChange={(e) => setEmail(e.target.value)}></input>
        <input type="password" name="password" value={password} placeholder="enter your password" onChange={(e) => setPassword(e.target.value)}></input>
        <button onClick={(e) => {
          e.preventDefault();
          Firebase.handleSignUp(email, password)
        }}>SignUp</button>
        <p>Already have an account <NavLink className='navLink' to="https://todolist-with-firebase.onrender.com/login">Login</NavLink></p>
      </form>
    </div>
  )
}
export default SignUp;