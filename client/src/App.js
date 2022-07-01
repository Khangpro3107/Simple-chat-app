import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Link,
  Navigate,
  Routes,
  Route,
} from "react-router-dom";
import Chat from "./Chat";
import Error from "./Error";
import Login from "./Login";

function App() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUser = () => {
      const username = localStorage.getItem("username");
      setUsername(username);
    };
    fetchUser();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={username ? <Chat username={username} /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!username ? <Login /> : <Navigate to="/" />}
        />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;
