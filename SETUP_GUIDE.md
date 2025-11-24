# DietTracker - Complete Setup & Running Guide

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (free tier available)
- Git

## Step 1: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (M0 free tier)
4. Create a database user with username and password
5. Whitelist your IP (0.0.0.0/0 for development)
6. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/diettracker?retryWrites=true&w=majority`

## Step 2: Backend Setup

### 2.1 Install Dependencies

```bash
cd backend
npm install
```

### 2.2 Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/diettracker?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
NODE_ENV=development
```

Replace:
- `username` and `password` with your MongoDB credentials
- `cluster` with your MongoDB cluster name
- `JWT_SECRET` with a strong random string (minimum 32 characters)

### 2.3 Start Backend Server

```bash
npm start
```

You should see:
```
Server running on port 5000
```

Test the backend:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"success": true, "message": "Server is running"}
```

## Step 3: Frontend Setup

### 3.1 Install Dependencies

```bash
cd frontend
npm install
```

### 3.2 Configure Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

For production (Vercel):
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### 3.3 Start Frontend Development Server

```bash
npm run dev
```

You should see:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

## Step 4: Access the Application

1. Open your browser and go to `http://localhost:5173`
2. You should see the DietTracker login page
3. Click "Sign up" to create a new account
4. Fill in your details and register
5. Complete your diet assessment on the profile page
6. Start logging meals on the dashboard

## Troubleshooting

### Issue: "Cannot connect to MongoDB"

**Solution:**
- Verify MongoDB URI in `.env` is correct
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure MongoDB Atlas cluster is running

### Issue: "CORS error" or "Failed to fetch"

**Solution:**
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Verify CORS configuration in `backend/server.js`

### Issue: "Login page not loading properly"

**Solution:**
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for errors (F12)
- Ensure all CSS classes are loaded (check index.css)

### Issue: "Meals not saving"

**Solution:**
- Check backend console for errors
- Verify JWT token is being sent (check Network tab in DevTools)
- Ensure user has completed profile assessment

### Issue: "Port 5000 already in use"

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

## Running Tests

### Backend Tests

```bash
cd backend
npm test
```

This will run all property-based tests and integration tests.

### Frontend Tests

```bash
cd frontend
npm test
```

## Project Structure

```
DietTracker/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── models/                   # Mongoose schemas
│   ├── routes/                   # API endpoints
│   ├── middleware/               # Auth middleware
│   ├── utils/                    # Calculation utilities
│   ├── __tests__/                # Test files
│   ├── server.js                 # Express server
│   ├── package.json
│   └── .env                      # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── api/                  # Axios configuration
│   │   ├── context/              # React context
│   │   ├── pages/                # Page components
│   │   ├── components/           # Reusable components
│   │   ├── App.jsx               # Main app component
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Tailwind styles
│   ├── public/                   # Static assets
│   ├── vite.config.js            # Vite configuration
│   ├── tailwind.config.js        # Tailwind configuration
│   ├── package.json
│   └── .env                      # Environment variables
│
└── README.md                     # Project documentation
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User Profile
- `GET /api/user/profile` - Get user profile (protected)
- `PUT /api/user/profile` - Update profile (protected)

### Meals
- `POST /api/meals` - Create meal (protected)
- `GET /api/meals/today` - Get today's meals (protected)
- `GET /api/meals/history` - Get meal history (protected)
- `DELETE /api/meals/:id` - Delete meal (protected)

## Features

✅ User Authentication (Register/Login)
✅ Diet Assessment with BMR/TDEE calculations
✅ Daily Meal Logging
✅ Real-time Progress Tracking
✅ Historical Data & Compliance Tracking
✅ Responsive Mobile-First Design
✅ Property-Based Testing
✅ Production-Ready Deployment

## Deployment

### Deploy Backend to Render

1. Push code to GitHub
2. Go to [Render](https://render.com)
3. Create new Web Service
4. Connect GitHub repository
5. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
6. Deploy

### Deploy Frontend to Vercel

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import project
4. Set environment variables:
   - `VITE_API_URL=https://your-backend.onrender.com/api`
5. Deploy

## Support

For issues or questions, check:
- Backend logs: `npm start` output
- Frontend console: Browser DevTools (F12)
- Network requests: DevTools Network tab
- MongoDB logs: MongoDB Atlas dashboard

## Next Steps

1. Complete your profile assessment
2. Log some meals
3. Check your progress on the dashboard
4. View your history
5. Deploy to production!

Happy tracking! 🎯
