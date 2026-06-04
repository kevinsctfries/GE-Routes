import { memo, useState } from "react";
import { SKILL_ICONS } from "../utils/skillIcons";

import "./Table.css";

const Requirements = memo(function Requirements({
  reqs,
  eligibility,
  playerStats,
}) {
  const [showMissing, setShowMissing] = useState(false);

  if (!reqs?.length) return <span className="req-empty">-</span>;

  return (
    <div className="req-wrapper">
      <div className="req-container">
        {reqs.map((r, i) => (
          <div key={`${r.skill}-${i}`} className="req-item">
            <img
              src={SKILL_ICONS[r.skill]}
              alt={r.skill}
              className="req-icon"
            />
            <span className="req-text">
              {["Total", "Quests"].includes(r.skill)
                ? r.level
                : `${r.skill} ${r.level}`}
            </span>
          </div>
        ))}
      </div>

      {playerStats && eligibility?.missing?.length > 0 && (
        <button
          className="badge badge-error"
          onClick={() => setShowMissing(!showMissing)}
          title="Show missing requirements">
          ⓘ {eligibility.missing.length} missing
        </button>
      )}

      {showMissing && eligibility?.missing && (
        <div className="missing-requirements">
          <strong>Missing:</strong>
          {eligibility.missing.map((m, i) => (
            <div key={i} className="missing-item">
              <span className="missing-skill">{m.skill}</span>
              <span className="missing-levels">
                {m.actual} / {m.required}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default memo(function Table({ data, playerStats }) {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Profit/hr</th>
            <th>Requirements</th>
            <th>Category</th>
            <th>Intensity</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className={
                playerStats && !row.eligibility?.canDo ? "ineligible" : ""
              }>
              <td>
                <a href={row.url} target="_blank" rel="noreferrer">
                  {row.name}
                </a>
              </td>

              <td className="table-profit">
                {Number(row.profit).toLocaleString()}
              </td>

              <td>
                <Requirements
                  reqs={row.requirements}
                  eligibility={row.eligibility}
                  playerStats={playerStats}
                />
              </td>

              <td>{row.category}</td>
              <td>{row.intensity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
