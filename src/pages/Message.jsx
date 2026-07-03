import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Message.css";


function Messages() {
  const token = localStorage.getItem("token");

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      loadConversation(selectedUser.id);
    }
  }, [selectedUser]);

  const loadUsers = async () => {
    try {
      const res = await api.get(
  "/messages/users",
  config
);

      // on retire l'utilisateur connecté
      const filtered = res.data.filter(
        (u) => u.id !== currentUser.id
      );

      setUsers(filtered);
    } catch (err) {
      console.log(err);
    }
  };

  const loadConversation = async (otherUserId) => {
    try {
      const res = await api.get(
        `/messages/${otherUserId}`,
        config
      );

      setMessages(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const sendMessage = async () => {
    if (!content.trim()) return;

    if (!selectedUser) return;

    try {
      await api.post(
        "/messages/send",
        {
          receiverId: selectedUser.id,
          content,
        },
        config
      );

      setContent("");

      loadConversation(selectedUser.id);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
  if (!selectedUser) return;

  loadConversation(selectedUser.id);

  const interval = setInterval(() => {
    loadConversation(selectedUser.id);
  }, 3000);

  return () => clearInterval(interval);

}, [selectedUser]);

  return (
    <div className="messages-page">

      {/* UTILISATEURS */}

      <div className="users-sidebar">

        <div className="sidebar-header">
          <h3>Utilisateurs</h3>
        </div>

        <div className="users-list">

          {users.map((user) => (

            <div
              key={user.id}
              className={
                selectedUser?.id === user.id
                  ? "user-item active"
                  : "user-item"
              }
              onClick={() => setSelectedUser(user)}
            >

              <img src={user?.imageUrl ||
    `https://ui-avatars.com/api/?name=${user.nom}&background=0D47A1&color=fff`
  }
  alt="Profil"
  className="profile-avatar"
/>

              <div>

                <h4>{user.nom}</h4>

{user.unread > 0 && (
   <span className="message-badge">
      {user.unread}
   </span>
)}

                <p>{user.role}</p>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* CHAT */}

      <div className="chat-section">

        {selectedUser ? (
          <>
            <div className="chat-header">

              <img
                src={
                  selectedUser.imageUrl ||
                  "https://ui-avatars.com/api/?name=" +
                    selectedUser.nom
                }
                alt=""
                className="avatar"
              />

              <div>

                <h3>{selectedUser.nom}</h3>

                <span>{selectedUser.role}</span>

              </div>

            </div>

            <div className="chat-body">

              {messages.map((message) => (

                <div
                  key={message.id}
                  className={
                    message.senderId === currentUser.id
                      ? "message sent"
                      : "message received"
                  }
                >

                  {message.content}

                </div>

              ))}

            </div>

            <div className="chat-footer">

              <input
                type="text"
                placeholder="Écrire un message..."
                value={content}
                onChange={(e) =>
                  setContent(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
              />

              <button onClick={sendMessage}>
                Envoyer
              </button>

            </div>

          </>
        ) : (
          <div className="empty-chat">

            <h2>

              Sélectionnez un utilisateur pour commencer une conversation

            </h2>

          </div>
        )}

      </div>

    </div>
  );
}

export default Messages;