import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { PageContext } from "../context/PageContext";
import "../styles/Sidebar.css";
import Logo from "../assets/Logo coref.png";
import { hasPermission } from "../utils/permissionHelper";
import { PERMISSIONS } from "../config/permissions";
import { MENU } from "../config/menu";

const user = JSON.parse(localStorage.getItem("user"));
const handleMenuClick = (label) => {
  localStorage.setItem("activePage", label);
};


import {
  FaHome,
  FaMoneyBillWave,
  FaCashRegister,
  FaShoppingCart,
  FaUsers,
  FaMoneyCheckAlt,
  FaUsersCog,
  FaReceipt,
  FaBox,
  FaTruckLoading,
  FaHandHoldingUsd,
  FaTasks,
  FaChartBar,
  FaCog,
  FaHeadset,
  FaSignOutAlt
} from "react-icons/fa";


const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { setActivePage } = useContext(PageContext);
  return (
    <div className="sidebar">

  {/* Logo */}
  <div className="sidebar-logo">
    <img src={Logo} alt="COREF FROID" />
    <h2>Coref Froid</h2>
  </div>



  {/* Menu */}
  <ul className="menu">
    {MENU.map((item, index) => {

      if (!hasPermission(user, item.permission)) {
        return null;
      }

      return (
        <li key={index}>
          <NavLink
            to={item.path}
            onClick={() => {
              setActivePage(item.label);
              localStorage.setItem("activePage", item.label);
            }}
          >
            <item.icon />
            <span>{item.label}</span>
          </NavLink>
        </li>
      );
    })}

    <li>
      <NavLink to="/logout" style={linkStyle}>
        <FaSignOutAlt />
        <span>Déconnexion</span>
      </NavLink>
    </li>

  </ul>

</div>
  );
};

const linkStyle = {
  display: "flex",
  gap: "10px",
  color: "white",
  textDecoration: "none",
  padding: "12px 0"
};

export default Sidebar;