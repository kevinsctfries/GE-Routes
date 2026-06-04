const HISCORES_API_DEV = "/api/hiscores";
const HISCORES_API_PROD =
  "https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws";

const SKILL_NAMES = [
  "Overall",
  "Attack",
  "Defence",
  "Strength",
  "Hitpoints",
  "Ranged",
  "Prayer",
  "Magic",
  "Cooking",
  "Woodcutting",
  "Fletching",
  "Fishing",
  "Firemaking",
  "Crafting",
  "Smithing",
  "Mining",
  "Herblore",
  "Agility",
  "Thieving",
  "Slayer",
  "Farming",
  "Runecraft",
  "Hunter",
  "Construction",
  "Sailing",
];

/**
 * @param {string} username - player username
 * @returns {Promise<Object>} - object with skill names as keys and levels as values
 */
export async function fetchPlayerStats(username) {
  if (!username || username.trim().length === 0) {
    throw new Error("Username cannot be empty");
  }

  try {
    const apiUrl = import.meta.env.DEV ? HISCORES_API_DEV : HISCORES_API_PROD;
    const endpoint =
      apiUrl === HISCORES_API_DEV
        ? `${apiUrl}?player=${encodeURIComponent(username)}`
        : `${apiUrl}?player=${encodeURIComponent(username)}`;

    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const text = await response.text();

    if (text.trim().length === 0) {
      throw new Error(`Player "${username}" not found on Hiscores`);
    }

    return parseHiscoresData(text);
  } catch (err) {
    if (err instanceof TypeError) {
      throw new Error(
        "Network error - unable to reach Hiscores API. Check your connection.",
        { cause: err },
      );
    }
    throw err;
  }
}

/**
 * Parse CSV-like Hiscores response into skill levels
 * Format: rank,level,experience (one per line)
 * @param {string} csvData - Raw CSV response from Hiscores
 * @returns {Object} - { skillName: level, ... }
 */
function parseHiscoresData(csvData) {
  const lines = csvData.trim().split("\n");

  if (lines.length < SKILL_NAMES.length) {
    throw new Error("Invalid Hiscores data received");
  }

  const stats = {};

  SKILL_NAMES.forEach((skillName, index) => {
    const parts = lines[index].split(",");
    const level = parseInt(parts[1], 10);

    if (!isNaN(level)) {
      stats[skillName] = level;
    }
  });

  if (Object.keys(stats).length === 0) {
    throw new Error("Could not parse player stats");
  }

  return stats;
}

/**
 * Parse requirement level string to numeric minimum
 * Handles: "75+", "75", "recommended", "1", etc.
 * @param {string} levelStr - Requirement level string (e.g., "75+", "recommended")
 * @returns {number|null} - Minimum level required, or null if optional
 */
export function parseRequirementLevel(levelStr) {
  if (!levelStr || typeof levelStr !== "string") {
    return null;
  }

  const clean = levelStr.trim().toLowerCase();

  // Handle optional/recommended requirements
  if (clean === "recommended" || clean === "optional") {
    return null;
  }

  // Extract numeric part (handles "75+", "75", "75 recommended", etc.)
  const match = clean.match(/(\d+)/);
  if (match) {
    return parseInt(match[1], 10);
  }

  return null;
}

/**
 * Check if player can do a money maker based on their stats
 * @param {Object} playerStats - Player skill levels { skillName: level }
 * @param {Array} requirements - Money maker requirements [{ skill, level }]
 * @returns {Object} - { canDo: bool, missing: [{ skill, required, actual }] }
 */
export function checkEligibility(playerStats, requirements) {
  if (!playerStats || !requirements || requirements.length === 0) {
    return { canDo: true, missing: [] };
  }

  const missing = [];

  requirements.forEach(req => {
    const requiredLevel = parseRequirementLevel(req.level);

    if (requiredLevel === null) {
      return;
    }

    const playerLevel = playerStats[req.skill] || 0;

    if (playerLevel < requiredLevel) {
      missing.push({
        skill: req.skill,
        required: requiredLevel,
        actual: playerLevel,
        deficit: requiredLevel - playerLevel,
      });
    }
  });

  return {
    canDo: missing.length === 0,
    missing,
  };
}
