import { useEffect, useState } from "react";
import Table from "./components/Table";

export default function App() {
  const [data, setData] = useState([]);
  const [minProfit, setMinProfit] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const res = await fetch("/data.json");
        const json = await res.json();

        setData(json);
      } catch (err) {
        console.error("Failed to load data.json:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const filtered = data
    .filter(x => {
      const profit = Number(x.profit) || 0;
      return profit >= minProfit;
    })
    .sort((a, b) => (Number(b.profit) || 0) - (Number(a.profit) || 0));

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>GE Routes</h1>

      {loading ? <p>Loading money makers...</p> : <Table data={filtered} />}
    </div>
  );
}
