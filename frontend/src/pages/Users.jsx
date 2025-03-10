import { useEffect, useState } from "react";
import { useUsers } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function UserManagement() {
  const { users, loading, fetchUsers, createUser, updateUser, deleteUser } = useUsers();
  const { user } = useAuth();
  const [newUser, setNewUser] = useState({ username: "", email: "", role: "VIEWER", password: "defaultPass" });
  const [editingUser, setEditingUser] = useState(null);
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  useEffect(()=>{
    fetchUsers()
  },[users])

  const handleCreate = (e) => {
    e.preventDefault();
    createUser(newUser);
    setNewUser({ username: "", email: "", role: "VIEWER", password: "defaultPass" });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateUser(editingUser.id, editingUser);
    setEditingUser(null);
  };

  const handleDelete = (userId) => {
    if(user.sub !== userId) 
      deleteUser(userId)
    else{
      setMessage("Cannot delete current user");
      
      setTimeout(() => {
        setMessage(null)
      }, 5000);
    }
  }

  return (
    <> 
      <div className="user-container">
        <div className="container-header">
          <h2>User Management</h2>
          <div className="button-group">
            <button type="button" onClick={()=>navigate(-1)}>Back</button>
          </div>
        </div>

        <form onSubmit={editingUser ? handleUpdate : handleCreate} className="user-form">
          <input
            type="text"
            placeholder="Username"
            value={editingUser ? editingUser.username : newUser.username}
            onChange={(e) =>
              editingUser
                ? setEditingUser({ ...editingUser, username: e.target.value })
                : setNewUser({ ...newUser, username: e.target.value })
            }
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={editingUser ? editingUser.email : newUser.email}
            onChange={(e) =>
              editingUser
                ? setEditingUser({ ...editingUser, email: e.target.value })
                : setNewUser({ ...newUser, email: e.target.value })
            }
            required
          />
          <select
            value={editingUser ? editingUser.role : newUser.role}
            onChange={(e) =>
              editingUser
                ? setEditingUser({ ...editingUser, role: e.target.value })
                : setNewUser({ ...newUser, role: e.target.value })
            }
          >
            <option value="ADMIN">Admin</option>
            <option value="EDITOR">Editor</option>
            <option value="VIEWER">Viewer</option>
          </select>
          <button type="submit" className="green-btn">{editingUser ? "Update User" : "Create User"}</button>
        </form>

        {loading
          ? <p>Loading Users...</p>
          : users.length === 0 
              ? <p>No users...</p>
              : <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                          <button type="button" onClick={() => setEditingUser(user)} >Edit</button>
                          <button type="button" onClick={()=>handleDelete(user.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
        }
      </div>
      {message && <span className="error-container">{message}</span>}
    </>
  );
}
