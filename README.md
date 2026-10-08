# UK LogiWare – Workplace Safety Training System

A full-stack workplace safety training platform for logistics and warehouse environments, developed by **Bug Busters** using the **MERN stack**.

UK LogiWare provides role-based training management, structured learning programmes, interactive 360° warehouse environments, puzzles, hazard scenarios, safety simulations, assessments, progress tracking, reporting, badges, certificates, notifications, and administrative controls.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Project Objectives](#project-objectives)
3. [Current Project Status](#current-project-status)
4. [User Roles](#user-roles)
5. [Training Modules](#training-modules)
6. [Core Features](#core-features)
7. [Sprint Implementation](#sprint-implementation)
8. [Technology Stack](#technology-stack)
9. [System Architecture](#system-architecture)
10. [Project Structure](#project-structure)
11. [Database Design](#database-design)
12. [API Structure](#api-structure)
13. [Security Implementation](#security-implementation)
14. [Installation Requirements](#installation-requirements)
15. [How to Install and Run the Project](#how-to-install-and-run-the-project)
16. [Environment Variables](#environment-variables)
17. [Creating the First Administrator](#creating-the-first-administrator)
18. [Development Data and Seeding](#development-data-and-seeding)
19. [Testing](#testing)
20. [Available Commands](#available-commands)
21. [Troubleshooting](#troubleshooting)
22. [Team – Bug Busters](#team--bug-busters)
23. [Repository](#repository)
24. [End-to-End Workflows](#end-to-end-workflows)
25. [Certificate API and Data Flow](#certificate-api-and-data-flow)
26. [Test Suite Reference](#test-suite-reference)
27. [Deployment, Data and Security Checklist](#deployment-data-and-security-checklist)
28. [Codebase Reference: Key Application Areas](#codebase-reference-key-application-areas)

---

# Project Overview

**UK LogiWare Workplace Safety Training System** is an enterprise web application designed to improve workplace safety training in logistics and warehouse organisations.

Traditional workplace safety training can rely heavily on documents, presentations, or classroom-based instruction. UK LogiWare provides a more interactive approach by combining structured learning content with realistic warehouse environments, assessments, practical challenges, and safety simulations.

The system allows:

- Administrators to control users, modules, training content, reports, panoramas, certificates, and system activity.
- Trainers to manage authorised programmes and monitor trainees.
- Trainees to complete structured safety training and interactive exercises.
- Training progress and assessment results to be recorded centrally.
- Safety learning to be delivered through standard lessons as well as interactive activities.

The application follows a **MERN architecture**:

- **MongoDB** – database
- **Express.js** – backend REST API
- **React.js** – frontend interface
- **Node.js** – backend runtime

---

# Project Objectives

The main objectives of UK LogiWare are to:

- Improve the effectiveness of workplace safety training.
- Provide role-based access to training functionality.
- Allow safety content to be managed dynamically.
- Provide interactive alternatives to traditional training.
- Track individual trainee learning progress.
- Measure assessment performance.
- Allow trainers to monitor trainee performance.
- Provide management reports and training statistics.
- Increase engagement using puzzles, simulations, leaderboards and badges.
- Provide interactive 360° warehouse learning environments.
- Maintain system accountability using audit logging.
- Support completion certificates for eligible trainees.
- Provide a responsive interface suitable for different screen sizes.

---

# Current Project Status

The project has been developed through four planned development sprints.

| Sprint | Main Area | Status |
|---|---|---|
| Sprint 1 | Authentication, users, RBAC and dashboards | Completed |
| Sprint 2 | Training programmes, learning sections and assignments | Completed |
| Sprint 3 | 360° training, puzzles and safety simulations | Completed |
| Sprint 4 | Progress, monitoring, reports, badges, certificates and final system improvements | Current implementation |

The uploaded codebase already contains major Sprint 4 functionality including:

- Detailed progress tracking
- Trainer monitoring
- Administrative reporting
- Notifications
- Badges
- Certificate management
- Certificate PDF generation
- Certificate email functionality
- Performance statistics
- Additional testing
- Production checks

---

# User Roles

UK LogiWare uses **Role-Based Access Control (RBAC)** with three primary roles.

## 1. Administrator

The Administrator has the highest level of system access.

Administrator responsibilities include:

- Create trainer and trainee accounts
- Generate user credentials
- View and manage users
- Edit user information
- Activate and deactivate accounts
- Delete users
- Reset user passwords
- Assign training modules to trainers
- Manage training modules
- Create and manage training programmes
- Manage learning sections
- Manage training assignments
- Manage panoramas and warehouse locations
- Manage puzzles
- Manage safety simulations
- View reports and analytics
- Review training progress
- View system audit logs
- Manage certificate requests
- Download certificates
- Send certificates by email
- Review password reset requests
- View notifications

Administrators control the overall training environment.

---

## 2. Trainer

Trainers manage the training content they are authorised to access.

Trainer capabilities include:

- View assigned modules
- View authorised training programmes
- Create training programmes where permitted
- Update training programmes
- Manage learning sections
- Manage training content
- Create and update puzzles
- Create safety simulations
- Preview simulations
- View simulation results
- Review puzzle/challenge results
- Monitor trainee progress
- View assessment performance
- View recent trainee activity
- Access trainer notifications
- Manage their own profile

Trainer access is restricted according to the modules and programmes assigned by an Administrator.

---

## 3. Trainee

Trainees are the primary learners within the system.

Trainee capabilities include:

- Secure login
- Change temporary password on first login
- View assigned training
- Access active training modules
- Complete learning sections
- Navigate 360° warehouse environments
- Complete scenarios
- Complete assessments
- Play safety puzzles
- Complete safety simulations
- View personal scores
- View personal best results
- View leaderboards
- Track training progress
- Earn badges
- View notifications
- Manage profile information
- Upload a profile image
- Use light/dark display preferences
- Become eligible for training certificates

---

# Training Modules

The current implementation contains three main training areas.

## Manual Handling

The Manual Handling module focuses on safe movement and handling of workplace loads.

Topics and activities include:

- Assessing loads
- Safe lifting preparation
- Correct body position
- Safe carrying
- Team lifting
- Mechanical handling aids
- Route preparation
- Manual handling hazard identification
- Load movement simulations

---

## Working at Height

The Working at Height module teaches safe working practices where falls or elevated work may present a risk.

Topics include:

- Identifying height hazards
- Ladder safety
- Platform safety
- Equipment inspection
- Edge protection
- Fall prevention
- Exclusion zones
- Falling-object controls
- Emergency and rescue planning

---

## Cyber Awareness

The Cyber Awareness module extends workplace safety training into information security.

Topics include:

- Password security
- Multi-factor authentication
- Phishing
- Social engineering
- Suspicious links
- Unknown USB devices
- Data security
- Email safety
- Device security
- Remote-working security
- Incident reporting
- Business email compromise awareness

---

# Core Features

## Authentication System

The application provides secure authentication for all three user roles.

Features include:

- Username/password login
- JWT access tokens
- Refresh-token sessions
- Secure refresh-token cookie
- Password hashing using bcrypt
- Logout
- Protected frontend routes
- Protected backend routes
- Account activation checks
- Role-based API authorisation
- Login attempt rate limiting
- Password reset requests
- Forced password change

Trainer and trainee accounts can be configured to require a password change after receiving temporary credentials.

---

# User Management

Administrators can manage the complete user lifecycle.

The system supports:

- Pending user registration
- Credential generation
- Username generation
- Temporary password generation
- User editing
- Role management
- Account activation
- Account deactivation
- User deletion
- Password reset
- Trainer module assignment
- Automatic trainee training access

Administrative actions are integrated with audit logging where applicable.

---

# Training Module Management

Training modules are stored dynamically in MongoDB instead of relying only on frontend hard-coding.

Administrators can:

- Create modules
- View modules
- Edit modules
- Activate/deactivate modules
- Delete modules where allowed

This makes the system easier to extend with additional training areas in the future.

---

# Training Programme Management

Training programmes represent structured learning experiences inside training modules.

Programme information can include:

- Programme title
- Description
- Module/type
- Difficulty level
- Programme owner
- Authorised trainers
- Pass mark
- Status
- Cover image
- Creation/update information

Administrators and authorised trainers can manage programme content.

---

# Learning Section Management

Each programme contains ordered learning sections.

Learning sections contain:

- Title
- Written training content
- Image
- Image alternative text
- Display order
- Status

Management functionality includes:

- Create section
- Edit section
- Delete/deactivate section
- Reorder sections
- Preview sections
- Upload learning images

Trainees access these sections through the **My Training** learning flow.

---

# Training Assignments

Training assignments connect trainees with training programmes.

Administrators can:

- Assign programmes
- View assignments
- Deactivate assignments
- Reactivate assignments

Trainee access to learning content is controlled through the training assignment and access system.

---

# 360° Warehouse Training Environment

One of the major interactive features is the 360° warehouse training environment.

The system contains warehouse panorama environments for areas such as:

- Warehouse entrance
- Main logistics area
- Loading and dispatch
- Manual handling area
- Working at height area
- Training areas
- First aid area
- Canteen
- Site office
- Warehouse transitions

The 360° viewer supports:

- Click-and-drag navigation
- Mouse movement
- Keyboard interaction
- Zoom
- Direction control
- Panorama switching
- Interactive navigation
- Module-specific environments

The frontend uses a custom panorama rendering component rather than depending entirely on a separate external panorama viewer.

---

# Panorama Management

Administrators can manage warehouse panorama content.

Available operations include:

- View panorama locations
- Create panorama locations
- Upload panorama images
- Replace panorama images
- Edit panorama information
- Delete panorama locations

Supported upload formats include:

- JPG/JPEG
- PNG
- WebP

Panorama uploads support files up to **20 MB**.

---

# Hazard Scenarios

Training programmes can contain scenario-based activities.

Scenarios can be used to test whether trainees can identify safe and unsafe workplace actions.

Scenario functionality includes:

- Scenario instructions
- Possible actions
- Correct responses
- Incorrect responses
- Immediate feedback
- Scenario attempts
- Completion tracking

Examples include:

- Unsafe lifting situations
- Height-related hazards
- Cybersecurity incidents

---

# Assessment System

The application provides level-based assessments.

Assessment levels are represented internally as:

- Basic
- Intermediate
- High

The user interface presents the learning journey as progressively harder training levels.

Assessment questions support:

- Question text
- Multiple choices
- Correct answer
- Points
- Feedback
- Display order
- Active/inactive state

The system records:

- Assessment attempts
- Scores
- Percentage
- Pass/fail result
- Attempt history
- Progression

Progress is recalculated from actual learning and assessment activity.

---

# Puzzle System

Sprint 3 introduces interactive safety puzzles.

The built-in puzzle bank contains puzzle activities for:

- Manual Handling
- Working at Height
- Cyber Awareness

Each module contains activities for:

- Beginner
- Intermediate
- Advanced

The starter puzzle bank defines **8 puzzle activities per level for each module**.

When the trainee opens the puzzle experience, the frontend selects a random set of **5 activities** from the available level bank.

This provides variation between training sessions.

Puzzle types supported by the data model include:

- Sequence
- Selection
- Matching
- Sorting
- Scenario decision
- Environmental hazard

Puzzle functionality includes:

- Drag-and-drop interaction
- Sequence ordering
- Digital prop matching
- Hints
- Time limits
- Attempt history
- Personal best records
- Total puzzle scores
- Leaderboards
- Difficulty levels

Puzzle scores are not randomly awarded. The challenge logic validates the trainee's submitted solution before awarding the applicable score.

---

# Safety Simulation Game

The system also includes a dedicated workplace **Safety Simulation** feature.

Safety simulations are separate from the normal learning sections and provide trainees with practical decision-making activities.

Simulation management supports:

- Create simulation
- Edit simulation
- Activate/deactivate simulation
- Duplicate simulation
- Archive simulation
- Preview simulation
- Load sample simulations
- View results
- View leaderboard

Trainees can:

- Start an attempt
- Perform actions
- Receive feedback
- Complete the simulation
- View their result

Simulation content is available for the three major training modules.

Examples include:

### Manual Handling

- Obstacle control
- Route preparation
- Load inspection
- Trolley use
- Wet-floor hazards

### Working at Height

- Ladder inspection
- Guardrail controls
- Platform setup
- Permit checking
- Tool safety

### Cyber Awareness

- Suspicious email handling
- USB device safety
- Workstation security
- Visitor access
- Document protection

---

# Progress Tracking

The project contains programme-level and module-level progress tracking.

The system records information including:

- Completed learning sections
- Learning completion
- Scenario completion
- Assessment progression
- Basic assessment result
- Intermediate assessment result
- Advanced assessment result
- Current training stage
- Progress percentage
- Training status
- Start date
- Completion date
- Last accessed date

Possible training states include:

- Not started
- In progress
- Completed

The system also includes database index migration logic to prevent duplicate programme progress records.

---

# Trainer Monitoring

Sprint 4 introduces enhanced trainee monitoring.

Administrators and trainers can review trainee activity through the monitoring system.

Monitoring can provide:

- Trainee progress
- Programme information
- Completion status
- Assessment performance
- Training activity
- Individual trainee details

This allows trainers to identify learners who may require additional support.

---

# Reports and Analytics

Administrators have access to reporting functionality.

Reports can include:

- Total users
- Number of administrators
- Number of trainers
- Number of trainees
- Active/inactive users
- Programme participation
- Unique trainees
- Completed assignments
- Not-started training
- In-progress training
- Completed training
- Assessment attempts
- Passed assessments
- Failed assessments
- Average assessment score
- Best assessment score
- Hazard activity
- Optional game activity
- Completion rate

Reports can also be filtered according to available criteria such as programme, role, training status and date range.

---

# Notifications

The application contains an internal notification system.

Users can:

- View notifications
- View unread notification count
- Mark one notification as read
- Mark all notifications as read

Notification functionality is shared across applicable roles.

---

# Badge System

Trainees can earn badges based on training achievements.

The system contains:

- Badge definitions
- Badge awards
- Trainee badge history

Badges provide a gamification layer to encourage engagement with training activities.

---

# Certificate System

Sprint 4 includes cumulative training certificates, performance ratings, PDF generation, and administrator notification management.

## Certificate eligibility and progression

- Certificate eligibility is calculated from training-module completion and required assessments, not from arbitrary game points.
- The configured certificate modules are selected using `CERTIFICATE_MODULE_KEYS` (default: `manual-handling,working-at-height,cyber-awareness`).
- An eligible trainee can receive a **cumulative certificate** showing modules completed so far. As further required modules are completed, a new cumulative stage can be prepared.
- The service uses deterministic certificate identifiers and stores a certificate request/history record in MongoDB.
- Older *unsent* pending stages can be marked `superseded` when a newer cumulative stage becomes eligible.
- Performance ratings and module information are included in the generated PDF.

## Administrator certificate management

1. Open **Admin → Certificates** to inspect pending certificate notifications.
2. Review the trainee, registered email, completed modules and performance information.
3. The admin can **Download PDF** even when the certificate is still pending. An HTTP `200` with `application/pdf` is expected for an eligible download; downloading does **not** mark the certificate as sent.
4. The **Send Certificate** action opens a pre-addressed **Gmail compose window** containing a notification that the trainee's PDF is available inside UK LogiWare. The admin must actually send the message in Gmail.
5. After sending, return to the application and choose **Confirm Sent**. This records `sent` and the confirmation timestamp in MongoDB.
6. **History** in the current admin UI displays confirmed certificates that are also marked `isLatest`. Older issued records may exist in the database but may not appear in this particular history view.

**Important limitation:** Clicking **Confirm Sent** is an administrative acknowledgement, **not evidence that Gmail delivered the message**. Opening Gmail does not send anything automatically. The Gmail notification is distinct from the PDF itself: the current compose message directs trainees to log in to retrieve their certificate.

## Certificate statuses

| Status | Meaning |
|---|---|
| `pending` | A cumulative certificate is eligible, but its notification has not been confirmed |
| `sent` | An administrator confirmed sending the notification |
| `failed` | A delivery attempt encountered a failure, where applicable |
| `superseded` | An older pending cumulative stage was replaced by a newer one |

The backend also includes an SMTP-based certificate service and corresponding environment settings. **Do not confuse that service with the present admin-page Gmail/manual-confirmation flow.** Configure and test SMTP separately if using automatic PDF delivery.

---

# Audit Logging

The system contains audit logging to provide traceability for important system changes.

Audit information can record:

- Action
- User responsible for the action
- Target record
- Target type
- Creation/update information
- Timestamp

Administrators can access the Audit Logs page to review system activity.

---

# Profile Management

Users can access their profile information.

Trainer and trainee profile functionality includes:

- View account information
- Upload profile image
- Replace profile image
- Remove profile image
- Display preferences

Profile images support:

- JPG/JPEG
- PNG
- WebP

Maximum profile image size:

**2 MB**

---

# Theme and Responsive Interface

The frontend includes:

- Light mode
- Dark mode
- Saved display preferences
- Responsive layouts
- Mobile-friendly pages
- Reusable UI components
- Consistent dashboard navigation
- Accessible focus states
- Loading states
- Empty states
- Status badges
- Confirmation dialogs
- User feedback alerts

The main design uses the UK LogiWare visual identity with dark blue navigation and light content areas.

---

# Sprint Implementation

## Sprint 1 – Authentication and User Management

Implemented:

- Login
- Logout
- JWT authentication
- Role-based access control
- Admin dashboard
- Trainer dashboard
- Trainee dashboard
- Protected routes
- User creation
- Credential generation
- Roles and permissions
- User management
- Account activation/deactivation
- First-login password change
- Profile functionality
- Password reset workflow

**Status: Completed**

---

## Sprint 2 – Programmes and Learning Content

Implemented:

- Training modules
- Training programmes
- Programme ownership
- Authorised trainers
- Learning sections
- Section ordering
- Learning images
- Training assignments
- My Training
- Learning progression
- Assessments
- Assessment attempts
- Scenarios
- Training progress

**Status: Completed**

---

## Sprint 3 – Interactive Training

Implemented:

- 360° warehouse environment
- Panorama navigation
- Panorama management
- Module-specific environments
- Puzzle management
- Beginner puzzles
- Intermediate puzzles
- Advanced puzzles
- Random puzzle selection
- Puzzle scoring
- Attempt tracking
- Personal best scores
- Leaderboards
- Safety simulation game
- Simulation management
- Simulation attempts
- Simulation results

**Status: Completed**

---

## Sprint 4 – Monitoring and Final System Features

Current codebase includes:

- Enhanced training progress
- Trainer monitoring
- Administrative reports
- Notifications
- Badge system
- Certificate system
- Certificate PDF generation
- Certificate email delivery
- Performance rating
- Additional progress calculations
- Production smoke checks
- Progress performance checks
- Sprint-specific automated testing
- UI refinement and responsive improvements

---

# Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| React 19 | User interface |
| React DOM | Browser rendering |
| React Router | Client-side navigation |
| Vite | Development server and production build |
| Axios | HTTP/API requests |
| Tailwind CSS 4 | Styling utilities |
| CSS | Custom component and responsive styling |

---

## Backend

| Technology | Purpose |
|---|---|
| Node.js | Server runtime |
| Express.js 5 | REST API |
| MongoDB | Database |
| Mongoose | MongoDB ODM |
| JSON Web Token | Authentication |
| bcrypt | Password hashing |
| cookie-parser | Refresh-token cookie handling |
| CORS | Frontend/backend access control |
| express-rate-limit | Request rate limiting |
| Multer | File upload handling |
| Sharp | Image processing |

---

## Testing

| Technology | Purpose |
|---|---|
| Jest | Automated testing |
| Supertest | API testing |
| MongoDB Memory Server | Isolated database testing |

---

# System Architecture

The application follows a standard three-layer web architecture.

```text
┌───────────────────────────────┐
│        React Frontend         │
│                               │
│ Dashboards                    │
│ Training UI                   │
│ 360° Environment              │
│ Puzzles / Simulations         │
│ Reports / Management UI       │
└──────────────┬────────────────┘
               │
               │ HTTP / REST API
               │ Axios + JWT
               ▼
┌───────────────────────────────┐
│     Node.js / Express API     │
│                               │
│ Routes                        │
│ Authentication Middleware     │
│ RBAC                          │
│ Controllers                   │
│ Services                      │
│ Validation                    │
└──────────────┬────────────────┘
               │
               │ Mongoose
               ▼
┌───────────────────────────────┐
│           MongoDB             │
│                               │
│ Users                         │
│ Programmes                    │
│ Progress                      │
│ Assessments                   │
│ Puzzles                       │
│ Simulations                   │
│ Reports / Audit Data          │
└───────────────────────────────┘
```

---

# Project Structure

```text
Logistic_warehouse/
│
├── backend/
│   ├── checks/
│   │   ├── benchmarkProgress.cjs
│   │   └── productionSmoke.cjs
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── scripts/
│   │   ├── seeds/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── test/
│   ├── uploads/
│   ├── app.js
│   ├── server.js
│   ├── jest.config.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   │   ├── panoramas/
│   │   ├── puzzle-images/
│   │   └── simulation-images/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── account/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── layout/
│   │   │   ├── simulation/
│   │   │   ├── trainee/
│   │   │   ├── trainer/
│   │   │   ├── training/
│   │   │   └── ui/
│   │   │
│   │   ├── hooks/
│   │   ├── images/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── simulation/
│   │   │   ├── trainee/
│   │   │   ├── trainer/
│   │   │   └── training/
│   │   │
│   │   ├── services/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── shared/
│   ├── simulationEngine.mjs
│   └── simulationTemplates.mjs
│
└── README.md
```

---

# Database Design

MongoDB is used as the main application database.

The main Mongoose models include:

- `User`
- `TrainingModule`
- `TrainingProgramme`
- `LearningSection`
- `TrainingAssignment`
- `TrainingProgress`
- `SectionCompletion`
- `Scenario`
- `ScenarioAttempt`
- `AssessmentQuestion`
- `AssessmentAttempt`
- `Puzzle`
- `Challenge`
- `ChallengeAttempt`
- `PersonalBest`
- `WarehouseLocation`
- `Panorama`
- `Notification`
- `Badge`
- `BadgeAward`
- `CertificateRequest`
- `AuditLog`
- `PasswordResetRequest`

The application also contains unique indexes and migration logic to protect training progress and challenge data from duplicates.

---

# API Structure

The Express backend exposes REST APIs under `/api`.

Main API groups include:

```text
/api/auth
/api/admin
/api/users
/api/training-modules
/api/training-programmes
/api/training-assignments
/api/my-training
/api/warehouse-tour
/api/admin/panoramas
/api/training-content
/api/safety-simulations
/api/puzzles
/api/challenges
/api/trainer/monitoring
/api/notifications
/api/badges
```

---

## Health Endpoint

The server contains a health endpoint:

```http
GET /api/health
```

When MongoDB is connected successfully, it returns a successful health status.

A basic backend test endpoint is also available:

```http
GET /api/test
```

---

# Security Implementation

The application includes several security controls.

## Password Security

Passwords are hashed using:

```text
bcrypt
```

Plain-text user passwords are not stored in MongoDB.

---

## JWT Authentication

The application uses separate secrets for:

- Access tokens
- Refresh tokens

Do not use the same secret for both values.

---

## Refresh Token Security

Refresh tokens are handled through an HTTP-only cookie.

The backend also hashes refresh-session information before storing it against the user account.

---

## Rate Limiting

Rate limiting is used on sensitive operations.

For example:

- Login attempts are limited.
- Forgot-password requests are limited.
- Safety simulation interactions are rate limited.

---

## Role-Based Access

Backend endpoints use authentication and authorisation middleware.

Example:

```text
Administrator → administrative functionality
Trainer       → authorised training management
Trainee       → learning functionality
```

Frontend protected routes provide an additional interface-level access check.

Backend RBAC remains the main security control.

---

## Input and Error Handling

The application includes:

- Input validation
- MongoDB ID validation
- Safer error responses
- Upload validation
- Generic internal-server error handling
- Disabled `X-Powered-By`
- `X-Content-Type-Options`
- Referrer policy protection

---

# Installation Requirements

Before running the project, install the following software.

## Required

### Node.js

Both frontend and backend currently require:

```text
Node.js >= 22.12.0
```

Check your version:

```bash
node -v
```

---

### npm

Check npm:

```bash
npm -v
```

---

### MongoDB

Install MongoDB Community Server or provide a MongoDB connection URI.

Check a local MongoDB installation with:

```bash
mongosh
```

The default local database configuration used by the project can be:

```text
mongodb://127.0.0.1:27017/logistic_warehouse
```

---

# How to Install and Run the Project

## Step 1 – Clone the Repository

```bash
git clone https://github.com/siddarthasubedi1/Logistic_warehouse.git
```

Then enter the project:

```bash
cd Logistic_warehouse
```

If you received the project as a ZIP file instead, extract the ZIP and open the extracted `Logistic_warehouse` directory.

---

## Important: Reinstall `node_modules`

Do not rely on a copied `node_modules` directory, especially when the project has been moved between Windows, Linux or macOS.

Native npm dependencies can be operating-system specific.

If `node_modules` already exists, remove it and run `npm install` again.

---

# Backend Setup

Open a terminal inside the project.

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

---

## Create Backend Environment File

Create:

```text
backend/.env
```

A development configuration can follow this structure:

```env
NODE_ENV=development

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/logistic_warehouse
CLIENT_URL=http://localhost:5173

JWT_ACCESS_SECRET=replace_with_a_long_random_secret
JWT_REFRESH_SECRET=replace_with_a_different_long_random_secret

ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

TRUST_PROXY=0
SEED_STARTER_CONTENT=false

CERTIFICATE_MODULE_KEYS=manual-handling,working-at-height,cyber-awareness
```

Do not commit real production secrets to Git.

---

## Generate JWT Secrets

You can generate secure random values using Node.js.

Generate the access-token secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run the command again to generate a different refresh-token secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Example:

```env
JWT_ACCESS_SECRET=FIRST_GENERATED_VALUE
JWT_REFRESH_SECRET=SECOND_GENERATED_VALUE
```

The two values should be different.

---

# Start MongoDB

Make sure MongoDB is running before starting the backend.

For the default local configuration, MongoDB should be accessible at:

```text
127.0.0.1:27017
```

The backend will stop during startup if it cannot connect to MongoDB.

---

# Start the Backend

Development mode:

```bash
npm run dev
```

Normal start:

```bash
npm start
```

If everything is configured correctly, the terminal should show messages similar to:

```text
MongoDB connected
Sprint 3 starter puzzle content checked
Server running on port 5000
```

Backend URL:

```text
http://localhost:5000
```

API base URL:

```text
http://localhost:5000/api
```

Test the backend using:

```text
http://localhost:5000/api/health
```

or:

```text
http://localhost:5000/api/test
```

---

# Frontend Setup

Open a **second terminal**.

From the project root:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

---

## Frontend Environment File

The frontend contains:

```text
.env.example
```

Create a new file named:

```text
.env
```

Use:

```env
VITE_API_URL=http://localhost:5000/api
```

On PowerShell you can also copy the example:

```powershell
Copy-Item .env.example .env
```

---

# Start the Frontend

Run:

```bash
npm run dev
```

Vite will normally start the application at:

```text
http://localhost:5173
```

Open this address in your browser.

---

# Complete Local Startup Summary

You normally need **three things running**:

```text
1. MongoDB
2. Backend
3. Frontend
```

### Terminal 1 – Backend

```bash
cd backend
npm install
npm run dev
```

### Terminal 2 – Frontend

```bash
cd frontend
npm install
npm run dev
```

### Browser

```text
http://localhost:5173
```

---

# Environment Variables

## Required Backend Variables

| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB connection |
| `JWT_ACCESS_SECRET` | Signs access tokens |
| `JWT_REFRESH_SECRET` | Signs refresh tokens |

Without these values, the backend will not start.

---

## Common Backend Variables

| Variable | Example | Purpose |
|---|---|---|
| `NODE_ENV` | `development` | Runtime environment |
| `PORT` | `5000` | Backend port |
| `CLIENT_URL` | `http://localhost:5173` | Allowed frontend origin |
| `ACCESS_TOKEN_EXPIRES_IN` | `15m` | Access-token lifetime |
| `REFRESH_TOKEN_EXPIRES_IN` | `7d` | Refresh-token lifetime |
| `TRUST_PROXY` | `0` | Reverse proxy configuration |
| `SEED_STARTER_CONTENT` | `false` | Production starter-content control |
| `CERTIFICATE_MODULE_KEYS` | module keys | Modules used by certificate logic |

---

# Certificate Email Configuration

Certificate email sending is optional.

To enable it, configure SMTP settings:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password

CERTIFICATE_FROM_EMAIL=your-email@example.com
CERTIFICATE_FROM_NAME=UK LogiWare Safety Training
```

Without valid SMTP settings, the rest of the application can still run, but certificate email delivery will not work.

---

# Creating the First Administrator

The backend provides an Administrator bootstrap command.

Add the following temporary values to `backend/.env`:

```env
ADMIN_BOOTSTRAP_USERNAME=admin
ADMIN_BOOTSTRAP_EMAIL=admin@example.com
ADMIN_BOOTSTRAP_PASSWORD=YourSecurePassword123!
```

The password must be at least **12 characters**.

Then run:

```bash
npm run create:admin
```

The script will:

1. Connect to MongoDB.
2. Check whether an Administrator already exists.
3. Hash the password.
4. Create the first Administrator.
5. Avoid printing the configured password.

If an Administrator already exists, the script will not replace the existing account.

After successfully creating the Administrator, remove the bootstrap password values from the environment file when they are no longer required.

---

# First Application Login

After creating the Administrator:

1. Open:

```text
http://localhost:5173
```

2. Login using the Administrator username and password.

3. Use the Administrator dashboard to create trainer and trainee accounts.

4. Generate credentials for the new accounts.

5. Give the generated credentials to the relevant user.

6. Trainer and trainee accounts may be required to change the temporary password during their first login.

---

# Development Data and Seeding

The backend includes development seed and repair utilities.

## Seed Training Content

The training-content seed requires a valid pass mark.

Add:

```env
SPRINT2_PASS_MARK=70
```

You can optionally set a development seed password:

```env
SPRINT2_SEED_PASSWORD=YourDevelopmentPassword123!
```

Then run:

```bash
npm run seed:training-content
```

This can create development data including:

- Training modules
- Training programmes
- Learning sections
- Scenarios
- Assessment questions
- Test trainers
- Test trainees
- Training assignments

This command is intended for development/testing environments.

Do not use test credentials as production credentials.

---

## Seed Safety Simulations

```bash
npm run seed:safety-simulations
```

---

## Repair Sprint 3 Puzzle Bank

```bash
npm run repair:sprint3-puzzles
```

---

## Repair Module Simulation Content

```bash
npm run repair:module-games
```

---

## Fix Progress Indexes

```bash
npm run fix:progress-indexes
```

This utility helps repair legacy MongoDB progress indexes.

---

# Testing

Backend automated tests use Jest, Supertest and MongoDB Memory Server.

Go to:

```bash
cd backend
```

Run the complete test suite:

```bash
npm test
```

---

## Sprint 1 Tests

```bash
npm run test:sprint1
```

Covers areas such as:

- Authentication
- Access control
- User profile functionality

---

## Sprint 2 Tests

```bash
npm run test:sprint2
```

Covers:

- Training programmes
- Training content
- Training access
- Automatic trainee access

---

## Sprint 3 Tests

```bash
npm run test:sprint3
```

Covers:

- Challenges
- Safety simulations
- Module game progress

---

## Sprint 4 Tests

```bash
npm run test:sprint4
```

Covers:

- Sprint 4 functionality
- Certificates
- Progress
- Safety simulations

---

## Run All Sprint Tests

```bash
npm run test:all-sprints
```

---

## Generate Test Report

```bash
npm run test:report
```

The backend is configured to output a JSON test report to:

```text
backend/docs/test-results.json
```

---

# Frontend Quality Checks

Go to:

```bash
cd frontend
```

Run ESLint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

# Available Backend Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start backend in watch mode |
| `npm start` | Start backend normally |
| `npm test` | Run Jest tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run create:admin` | Create initial Administrator |
| `npm run seed:training-content` | Seed training content |
| `npm run seed:safety-simulations` | Seed safety simulations |
| `npm run repair:sprint3-puzzles` | Repair Sprint 3 puzzle bank |
| `npm run repair:module-games` | Repair simulation/module content |
| `npm run migrate:safety-simulations` | Run safety simulation index migration |
| `npm run fix:progress-indexes` | Repair training-progress indexes |
| `npm run test:sprint1` | Run Sprint 1 tests |
| `npm run test:sprint2` | Run Sprint 2 tests |
| `npm run test:sprint3` | Run Sprint 3 tests |
| `npm run test:sprint4` | Run Sprint 4 tests |
| `npm run test:all-sprints` | Run complete backend test suite |
| `npm run test:report` | Produce JSON test results |
| `npm run check:production` | Run production smoke checks |
| `npm run check:progress-performance` | Benchmark progress functionality |

### Development note

The current `backend/package.json` also contains a `setup:sprint4` command referencing `src/scripts/setupSprint4.js`, but that script is not present in the supplied project version. Do not depend on that command unless the missing script is restored or the package command is corrected.

---

# Available Frontend Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start Vite development server |
| `npm run build` | Create production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

---

# Main Frontend Routes

Examples of implemented routes include:

```text
/login

/admin
/admin/users
/admin/create-user
/admin/roles
/admin/audit-logs
/admin/reports
/admin/certificates
/admin/panoramas
/admin/notifications

/trainer
/trainer/monitoring
/trainer/profile
/trainer/notifications

/trainee
/trainee/360
/trainee/progress
/trainee/scenarios
/trainee/quizzes
/trainee/badges
/trainee/profile
/trainee/notifications

/training-programmes
/training-assignments
/puzzle-management
/attempt-records

/my-training
/my-training/:programmeId
/my-training/:programmeId/environment
/my-training/:programmeId/challenges
/my-training/:programmeId/exercise
```

Access to protected routes depends on the authenticated user's role.

---

# File Upload Rules

## Profile Images

Accepted:

```text
JPG
JPEG
PNG
WebP
```

Maximum:

```text
2 MB
```

---

## Training Images

Accepted:

```text
JPG
JPEG
PNG
WebP
```

Maximum:

```text
5 MB
```

---

## Panorama Images

Accepted:

```text
JPG
JPEG
PNG
WebP
```

Maximum:

```text
20 MB
```

---

# Production Considerations

Before production deployment:

1. Set:

```env
NODE_ENV=production
```

2. Use strong and unique JWT secrets.

3. Use a production MongoDB database.

4. Restrict `CLIENT_URL` to the deployed frontend.

5. Configure HTTPS.

6. Configure reverse-proxy trust correctly.

7. Keep:

```env
SEED_STARTER_CONTENT=false
```

unless starter content is intentionally required.

8. Remove temporary Administrator bootstrap values.

9. Configure SMTP securely if certificates are emailed.

10. Never commit production passwords, database credentials or JWT secrets.

11. Run:

```bash
npm run test:all-sprints
```

12. Run:

```bash
npm run check:production
```

13. Build the frontend:

```bash
npm run build
```

---

# Troubleshooting

## MongoDB Connection Error

Example:

```text
MongoDB connection error
ECONNREFUSED 127.0.0.1:27017
```

Check that MongoDB is running and confirm:

```env
MONGO_URI=mongodb://127.0.0.1:27017/logistic_warehouse
```

---

## Missing Environment Variable

If the backend displays:

```text
Missing MONGO_URI
```

or:

```text
Missing JWT_ACCESS_SECRET
```

or:

```text
Missing JWT_REFRESH_SECRET
```

check:

```text
backend/.env
```

The backend intentionally refuses to start without these security settings.

---

## Frontend Cannot Connect to Backend

Confirm frontend `.env` contains:

```env
VITE_API_URL=http://localhost:5000/api
```

Confirm backend `.env` contains:

```env
CLIENT_URL=http://localhost:5173
```

Then restart both servers.

---

## CORS Error

Make sure the frontend URL exactly matches `CLIENT_URL`.

Example:

```env
CLIENT_URL=http://localhost:5173
```

---

## Vite or Native Dependency Error

If the project was copied from another computer or extracted with an existing `node_modules` directory, remove the old dependencies and reinstall them.

### Windows PowerShell

From the frontend:

```powershell
Remove-Item node_modules -Recurse -Force
npm install
```

If necessary, repeat the same process inside `backend`.

This is especially important when the project has been moved between different operating systems because packages such as the Vite/Rolldown native bindings are platform-specific.

---

## Port Already in Use

If port `5000` is occupied, change:

```env
PORT=5001
```

Then change frontend configuration:

```env
VITE_API_URL=http://localhost:5001/api
```

---

## Login Does Not Work

Check:

- MongoDB is connected.
- User exists in the database.
- Account is active.
- Correct username/password is being used.
- Backend is running.
- Frontend is pointing to the correct API.
- User is not required to complete a password-change flow.

---

## Training Content Is Missing

Check:

- Training module status
- Programme status
- Training assignment
- Trainer authorisation
- Learning-section status
- User account status
- MongoDB data

For development data, use the appropriate seed command if required.

---

# Future Enhancement Opportunities

The current architecture can be extended with:

- Full VR headset integration
- Additional warehouse modules
- Fire safety training
- Forklift safety training
- Emergency evacuation training
- AI-assisted training recommendations
- More advanced analytics
- Organisation-level dashboards
- Real-time trainer/trainee communication
- Multi-language training
- Mobile application support
- Cloud object storage
- Automatic scheduled reports
- Advanced certificate verification

These are future possibilities rather than requirements of the current implementation.

---

# Team – Bug Busters

This project is developed by **Bug Busters**.

| Team Member | Primary Responsibility |
|---|---|
| **Sakar Gurung** | Team Leader / Scrum Master |
| **Siddartha Raj Subedi** | Backend, Frontend and Database Development |
| **Anisha KC** | UI/UX Design and Frontend Design |
| **Sujan Shrestha** | Testing and Quality Assurance |

The project was developed collaboratively using an Agile/Scrum-based sprint structure.

---

# Repository

GitHub repository:

```text
https://github.com/siddarthasubedi1/Logistic_warehouse.git
```

---

# End-to-End Workflows

## Administrator onboarding workflow

1. Set up and bootstrap the initial administrator account.
2. Log in to the administrator dashboard.
3. Approve or create users and issue temporary credentials.
4. Assign authorised training modules to trainers, and manage programme content and account permissions.
5. Review training activity, reports, certificate requests and audit records.

## Trainer workflow

1. Sign in with the issued account and complete any mandatory first-login password change.
2. Open the assigned modules/programmes; trainer privileges are subject to backend authorisation checks.
3. Manage learning content, puzzles and/or safety simulations within authorised areas.
4. Review learner attempts, progress and monitoring dashboards.

## Trainee workflow

1. Sign in and update any temporary password.
2. Open **My Training** and the currently available programmes.
3. Read ordered learning sections and use the warehouse panoramas, hazards, puzzles and simulations where available.
4. Complete the required assessments, view feedback and review progress and badges.
5. After meeting certificate requirements, retrieve the PDF using the applicable trainee certificate flow; admins manage notification status.

---

# Certificate API and Data Flow

The certificate features are implemented primarily in these files:

```text
backend/src/models/CertificateRequest.js
backend/src/controllers/certificateController.js
backend/src/services/certificateService.js
backend/src/services/certificatePdfService.js
backend/src/routes/adminRoutes.js
backend/test/certificates.test.js
frontend/src/pages/admin/CertificateManagementPage.jsx
frontend/src/styles/certificateManagement.css
```

### Admin actions

| Request | Purpose |
|---|---|
| `GET /api/admin/certificates` | List certificate requests and metadata |
| `GET /api/admin/certificates/:id/download` | Generate/download an eligible certificate PDF |
| `POST /api/admin/certificates/:id/confirm-notification` | Record manual admin confirmation of a notification |
| `POST /api/admin/certificates/:id/send` | Backend certificate sending endpoint; requires supported mail setup |
| `GET /api/admin/certificates/:id/link` | Create a certificate access link where authorised |

All administrative endpoints require authentication and appropriate authorisation. These endpoints are not public document URLs.

### Certificate quality checks

- Verify that incomplete trainees do not become eligible prematurely.
- Verify that completion of a second/third required module produces the correct cumulative stage.
- Verify that generated PDFs contain the proper recipient and modules.
- Verify that pre-send PDF download returns an allowed response without changing notification status.
- Verify pending, superseded and confirmed records independently.
- Verify that Gmail notifications use the registered email address; manual confirmation must not be treated as verified email delivery.

---

# Test Suite Reference

The backend contains the following automated test files (run from `backend/`):

| Test file | Functional area |
|---|---|
| `test/auth.test.js` | Authentication |
| `test/accessControl.test.js` | Authorisation and access control |
| `test/userProfile.test.js` | User profiles |
| `test/sprint2Training.test.js` | Programme and learning functionality |
| `test/sprint2PartC.test.js` | Additional Sprint 2 training features |
| `test/automaticTraineeAccess.test.js` | Automatic training access |
| `test/sprint3Challenges.test.js` | Challenges and puzzles |
| `test/safetySimulations.test.js` | Safety simulation behaviour |
| `test/moduleGamesProgress.test.js` | Module games and progress tracking |
| `test/sprint4.test.js` | Sprint 4 reporting/progress features |
| `test/certificates.test.js` | Certificate eligibility and management |

```bash
cd backend
npm test
```

The test setup launches an isolated MongoDB test database (and may use a locally installed `mongod` binary). Do not point automated tests at live production data. A previously reported local run had 138 passing and one failing certificate assertion; that assertion was subsequently updated to reflect download-before-send behaviour. **A successful full-suite run on the final repository checkout should be captured separately rather than presumed.**

---

# Deployment, Data and Security Checklist

Before publishing or deploying the application:

- Never commit real `.env` secrets, administrative bootstrap passwords, SMTP credentials or database connection credentials.
- If credentials were ever included in a shared ZIP or Git history, revoke/rotate them and remove the exposed values from distributable artifacts.
- Reinstall dependencies with npm on the target platform; copied `node_modules` folders may include incompatible binaries.
- Configure MongoDB backups, persistence, indexes and least-privilege access for production.
- Configure HTTPS, CORS, cookie settings, frontend API URL and a reverse proxy appropriate to the deployment environment.
- Confirm that public uploads and file-serving endpoints enforce type, size, ownership and access restrictions.
- Run backend tests, frontend lint/build, and manual role-based regression checks.
- Check all three roles on desktop and mobile widths, including light/dark themes.
- Verify certificate generation, notification flow and audit logging with test accounts before production release.
- Review the missing `backend/src/scripts/setupSprint4.js` target before using `npm run setup:sprint4`.
- Treat development seed content and test usernames as demonstration data, not production accounts.

---

# Codebase Reference: Key Application Areas

| Area | Main implementation locations |
|---|---|
| Backend startup and middleware | `backend/app.js`, `backend/server.js`, `backend/src/middleware/` |
| Authentication and account management | `backend/src/controllers/`, `backend/src/routes/`, `backend/src/models/User.js` |
| Programmes, learning and assessments | `backend/src/controllers/`, `backend/src/models/`, `frontend/src/pages/training/` |
| Warehouse panoramas | `frontend/public/panoramas/`, `frontend/src/components/`, `backend/src/controllers/` |
| Puzzles and challenges | `backend/src/models/`, `backend/src/services/`, `frontend/src/pages/` |
| Simulation engine and templates | `shared/simulationEngine.mjs`, `shared/simulationTemplates.mjs` |
| Trainer/admin analytics | `frontend/src/pages/trainer/`, `frontend/src/pages/admin/`, `backend/src/controllers/` |
| Notifications and badges | `backend/src/controllers/notificationController.js`, `backend/src/controllers/badgeController.js` |
| Certificate requests and PDF generation | `backend/src/controllers/certificateController.js`, `backend/src/services/certificatePdfService.js` |
| Verification and maintenance | `backend/test/`, `backend/checks/`, `backend/src/scripts/` |

---

# Project Summary

UK LogiWare is a complete MERN-based workplace safety training platform designed around the practical requirements of a logistics and warehouse organisation.

The system combines:

- Secure authentication
- Role-based access control
- User administration
- Training modules
- Structured programmes
- Learning sections
- Training assignments
- 360° warehouse environments
- Hazard scenarios
- Assessments
- Interactive puzzles
- Safety simulation games
- Scoring and leaderboards
- Personal best tracking
- Training progress
- Trainer monitoring
- Administrative reports
- Notifications
- Badges
- Audit logs
- Certificate generation and management
- Responsive user interfaces

The overall purpose of the system is to provide a more **interactive, measurable, controlled and engaging workplace safety training experience** than traditional document-only training methods.

---

**Project:** UK LogiWare – Workplace Safety Training System  
**Team:** Bug Busters  
**Architecture:** MERN Stack  
**Frontend:** React + Vite  
**Backend:** Node.js + Express.js  
**Database:** MongoDB  
**Development Method:** Agile / Scrum  