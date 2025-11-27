# Design Document

## Overview

The DietTracker is a full-stack MERN application consisting of a RESTful API backend (Node.js + Express + MongoDB) and a React frontend (Vite + TypeScript + Tailwind CSS). The system uses JWT-based authentication, implements BMR/TDEE calculations using the Mifflin-St Jeor equation, and provides real-time progress tracking with visual indicators. The architecture is designed for seamless deployment to Render (backend) and Vercel (frontend) with environment-aware configuration.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Vercel)                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  React + Vite + TypeScript + Tailwind CSS              │ │
│  │  - AuthContext (JWT management)                        │ │
│  │  - Protected Routes                                    │ │
│  │  - Pages: Login, Register, Dashboard, Profile, etc.   │ │
│  │  - Components: ProgressCircle, MealForm, etc.         │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/REST API
                            │ (axios with JWT)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       Backend (Render)                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Express.js + Node.js                                  │ │
│  │  - CORS middleware (Vercel + localhost)                │ │
│  │  - JWT authentication middleware                       │ │
│  │  - Routes: /api/auth, /api/user, /api/meals          │ │
│  │  - Controllers with business logic                     │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Mongoose ODM
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    MongoDB Atlas (Cloud)                     │
│  - Users Collection                                          │
│  - Meals Collection                                          │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Backend:**
- Node.js (Runtime)
- Express.js (Web framework)
- MongoDB (Database)
- Mongoose (ODM)
- bcrypt (Password hashing)
- jsonwebtoken (JWT authentication)
- cors (Cross-origin resource sharing)
- dotenv (Environment variables)

**Frontend:**
- React 18 (UI library)
- Vite (Build tool)
- TypeScript (Type safety)
- Tailwind CSS (Styling)
- axios (HTTP client)
- React Router (Routing)
- Recharts (Charts and data visualization)
- react-hot-toast (Toast notifications)
- date-fns (Date formatting and manipulation)

## Components and Interfaces

### Backend Components

#### 1. Database Configuration (`config/db.js`)
- Establishes MongoDB connection using Mongoose
- Reads MONGODB_URI from environment variables
- Handles connection errors and success logging

#### 2. Models

