import { memo } from "react";
import { SKILL_ICONS } from "../utils/skillIcons";

import "./Table.css";

const Requirements = memo(function Requirements({ reqs }) {
  if (!reqs?.length) return <span className="req-empty">-</span>;

  return (
    <div className="req-container">
      {reqs.map((r, i) => (
        <div key={`${r.skill}-${i}`} className="req-item">
          <img src={SKILL_ICONS[r.skill]} alt={r.skill} className="req-icon" />
          <span className="req-text">
            {["Total", "Quests"].includes(r.skill)
              ? r.level
              : `${r.skill} ${r.level}`}
          </span>
        </div>
      ))}
    </div>
  );
});

export default memo(function Table({ data }) {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr className="table-head-row">
            <th>Name</th>
            <th>Profit/hr</th>
            <th>Requirements</th>
            <th>Category</th>
            <th>Intensity</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="table-row">
              <td>
                <a
                  href={row.url}
                  target="_blank"
                  rel="noreferrer"
                  className="table-link">
                  {row.name}
                </a>
              </td>

              <td className="table-profit">
                {Number(row.profit).toLocaleString()}
              </td>

              <td>
                <Requirements reqs={row.requirements} />
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
