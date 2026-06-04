import "./Filters.css";

export default function Filters({
  minProfit,
  setMinProfit,
  category,
  setCategory,
  intensity,
  setIntensity,
}) {
  return (
    <div className="filters">
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
