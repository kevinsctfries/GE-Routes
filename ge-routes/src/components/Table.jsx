import { memo, useState, useMemo } from "react";
import { SKILL_ICONS } from "../utils/skillIcons";

import "./Table.css";

const INTENSITY_ORDER = { Low: 1, Moderate: 2, High: 3 };

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
          {eligibility.missing.length} missing
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

function SortableHeader({ label, colKey, sortKey, onSort }) {
  const active = sortKey === colKey;
  return (
    <th
      className={`sortable ${active ? "active" : ""}`}
      onClick={() => onSort(colKey)}>
      {label}
    </th>
  );
}

export default memo(function Table({ data, playerStats }) {
  const [sortKey, setSortKey] = useState("profit");
  const [sortDir, setSortDir] = useState("desc");

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir(d => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "profit" ? "desc" : "asc");
    }
  }

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "profit":
          cmp = (Number(a.profit) || 0) - (Number(b.profit) || 0);
          break;
        case "category":
          cmp = a.category.localeCompare(b.category);
          break;
        case "intensity":
          cmp =
            (INTENSITY_ORDER[a.intensity] || 0) -
            (INTENSITY_ORDER[b.intensity] || 0);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  const headerProps = { sortKey, sortDir, onSort: handleSort };

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <SortableHeader label="Name" colKey="name" {...headerProps} />
            <SortableHeader
              label="Profit/hr"
              colKey="profit"
              {...headerProps}
            />
            <th>Requirements</th>
            <SortableHeader
              label="Category"
              colKey="category"
              {...headerProps}
            />
            <SortableHeader
              label="Intensity"
              colKey="intensity"
              {...headerProps}
            />
          </tr>
        </thead>

        <tbody>
          {sorted.map((row, i) => (
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
