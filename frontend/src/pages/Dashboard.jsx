import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import ProgressCircle from '../components/ProgressCircle';
import MealCard from '../components/MealCard';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  useEffect(() => {
    fetchTodaysMeals();
  }, []);

  const fetchTodaysMeals = async () => {
    try {
      setLoading(true);
      const response = await api.get('/meals/today');
      setMeals(response.data.meals || []);
      setTotals(response.data.totals || { calories: 0, protein: 0, carbs: 0, fat: 0 });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch meals');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeal = async (mealId) => {
    if (!window.confirm('Are you sure you want to delete this meal?')) return;

    try {
      await api.delete(`/meals/${mealId}`);
      setMeals(meals.filter(m => m._id !== mealId));
      setTotals(prev => ({
        calories: prev.calories - meals.find(m => m._id === mealId).calories,
        protein: prev.protein - meals.find(m => m._id === mealId).protein,
        carbs: prev.carbs - meals.find(m => m._id === mealId).carbs,
        fat: prev.fat - meals.find(m => m._id === mealId).fat,
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete meal');
    }
  };

  const calorieTarget = user?.calorieTarget || 2000;
  const remaining = Math.max(0, calorieTarget - totals.calories);
  const percentage = Math.min(100, (totals.calories / calorieTarget) * 100);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your meals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Today's Progress</h1>
          <p className="text-gray-600">Track your daily nutrition intake</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Progress Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Progress Circle */}
            <div className="flex justify-center">
              <ProgressCircle
                current={totals.calories}
                target={calorieTarget}
                size={200}
              />
            </div>

            {/* Stats */}
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Calories Consumed</p>
                <p className="text-3xl font-bold text-blue-600">{totals.calories}</p>
                <p className="text-xs text-gray-500 mt-1">of {calorieTarget} cal target</p>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Remaining</p>
                <p className="text-3xl font-bold text-green-600">{remaining}</p>
                <p className="text-xs text-gray-500 mt-1">calories available</p>
              </div>

              {totals.calories > calorieTarget && (
                <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                  <p className="text-sm font-semibold text-red-700">
                    ⚠️ Over Target by {totals.calories - calorieTarget} calories
                  </p>
                </div>
              )}

              {percentage >= 100 && totals.calories <= calorieTarget * 1.1 && (
                <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                  <p className="text-sm font-semibold text-green-700">
                    ✓ On Track!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Macros */}
          <div className="mt-8 pt-8 border-t">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Macronutrients</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Protein</p>
                <p className="text-2xl font-bold text-orange-600">{totals.protein}g</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Carbs</p>
                <p className="text-2xl font-bold text-yellow-600">{totals.carbs}g</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Fat</p>
                <p className="text-2xl font-bold text-red-600">{totals.fat}g</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Meal Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/add-meal')}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition"
          >
            + Add Meal
          </button>
        </div>

        {/* Meals List */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Today's Meals</h2>

          {meals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No meals logged yet</p>
              <p className="text-gray-400 text-sm mt-2">Add your first meal to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {meals.map(meal => (
                <MealCard
                  key={meal._id}
                  meal={meal}
                  onDelete={handleDeleteMeal}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
