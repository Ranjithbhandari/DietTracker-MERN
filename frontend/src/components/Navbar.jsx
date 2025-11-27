import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { addEventListener } from '../utils/events';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [fastingStatus, setFastingStatus] = useState(null);

  useEffect(() => {
    // Load fasting status
    loadFastingStatus();
    
    // Listen for fasting updates
    const unsubscribe = addEventListener('fastingUpdated', loadFastingStatus);
    
    return unsubscribe;
  }, []);

  const loadFastingStatus = () => {
    try {
      const localSession = localStorage.getItem('fastingSession');
      if (localSession) {
        const session = JSON.parse(localSession);
        const now = new Date().getTime();
        const endTime = new Date(session.endTime).getTime();
        
        if (now < endTime && session.status === 'active') {
          const remaining = endTime - now;
          const hours = Math.floor(remaining / (1000 * 60 * 60));
          const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
          
          setFastingStatus({
            active: true,
            timeRemaining: `${hours}:${minutes.toString().padStart(2, '0')}`
          });
        } else {
          setFastingStatus(null);
        }
      } else {
        setFastingStatus(null);
      }
    } catch (error) {
      setFastingStatus(null);
    }
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/add-meal', label: 'Add Meal', icon: '🍽️' },
    { path: '/activity', label: 'Activity', icon: '🏃‍♂️' },
    { path: '/weight-tracker', label: 'Weight', icon: '⚖️' },
    { path: '/history', label: 'History', icon: '📈' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <div 
          onClick={() => navigate('/dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            fontSize: '1.5rem',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          <span style={{ fontSize: '2rem' }}>🥗</span>
          DietTracker
        </div>

        {/* Navigation Items */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                padding: '0.75rem 1.25rem',
                background: location.pathname === item.path 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                color: location.pathname === item.path ? '#ffffff' : '#4b5563',
                border: location.pathname === item.path 
                  ? 'none'
                  : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: location.pathname === item.path 
                  ? '0 4px 15px rgba(102, 126, 234, 0.4)'
                  : 'none'
              }}
              onMouseOver={(e) => {
                if (location.pathname !== item.path) {
                  e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                  e.target.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseOut={(e) => {
                if (location.pathname !== item.path) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              <span>{item.icon}</span>
              <span style={{ display: window.innerWidth < 768 ? 'none' : 'inline' }}>
                {item.label}
              </span>
            </button>
          ))}

          {/* Fasting Timer Button */}
          <button
            onClick={() => navigate('/fasting-timer')}
            style={{
              padding: '0.75rem 1.25rem',
              background: location.pathname === '/fasting-timer'
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : fastingStatus?.active
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'rgba(255, 255, 255, 0.1)',
              color: (location.pathname === '/fasting-timer' || fastingStatus?.active) ? '#ffffff' : '#4b5563',
              border: (location.pathname === '/fasting-timer' || fastingStatus?.active)
                ? 'none'
                : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: (location.pathname === '/fasting-timer' || fastingStatus?.active)
                ? `0 4px 15px ${fastingStatus?.active ? 'rgba(16, 185, 129, 0.4)' : 'rgba(102, 126, 234, 0.4)'}`
                : 'none',
              position: 'relative'
            }}
            onMouseOver={(e) => {
              if (location.pathname !== '/fasting-timer' && !fastingStatus?.active) {
                e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                e.target.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseOut={(e) => {
              if (location.pathname !== '/fasting-timer' && !fastingStatus?.active) {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            <span>⏰</span>
            <span style={{ display: window.innerWidth < 768 ? 'none' : 'inline' }}>
              {fastingStatus?.active ? fastingStatus.timeRemaining : 'Fasting'}
            </span>
            {fastingStatus?.active && (
              <div style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '8px',
                height: '8px',
                background: '#10b981',
                borderRadius: '50%',
                animation: 'pulse 2s infinite'
              }} />
            )}
          </button>
        </div>

        {/* User Menu */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#4b5563',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            <span>👋</span>
            <span style={{ display: window.innerWidth < 768 ? 'none' : 'inline' }}>
              {user?.name}
            </span>
          </div>
          
          <button
            onClick={handleLogout}
            style={{
              padding: '0.75rem 1.25rem',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.5)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.4)';
            }}
          >
            <span>🚪</span>
            <span style={{ display: window.innerWidth < 768 ? 'none' : 'inline' }}>
              Logout
            </span>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </nav>
  );
}