**User Model (`models/User.js`)**
```javascript
{
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  age: Number,
  gender: String (enum: ['male', 'female']),
  height: Number (cm),
  weight: Number (kg),
  activityLevel: String (enum: ['sedentary', 'light', 'moderate', 'active', 'very_active']),
  goal: String (enum: ['lose', 'maintain', 'gain']),
  dietType: String (enum: ['balanced', 'low_carb', 'high_protein', 'keto']),
  calorieTarget: Number,
  macros: {
    protein: Number (grams),
    carbs: Number (grams),
    fat: Number (grams)
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Meal Model (`models/Meal.js`)**
```javascript
{
  userId: ObjectId (ref: 'User', required, indexed),
  date: Date (required, indexed),
  mealType: String (enum: ['breakfast', 'lunch', 'dinner', 'snack'], required),
  foodName: String (required),
  calories: Number (required),
  protein: Number (required, grams),
  carbs: Number (required, grams),
  fat: Number (required, grams),
  createdAt: Date,
  updatedAt: Date
}
```

**Weight Model (`models/Weight.js`)**
```javascript
{
  userId: ObjectId (ref: 'User', required, indexed),
  date: Date (required, indexed),
  weight: Number (required, kg, min: 20, max: 300),
  notes: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. Middleware

**Authentication Middleware (`middleware/auth.js`)**
- Extracts JWT from Authorization header (Bearer token)
- Verifies token using JWT_SECRET
- Attaches decoded user ID to request object
- Returns 401 if token is missing or invalid

#### 4. Routes

**Auth Routes (`routes/auth.js`)**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

**User Routes (`routes/user.js`)**
- `GET /api/user/profile` - Get user profile (protected)
- `PUT /api/user/profile` - Update user profile and assessment (protected)

**Meal Routes (`routes/meals.js`)**
- `POST /api/meals` - Create meal entry (protected)
- `GET /api/meals/today` - Get today's meals (protected)
- `GET /api/meals/history` - Get last 30 days summary (protected)
- `DELETE /api/meals/:id` - Delete meal entry (protected)

**Weight Routes (`routes/weight.js`)**
- `POST /api/weight` - Log weight entry (protected)
- `GET /api/weight/latest` - Get current weight (protected)
- `GET /api/weight/history` - Get weight history for charts (protected)
- `GET /api/weight/trend` - Get weight trend analysis (protected)
- `DELETE /api/weight/:id` - Delete weight entry (protected)

#### 5. Server Configuration (`server.js`)
- Initializes Express app
- Configures CORS with allowed origins (localhost, *.vercel.app)
- Mounts routes under /api prefix
- Connects to MongoDB
- Listens on PORT from environment or 5000

### Frontend Components

#### 1. API Configuration (`src/api/axios.js`)
```javascript
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Axios instance with baseURL and default headers
// Interceptor to attach JWT token to requests
```

#### 2. Context

**AuthContext (`src/context/AuthContext.jsx`)**
- Manages authentication state (user, token, loading)
- Provides login, register, logout functions
- Stores JWT in localStorage
- Provides user profile data
- Wraps app with AuthProvider

#### 3. Pages

**Login Page (`src/pages/Login.jsx`)**
- Email and password form
- Calls login API
- Redirects to dashboard on success
- Shows error messages

**Register Page (`src/pages/Register.jsx`)**
- Name, email, password form
- Calls register API
- Redirects to profile/assessment on success

**Dashboard Page (`src/pages/Dashboard.jsx`)**
- Fetches all data in parallel (meals/today, water/today, activities/today, weight/latest)
- Shows beautiful loading skeleton with spinner during data fetch
- Displays 5 metric cards: Net Calories, Calories Burned, Protein Intake, Water Progress, Current Weight
- Shows "Start logging your first meal!" card when no data exists
- Listens to global "dataUpdated" events and refetches automatically
- Handles errors with toast notifications

**Weight Tracker Page (`src/pages/WeightTracker.jsx`)**
- Weight input field with validation (20-300kg range)
- Date picker defaulting to today
- Optional notes field
- Beautiful line chart using Recharts showing 90-day weight progress
- Trend analysis with color-coded arrows (📈📉➡️)
- Delete functionality for weight entries
- Real-time updates when weight is logged

**Profile Page (`src/pages/Profile.jsx`)**
- Diet assessment form
- Inputs: age, gender, height, weight, activity level, goal, diet type
- Displays calculated BMR, TDEE, calorie target, macros
- Updates user profile

**Add Meal Page (`src/pages/AddMeal.jsx`)**
- Meal entry form
- Inputs: meal type, food name, calories, protein, carbs, fat
- Submits to API
- Redirects to dashboard

**History Page (`src/pages/History.jsx`)**
- Displays comprehensive 30-day history with daily rows
- Each day shows: Date, Weight (if logged), Calories Consumed, Calories Burned, Net Calories, Water (ml), Fasting Duration
- Progress bars: Green (calorie deficit), Red (calorie surplus)
- Beautiful glassmorphism table/card design
- Export to CSV functionality
- Real-time updates when data changes
- Mobile responsive design

#### 4. Components

**ProgressCircle (`src/components/ProgressCircle.jsx`)**
- SVG-based circular progress indicator
- Props: current, target, size
- Displays percentage and remaining calories
- Color changes based on status

**MealCard (`src/components/MealCard.jsx`)**
- Displays single meal entry
- Shows meal type, food name, nutritional info
- Delete button

**Navbar (`src/components/Navbar.jsx`)**
- Navigation links
- Logout button
- Responsive mobile menu

**ProtectedRoute (`src/components/ProtectedRoute.jsx`)**
- Wraps protected pages
- Redirects to login if not authenticated

#### 5. Global Event System (`src/utils/events.js`)
- Custom event dispatcher for real-time updates
- Events: "dataUpdated", "weightUpdated", "userUpdated"
- Event listeners in Dashboard and History components
- Automatic data refetching on events

#### 6. Routing (`src/App.jsx`)
- React Router setup
- Public routes: /, /login, /register
- Protected routes: /dashboard, /profile, /add-meal, /history, /weight-tracker

## Data Models

### User Schema Details

**BMR Calculation (Mifflin-St Jeor Equation):**
```
For males: BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5
For females: BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161
```

**TDEE Calculation:**
```
Activity Level Multipliers:
- sedentary: BMR × 1.2
- light: BMR × 1.375
- moderate: BMR × 1.55
- active: BMR × 1.725
- very_active: BMR × 1.9
```

**Calorie Target Calculation:**
```
Goal Adjustments:
- lose: TDEE - 500 (1 lb/week loss)
- maintain: TDEE
- gain: TDEE + 500 (1 lb/week gain)
```

**Macro Distribution by Diet Type:**
```
balanced: 30% protein, 40% carbs, 30% fat
low_carb: 35% protein, 25% carbs, 40% fat
high_protein: 40% protein, 30% carbs, 30% fat
keto: 25% protein, 5% carbs, 70% fat

Convert percentages to grams:
protein_grams = (calories × protein_%) / 4
carbs_grams = (calories × carbs_%) / 4
fat_grams = (calories × fat_%) / 9
```

### Meal Schema Details

**Date Handling:**
- Store dates as Date objects
- Query by date range for history
- Use start/end of day for "today" queries

**Aggregation for History:**
- Group meals by date
- Sum calories, protein, carbs, fat per day
- Calculate compliance status based on user's calorie target

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

After analyzing all acceptance criteria, several properties can be consolidated:
- Properties 2.5 and 2.6 both test profile data persistence (round-trip)
- Properties 4.4 and 6.1 both test history retrieval
- Properties 5.1 and 4.5 both test daily totals calculation
- Properties 5.2 and 5.5 both test remaining calories calculation
- Properties 6.2, 6.3, 6.4, 6.5 all test compliance status calculation
- Properties 1.5, 3.4, 8.3, 9.4, 12.2, 12.3, 12.4 are edge cases handled by generators

### Authentication and Security Properties

**Property 1: Password hashing integrity**
*For any* user registration with a plain text password, the stored password SHALL be hashed using bcrypt and SHALL NOT equal the plain text password, and bcrypt SHALL be able to verify the original password against the hash.
**Validates: Requirements 1.1**

**Property 2: JWT token validity**
*For any* successful registration or login, the returned JWT token SHALL be decodable using the JWT_SECRET and SHALL contain the correct user ID.
**Validates: Requirements 1.3, 1.4**

**Property 3: Protected route authorization**
*For any* protected API endpoint, requests without a valid JWT SHALL be rejected with 401 status, and requests with a valid JWT SHALL be allowed access.
**Validates: Requirements 3.1, 3.2**

**Property 4: Data isolation**
*For any* authenticated user requesting profile or meal data, the system SHALL return only data where the userId matches the authenticated user's ID.
**Validates: Requirements 3.3**

### Diet Assessment Calculation Properties

**Property 5: BMR calculation correctness**
*For any* valid assessment data (age, gender, height, weight), the calculated BMR SHALL equal the result of the Mifflin-St Jeor equation: for males (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5, for females (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161.
**Validates: Requirements 2.1**

**Property 6: TDEE calculation correctness**
*For any* calculated BMR and activity level, the TDEE SHALL equal BMR multiplied by the correct activity level multiplier (sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9).
**Validates: Requirements 2.2**

**Property 7: Calorie target calculation correctness**
*For any* calculated TDEE and goal, the calorie target SHALL equal TDEE - 500 for lose goal, TDEE for maintain goal, or TDEE + 500 for gain goal.
**Validates: Requirements 2.3**

**Property 8: Macro distribution calculation correctness**
*For any* calorie target and diet type, the calculated macros SHALL match the specified percentages converted to grams: protein_grams = (calories × protein_%) / 4, carbs_grams = (calories × carbs_%) / 4, fat_grams = (calories × fat_%) / 9, where percentages are balanced (30/40/30), low_carb (35/25/40), high_protein (40/30/30), or keto (25/5/70).
**Validates: Requirements 2.4**

**Property 9: Assessment data persistence**
*For any* user who submits assessment data, saving the assessment and then retrieving the profile SHALL return all the same calculated metrics (BMR, TDEE, calorieTarget, macros).
**Validates: Requirements 2.5, 2.6**

### Meal Logging and Tracking Properties

**Property 10: Meal creation and retrieval**
*For any* valid meal entry submitted by a user, the meal SHALL be stored with the current date and user ID, and SHALL be retrievable when querying today's meals.
**Validates: Requirements 4.1, 4.2**

**Property 11: Meal deletion**
*For any* meal entry, after deletion, querying for that meal by ID SHALL return not found, and the meal SHALL NOT appear in today's meals or history.
**Validates: Requirements 4.3**

**Property 12: Daily totals calculation**
*For any* set of meals on a specific date, the sum of calories, protein, carbs, and fat across all meals SHALL equal the daily totals returned by the system.
**Validates: Requirements 4.5, 5.1**

**Property 13: Remaining calories calculation**
*For any* user with a calorie target and consumed calories, the remaining calories SHALL equal target minus consumed, and the percentage SHALL equal (consumed / target) × 100.
**Validates: Requirements 5.2, 5.3, 5.5**

**Property 14: Over-target status indication**
*For any* day where consumed calories exceed the target, the system SHALL indicate over-target status.
**Validates: Requirements 5.4**

### Historical Data Properties

**Property 15: History retrieval and aggregation**
*For any* user requesting history, the system SHALL return daily summaries for the last 7-10 days, where each day's totals equal the sum of all meals on that date.
**Validates: Requirements 4.4, 6.1**

**Property 16: Compliance status calculation**
*For any* day's total calories and user's calorie target, the compliance status SHALL be on-track if total is within 10% of target (0.9 × target ≤ total ≤ 1.1 × target), over if total > 1.1 × target, and under if total < 0.9 × target.
**Validates: Requirements 6.2, 6.3, 6.4, 6.5**

### Data Model Properties

**Property 17: User schema completeness**
*For any* User document created, the document SHALL contain all required fields: name, email, password (hashed), and optional fields age, gender, height, weight, activityLevel, goal, dietType, calorieTarget, and macros.
**Validates: Requirements 10.1**

**Property 18: Meal schema completeness**
*For any* Meal document created, the document SHALL contain all required fields: userId, date, mealType, foodName, calories, protein, carbs, and fat.
**Validates: Requirements 10.2**

**Property 19: Date type consistency**
*For any* meal stored, the date field SHALL be a Date object, enabling proper date comparison and range queries.
**Validates: Requirements 10.4**

### UI Component Properties

**Property 20: Progress indicator accuracy**
*For any* progress circle component rendered with current and target values, the displayed percentage SHALL equal (current / target) × 100, and the visual arc SHALL represent this percentage.
**Validates: Requirements 7.5**

**Property 21: Error message display**
*For any* API error response received by the frontend, a user-friendly error message SHALL be displayed in the UI.
**Validates: Requirements 12.5**

### Validation Properties

**Property 22: Input validation**
*For any* API endpoint receiving invalid data (missing required fields, wrong types, out of range values), the system SHALL return 400 status with a descriptive error message.
**Validates: Requirements 12.1**

### Dashboard and Real-time Update Properties

**Property 23: Parallel data fetching**
*For any* dashboard load, all required data (meals/today, water/today, activities/today, weight/latest) SHALL be fetched in parallel and complete within 1 second under normal conditions.
**Validates: Requirements 13.1**

**Property 24: Real-time data updates**
*For any* data modification (add/update/delete), a global "dataUpdated" event SHALL be dispatched, and all listening components SHALL refetch their data automatically.
**Validates: Requirements 13.4**

**Property 25: Dashboard loading states**
*For any* dashboard load, a loading skeleton with spinner SHALL be displayed until all data is fetched, and error states SHALL show toast notifications.
**Validates: Requirements 13.2, 13.5**

### Weight Tracking Properties

**Property 26: Weight entry validation**
*For any* weight entry, the weight value SHALL be between 20-300kg, and invalid entries SHALL be rejected with appropriate error messages.
**Validates: Requirements 14.1, 14.2**

**Property 27: Weight trend calculation**
*For any* weight history with 7 or more entries, the trend SHALL be calculated as: up if latest average > previous average, down if latest < previous, stable if difference ≤ 0.5kg.
**Validates: Requirements 14.4**

**Property 28: Weight chart data integrity**
*For any* weight chart display, all data points SHALL correspond to actual weight entries, and the chart SHALL show accurate dates and values over the last 90 days.
**Validates: Requirements 14.3**

### History and Export Properties

**Property 29: 30-day history completeness**
*For any* history page load, exactly 30 days SHALL be displayed (including days with no data), and each day SHALL show all available metrics (weight, calories, water, fasting).
**Validates: Requirements 15.1, 15.2**

**Property 30: CSV export accuracy**
*For any* CSV export, the exported data SHALL contain exactly the same information displayed on the history page, with proper headers and formatting.
**Validates: Requirements 15.5**

**Property 31: Progress bar calculation**
*For any* day in history, the progress bar color SHALL be green if net calories < 0 (deficit), red if net calories > 0 (surplus), and the bar length SHALL represent the magnitude.
**Validates: Requirements 15.3**

### Enhanced Dashboard Properties

**Property 32: Net calories calculation**
*For any* dashboard display, net calories SHALL equal total calories consumed minus total calories burned from activities.
**Validates: Requirements 16.1**

**Property 33: Protein target calculation**
*For any* user with recorded weight, the protein target SHALL be 2g per kg of body weight, and progress SHALL be calculated as (consumed protein / target) × 100.
**Validates: Requirements 16.2**

**Property 34: Current weight display**
*For any* dashboard with weight data, the current weight SHALL be the most recent weight entry, and the trend arrow SHALL match the calculated trend direction.
**Validates: Requirements 16.5**

## Error Handling

### Backend Error Handling

**Validation Errors (400)**
- Missing required fields
- Invalid data types
- Out of range values (e.g., negative calories)
- Invalid enum values (e.g., invalid meal type)

**Authentication Errors (401)**
- Missing JWT token
- Invalid JWT token
- Expired JWT token

**Authorization Errors (403)**
- Attempting to access another user's data

**Not Found Errors (404)**
- Resource doesn't exist (e.g., meal ID not found)
- Route doesn't exist

**Conflict Errors (409)**
- Duplicate email on registration

**Server Errors (500)**
- Database connection failures
- Unexpected errors
- Generic error message without exposing internals

### Frontend Error Handling

**Network Errors**
- Display "Unable to connect to server" message
- Retry mechanism for failed requests

**Validation Errors**
- Display field-specific error messages
- Highlight invalid fields in forms

**Authentication Errors**
- Redirect to login page
- Clear stored token
- Display "Session expired" message

**User Feedback**
- Toast notifications for success/error
- Loading states during API calls
- Disable submit buttons during processing

## Testing Strategy

### Unit Testing

**Backend Unit Tests**
- Model validation tests
- Calculation function tests (BMR, TDEE, macros)
- Middleware tests (auth, error handling)
- Route handler tests with mocked database

**Frontend Unit Tests**
- Component rendering tests
- Form validation tests
- Utility function tests
- Context provider tests

### Property-Based Testing

The application will use **fast-check** (JavaScript/TypeScript property-based testing library) for comprehensive property testing.

**Configuration:**
- Each property-based test SHALL run a minimum of 100 iterations
- Each test SHALL be tagged with a comment referencing the design document property
- Tag format: `// Feature: diet-tracker, Property X: [property description]`

**Property Test Coverage:**

1. **Authentication Properties (Properties 1-4)**
   - Generate random user credentials
   - Test password hashing, JWT generation, authorization

2. **Calculation Properties (Properties 5-9)**
   - Generate random valid assessment data
   - Verify BMR, TDEE, calorie target, macro calculations

3. **Meal Tracking Properties (Properties 10-14)**
   - Generate random meal data
   - Test creation, retrieval, deletion, aggregation

4. **History Properties (Properties 15-16)**
   - Generate random meal histories
   - Test aggregation and compliance calculations

5. **Data Model Properties (Properties 17-19)**
   - Generate random documents
   - Verify schema compliance and data types

6. **UI Properties (Properties 20-21)**
   - Generate random progress values
   - Test component rendering and error display

7. **Validation Properties (Property 22)**
   - Generate invalid inputs
   - Verify proper error responses

**Test Organization:**
- Backend tests: `backend/__tests__/`
- Frontend tests: `frontend/src/__tests__/`
- Property tests alongside unit tests
- Separate files for property tests: `*.property.test.js`

### Integration Testing

**API Integration Tests**
- Full request/response cycle tests
- Database integration tests
- Authentication flow tests
- End-to-end meal logging flow

**Frontend Integration Tests**
- Multi-component interaction tests
- Routing tests
- Context integration tests
- API integration with mock server

### Testing Tools

**Backend:**
- Jest (test runner)
- Supertest (API testing)
- fast-check (property-based testing)
- mongodb-memory-server (in-memory database for tests)

**Frontend:**
- Vitest (test runner, Vite-native)
- React Testing Library (component testing)
- fast-check (property-based testing)
- MSW (Mock Service Worker for API mocking)

## Deployment Configuration

### Backend Deployment (Render)

**Environment Variables:**
```
PORT=5000 (auto-set by Render)
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
NODE_ENV=production
```

**Build Command:** `npm install`
**Start Command:** `npm start` (runs `node server.js`)

**CORS Configuration:**
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  /\.vercel\.app$/
];
```

### Frontend Deployment (Vercel)

**Environment Variables:**
```
VITE_API_URL=https://your-backend.onrender.com/api
```

**Build Command:** `npm run build`
**Output Directory:** `dist`
**Install Command:** `npm install`

**Vite Configuration for Development:**
```javascript
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
}
```

### Database (MongoDB Atlas)

**Configuration:**
- Create cluster (free tier M0)
- Whitelist IP: 0.0.0.0/0 (allow from anywhere)
- Create database user
- Get connection string
- Set as MONGODB_URI in backend environment

## Project Structure

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
│   ├── __tests__/
│   │   ├── auth.test.js
│   │   ├── calculations.property.test.js
│   │   └── meals.property.test.js
│   ├── server.js
│   ├── .env.example
│   ├── .gitignore
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
│   │   ├── __tests__/
│   │   │   ├── components/
│   │   │   └── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── README.md
└── .gitignore
```

## Security Considerations

1. **Password Security**
   - Bcrypt with salt rounds (10)
   - Never store plain text passwords
   - Never return password in API responses

2. **JWT Security**
   - Strong secret key (minimum 32 characters)
   - Reasonable expiration time (24 hours)
   - Validate on every protected request

3. **Input Validation**
   - Validate all user inputs
   - Sanitize data before database operations
   - Use Mongoose schema validation

4. **CORS Security**
   - Whitelist specific origins
   - Don't allow all origins in production
   - Enable credentials only for trusted origins

5. **Environment Variables**
   - Never commit .env files
   - Use strong secrets in production
   - Rotate secrets periodically

6. **Database Security**
   - Use MongoDB Atlas with authentication
   - Whitelist IPs when possible
   - Use connection string with credentials

## Performance Considerations

1. **Database Indexing**
   - Index userId in Meals collection
   - Index date in Meals collection
   - Compound index on (userId, date) for queries

2. **Query Optimization**
   - Use date ranges for history queries
   - Limit results to necessary fields
   - Use aggregation pipeline for summaries

3. **Frontend Optimization**
   - Code splitting with React.lazy
   - Memoize expensive calculations
   - Debounce form inputs
   - Cache API responses when appropriate

4. **API Optimization**
   - Implement pagination for large datasets
   - Use lean() for read-only queries
   - Minimize payload size

## Accessibility Considerations

1. **Semantic HTML**
   - Use proper heading hierarchy
   - Use semantic elements (nav, main, section)
   - Use labels for form inputs

2. **Keyboard Navigation**
   - All interactive elements keyboard accessible
   - Logical tab order
   - Focus indicators visible

3. **Screen Reader Support**
   - ARIA labels where needed
   - Alt text for images
   - Descriptive link text

4. **Color Contrast**
   - WCAG AA compliance
   - Don't rely solely on color for information
   - Test with contrast checkers

5. **Responsive Design**
   - Mobile-first approach
   - Touch-friendly targets (minimum 44x44px)
   - Readable font sizes (minimum 16px)
