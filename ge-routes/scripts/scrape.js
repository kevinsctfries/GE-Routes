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
      const skill = $(span).attr("data-skill");
      const level = $(span).attr("data-level");

      if (skill && level) {
        requirements.push({
          skill,
          level,
        });
      }
    });

    const reqRaw = reqCell.text().replace(/\s+/g, " ").trim();

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
