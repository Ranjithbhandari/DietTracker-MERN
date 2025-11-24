# DietTracker - Quick Reference Guide

## 🎯 What is DietTracker?

A full-stack MERN application that helps users:
1. Calculate personalized nutrition targets (BMR, TDEE, calorie goals)
2. Log daily meals with nutritional information
3. Track progress with real-time visual indicators
4. View historical data and compliance patterns

## ⚡ 5-Minute Setup

### 1. MongoDB Setup (2 min)
```
1. Go to mongodb.com/cloud/atlas
2. Create free account → Create cluster (M0)
3. Create user → Whitelist IP (0.0.0.0/0)
4. Copy connection string
```

### 2. Backend Setup (2 min)
```bash
cd backend
npm install
# Create .env with:
# PORT=5000
# MONGODB_URI=<your-connection-string>
# JWT_SECRET=your-secret-key-min-32-chars
npm start
```

### 3. Frontend Setup (1 min)
```bash
cd frontend
npm install
# Create .env with:
# VITE_API_URL=http://localhost:5000/api
npm run dev
```

### 4. Access
Open `http://localhost:5173` → Sign up → Complete profile → Start logging meals!

## 📁 Key Files

| File | Purpose |
|------|---------|
| `backend/server.js` | Express server & CORS config |
| `backend/models/User.js` | User schema with assessment data |
| `backend/models/Meal.js` | Meal schema with nutrition info |
| `backend/routes/auth.js` | Register & login endpoints |
| `backend/routes/user.js` | Profile & assessment endpoints |
| `backend/routes/meals.js` | Meal CRUD endpoints |
| `backend/utils/calculations.js` | BMR/TDEE/macro calculations |
| `frontend/src/context/AuthContext.jsx` | Auth state management |
| `frontend/src/api/axios.js` | API client with JWT |
| `frontend/src/pages/Login.jsx` | Login page |
| `frontend/src/pages/Dashboard.jsx` | Main tracking page |
| `frontend/src/pages/Profile.jsx` | Diet assessment page |
| `frontend/src/pages/AddMeal.jsx` | Meal entry form |
| `frontend/src/pages/History.jsx` | 7-10 day history view |

## 🔌 API Quick Reference

### Register
```bash
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```bash
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Profile
```bash
GET /api/user/profile
Header: Authorization: Bearer <token>
```

### Update Profile (Assessment)
```bash
PUT /api/user/profile
Header: Authorization: Bearer <token>
{
  "age": 25,
  "gender": "male",
  "height": 180,
  "weight": 75,
  "activityLevel": "moderate",
  "goal": "maintain",
  "dietType": "balanced"
}
```

### Add Meal
```bash
POST /api/meals
Header: Authorization: Bearer <token>
{
  "mealType": "breakfast",
  "foodName": "Oatmeal with berries",
  "calories": 350,
  "protein": 12,
  "carbs": 55,
  "fat": 8
}
```

### Get Today's Meals
```bash
GET /api/meals/today
Header: Authorization: Bearer <token>
```

### Get History (7-10 days)
```bash
GET /api/meals/history
Header: Authorization: Bearer <token>
```

### Delete Meal
```bash
DELETE /api/meals/<meal-id>
Header: Authorization: Bearer <token>
```

## 🧮 Calculation Formulas

### BMR (Mifflin-St Jeor)
```
Male: (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5
Female: (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161
```

### TDEE
```
TDEE = BMR × Activity Multiplier
- Sedentary: 1.2
- Light: 1.375
- Moderate: 1.55
- Active: 1.725
- Very Active: 1.9
```

### Calorie Target
```
- Lose: TDEE - 500
- Maintain: TDEE
- Gain: TDEE + 500
```

### Macros (example: Balanced diet)
```
Protein: 30% of calories ÷ 4 = grams
Carbs: 40% of calories ÷ 4 = grams
Fat: 30% of calories ÷ 9 = grams
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Run specific test
npm test -- auth.property.test.js
```

## 🚀 Deployment

### Backend to Render
1. Push to GitHub
2. Create Web Service on Render
3. Set env vars: `MONGODB_URI`, `JWT_SECRET`
4. Deploy

