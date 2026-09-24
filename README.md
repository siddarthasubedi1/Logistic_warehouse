# UK LogiWare -- Workplace Safety Training System

## Enterprise Project Documentation

**Team:** Bug Busters\
**Project Type:** MERN Stack Enterprise Project\
**Application:** Workplace Safety Training System for Logistics and
Warehouse Environments

------------------------------------------------------------------------

## 1. Project Overview

UK LogiWare is a full-stack workplace safety training platform designed
for logistics and warehouse organisations. The system provides a secure
environment where administrators manage users and training content,
trainers manage authorised programmes, and trainees complete structured
safety learning.

The project follows a MERN architecture:

-   MongoDB -- Database management
-   Express.js -- Backend REST API framework
-   React.js -- Frontend user interface
-   Node.js -- Server runtime

The application supports:

-   Role-based access control
-   Secure authentication
-   Training programme management
-   Learning content delivery
-   360-degree warehouse environments
-   Hazard identification scenarios
-   Assessment and progress tracking

------------------------------------------------------------------------

# 2. User Roles

## Administrator

Administrators manage the complete training ecosystem.

Responsibilities:

-   Create, update and remove trainers and trainees
-   Assign roles and training modules
-   Manage training programmes
-   Manage learning sections
-   Manage panorama environments
-   Monitor trainee progress
-   View system activity records

------------------------------------------------------------------------

## Trainer

Trainers manage their authorised training content.

Responsibilities:

-   View assigned modules
-   Create and manage training programmes
-   Manage learning sections
-   Monitor trainee performance
-   Review assessment results

------------------------------------------------------------------------

## Trainee

Trainees complete workplace safety training.

Responsibilities:

-   Login securely
-   Access assigned modules
-   Explore warehouse environments
-   Complete learning sections
-   Perform hazard identification activities
-   Complete assessments
-   Track personal progress

------------------------------------------------------------------------

# 3. Main Training Modules

The system currently supports three safety modules:

## Manual Handling

Topics include:

-   Safe lifting techniques
-   Correct posture
-   Workplace movement
-   Hazard identification

## Working at Height

Topics include:

-   Ladder safety
-   Elevated platform safety
-   Protective equipment
-   Fall prevention

## Cyber Awareness

Topics include:

-   Password security
-   Phishing awareness
-   Secure workstation practices
-   Data protection

------------------------------------------------------------------------

# 4. Major System Features

## Authentication and Security

Implemented features:

-   User login and logout
-   Password encryption using bcrypt
-   Role-based access control
-   Protected routes
-   First login password change
-   Secure session handling

------------------------------------------------------------------------

## Training Management

Features:

-   Dynamic module management
-   Training programme creation
-   Programme ownership
-   Learning section management
-   Programme assignment
-   Level-based learning pathway

Training levels:

-   Beginner
-   Intermediate
-   Advanced

------------------------------------------------------------------------

## 360 Degree Warehouse Experience

The system includes an interactive warehouse learning environment.

Features:

-   Panorama image viewing
-   Click and drag navigation
-   Zoom controls
-   Keyboard movement support
-   Navigation hotspots
-   Module-specific environments

------------------------------------------------------------------------

## Learning Content System

Trainees can:

-   Open assigned programmes
-   View ordered learning sections
-   Complete lessons
-   Track completion status
-   Continue through structured pathways

------------------------------------------------------------------------

## Scenario Exercises

Interactive scenarios support:

-   Manual handling hazard detection
-   Working at height hazard detection
-   Cyber security risk identification

The system provides:

-   Immediate feedback
-   Reset functionality
-   Activity completion tracking

------------------------------------------------------------------------

## Assessment System

The assessment module provides:

-   Different difficulty levels
-   Question banks
-   Answer submission
-   Score calculation
-   Pass/fail evaluation
-   Attempt history

------------------------------------------------------------------------

# 5. Technology Stack

## Frontend

-   React 19
-   Vite
-   Tailwind CSS
-   React Router
-   Axios

## Backend

-   Node.js
-   Express.js
-   MongoDB
-   Mongoose
-   JWT Authentication
-   Multer File Upload
-   Sharp Image Processing

## Testing

-   Jest
-   Supertest
-   MongoDB Memory Server

------------------------------------------------------------------------

# 6. Project Structure

    Logistic_warehouse/

    ├── frontend/
    │   ├── src/
    │   ├── public/
    │   ├── package.json
    │   └── vite.config.js
    │
    ├── backend/
    │   ├── src/
    │   │   ├── controllers/
    │   │   ├── models/
    │   │   ├── routes/
    │   │   ├── middleware/
    │   │   └── seeds/
    │   ├── app.js
    │   ├── server.js
    │   └── package.json
    │
    └── README.md

------------------------------------------------------------------------

# 7. Installation Guide

## Requirements

Install:

-   Node.js
-   MongoDB
-   npm

------------------------------------------------------------------------

## Backend Setup

Open terminal:

    cd backend

Install dependencies:

    npm install

Create `.env` file:

    PORT=5000
    MONGO_URI=your_mongodb_connection
    CLIENT_URL=http://localhost:5173
    JWT_SECRET=your_secret_key

Start backend:

    npm run dev

Backend runs on:

    http://localhost:5000

------------------------------------------------------------------------

## Frontend Setup

Open another terminal:

    cd frontend

Install dependencies:

    npm install

Run application:

    npm run dev

Frontend runs on:

    http://localhost:5173

------------------------------------------------------------------------

# 8. Database

MongoDB collections include:

-   Users
-   Training Modules
-   Training Programmes
-   Learning Sections
-   Assignments
-   Panorama Environments
-   Training Progress
-   Assessments
-   Assessment Attempts
-   Audit Logs

------------------------------------------------------------------------

# 9. API Modules

Main backend routes include:

-   Authentication routes
-   User management routes
-   Training module routes
-   Training programme routes
-   Assignment routes
-   My Training routes
-   Warehouse tour routes
-   Panorama management routes
-   Training content routes
-   Activity tracking routes

------------------------------------------------------------------------

# 10. Testing

Run backend tests:

    npm test

Testing covers:

-   Authentication
-   Permissions
-   Training access
-   Progress tracking
-   API behaviour

------------------------------------------------------------------------

# 11. Development Sprint Progress

## Sprint 1

Completed:

-   Authentication system
-   User management
-   Role-based dashboards
-   Protected routes
-   Access control

## Sprint 2

Completed:

-   Training programme management
-   Learning content management
-   Module assignment
-   Dynamic training flow
-   360 training environment

## Future Development

Planned:

-   Additional VR support
-   More interactive scenarios
-   Advanced reporting
-   Notification system
-   Gamification features

------------------------------------------------------------------------

# 12. Development Notes

Important implementation considerations:

-   Dynamic modules are supported without hard-coded values.
-   Training visibility depends on user assignment.
-   Missing panorama content should display safe fallback content.
-   Progress tracking prevents duplicate completion records.
-   File naming follows project documentation standards.

------------------------------------------------------------------------

# 13. Team

**Bug Busters**

Enterprise Project Team developing a workplace safety training solution
using modern web technologies.
