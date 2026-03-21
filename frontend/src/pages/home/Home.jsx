import { useAuth } from "../../context/AuthContext";
import LandingPage from "../home/LandingPage";
import Dashboard from "../home/Dashboard";
import Loader from "../../components/common/Loader";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader message="Waking up server…" />;
  }

  return isAuthenticated ? <Dashboard /> : <LandingPage />;
}
