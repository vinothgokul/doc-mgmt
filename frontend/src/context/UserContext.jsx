import { createContext, useState, useEffect, useContext }  from 'react'
import { userApi } from '../services/api'

const UserContext = createContext();

export function UserProvider({children}) {
  const [users, setUsers] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [loading, setLoading] = useState(false)

  async function fetchUsers() {
    if(fetched) return;
    setLoading(true)
    try {
      const response = await userApi.getAllUsers()
      setUsers(response.data)
      setFetched(true);
    }
    catch(error) {
      console.error("Failed to fetch users", error);
    }
    finally{
      setLoading(false)
    }
  }

  async function createUser(userData) {
    try {
      const response = await userApi.createUser(userData);
      setUsers([...users,response.data])
      console.log("User Created Successfully!");
    }
    catch(error) {
      console.error("Failed to create user", error.response?.data || error.message);
    }
  }

  async function updateUser(id, userData) {
    try {
      const response = await userApi.updateUser(id, userData);
      setUsers(users.map(user => user.id === id ? response.data : user));
      console.log("User updated successfully!");
    }
    catch(error) {
      console.error("Failed to update user", error.response?.data || error.message);
    }
  }

  async function deleteUser(id) {
    try {
      const response = await userApi.deleteUser(id)
      setUsers(users.filter(user => user.id !== id));
      console.log("User deleted successfully");
    }
    catch(error) {
      console.error("Failed to delete user", error.response?.data || error.message);
    }
  }

  return (
    <UserContext.Provider value={{users, loading, fetchUsers, createUser, updateUser, deleteUser}}>
      {children}
    </UserContext.Provider>
  )
}

export function useUsers() {
  return useContext(UserContext)
}