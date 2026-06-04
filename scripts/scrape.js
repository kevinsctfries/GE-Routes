// scrapes table data from the wiki page

import fs from "fs";
import * as cheerio from "cheerio";

const WIKI_BASE = "https://oldschool.runescape.wiki";

async function scrape() {
  const res = await fetch(`${WIKI_BASE}/w/Money_making_guide`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const data = [];

  $("table.wikitable tbody tr").each((_, row) => {
    const cells = $(row).find("td");
    if (cells.length === 0) return;

    const nameCell = $(cells[0]);
    const name = nameCell.text().trim();
    const href = nameCell.find("a").first().attr("href");
    const url = href ? `${WIKI_BASE}${href}` : null;

    const profit = $(cells[1]).text().trim().replace(/,/g, "");

    const reqCell = $(cells[2]);
    const requirements = [];

    reqCell.find("span.scp").each((_, span) => {
      let skill = $(span).attr("data-skill");
      let level = $(span).attr("data-level");
      const spanText = $(span).text().trim();

      // Normalize skill names to match icon keys
      if (skill === "Combat level") {
        skill = "Combat";
      } else if (skill === "Skills") {
        skill = "Total";
      } else if (skill === "Quest points") {
        skill = "Quests";
      }

      if (level) {
        level = level.replace(/\[\[(.+?)\]\]/g, "$1").trim();
      }

      if (!skill && spanText.includes("Combat")) {
        skill = "Combat";
        const match = spanText.match(/(\d+\+?)/);
        if (match) {
          level = match[1];
        }
      }

      if (skill && level) {
        requirements.push({
          skill,
          level,
        });
      }
    });

    const reqRaw = reqCell
      .text()
      .replace(/\s+/g, " ")
      .replace(/([a-z])or\s/gi, "$1 or ")
      .replace(/([a-z])and\s/gi, "$1 and ")
      .trim();

    const category = $(cells[3]).text().trim();

    const intensity = $(cells[4]).text().trim();

    const members = $(cells[5]).text().trim();

    if (!name) return;

    data.push({
      name,
      url,
      profit: Number(profit),
      requirements,
      requirementsRaw: reqRaw,
      category,
      intensity,
      members,
    });
  });

  fs.writeFileSync("public/data.json", JSON.stringify(data, null, 2));
  console.log(`Scraped ${data.length} entries → public/data.json`);
}

scrape().catch(console.error);
