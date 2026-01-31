import LandingPage from "./LandingPage";
import Dashboard from "./Dashboard";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-inter">
        Loading...
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <LandingPage />;
}
