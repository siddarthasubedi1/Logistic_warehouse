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


function App() {
  return (
    <Routes>

      {/* PUBLIC */}

      <Route
        path="/login"
        element={<Login />}
      />


      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />


      {/* =====================================
              ADMIN
          ====================================== */}

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


      {/* =====================================
              TRAINER
          ====================================== */}

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


      {/* =====================================
              TRAINEE
          ====================================== */}

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


      {/* ROOT */}

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />


      {/* UNKNOWN */}

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