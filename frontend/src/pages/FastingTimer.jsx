import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { dispatchFastingUpdate } from '../utils/events';

export default function FastingTimer() {
  const navigate = useNavigate();
  const [activeSession, setActiveSession] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showStartForm, setShowStartForm] = useState(false);
  const [fastingType, setFastingType] = useState('16:8');
  const [customHours, setCustomHours] = useState(16);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    loadFastingSession();
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  useEffect(() => {
    let interval;
    if (activeSession && activeSession.status === 'active') {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const endTime = new Date(activeSession.endTime).getTime();
        const remaining = Math.max(0, endTime - now);
        
        setTimeRemaining(remaining);
        
        if (remaining === 0) {
          // Fast completed!
          completeSession();
          toast.success('🎉 Fasting completed! Great job!', { duration: 6000 });
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [activeSession]);

  const loadFastingSession = async () => {
    try {
      setLoading(true);
      
      // Try to load from localStorage first
      const localSession = localStorage.getItem('fastingSession');
      if (localSession) {
        const session = JSON.parse(localSession);
        const now = new Date().getTime();
        const endTime = new Date(session.endTime).getTime();
        
        if (now < endTime && session.status === 'active') {
          setActiveSession(session);
          setTimeRemaining(endTime - now);
        } else if (now >= endTime && session.status === 'active') {
          // Session completed while app was closed
          await completeSession(session);
          toast.success('🎉 Fasting completed while you were away! Great job!', { duration: 6000 });
        }
      }
      
      // Also try to fetch from server
      try {
        const response = await api.get('/fasting/active');
        if (response.data && response.data.status === 'active') {
          const serverSession = response.data;
          const now = new Date().getTime();
          const endTime = new Date(serverSession.endTime).getTime();
          
          if (now < endTime) {
            setActiveSession(serverSession);
            setTimeRemaining(endTime - now);
            // Update localStorage with server data
            localStorage.setItem('fastingSession', JSON.stringify(serverSession));
          } else {
            await completeSession(serverSession);
          }
        }
      } catch (error) {
        console.log('No active session on server');
      }
      
    } catch (error) {
      console.error('Load fasting session error:', error);
    } finally {
      setLoading(false);
    }
  };

  const startFasting = async () => {
    try {
      const hours = fastingType === 'custom' ? customHours : parseInt(fastingType.split(':')[0]);
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + (hours * 60 * 60 * 1000));
      
      const sessionData = {
        type: fastingType,
        duration: hours,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        status: 'active'
      };

      // Save to localStorage immediately
      localStorage.setItem('fastingSession', JSON.stringify(sessionData));
      
      // Try to save to server
      try {
        const response = await api.post('/fasting/start', sessionData);
        if (response.data) {
          sessionData._id = response.data._id;
          localStorage.setItem('fastingSession', JSON.stringify(sessionData));
        }
      } catch (error) {
        console.log('Failed to save to server, using local storage only');
      }

      setActiveSession(sessionData);
      setTimeRemaining(hours * 60 * 60 * 1000);
      setShowStartForm(false);
      
      toast.success(`🕐 ${hours}-hour fast started! You've got this!`);
      dispatchFastingUpdate();
      
    } catch (error) {
      console.error('Start fasting error:', error);
      toast.error('Failed to start fasting session');
    }
  };

  const stopFasting = async () => {
    try {
      if (activeSession) {
        // Update localStorage
        const updatedSession = { ...activeSession, status: 'stopped' };
        localStorage.setItem('fastingSession', JSON.stringify(updatedSession));
        
        // Try to update server
        try {
          if (activeSession._id) {
            await api.put(`/fasting/${activeSession._id}/stop`);
          }
        } catch (error) {
          console.log('Failed to update server');
        }
      }
      
      // Clear local state
      localStorage.removeItem('fastingSession');
      setActiveSession(null);
      setTimeRemaining(0);
      
      toast.success('⏹️ Fasting stopped. Great effort!');
      dispatchFastingUpdate();
      
    } catch (error) {
      console.error('Stop fasting error:', error);
      toast.error('Failed to stop fasting session');
    }
  };

  const completeSession = async (session = activeSession) => {
    try {
      if (session) {
        // Update localStorage
        const completedSession = { ...session, status: 'completed' };
        localStorage.setItem('fastingSession', JSON.stringify(completedSession));
        
        // Try to update server
        try {
          if (session._id) {
            await api.put(`/fasting/${session._id}/complete`);
          }
        } catch (error) {
          console.log('Failed to update server');
        }
      }
      
      // Clear active session
      setTimeout(() => {
        localStorage.removeItem('fastingSession');
        setActiveSession(null);
        setTimeRemaining(0);
        dispatchFastingUpdate();
      }, 5000); // Keep completed state for 5 seconds
      
    } catch (error) {
      console.error('Complete session error:', error);
    }
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  };

  const getProgressPercentage = () => {
    if (!activeSession) return 0;
    
    const startTime = new Date(activeSession.startTime).getTime();
    const endTime = new Date(activeSession.endTime).getTime();
    const now = new Date().getTime();
    
    const totalDuration = endTime - startTime;
    const elapsed = now - startTime;
    
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        background: `
          linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%),
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
        `,
        backgroundSize: '400% 400%, 100% 100%, 100% 100%',
        animation: 'gradientShift 15s ease infinite',
        fontFamily: "'Inter', sans-serif"
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid #ffffff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 2rem'
          }} />
          <p style={{ 
            color: '#ffffff', 
            fontSize: '1.3rem', 
            fontWeight: '600',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            Loading fasting timer...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: `
        linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%),
        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
      `,
      backgroundSize: '400% 400%, 100% 100%, 100% 100%',
      animation: 'gradientShift 15s ease infinite',
      padding: '2rem 1rem',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Floating Orbs Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 0
      }}>
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '5%',
          width: '120px',
          height: '120px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          top: '70%',
          right: '10%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 12s ease-in-out infinite reverse'
        }} />
      </div>

      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        position: 'relative', 
        zIndex: 1,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: '600',
              padding: '0.75rem 1.5rem',
              borderRadius: '50px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease',
              marginBottom: '2rem'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            ← Back to Dashboard
          </button>
          
          <h1 style={{ 
            fontSize: '4rem', 
            fontWeight: '900', 
            background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem',
            textShadow: '0 8px 32px rgba(0,0,0,0.3)',
            letterSpacing: '-0.02em'
          }}>
            ⏰ Fasting Timer
          </h1>
          <p style={{ 
            color: 'rgba(255,255,255,0.9)', 
            fontSize: '1.3rem',
            fontWeight: '500',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Track your intermittent fasting journey
          </p>
        </div>

        {/* Main Timer Display */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '2rem',
          padding: '3rem',
          boxShadow: '0 32px 64px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          {activeSession && activeSession.status === 'active' ? (
            <>
              {/* Active Timer */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{
                  fontSize: '4rem',
                  fontWeight: '900',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '1rem'
                }}>
                  {formatTime(timeRemaining)}
                </div>
                <p style={{ fontSize: '1.2rem', color: '#6b7280', fontWeight: '500' }}>
                  Time remaining in your {activeSession.duration}-hour fast
                </p>
              </div>

              {/* Progress Ring */}
              <div style={{ 
                position: 'relative', 
                width: '200px', 
                height: '200px', 
                margin: '2rem auto' 
              }}>
                <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="rgba(102, 126, 234, 0.1)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="url(#progressGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 90}`}
                    strokeDashoffset={`${2 * Math.PI * 90 * (1 - getProgressPercentage() / 100)}`}
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#667eea" />
                      <stop offset="100%" stopColor="#764ba2" />
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: '900', color: '#667eea' }}>
                    {Math.round(getProgressPercentage())}%
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    Complete
                  </div>
                </div>
              </div>

              {/* Stop Button */}
              <button
                onClick={stopFasting}
                style={{
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 25px rgba(239, 68, 68, 0.4)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 15px 35px rgba(239, 68, 68, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 25px rgba(239, 68, 68, 0.4)';
                }}
              >
                ⏹️ Stop Fasting
              </button>
            </>
          ) : activeSession && activeSession.status === 'completed' ? (
            <>
              {/* Completed State */}
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '1rem'
              }}>
                Fasting Completed!
              </h2>
              <p style={{ fontSize: '1.2rem', color: '#6b7280', marginBottom: '2rem' }}>
                Great job completing your {activeSession.duration}-hour fast!
              </p>
              <button
                onClick={() => {
                  localStorage.removeItem('fastingSession');
                  setActiveSession(null);
                  setTimeRemaining(0);
                }}
                style={{
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 25px rgba(102, 126, 234, 0.4)'
                }}
              >
                🆕 Start New Fast
              </button>
            </>
          ) : (
            <>
              {/* No Active Session */}
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⏰</div>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                color: '#374151',
                marginBottom: '1rem'
              }}>
                Ready to Start Fasting?
              </h2>
              <p style={{ fontSize: '1.2rem', color: '#6b7280', marginBottom: '2rem' }}>
                Choose your fasting duration and begin your journey
              </p>
              <button
                onClick={() => setShowStartForm(true)}
                style={{
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 15px 35px rgba(16, 185, 129, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.4)';
                }}
              >
                🚀 Start Fasting
              </button>
            </>
          )}
        </div>

        {/* Start Form */}
        {showStartForm && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '2rem',
            padding: '2rem',
            boxShadow: '0 32px 64px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            animation: 'slideInFromTop 0.5s ease-out'
          }}>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#374151',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              Choose Your Fasting Duration
            </h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(3, 1fr)', 
              gap: '1rem', 
              marginBottom: '2rem' 
            }}>
              {['16:8', '18:6', '20:4'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFastingType(type)}
                  style={{
                    padding: '1.5rem',
                    background: fastingType === type 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'rgba(102, 126, 234, 0.1)',
                    color: fastingType === type ? '#ffffff' : '#667eea',
                    border: `2px solid ${fastingType === type ? 'transparent' : 'rgba(102, 126, 234, 0.2)'}`,
                    borderRadius: '1rem',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                    {type === '16:8' ? '⏰' : type === '18:6' ? '🕕' : '🕗'}
                  </div>
                  <div>{type}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.25rem' }}>
                    {type.split(':')[0]} hours
                  </div>
                </button>
              ))}
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '1rem'
              }}>
                <input
                  type="radio"
                  name="fastingType"
                  value="custom"
                  checked={fastingType === 'custom'}
                  onChange={(e) => setFastingType(e.target.value)}
                  style={{ width: '1.2rem', height: '1.2rem' }}
                />
                Custom Duration
              </label>
              {fastingType === 'custom' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input
                    type="number"
                    value={customHours}
                    onChange={(e) => setCustomHours(parseInt(e.target.value))}
                    min="1"
                    max="72"
                    style={{
                      padding: '0.75rem',
                      border: '2px solid rgba(102, 126, 234, 0.2)',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      width: '100px',
                      textAlign: 'center'
                    }}
                  />
                  <span style={{ color: '#6b7280' }}>hours</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => setShowStartForm(false)}
                style={{
                  padding: '1rem 2rem',
                  background: 'rgba(107, 114, 128, 0.1)',
                  color: '#6b7280',
                  border: '2px solid rgba(107, 114, 128, 0.2)',
                  borderRadius: '50px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Cancel
              </button>
              <button
                onClick={startFasting}
                style={{
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 15px 35px rgba(16, 185, 129, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.4)';
                }}
              >
                🚀 Start Fast
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes slideInFromTop {
          0% { opacity: 0; transform: translateY(-30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}