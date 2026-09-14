# UK LogiWare – Workplace Safety Training System

## Enterprise Project

**Team Name:** Bug Busters  
**Project:** Workplace Safety Training System  
**Technology:** MERN Stack  
**Development:** Sprint 1 + Sprint 2

---

# 1. Project Overview

UK LogiWare is a responsive workplace safety training web application designed for a logistics and warehousing environment.

The system provides secure account management, role-based dashboards and structured workplace safety training.

The application supports three main users:

- Administrator
- Trainer
- Trainee

The project is developed using the MERN stack:

- MongoDB
- Express.js
- React
- Node.js

The application currently combines the functionality completed in Sprint 1 and Sprint 2.

Sprint 1 established the system foundation including authentication, account management, RBAC and dashboards.

Sprint 2 extends the same system with Training Programme Management, Learning Content Management, programme assignment and Trainee learning navigation.

---

# 2. Project Goal

The overall goal of the system is to provide a secure and easy-to-use workplace safety training platform where:

- Administrators manage users, roles and training.
- Trainers manage authorised workplace safety programmes.
- Trainees access assigned learning programmes.
- Workplace safety content is organised into structured sections.
- Training images and learning information are displayed clearly.
- Access is controlled using secure authentication and role permissions.

---

# 3. Team Members

## Sakar Gurung – Team Leader

Responsibilities:

- Project planning
- Team coordination
- Monitoring progress
- Requirements analysis
- Decision making
- Content coordination
- Sprint review

## Siddhartha Raj Subedi – Backend Developer

Responsibilities:

- Backend development
- MongoDB database
- REST APIs
- Authentication integration
- Training Programme backend
- Learning Section backend
- Training Assignment backend
- Role and ownership validation
- Backend testing

## Anisha Khatri – Frontend / UI Developer

Responsibilities:

- UI/UX design
- React frontend
- Responsive interface
- Dashboard UI
- Training Programme screens
- Learning Section interface
- Training Assignment interface
- Trainee training interface
- Frontend validation

## Sujan Shrestha – Documentation & QA

Responsibilities:

- Testing
- Bug reporting
- Retesting
- Documentation
- Test cases
- User guides
- Defect logs
- Final reports

---

# 4. Technology Stack

## Frontend

- React
- Vite
- React Router
- Axios
- JavaScript
- HTML
- CSS
- Tailwind CSS

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token
- bcrypt
- Cookie Parser
- CORS
- Multer
- Sharp

## Testing

- Jest
- Supertest
- MongoDB Memory Server

---

# 5. System Roles

The system contains three main roles.

## Administrator

Administrator has the highest level of management access.

Administrator can:

- Login securely.
- Manage users.
- Create Trainer accounts.
- Create Trainee accounts.
- Edit users.
- Deactivate users.
- Delete users where supported.
- Assign roles.
- View user status.
- Manage Training Programmes.
- Manage Learning Sections.
- Assign programmes to Trainees.
- View audit information.
- Manage programme ownership.
- Override Trainer programme restrictions.

---

## Trainer

Trainer manages authorised workplace safety training content.

Trainer can:

- Login securely.
- Change temporary password on first login.
- Access Trainer Dashboard.
- View assigned training areas.
- Create Training Programmes.
- Manage owned programmes.
- Manage explicitly authorised programmes.
- Add Learning Sections.
- Edit Learning Sections.
- Reorder Learning Sections.
- Upload training images.
- Preview learning content.

Trainer cannot manage another Trainer's restricted programme.

---

## Trainee

Trainee is the learner.

Trainee can:

- Login securely.
- Change temporary password on first login.
- Access Trainee Dashboard.
- View assigned training.
- Open Training Programmes.
- Read Learning Sections.
- View training images.
- Navigate between sections.
- View profile information.

Trainees cannot create or modify Training Programmes.

---

# 6. Sprint 1 – System Foundation

