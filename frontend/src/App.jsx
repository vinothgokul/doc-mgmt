import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register' ;
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import Users from './pages/Users';
import RoleProtectedRoute from './RoleProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route index path='/' element={<Navigate to={'/login'} />} />
        <Route exact path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />

        <Route path='/users' element={
          <RoleProtectedRoute allowedRoles={["ADMIN"]}>
            <Users />
          </RoleProtectedRoute>
          } />
      </Routes>
    </Router>
  )
}

export default App
