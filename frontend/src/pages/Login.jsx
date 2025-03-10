import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [input, setInput] = useState({ username: "", password: "" });
  const [message, setMessage] = useState(null)
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if(user) {
      navigate('/dashboard');
    }
  },[user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault();

      const response = await login(input.username, input.password);
      setMessage(response.message)
      
      if(response.success)
        navigate('/dashboard');
      
      setTimeout(() => {
        setMessage(null)
      }, 5000);
  };

  return (
    <>
      <div className="form-container">
        <h2>Login</h2>
        <form className="form-body" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter username"
              value={input.username}
              onChange={(e) => setInput({ ...input, username: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              value={input.password}
              onChange={(e) => setInput({ ...input, password: e.target.value })}
            />
          </div>
          <button type="submit" className="green-btn" disabled={!(input.username && input.password)}>Login</button>
        </form>
        <Link to="/register" className="link">New User? Click here</Link>
      </div>
      {message && <span className="error-container">{message}</span>}
    </>
  );
}
