# DietTracker - Complete Deployment Guide

## Project Overview

DietTracker is a production-ready MERN stack application for diet and lifestyle assessment. It features user authentication, personalized calorie calculations, meal logging, and progress tracking with comprehensive property-based testing.

## ✅ Implementation Complete

All 26 tasks have been successfully completed with:
- **Backend**: Express.js + MongoDB with JWT authentication
- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Testing**: 22 property-based tests covering all critical functionality
- **Deployment**: Ready for Render (backend) and Vercel (frontend)

## Project Structure

```
DietTracker/
├── backend/
│   ├── config/db.js                    # MongoDB connection
│   ├── models/
│   │   ├── User.js                     # User schema with validation
│   │   └── Meal.js                     # Meal schema with indexes
│   ├── routes/
│   │   ├── auth.js                     # Authentication endpoints
│   │   ├── user.js                     # User profile endpoints
│   │   └── meals.js                    # Meal logging endpoints
│   ├── middleware/auth.js              # JWT authentication
│   ├── utils/calculations.js           # BMR/TDEE calculations
│   ├── __tests__/                      # Property-based tests
│   ├── server.js                       # Express server
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── api/axios.js                # Axios with dynamic baseURL
│   │   ├── context/AuthContext.jsx     # Auth state management
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
│   │   ├── App.jsx                     # Main app with routing
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── vite.config.js                  # Vite with API proxy
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── README.md
└── .gitignore
```

## Local Development Setup

### Prerequisites
- Node.js 16+ and npm
- MongoDB Atlas account (free tier)
- Git

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/diettracker
   JWT_SECRET=your-super-secret-key-min-32-characters-long
   PORT=5000
   NODE_ENV=development
   ```

5. **Start backend server**
   ```bash
   npm start
   ```
   Server runs on http://localhost:5000

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```
   Frontend runs on http://localhost:5173

## MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free account

2. **Create a Cluster**
   - Click "Create" to build a new cluster
   - Select "M0 Sandbox" (free tier)
   - Choose your region
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Set username and password
   - Click "Add User"

4. **Whitelist IP Address**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Select "Connect your application"
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `<dbname>` with your values

## Running Tests

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run specific test file
npm test -- auth.property.test.js

# Run with coverage
npm test -- --coverage
```

### Property-Based Tests

All property-based tests run with 100+ iterations:

- **Authentication**: Password hashing, JWT validity, authorization
- **Calculations**: BMR, TDEE, calorie target, macro distribution
- **Meal Tracking**: Creation, retrieval, deletion, aggregation
- **Data Models**: Schema validation, type checking
- **UI Components**: Progress indicator accuracy
- **Validation**: Input validation across all endpoints

## Deployment to Render (Backend)

### Step 1: Prepare Repository

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: DietTracker MERN application"
```

### Step 2: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub account
3. Connect your GitHub repository

### Step 3: Create Web Service

1. Click "New +" → "Web Service"
2. Select your repository
3. Configure:
   - **Name**: diettracker-api
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Region**: Choose closest to you

### Step 4: Add Environment Variables

