# Implementation Plan

- [x] 1. Initialize project structure and dependencies


  - Create backend directory with Node.js project
  - Create frontend directory with Vite + React + TypeScript
  - Install all required dependencies for both projects
  - Set up .gitignore files
  - Create .env.example files with required variables
  - _Requirements: 11.4_



- [x] 2. Set up backend database configuration and models


  - Create database connection module (config/db.js)
  - Implement User model with Mongoose schema including all fields and validation
  - Implement Meal model with Mongoose schema including userId reference and indexes
  - Add password hashing pre-save hook to User model

  - _Requirements: 10.1, 10.2, 10.3, 10.4, 1.1_

- [x] 2.1 Write property test for User model

  - **Property 17: User schema completeness**
  - **Validates: Requirements 10.1**


- [x] 2.2 Write property test for Meal model

  - **Property 18: Meal schema completeness**


  - **Validates: Requirements 10.2**


- [x] 2.3 Write property test for password hashing

  - **Property 1: Password hashing integrity**
  - **Validates: Requirements 1.1**




- [ ] 3. Implement authentication middleware and utilities
  - Create JWT authentication middleware (middleware/auth.js)

  - Implement token verification and user extraction
  - Add error handling for invalid/missing tokens



  - _Requirements: 3.1, 3.2_


- [ ] 3.1 Write property test for JWT token validity
  - **Property 2: JWT token validity**
  - **Validates: Requirements 1.3, 1.4**

- [x] 3.2 Write property test for protected route authorization

  - **Property 3: Protected route authorization**

  - **Validates: Requirements 3.1, 3.2**




- [ ] 4. Create authentication routes and controllers
  - Implement POST /api/auth/register endpoint
  - Implement POST /api/auth/login endpoint
  - Add input validation for registration and login
  - Implement JWT token generation on successful auth


  - Handle duplicate email errors
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_




- [x] 4.1 Write property test for data isolation

  - **Property 4: Data isolation**
  - **Validates: Requirements 3.3**


- [ ] 5. Implement diet assessment calculation utilities
  - Create BMR calculation function using Mifflin-St Jeor equation

  - Create TDEE calculation function with activity level multipliers

  - Create calorie target calculation function based on goals



  - Create macro distribution calculation function for different diet types
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 5.1 Write property test for BMR calculation
  - **Property 5: BMR calculation correctness**
  - **Validates: Requirements 2.1**



- [x] 5.2 Write property test for TDEE calculation




  - **Property 6: TDEE calculation correctness**
  - **Validates: Requirements 2.2**



- [ ] 5.3 Write property test for calorie target calculation
  - **Property 7: Calorie target calculation correctness**
  - **Validates: Requirements 2.3**


- [ ] 5.4 Write property test for macro distribution calculation
  - **Property 8: Macro distribution calculation correctness**
  - **Validates: Requirements 2.4**



- [x] 6. Create user profile routes and controllers



  - Implement GET /api/user/profile endpoint (protected)
  - Implement PUT /api/user/profile endpoint (protected)
  - Integrate assessment calculations into profile update
  - Return calculated BMR, TDEE, calorie target, and macros
  - _Requirements: 2.5, 2.6_


- [x] 6.1 Write property test for assessment data persistence

  - **Property 9: Assessment data persistence**
  - **Validates: Requirements 2.5, 2.6**



- [ ] 7. Implement meal logging routes and controllers
  - Implement POST /api/meals endpoint (protected)
  - Implement GET /api/meals/today endpoint (protected)


  - Implement DELETE /api/meals/:id endpoint (protected)
  - Add date filtering for today's meals



  - Ensure meals are associated with authenticated user
  - _Requirements: 4.1, 4.2, 4.3_

- [x] 7.1 Write property test for meal creation and retrieval

  - **Property 10: Meal creation and retrieval**
  - **Validates: Requirements 4.1, 4.2**

- [x] 7.2 Write property test for meal deletion


  - **Property 11: Meal deletion**
  - **Validates: Requirements 4.3**


- [x] 8. Implement meal history and aggregation

  - Implement GET /api/meals/history endpoint (protected)

  - Create aggregation pipeline for daily totals
  - Calculate sum of calories, protein, carbs, fat per day

  - Return last 7-10 days of data
  - Calculate compliance status for each day

  - _Requirements: 4.4, 4.5, 6.1, 6.2_





- [ ] 8.1 Write property test for daily totals calculation
  - **Property 12: Daily totals calculation**
  - **Validates: Requirements 4.5, 5.1**




- [ ] 8.2 Write property test for history retrieval and aggregation
  - **Property 15: History retrieval and aggregation**
  - **Validates: Requirements 4.4, 6.1**


- [ ] 8.3 Write property test for compliance status calculation
  - **Property 16: Compliance status calculation**
  - **Validates: Requirements 6.2, 6.3, 6.4, 6.5**




- [ ] 9. Configure backend server with CORS and error handling
  - Set up Express server in server.js
  - Configure CORS to allow localhost and Vercel domains
  - Mount all routes under /api prefix

  - Add global error handling middleware
  - Configure server to read PORT from environment



  - Connect to MongoDB on startup
  - _Requirements: 8.1, 8.2, 8.4, 11.1, 11.2, 12.1, 12.2, 12.3, 12.4_

- [x] 9.1 Write property test for input validation

  - **Property 22: Input validation**


  - **Validates: Requirements 12.1**

- [ ] 10. Set up frontend project with Vite and Tailwind CSS
  - Initialize Vite project with React and TypeScript
  - Install and configure Tailwind CSS



  - Install React Router, axios, and other dependencies
  - Configure Vite proxy for development API requests
  - Create basic App.jsx with routing structure
  - Set up index.css with Tailwind directives
  - _Requirements: 9.3, 11.3_

