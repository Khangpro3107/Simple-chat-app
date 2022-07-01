import axios from "axios";
import React, { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault();
    // try {
    //   const res = await axios.post("/api/login", {username: username, password:password})
      
    // } catch (error) {
      
    // }
    localStorage.setItem("username", username);
    setUsername("");
    window.location.reload();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Login;
