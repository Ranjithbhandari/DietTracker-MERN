# DietTracker - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Prerequisites
- Node.js 16+
- MongoDB Atlas account (free)
- Git

### Step 1: Clone & Setup Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/diettracker
JWT_SECRET=your-secret-key-at-least-32-characters-long
PORT=5000
NODE_ENV=development
```

Start backend:
```bash
npm start
```
✅ Backend running on http://localhost:5000

### Step 2: Setup Frontend (New Terminal)

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
```
✅ Frontend running on http://localhost:5173

### Step 3: Test the App

1. Open http://localhost:5173
2. Click "Register"
3. Create account with:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
4. Complete diet assessment
5. Add meals and track progress

## 📝 Common Commands

### Backend
```bash
cd backend

# Start development server
npm start

# Run tests
npm test

# Run specific test
npm test -- auth.property.test.js

# Build for production
npm run build
```

### Frontend
```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test
```

## 🔧 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/diettracker
JWT_SECRET=your-super-secret-key-minimum-32-characters
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Running Tests

```bash
cd backend
npm test
```

All 22 property-based tests will run with 100+ iterations each.

## 📱 Features to Try

1. **Register & Login**
   - Create new account
   - Login with credentials
   - Logout

2. **Diet Assessment**
   - Fill in personal info
   - View calculated BMR/TDEE
   - See macro targets

3. **Meal Logging**
   - Add breakfast, lunch, dinner, snacks
   - View daily totals
   - See remaining calories

4. **Progress Tracking**
   - View today's progress circle
   - Check compliance status
   - View 7-day history

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill process if needed
kill -9 <PID>

# Or change PORT in .env
```

### MongoDB connection error
- Verify MONGODB_URI is correct
- Check IP whitelist in MongoDB Atlas (should be 0.0.0.0/0)
- Verify database user credentials

### Frontend API calls failing
- Ensure backend is running
- Check VITE_API_URL in .env
- Check browser console for errors
- Verify JWT token is valid

### Port already in use
```bash
# Frontend (default 5173)
npm run dev -- --port 3000

# Backend (change in .env)
PORT=5001 npm start
```

## 📊 API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### User
- `GET /api/user/profile` - Get profile
- `PUT /api/user/profile` - Update profile

### Meals
- `POST /api/meals` - Add meal
- `GET /api/meals/today` - Today's meals
- `GET /api/meals/history` - Last 7-10 days
- `DELETE /api/meals/:id` - Delete meal

## 🚀 Deploy to Production

### Backend to Render
1. Push code to GitHub
2. Go to render.com
3. Create new Web Service
4. Connect GitHub repo
5. Set environment variables
6. Deploy

### Frontend to Vercel
1. Push code to GitHub
2. Go to vercel.com
3. Import project
4. Set VITE_API_URL to your Render URL
5. Deploy

## 📚 Documentation

- **requirements.md** - What the app does
- **design.md** - How it's built
- **tasks.md** - Implementation checklist
- **DEPLOYMENT_GUIDE.md** - Full deployment instructions
- **PROJECT_SUMMARY.md** - Complete overview

## 💡 Tips

1. **Development**: Use `npm run dev` for hot reload
2. **Testing**: Run tests before committing
3. **Debugging**: Check browser console and terminal
4. **Performance**: Build frontend with `npm run build`
5. **Security**: Never commit .env files

## 🎯 Next Steps

1. ✅ Get it running locally
2. ✅ Test all features
3. ✅ Run the test suite
4. ✅ Deploy to Render & Vercel
5. ✅ Share with others

## 📞 Support

- Check DEPLOYMENT_GUIDE.md for detailed help
- Review error messages in console
- Check MongoDB Atlas status
- Verify environment variables
- Test API with Postman

---

**Ready to go!** 🎉

Start with `npm start` in backend and `npm run dev` in frontend.
