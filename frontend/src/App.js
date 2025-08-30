import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:3001/api/logs/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError('Failed to connect to backend server');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    fetchStats();
  };

  if (loading) {
    return (
      <div className="App">
        <div className="container">
          <h1>WinWatch Dashboard</h1>
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <div className="container">
          <h1>WinWatch Dashboard</h1>
          <div className="error">
            <p>Error: {error}</p>
            <button onClick={handleRefresh}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="container">
        <header>
          <h1>WinWatch Dashboard</h1>
          <button onClick={handleRefresh} className="refresh-btn">
            Refresh
          </button>
        </header>

        <div className="stats-container">
          <div className="total-logs">
            <h2>Total Logs</h2>
            <div className="total-number">{stats?.total || 0}</div>
          </div>

          <div className="severity-breakdown">
            <h2>Severity Breakdown</h2>
            <div className="severity-grid">
              <div className="severity-item info">
                <span className="label">Info:</span>
                <span className="count">{stats?.severity?.info || 0}</span>
              </div>
              <div className="severity-item warning">
                <span className="label">Warning:</span>
                <span className="count">{stats?.severity?.warning || 0}</span>
              </div>
              <div className="severity-item error">
                <span className="label">Error:</span>
                <span className="count">{stats?.severity?.error || 0}</span>
              </div>
              <div className="severity-item critical">
                <span className="label">Critical:</span>
                <span className="count">{stats?.severity?.critical || 0}</span>
              </div>
              <div className="severity-item other">
                <span className="label">Other:</span>
                <span className="count">{stats?.severity?.other || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
