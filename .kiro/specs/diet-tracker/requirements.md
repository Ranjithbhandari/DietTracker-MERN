# Requirements Document

## Introduction

The DietTracker is an Online Diet & Lifestyle Assessment Tool built as a full-stack MERN (MongoDB, Express.js, React, Node.js) application. The system enables users to register, complete diet assessments, track daily meals, monitor calorie and macro intake, and view historical progress. The application must be production-ready with seamless deployment to Render (backend) and Vercel (frontend), featuring responsive design, secure authentication, and real-time progress tracking.

## Glossary

- **DietTracker System**: The complete MERN stack application including backend API and frontend client
- **User**: A registered individual who uses the system to track diet and lifestyle
- **BMR**: Basal Metabolic Rate - the number of calories required to keep the body functioning at rest
- **TDEE**: Total Daily Energy Expenditure - total calories burned per day including activity
- **Macro**: Macronutrient - protein, carbohydrates, or fat
- **Meal Entry**: A record of food consumed with nutritional information
- **Assessment**: User's diet and lifestyle evaluation including physical metrics and goals
- **JWT**: JSON Web Token used for authentication
- **Protected Route**: API endpoint or page requiring valid authentication
- **Progress Ring**: Visual circular indicator showing calorie consumption vs target
- **Compliance Status**: Indicator showing if daily intake is on track, over, or under target

## Requirements

### Requirement 1: User Registration and Authentication

**User Story:** As a new user, I want to register an account with my email and password, so that I can securely access the diet tracking system.

#### Acceptance Criteria

1. WHEN a user submits registration form with name, email, and password THEN the DietTracker System SHALL create a new user account with hashed password using bcrypt
2. WHEN a user attempts to register with an existing email THEN the DietTracker System SHALL reject the registration and return an error message
3. WHEN a user successfully registers THEN the DietTracker System SHALL generate a JWT token and return it to the client
4. WHEN a user submits login credentials THEN the DietTracker System SHALL validate credentials and return a JWT token if valid
5. WHEN a user provides invalid login credentials THEN the DietTracker System SHALL reject authentication and return an error message

### Requirement 2: User Profile and Diet Assessment

**User Story:** As a registered user, I want to complete a diet assessment with my physical metrics and goals, so that the system can calculate my personalized calorie and macro targets.

#### Acceptance Criteria

1. WHEN a user submits assessment data including age, gender, height, weight, activity level, goal, and diet type THEN the DietTracker System SHALL calculate BMR using the Mifflin-St Jeor equation
2. WHEN BMR is calculated THEN the DietTracker System SHALL calculate TDEE by multiplying BMR with the activity level multiplier
3. WHEN TDEE is calculated THEN the DietTracker System SHALL determine calorie target based on the user's goal (lose weight, maintain, or gain weight)
4. WHEN calorie target is determined THEN the DietTracker System SHALL calculate macro distribution (protein, carbs, fat in grams) based on diet type
5. WHEN assessment calculations are complete THEN the DietTracker System SHALL save all metrics to the user profile and return the results
6. WHEN a user requests their profile THEN the DietTracker System SHALL return current assessment data including all calculated metrics

### Requirement 3: Protected Routes and Authorization

**User Story:** As a registered user, I want my data to be protected, so that only I can access and modify my diet information.

#### Acceptance Criteria

1. WHEN a request is made to a protected endpoint without a valid JWT THEN the DietTracker System SHALL reject the request with 401 unauthorized status
2. WHEN a request is made to a protected endpoint with a valid JWT THEN the DietTracker System SHALL extract user ID from the token and allow access
3. WHEN a user requests profile or meal data THEN the DietTracker System SHALL return only data belonging to the authenticated user
4. WHEN a user attempts to modify another user's data THEN the DietTracker System SHALL reject the request

### Requirement 4: Daily Meal Logging

**User Story:** As a user, I want to log meals throughout the day with nutritional information, so that I can track my calorie and macro intake.

#### Acceptance Criteria

1. WHEN a user submits a meal entry with meal type, food name, calories, protein, carbs, and fat THEN the DietTracker System SHALL create a meal record with current date and user ID
2. WHEN a user requests today's meals THEN the DietTracker System SHALL return all meal entries for the current date belonging to the authenticated user
3. WHEN a user deletes a meal entry THEN the DietTracker System SHALL remove the meal record from the database
4. WHEN a user requests meal history THEN the DietTracker System SHALL return aggregated daily totals for the last 7-10 days
5. WHEN calculating daily totals THEN the DietTracker System SHALL sum calories, protein, carbs, and fat for all meals on each date

### Requirement 5: Real-time Progress Tracking

**User Story:** As a user, I want to see my daily progress toward calorie and macro goals, so that I can make informed decisions about my remaining meals.

#### Acceptance Criteria

1. WHEN displaying today's meals THEN the DietTracker System SHALL calculate total consumed calories, protein, carbs, and fat
2. WHEN consumed totals are calculated THEN the DietTracker System SHALL compute remaining calories as target minus consumed
3. WHEN displaying progress THEN the DietTracker System SHALL show percentage of calorie target consumed
4. WHEN consumed calories exceed target THEN the DietTracker System SHALL indicate over-target status
5. WHEN consumed calories are below target THEN the DietTracker System SHALL show remaining calories available

