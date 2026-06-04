import { useEffect, useState, useMemo } from "react";
import Table from "./components/Table";
import Filters from "./components/Filters";
import { checkEligibility } from "./utils/osrsApi";

import "./App.css";

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
  }

  const [minProfit, setMinProfit] = useState("");
  const [category, setCategory] = useState("all");
  const [intensity, setIntensity] = useState("all");
  const [playerStats, setPlayerStats] = useState(null);
  const [hideIneligible, setHideIneligible] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/data.json", { cache: "force-cache" });
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

  const dataWithEligibility = useMemo(() => {
    return data.map(route => ({
      ...route,
      eligibility: checkEligibility(playerStats, route.requirements),
    }));
  }, [data, playerStats]);

  const filtered = dataWithEligibility
    .filter(x => {
      const profit = Number(x.profit) || 0;
      const minProfitNum = minProfit ? Number(minProfit) : 0;
      if (profit < minProfitNum) return false;
      if (category !== "all" && x.category !== category) return false;
      if (intensity !== "all" && x.intensity !== intensity) return false;
      if (hideIneligible && playerStats && !x.eligibility?.canDo) return false;
      return true;
    })
    .sort((a, b) => (Number(b.profit) || 0) - (Number(a.profit) || 0));

  return (
    <div className="app-container">
      <header className="header">
        <div>GE Routes</div>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme">
          {theme === "dark" ? "Dark" : "Light"}
        </button>
      </header>

      <main className="layout">
        <aside className="sidebar">
          <Filters
            minProfit={minProfit}
            setMinProfit={setMinProfit}
            category={category}
            setCategory={setCategory}
            intensity={intensity}
            setIntensity={setIntensity}
            playerStats={playerStats}
            setPlayerStats={setPlayerStats}
            hideIneligible={hideIneligible}
            setHideIneligible={setHideIneligible}
          />
        </aside>

        <section className="content">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table data={filtered} playerStats={playerStats} />
          )}
        </section>
      </main>
    </div>
  );
}
