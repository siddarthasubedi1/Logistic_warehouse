import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";

import AdminDashboard from "./pages/AdminDashboard";
import TrainerDashboard from "./pages/TrainerDashboard";
import TraineeDashboard from "./pages/TraineeDashboard";
import ProfilePage from "./pages/ProfilePage";

import CreateUserPage from "./pages/admin/CreateUserPage";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import RolesPermissionsPage from "./pages/admin/RolesPermissionsPage";
import RoleDetailsPage from "./pages/admin/RoleDetailsPage";
import EditRolePage from "./pages/admin/EditRolePage";
import AuditLogsPage from "./pages/admin/AuditLogsPage";

import TrainingProgrammesPage from "./pages/training/TrainingProgrammesPage";
import TrainingProgrammeSectionsPage from "./pages/training/TrainingProgrammeSectionsPage";
import TrainingAssignmentsPage from "./pages/training/TrainingAssignmentsPage";
import MyTrainingPage from "./pages/training/MyTrainingPage";
import TraineeLearningPage from "./pages/training/TraineeLearningPage";
import TraineeUtilityPage from "./pages/trainee/TraineeUtilityPage";

import {
  clearAuthSession,
  getAccessToken,
  getDashboardPath,
  getSessionUser,
  normalizeRole,
} from "./utils/session";


function HomeRedirect() {
  const accessToken =
    getAccessToken();

  const user =
    getSessionUser();


  if (
    !accessToken ||
    !user
  ) {
    clearAuthSession();

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  const role =
    normalizeRole(
      user.role
    );


  if (
    ![
      "admin",
      "trainer",
      "trainee",
    ].includes(
      role
    )
  ) {
    clearAuthSession();

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  if (
    [
      "trainer",
      "trainee",
    ].includes(
      role
    ) &&
    user.mustChangePassword ===
    true
  ) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  return (
    <Navigate
      to={
        getDashboardPath(
          role
        )
      }
      replace
    />
  );
}


function App() {
  return (
    <Routes>

      {/* ============================================
              PUBLIC
          ============================================= */}

      <Route
        path="/login"
        element={
          <Login />
        }
      />


      <Route
        path="/unauthorized"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />


      {/* ============================================
              ADMIN DASHBOARD
          ============================================= */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
            ]}
          >
            <AdminDashboard />
          </ProtectedRoute>
        }
      />


      {/* ============================================
              ADMIN CREATE USER
          ============================================= */}

      <Route
        path="/admin/create-user"
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
            ]}
          >
            <CreateUserPage />
          </ProtectedRoute>
        }
      />


      {/* ============================================
              ADMIN MANAGE USERS
          ============================================= */}

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
            ]}
          >
            <ManageUsersPage />
          </ProtectedRoute>
        }
      />


      {/* ============================================
              ADMIN ROLES
          ============================================= */}

      <Route
        path="/admin/roles"
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
            ]}
          >
            <RolesPermissionsPage />
          </ProtectedRoute>
        }
      />


      <Route
        path="/admin/roles/:roleName"
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
            ]}
          >
            <RoleDetailsPage />
          </ProtectedRoute>
        }
      />


      <Route
        path="/admin/roles/:roleName/edit"
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
            ]}
          >
            <EditRolePage />
          </ProtectedRoute>
        }
      />


      {/* ============================================
              ADMIN AUDIT LOGS
          ============================================= */}

      <Route
        path="/admin/audit-logs"
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
            ]}
          >
            <AuditLogsPage />
          </ProtectedRoute>
        }
      />


      {/* ============================================
              TRAINING PROGRAMMES
          ============================================= */}

      <Route
        path="/training-programmes"
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
              "trainer",
            ]}
          >
            <TrainingProgrammesPage />
          </ProtectedRoute>
        }
      />


      {/* ============================================
              LEARNING SECTIONS

              MongoDB programme ID is no longer shown
              inside the browser URL.
          ============================================= */}

      <Route
        path="/training-programmes/sections"
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
              "trainer",
            ]}
          >
            <TrainingProgrammeSectionsPage />
          </ProtectedRoute>
        }
      />


      {/* ============================================
              TRAINING ASSIGNMENTS
          ============================================= */}

      <Route
        path="/training-assignments"
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
            ]}
          >
            <TrainingAssignmentsPage />
          </ProtectedRoute>
        }
      />


      {/* ============================================
              TRAINER DASHBOARD
          ============================================= */}

      <Route
        path="/trainer"
        element={
          <ProtectedRoute
            allowedRoles={[
              "trainer",
            ]}
          >
            <TrainerDashboard />
          </ProtectedRoute>
        }
      />


      {/* ============================================
              TRAINER PROFILE
          ============================================= */}

      <Route
        path="/trainer/profile"
        element={
          <ProtectedRoute
            allowedRoles={[
              "trainer",
            ]}
          >
            <ProfilePage
              role="trainer"
            />
          </ProtectedRoute>
        }
      />


      {/* ============================================
              TRAINEE DASHBOARD
          ============================================= */}

      <Route
        path="/trainee"
        element={
          <ProtectedRoute
            allowedRoles={[
              "trainee",
            ]}
          >
            <TraineeDashboard />
          </ProtectedRoute>
        }
      />


      {/* ============================================
              TRAINEE PROFILE
          ============================================= */}

      <Route
        path="/trainee/profile"
        element={
          <ProtectedRoute
            allowedRoles={[
              "trainee",
            ]}
          >
            <ProfilePage
              role="trainee"
            />
          </ProtectedRoute>
        }
      />


      {/* ============================================
              TRAINEE MY TRAINING
          ============================================= */}

      <Route
        path="/my-training"
        element={
          <ProtectedRoute
            allowedRoles={[
              "trainee",
            ]}
          >
            <MyTrainingPage />
          </ProtectedRoute>
        }
      />


      {/* ============================================
              TRAINEE LEARNING
          ============================================= */}

      <Route
        path="/my-training/:programmeId"
        element={
          <ProtectedRoute
            allowedRoles={[
              "trainee",
            ]}
          >
            <TraineeLearningPage />
          </ProtectedRoute>
        }
      />


      {/* ============================================
              TRAINEE UTILITY PAGES
          ============================================= */}

      <Route
        path="/trainee/progress"
        element={
          <ProtectedRoute
            allowedRoles={[
              "trainee",
            ]}
          >
            <TraineeUtilityPage
              type="progress"
            />
          </ProtectedRoute>
        }
      />


      <Route
        path="/trainee/scenarios"
        element={
          <ProtectedRoute
            allowedRoles={[
              "trainee",
            ]}
          >
            <TraineeUtilityPage
              type="scenarios"
            />
          </ProtectedRoute>
        }
      />


      <Route
        path="/trainee/quizzes"
        element={
          <ProtectedRoute
            allowedRoles={[
              "trainee",
            ]}
          >
            <TraineeUtilityPage
              type="quizzes"
            />
          </ProtectedRoute>
        }
      />


      <Route
        path="/trainee/notifications"
        element={
          <ProtectedRoute
            allowedRoles={[
              "trainee",
            ]}
          >
            <TraineeUtilityPage
              type="notifications"
            />
          </ProtectedRoute>
        }
      />


      <Route
        path="/trainee/help"
        element={
          <ProtectedRoute
            allowedRoles={[
              "trainee",
            ]}
          >
            <TraineeUtilityPage
              type="help"
            />
          </ProtectedRoute>
        }
      />


      {/* ============================================
              HOME
          ============================================= */}

      <Route
        path="/"
        element={
          <HomeRedirect />
        }
      />


      {/* ============================================
              UNKNOWN ROUTE
          ============================================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}


export default App;