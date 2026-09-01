# UK LogiWare – Workplace Safety Training System

## Project Overview

UK LogiWare Workplace Safety Training System is a web-based training platform designed for a logistics and warehousing environment.

The system is being developed using the MERN stack and provides separate access for three user roles:

- Administrator
- Trainer
- Trainee

The current development stage focuses on the authentication, user management, role-based access control, dashboards, account security, password recovery, and user profile features required to provide a secure foundation for the training platform.

---

## Team

**Team Name:** Bug Busters

**Programme:** Enterprise Project

### Team Members

- Sakar Gurung
- Sujan Shrestha
- Siddhartha Raj Subedi
- Anisha Khatri

---

# Technology Stack

## Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt
- Cookie Parser
- Express Rate Limit
- Multer
- Sharp

---

# Current System Features

## 1. Authentication

The system provides secure authentication for:

- Administrator
- Trainer
- Trainee

Users can log in using their assigned username and password.

Passwords are not stored as plain text in MongoDB. Passwords are securely hashed using bcrypt.

---

## 2. Role-Based Access Control

The application implements Role-Based Access Control (RBAC).

Each user is assigned one of the following roles:

- Admin
- Trainer
- Trainee

Each role is restricted to its authorised routes and dashboard.

### Access Structure

```text
Admin
  ↓
Admin Dashboard

Trainer
  ↓
Trainer Dashboard

Trainee
  ↓
Trainee Dashboard
```

Protected frontend routes prevent users from accessing pages that do not belong to their assigned role.

Backend middleware also checks authentication, account status, and user role before allowing access to protected API routes.

---

# 3. Administrator Dashboard

The Administrator Dashboard provides an overview of system users and account management.

The administrator can currently:

- View registered users
- View active users
- View deactivated users
- View pending users
- View Trainer and Trainee statistics
- Create Trainer and Trainee accounts
- Manage existing users
- Deactivate users
- Reactivate users
- Delete users
- View password reset requests
- Reset Trainer/Trainee passwords

---

# 4. Admin-Controlled User Account Creation

Trainer and Trainee accounts are created by the Administrator.

Pending user information is read from:

```text
backend/src/data/userdata.json
```

The Administrator selects a pending user and generates system credentials.

The system automatically generates:

- A unique username
- A secure temporary password

The password is hashed before being stored in MongoDB.

The temporary plaintext password is returned only when the credentials are generated so the Administrator can provide the credentials to the user.

---

# 5. User Management

The Administrator can manage Trainer and Trainee accounts through the Manage Users page.

Available actions include:

- View users
- Deactivate account
- Reactivate account
- Delete account
- Reset password when a password reset request exists

Deactivated accounts are prevented from accessing protected system functionality.

---

# 6. Password Security

Newly generated accounts use temporary passwords.

The system supports the `mustChangePassword` account state so users can be required to replace their temporary password with their own secure password.

Users can change their password from the profile/account security page.

The new password must satisfy the application's password requirements.

---

# 7. Forgot Password System

Trainer and Trainee users can request a password reset from the login screen.

### Password Reset Workflow

```text
Trainer/Trainee
       ↓
Forgot Password
       ↓
Enter Username
       ↓
Submit Reset Request
       ↓
Request Stored in MongoDB
       ↓
Administrator Views Pending Request
       ↓
Administrator Opens Manage Users
       ↓
Administrator Resets Password
       ↓
Same Username Retained
       ↓
New Temporary Password Generated
       ↓
User Must Change Password
```

Password reset requests are stored separately in MongoDB.

The Forgot Password endpoint also uses rate limiting to reduce repeated password-reset requests.

---

# 8. Session Security

The application uses JWT-based authentication.

The authentication system includes:

- Access tokens
- Refresh tokens
- Protected backend routes
- Role validation
- Account status validation
- Authentication version checking
- Session revocation support

When a user's authentication version changes, previously issued sessions can be rejected.

Password resets also invalidate existing session credentials.

---

# 9. Login Security

Login requests are protected using rate limiting.

This reduces repeated login attempts against the authentication endpoint.

The system also rejects:

- Invalid credentials
- Deactivated accounts
- Invalid authentication tokens
- Revoked sessions
- Unauthorised role access

---

# 10. Trainer Dashboard

The Trainer has a dedicated protected dashboard.

The current frontend includes Trainer dashboard components for areas such as:

- Trainer statistics
- Module overview
- Task overview
- Progress overview
- Scores
- Recent activity

Further training-management functionality will be integrated in later development stages.

---

# 11. Trainee Dashboard

The Trainee has a separate protected dashboard.

The dashboard provides the foundation for future trainee training features such as:

- Assigned training
- Training progress
- Quiz results
- Training modules
- Safety activities

The full training functionality will be developed in later stages of the project.

---

# 12. User Profile

Trainer and Trainee users have access to their own profile page.

The profile displays account information such as:

- First name
- Last name
- Username
- Email
- Role
- Account status
- Age
- Gender
- Phone number
- Address

Users cannot directly modify the protected account information displayed on this page.

---

# 13. Profile Image

Trainer and Trainee users can upload or change their own profile image.

