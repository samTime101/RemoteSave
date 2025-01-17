import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
function AdminLogin() {
  const address = "https://samip.pythonanywhere.com"
  const password = useRef();
  const navigate = useNavigate();
  async function login() {
    var res = await fetch(`${address}/login/${password.current.value}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      alert("User validated");
      sessionStorage.setItem("authenticated", "true");
      navigate("/admin");
      // window.location.href = '../pages/admin.html'
    } else {
      alert('Invalid admin login request');
    }
  }

  return (
    <div className="container w-50 mt-5">
    <div className="mb-3">
      <label htmlFor="username" className="form-label">
       Username
      </label>
      <input
        type="text"
        className="form-control"
        id="username"
        name="username"
      />
    </div>
    <div className="mb-3">
      <label htmlFor="password" className="form-label">
        Password
      </label>
      <input
        type="password"
        className="form-control"
        id="password"
        name="password"
        ref={password}
      />
    </div>
    <button
      type="button" 
      className="btn btn-primary"
      onClick={login} 
    >
      Login
    </button>

  </div>
  );
}

export default AdminLogin;
