import { Outlet } from "react-router-dom";
import StoreNavbar from "../components/StoreNavbar.jsx";
import Footer from "../components/Footer.jsx";

export default function StoreLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <StoreNavbar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
