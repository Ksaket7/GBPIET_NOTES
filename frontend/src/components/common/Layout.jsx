import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Layout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isLoggedOutLanding = location.pathname === "/" && !isAuthenticated;

  if (isLoggedOutLanding) {
    return <Outlet />;
  }

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