Sprint 1 established the main security and user-management foundation of the application.

Main Sprint 1 functionality includes:

- Authentication
- Login
- Logout
- JWT security
- Role-Based Access Control
- Protected frontend routes
- Protected backend routes
- Administrator Dashboard
- Trainer Dashboard
- Trainee Dashboard
- User Management
- Role Management
- Generated usernames
- Generated temporary passwords
- First-login password change
- Profile Management
- Password Reset Requests
- Active/inactive account validation
- Audit Logging

---

# 7. Authentication Workflow

```text
User
  ↓
Login Page
  ↓
Enter Username + Password
  ↓
Frontend sends login request
  ↓
Backend validates credentials
  ↓
Password verified using bcrypt
  ↓
JWT Access Token generated
  ↓
User role returned
  ↓
Frontend stores authenticated session
  ↓
Role checked
  ↓
Correct Dashboard opened
```

---

# 8. Role-Based Login

After successful authentication:

```text
Authenticated User
       ↓
Check Role
       ↓
 ┌─────┼──────────┐
 ↓     ↓          ↓
Admin Trainer   Trainee
 ↓     ↓          ↓
Admin Trainer  Trainee
Dash   Dash      Dash
```

Protected routes prevent users from accessing pages outside their role.

---

# 9. User Creation Workflow

Administrator creates users.

```text
Administrator
      ↓
User Management
      ↓
Create User
      ↓
Enter User Information
      ↓
Select Role
      ↓
Backend validates information
      ↓
Generate Username
      ↓
Generate Temporary Password
      ↓
Hash Password
      ↓
Save User in MongoDB
      ↓
Display Generated Credentials
```

---

# 10. First Login Password Change

Generated passwords are temporary for Trainer and Trainee accounts.

```text
Admin Creates User
       ↓
Temporary Password Generated
       ↓
Trainer / Trainee Login
       ↓
Backend detects first login
       ↓
Password Change Required
       ↓
User enters new password
       ↓
Password validated
       ↓
Password hashed
       ↓
MongoDB updated
       ↓
Normal Login Access
```

Administrator accounts are excluded from this generated-password rule.

---

# 11. Dashboard System

The application contains separate dashboards.

## Administrator Dashboard

Provides access to:

- User Management
- Roles and Permissions
- Training Programmes
- Training Assignments
- Audit Logs
- Profile

## Trainer Dashboard

Provides access to:

- Assigned training sections
- Training Programmes
- Learning content
- Profile

## Trainee Dashboard

Provides access to:

- My Training
- Training content
- Profile
- Other future training functionality

---

# 12. Audit Logging

The system records important administrative and security actions.

Examples include:

- User creation
- User editing
- User deletion/deactivation
- Password changes
- First login
- Training Programme creation
- Learning Section creation
- Learning Section modification

Audit records help identify:

- Who performed an action
- What action occurred
- When the action occurred
- Which record was affected

---

# 13. Sprint 2 – Training Programme & Learning Content Management

Sprint 2 extends the Sprint 1 security foundation.

Main Sprint 2 functionality includes:

- Training Programme creation
- Programme viewing
- Programme editing
- Programme deactivation
- Trainer programme ownership
- Trainer authorisation
- Learning Section creation
- Learning Section editing
- Learning Section ordering
- Training image upload
- Programme assignment
- Trainee Assigned Training
- Trainee Learning Page
- Previous / Next navigation

Sprint 2 specifically requires Administrators and Trainers to manage programmes and learning sections while allowing Trainees to access and navigate assigned programmes. :contentReference[oaicite:1]{index=1}

---

# 14. Training Programme Types

The system currently supports two workplace safety training areas.

## Manual Handling

Internal value:

```text
manual-handling
```

Example topics:

- Safe lifting
- Carrying loads
- Correct posture
- Moving workplace objects
- Manual handling hazards

## Working at Height

Internal value:

