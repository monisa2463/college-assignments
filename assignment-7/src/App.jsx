import React, { useState, useEffect } from 'react';
import './App.css';

// Simulated JWT helper functions
const createSimulatedJWT = (user) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      username: user.username,
      role: 'Farm Administrator',
      exp: Date.now() + 24 * 60 * 60 * 1000,
    })
  );
  const signature = btoa('farm-secret-key-signature-hash');
  return `${header}.${payload}.${signature}`;
};

const parseSimulatedJWT = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  } catch (err) {
    return null;
  }
};

const evaluatePasswordStrength = (pass) => {
  if (!pass) return { score: 0, label: '', color: '#e2e8f0' };
  let score = 0;
  if (pass.length >= 6) score += 1;
  if (pass.length >= 10) score += 1;
  if (/[0-9]/.test(pass)) score += 1;
  if (/[A-Z]/.test(pass)) score += 1;
  if (/[^A-Za-z0-9]/.test(pass)) score += 1;

  if (score <= 2) return { score: 1, label: 'Weak', color: '#ef4444' };
  if (score <= 4) return { score: 2, label: 'Moderate', color: '#f59e0b' };
  return { score: 3, label: 'Strong', color: '#16a34a' };
};

const INITIAL_FARM_DATA = [
  { id: 'EMP-001', name: 'Ramesh Patel', dept: 'Crop Management', status: 'Active' },
  { id: 'EMP-002', name: 'Sunita Sharma', dept: 'Dairy Operations', status: 'Active' },
  { id: 'EMP-003', name: 'Vikram Singh', dept: 'Equipment & Machinery', status: 'On Leave' },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Validation & error states
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');

  // Check persisted sessions on initial render
  useEffect(() => {
    const storedToken =
      localStorage.getItem('farm_auth_token') || sessionStorage.getItem('farm_auth_token');

    if (storedToken) {
      const decoded = parseSimulatedJWT(storedToken);
      if (decoded && decoded.exp > Date.now()) {
        setUser(decoded);
        setToken(storedToken);
      } else {
        handleLogout();
      }
    }
  }, []);

  const validateForm = () => {
    const errs = {};
    if (!username.trim()) {
      errs.username = 'Username is required.';
    }
    if (!password) {
      errs.password = 'Password is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');

    if (!validateForm()) return;

    // Simulated credential check
    const jwt = createSimulatedJWT({ username });
    const decoded = parseSimulatedJWT(jwt);

    if (rememberMe) {
      localStorage.setItem('farm_auth_token', jwt);
    } else {
      sessionStorage.setItem('farm_auth_token', jwt);
    }

    setToken(jwt);
    setUser(decoded);
    setUsername('');
    setPassword('');
    setErrors({});
  };

  const handleLogout = () => {
    localStorage.removeItem('farm_auth_token');
    sessionStorage.removeItem('farm_auth_token');
    setUser(null);
    setToken(null);
    setAuthError('');
    setErrors({});
  };

  const strength = evaluatePasswordStrength(password);

  return (
    <div className="auth-app">
      {!user ? (
        /* Login Screen */
        <div className="auth-card">
          <div className="auth-header">
            <h2>Farm Management Portal</h2>
            <p>Enter your credentials to access the directory dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="auth-form" noValidate>
            {authError && <div className="error-banner">{authError}</div>}

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={errors.username ? 'input-error' : ''}
              />
              {errors.username && <span className="field-error">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? 'input-error' : ''}
              />
              {errors.password && <span className="field-error">{errors.password}</span>}

              {/* Password Strength Indicator */}
              {password && (
                <div className="strength-meter-container">
                  <div className="strength-bars">
                    <div
                      className="bar"
                      style={{ backgroundColor: strength.score >= 1 ? strength.color : '#e2e8f0' }}
                    />
                    <div
                      className="bar"
                      style={{ backgroundColor: strength.score >= 2 ? strength.color : '#e2e8f0' }}
                    />
                    <div
                      className="bar"
                      style={{ backgroundColor: strength.score >= 3 ? strength.color : '#e2e8f0' }}
                    />
                  </div>
                  <span className="strength-label" style={{ color: strength.color }}>
                    Strength: {strength.label}
                  </span>
                </div>
              )}
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember User</span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Log In
            </button>
          </form>
        </div>
      ) : (
        /* Protected Dashboard */
        <div className="dashboard-container">
          <header className="dashboard-header">
            <div>
              <h2>Farm Employee Dashboard</h2>
              <p className="welcome-text">
                Welcome back, <strong>{user.username}</strong> ({user.role})
              </p>
            </div>
            <button onClick={handleLogout} className="btn btn-logout">
              Log Out
            </button>
          </header>

          <section className="jwt-viewer-card">
            <h3>Simulated Active JWT Token</h3>
            <div className="jwt-token-display">{token}</div>
            <p className="jwt-note">
              Stored in: {localStorage.getItem('farm_auth_token') ? 'localStorage (Remembered)' : 'sessionStorage'}
            </p>
          </section>

          <section className="dashboard-content card">
            <h3>Directory Summary</h3>
            <div className="table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {INITIAL_FARM_DATA.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.name}</td>
                      <td>{row.dept}</td>
                      <td>
                        <span className={`status-badge ${row.status.toLowerCase().replace(/\s+/g, '-')}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}