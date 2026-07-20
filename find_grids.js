const fs = require("fs");

const content = fs.readFileSync("C:/Users/ADMIN/.gemini/antigravity/scratch/XIYORA/artifacts/xiyora/src/App.tsx", "utf8");
const lines = content.split("\n");

lines.forEach((line, idx) => {
  if (line.includes("gridTemplateColumns") || line.includes("display:\"grid\"") || line.includes("display: \"grid\"")) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
