# DietTracker - Online Diet & Lifestyle Assessment Tool

A full-stack MERN application for tracking diet and lifestyle metrics with personalized nutrition targets.

## 🚀 Features

### Core Features
- **User Authentication**: Secure registration and login with JWT
- **Diet Assessment**: Calculate BMR, TDEE, and personalized calorie targets using Mifflin-St Jeor equation
- **Meal Logging**: Track daily meals with comprehensive Indian food database
- **Progress Tracking**: Real-time progress visualization with circular indicators
- **History & Compliance**: View 30-day history with compliance status and CSV export
- **Responsive Design**: Mobile-first UI with beautiful glassmorphism design

### Premium Features
- **Weight Tracking**: Log daily weight with 90-day progress charts and trend analysis
- **Activity Tracking**: Log exercises and activities with calorie burn calculation
- **Water Tracking**: Monitor daily water intake with goal tracking
- **Fasting Timer**: Intermittent fasting timer with session tracking
- **Real-time Updates**: Global event system for instant UI updates
- **Indian Food Database**: Comprehensive database of Indian foods with nutritional info
- **Custom Foods**: Add and manage custom food items
- **Recipe Management**: Create and save custom recipes
- **Advanced Analytics**: Net calories, protein targets, and comprehensive metrics

### Technical Features
- **Property-Based Testing**: 34+ correctness properties with fast-check
- **Real-time Data Sync**: Global event system for instant updates
- **Advanced Error Handling**: Comprehensive error handling with user-friendly messages
- **Performance Optimized**: Parallel data fetching and optimized queries

## 📋 Tech Stack

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **React Hot Toast** - Toast notifications
- **date-fns** - Date manipulation

### Testing
- **Jest** - Backend testing
- **Vitest** - Frontend testing
- **fast-check** - Property-based testing
- **Supertest** - API testing
- **MongoDB Memory Server** - In-memory database for tests

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (free tier available)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB URI and JWT secret:
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/diettracker?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

5. Start the backend:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. For development, the frontend will proxy API requests to `http://localhost:5000` (configured in vite.config.js)

5. Start the frontend:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🗄️ MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (M0 free tier)
4. Create a database user with username and password
5. Whitelist your IP address (or use 0.0.0.0/0 for development)
6. Get your connection string and update `.env` in backend

Connection string format:
```
mongodb+srv://username:password@cluster-name.mongodb.net/diettracker?retryWrites=true&w=majority
```

## 🧪 Testing

### Backend Tests

Run all tests:
```bash
cd backend
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run specific test file:
```bash
npm test -- auth.property.test.js
```

### Frontend Tests

Run all tests:
```bash
cd frontend
npm run test:run
```

Run tests in watch mode:
```bash
npm test
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User Profile
- `GET /api/user/profile` - Get user profile (protected)
- `PUT /api/user/profile` - Update profile and assessment (protected)

### Meals
- `POST /api/meals` - Create meal entry (protected)
- `GET /api/meals/today` - Get today's meals (protected)
- `GET /api/meals/history` - Get last 30 days (protected)
- `DELETE /api/meals/:id` - Delete meal (protected)

### Weight Tracking
- `POST /api/weight` - Log weight entry (protected)
- `GET /api/weight/latest` - Get current weight (protected)
- `GET /api/weight/history` - Get weight history (protected)
- `GET /api/weight/trend` - Get weight trend analysis (protected)
- `DELETE /api/weight/:id` - Delete weight entry (protected)

### Activities
- `POST /api/activities` - Log activity (protected)
- `GET /api/activities/today` - Get today's activities (protected)
- `GET /api/activities/history` - Get activity history (protected)
- `DELETE /api/activities/:id` - Delete activity (protected)

### Water Tracking
- `POST /api/water` - Log water intake (protected)
- `GET /api/water/today` - Get today's water intake (protected)
- `PUT /api/water/goal` - Update water goal (protected)

### Fasting
- `POST /api/fasting/start` - Start fasting session (protected)
- `POST /api/fasting/end` - End fasting session (protected)
- `GET /api/fasting/current` - Get current session (protected)
- `GET /api/fasting/history` - Get fasting history (protected)

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User registers or logs in
2. Server returns JWT token
3. Token is stored in localStorage
4. Token is sent with every protected request in Authorization header
5. Server verifies token before allowing access

## 📱 Responsive Design

The application is fully responsive:
- **Mobile**: Optimized for small screens (< 640px)
- **Tablet**: Optimized for medium screens (640px - 1024px)
- **Desktop**: Optimized for large screens (> 1024px)

## 🚀 Deployment

### Deploy Backend to Render

1. **Prepare your repository**:
   - Push your code to GitHub
   - Ensure `package.json` has correct start script: `"start": "node server.js"`

