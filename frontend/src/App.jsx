import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import CreateModulePage from "./pages/training/CreateModulePage";
import ModuleProgrammePage from "./pages/training/ModuleProgrammePage";

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
import PanoramaManagementPage from "./pages/admin/PanoramaManagementPage";

import TrainingProgrammesPage from "./pages/training/TrainingProgrammesPage";
import TrainingContentManagementPage from "./pages/training/TrainingContentManagementPage";
import TrainingProgrammeSectionsPage from "./pages/training/TrainingProgrammeSectionsPage";
import TrainingAssignmentsPage from "./pages/training/TrainingAssignmentsPage";
import AttemptRecordsPage from "./pages/training/AttemptRecordsPage";
import MyTrainingPage from "./pages/training/MyTrainingPage";
import TraineeLearningPage from "./pages/training/TraineeLearningPage";

import TraineeUtilityPage from "./pages/trainee/TraineeUtilityPage";
import TraineeModuleEnvironment from "./pages/trainee/TraineeModuleEnvironment";
import TraineeExercisePage from "./pages/trainee/TraineeExercisePage";

import {
  clearAuthSession,
  getAccessToken,
  getDashboardPath,
  getSessionUser,
  normalizeRole,
} from "./utils/session";


/* =========================================================
   HOME REDIRECT
========================================================= */

