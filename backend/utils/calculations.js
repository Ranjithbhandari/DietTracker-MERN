// Calculate BMR using Mifflin-St Jeor equation
export const calculateBMR = (age, gender, height, weight) => {
  if (gender === 'male') {
    return (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    return (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }
};

// Activity level multipliers
const activityMultipliers = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

// Calculate TDEE
export const calculateTDEE = (bmr, activityLevel) => {
  const multiplier = activityMultipliers[activityLevel] || 1.2;
  return bmr * multiplier;
};

// Calculate calorie target based on goal
export const calculateCalorieTarget = (tdee, goal) => {
  switch (goal) {
    case 'lose':
      return tdee - 500;
    case 'gain':
      return tdee + 500;
    case 'maintain':
    default:
      return tdee;
  }
};

// Science-based macro calculation using exact formulas
export const calculateMacros = (calories, dietType, weight) => {
  // Protein: 2.0g per kg body weight (rounded)
  const protein = Math.round(2.0 * weight);
  const proteinCalories = protein * 4;
  
  let fat, carbs, fatCalories, carbCalories;
  
  if (dietType === 'keto') {
    // Keto: set carbs to 30g max, rest to fat
    carbs = 30;
    carbCalories = carbs * 4;
    fatCalories = calories - proteinCalories - carbCalories;
    fat = Math.round(fatCalories / 9);
  } else if (dietType === 'low_carb') {
    // Low carb: reduce carbs by 40%, add saved calories to fat
    // Start with 30% fat baseline
    const baseFatCalories = calories * 0.30;
    const baseCarbCalories = calories - proteinCalories - baseFatCalories;
    
    // Reduce carbs by 40%
    carbCalories = baseCarbCalories * 0.6;
    carbs = Math.round(carbCalories / 4);
    
    // Add saved carb calories to fat
    fatCalories = baseFatCalories + (baseCarbCalories * 0.4);
    fat = Math.round(fatCalories / 9);
  } else {
    // Balanced and high_protein: Fat = 30% of daily calories
    fatCalories = calories * 0.30;
    fat = Math.round(fatCalories / 9);
    
    // Carbs = remaining calories after protein & fat
    carbCalories = calories - proteinCalories - fatCalories;
    carbs = Math.round(carbCalories / 4);
  }
  
  return {
    protein,
    carbs: Math.max(carbs, 0), // Ensure non-negative
    fat: Math.max(fat, 0), // Ensure non-negative
  };
};

// Complete assessment calculation
export const calculateAssessment = (age, gender, height, weight, activityLevel, goal, dietType) => {
  const bmr = calculateBMR(age, gender, height, weight);
  const tdee = calculateTDEE(bmr, activityLevel);
  const calorieTarget = calculateCalorieTarget(tdee, goal);
  const macros = calculateMacros(calorieTarget, dietType, weight);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    calorieTarget: Math.round(calorieTarget),
    macros,
  };
};
