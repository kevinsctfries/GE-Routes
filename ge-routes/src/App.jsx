import { useEffect, useState, useMemo } from "react";
import Table from "./components/Table";
import Filters from "./components/Filters";

import "./App.css";

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [minProfit, setMinProfit] = useState("");
  const [category, setCategory] = useState("all");
  const [intensity, setIntensity] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const res = await fetch("/data.json", {
          cache: "force-cache",
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

  const filtered = data
    .filter(x => {
      const profit = Number(x.profit) || 0;
      const minProfitNum = minProfit ? Number(minProfit) : 0;

      if (profit < minProfitNum) return false;
      if (category !== "all" && x.category !== category) return false;
      if (intensity !== "all" && x.intensity !== intensity) return false;

      return true;
    })
    .sort((a, b) => (Number(b.profit) || 0) - (Number(a.profit) || 0));

  return (
    <div className="app-container">
      <header className="header">GE Routes</header>

      <main className="layout">
        <aside className="sidebar">
          <Filters
            minProfit={minProfit}
            setMinProfit={setMinProfit}
            category={category}
            setCategory={setCategory}
            intensity={intensity}
            setIntensity={setIntensity}
          />
        </aside>

        <section className="content">
          {loading ? <p>Loading...</p> : <Table data={filtered} />}
        </section>
      </main>
    </div>
  );
}
