import { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import "./Chat.css";
var socket = io("http://localhost:3001", {
  transports: ["websocket", "polling", "flashsocket"],
});

const Chat = ({ username }) => {
  const [message, setMessage] = useState("");
  const [msgList, setMsgList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const Messages = () => {
    return (
      <div className="messages-container">
        {msgList.map((obj, index) => (
          <div
            key={index}
            className="message-container"
            style={{ alignSelf: obj.sender === username ? "flex-end" : "flex-start" }}
          >
            <p className="message-content">{obj.content}</p>
            <p className="message-sender">{obj.sender}</p>
          </div>
        ))}
      </div>
    );
  };
  const handleClick = async () => {
    await axios.delete("/api/delete");
    setMessage("");
    socket.emit("delete all messages");
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    socket.emit("send message", { content: message, sender: username });
    await axios.post("/api/add-message", {
      content: message,
      sender: username,
    });
    setMsgList([...msgList, { content: message, sender: username }]);
    setMessage("");
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    window.location.reload();
  };

  socket.on("receive message", async (data) => {
    const newList = [...msgList, data];
    setMsgList(newList);
  });
  socket.on("delete messages client", () => {
    setMsgList([]);
  });

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await axios.get("/api/messages");
      setMsgList(
        res.data.map((obj) => ({ content: obj.content, sender: obj.sender }))
      );
    };
    setIsLoading(true);
    fetchMessages();
    setIsLoading(false);
  }, []);

  return (
    <>
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <div className="master-container">
          <nav className="navbar">
            <h1 className="logo">Hello, {username}! &#127774;</h1>
            <div className="button-group">
              <button className="button" onClick={handleLogout} type="button">
                Logout
              </button>
              <button className="button" type="button" onClick={handleClick}>
                Delete all
              </button>
            </div>
          </nav>
          <div className="body-container">
            {msgList.length === 0 ? <h1>No messages yet ...</h1> : <Messages />}
            <div className="form-container">
              <form onSubmit={handleSubmit} className="form">
                <input
                  required
                  type="text"
                  placeholder="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="input"
                />
                <button type="submit" className="button">
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
