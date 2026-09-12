import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";

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

import {
  getSessionUser,
} from "./utils/session";


// ======================================================
// ROLE DASHBOARD PATH
// ======================================================

const getRoleDashboardPath = (
  role
) => {
  const normalizedRole =
    String(
      role ||
      ""
    )
      .trim()
      .toLowerCase();


  if (
    normalizedRole ===
    "admin"
  ) {
    return "/admin";
  }


  if (
    normalizedRole ===
    "trainer"
  ) {
    return "/trainer";
  }


  if (
    normalizedRole ===
    "trainee"
  ) {
    return "/trainee";
  }


  return "/login";
};


// ======================================================
// HOME REDIRECT
// ======================================================

function HomeRedirect() {
  const user =
    getSessionUser();


  if (!user) {
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
        getRoleDashboardPath(
          user.role
        )
      }
      replace
    />
  );
}


// ======================================================
// APP
// ======================================================

function App() {
  return (
    <Routes>
      {/* ================================================= */}
      {/* PUBLIC */}
      {/* ================================================= */}

      <Route
        path="/login"
        element={
          <Login />
        }
      />


      <Route
        path="/unauthorized"
        element={
          <Unauthorized />
        }
      />


      {/* ================================================= */}
      {/* ADMIN */}
      {/* ================================================= */}

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


      {/* ================================================= */}
      {/* TRAINER */}
      {/* ================================================= */}

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


      {/* ================================================= */}
      {/* ADMIN + TRAINER PROGRAMME MANAGEMENT */}
      {/* ================================================= */}

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


      <Route
        path="/training-programmes/:programmeId/sections"
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


      {/* ================================================= */}
      {/* ADMIN ASSIGNMENT */}
      {/* ================================================= */}

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


      {/* ================================================= */}
      {/* TRAINEE */}
      {/* ================================================= */}

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


      {/* ================================================= */}
      {/* ROOT */}
      {/* ================================================= */}

      <Route
        path="/"
        element={
          <HomeRedirect />
        }
      />


      {/* ================================================= */}
      {/* UNKNOWN */}
      {/* ================================================= */}

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