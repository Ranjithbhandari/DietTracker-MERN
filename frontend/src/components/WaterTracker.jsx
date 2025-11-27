import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function WaterTracker() {
  const [waterData, setWaterData] = useState({
    totalAmount: 0,
    target: 3500,
    percentage: 0,
    logs: []
  });
  const [loading, setLoading] = useState(true);
  const [customAmount, setCustomAmount] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  useEffect(() => {
    fetchWaterData();
  }, []);

  const fetchWaterData = async () => {
    try {
      const response = await api.get('/water/today');
      setWaterData(response.data);
    } catch (error) {
      console.error('Water fetch error:', error);
      toast.error('Failed to fetch water data');
    } finally {
      setLoading(false);
    }
  };

  const addWater = async (amount) => {
    try {
      const response = await api.post('/water/add', { 
        amount, 
        target: waterData.target 
      });
      
      setWaterData(prev => ({
        ...prev,
        totalAmount: response.data.totalAmount,
        percentage: response.data.percentage,
        logs: [...prev.logs, response.data.waterLog]
      }));

      toast.success(`Added ${amount}ml water! 💧`);
      
      // Celebration for reaching target
      if (response.data.percentage >= 100 && prev.percentage < 100) {
        toast.success('🎉 Daily water goal achieved!', { duration: 4000 });
      }
    } catch (error) {
      console.error('Add water error:', error);
      toast.error('Failed to add water');
    }
  };

  const handleCustomAdd = () => {
    const amount = parseInt(customAmount);
    if (amount && amount > 0 && amount <= 2000) {
      addWater(amount);
      setCustomAmount('');
      setShowCustomInput(false);
    } else {
      toast.error('Please enter a valid amount (1-2000ml)');
    }
  };

  const updateTarget = async (newTarget) => {
    try {
      await api.put('/water/target', { target: newTarget });
      setWaterData(prev => ({
        ...prev,
        target: newTarget,
        percentage: Math.round((prev.totalAmount / newTarget) * 100)
      }));
      toast.success('Water target updated!');
    } catch (error) {
      console.error('Update target error:', error);
      toast.error('Failed to update target');
    }
  };

  if (loading) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '2rem',
        padding: '2rem',
        boxShadow: '0 32px 64px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(59, 130, 246, 0.3)',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }} />
        <p style={{ color: '#6b7280', fontWeight: '500' }}>Loading water data...</p>
      </div>
    );
  }

  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (waterData.percentage / 100) * circumference;

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '2rem',
      padding: '2rem',
      boxShadow: '0 32px 64px rgba(0, 0, 0, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative water wave background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 197, 253, 0.05) 100%)',
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          💧 Water Tracker
        </h3>

        {/* Circular Progress */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: '2rem',
          position: 'relative'
        }}>
          <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="45"
              stroke="rgba(59, 130, 246, 0.1)"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="45"
              stroke="url(#waterGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: 'stroke-dashoffset 0.5s ease-in-out'
              }}
            />
            <defs>
              <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center text */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '900',
              color: '#3b82f6',
              lineHeight: '1'
            }}>
              {waterData.percentage}%
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              {waterData.totalAmount}ml
            </div>
          </div>
        </div>

        {/* Target info */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem',
          padding: '1rem',
          background: 'rgba(59, 130, 246, 0.05)',
          borderRadius: '1rem',
          border: '1px solid rgba(59, 130, 246, 0.1)'
        }}>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '0.9rem', 
            marginBottom: '0.5rem',
            fontWeight: '500'
          }}>
            Daily Target: {waterData.target}ml
          </p>
          <p style={{ 
            color: '#3b82f6', 
            fontSize: '0.8rem',
            fontWeight: '600'
          }}>
            Remaining: {Math.max(0, waterData.target - waterData.totalAmount)}ml
          </p>
        </div>

        {/* Quick add buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <button
            onClick={() => addWater(250)}
            style={{
              padding: '0.75rem',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.75rem',
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px) scale(1.02)';
              e.target.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
            }}
          >
            +250ml
          </button>
          
          <button
            onClick={() => addWater(500)}
            style={{
              padding: '0.75rem',
              background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.75rem',
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(29, 78, 216, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px) scale(1.02)';
              e.target.style.boxShadow = '0 8px 20px rgba(29, 78, 216, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 4px 12px rgba(29, 78, 216, 0.3)';
            }}
          >
            +500ml
          </button>
          
          <button
            onClick={() => setShowCustomInput(!showCustomInput)}
            style={{
              padding: '0.75rem',
              background: showCustomInput ? 
                'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' :
                'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.75rem',
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: showCustomInput ? 
                '0 4px 12px rgba(239, 68, 68, 0.3)' :
                '0 4px 12px rgba(107, 114, 128, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px) scale(1.02)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
            }}
          >
            {showCustomInput ? 'Cancel' : 'Custom'}
          </button>
        </div>

        {/* Custom input */}
        {showCustomInput && (
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            animation: 'slideDown 0.3s ease-out'
          }}>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Amount (ml)"
              min="1"
              max="2000"
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '2px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '0.75rem',
                fontSize: '0.9rem',
                fontWeight: '500',
                background: 'rgba(255, 255, 255, 0.8)',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                e.target.style.boxShadow = 'none';
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCustomAdd();
                }
              }}
            />
            <button
              onClick={handleCustomAdd}
              style={{
                padding: '0.75rem 1rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.75rem',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
              }}
            >
              Add
            </button>
          </div>
        )}

        {/* Target adjustment */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          fontSize: '0.8rem',
          color: '#6b7280'
        }}>
          <span>Target:</span>
          <select
            value={waterData.target}
            onChange={(e) => updateTarget(parseInt(e.target.value))}
            style={{
              padding: '0.25rem 0.5rem',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '0.5rem',
              fontSize: '0.8rem',
              fontWeight: '500',
              background: 'rgba(255, 255, 255, 0.8)',
              color: '#3b82f6',
              cursor: 'pointer'
            }}
          >
            <option value={2000}>2.0L</option>
            <option value={2500}>2.5L</option>
            <option value={3000}>3.0L</option>
            <option value={3500}>3.5L</option>
            <option value={4000}>4.0L</option>
          </select>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}