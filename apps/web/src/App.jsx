import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { SubscriptionAuthProvider } from './contexts/SubscriptionAuthContext.jsx';
import { Toaster } from './components/ui/toaster';
import HomePage from './pages/HomePage';
import AreaPage from './pages/AreaPage';
import PlansPage from './pages/PlansPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function App() {
    return (
        <Router>
            <AuthProvider>
                <SubscriptionAuthProvider>
                    <ScrollToTop />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/area/:areaId" element={<AreaPage />} />
                        <Route path="/plans" element={<PlansPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/cadastro" element={<SignupPage />} />
                        <Route path="/subscriptions" element={<ProtectedRoute><SubscriptionsPage /></ProtectedRoute>} />
                        <Route path="/painel" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                        <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
                    </Routes>
                    <Toaster />
                </SubscriptionAuthProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
