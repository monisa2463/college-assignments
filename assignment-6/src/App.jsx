import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
  useParams,
  useNavigate
} from 'react-router-dom';
import './App.css';

const initialTasks = [
  {
    id: '1',
    description: 'Finalize quarterly financial audit report',
    priority: 'High',
    category: 'Finance',
    dueDate: '2026-08-28',
    status: 'Pending'
  },
  {
    id: '2',
    description: 'Refactor authentication state to use context',
    priority: 'Medium',
    category: 'Engineering',
    dueDate: '2026-08-30',
    status: 'Pending'
  },
  {
    id: '3',
    description: 'Conduct security vulnerability scan',
    priority: 'High',
    category: 'Security',
    dueDate: '2026-08-25',
    status: 'Completed'
  }
];

// ---------------- Protected Route Component ----------------
function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

// ---------------- Page: Dashboard ----------------
function Dashboard({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const pending = total - completed;
  const highPriority = tasks.filter(
    (t) => t.priority === 'High' && t.status !== 'Completed'
  ).length;

  return (
    <div className="page-content">
      <h2>System Dashboard</h2>
      <div className="metrics-row">
        <div className="card stat-widget">
          <span className="stat-num">{total}</span>
          <span className="stat-desc">Total Tasks</span>
        </div>
        <div className="card stat-widget">
          <span className="stat-num pending-num">{pending}</span>
          <span className="stat-desc">Pending</span>
        </div>
        <div className="card stat-widget">
          <span className="stat-num completed-num">{completed}</span>
          <span className="stat-desc">Completed</span>
        </div>
        <div className="card stat-widget">
          <span className="stat-num danger-num">{highPriority}</span>
          <span className="stat-desc">Urgent / High</span>
        </div>
      </div>
    </div>
  );
}

// ---------------- Page: Tasks List ----------------
function TasksPage({ tasks, onToggleStatus, onDeleteTask }) {
  const [filterCat, setFilterCat] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const navigate = useNavigate();

  const filtered = tasks.filter((task) => {
    const matchesCat = filterCat === 'All' || task.category === filterCat;
    const matchesPri = filterPriority === 'All' || task.priority === filterPriority;
    return matchesCat && matchesPri;
  });

  return (
    <div className="page-content">
      <div className="page-header-row">
        <h2>Task Directory</h2>
        <div className="filter-controls">
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Finance">Finance</option>
            <option value="Engineering">Engineering</option>
            <option value="Security">Security</option>
            <option value="Operations">Operations</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      <div className="task-list">
        {filtered.length === 0 ? (
          <p className="no-records">No tasks found matching the criteria.</p>
        ) : (
          filtered.map((task) => (
            <div key={task.id} className="card task-item">
              <div className="task-main">
                <span className={`badge priority-${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>
                <span className="badge category-badge">{task.category}</span>
                <h4
                  className={task.status === 'Completed' ? 'line-through' : ''}
                  onClick={() => navigate(`/tasks/${task.id}`)}
                >
                  {task.description}
                </h4>
                <div className="task-meta">
                  <span>Due: {task.dueDate}</span>
                  <span>•</span>
                  <span
                    className={
                      task.status === 'Completed' ? 'status-done' : 'status-wait'
                    }
                  >
                    {task.status}
                  </span>
                </div>
              </div>

              <div className="action-buttons">
                <button
                  className="btn btn-sm btn-status"
                  onClick={() => onToggleStatus(task.id)}
                >
                  {task.status === 'Completed' ? 'Reopen' : 'Complete'}
                </button>
                <button
                  className="btn btn-sm btn-view"
                  onClick={() => navigate(`/tasks/${task.id}`)}
                >
                  Details
                </button>
                <button
                  className="btn btn-sm btn-delete"
                  onClick={() => onDeleteTask(task.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ---------------- Page: Add Task (Protected) ----------------
function AddTaskPage({ onAddTask }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: '',
    priority: 'Medium',
    category: 'Engineering',
    dueDate: '2026-08-28'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description.trim()) return;

    onAddTask({
      ...formData,
      id: Date.now().toString(),
      status: 'Pending'
    });
    navigate('/tasks');
  };

  return (
    <div className="page-content">
      <h2>Create New Task</h2>
      <div className="card form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task Description</label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="e.g., Update security headers on staging environment"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="Finance">Finance</option>
                <option value="Engineering">Engineering</option>
                <option value="Security">Security</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Save Task
          </button>
        </form>
      </div>
    </div>
  );
}

// ---------------- Page: Task Details (URL Params) ----------------
function TaskDetailsPage({ tasks, onToggleStatus }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return (
      <div className="page-content card">
        <h3>Task not found</h3>
        <p>The specified resource with ID #{id} does not exist.</p>
        <button className="btn btn-primary" onClick={() => navigate('/tasks')}>
          Return to Tasks
        </button>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="card details-container">
        <div className="details-header">
          <h2>Task #{task.id}</h2>
          <span className={`badge priority-${task.priority.toLowerCase()}`}>
            {task.priority} Priority
          </span>
        </div>

        <p className="details-desc">{task.description}</p>

        <div className="meta-grid">
          <div>
            <strong>Category:</strong> {task.category}
          </div>
          <div>
            <strong>Due Date:</strong> {task.dueDate}
          </div>
          <div>
            <strong>Current Status:</strong> {task.status}
          </div>
        </div>

        <div className="action-buttons-details">
          <button
            className="btn btn-status"
            onClick={() => onToggleStatus(task.id)}
          >
            Mark as {task.status === 'Completed' ? 'Pending' : 'Completed'}
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/tasks')}>
            Back to Directory
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------- Page: Completed Tasks ----------------
function CompletedTasksPage({ tasks, onToggleStatus }) {
  const completed = tasks.filter((t) => t.status === 'Completed');

  return (
    <div className="page-content">
      <h2>Completed Tasks Log</h2>
      <div className="task-list">
        {completed.length === 0 ? (
          <p className="no-records">No completed tasks on record.</p>
        ) : (
          completed.map((task) => (
            <div key={task.id} className="card task-item">
              <div className="task-main">
                <span className="badge category-badge">{task.category}</span>
                <h4 className="line-through">{task.description}</h4>
                <div className="task-meta">
                  <span>Completed (Due was: {task.dueDate})</span>
                </div>
              </div>
              <button
                className="btn btn-sm btn-status"
                onClick={() => onToggleStatus(task.id)}
              >
                Reopen
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ---------------- Root App Component ----------------
export default function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const handleAddTask = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggleStatus = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' }
          : t
      )
    );
  };

  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <Router>
      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-brand">TaskFlow Router</div>
          <nav className="nav-links">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
              end
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/tasks"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
              end
            >
              All Tasks
            </NavLink>
            <NavLink
              to="/add-task"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
            >
              Add Task {isAuthenticated ? '' : '🔒'}
            </NavLink>
            <NavLink
              to="/completed"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
            >
              Completed
            </NavLink>
          </nav>

          <div className="auth-panel">
            <span>Status: {isAuthenticated ? 'Admin' : 'Guest'}</span>
            <button
              className="btn btn-auth"
              onClick={() => setIsAuthenticated(!isAuthenticated)}
            >
              {isAuthenticated ? 'Lock (Logout)' : 'Unlock (Login)'}
            </button>
          </div>
        </aside>

        <main className="viewport">
          <Routes>
            <Route path="/" element={<Dashboard tasks={tasks} />} />
            <Route
              path="/tasks"
              element={
                <TasksPage
                  tasks={tasks}
                  onToggleStatus={handleToggleStatus}
                  onDeleteTask={handleDeleteTask}
                />
              }
            />
            <Route
              path="/tasks/:id"
              element={
                <TaskDetailsPage
                  tasks={tasks}
                  onToggleStatus={handleToggleStatus}
                />
              }
            />
            <Route
              path="/completed"
              element={
                <CompletedTasksPage
                  tasks={tasks}
                  onToggleStatus={handleToggleStatus}
                />
              }
            />
            <Route
              path="/add-task"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <AddTaskPage onAddTask={handleAddTask} />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}