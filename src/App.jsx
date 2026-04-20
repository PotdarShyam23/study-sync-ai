import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import LoadingScreen from "./components/LoadingScreen";
import { useAuth } from "./context/AuthContext";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const PlannerPage = lazy(() => import("./pages/PlannerPage"));
const SubjectsPage = lazy(() => import("./pages/SubjectsPage"));
const NotesPage = lazy(() => import("./pages/NotesPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

function AuthRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? "/app/dashboard" : "/login"} replace />;
}

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen label="Loading your study workspace..." />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<AuthRedirect />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="planner" element={<PlannerPage />} />
          <Route path="subjects" element={<SubjectsPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
