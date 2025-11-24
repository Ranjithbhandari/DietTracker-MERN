import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    age: user?.age || '',
    gender: user?.gender || 'male',
    height: user?.height || '',
    weight: user?.weight || '',
    activityLevel: user?.activityLevel || 'moderate',
    goal: user?.goal || 'maintain',
    dietType: user?.dietType || 'balanced',
  });

  const [results, setResults] = useState(null);

  useEffect(() => {
    if (user?.calorieTarget) {
      setResults({
        bmr: user.bmr,
        tdee: user.tdee,
        calorieTarget: user.calorieTarget,
        macros: user.macros,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.age || formData.age < 1 || formData.age > 150) {
      setError('Please enter a valid age (1-150)');
      return;
    }

    if (!formData.height || formData.height < 50 || formData.height > 300) {
      setError('Please enter a valid height in cm (50-300)');
      return;
    }

    if (!formData.weight || formData.weight < 20 || formData.weight > 500) {
      setError('Please enter a valid weight in kg (20-500)');
      return;
    }

    try {
      setLoading(true);
      const response = await api.put('/user/profile', {
        age: parseInt(formData.age),
        gender: formData.gender,
        height: parseInt(formData.height),
        weight: parseInt(formData.weight),
        activityLevel: formData.activityLevel,
        goal: formData.goal,
        dietType: formData.dietType,
      });

      setResults(response.data.assessment);
      setUser(response.data.user);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-800 font-semibold mb-4 flex items-center"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-gray-800">Diet Assessment</h1>
          <p className="text-gray-600 mt-2">Complete your profile to get personalized nutrition targets</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Information</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Age */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="25"
                  min="1"
                  max="150"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              {/* Height */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Height (cm) *
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="175"
                  min="50"
                  max="300"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="75"
                  min="20"
                  max="500"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Activity Level *
                </label>
                <select
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="sedentary">Sedentary (little or no exercise)</option>
                  <option value="light">Light (1-3 days/week)</option>
                  <option value="moderate">Moderate (3-5 days/week)</option>
                  <option value="active">Active (6-7 days/week)</option>
                  <option value="very_active">Very Active (intense exercise)</option>
                </select>
              </div>

              {/* Goal */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Goal *
                </label>
                <select
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="lose">Lose Weight</option>
                  <option value="maintain">Maintain Weight</option>
                  <option value="gain">Gain Weight</option>
                </select>
              </div>

              {/* Diet Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Diet Type *
                </label>
                <select
                  name="dietType"
                  value={formData.dietType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="balanced">Balanced (30% protein, 40% carbs, 30% fat)</option>
                  <option value="low_carb">Low Carb (35% protein, 25% carbs, 40% fat)</option>
                  <option value="high_protein">High Protein (40% protein, 30% carbs, 30% fat)</option>
                  <option value="keto">Keto (25% protein, 5% carbs, 70% fat)</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition disabled:opacity-50 mt-6"
              >
                {loading ? 'Calculating...' : 'Calculate & Save'}
              </button>
            </form>
          </div>

          {/* Results */}
          {results && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Results</h2>

              <div className="space-y-4">
                {/* BMR */}
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <p className="text-sm text-gray-600 mb-1">Basal Metabolic Rate (BMR)</p>
                  <p className="text-3xl font-bold text-blue-600">{Math.round(results.bmr)}</p>
                  <p className="text-xs text-gray-500 mt-1">Calories at rest</p>
                </div>

                {/* TDEE */}
                <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                  <p className="text-sm text-gray-600 mb-1">Total Daily Energy Expenditure (TDEE)</p>
                  <p className="text-3xl font-bold text-purple-600">{Math.round(results.tdee)}</p>
                  <p className="text-xs text-gray-500 mt-1">Calories with activity</p>
                </div>

                {/* Calorie Target */}
                <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                  <p className="text-sm text-gray-600 mb-1">Daily Calorie Target</p>
                  <p className="text-3xl font-bold text-green-600">{Math.round(results.calorieTarget)}</p>
                  <p className="text-xs text-gray-500 mt-1">Based on your goal</p>
                </div>

                {/* Macros */}
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm font-semibold text-gray-700 mb-4">Daily Macro Targets</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-orange-50 p-3 rounded">
                      <span className="text-gray-700">Protein</span>
                      <span className="font-bold text-orange-600">{Math.round(results.macros.protein)}g</span>
                    </div>
                    <div className="flex items-center justify-between bg-yellow-50 p-3 rounded">
                      <span className="text-gray-700">Carbohydrates</span>
                      <span className="font-bold text-yellow-600">{Math.round(results.macros.carbs)}g</span>
                    </div>
                    <div className="flex items-center justify-between bg-red-50 p-3 rounded">
                      <span className="text-gray-700">Fat</span>
                      <span className="font-bold text-red-600">{Math.round(results.macros.fat)}g</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
