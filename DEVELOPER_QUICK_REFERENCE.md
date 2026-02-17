# Quick Reference & Developer Guide

## 🚀 Quick Start (5 minutes)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm start  # or npm run dev for development
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev  # Starts on http://localhost:3000
```

**Note:** Backend must run first on port 5000. Frontend proxy is configured in vite.config.js.

---

## 📊 Project Health Dashboard

| Metric | Status | Notes |
|--------|--------|-------|
| **Build** | ✅ Works | No errors in dev |
| **Type Safety** | ⚠️ Low | No TypeScript yet |
| **Testing** | ❌ None | 0% coverage |
| **Security** | ⚠️ Good | Needs rate limiting |
| **Performance** | ✅ Good | Sub-100ms responses |
| **Documentation** | ⚠️ Fair | Need API docs |

---

## 🏗️ Architecture Quick Reference

```
USER REQUEST
    ↓
ROUTES (http method + path)
    ↓
AUTHENTICATION MIDDLEWARE (JWT verify)
    ↓
AUTHORIZATION MIDDLEWARE (role check)
    ↓
CONTROLLER (parse & validate input)
    ↓
SERVICE (business logic)
    ↓
MODEL (database query)
    ↓
RESPONSE (standardized format)
```

---

## 🔐 Authentication Flow

1. **Register** → Employee ID auto-generated → JWT returned
2. **Login** → Password verified → JWT returned (7-day expiry)
3. **Authenticated Requests** → JWT in Authorization header
4. **Token Expiry** → 401 response → Auto-logout → Redirect to /login

---

## 📝 Attendance Status Logic

```
CHECK-IN:
├── If time > 09:15 AM → LATE
└── If time ≤ 09:15 AM → PRESENT

CHECK-OUT:
├── Calculate hours worked
├── Hours ≥ 6 → PRESENT (or keep LATE)
├── Hours ≥ 4 < 6 → HALF_DAY
└── Hours < 4 → Keep check-in status

MONTHLY SUMMARY:
├── Count: present, late, half-day
└── Calculated: absent (remaining days)
```

---

## 🗂️ File Location Guide

| What You Need | Where to Look |
|---------------|---|
| **Models** | `backend/models/` |
| **Business Logic** | `backend/services/` |
| **API Routes** | `backend/routes/` |
| **Request Validation** | `backend/validators/` |
| **UI Components** | `frontend/src/components/` |
| **Pages** | `frontend/src/pages/` |
| **Redux Slices** | `frontend/src/store/slices/` |
| **API Client** | `frontend/src/services/api.js` |
| **Config** | `backend/config/constants.js` |

---

## 🧪 Testing Checklist

### Before Adding Feature
- [ ] Write unit tests for service
- [ ] Write integration tests for API
- [ ] Test with Postman/Insomnia
- [ ] Check Redux store changes
- [ ] Verify error handling

### Before Committing
- [ ] Run all tests locally
- [ ] No console errors/warnings
- [ ] Manual feature test
- [ ] Check database records

### Before Deploying
- [ ] All tests pass
- [ ] Performance checked
- [ ] Security review done
- [ ] Database migrations (if any)
- [ ] Environment variables set

---

## 🐛 Debugging Guide

### Backend Not Starting?
```bash
# Check port in use
netstat -ano | findstr :5000  # Windows
lsof -i :5000  # Mac/Linux

# Check .env file exists
ls backend/.env

