import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Loader from "../components/common/Loader";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import useAuth from "../hooks/useAuth";
import Dashboard from "../pages/admin/Dashboard";
import ManageEvents from "../pages/admin/ManageEvents";
import ManageResults from "../pages/admin/ManageResults";
import ManageTimetable from "../pages/admin/ManageTimetable";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import NotFound from "../pages/NotFound";
import Calendar from "../pages/student/Calendar";
import StudentDashboard from "../pages/student/Dashboard";
import ViewResults from "../pages/student/ViewResults";
import ViewTimetable from "../pages/student/ViewTimetable";

function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader label="Checking session..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === "ADMIN" ? "/admin" : "/student"} replace />;
  }

  return <Outlet />;
}

function AppLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel">
        <Navbar />
        <Outlet />
      </main>
    </div>
  );
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader label="Preparing portal..." />;
  }

  if (user) {
    return <Navigate to={user.role === "ADMIN" ? "/admin" : "/student"} replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route element={<ProtectedRoute allowedRoles={["ADMIN", "STUDENT"]} />}>
        <Route element={<AppLayout />}>
          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/timetable" element={<ManageTimetable />} />
            <Route path="/admin/results" element={<ManageResults />} />
            <Route path="/admin/events" element={<ManageEvents />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/timetable" element={<ViewTimetable />} />
            <Route path="/student/results" element={<ViewResults />} />
            <Route path="/student/calendar" element={<Calendar />} />
          </Route>
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
