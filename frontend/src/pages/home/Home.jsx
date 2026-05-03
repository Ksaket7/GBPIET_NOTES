import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LandingPage from "../home/LandingPage";
import Dashboard from "../home/Dashboard";
import Loader from "../../components/common/Loader";

export default function Home() {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <Loader message="Waking up server…" />;
  }

  if (isAuthenticated && user?.profileCompleted === false) {
    return <Navigate to="/complete-profile" replace />;
  }

  return isAuthenticated ? <Dashboard /> : <LandingPage />;
}
