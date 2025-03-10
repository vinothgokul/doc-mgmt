import { createContext, useState, useEffect, useContext } from "react";
import { authApi } from "../services/api";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext()

export function AuthProvider({children}) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if(token){
      const decoded = jwtDecode(token);
      setUser({token, role: decoded.role, sub: decoded.sub})
    }
  }, []);

  async function login(username, password) {
    try {
      const response = await authApi.login({username, password});
      localStorage.setItem("token", response.data.access_token);
      const decoded = jwtDecode(response.data.access_token); 
      setUser({ token: response.data.access_token, role: decoded.role });
      return {success: true, message: "Login Successful"};
    }
    catch(error) {
      const errMsg = error.response?.data?.message || "Login failed. Please try again";
      return {success: false, message: errMsg};
    }
  }

  async function register(username, email, password) {
    try {
      await authApi.register({username, email, password});
      return {success: true, message: "Registration successful"};
    }
    catch(error) {
      const errMsg = error.response?.data?.message || "Registration failed";
      return {success: false, message: errMsg};
    }
  }

  async function logout() {
    localStorage.removeItem("token");
    setUser(null)
    console.log("Logout Successful")
  }

  return(
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}