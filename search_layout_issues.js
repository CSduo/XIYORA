const fs = require("fs");

const content = fs.readFileSync("C:/Users/ADMIN/.gemini/antigravity/scratch/XIYORA/artifacts/xiyora/src/App.tsx", "utf8");
const lines = content.split("\n");

// Look for fixed pixel widths like width: "1200px" or width: 1200
lines.forEach((line, idx) => {
  if (line.includes("width:") && /width\s*:\s*(["']\d+px["']|\d+)/i.test(line) && !line.includes("width: 100%") && !line.includes("width: 0") && !line.includes("width: 1") && !line.includes("width: 2") && !line.includes("width: 3") && !line.includes("width: 4") && !line.includes("width: 5") && !line.includes("width: 6") && !line.includes("width: 7") && !line.includes("width: 8") && !line.includes("width: 16") && !line.includes("width: 20") && !line.includes("width: 24") && !line.includes("width: 32") && !line.includes("width: 40")) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
