import "./SkillPanel.css";

const SKILLS = [
  "Attack",
  "Strength",
  "Defence",
  "Ranged",
  "Prayer",
  "Magic",
  "Runecraft",
  "Construction",

  "Hitpoints",
  "Agility",
  "Herblore",
  "Thieving",
  "Crafting",
  "Fletching",
  "Slayer",
  "Hunter",

  "Mining",
  "Smithing",
  "Fishing",
  "Cooking",
  "Firemaking",
  "Woodcutting",
  "Farming",
  "Sailing",
];

export default function SkillPanel({ stats }) {
  return (
    <div className="skill-panel">
      <div className="overall-level">
        <img src="/icons/Stats_icon.png" alt="Overall" />
        <span>{stats.Overall}</span>
      </div>

      <div className="skills-grid">
        {SKILLS.map(skill => (
          <div key={skill} className="skill-cell" title={skill}>
            <img src={`/icons/${skill}_icon.png`} alt={skill} loading="lazy" />
            <span>{stats[skill] ?? "-"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