```text
working-at-height
```

Example topics:

- Fall prevention
- Ladder safety
- Fall protection equipment
- Working-at-height hazards
- Equipment inspection

---

# 15. Training Programme Structure

A Training Programme contains information such as:

```text
Programme ID
Programme Type
Title
Description
Owner / Trainer
Authorised Trainers
Pass Mark
Status
Created By
Updated By
Created Date
Updated Date
```

Programme statuses include:

```text
draft
active
inactive
```

---

# 16. Training Programme Workflow

```text
Administrator / Trainer
          ↓
Training Programmes
          ↓
Create Programme
          ↓
Select Programme Type
          ↓
Enter Programme Title
          ↓
Enter Description
          ↓
Select / Determine Owner
          ↓
Set Pass Mark
          ↓
Set Status
          ↓
Backend validates data
          ↓
Programme saved to MongoDB
```

---

# 17. Trainer Programme Ownership

Trainer ownership is enforced by the backend.

```text
Trainer Creates Programme
        ↓
Authenticated Trainer ID
        ↓
Stored as Programme Owner
```

When modifying a programme:

```text
Trainer Request
       ↓
Backend retrieves programme
       ↓
Check Owner / Authorised Trainers
       ↓
 ┌─────┴─────┐
 Yes         No
 ↓           ↓
Allow      Deny
```

Administrators can manage all programmes.

A Trainer cannot modify another Trainer's restricted programme.

---

# 18. Learning Section Management

Training Programmes contain Learning Sections.

Example:

```text
Working at Height
       │
       ├── Section 1
       │   Introduction
       │
       ├── Section 2
       │   Fall Protection
       │
       ├── Section 3
       │   Ladder Safety
       │
       └── Section 4
           Hazard Checks
```

Each Learning Section contains:

```text
Section ID
Programme ID
Title
Content
Image
Image Alt Text
Order
Status
Created By
Updated By
```

Sprint 2 requires Learning Sections to support text, images, instructions, examples and ordering. :contentReference[oaicite:2]{index=2}

---

# 19. Learning Section Creation Workflow

```text
Administrator / Trainer
          ↓
Open Training Programme
          ↓
Learning Sections
          ↓
Add Learning Section
          ↓
Enter Section Title
          ↓
Enter Learning Content
          ↓
Choose Training Image
          ↓
Enter Image Alt Text
          ↓
Select Status
          ↓
Save Section
          ↓
Backend validates section
          ↓
Image processed
          ↓
Learning Section saved
          ↓
MongoDB stores section
```

---

# 20. Training Image Upload

Training images can be selected directly from the user's computer.

Supported formats:

- JPG
- JPEG
- PNG
- WebP

Example workflow:

```text
Choose Image
    ↓
File Input
    ↓
Frontend FormData
    ↓
multipart/form-data
    ↓
Backend Route
    ↓
Multer
    ↓
Sharp Image Processing
    ↓
Image Stored
    ↓
Image Path Generated
    ↓
Path stored in MongoDB
```

The database stores the image path rather than storing the complete image binary.

Example:

```text
/uploads/training/training-xxxxx.webp
```

---

# 21. Image Accessibility

Each training image should include meaningful alternative text.

Example:

```text
Worker using correct lifting posture while moving a box
```

Alternative text helps improve accessibility and explains the image when it cannot be displayed.

---

# 22. Learning Section Ordering

Sections are shown in their configured order.

Example:

```text
Order 1 → Introduction
Order 2 → Safety Equipment
Order 3 → Safe Procedure
Order 4 → Hazard Check
```

Administrators and authorised Trainers can move sections:

```text
↑ Move Up
↓ Move Down
```

The stored order determines how the Trainee sees the learning programme.

---

# 23. Programme Preview

Administrator and Trainer can preview programme content.

Preview allows authorised users to check:

- Programme information
- Section titles
- Learning text
- Uploaded image
- Alternative text
- Section order

