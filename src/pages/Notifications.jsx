import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Notification.css";

function Notifications() {

  const [notifications, setNotifications] = useState([]);

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const res = await axios.get(
      "http://localhost:3001/api/notifications",
      config
    );

    setNotifications(res.data);
  };

  const markAsRead = async (id) => {
    await axios.put(
      `http://localhost:3001/api/notifications/${id}/read`,
      {},
      config
    );

    fetchNotifications();
  };

  return (
    <div className="notif-container">

      <h2>Notifications</h2>

      {notifications.map((n) => (
        <div
          key={n.id}
          className={`notif-card ${n.lu ? "read" : "unread"}`}
          onClick={() => markAsRead(n.id)}
        >

          <h4>{n.titre}</h4>
          <p>{n.message}</p>
          <small>{n.type}</small>

        </div>
      ))}

    </div>
  );
}

export default Notifications;