### Requirement 6: Historical Progress and Compliance

**User Story:** As a user, I want to view my diet history over the past week, so that I can track my consistency and identify patterns.

#### Acceptance Criteria

1. WHEN a user requests history THEN the DietTracker System SHALL return daily summaries for the last 7-10 days
2. WHEN calculating compliance status for a day THEN the DietTracker System SHALL compare total calories to target and categorize as on-track, over, or under
3. WHERE total calories are within 10% of target THEN the DietTracker System SHALL mark the day as on-track
4. WHERE total calories exceed target by more than 10% THEN the DietTracker System SHALL mark the day as over
5. WHERE total calories are below target by more than 10% THEN the DietTracker System SHALL mark the day as under

### Requirement 7: Responsive User Interface

**User Story:** As a user, I want to access the application on any device with a beautiful and intuitive interface, so that I can track my diet on-the-go.

#### Acceptance Criteria

1. WHEN the application is accessed on mobile devices THEN the DietTracker System SHALL display a mobile-optimized layout using Tailwind CSS
2. WHEN the application is accessed on desktop devices THEN the DietTracker System SHALL display an expanded layout utilizing available screen space
3. WHEN displaying the navigation THEN the DietTracker System SHALL show accessible links to Dashboard, Profile, Add Meal, and History pages
4. WHEN displaying meal data THEN the DietTracker System SHALL use cards and lists with clear typography and spacing
5. WHEN displaying progress THEN the DietTracker System SHALL render a circular progress indicator showing visual percentage

### Requirement 8: Cross-Origin Resource Sharing Configuration

**User Story:** As a system administrator, I want the backend to accept requests from authorized frontend domains, so that the application works in both development and production environments.

#### Acceptance Criteria

1. WHEN the backend receives a request from localhost THEN the DietTracker System SHALL accept the request with appropriate CORS headers
2. WHEN the backend receives a request from a Vercel domain (*.vercel.app) THEN the DietTracker System SHALL accept the request with appropriate CORS headers
3. WHEN the backend receives a request from an unauthorized origin THEN the DietTracker System SHALL reject the request
4. WHEN CORS is configured THEN the DietTracker System SHALL allow credentials (cookies) to be sent with requests

### Requirement 9: Environment-Aware API Configuration

**User Story:** As a developer, I want the frontend to automatically detect the environment and use the correct API URL, so that the application works seamlessly in development and production.

#### Acceptance Criteria

1. WHEN the frontend runs in development mode THEN the DietTracker System SHALL use localhost:5000 as the API base URL
2. WHEN the frontend runs in production mode THEN the DietTracker System SHALL use the VITE_API_URL environment variable as the API base URL
3. WHEN the frontend makes API requests in development THEN the DietTracker System SHALL proxy requests through Vite dev server to avoid CORS issues
4. WHEN environment variables are missing THEN the DietTracker System SHALL fall back to localhost:5000

### Requirement 10: Database Models and Data Persistence

**User Story:** As a system architect, I want well-defined data models with proper relationships, so that data is stored consistently and efficiently.

#### Acceptance Criteria

1. WHEN a User document is created THEN the DietTracker System SHALL store name, email, hashed password, age, gender, height, weight, activityLevel, goal, dietType, calorieTarget, and macros
2. WHEN a Meal document is created THEN the DietTracker System SHALL store userId reference, date, mealType, foodName, calories, protein, carbs, and fat
3. WHEN querying meals THEN the DietTracker System SHALL use userId index for efficient retrieval
4. WHEN storing dates THEN the DietTracker System SHALL use Date type for proper date comparison and aggregation
5. WHEN a user is deleted THEN the DietTracker System SHALL maintain referential integrity for meal records

### Requirement 11: Deployment Readiness

**User Story:** As a developer, I want the application to be deployment-ready with clear instructions, so that it can be deployed to Render and Vercel without modifications.

#### Acceptance Criteria

1. WHEN the backend is deployed to Render THEN the DietTracker System SHALL read PORT from environment variables and bind to it
2. WHEN the backend is deployed THEN the DietTracker System SHALL read MONGODB_URI and JWT_SECRET from environment variables
3. WHEN the frontend is built THEN the DietTracker System SHALL output static files to the dist folder compatible with Vercel
4. WHEN environment examples are provided THEN the DietTracker System SHALL include .env.example files in both backend and frontend directories
5. WHEN documentation is provided THEN the DietTracker System SHALL include README with setup, deployment, and configuration instructions

### Requirement 12: Error Handling and Validation

**User Story:** As a user, I want clear error messages when something goes wrong, so that I can understand and correct issues.

#### Acceptance Criteria

1. WHEN invalid data is submitted to any endpoint THEN the DietTracker System SHALL return a 400 status with descriptive error message
2. WHEN a database operation fails THEN the DietTracker System SHALL return a 500 status with a generic error message without exposing internal details
3. WHEN authentication fails THEN the DietTracker System SHALL return a 401 status with appropriate message
4. WHEN a resource is not found THEN the DietTracker System SHALL return a 404 status
5. WHEN the frontend receives an error response THEN the DietTracker System SHALL display user-friendly error messages in the UI
