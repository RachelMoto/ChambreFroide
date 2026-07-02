import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Layout = () => {
  return (
    <div className="app-layout">

      <Sidebar />

      <div className="app-main">

        <Navbar />

        <div className="app-content">
          <Outlet />
        </div>

      </div>

    </div>
  );
};

export default Layout;