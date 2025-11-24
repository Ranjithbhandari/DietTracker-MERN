

export default function MealCard({ meal, onDelete }) {
  const getMealTypeIcon = (type) => {
    switch (type) {
      case 'breakfast':
        return '🌅';
      case 'lunch':
        return '🍽️';
      case 'dinner':
        return '🍽️';
      case 'snack':
        return '🍎';
      default:
        return '🍴';
    }
  };

  const getMealTypeLabel = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200 hover:shadow-md transition">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Meal Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{getMealTypeIcon(meal.mealType)}</span>
            <h3 className="text-lg font-bold text-gray-800">
              {meal.foodName}
            </h3>
            <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
              {getMealTypeLabel(meal.mealType)}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {meal.createdAt && new Date(meal.createdAt).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        {/* Nutritional Info */}
        <div className="grid grid-cols-4 gap-3 md:gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Calories</p>
            <p className="font-bold text-blue-600">{meal.calories}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Protein</p>
            <p className="font-bold text-orange-600">{meal.protein}g</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Carbs</p>
            <p className="font-bold text-yellow-600">{meal.carbs}g</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Fat</p>
            <p className="font-bold text-red-600">{meal.fat}g</p>
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(meal._id)}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
