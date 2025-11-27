import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import MealCard from '../components/MealCard';
import WaterTracker from '../components/WaterTracker';
import { addEventListener } from '../utils/events';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [meals, setMeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [waterData, setWaterData] = useState({ consumed: 0, goal: 2000 });
  const [weightData, setWeightData] = useState({ current: null, trend: null });
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0);

  const fetchTodaysData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel for instant loading
      const [mealsResponse, activitiesResponse, waterResponse, weightResponse] = await Promise.all([
        api.get('/meals/today').catch(() => ({ data: [] })),
        api.get('/activities/today').catch(() => ({ data: [] })),
        api.get('/water/today').catch(() => ({ data: { consumed: 0, goal: 2000 } })),
        api.get('/weight/latest').catch(() => ({ data: null }))
      ]);

      const mealsData = mealsResponse.data?.meals || [];
      const activitiesData = activitiesResponse.data?.activities || [];
      const waterInfo = waterResponse.data || { totalAmount: 0, target: 2000 };
      const weightInfo = weightResponse.data;

      setMeals(mealsData);
      setActivities(activitiesData);
      setWaterData(waterInfo);
      
      // Set weight data with trend
      if (weightInfo) {
        setWeightData({
          current: weightInfo.weight,
          trend: weightInfo.trend || 'stable'
        });
      }

      // Calculate totals
      const mealTotals = mealsData.reduce((acc, meal) => ({
        calories: acc.calories + (meal.calories || 0),
        protein: acc.protein + (meal.protein || 0),
        carbs: acc.carbs + (meal.carbs || 0),
        fat: acc.fat + (meal.fat || 0),
      }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

      const burnedCalories = activitiesData.reduce((acc, activity) => 
        acc + (activity.caloriesBurned || 0), 0
      );

      setTotals(mealTotals);
      setTotalCaloriesBurned(burnedCalories);

    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }; 
 useEffect(() => {
    fetchTodaysData();
    
    // Listen for real-time data updates
    const unsubscribeDataUpdate = addEventListener('dataUpdated', fetchTodaysData);
    const unsubscribeUserUpdate = addEventListener('userUpdated', fetchTodaysData);
    const unsubscribeWeightUpdate = addEventListener('weightUpdated', fetchTodaysData);
    
    // Legacy event listeners for backward compatibility
    const handleDataUpdate = () => fetchTodaysData();
    window.addEventListener('mealAdded', handleDataUpdate);
    window.addEventListener('activityAdded', handleDataUpdate);
    window.addEventListener('settingsUpdated', handleDataUpdate);
    window.addEventListener('waterUpdated', handleDataUpdate);
    
    return () => {
      unsubscribeDataUpdate();
      unsubscribeUserUpdate();
      unsubscribeWeightUpdate();
      window.removeEventListener('mealAdded', handleDataUpdate);
      window.removeEventListener('activityAdded', handleDataUpdate);
      window.removeEventListener('settingsUpdated', handleDataUpdate);
      window.removeEventListener('waterUpdated', handleDataUpdate);
    };
  }, []);

  const getCalorieTarget = () => {
    if (user?.useCustomTarget && user?.customCalorieTarget) {
      return user.customCalorieTarget;
    }
    return user?.calorieTarget || 2000;
  };

  const getBurnGoal = () => {
    return user?.burnGoal || 500;
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '⚖️';
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

  const netCalories = totals.calories - totalCaloriesBurned;
  const calorieTarget = getCalorieTarget();
  const burnGoal = getBurnGoal();
  const caloriesRemaining = Math.max(0, calorieTarget - netCalories);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: `
          linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%),
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
        `,
        backgroundSize: '400% 400%, 100% 100%, 100% 100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
            Loading your dashboard...
          </p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }  return (

    <div style={{
      minHeight: '100vh',
      background: `
        linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%),
        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
      `,
      backgroundSize: '400% 400%, 100% 100%, 100% 100%',
      animation: 'gradientShift 15s ease infinite',
      padding: '2rem',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Welcome Header */}
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem',
            textShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}>
            Welcome back, {user?.name}! 👋
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: '1.2rem',
            fontWeight: '500'
          }}>
            Here's your nutrition overview for today
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(5, 1fr)',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {/* Calories Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '2rem',
            padding: '2rem',
            boxShadow: '0 32px 64px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            textAlign: 'center',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔥</div>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>
              Net Calories
            </h3>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#667eea', marginBottom: '0.5rem' }}>
              {netCalories}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
              {caloriesRemaining} remaining
            </div>
          </div>

          {/* Burned Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '2rem',
            padding: '2rem',
            boxShadow: '0 32px 64px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            textAlign: 'center',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💪</div>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>
              Calories Burned
            </h3>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#ef4444', marginBottom: '0.5rem' }}>
              {totalCaloriesBurned}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
              Goal: {burnGoal}
            </div>
          </div>

          {/* Protein Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '2rem',
            padding: '2rem',
            boxShadow: '0 32px 64px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            textAlign: 'center',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🥩</div>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>
              Protein
            </h3>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#10b981', marginBottom: '0.5rem' }}>
              {Math.round(totals.protein)}g
            </div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
              Target: {user?.macros?.protein || Math.round((user?.weight || 70) * 2)}g
            </div>
          </div>

          {/* Water Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '2rem',
            padding: '2rem',
            boxShadow: '0 32px 64px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            textAlign: 'center',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💧</div>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>
              Water
            </h3>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#3b82f6', marginBottom: '0.5rem' }}>
              {waterData.totalAmount || waterData.consumed || 0}ml
            </div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
              Goal: {waterData.target || waterData.goal || 2000}ml
            </div>
          </div>

          {/* Weight Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '2rem',
            padding: '2rem',
            boxShadow: '0 32px 64px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/weight-tracker')}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 40px 80px rgba(0, 0, 0, 0.25)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 32px 64px rgba(0, 0, 0, 0.2)';
          }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              {getTrendIcon(weightData.trend)}
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>
              Current Weight
            </h3>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: getTrendColor(weightData.trend), marginBottom: '0.5rem' }}>
              {weightData.current ? `${weightData.current}kg` : 'No data'}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
              Click to track
            </div>
          </div>
        </div> 
       {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '2fr 1fr',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {/* Meals Section */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '2rem',
            padding: '2rem',
            boxShadow: '0 32px 64px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem'
            }}>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                🍽️ Today's Meals
              </h2>
              <button
                onClick={() => navigate('/add-meal')}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)';
                }}
              >
                + Add Meal
              </button>
            </div>

            {meals.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {meals.map((meal) => (
                  <MealCard key={meal._id} meal={meal} onUpdate={fetchTodaysData} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍽️</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Start logging your first meal!
                </h3>
                <p style={{ marginBottom: '2rem' }}>Track your nutrition by adding your first meal of the day</p>
                <button
                  onClick={() => navigate('/add-meal')}
                  style={{
                    padding: '1rem 2rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '50px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                  }}
                >
                  🚀 Add Your First Meal
                </button>
              </div>
            )}
          </div>

          {/* Side Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Water Tracker */}
            <WaterTracker />

            {/* Activities */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '2rem',
              padding: '2rem',
              boxShadow: '0 32px 64px rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  🏃‍♂️ Activities
                </h3>
                <button
                  onClick={() => navigate('/activity')}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(102, 126, 234, 0.1)',
                    color: '#667eea',
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                    borderRadius: '50px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(102, 126, 234, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                  }}
                >
                  + Add
                </button>
              </div>

              {activities.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {activities.slice(0, 3).map((activity) => (
                    <div
                      key={activity._id}
                      style={{
                        padding: '1rem',
                        background: 'rgba(102, 126, 234, 0.05)',
                        borderRadius: '1rem',
                        border: '1px solid rgba(102, 126, 234, 0.1)'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <div style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>
                            {activity.name}
                          </div>
                          <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                            {activity.duration} min
                          </div>
                        </div>
                        <div style={{
                          fontWeight: '700',
                          color: '#ef4444',
                          fontSize: '0.9rem'
                        }}>
                          -{activity.caloriesBurned} cal
                        </div>
                      </div>
                    </div>
                  ))}
                  {activities.length > 3 && (
                    <button
                      onClick={() => navigate('/activity')}
                      style={{
                        padding: '0.75rem',
                        background: 'transparent',
                        color: '#667eea',
                        border: '1px dashed rgba(102, 126, 234, 0.3)',
                        borderRadius: '1rem',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      View all {activities.length} activities
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏃‍♂️</div>
                  <p style={{ fontSize: '0.9rem' }}>No activities yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(3, 1fr)',
          gap: '2rem'
        }}>
          <button
            onClick={() => navigate('/weight-tracker')}
            style={{
              padding: '2rem',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 32px 64px rgba(0, 0, 0, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'center'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-4px)';
              e.target.style.boxShadow = '0 40px 80px rgba(0, 0, 0, 0.25)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 32px 64px rgba(0, 0, 0, 0.2)';
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚖️</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#374151', marginBottom: '0.5rem' }}>
              Weight Tracker
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
              Monitor your weight progress
            </p>
          </button>

          <button
            onClick={() => navigate('/fasting-timer')}
            style={{
              padding: '2rem',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 32px 64px rgba(0, 0, 0, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'center'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-4px)';
              e.target.style.boxShadow = '0 40px 80px rgba(0, 0, 0, 0.25)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 32px 64px rgba(0, 0, 0, 0.2)';
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏰</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#374151', marginBottom: '0.5rem' }}>
              Fasting Timer
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
              Track intermittent fasting
            </p>
          </button>

          <button
            onClick={() => navigate('/history')}
            style={{
              padding: '2rem',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 32px 64px rgba(0, 0, 0, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'center'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-4px)';
              e.target.style.boxShadow = '0 40px 80px rgba(0, 0, 0, 0.25)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 32px 64px rgba(0, 0, 0, 0.2)';
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#374151', marginBottom: '0.5rem' }}>
              Progress History
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
              View your 30-day trends
            </p>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}