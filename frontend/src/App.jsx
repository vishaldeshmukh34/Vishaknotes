import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isLoggedIn } from './utils/auth';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotesList from './pages/notes/NotesList';

// Protected Route - only logged in users can access
const ProtectedRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/notes" element={
          <ProtectedRoute>
            <NotesList />
          </ProtectedRoute>
        } />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/notes" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;