// frontend/src/pages/WeightTracker.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { dispatchDataUpdate } from '../utils/events';

export default function WeightTracker() {
  const navigate = useNavigate();
  const [weightData, setWeightData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newWeight, setNewWeight] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchWeightData();
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const fetchWeightData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/weight/history?days=90');
      const formattedData = response.data.map(entry => ({
        ...entry,
        date: new Date(entry.date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        weight: parseFloat(entry.weight)
      }));
      setWeightData(formattedData.reverse());
    } catch (error) {
      console.error('Weight data fetch error:', error);
      toast.error('Failed to fetch weight data');
    } finally {
      setLoading(false);
    }
  };

  const addWeight = async (e) => {
    e.preventDefault();
    
    if (!newWeight || newWeight <= 0) {
      toast.error('Please enter a valid weight');
      return;
    }

    try {
      const response = await api.post('/weight', {
        weight: parseFloat(newWeight),
        date: selectedDate,
        notes: notes.trim()
      });

      setWeightData(prev => [...prev, {
        ...response.data,
        date: new Date(response.data.date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        weight: parseFloat(response.data.weight)
      }]);

      setNewWeight('');
      setNotes('');
      setSelectedDate(new Date().toISOString().split('T')[0]);
      setShowAddForm(false);
      
      toast.success('Weight logged successfully!');
      
      dispatchDataUpdate();
      
    } catch (error) {
      console.error('Add weight error:', error);
      toast.error(error.response?.data?.message || 'Failed to add weight');
    }
  };

  const getWeightTrend = () => {
    if (weightData.length < 2) return { trend: 'stable', change: 0 };
    
    const recent = weightData.slice(-7);
    if (recent.length < 2) return { trend: 'stable', change: 0 };
    
    const firstWeight = recent[0].weight;
    const lastWeight = recent[recent.length - 1].weight;
    const change = lastWeight - firstWeight;
    
    let trend = 'stable';
    if (change > 0.5) trend = 'up';
    else if (change < -0.5) trend = 'down';
    
    return { trend, change: Math.round(change * 10) / 10 };
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return 'Up';
      case 'down': return 'Down';
      case 'stable': return 'Right';
      default: return 'Chart';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return '#ef4444';
      case 'down': return '#10b981';
      case 'stable': return '#6b7280';
      default: return '#6b7280';
    }
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
            Loading weight data...
          </p>
        </div>
      </div>
    );
  }

  const latestWeight = weightData[weightData.length - 1];
  const { trend, change } = getWeightTrend();

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
        maxWidth: '1200px', 
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
            Weight Tracker
          </h1>
          <p style={{ 
            color: 'rgba(255,255,255,0.9)', 
            fontSize: '1.3rem',
            fontWeight: '500',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Track your weight progress and monitor your health journey
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(3, 1fr)',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {/* Current Weight */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '2rem',
            padding: '2rem',
            boxShadow: '0 32px 64px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            transition: 'all 0.3s ease',
            animation: 'slideInFromLeft 0.8s ease-out'
          }}>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '700',
              color: '#4b5563',
              marginBottom: '1rem'
            }}>
              Current Weight
            </h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#667eea', marginBottom: '0.5rem' }}>
              {latestWeight ? `${latestWeight.weight}kg` : 'No data'}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              {latestWeight ? new Date(latestWeight.createdAt || latestWeight.date).toLocaleDateString() : 'Start tracking today'}
            </div>
          </div>

          {/* Trend */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '2rem',
            padding: '2rem',
            boxShadow: '0 32px 64px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            transition: 'all 0.3s ease',
            animation: 'slideInFromBottom 0.8s ease-out'
          }}>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '700',
              color: '#4b5563',
              marginBottom: '1rem'
            }}>
              Recent Trend
            </h3>
            <div style={{ 
              fontSize: '2rem', 
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>{getTrendIcon(trend)}</span>
              <span style={{ 
                fontSize: '1.8rem', 
                fontWeight: '900', 
                color: getTrendColor(trend)
              }}>
                {change > 0 ? '+' : ''}{change}kg
              </span>
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: '500' }}>
              Last 7 entries
            </p>
          </div>

          {/* Add Weight Button */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '2rem',
            padding: '2rem',
            boxShadow: '0 32px 64px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            transition: 'all 0.3s ease',
            animation: 'slideInFromRight 0.8s ease-out',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              style={{
                width: '100%',
                padding: '1.5rem',
                background: showAddForm ? 
                  'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' :
                  'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '1rem',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: showAddForm ?
                  '0 10px 25px rgba(239, 68, 68, 0.4)' :
                  '0 10px 25px rgba(16, 185, 129, 0.4)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-3px) scale(1.02)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
              }}
            >
              {showAddForm ? 'Cancel' : '+ Log Weight'}
            </button>
          </div>
        </div>

        {/* Add Weight Form */}
        {showAddForm && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '2rem',
            padding: '2rem',
            boxShadow: '0 32px 64px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            marginBottom: '3rem',
            animation: 'slideInFromTop 0.5s ease-out'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#4b5563',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              Log Your Weight
            </h3>
            
            <form onSubmit={addWeight} style={{ maxWidth: '500px', margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Weight (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="20"
                    max="300"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid rgba(229, 231, 235, 0.5)',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      fontWeight: '500',
                      background: 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(229, 231, 235, 0.5)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid rgba(229, 231, 235, 0.5)',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      fontWeight: '500',
                      background: 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(229, 231, 235, 0.5)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How are you feeling? Any observations..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid rgba(229, 231, 235, 0.5)',
                    borderRadius: '0.75rem',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    background: 'rgba(255, 255, 255, 0.8)',
                    transition: 'all 0.3s ease',
                    resize: 'vertical'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(229, 231, 235, 0.5)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 25px rgba(102, 126, 234, 0.4)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.4)';
                }}
              >
                Log Weight
              </button>
            </form>
          </div>
        )}

        {/* Weight Chart */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '2rem',
          padding: '2rem',
          boxShadow: '0 32px 64px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          animation: 'slideInFromBottom 1s ease-out'
        }}>
          <h3 style={{
            fontSize: '1.8rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            Your Weight Journey
          </h3>

          {weightData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={weightData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(0,0,0,0.05)" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#4b5563', fontWeight: '600' }}
                  style={{ fontSize: '0.9rem' }}
                />
                <YAxis 
                  domain={['dataMin - 5', 'dataMax + 5']}
                  tick={{ fill: '#4b5563', fontWeight: '600' }}
                  style={{ fontSize: '0.9rem' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(255,255,255,0.95)', 
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '1rem',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#667eea" 
                  strokeWidth={5}
                  dot={{ fill: '#667eea', r: 8, strokeWidth: 3, stroke: '#ffffff' }}
                  activeDot={{ r: 10 }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#6b7280' }}>
              <p style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Start your journey</p>
              <p style={{ fontSize: '1.1rem' }}>Log your first weight to see your progress chart</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}