before the programme is used by Trainees.

---

# 24. Training Assignment

Administrator assigns Training Programmes to Trainees.

```text
Administrator
      ↓
Training Assignments
      ↓
Select Programme
      ↓
Select Active Trainee
      ↓
Assign
      ↓
Validate Programme
      ↓
Validate Trainee
      ↓
Check Existing Assignment
      ↓
Create TrainingAssignment
      ↓
Save in MongoDB
```

The Sprint 2 plan requires Administrator assignment and correct display of the assigned programme to the selected Trainee. :contentReference[oaicite:3]{index=3}

---

# 25. Training Assignment Data

Training Assignment contains information such as:

```text
Assignment ID
Programme
Trainee
Assigned By
Assigned At
Status
```

The system prevents invalid or duplicate assignments where appropriate.

---

# 26. Trainee My Training

After assignment:

```text
Trainee Login
      ↓
Trainee Dashboard
      ↓
My Training
      ↓
Backend identifies logged-in Trainee
      ↓
Retrieve assigned programmes
      ↓
Display programme cards
```

Example:

```text
Working at Height

Safe working practices for elevated work.

Status: Active

[ Start Learning ]
```

---

# 27. Trainee Learning Page

The Trainee opens an assigned programme by selecting:

```text
Start Learning
```

The system then retrieves:

- Programme information
- Active Learning Sections
- Correct section order
- Learning text
- Training image
- Image alternative text

Sprint 2 requires the Trainee to open programme information, view ordered Learning Sections and use Previous/Next navigation. :contentReference[oaicite:4]{index=4}

---

# 28. Previous and Next Navigation

Example:

```text
Section 1 of 4

Introduction to Working at Height

[Image]

Learning content...

                [Next →]
```

After clicking Next:

```text
Section 2 of 4

Fall Protection Equipment

[Image]

Learning content...

[← Previous]    [Next →]
```

The navigation continues until the final section.

The system handles:

- First section
- Middle section
- Last section
- Missing sections
- Programmes without available sections

---

# 29. Combined Sprint 1 + Sprint 2 Workflow

```text
                    USER ENTERS SYSTEM
                           │
                           ▼
                       LOGIN PAGE
                           │
                           ▼
                 Username + Password
                           │
                           ▼
                 Backend Authentication
                           │
                           ▼
                    Verify Password
                           │
                           ▼
                     Generate JWT
                           │
                           ▼
                      Check Role
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
          ADMIN          TRAINER        TRAINEE
            │              │              │
            ▼              ▼              ▼
       Admin Dash     Trainer Dash     Trainee Dash
            │              │              │
            │              │              │
            ▼              ▼              │
      User Management      │              │
            │              │              │
      Create Accounts      │              │
            │              │              │
      Generate Login       │              │
            │              │              │
      RBAC / Audit         │              │
            │              │              │
            └──────────────┼──────────────┘
                           │
                           ▼
                  TRAINING PROGRAMMES
                           │
             ┌─────────────┴──────────────┐
             ▼                            ▼
          ADMIN                        TRAINER
      Manage all                Own / Authorised only
             │                            │
             └─────────────┬──────────────┘
                           ▼
                   CREATE PROGRAMME
                           │
                           ▼
                   Programme Details
                           │
                           ▼
                         SAVE
                           │
                           ▼
                        MongoDB
                           │
                           ▼
                  LEARNING SECTIONS
                           │
                           ▼
                     Add Section
                           │
             ┌─────────────┼──────────────┐
             ▼             ▼              ▼
           Title         Content         Image
                                          │
                                          ▼
                                    Choose Image
                                          │
                                          ▼
                                         Upload
                                          │
                                          ▼
                                  Store Image Path
             └─────────────┼──────────────┘
                           ▼
                   SAVE LEARNING SECTION
                           │
                           ▼
                    Repeat Sections
                           │
                           ▼
                    Reorder Sections
                           │
                           ▼
                         Preview
                           │
                           ▼
                 ADMIN ASSIGNS PROGRAMME
                           │
                           ▼
                    Select Trainee
                           │
                           ▼
                 TrainingAssignment
                           │
                           ▼
                        MongoDB
                           │
                           ▼
                      TRAINEE LOGIN
                           │
                           ▼
                     My Training
                           │
                           ▼
                 Assigned Programme
                           │
                           ▼
                    Start Learning
                           │
                           ▼
                      Section 1
                           │
                         Next
                           ▼
                      Section 2
                           │
                    Previous / Next
                           ▼
                      Section 3
                           │
                         Next
                           ▼
                      Final Section
```

