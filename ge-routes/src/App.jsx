import { useEffect, useState, useMemo } from "react";
import Table from "./components/Table";

import "./App.css";

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const res = await fetch("/data.json", { 
          cache: "force-cache" 
        });
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

  const filtered = useMemo(
    () => data
      .filter(x => {
        const profit = Number(x.profit) || 0;
        return profit >= 0;
      })
      .sort((a, b) => (Number(b.profit) || 0) - (Number(a.profit) || 0)),
    [data]
  );

  return (
    <div className="app-container">
      <header className="header">GE Routes</header>

      <main>
        {loading ? <p>Loading money makers...</p> : <Table data={filtered} />}
      </main>
    </div>
  );
}
