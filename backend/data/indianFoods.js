// Comprehensive Indian Food Database with accurate nutritional information
const indianFoods = [
  // Breads & Grains
  { id: "roti", name: "🫓 Roti (1 piece)", calories: 71, protein: 3, carbs: 15, fat: 0.4, category: "Breads" },
  { id: "chapati", name: "🫓 Chapati (1 piece)", calories: 104, protein: 3, carbs: 18, fat: 2.5, category: "Breads" },
  { id: "butter-naan", name: "🫓 Butter Naan (1 piece)", calories: 262, protein: 9, carbs: 45, fat: 5, category: "Breads" },
  { id: "garlic-naan", name: "🫓 Garlic Naan (1 piece)", calories: 285, protein: 10, carbs: 48, fat: 6, category: "Breads" },
  { id: "plain-paratha", name: "🫓 Plain Paratha (1 piece)", calories: 126, protein: 3, carbs: 18, fat: 5, category: "Breads" },
  { id: "aloo-paratha", name: "🥔 Aloo Paratha (1 piece)", calories: 210, protein: 4, carbs: 30, fat: 8, category: "Breads" },
  { id: "paneer-paratha", name: "🧀 Paneer Paratha (1 piece)", calories: 290, protein: 12, carbs: 28, fat: 14, category: "Breads" },
  { id: "puri", name: "🫓 Puri (1 piece)", calories: 112, protein: 2, carbs: 13, fat: 6, category: "Breads" },
  { id: "bhatura", name: "🫓 Bhatura (1 piece)", calories: 250, protein: 5, carbs: 35, fat: 10, category: "Breads" },
  { id: "kulcha", name: "🫓 Kulcha (1 piece)", calories: 180, protein: 5, carbs: 32, fat: 3, category: "Breads" },
  { id: "thepla", name: "🫓 Thepla (1 piece)", calories: 95, protein: 3, carbs: 16, fat: 2, category: "Breads" },
  
  // Rice Dishes
  { id: "white-rice", name: "🍚 White Rice Cooked (100g)", calories: 130, protein: 2.7, carbs: 28, fat: 0.3, category: "Rice" },
  { id: "brown-rice", name: "🍚 Brown Rice Cooked (100g)", calories: 112, protein: 2.6, carbs: 24, fat: 0.9, category: "Rice" },
  { id: "jeera-rice", name: "🍚 Jeera Rice (100g)", calories: 180, protein: 3, carbs: 32, fat: 4, category: "Rice" },
  { id: "veg-biryani", name: "🍛 Veg Biryani (1 plate)", calories: 380, protein: 8, carbs: 58, fat: 12, category: "Rice" },
  { id: "chicken-biryani", name: "🍛 Chicken Biryani (1 plate)", calories: 450, protein: 25, carbs: 55, fat: 15, category: "Rice" },
  { id: "mutton-biryani", name: "🍛 Mutton Biryani (1 plate)", calories: 520, protein: 28, carbs: 56, fat: 20, category: "Rice" },
  { id: "egg-biryani", name: "🍛 Egg Biryani (1 plate)", calories: 420, protein: 18, carbs: 54, fat: 14, category: "Rice" },
  { id: "pulao", name: "🍚 Pulao (1 plate)", calories: 320, protein: 6, carbs: 48, fat: 10, category: "Rice" },
  { id: "curd-rice", name: "🍚 Curd Rice (100g)", calories: 140, protein: 4, carbs: 22, fat: 4, category: "Rice" },
  { id: "khichdi", name: "🍚 Khichdi (100g)", calories: 120, protein: 4, carbs: 20, fat: 2, category: "Rice" },
  
  // Dals & Lentils
  { id: "dal-tadka", name: "🫘 Dal Tadka (100g)", calories: 105, protein: 6, carbs: 15, fat: 2.5, category: "Dal" },
  { id: "dal-fry", name: "🫘 Dal Fry (100g)", calories: 120, protein: 7, carbs: 16, fat: 3, category: "Dal" },
  { id: "dal-makhani", name: "🫘 Dal Makhani (100g)", calories: 150, protein: 8, carbs: 12, fat: 8, category: "Dal" },
  { id: "rajma", name: "🫘 Rajma (100g)", calories: 140, protein: 9, carbs: 20, fat: 3, category: "Dal" },
  { id: "chole", name: "🫘 Chole (100g)", calories: 164, protein: 9, carbs: 27, fat: 3, category: "Dal" },
  { id: "sambar", name: "🫘 Sambar (100ml)", calories: 85, protein: 4, carbs: 12, fat: 2, category: "Dal" },
  { id: "moong-dal", name: "🫘 Moong Dal (100g)", calories: 110, protein: 7, carbs: 16, fat: 2, category: "Dal" },
  { id: "toor-dal", name: "🫘 Toor Dal (100g)", calories: 115, protein: 6, carbs: 18, fat: 2.5, category: "Dal" },
  
  // Chicken Dishes
  { id: "butter-chicken", name: "🍗 Butter Chicken (150g)", calories: 280, protein: 22, carbs: 8, fat: 18, category: "Chicken" },
  { id: "chicken-curry", name: "🍗 Chicken Curry (150g)", calories: 220, protein: 25, carbs: 6, fat: 10, category: "Chicken" },
  { id: "chicken-tikka", name: "🍗 Chicken Tikka (100g)", calories: 150, protein: 24, carbs: 2, fat: 5, category: "Chicken" },
  { id: "tandoori-chicken", name: "🍗 Tandoori Chicken (150g)", calories: 180, protein: 28, carbs: 3, fat: 6, category: "Chicken" },
  { id: "chicken-65", name: "🍗 Chicken 65 (100g)", calories: 210, protein: 18, carbs: 8, fat: 12, category: "Chicken" },
  { id: "chicken-korma", name: "🍗 Chicken Korma (150g)", calories: 310, protein: 20, carbs: 10, fat: 22, category: "Chicken" },
  { id: "chicken-kebab", name: "🍗 Chicken Kebab (100g)", calories: 165, protein: 22, carbs: 3, fat: 7, category: "Chicken" },
  
  // Paneer Dishes
  { id: "paneer-tikka", name: "🧀 Paneer Tikka (100g)", calories: 265, protein: 14, carbs: 6, fat: 20, category: "Paneer" },
  { id: "paneer-butter-masala", name: "🧀 Paneer Butter Masala (150g)", calories: 320, protein: 15, carbs: 12, fat: 24, category: "Paneer" },
  { id: "palak-paneer", name: "🧀 Palak Paneer (150g)", calories: 280, protein: 14, carbs: 10, fat: 20, category: "Paneer" },
  { id: "kadai-paneer", name: "🧀 Kadai Paneer (150g)", calories: 290, protein: 13, carbs: 11, fat: 22, category: "Paneer" },
  { id: "shahi-paneer", name: "🧀 Shahi Paneer (150g)", calories: 340, protein: 14, carbs: 14, fat: 26, category: "Paneer" },
  { id: "paneer-bhurji", name: "🧀 Paneer Bhurji (100g)", calories: 220, protein: 12, carbs: 5, fat: 16, category: "Paneer" },
  { id: "matar-paneer", name: "🧀 Matar Paneer (150g)", calories: 260, protein: 12, carbs: 15, fat: 18, category: "Paneer" },
  
  // Vegetables
  { id: "aloo-gobi", name: "🥔 Aloo Gobi (100g)", calories: 95, protein: 2, carbs: 14, fat: 3.5, category: "Vegetables" },
  { id: "bhindi-masala", name: "🫛 Bhindi Masala (100g)", calories: 88, protein: 2, carbs: 10, fat: 4, category: "Vegetables" },
  { id: "baingan-bharta", name: "🍆 Baingan Bharta (100g)", calories: 110, protein: 2, carbs: 12, fat: 6, category: "Vegetables" },
  { id: "mix-veg", name: "🥬 Mix Veg Curry (100g)", calories: 85, protein: 3, carbs: 12, fat: 3, category: "Vegetables" },
  { id: "aloo-matar", name: "🥔 Aloo Matar (100g)", calories: 105, protein: 3, carbs: 16, fat: 3.5, category: "Vegetables" },
  { id: "saag", name: "🥬 Saag (100g)", calories: 75, protein: 4, carbs: 8, fat: 3, category: "Vegetables" },
  { id: "gajar-matar", name: "🥕 Gajar Matar (100g)", calories: 90, protein: 3, carbs: 14, fat: 2.5, category: "Vegetables" },
  
  // South Indian
  { id: "idli", name: "🥞 Idli (1 piece)", calories: 39, protein: 2, carbs: 8, fat: 0.1, category: "South Indian" },
  { id: "plain-dosa", name: "🥞 Dosa Plain (1 piece)", calories: 133, protein: 4, carbs: 25, fat: 2, category: "South Indian" },
  { id: "masala-dosa", name: "🥞 Masala Dosa (1 piece)", calories: 220, protein: 6, carbs: 38, fat: 5, category: "South Indian" },
  { id: "rava-dosa", name: "🥞 Rava Dosa (1 piece)", calories: 180, protein: 5, carbs: 30, fat: 4, category: "South Indian" },
  { id: "uttapam", name: "🥞 Uttapam (1 piece)", calories: 180, protein: 5, carbs: 32, fat: 3, category: "South Indian" },
  { id: "vada", name: "🍩 Vada (1 piece)", calories: 90, protein: 3, carbs: 10, fat: 4, category: "South Indian" },
  { id: "upma", name: "🍚 Upma (100g)", calories: 150, protein: 4, carbs: 24, fat: 4, category: "South Indian" },
  { id: "pongal", name: "🍚 Pongal (100g)", calories: 180, protein: 5, carbs: 28, fat: 5, category: "South Indian" },
  { id: "appam", name: "🥞 Appam (1 piece)", calories: 120, protein: 2, carbs: 24, fat: 1, category: "South Indian" },
  
  // Snacks & Street Food
  { id: "samosa", name: "🥟 Samosa (1 piece)", calories: 262, protein: 5, carbs: 30, fat: 13, category: "Snacks" },
  { id: "pakora", name: "🍤 Pakora (100g)", calories: 280, protein: 6, carbs: 28, fat: 16, category: "Snacks" },
  { id: "kachori", name: "🥟 Kachori (1 piece)", calories: 186, protein: 4, carbs: 22, fat: 9, category: "Snacks" },
  { id: "dhokla", name: "🧽 Dhokla (100g)", calories: 160, protein: 5, carbs: 28, fat: 3, category: "Snacks" },
  { id: "poha", name: "🍚 Poha (100g)", calories: 180, protein: 3, carbs: 32, fat: 4, category: "Snacks" },
  { id: "bhel-puri", name: "🥨 Bhel Puri (100g)", calories: 200, protein: 4, carbs: 35, fat: 5, category: "Snacks" },
  { id: "pani-puri", name: "🌮 Pani Puri (6 pieces)", calories: 180, protein: 4, carbs: 32, fat: 4, category: "Snacks" },
  { id: "vada-pav", name: "🥪 Vada Pav (1 piece)", calories: 290, protein: 6, carbs: 45, fat: 10, category: "Snacks" },
  { id: "sev-puri", name: "🥨 Sev Puri (6 pieces)", calories: 220, protein: 5, carbs: 30, fat: 8, category: "Snacks" },
  
  // Sweets & Desserts
  { id: "gulab-jamun", name: "🍯 Gulab Jamun (1 piece)", calories: 175, protein: 3, carbs: 28, fat: 6, category: "Sweets" },
  { id: "rasgulla", name: "🍯 Rasgulla (1 piece)", calories: 106, protein: 2, carbs: 20, fat: 2, category: "Sweets" },
  { id: "jalebi", name: "🍯 Jalebi (100g)", calories: 450, protein: 4, carbs: 70, fat: 18, category: "Sweets" },
  { id: "kheer", name: "🍮 Kheer (100g)", calories: 140, protein: 4, carbs: 22, fat: 4, category: "Sweets" },
  { id: "besan-ladoo", name: "🍯 Besan Ladoo (1 piece)", calories: 120, protein: 2, carbs: 18, fat: 5, category: "Sweets" },
  { id: "ras-malai", name: "🍯 Ras Malai (1 piece)", calories: 156, protein: 4, carbs: 22, fat: 6, category: "Sweets" },
  { id: "kulfi", name: "🍮 Kulfi (1 piece)", calories: 95, protein: 2, carbs: 15, fat: 3, category: "Sweets" },
  { id: "halwa", name: "🍯 Halwa (100g)", calories: 320, protein: 4, carbs: 45, fat: 14, category: "Sweets" },
  
  // Beverages
  { id: "sweet-lassi", name: "🥛 Sweet Lassi (200ml)", calories: 150, protein: 6, carbs: 24, fat: 3, category: "Beverages" },
  { id: "salted-lassi", name: "🥛 Salted Lassi (200ml)", calories: 90, protein: 6, carbs: 10, fat: 3, category: "Beverages" },
  { id: "mango-lassi", name: "🥛 Mango Lassi (200ml)", calories: 180, protein: 5, carbs: 32, fat: 4, category: "Beverages" },
  { id: "chai", name: "☕ Chai with Milk & Sugar (1 cup)", calories: 80, protein: 2, carbs: 12, fat: 3, category: "Beverages" },
  { id: "black-tea", name: "☕ Black Tea (1 cup)", calories: 2, protein: 0, carbs: 0.5, fat: 0, category: "Beverages" },
  { id: "black-coffee", name: "☕ Black Coffee (1 cup)", calories: 2, protein: 0, carbs: 0, fat: 0, category: "Beverages" },
  { id: "full-fat-milk", name: "🥛 Milk Full Fat (200ml)", calories: 120, protein: 8, carbs: 10, fat: 6, category: "Beverages" },
  { id: "low-fat-milk", name: "🥛 Milk Low Fat (200ml)", calories: 80, protein: 8, carbs: 12, fat: 2, category: "Beverages" },
  { id: "coconut-water", name: "🥥 Coconut Water (200ml)", calories: 36, protein: 1, carbs: 8, fat: 0.2, category: "Beverages" },
  { id: "buttermilk", name: "🥛 Buttermilk (200ml)", calories: 60, protein: 4, carbs: 8, fat: 1.5, category: "Beverages" },
  { id: "lime-water", name: "🧃 Fresh Lime Water (200ml)", calories: 25, protein: 0, carbs: 6, fat: 0, category: "Beverages" },
  
  // Sides & Accompaniments
  { id: "mixed-raita", name: "🥗 Mixed Raita (100g)", calories: 65, protein: 3, carbs: 6, fat: 3, category: "Sides" },
  { id: "cucumber-raita", name: "🥗 Cucumber Raita (100g)", calories: 55, protein: 3, carbs: 5, fat: 2.5, category: "Sides" },
  { id: "mixed-pickle", name: "🌶️ Mixed Pickle (20g)", calories: 30, protein: 0.5, carbs: 3, fat: 2, category: "Sides" },
  { id: "mango-pickle", name: "🌶️ Mango Pickle (20g)", calories: 35, protein: 0.5, carbs: 4, fat: 2.5, category: "Sides" },
  { id: "green-salad", name: "🥗 Green Salad (100g)", calories: 25, protein: 2, carbs: 4, fat: 0.5, category: "Sides" },
  { id: "mint-chutney", name: "🧄 Mint Chutney (20g)", calories: 15, protein: 0.5, carbs: 2, fat: 0.5, category: "Sides" },
  { id: "tamarind-chutney", name: "🌶️ Tamarind Chutney (20g)", calories: 25, protein: 0, carbs: 6, fat: 0, category: "Sides" },
  { id: "papad", name: "🥜 Papad (1 piece)", calories: 45, protein: 2, carbs: 6, fat: 1.5, category: "Sides" },
  
  // Breakfast Items
  { id: "besan-chilla", name: "🥞 Besan Chilla (1 piece)", calories: 120, protein: 6, carbs: 12, fat: 5, category: "Breakfast" },
  { id: "bread-upma", name: "🍞 Bread Upma (100g)", calories: 160, protein: 4, carbs: 28, fat: 4, category: "Breakfast" },
  { id: "rava-upma", name: "🥞 Rava Upma (100g)", calories: 150, protein: 4, carbs: 24, fat: 4, category: "Breakfast" },
  { id: "aloo-poha", name: "🥞 Aloo Poha (100g)", calories: 180, protein: 3, carbs: 32, fat: 4, category: "Breakfast" },
  { id: "masala-omelette", name: "🍳 Masala Omelette (2 eggs)", calories: 220, protein: 16, carbs: 3, fat: 16, category: "Breakfast" },
  { id: "bread-pakora", name: "🍞 Bread Pakora (1 piece)", calories: 180, protein: 6, carbs: 20, fat: 8, category: "Breakfast" },
];

export default indianFoods;