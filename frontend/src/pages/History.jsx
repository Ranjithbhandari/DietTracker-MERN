import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/meals/history');
      setHistory(response.data.history || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const getComplianceColor = (status) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-100 border-green-400 text-green-800';
      case 'over':
        return 'bg-red-100 border-red-400 text-red-800';
      case 'under':
        return 'bg-yellow-100 border-yellow-400 text-yellow-800';
      default:
        return 'bg-gray-100 border-gray-400 text-gray-800';
    }
  };

  const getComplianceIcon = (status) => {
    switch (status) {
      case 'on-track':
        return '✓';
      case 'over':
        return '⚠';
      case 'under':
        return '↓';
      default:
        return '•';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your history...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-4xl font-bold text-gray-800">History</h1>
          <p className="text-gray-600 mt-2">Your last 7-10 days of nutrition tracking</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* History Cards */}
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <p className="text-gray-500 text-lg">No history available yet</p>
              <p className="text-gray-400 text-sm mt-2">Start logging meals to see your history!</p>
            </div>
          ) : (
            history.map((day, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Date and Status */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">
                      {formatDate(day.date)}
                    </h3>
                    <div className={`inline-block mt-2 px-3 py-1 rounded-full border-2 font-semibold text-sm ${getComplianceColor(day.status)}`}>
                      {getComplianceIcon(day.status)} {day.status.charAt(0).toUpperCase() + day.status.slice(1)}
                    </div>
                  </div>

                  {/* Calories */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Calories</p>
                    <p className="text-2xl font-bold text-blue-600">{day.totalCalories}</p>
                    <p className="text-xs text-gray-500">of {day.target} cal</p>
                  </div>

                  {/* Macros */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">Protein</p>
                      <p className="font-bold text-orange-600">{day.totalProtein}g</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">Carbs</p>
                      <p className="font-bold text-yellow-600">{day.totalCarbs}g</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">Fat</p>
                      <p className="font-bold text-red-600">{day.totalFat}g</p>
                    </div>
                  </div>
                </div>

                {/* Difference */}
                <div className="mt-4 pt-4 border-t">
                  {day.status === 'on-track' && (
                    <p className="text-sm text-green-700">
                      ✓ Within 10% of target
                    </p>
                  )}
                  {day.status === 'over' && (
                    <p className="text-sm text-red-700">
                      ⚠ Over by {day.totalCalories - day.target} calories
                    </p>
                  )}
                  {day.status === 'under' && (
                    <p className="text-sm text-yellow-700">
                      ↓ Under by {day.target - day.totalCalories} calories
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Legend */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Compliance Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <p className="text-gray-700">
                <span className="font-semibold">On Track:</span> Within 10% of target
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <p className="text-gray-700">
                <span className="font-semibold">Over:</span> More than 10% above target
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <p className="text-gray-700">
                <span className="font-semibold">Under:</span> More than 10% below target
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