function HomeRedirect() {
  const accessToken = getAccessToken();
  const user = getSessionUser();

  if (!accessToken || !user) {
    clearAuthSession();

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  const role = normalizeRole(user.role);

  if (
    ![
      "admin",
      "trainer",
      "trainee",
    ].includes(role)
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
    ["trainer", "trainee"].includes(role) &&
    user.mustChangePassword === true
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
      to={getDashboardPath(role)}
      replace
    />
  );
}


/* =========================================================
   APP
========================================================= */

function App() {
  return (
    <Routes>

      {/* ===================================================
          PUBLIC
      ==================================================== */}

      <Route
        path="/login"
        element={<Login />}
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


      {/* ===================================================
          ADMIN DASHBOARD
      ==================================================== */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute
            allowedRoles={["admin"]}
          >
            <AdminDashboard />
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          ADMIN CREATE USER
      ==================================================== */}

      <Route
        path="/admin/create-user"
        element={
          <ProtectedRoute
            allowedRoles={["admin"]}
          >
            <CreateUserPage />
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          ADMIN MANAGE USERS
      ==================================================== */}

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute
            allowedRoles={["admin"]}
          >
            <ManageUsersPage />
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          ADMIN ROLES
      ==================================================== */}

      <Route
        path="/admin/roles"
        element={
          <ProtectedRoute
            allowedRoles={["admin"]}
          >
            <RolesPermissionsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/roles/:roleName"
        element={
          <ProtectedRoute
            allowedRoles={["admin"]}
          >
            <RoleDetailsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/roles/:roleName/edit"
        element={
          <ProtectedRoute
            allowedRoles={["admin"]}
          >
            <EditRolePage />
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          ADMIN AUDIT LOGS
      ==================================================== */}

      <Route
        path="/admin/audit-logs"
        element={
          <ProtectedRoute
            allowedRoles={["admin"]}
          >
            <AuditLogsPage />
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          ADMIN PANORAMA MANAGEMENT
      ==================================================== */}

      <Route
        path="/admin/panoramas"
        element={
          <ProtectedRoute
            allowedRoles={["admin"]}
          >
            <PanoramaManagementPage />
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          TRAINING PROGRAMMES MAIN PAGE

          THIS WAS MISSING IN YOUR CODE.
      ==================================================== */}

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


      {/* ===================================================
          CREATE MODULE
          ADMIN ONLY
      ==================================================== */}

      <Route
        path="/training-programmes/create-module"
        element={
          <ProtectedRoute
            allowedRoles={["admin"]}
          >
            <CreateModulePage />
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          EDIT MODULE
          ADMIN ONLY
      ==================================================== */}

      <Route
        path="/training-programmes/module/:moduleId/edit"
        element={
          <ProtectedRoute
            allowedRoles={["admin"]}
          >
            <CreateModulePage />
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          MODULE PROGRAMME INFORMATION

          Admin and Trainer can access this page.
      ==================================================== */}

      <Route
        path="/training-programmes/module/:moduleId/programme"
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
              "trainer",
            ]}
          >
            <ModuleProgrammePage />
          </ProtectedRoute>
        }
      />


      <Route
        path="/training-programmes/:programmeId/content-management"
        element={<ProtectedRoute allowedRoles={["admin", "trainer"]}><TrainingContentManagementPage /></ProtectedRoute>}
      />

      {/* ===================================================
          LEARNING CONTENT / SECTIONS
      ==================================================== */}

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


      {/* ===================================================
          TRAINING ASSIGNMENTS
      ==================================================== */}

      <Route
        path="/training-assignments"
        element={
          <ProtectedRoute
            allowedRoles={["admin"]}
          >
            <TrainingAssignmentsPage />
          </ProtectedRoute>
        }
      />




      {/* ===================================================
          ATTEMPT RECORDS - ADMIN / ASSIGNED TRAINER
      ==================================================== */}

      <Route
        path="/attempt-records"
        element={
          <ProtectedRoute allowedRoles={["admin", "trainer"]}>
            <AttemptRecordsPage />
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          TRAINER DASHBOARD
      ==================================================== */}

      <Route
        path="/trainer"
        element={
          <ProtectedRoute
            allowedRoles={["trainer"]}
          >
            <TrainerDashboard />
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          TRAINER PROFILE
      ==================================================== */}

      <Route
        path="/trainer/profile"
        element={
          <ProtectedRoute
            allowedRoles={["trainer"]}
          >
            <ProfilePage role="trainer" />
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          TRAINEE HOME / 360 WAREHOUSE TOUR
      ==================================================== */}

      <Route
        path="/trainee"
        element={
          <ProtectedRoute
            allowedRoles={["trainee"]}
          >
            <TraineeDashboard />
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          TRAINEE PROFILE
      ==================================================== */}

      <Route
        path="/trainee/profile"
        element={
          <ProtectedRoute
            allowedRoles={["trainee"]}
          >
            <ProfilePage role="trainee" />
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          TRAINEE MY TRAINING
      ==================================================== */}

      <Route
        path="/my-training"
        element={
          <ProtectedRoute
            allowedRoles={["trainee"]}
          >
            <MyTrainingPage />
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          TRAINEE MODULE 360 PREVIEW
      ==================================================== */}

      <Route
        path="/my-training/preview/:moduleType/environment"
        element={
          <ProtectedRoute
            allowedRoles={["trainee"]}
          >
            <TraineeModuleEnvironment />
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          TRAINEE MODULE ENVIRONMENT
      ==================================================== */}

      <Route
        path="/my-training/module/:moduleType/environment"
        element={
          <ProtectedRoute allowedRoles={["trainee"]}>
            <TraineeModuleEnvironment />
          </ProtectedRoute>
        }
      />


      <Route
        path="/my-training/:programmeId/environment"
        element={
          <ProtectedRoute
            allowedRoles={["trainee"]}
          >
            <TraineeModuleEnvironment />
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          TRAINEE EXERCISE
      ==================================================== */}

      <Route
        path="/my-training/:programmeId/exercise"
        element={
          <ProtectedRoute
            allowedRoles={["trainee"]}
          >
            <TraineeExercisePage />
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          TRAINEE LEARNING
      ==================================================== */}

      <Route
        path="/my-training/:programmeId"
        element={
          <ProtectedRoute
            allowedRoles={["trainee"]}
          >
            <TraineeLearningPage />
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          TRAINEE PROGRESS
      ==================================================== */}

      <Route
        path="/trainee/progress"
        element={
          <ProtectedRoute
            allowedRoles={["trainee"]}
          >
            <TraineeUtilityPage
              type="progress"
            />
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          OLD WAREHOUSE TOUR LINKS
          REDIRECT TO TRAINEE HOME
      ==================================================== */}

      <Route
        path="/trainee/warehouse-tour"
        element={
          <ProtectedRoute
            allowedRoles={["trainee"]}
          >
            <Navigate
              to="/trainee"
              replace
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/trainee/360"
        element={
          <ProtectedRoute
            allowedRoles={["trainee"]}
          >
            <Navigate
              to="/trainee"
              replace
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/trainee/scenarios"
        element={
          <ProtectedRoute
            allowedRoles={["trainee"]}
          >
            <Navigate
              to="/trainee"
              replace
            />
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          TRAINEE QUIZZES
      ==================================================== */}

      <Route
        path="/trainee/quizzes"
        element={
          <ProtectedRoute
            allowedRoles={["trainee"]}
          >
            <TraineeUtilityPage
              type="quizzes"
            />
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          TRAINEE NOTIFICATIONS
      ==================================================== */}

      <Route
        path="/trainee/notifications"
        element={
          <ProtectedRoute
            allowedRoles={["trainee"]}
          >
            <TraineeUtilityPage
              type="notifications"
            />
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          TRAINEE HELP
      ==================================================== */}

      <Route
        path="/trainee/help"
        element={
          <ProtectedRoute
            allowedRoles={["trainee"]}
          >
            <TraineeUtilityPage
              type="help"
            />
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          HOME
      ==================================================== */}

      <Route
        path="/"
        element={<HomeRedirect />}
      />


      {/* ===================================================
          UNKNOWN ROUTE
      ==================================================== */}

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