---

# 30. Role Permission Matrix

| Function | Administrator | Trainer | Trainee |
|---|---|---|---|
| Login | Yes | Yes | Yes |
| View Dashboard | Yes | Yes | Yes |
| Manage Users | Yes | No | No |
| Manage Roles | Yes | No | No |
| View Programmes | All | Own/Authorised | Assigned |
| Create Programme | Yes | Yes | No |
| Edit Programme | Any | Own/Authorised | No |
| Deactivate Programme | Any | Own/Authorised | No |
| Manage Learning Sections | Any | Own/Authorised | No |
| Upload Training Images | Yes | Yes | No |
| Reorder Sections | Yes | Own/Authorised | No |
| Assign Programme | Yes | No | No |
| View Assigned Training | No | No | Yes |
| Navigate Learning Sections | Preview | Preview | Yes |
| Change Password | Yes | Yes | Yes |
| Manage Profile | Yes | Yes | Yes |

---

# 31. Main Backend Models

The application uses MongoDB models including:

```text
User
AuditLog
PasswordResetRequest
TrainingProgramme
LearningSection
TrainingAssignment
TrainingProgress
```

The first three mainly support account/security functionality while TrainingProgramme, LearningSection and TrainingAssignment support Sprint 2 training management.

---

# 32. Main Backend Routes

Examples include:

```text
/api/auth
/api/admin
/api/users
/api/training-programmes
/api/training-assignments
/api/my-training
```

All protected endpoints use authentication and role validation.

---

# 33. Security Architecture

```text
Frontend Request
      ↓
Authentication Middleware
      ↓
JWT Validation
      ↓
Account Status Check
      ↓
Role Authorisation
      ↓
Resource Permission
      ↓
Trainer Ownership Check
      ↓
Input Validation
      ↓
Controller
      ↓
MongoDB
      ↓
Response
```

Backend security remains authoritative.

Frontend hiding of buttons is only a user-interface restriction.

---

# 34. Responsive Design

The application is designed for different screen sizes.

The frontend includes:

- Responsive sidebar
- Responsive cards
- Responsive tables
- Responsive forms
- Flexible dashboard layouts
- Mobile-friendly controls

The project uses a light visual theme with consistent workplace-training branding.

---

# 35. Installation

## Requirements

Install:

- Node.js
- npm
- MongoDB
- Git

---

# 36. Clone Repository

```bash
git clone <repository-url>
cd Logistic_warehouse
```

---

# 37. Backend Setup

```bash
cd backend
npm install
```

Create/configure:

```text
.env
```

Use the environment variables required by the project.

Do not commit secrets to GitHub.

Run backend:

```bash
npm run dev
```

The backend commonly runs on:

```text
http://localhost:5000
```

---

# 38. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend normally runs on:

```text
http://localhost:5173
```

---

# 39. Frontend Production Build

```bash
npm run build
```

A successful build generates:

```text
frontend/dist
```

---

# 40. Testing

Backend:

```bash
cd backend
npm test
```

Frontend build verification:

```bash
cd frontend
npm run build
```

---

# 41. Overall Testing Checklist

## Authentication

