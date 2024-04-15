import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useFirebase } from "./firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const Firebase = useFirebase();
  return (

    <div >
      <form action="" className="SignUp">
        <h1>Login Page</h1>
        <input type="email" name="email" placeholder="enter your email" onChange={(e) => setEmail(e.target.value)}></input>
        <input type="password" name="password" placeholder="enter your password" onChange={(e) => setPassword(e.target.value)}></input>
        <button onClick={(e) => {
          e.preventDefault();
          Firebase.handleLogin(email, password)
        }}>Login</button>
        <p>Don't have account <NavLink className='navLink' to="/">SignUp</NavLink> </p>
      </form>
    </div>
  )
}
export default Login;