In Render dashboard:
1. Go to your service
2. Click "Environment"
3. Add variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/diettracker
   JWT_SECRET=your-super-secret-key-min-32-characters-long
   NODE_ENV=production
   ```

### Step 5: Deploy

- Click "Deploy"
- Wait for deployment to complete
- Copy your service URL (e.g., https://diettracker-api.onrender.com)

## Deployment to Vercel (Frontend)

### Step 1: Prepare Frontend

```bash
cd frontend
npm run build
```

### Step 2: Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub account
3. Import your repository

### Step 3: Configure Project

1. Select "frontend" as root directory
2. Framework: Vite
3. Build Command: `npm run build`
4. Output Directory: `dist`

### Step 4: Add Environment Variables

In Vercel dashboard:
1. Go to project settings
2. Click "Environment Variables"
3. Add:
   ```
   VITE_API_URL=https://your-render-service-url/api
   ```

### Step 5: Deploy

- Click "Deploy"
- Vercel automatically deploys on git push
- Your frontend is live at your Vercel URL

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User Profile
- `GET /api/user/profile` - Get user profile (protected)
- `PUT /api/user/profile` - Update profile and assessment (protected)

### Meals
- `POST /api/meals` - Create meal entry (protected)
- `GET /api/meals/today` - Get today's meals (protected)
- `GET /api/meals/history` - Get last 7-10 days (protected)
- `DELETE /api/meals/:id` - Delete meal (protected)

## Features Implemented

### ✅ Authentication
- User registration with email validation
- Secure login with JWT tokens
- Password hashing with bcrypt
- Protected routes and endpoints
- Token persistence in localStorage

### ✅ Diet Assessment
- BMR calculation (Mifflin-St Jeor equation)
- TDEE calculation with activity levels
- Calorie target based on goals
- Macro distribution by diet type
- Profile update and retrieval

### ✅ Meal Logging
- Add meals with nutritional info
- View today's meals
- Delete meals
- Real-time calorie tracking
- Remaining calories calculation

### ✅ Progress Tracking
- Visual progress circle
- Daily calorie consumption vs target
- Compliance status (on-track/over/under)
- 7-10 day history
- Trend analysis

### ✅ Responsive UI
- Mobile-first design
- Tailwind CSS styling
- Touch-friendly interface
- Accessible components
- Dark mode ready

### ✅ Testing
- 22 property-based tests
- 100+ iterations per test
- Full coverage of critical paths
- Integration tests
- Error handling tests

## Troubleshooting

### Backend Issues

**Port already in use**
```bash
# Change PORT in .env or kill process
lsof -i :5000
kill -9 <PID>
```

**MongoDB connection error**
- Verify MONGODB_URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

**CORS errors**
- Verify frontend URL is in CORS whitelist
- Check backend CORS configuration
- Ensure credentials are enabled

### Frontend Issues

**API calls failing**
- Verify VITE_API_URL is correct
- Check backend is running
- Verify JWT token is valid
- Check browser console for errors

**Build errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Vite proxy not working**
- Ensure backend is running on port 5000
- Check vite.config.js proxy configuration
- Restart dev server

## Performance Optimization

### Backend
- Database indexes on userId and date
- Aggregation pipeline for history queries
- Lean queries for read-only operations
- Connection pooling

### Frontend
- Code splitting with React.lazy
- Memoization of expensive calculations
- Debounced form inputs
- Optimized re-renders

## Security Best Practices

1. **Environment Variables**
   - Never commit .env files
   - Use strong JWT_SECRET (32+ characters)
   - Rotate secrets periodically

2. **Password Security**
   - Bcrypt with 10 salt rounds
   - Minimum 8 characters required
   - Never return password in responses

3. **CORS Configuration**
   - Whitelist specific origins
   - Enable credentials only for trusted domains
   - Disable in production if not needed

4. **Input Validation**
   - Validate all user inputs
   - Sanitize data before database operations
   - Use Mongoose schema validation

5. **Database Security**
   - Use MongoDB Atlas with authentication
   - Whitelist IPs when possible
   - Use connection strings with credentials

## Monitoring and Maintenance

### Logs
- Backend: Check Render logs in dashboard
- Frontend: Check Vercel logs in dashboard
- Local: Check terminal output

### Database
- Monitor MongoDB Atlas metrics
- Check storage usage
- Review slow queries

### Performance
- Monitor API response times
- Track error rates
- Analyze user behavior

## Next Steps

1. **Add Features**
   - Meal suggestions/database
   - Social sharing
   - Mobile app
   - Advanced analytics

2. **Improve UX**
   - Dark mode toggle
   - Notifications
   - Offline support
   - PWA capabilities

3. **Scale**
   - Add caching layer (Redis)
   - Implement rate limiting
   - Add CDN for static assets
   - Database optimization

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review error messages in logs
3. Check MongoDB Atlas status
4. Verify environment variables
5. Test API endpoints with Postman

## License

MIT License - Feel free to use this project for educational and commercial purposes.

---

**DietTracker** - Built with ❤️ using MERN Stack
