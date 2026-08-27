import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";

import AdminDashboard from "./pages/AdminDashboard";
import TrainerDashboard from "./pages/TrainerDashboard";
import TraineeDashboard from "./pages/TraineeDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/unauthorized"
          element={
            <Unauthorized />
          }
        />

        {/* ADMIN */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                "admin",
              ]}
            />
          }
        >
          <Route
            path="/admin"
            element={
              <AdminDashboard />
            }
          />
        </Route>

        {/* TRAINER */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                "trainer",
              ]}
            />
          }
        >
          <Route
            path="/trainer"
            element={
              <TrainerDashboard />
            }
          />
        </Route>

        {/* TRAINEE */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                "trainee",
              ]}
            />
          }
        >
          <Route
            path="/trainee"
            element={
              <TraineeDashboard />
            }
          />
        </Route>

        {/* Default */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        {/* Unknown route */}

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
    </BrowserRouter>
  );
}

export default App;