2. **Create Render Web Service**:
   - Go to [Render](https://render.com) and sign up/login
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the backend folder if using monorepo

3. **Configure deployment settings**:
   - **Name**: `diettracker-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or paid for better performance)

4. **Set environment variables**:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/diettracker?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
   NODE_ENV=production
   PORT=5000
   ```

5. **Deploy**: Click "Create Web Service"

6. **Note your backend URL**: `https://your-app-name.onrender.com`

### Deploy Frontend to Vercel

1. **Prepare your repository**:
   - Ensure frontend builds successfully: `npm run build`
   - Verify `dist` folder is created

2. **Create Vercel Project**:
   - Go to [Vercel](https://vercel.com) and sign up/login
   - Click "New Project"
   - Import your GitHub repository
   - Select the frontend folder if using monorepo

3. **Configure build settings**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Set environment variables**:
   ```
   VITE_API_URL=https://your-backend-app.onrender.com/api
   ```

5. **Deploy**: Click "Deploy"

6. **Custom Domain** (Optional):
   - Go to Project Settings → Domains
   - Add your custom domain

### Post-Deployment Checklist

- [ ] Backend health check: `https://your-backend.onrender.com/api/health`
- [ ] Frontend loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] API calls work from frontend to backend
- [ ] CORS is configured correctly
- [ ] MongoDB connection is working
- [ ] All environment variables are set

### Troubleshooting Deployment

**Backend Issues**:
- Check Render logs for errors
- Verify MongoDB URI is correct
- Ensure JWT_SECRET is set
- Check that PORT is set to 5000 or process.env.PORT

**Frontend Issues**:
- Verify VITE_API_URL points to your backend
- Check browser console for CORS errors
- Ensure backend allows your Vercel domain in CORS settings

**CORS Issues**:
- Backend automatically allows `*.vercel.app` domains
- For custom domains, update CORS configuration in `backend/server.js`

## 🔄 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api  # Development
VITE_API_URL=https://your-backend.onrender.com/api  # Production
```

## 📊 Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  age: Number,
  gender: String,
  height: Number (cm),
  weight: Number (kg),
  activityLevel: String,
  goal: String,
  dietType: String,
  calorieTarget: Number,
  macros: {
    protein: Number,
    carbs: Number,
    fat: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Meal
```javascript
{
  userId: ObjectId (ref: User),
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

## 🧮 Calculations

### BMR (Basal Metabolic Rate) - Mifflin-St Jeor Equation
- **Male**: (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5
- **Female**: (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161

### TDEE (Total Daily Energy Expenditure)
- TDEE = BMR × Activity Level Multiplier
- Multipliers: Sedentary (1.2), Light (1.375), Moderate (1.55), Active (1.725), Very Active (1.9)

### Calorie Target
- Lose: TDEE - 500
- Maintain: TDEE
- Gain: TDEE + 500

### Macro Distribution
- **Balanced**: 30% protein, 40% carbs, 30% fat
- **Low Carb**: 35% protein, 25% carbs, 40% fat
- **High Protein**: 40% protein, 30% carbs, 30% fat
- **Keto**: 25% protein, 5% carbs, 70% fat

## 🧪 Property-Based Testing

The application includes comprehensive property-based tests using fast-check:

### Properties Tested
1. **Password hashing integrity** - Passwords are hashed and verifiable
2. **JWT token validity** - Tokens are decodable and contain correct user ID
3. **Protected route authorization** - Invalid tokens rejected, valid tokens allowed
4. **Data isolation** - Users only see their own data
5. **BMR calculation correctness** - Mifflin-St Jeor equation implemented correctly
6. **TDEE calculation correctness** - Activity multipliers applied correctly
7. **Calorie target calculation** - Goal adjustments applied correctly
8. **Macro distribution** - Percentages converted to grams correctly
9. **Assessment data persistence** - Same inputs produce same outputs
10. **Meal creation and retrieval** - Meals stored and retrieved correctly
11. **Meal deletion** - Deleted meals removed from database
12. **Daily totals calculation** - Sums calculated correctly
13. **Remaining calories calculation** - Remaining = target - consumed
14. **Over-target status** - Correctly identified when over target
15. **History retrieval and aggregation** - Last 7-10 days aggregated correctly
16. **Compliance status calculation** - On-track/over/under calculated correctly
17. **User schema completeness** - All fields stored correctly
18. **Meal schema completeness** - All fields stored correctly
19. **Date type consistency** - Dates stored as Date objects
20. **Progress indicator accuracy** - Percentage calculated correctly
21. **Error message display** - User-friendly errors displayed
22. **Input validation** - Invalid inputs rejected with 400 status

Each property is tested with 100+ random inputs to ensure correctness.

## 🐛 Troubleshooting

### MongoDB Connection Error
- Verify MongoDB URI in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

### CORS Error
- Backend CORS is configured for localhost and Vercel domains
- Check that frontend URL is whitelisted in backend

### API Not Found
- Ensure backend is running on port 5000
- Check that Vite proxy is configured correctly
- Verify API routes are mounted under `/api` prefix

### Tests Failing
- Ensure MongoDB Memory Server is installed
- Check that all dependencies are installed
- Run `npm install` in both backend and frontend

## 📝 Project Structure

```
DietTracker/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   └── Meal.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── user.js
│   │   └── meals.js
│   ├── middleware/
│   │   └── auth.js
│   ├── utils/
│   │   └── calculations.js
│   ├── __tests__/
│   │   ├── models.property.test.js
│   │   ├── auth.property.test.js
│   │   ├── calculations.property.test.js
│   │   ├── meals.property.test.js
│   │   ├── user.property.test.js
│   │   └── validation.property.test.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ProgressCircle.jsx
│   │   │   └── MealCard.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── AddMeal.jsx
│   │   │   └── History.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

## 📄 License

This project is open source and available under the ISC License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue on GitHub.

## 🎯 Live Demo

- **Frontend**: [Coming Soon]
- **Backend API**: [Coming Soon]

---

**Built with ❤️ using MERN Stack**