- [ ] Admin login works
- [ ] Trainer login works
- [ ] Trainee login works
- [ ] Invalid login rejected
- [ ] Logout works
- [ ] Protected routes work

## User Management

- [ ] Admin can create Trainer
- [ ] Admin can create Trainee
- [ ] Generated username works
- [ ] Temporary password works
- [ ] First-login password change works
- [ ] User editing works
- [ ] User status changes work

## RBAC

- [ ] Admin permissions work
- [ ] Trainer restrictions work
- [ ] Trainee restrictions work
- [ ] Direct unauthorised API access is rejected

## Training Programmes

- [ ] Programme creation works
- [ ] Programme editing works
- [ ] Programme deactivation works
- [ ] Programme reactivation works
- [ ] Pass mark validation works

## Trainer Ownership

- [ ] Trainer A manages own programme
- [ ] Trainer B cannot modify Trainer A's restricted programme
- [ ] Administrator can manage both

## Learning Sections

- [ ] Section creation works
- [ ] Section editing works
- [ ] Image upload works
- [ ] Image displays
- [ ] Alt text works
- [ ] Reordering works
- [ ] Programme/section relationships remain correct

## Assignment

- [ ] Admin can assign programme
- [ ] Invalid Trainee rejected
- [ ] Duplicate assignment prevented
- [ ] Correct Trainee receives programme

## Trainee Training

- [ ] My Training loads
- [ ] Assigned programme appears
- [ ] Start Learning works
- [ ] Section image displays
- [ ] Section content displays
- [ ] Previous works
- [ ] Next works
- [ ] First section works
- [ ] Last section works
- [ ] Trainee cannot access management pages

---

# 42. Current Project Scope

The current application includes functionality completed across Sprint 1 and Sprint 2.

## Completed Foundation

- Authentication
- RBAC
- Dashboards
- User management
- Account security
- Profile management
- Audit logging

## Training Management

- Training Programmes
- Trainer ownership
- Learning Sections
- Image upload
- Section ordering
- Training Assignment
- Trainee learning navigation

---

# 43. Features Planned for Later Sprints

The following are outside the current Sprint 1 + Sprint 2 implementation:

- Interactive panoramic training
- Hazard-identification hotspots
- Full quiz system
- Automatic scoring
- Pass/fail assessment
- Quiz retakes
- Badges
- Leaderboards
- Detailed progress tracking
- Advanced notifications
- Advanced reports
- 360° / VR training

These are intentionally outside Sprint 2. :contentReference[oaicite:5]{index=5}

---

# 44. Overall System Workflow

```text
Administrator Creates Accounts
          ↓
Trainer / Trainee Login
          ↓
Authentication + RBAC
          ↓
Role Dashboard
          ↓
Administrator / Trainer Creates Training Programme
          ↓
Trainer Ownership Stored
          ↓
Create Learning Sections
          ↓
Add Text + Images
          ↓
Arrange Learning Order
          ↓
Preview Programme
          ↓
Administrator Assigns Programme to Trainee
          ↓
Trainee Logs In
          ↓
My Training
          ↓
Assigned Programme
          ↓
Start Learning
          ↓
Read Ordered Learning Sections
          ↓
View Safety Images
          ↓
Previous / Next Navigation
          ↓
Complete Available Learning Content
```

---

# 45. Sprint 1 + Sprint 2 Outcome

After Sprint 1 and Sprint 2, UK LogiWare provides a secure foundation for workplace safety training.

The system now supports:

- Secure user authentication
- Role-based access control
- Administrator, Trainer and Trainee dashboards
- User and account management
- Temporary password security
- Training Programme Management
- Trainer programme ownership
- Learning Section Management
- Workplace safety image upload
- Programme assignment
- Trainee training access
- Ordered learning navigation

This establishes the foundation required for later project features such as quizzes, interactive hazard scenarios, detailed progress tracking, reporting and advanced workplace-safety training experiences.