import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ApplicationForm from './pages/ApplicationForm';
import AdminLogin from './pages/AdminLogin';
import FranchiseeLogin from './pages/FranchiseeLogin';
import AdminDashboard from './pages/AdminDashboard';
import FranchiseeDashboard from './pages/FranchiseeDashboard';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/apply" element={<ApplicationForm />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/franchisee/login" element={<FranchiseeLogin />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/franchisee/*" element={<FranchiseeDashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
