# Login Page Troubleshooting Guide

## Issue: Login Page Not Displaying Properly or Not Navigating

### What Was Fixed

1. **CSS Classes Not Defined** ✅
   - Added `.card`, `.label`, `.input`, `.btn-primary` classes to `frontend/src/index.css`
   - These are now properly styled with Tailwind CSS

2. **Unused React Imports** ✅
   - Removed unused `import React` from all components
   - Modern React doesn't require this import

3. **Error Handling** ✅
   - Improved error handling in Login and Register pages
   - Added try-catch blocks for better error management

## How to Test Login Flow

### Step 1: Start Backend

```bash
cd backend
npm start
```

Wait for: `Server running on port 5000`

### Step 2: Start Frontend

In a new terminal:
```bash
cd frontend
npm run dev
```

Wait for: `Local: http://localhost:5173/`

### Step 3: Test Login

1. Open `http://localhost:5173` in your browser
2. You should see the login page with:
   - DietTracker title
   - Email input field
   - Password input field
   - Sign In button
   - "Sign up" link

3. Click "Sign up" to go to registration
4. Fill in the form:
   - Full Name: John Doe
   - Email: john@example.com
   - Password: password123
   - Confirm Password: password123
5. Click "Sign Up"
6. You should be redirected to the Profile page
7. Complete your diet assessment
8. Click "Save Assessment"
9. You should be redirected to Dashboard

### Step 4: Verify Navigation

After successful login, you should see:
- Navbar at the top with navigation links
- Dashboard with today's progress
- Add Meal button
- Today's Meals section

## Common Issues & Solutions

### Issue 1: Login Button Not Working

**Symptoms:**
- Click Sign In, nothing happens
- No error message

**Solutions:**
1. Check browser console (F12 → Console tab)
2. Check backend is running: `curl http://localhost:5000/api/health`
3. Check network requests (F12 → Network tab)
4. Verify `.env` file in frontend has correct `VITE_API_URL`

### Issue 2: "Cannot POST /api/auth/login"

**Symptoms:**
- Error message: "Cannot POST /api/auth/login"
- 404 error in network tab

**Solutions:**
1. Verify backend is running on port 5000
2. Check backend routes are properly imported in `server.js`
3. Restart backend: `npm start`

### Issue 3: "Login failed" Error

**Symptoms:**
- Generic "Login failed" message
- No specific error details

**Solutions:**
1. Check if user exists (try registering first)
2. Verify email and password are correct
3. Check backend console for detailed error
4. Verify MongoDB connection is working

### Issue 4: Page Styling Looks Broken

**Symptoms:**
- No colors, buttons look plain
- Layout is broken

**Solutions:**
1. Clear browser cache: Ctrl+Shift+Delete
2. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. Check if Tailwind CSS is loaded (check Network tab for CSS files)
4. Verify `index.css` has all component classes

### Issue 5: Stuck on Loading Screen

**Symptoms:**
- Spinner keeps spinning
- Never loads the login page

**Solutions:**
1. Check browser console for errors
2. Verify AuthContext is properly initialized
3. Check localStorage for corrupted data:
   ```javascript
   // In browser console:
   localStorage.clear();
   location.reload();
   ```

## Debugging Steps

### 1. Check Backend Connection

```bash
# In terminal
curl http://localhost:5000/api/health

# Expected response:
# {"success":true,"message":"Server is running"}
```

### 2. Check Frontend Environment

```javascript
// In browser console (F12)
console.log(import.meta.env.VITE_API_URL);
// Should show: http://localhost:5000/api
```

### 3. Check Network Requests

1. Open DevTools (F12)
2. Go to Network tab
3. Try to login
4. Look for POST request to `/api/auth/login`
5. Check response for error details

### 4. Check Backend Logs

Look at terminal where you ran `npm start`:
- Should show incoming requests
- Should show any errors

### 5. Check MongoDB Connection

```bash
# In backend terminal, you should see:
# Connected to MongoDB
```

If not, check:
- MongoDB URI in `.env`
- MongoDB Atlas cluster is running
- IP whitelist includes your IP

## Reset Everything

If nothing works, try a complete reset:

```bash
# 1. Stop both servers (Ctrl+C)

# 2. Clear frontend cache
cd frontend
rm -rf node_modules package-lock.json
npm install

# 3. Clear browser cache
# Open DevTools (F12) → Application → Clear site data

# 4. Restart backend
cd backend
npm start

# 5. In new terminal, restart frontend
cd frontend
npm run dev

# 6. Open http://localhost:5173 in new incognito window
```

## Verify All Components

### Login Page Component
- ✅ Imports are correct
- ✅ Form fields are present
- ✅ Error handling is in place
- ✅ Navigation works

### AuthContext
- ✅ Login function returns `{ success, error }`
- ✅ Token is stored in localStorage
- ✅ User data is stored in localStorage

### API Configuration
- ✅ Axios instance has correct baseURL
- ✅ JWT token is attached to requests
- ✅ Error responses are handled

### Backend Routes
- ✅ POST /api/auth/login endpoint exists
- ✅ Validates email and password
- ✅ Returns JWT token on success
- ✅ Returns error message on failure

## Success Indicators

When everything is working:

1. ✅ Login page loads with proper styling
2. ✅ Can register a new account
3. ✅ Redirected to profile page after registration
4. ✅ Can complete diet assessment
5. ✅ Redirected to dashboard after assessment
6. ✅ Can see today's meals section
7. ✅ Can add meals
8. ✅ Can view history
9. ✅ Can logout

## Still Having Issues?

1. Check all error messages in browser console
2. Check backend terminal for error logs
3. Verify all `.env` files are correct
4. Try the reset steps above
5. Check that all dependencies are installed: `npm list`

## Quick Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] MongoDB connection working
- [ ] `.env` files configured correctly
- [ ] Browser cache cleared
- [ ] No console errors
- [ ] Network requests showing in DevTools
- [ ] Can register new account
- [ ] Can login with registered account
- [ ] Can navigate to dashboard

If all checkboxes are checked, your DietTracker is ready to use! 🎉
