import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tracker from './pages/Tracker';
import Admin from './pages/Admin';
import Notes from './pages/Notes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
