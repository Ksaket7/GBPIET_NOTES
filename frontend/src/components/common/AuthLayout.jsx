import Header from "../common/Header";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
