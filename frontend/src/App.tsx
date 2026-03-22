import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import RevenueDashboard from './pages/RevenueDashboard';
import FraudDashboard from './pages/FraudDashboard';
import MerchantDashboard from './pages/MerchantDashboard';
import AuthorizationDashboard from './pages/AuthorizationDashboard';
import SettlementDashboard from './pages/SettlementDashboard';
import CustomerInsightsDashboard from './pages/CustomerInsightsDashboard';
import RecommendationDashboard from './pages/RecommendationDashboard';

function RootHandler() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (token) {
    return role === 'manager'
      ? <Navigate to="/manager-dashboard" replace />
      : <Navigate to="/dashboard" replace />;
  }
  return <Navigate to="/login" replace />;
}

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootHandler />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/manager-dashboard" element={<PrivateRoute><ManagerDashboard /></PrivateRoute>} />
        <Route path="/revenue-dashboard" element={<PrivateRoute><RevenueDashboard /></PrivateRoute>} />
        <Route path="/fraud-dashboard" element={<PrivateRoute><FraudDashboard /></PrivateRoute>} />
        <Route path="/merchant-dashboard" element={<PrivateRoute><MerchantDashboard /></PrivateRoute>} />
        <Route path="/authorization-dashboard" element={<PrivateRoute><AuthorizationDashboard /></PrivateRoute>} />
        <Route path="/settlement-dashboard" element={<PrivateRoute><SettlementDashboard /></PrivateRoute>} />
        <Route path="/customer-insights-dashboard" element={<PrivateRoute><CustomerInsightsDashboard /></PrivateRoute>} />
        <Route path="/recommendation-dashboard" element={<PrivateRoute><RecommendationDashboard /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