# Check MongoDB connection
# Add: console.log in connectDB() function
```

### API Returning 400 Bad Request?
```javascript
// Check:
1. Valid JSON in request body
2. All required fields present
3. Correct data types
4. Email not already registered
5. Department value in DEPARTMENTS array
```

### Frontend Not Connecting to Backend?
```javascript
// Check in Console:
1. Network tab → /api/* requests
2. Response should be from localhost:5000
3. CORS headers present
4. vite.config.js proxy configured correctly
```

### Redux State Not Updating?
```javascript
// Check:
1. Action dispatched correctly
2. Reducer handles new action type
3. Browser DevTools Redux extension
4. Component using useSelector properly
```

---

## 📦 Environment Variables Explained

```dotenv
PORT=5000                          # Backend port (change if occupied)
MONGODB_URI=mongodb+srv://...      # Database connection string
JWT_SECRET=...                     # Secret key for signing tokens
JWT_EXPIRES_IN=7d                  # Token expiration time

OFFICE_START_HOUR=9                # Office opens at 9 AM
OFFICE_START_MINUTE=0              # Office starts at 0 minutes
LATE_THRESHOLD_MINUTES=15          # Late if after 9:15 AM
MIN_FULL_DAY_HOURS=6               # Minimum hours for full day
MIN_HALF_DAY_HOURS=4               # Minimum hours for half day
```

---

## 🚨 Critical Error Messages & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `EADDRINUSE: address already in use :::5000` | Port 5000 occupied | Kill process or change PORT |
| `MongoError: connect ECONNREFUSED` | No MongoDB connection | Check MONGODB_URI in .env |
| `JsonWebTokenError: invalid token` | Tampered/wrong token | Clear localStorage, login again |
| `ValidationError: email is required` | Missing required field | Check request body |
| `CastError: Invalid ObjectId` | Wrong ID format | Use valid MongoDB ObjectId |
| `Cannot POST /api/invalid-route` | Wrong endpoint | Check route spelling/method |

---

## 💡 Common Tasks

### Add New API Endpoint
1. Create validator in `backend/validators/`
2. Add route in `backend/routes/`
3. Add service method in `backend/services/`
4. Add controller in `backend/controllers/`
5. Test with Postman
6. Update frontend API call in `frontend/src/services/api.js`

### Add New Frontend Page
1. Create component in `frontend/src/pages/`
2. Add route in `frontend/src/App.jsx`
3. Create Redux slice if needed in `frontend/src/store/slices/`
4. Add menu item in `frontend/src/components/layout/Sidebar.jsx`
5. Test navigation and functionality

### Add New Database Field
1. Update schema in `backend/models/`
2. Add validator if needed
3. Test with seed data
4. Update frontend form if user-editable
5. Migrate existing records (if needed)

---

## 📈 Performance Tips

```javascript
// Backend
- Use .lean() for read-only queries
- Add indexes for frequently queried fields
- Implement pagination for large results
- Use aggregation pipeline for complex reports
- Cache responses with Redis

// Frontend
- Lazy load routes with React.lazy()
- Memoize expensive components
- Use useCallback for stable function references
- Optimize Redux selectors
- Tree-shake unused Tailwind utilities
```

---

## 🔒 Security Checklist

Before deploying to production:

- [ ] All environment secrets in .env (not committed)
- [ ] Rate limiting enabled
- [ ] CORS restricted to allowed origins only
- [ ] Helmet middleware added
- [ ] Input validation on all endpoints
- [ ] No console.log() with sensitive data
- [ ] HTTPS enforced
- [ ] JWT secret is strong & random
- [ ] Database backup strategy configured
- [ ] Error messages don't leak system info

---

## 📚 API Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* actual data */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

---

## 🧑‍💻 Team Workflow

1. **Feature Branch:** `git checkout -b feature/name`
2. **Development:** Write code with tests
3. **Local Testing:** Run tests, manual testing
4. **Commit:** `git commit -m "Clear message"`
5. **Push:** `git push origin feature/name`
6. **Pull Request:** Create PR on GitHub
7. **Review:** Wait for code review
8. **Merge:** Merge to main after approval

---

## 📞 Support & Resources

- **Mongoose Docs:** https://mongoosejs.com
- **Express Docs:** https://expressjs.com
- **React Docs:** https://react.dev
- **Redux Toolkit:** https://redux-toolkit.js.org
- **Vite Docs:** https://vitejs.dev
- **Tailwind CSS:** https://tailwindcss.com

---

## ✅ Pre-Deployment Checklist

- [ ] All tests passing
- [ ] No critical bugs
- [ ] Environment variables configured
- [ ] Database backups scheduled
- [ ] Monitoring/logging setup
- [ ] Rate limiting configured
- [ ] Security headers added
- [ ] API documentation complete
- [ ] Team trained on deployment process
- [ ] Rollback plan documented

---

**Last Updated:** February 16, 2026  
**Version:** 1.0.0

