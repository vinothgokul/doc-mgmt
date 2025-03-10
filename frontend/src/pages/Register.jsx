import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [input, setInput] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState(null)
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await register(input.username, input.email, input.password);
    setMessage(response.message);

    if(response.success)
      navigate('/login');
    
    setTimeout(() => {
      setMessage(null)
    }, 5000);
  };

  return (
    <>
      <div className="form-container">
        <h2>Register</h2>
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
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              value={input.email}
              onChange={(e) => setInput({ ...input, email: e.target.value })}
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
          <button type="submit" className="green-btn" disabled={!(input.username && input.password && input.email)}>Register</button>
        </form>
        <Link to="/login" className="link">Existing user? Click here</Link>
      </div>
      {message && <span className="error-container">{message}</span>}
    </>
  );
}