Supported formats include:

- JPG
- JPEG
- PNG
- WebP

Profile images are limited to a maximum size of 2 MB.

Image uploading uses Multer and Sharp on the backend.

Uploaded profile images are served through:

```text
/uploads/profiles/
```

The image path is associated with the user's account.

Trainer and Trainee users can also remove their own profile image.

---

# 14. Change Password

Trainer and Trainee users can change their password securely from their profile page.

The user must provide:

- Current password
- New password
- Confirm new password

The frontend performs validation before submitting the password change.

The backend securely processes and stores the new hashed password.

---

# Project Structure

```text
Logistic_warehouse/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── adminController.js
│   │   │   ├── authController.js
│   │   │   ├── passwordResetController.js
│   │   │   └── userController.js
│   │   │
│   │   ├── data/
│   │   │   └── userdata.json
│   │   │
│   │   ├── middleware/
│   │   │   ├── authenticate.js
│   │   │   ├── authorize.js
│   │   │   ├── checkActiveStatus.js
│   │   │   └── uploadProfileImage.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── PasswordResetRequest.js
│   │   │
│   │   ├── routes/
│   │   │   ├── adminRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   └── userRoutes.js
│   │   │
│   │   ├── scripts/
│   │   │   └── createAdmin.js
│   │   │
│   │   └── utils/
│   │       ├── generatePassword.js
│   │       ├── generateTokens.js
│   │       └── generateUsername.js
│   │
│   ├── uploads/
│   │   └── profiles/
│   │
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── account/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── layout/
│   │   │   ├── trainee/
│   │   │   └── trainer/
│   │   │
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── TraineeDashboard.jsx
│   │   │   ├── TrainerDashboard.jsx
│   │   │   └── Unauthorized.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
└── README.md
```

---

# Installation

## Requirements

Before running the project, install:

- Node.js
- npm
- MongoDB
- MongoDB Compass (optional database GUI)

---

## 1. Clone the Repository

```bash
git clone <repository-url>
```

Then enter the project directory:

```bash
cd Logistic_warehouse
```

---

# Backend Setup

Enter the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create/configure the backend `.env` file with the required environment variables.

Example structure:

```env
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
CLIENT_URL=http://localhost:5173

JWT_ACCESS_SECRET=<your-access-token-secret>
JWT_REFRESH_SECRET=<your-refresh-token-secret>

ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
```

Do not commit real secret values to GitHub.

Start the backend:

```bash
npm run dev
```

The backend normally runs on:

```text
http://localhost:5000
```

---

# Frontend Setup

Open another terminal and enter the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend normally runs on:

```text
http://localhost:5173
```

---

# Main API Routes

## Authentication

```text
POST /api/auth/login
POST /api/auth/forgot-password
POST /api/auth/refresh
POST /api/auth/change-password
POST /api/auth/logout
```

## Administrator

```text
GET    /api/admin/pending-users
POST   /api/admin/generate-credentials
GET    /api/admin/users
PATCH  /api/admin/users/:id/deactivate
PATCH  /api/admin/users/:id/reactivate
DELETE /api/admin/users/:id
GET    /api/admin/password-reset-requests
POST   /api/admin/users/:id/reset-password
```

## User Profile

```text
GET    /api/users/me
PATCH  /api/users/me/profile-image
DELETE /api/users/me/profile-image
```

---

# Current Development Status

The authentication and account-management foundation of the system is implemented.

### Completed / Implemented

- MongoDB connection
- User model
- Administrator account support
- Login
- Logout
- Password hashing
- JWT authentication
- Access and refresh token support
- Role-Based Access Control
- Protected frontend routes
- Admin Dashboard
- Trainer Dashboard
- Trainee Dashboard
- Admin-controlled user creation
- Automatic username generation
- Secure temporary password generation
- User management
- Account deactivation
- Account reactivation
- Account deletion
- Forgot Password request system
- Admin password reset management
- Temporary password regeneration
- Session revocation support
- Profile page
- Profile image upload
- Profile image deletion
- Change Password
- Login and Forgot Password rate limiting

### Future Development

The next stages of the project will focus on the actual workplace safety training functionality, including:

- Manual Handling training
- Working at Height training
- Training module management
- Trainer module ownership
- Trainee assignments
- Interactive hazard-identification scenarios
- Quizzes
- Scoring
- Progress tracking
- Reports and analytics
- Notifications
- Audit logs
- Further testing and system integration

---

# Security Considerations

The project currently includes several security controls:

- bcrypt password hashing
- JWT authentication
- Role-based authorization
- Protected frontend routes
- Protected backend APIs
- Active-account validation
- Authentication version validation
- Session revocation
- Login rate limiting
- Forgot Password rate limiting
- Temporary password generation
- Password-change enforcement support
- Profile image file-type validation
- Profile image size validation

Sensitive values such as database connection strings and JWT secrets should always remain inside environment variables and must not be committed to the public repository.

---

# Project Status

**Current Phase:** Authentication, Access Control, Dashboards and User Account Management

The project now has the secure user-management foundation required before implementing the main workplace safety training modules and learning activities.