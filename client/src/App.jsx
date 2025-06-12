// client/src/App.jsx

import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import BoardPage from './components/pages/BoardPage';
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/auth/PrivateRoute';
import setAuthToken from './utils/setAuthToken';
import { jwtDecode } from 'jwt-decode';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
      localStorage.removeItem('token');
      setAuthToken(null);
      navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            // Check if token is expired
            if (decodedToken.exp * 1000 < Date.now()) {
                logout();
            } else {
                setAuthToken(token);
            }
        } catch (error) {
            // If token is invalid or malformed, logout the user
            console.error("Invalid token found in local storage", error);
            logout();
        }
    }
  }, [location, navigate]); // Rerun on location change

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/board" element={
            <PrivateRoute>
              <BoardPage />
            </PrivateRoute>
          } />
        </Routes>
      </main>
    </div>
  )
}

export default App;