### Frontend to Vercel
1. Push to GitHub
2. Import on Vercel
3. Set env var: `VITE_API_URL=https://your-backend.onrender.com/api`
4. Deploy

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Login not working | Check backend running on 5000, verify `.env` files |
| CORS error | Verify `VITE_API_URL` in frontend `.env` |
| MongoDB error | Check connection string, IP whitelist |
| Styling broken | Clear cache (Ctrl+Shift+Delete), hard refresh |
| Port 5000 in use | Kill process: `lsof -i :5000` then `kill -9 <PID>` |

## 📊 Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  age: Number,
  gender: String,
  height: Number,
  weight: Number,
  activityLevel: String,
  goal: String,
  dietType: String,
  calorieTarget: Number,
  macros: { protein, carbs, fat },
  createdAt: Date,
  updatedAt: Date
}
```

### Meal
```javascript
{
  userId: ObjectId,
  date: Date,
  mealType: String,
  foodName: String,
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Security

- Passwords: bcrypt with 10 salt rounds
- JWT: 24-hour expiration
- CORS: Configured for localhost & Vercel
- Validation: All inputs validated
- Protected routes: JWT required

## 📱 Pages & Routes

| Page | Route | Auth Required |
|------|-------|---------------|
| Login | `/login` | No |
| Register | `/register` | No |
| Dashboard | `/dashboard` | Yes |
| Profile | `/profile` | Yes |
| Add Meal | `/add-meal` | Yes |
| History | `/history` | Yes |

## 🎨 UI Components

- **ProgressCircle** - Circular progress indicator
- **MealCard** - Meal display with delete
- **Navbar** - Navigation with logout
- **ProtectedRoute** - Route guard component
- **AuthContext** - Auth state provider

## 📚 Documentation Files

- `README.md` - Full project documentation
- `SETUP_GUIDE.md` - Detailed setup instructions
- `LOGIN_TROUBLESHOOTING.md` - Login issues & solutions
- `QUICK_REFERENCE.md` - This file
- `.kiro/specs/diet-tracker/requirements.md` - Requirements
- `.kiro/specs/diet-tracker/design.md` - Architecture & design
- `.kiro/specs/diet-tracker/tasks.md` - Implementation tasks

## 🎯 User Flow

```
1. User visits http://localhost:5173
   ↓
2. Redirected to /login (not authenticated)
   ↓
3. Click "Sign up" → /register
   ↓
4. Fill form → Submit → Register API call
   ↓
5. Redirected to /profile
   ↓
6. Complete diet assessment → Save
   ↓
7. Redirected to /dashboard
   ↓
8. View today's progress, add meals
   ↓
9. View history, track compliance
   ↓
10. Logout → Back to /login
```

## 💡 Tips

1. **First time?** Start with SETUP_GUIDE.md
2. **Issues?** Check LOGIN_TROUBLESHOOTING.md
3. **Want details?** Read README.md
4. **Need API info?** Check this file
5. **Deploying?** See SETUP_GUIDE.md deployment section

## 🔗 Useful Links

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Render](https://render.com) - Backend hosting
- [Vercel](https://vercel.com) - Frontend hosting
- [Mifflin-St Jeor Equation](https://en.wikipedia.org/wiki/Basal_metabolic_rate)

## ✅ Checklist

- [ ] MongoDB cluster created
- [ ] Backend `.env` configured
- [ ] Frontend `.env` configured
- [ ] Backend running on 5000
- [ ] Frontend running on 5173
- [ ] Can register account
- [ ] Can login
- [ ] Can complete assessment
- [ ] Can add meals
- [ ] Can view dashboard
- [ ] Can view history
- [ ] Tests passing

## 🎓 Learning Resources

This project demonstrates:
- ✅ Full-stack MERN development
- ✅ JWT authentication
- ✅ RESTful API design
- ✅ React hooks & context
- ✅ Tailwind CSS responsive design
- ✅ MongoDB schema design
- ✅ Property-based testing
- ✅ Production deployment
- ✅ Error handling
- ✅ CORS configuration

---

**Need help?** Check the documentation files or review the code comments!