- [x] 11. Create axios configuration with environment-aware base URL


  - Create src/api/axios.js with dynamic baseURL
  - Read VITE_API_URL from environment with localhost fallback
  - Add request interceptor to attach JWT token
  - Add response interceptor for error handling
  - _Requirements: 9.1, 9.2, 9.4_


- [ ] 12. Implement authentication context and state management
  - Create AuthContext with user state and auth functions

  - Implement login function with API call and token storage
  - Implement register function with API call
  - Implement logout function to clear token
  - Implement token persistence in localStorage

  - Add loading states for auth operations
  - _Requirements: 1.3, 1.4, 1.5_


- [ ] 13. Create authentication pages (Login and Register)
  - Implement Login page with email/password form
  - Implement Register page with name/email/password form
  - Add form validation and error display

  - Integrate with AuthContext
  - Add navigation between login and register

  - Redirect to dashboard on successful auth
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 14. Implement protected route component
  - Create ProtectedRoute wrapper component
  - Check authentication status from AuthContext

  - Redirect to login if not authenticated
  - Render protected content if authenticated


  - _Requirements: 3.1, 3.2_

- [ ] 15. Create navigation component
  - Implement Navbar with links to all pages
  - Add logout button
  - Show/hide links based on auth status
  - Make responsive for mobile devices
  - _Requirements: 7.3_



- [x] 16. Implement Profile/Assessment page

  - Create form with all assessment inputs (age, gender, height, weight, activity, goal, diet type)
  - Call PUT /api/user/profile on form submission

  - Display calculated results (BMR, TDEE, calorie target, macros)
  - Show loading and error states

  - Pre-fill form with existing profile data
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [x] 17. Create progress circle component

  - Implement ProgressCircle component with SVG
  - Calculate and display percentage
  - Show current vs target values

  - Add color coding based on status
  - Make responsive and accessible
  - _Requirements: 5.3, 7.5_


- [ ] 17.1 Write property test for progress indicator accuracy
  - **Property 20: Progress indicator accuracy**
  - **Validates: Requirements 7.5**


- [ ] 18. Implement Dashboard page with meal tracking
  - Fetch and display today's meals from API
  - Calculate and display total consumed calories/macros

  - Show ProgressCircle with calories consumed vs target
  - Calculate and display remaining calories
  - Show over-target status when applicable

  - Add link to Add Meal page
  - _Requirements: 4.2, 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 18.1 Write property test for remaining calories calculation

  - **Property 13: Remaining calories calculation**
  - **Validates: Requirements 5.2, 5.3, 5.5**

- [x] 18.2 Write property test for over-target status

  - **Property 14: Over-target status indication**
  - **Validates: Requirements 5.4**


- [ ] 19. Create meal card component
  - Implement MealCard component to display single meal
  - Show meal type, food name, and nutritional info
  - Add delete button with confirmation
  - Call DELETE /api/meals/:id on delete
  - Refresh meal list after deletion

  - _Requirements: 4.3, 7.4_


- [ ] 20. Implement Add Meal page
  - Create form with meal type, food name, calories, protein, carbs, fat inputs

  - Add form validation
  - Call POST /api/meals on submission
  - Show success message and redirect to dashboard
  - Handle errors appropriately
  - _Requirements: 4.1_



- [ ] 21. Create History page with compliance tracking
  - Fetch and display last 7-10 days from GET /api/meals/history
  - Show date, total calories, and compliance status for each day
  - Color-code compliance status (green: on-track, red: over, yellow: under)
  - Display in card or table format
  - Make responsive for mobile
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 22. Implement error handling and user feedback across frontend


  - Add toast notifications or alert system for errors
  - Display user-friendly error messages from API
  - Add loading spinners for async operations
  - Disable buttons during form submission

  - Handle network errors gracefully
  - _Requirements: 12.5_

- [x] 22.1 Write property test for error message display

  - **Property 21: Error message display**
  - **Validates: Requirements 12.5**

- [x] 23. Style application with Tailwind CSS for responsive design

  - Apply mobile-first responsive design to all pages
  - Ensure proper spacing, typography, and colors
  - Make forms and buttons touch-friendly
  - Test on mobile, tablet, and desktop viewports
  - Ensure accessibility (contrast, focus states)
  - _Requirements: 7.1, 7.2, 7.4_

- [ ] 24. Create comprehensive README with deployment instructions
  - Document local setup steps for backend and frontend
  - Provide MongoDB Atlas setup instructions
  - Document environment variables for both projects
  - Add Render deployment instructions for backend
  - Add Vercel deployment instructions for frontend
  - Include troubleshooting section
  - Add placeholders for live demo links
  - _Requirements: 11.5_

- [ ] 25. Final testing and deployment preparation
  - Test complete user flow: register → profile → add meals → view dashboard → view history
  - Verify all API endpoints work correctly
  - Test CORS configuration with different origins
  - Verify environment variable handling
  - Test responsive design on multiple devices
  - Ensure no console errors
  - Verify build process for both projects
  - _Requirements: All_

- [ ] 25.1 Run all property-based tests
  - Execute all property tests with 100+ iterations
  - Verify all properties pass
  - Fix any failing tests
  - Document test coverage

- [ ] 26. Create deployment configuration files
  - Verify backend package.json has correct start script
  - Verify frontend builds to dist folder
  - Test production builds locally
  - Ensure .env.example files are complete
  - _Requirements: 11.1, 11.2, 11.3, 11.4_
