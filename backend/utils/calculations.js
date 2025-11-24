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

// Macro distribution percentages by diet type
const macroDist = {
  balanced: { protein: 0.3, carbs: 0.4, fat: 0.3 },
  low_carb: { protein: 0.35, carbs: 0.25, fat: 0.4 },
  high_protein: { protein: 0.4, carbs: 0.3, fat: 0.3 },
  keto: { protein: 0.25, carbs: 0.05, fat: 0.7 },
};

// Calculate macros
export const calculateMacros = (calories, dietType) => {
  const dist = macroDist[dietType] || macroDist.balanced;
  
  return {
    protein: Math.round((calories * dist.protein) / 4),
    carbs: Math.round((calories * dist.carbs) / 4),
    fat: Math.round((calories * dist.fat) / 9),
  };
};

// Complete assessment calculation
export const calculateAssessment = (age, gender, height, weight, activityLevel, goal, dietType) => {
  const bmr = calculateBMR(age, gender, height, weight);
  const tdee = calculateTDEE(bmr, activityLevel);
  const calorieTarget = calculateCalorieTarget(tdee, goal);
  const macros = calculateMacros(calorieTarget, dietType);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    calorieTarget: Math.round(calorieTarget),
    macros,
  };
};
