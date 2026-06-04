import { useState } from "react";
import { fetchPlayerStats } from "../utils/osrsApi";
import "./Filters.css";

function PlayerLookup({ playerStats, setPlayerStats }) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLookup = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const stats = await fetchPlayerStats(username);
      setPlayerStats(stats);
      setUsername("");
    } catch (err) {
      setError(err.message);
      setPlayerStats(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPlayerStats(null);
    setUsername("");
    setError(null);
  };

  return (
    <div className="player-lookup">
      <label>Player Lookup</label>

      {playerStats ? (
        <div className="player-info">
          <div className="player-status">
            <span className="badge badge-accent">✓ Loaded</span>
            <button onClick={handleClear} className="btn-ghost-error">
              Clear
            </button>
          </div>
          <div className="player-stats-preview">
            Overall: {playerStats.Overall}
          </div>
        </div>
      ) : (
        <form onSubmit={handleLookup} className="lookup-form">
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Enter username"
            disabled={loading}
          />
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !username.trim()}>
            {loading ? "Loading..." : "Lookup"}
          </button>
        </form>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default function Filters({
  minProfit,
  setMinProfit,
  category,
  setCategory,
  intensity,
  setIntensity,
  playerStats,
  setPlayerStats,
}) {
  return (
    <div className="filters">
      <PlayerLookup playerStats={playerStats} setPlayerStats={setPlayerStats} />

      <div className="filter-group">
        <label>Min GP/hr</label>
        <input
          type="number"
          value={minProfit}
          onChange={e => setMinProfit(e.target.value)}
          placeholder="No minimum"
        />
      </div>

      <div className="filter-group">
        <label>Category</label>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="all">All</option>
          <option value="Combat/High">Combat/High</option>
          <option value="Skilling">Skilling</option>
          <option value="Misc">Misc</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Intensity</label>
        <select value={intensity} onChange={e => setIntensity(e.target.value)}>
          <option value="all">All</option>
          <option value="Low">Low</option>
          <option value="Moderate">Moderate</option>
          <option value="High">High</option>
        </select>
      </div>
    </div>
  );
}
