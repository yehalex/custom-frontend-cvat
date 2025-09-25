import { useState, useEffect, useCallback } from "react";
import LoginPanel from "./components/LoginPanel";
import ProjectList from "./components/ProjectList";
import TaskDetails from "./components/TaskDetails";
import cvatApi from "./services/cvatApi";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = useCallback(async () => {
    const currentUser = await cvatApi.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const loadTasks = useCallback(
    async (p = page) => {
      const data = await cvatApi.getTasks({
        page: p,
        page_size: pageSize,
        ordering: "-updated_date",
      });
      setTasks(data.results || []);
      setCount(data.count || 0);
    },
    [page]
  );

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    if (user) loadTasks(1);
  }, [user, loadTasks]);

  const handleLogin = async (username, password) => {
    const result = await cvatApi.login(username, password);
    if (result.success) {
      await checkAuthStatus();
    }
    return result;
  };

  const handleLogout = async () => {
    try {
      await cvatApi.logout();
    } catch (error) {
      console.warn("Logout failed:", error);
      // Continue with local cleanup even if server logout fails
    }
    setUser(null);
    setTasks([]);
    setSelectedTask(null);
  };

  const handlePageChange = async (next) => {
    const newPage = Math.max(
      1,
      Math.min(Math.ceil(count / pageSize) || 1, next)
    );
    setPage(newPage);
    const data = await cvatApi.getTasks({
      page: newPage,
      page_size: pageSize,
      ordering: "-updated_date",
    });
    setTasks(data.results || []);
    setCount(data.count || 0);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="app">
      <header className="app-header">
        <h1>CVAT Tasks Dashboard</h1>
        <LoginPanel user={user} onLogin={handleLogin} onLogout={handleLogout} />
      </header>

      {!user ? (
        <div className="placeholder">Please login to view tasks</div>
      ) : (
        <div className="app-content">
          <aside className="sidebar">
            <div className="pagination">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
              >
                Prev
              </button>
              <span>
                Page {page} / {Math.max(1, Math.ceil(count / pageSize))}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page * pageSize >= count}
              >
                Next
              </button>
            </div>

            <ProjectList
              tasks={tasks}
              selectedTask={selectedTask}
              onTaskSelect={setSelectedTask}
            />
          </aside>

          <main className="main-content">
            {selectedTask ? (
              <TaskDetails
                task={selectedTask}
                onRefresh={() => loadTasks(page)}
                onDeleted={() => {
                  setSelectedTask(null);
                  loadTasks(page);
                }}
              />
            ) : (
              <div className="placeholder">Select a task to view details</div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
