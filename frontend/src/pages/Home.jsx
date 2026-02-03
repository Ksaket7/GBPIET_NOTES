import { useAuth } from "../context/AuthContext";
import LandingPage from "./LandingPage";
import Dashboard from "./Dashboard";
import Loader from "../components/common/Loader";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader message="Waking up server…" />;
  }

  return isAuthenticated ? <Dashboard /> : <LandingPage />;
}
