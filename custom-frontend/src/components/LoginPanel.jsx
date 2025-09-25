import React, { useState } from "react";

const LoginPanel = ({ user, onLogin, onLogout }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await onLogin(credentials.username, credentials.password);

    if (!result.success) {
      setError("Login failed");
    }

    setLoading(false);
  };

  if (user) {
    return (
      <div className="login-panel logged-in">
        <span>Welcome, {user.username}</span>
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="login-panel">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={credentials.username}
          onChange={(e) =>
            setCredentials({ ...credentials, username: e.target.value })
          }
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default LoginPanel;
