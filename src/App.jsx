import {Routes, Route} from "react-router-dom"
import Login from './pages/auth/login';
import SignUp from './pages/auth/signup';
import Verification from './pages/auth/verification';
// import ForgotPassword from './pages/auth/forgot-password';
import ResetPassword from './pages/auth/reset-password';
// import Dashboard from './pages/dashboard';
import './index.css';

function App() {
  return (
    <Routes>
      {/* Authentication */}
      <Route path="/" element={<Login />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<SignUp />} />
      <Route path="/auth/verification" element={<Verification />} />
      {/* <Route path="/auth/forgot-password" element={<ForgotPassword />} /> */}
      <Route path="/auth/reset-password" element={<ResetPassword />} />
      
      {/* Logged in */}
      {/* <Route path="/dashboard" element={<Dashboard />} /> */}
    </Routes>
  );
}

export default App;