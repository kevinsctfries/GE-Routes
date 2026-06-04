import "./SkillPanel.css";

const SKILL_ROWS = [
  ["Attack", "Hitpoints", "Mining"],
  ["Strength", "Agility", "Smithing"],
  ["Defence", "Herblore", "Fishing"],
  ["Ranged", "Thieving", "Cooking"],
  ["Prayer", "Crafting", "Firemaking"],
  ["Magic", "Fletching", "Woodcutting"],
  ["Runecraft", "Slayer", "Farming"],
  ["Construction", "Hunter", "Sailing"],
];

export default function SkillPanel({ stats }) {
  return (
    <div className="skill-panel">
      <div className="overall-level">
        <img src="/icons/Stats_icon.png" alt="Overall" />
        <span>{stats.Overall}</span>
      </div>

      <div className="skills-grid">
        {SKILL_ROWS.map((row, rowIndex) => (
          <div className="skill-row" key={rowIndex}>
            {row.map(skill => (
              <div key={skill} className="skill-cell" title={skill}>
                <img
                  src={`/icons/${skill}_icon.png`}
                  alt={skill}
                  loading="lazy"
                />
                <span>{stats[skill] ?? "-"}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
