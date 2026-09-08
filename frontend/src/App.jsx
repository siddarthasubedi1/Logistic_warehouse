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

import TrainerTrainingSectionPage from "./pages/trainer/TrainerTrainingSectionPage";
import TrainerTasksPage from "./pages/trainer/TrainerTasksPage";

import TrainingProgrammesPage from "./pages/training/TrainingProgrammesPage";
import TrainingProgrammeSectionsPage from "./pages/training/TrainingProgrammeSectionsPage";
import TrainingAssignmentsPage from "./pages/training/TrainingAssignmentsPage";
import MyTrainingPage from "./pages/training/MyTrainingPage";
import TraineeLearningPage from "./pages/training/TraineeLearningPage";

function App() {
  return (
    <Routes>

      {/* =================================================
          PUBLIC
      ================================================= */}

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


      {/* =================================================
          ADMIN
      ================================================= */}

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


      {/* =================================================
          TRAINER
      ================================================= */}

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
        path="/trainer/training/:sectionId"
        element={
          <ProtectedRoute
            allowedRoles={[
              "trainer",
            ]}
          >
            <TrainerTrainingSectionPage />
          </ProtectedRoute>
        }
      />


      <Route
        path="/trainer/training/:sectionId/tasks"
        element={
          <ProtectedRoute
            allowedRoles={[
              "trainer",
            ]}
          >
            <TrainerTasksPage />
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


      {/* =================================================
          SHARED ADMIN + TRAINER PROGRAMME MANAGEMENT
      ================================================= */}

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


      {/* =================================================
          ADMIN TRAINING ASSIGNMENTS

          NO ADMIN ID
          NO TRAINEE ID IN URL
      ================================================= */}

      <Route
        path="/training-assignments"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <TrainingAssignmentsPage />
          </ProtectedRoute>
        }
      />


      {/* =================================================
          TRAINEE
      ================================================= */}

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


      {/* =================================================
          TRAINEE MY TRAINING

          NO TRAINEE ID
      ================================================= */}

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


      {/* =================================================
          ROOT
      ================================================= */}

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />


      {/* =================================================
          UNKNOWN
      ================================================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

    </Routes>
  );
}


export default App;