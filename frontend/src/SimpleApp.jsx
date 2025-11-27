import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Simple test pages
function TestLogin() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Login Page</h1>
      <p>This is the login page</p>
    </div>
  );
}

function TestDashboard() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Dashboard Page</h1>
      <p>This is the dashboard page</p>
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
          <p style={{ color: '#ffffff', fontSize: '1.1rem' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Routes>
        <Route path="/" element={<TestLogin />} />
        <Route path="/login" element={<TestLogin />} />
        <Route path="/dashboard" element={<TestDashboard />} />
        <Route path="*" element={<TestLogin />} />
      </Routes>
    </div>
  );
}

export default function SimpleApp() {
  return (
    <Router>
      <AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '10px',
              padding: '16px',
            },
          }}
        />
        <AppContent />
      </AuthProvider>
    </Router>
  );
}