import { useAuth } from "../context/AuthContext";
import DashboardStats from "../components/dashboard/DashboardStats";
import MyNotes from "../components/dashboard/MyNotes";
import DashboardActions from "../components/dashboard/DashboardActions";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-5 py-10 space-y-10">
      {/* Header */}
      <div>
        <h1 className="font-poppins text-3xl text-textPrimary">
          Welcome back, {user?.fullName} 👋
        </h1>
        <p className="font-inter text-textSecondary mt-1">
          Here’s what’s happening with your account
        </p>
      </div>

      {/* Stats */}
      <DashboardStats />

      {/* My Notes */}
      <MyNotes />

      {/* Quick Actions */}
      <DashboardActions />
    </div>
  );
}
