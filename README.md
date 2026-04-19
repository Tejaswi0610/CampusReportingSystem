# 🎓 Campus Reporting System

A full-stack campus complaint management system built with React + Node.js + MongoDB.

## Roles
| Role | Access |
|------|--------|
| **Admin** | Manage all users & complaints, assign workers |
| **Faculty** | Submit & track their own complaints |
| **Student** | Submit & track their own complaints |
| **Worker** | View & resolve assigned complaints |

---

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Setup

```bash
# 1. Clone repo
git clone <your-repo-url>
cd campus-reporting-system

# 2. Create server env file
cp server/.env.example server/.env
# Edit server/.env with your MONGO_URI and JWT_SECRET

# 3. Create client env file
cp client/.env.example client/.env
# For local dev, leave VITE_API_BASE_URL empty (uses Vite proxy)

# 4. Install all dependencies
npm install
cd client && npm install && cd ..

# 5. Run dev servers concurrently
npm run dev
```

App runs at: http://localhost:5173  
API runs at: http://localhost:5000

### Seed Demo Data
After starting, POST to `http://localhost:5000/api/auth/seed` (use Postman or browser):
```
POST http://localhost:5000/api/auth/seed
```
This creates demo users:
- admin@campus.com / admin123
- faculty@campus.com / faculty123
- worker@campus.com / worker123
- student@campus.com / student123

---

## Deploying to Render

### Step 1 — Deploy the Backend

1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect your GitHub repo
3. Settings:
   - **Root Directory**: *(leave blank)*
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add **Environment Variables**:
   ```
   NODE_ENV=production
   MONGO_URI=<your MongoDB Atlas connection string>
   JWT_SECRET=<a long random secret>
   PORT=5000
   ```
5. Deploy → copy the URL (e.g. `https://campus-reporting-xyz.onrender.com`)

### Step 2 — Deploy the Frontend (Render Static Site)

1. **New Static Site** → connect same repo
2. Settings:
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
3. Add **Environment Variable**:
   ```
   VITE_API_BASE_URL=https://campus-reporting-xyz.onrender.com/api
   ```
   *(Replace with your actual backend URL from Step 1)*
4. Deploy

### Step 3 — Seed the database
After both services are live, open:
```
https://campus-reporting-xyz.onrender.com/api/auth/seed
```
or POST to that URL with Postman.

---

## Project Structure

```
campus-reporting-system/
├── server/
│   ├── index.js              # Express app entry
│   ├── controllers/
│   │   ├── authController.js # login + seed
│   │   ├── usersController.js
│   │   └── complaintsController.js
│   ├── models/
│   │   ├── User.js
│   │   └── Complaint.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   └── complaints.js
│   └── middleware/
│       └── auth.js           # JWT protect + authorize
├── client/
│   └── src/
│       ├── api/axios.js      # Axios instance
│       ├── context/AuthContext.jsx
│       ├── layouts/DashboardLayout.jsx
│       └── pages/
│           ├── admin/        # Dashboard, Complaints, Users
│           ├── faculty/
│           ├── student/
│           └── worker/
├── package.json              # Root (backend)
└── render.yaml
```
