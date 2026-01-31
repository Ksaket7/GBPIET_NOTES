import DashboardLayout from "../components/dashboard/DashboardLayout";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import QuickActions from "../components/dashboard/QuickActions";
import RecentNotes from "../components/dashboard/RecentNotes";
import RecentQuestions from "../components/dashboard/RecentQuestions";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <WelcomeBanner />
      <QuickActions />
      <RecentNotes />
      <RecentQuestions />
    </DashboardLayout>
  );
}
