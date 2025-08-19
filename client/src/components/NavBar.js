import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <nav className="nav">
      <div className="container">
        <Link to="/" className="brand">TaskManager</Link>
        <div>
          {user ? (
            <>
              <span style={{ marginRight: 12 }}>Hi, {user.name}</span>
              <Link to="/tasks/new" className="btn">New Task</Link>
              <button onClick={handleLogout} className="btn ghost">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn">Login</Link>
              <Link to="/register" className="btn ghost">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
