import api from "../services/api";
import { useEffect, useState } from "react";
import { PageContext } from "../context/PageContext";
import { useContext } from "react";
import {
  FaSearch,
  FaBell,
  FaEnvelope,
  FaMoon,
  FaSun,
  FaUserCircle
} from "react-icons/fa";

import "../styles/Navbar.css";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import DefaultProfile from "../assets/default-profile.png";


const Navbar = ({ logout}) => {

  const { theme, toggleTheme } = useTheme();


const navigate = useNavigate();
const [notifications, setNotifications] = useState([]);
const [unreadMessages, setUnreadMessages] = useState(0);
const { activePage } = useContext(PageContext);

const user = JSON.parse(localStorage.getItem("user"));

useEffect(() => {

  const fetchNotifications = async () => {
    try {

      const res = await api.get("/notifications",config);

      setNotifications(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  fetchNotifications();

}, []);

const unreadCount = notifications.filter(
  (n) => n.lu === false
).length;

useEffect(() => {
  loadUnreadMessages();
}, []);

const loadUnreadMessages = async () => {
  try {

    const token = localStorage.getItem("token");

    const res = await api.get(
      "/messages/unread-count",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setUnreadMessages(res.data.count);

  } catch (error) {
    console.log(error);
  }
};

  return (
    <header className="navbar">

      {/* TITRE DYNAMIQUE */}
      <div className="navbar-title">
        <h2>{activePage}</h2>
      </div>

      {/* SEARCH */}
      <div className="search-box">
        
        <input type="text" placeholder="Rechercher..." />
      </div>

      {/* ACTIONS */}
      <div className="navbar-actions">

        {/* NOTIFICATIONS */}
        <div className="icon-box" onClick={() => navigate("/notifications")}>
  <FaBell />

  {unreadCount > 0 && (
    <span className="badge">
      {unreadCount}
    </span>
  )}
</div>

        {/* MESSAGES */}
        <div
  className="icon-box"
  onClick={() => navigate("/messages")}
>
  <FaEnvelope />

  {unreadMessages > 0 && (
    <span className="badge">
      {unreadMessages}
    </span>
  )}
</div>

        {/* THEME */}
        <div className="icon-box" onClick={toggleTheme}>
          {
        theme==="dark"
        ? <FaSun/>
        : <FaMoon/>
    }
        </div>

        {/* PROFILE */}
        <div
  className="profile"
  onClick={() => navigate("/profil")}
>

  <img
  src={
    user?.imageUrl ||
    `https://ui-avatars.com/api/?name=${user.nom}&background=0D47A1&color=fff`
  }
  alt="Profil"
  className="profile-avatar"
/>

  <div className="profile-info">
    <span>{user?.nom}</span>
    <small>{user?.role}</small>
  </div>

</div>

      </div>
      

    </header>
  );
  
};

export default Navbar;