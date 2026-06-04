import { useState } from "react";
import { fetchPlayerStats } from "../utils/osrsApi";
import SkillPanel from "./SkillPanel";

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
    } catch (err) {
      setError(err.message);
      setPlayerStats(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="player-lookup">
      <label>Player Lookup</label>

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

      {playerStats && (
        <div className="player-info">
          <SkillPanel stats={playerStats} />
        </div>
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
  hideIneligible,
  setHideIneligible,
}) {
  return (
    <div className="filters">
      <PlayerLookup playerStats={playerStats} setPlayerStats={setPlayerStats} />

      {playerStats && (
        <div className="filter-group filter-group--row">
          <label htmlFor="hide-ineligible">Hide ineligible</label>
          <input
            id="hide-ineligible"
            type="checkbox"
            checked={hideIneligible}
            onChange={e => setHideIneligible(e.target.checked)}
          />
        </div>
      )}

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
