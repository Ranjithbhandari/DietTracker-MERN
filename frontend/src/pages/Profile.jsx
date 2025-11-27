import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { dispatchDataUpdate, dispatchUserUpdate } from '../utils/events';

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: '',
    goal: '',
    dietType: '',
    burnGoal: '',
    useCustomTarget: false,
    customCalorieTarget: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        age: user.age || '',
        gender: user.gender || '',
        height: user.height || '',
        weight: user.weight || '',
        activityLevel: user.activityLevel || '',
        goal: user.goal || '',
        dietType: user.dietType || '',
        burnGoal: user.burnGoal || 500,
        useCustomTarget: user.useCustomTarget || false,
        customCalorieTarget: user.customCalorieTarget || ''
      });
    }
  }, [user]);

  const calculateBMR = (weight, height, age, gender) => {
    if (!weight || !height || !age || !gender) return 0;
    
    // Mifflin-St Jeor Equation
    if (gender === 'male') {
      return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
    } else {
      return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
    }
  };

  const calculateTDEE = (bmr, activityLevel) => {
    if (!bmr || !activityLevel) return 0;
    
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    
    return Math.round(bmr * (multipliers[activityLevel] || 1.2));
  };

  const calculateCalorieTarget = (tdee, goal) => {
    if (!tdee || !goal) return 0;
    
    switch (goal) {
      case 'lose':
        return Math.round(tdee - 500); // 500 calorie deficit
      case 'gain':
        return Math.round(tdee + 500); // 500 calorie surplus
      case 'maintain':
      default:
        return tdee;
    }
  };

  const calculateMacros = (calorieTarget, weight) => {
    if (!calorieTarget || !weight) return { protein: 0, carbs: 0, fat: 0 };
    
    // Protein: 2g per kg body weight
    const protein = Math.round(weight * 2);
    
    // Fat: 25% of calories
    const fatCalories = calorieTarget * 0.25;
    const fat = Math.round(fatCalories / 9); // 9 calories per gram of fat
    
    // Carbs: remaining calories
    const proteinCalories = protein * 4; // 4 calories per gram of protein
    const remainingCalories = calorieTarget - proteinCalories - fatCalories;
    const carbs = Math.round(remainingCalories / 4); // 4 calories per gram of carbs
    
    return { protein, carbs, fat };
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare update data for backend
      const updateData = {
        age: parseInt(formData.age),
        gender: formData.gender,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        activityLevel: formData.activityLevel,
        goal: formData.goal,
        dietType: formData.dietType || 'balanced',
        burnGoal: parseInt(formData.burnGoal) || 500
      };

      // Validate required fields
      if (!updateData.age || !updateData.gender || !updateData.height || !updateData.weight || !updateData.activityLevel || !updateData.goal) {
        toast.error('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Update profile via API
      const response = await api.put('/user/profile', updateData);
      
      if (response.data) {
        const updatedUser = response.data;
        
        // Update AuthContext
        updateUser(updatedUser);
        
        // Dispatch events for real-time updates
        dispatchUserUpdate();
        dispatchDataUpdate();
        
        toast.success('Profile updated successfully! 🎉');
      }

      // Handle custom calorie target separately if needed
      if (formData.useCustomTarget && formData.customCalorieTarget) {
        const settingsData = {
          useCustomTarget: true,
          customCalorieTarget: parseInt(formData.customCalorieTarget)
        };
        
        await api.put('/user/settings', settingsData);
      }

    } catch (error) {
      console.error('Profile update error:', error);
      const message = error.response?.data?.message || 'Failed to update profile. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate preview values
  const previewBMR = calculateBMR(
    parseFloat(formData.weight),
    parseFloat(formData.height),
    parseInt(formData.age),
    formData.gender
  );

  const previewTDEE = calculateTDEE(previewBMR, formData.activityLevel);
  
  const previewCalorieTarget = formData.useCustomTarget && formData.customCalorieTarget
    ? parseInt(formData.customCalorieTarget)
    : calculateCalorieTarget(previewTDEE, formData.goal);

  const previewMacros = calculateMacros(previewCalorieTarget, parseFloat(formData.weight));

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
      padding: '2rem',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
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
            👤 Profile Settings
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: '1.3rem',
            fontWeight: '500',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Customize your nutrition goals and preferences
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '2fr 1fr',
          gap: '2rem'
        }}>
          {/* Form */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '2rem',
            padding: '2rem',
            boxShadow: '0 32px 64px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Basic Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid rgba(229, 231, 235, 0.5)',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      background: 'rgba(255, 255, 255, 0.8)'
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
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="1"
                    max="150"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid rgba(229, 231, 235, 0.5)',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      background: 'rgba(255, 255, 255, 0.8)'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid rgba(229, 231, 235, 0.5)',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      background: 'rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    min="50"
                    max="300"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid rgba(229, 231, 235, 0.5)',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      background: 'rgba(255, 255, 255, 0.8)'
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
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    min="20"
                    max="500"
                    step="0.1"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid rgba(229, 231, 235, 0.5)',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      background: 'rgba(255, 255, 255, 0.8)'
                    }}
                  />
                </div>
              </div>

              {/* Goals */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Activity Level
                  </label>
                  <select
                    name="activityLevel"
                    value={formData.activityLevel}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid rgba(229, 231, 235, 0.5)',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      background: 'rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    <option value="">Select</option>
                    <option value="sedentary">Sedentary (little/no exercise)</option>
                    <option value="light">Light (1-3 days/week)</option>
                    <option value="moderate">Moderate (3-5 days/week)</option>
                    <option value="active">Active (6-7 days/week)</option>
                    <option value="very_active">Very Active (2x/day)</option>
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Goal
                  </label>
                  <select
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid rgba(229, 231, 235, 0.5)',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      background: 'rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    <option value="">Select</option>
                    <option value="lose">Lose Weight</option>
                    <option value="maintain">Maintain Weight</option>
                    <option value="gain">Gain Weight</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Burn Goal (calories/day)
                </label>
                <input
                  type="number"
                  name="burnGoal"
                  value={formData.burnGoal}
                  onChange={handleChange}
                  min="100"
                  max="2000"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid rgba(229, 231, 235, 0.5)',
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    background: 'rgba(255, 255, 255, 0.8)'
                  }}
                />
              </div>

              {/* Custom Calorie Target */}
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  <input
                    type="checkbox"
                    name="useCustomTarget"
                    checked={formData.useCustomTarget}
                    onChange={handleChange}
                    style={{ width: '1rem', height: '1rem' }}
                  />
                  Use Custom Calorie Target
                </label>
                {formData.useCustomTarget && (
                  <input
                    type="number"
                    name="customCalorieTarget"
                    value={formData.customCalorieTarget}
                    onChange={handleChange}
                    placeholder="Enter custom calorie target"
                    min="500"
                    max="10000"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid rgba(229, 231, 235, 0.5)',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      background: 'rgba(255, 255, 255, 0.8)',
                      marginTop: '0.5rem'
                    }}
                  />
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: loading 
                    ? 'rgba(102, 126, 234, 0.5)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: loading 
                    ? 'none'
                    : '0 10px 25px rgba(102, 126, 234, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid #ffffff',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Calculating & Saving...
                  </>
                ) : (
                  <>
                    🧮 Calculate & Save
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Preview */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '2rem',
            padding: '2rem',
            boxShadow: '0 32px 64px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            height: 'fit-content'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '1.5rem'
            }}>
              📊 Calculated Values
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                padding: '1rem',
                background: 'rgba(102, 126, 234, 0.05)',
                borderRadius: '1rem',
                border: '1px solid rgba(102, 126, 234, 0.1)'
              }}>
                <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                  BMR (Base Metabolic Rate)
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#667eea' }}>
                  {previewBMR || 0} cal/day
                </div>
              </div>

              <div style={{
                padding: '1rem',
                background: 'rgba(16, 185, 129, 0.05)',
                borderRadius: '1rem',
                border: '1px solid rgba(16, 185, 129, 0.1)'
              }}>
                <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                  TDEE (Total Daily Energy)
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>
                  {previewTDEE || 0} cal/day
                </div>
              </div>

              <div style={{
                padding: '1rem',
                background: 'rgba(245, 158, 11, 0.05)',
                borderRadius: '1rem',
                border: '1px solid rgba(245, 158, 11, 0.1)'
              }}>
                <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                  Calorie Target
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b' }}>
                  {previewCalorieTarget || 0} cal/day
                </div>
              </div>

              <div style={{
                padding: '1rem',
                background: 'rgba(239, 68, 68, 0.05)',
                borderRadius: '1rem',
                border: '1px solid rgba(239, 68, 68, 0.1)'
              }}>
                <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                  Macro Targets
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#ef4444' }}>
                    🥩 Protein: {previewMacros.protein}g
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#ef4444' }}>
                    🍞 Carbs: {previewMacros.carbs}g
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#ef4444' }}>
                    🥑 Fat: {previewMacros.fat}g
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}