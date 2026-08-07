const fs = require('fs');

const appContent = fs.readFileSync('C:/Users/ADMIN/.gemini/antigravity/scratch/XIYORA/artifacts/xiyora/src/App.tsx', 'utf8');
const appLines = appContent.split('\n');

const findings = [];

appLines.forEach((line, index) => {
  const lineNum = index + 1;
  const t = line.trim();

  // Search for btn-ivory
  if (t.includes('btn-ivory')) {
    findings.push({ line: lineNum, type: 'btn-ivory', code: t });
  }

  // Search for low contrast form labels/inputs (e.g., color: "#666", color: "#888", color: "#aaa", color: "rgba(255,255,255,0.65)")
  if (t.includes('color:"#666"') || t.includes('color:"#888"') || t.includes('color:"#aaa"') || t.includes('color:"rgba(245,242,237,0.35)"') || t.includes('color:"rgba(255,255,255,0.4)"') || t.includes('color:"rgba(245,238,240,0.35)"')) {
    findings.push({ line: lineNum, type: 'low_contrast_inline_text', code: t });
  }

  // Search for gold-grad or sec-label usage
  if (t.includes('className="gold-grad"') || t.includes('className="sl"') || t.includes('className="sec-label"') || t.includes('className="gold-italic"')) {
    findings.push({ line: lineNum, type: 'styled_label_or_gradient', code: t });
  }

  // Search for tag/badge elements
  if (t.includes('badge') || t.includes('tag') || t.includes('stat-badge')) {
    if (t.includes('color:') || t.includes('background:') || t.includes('className=')) {
      findings.push({ line: lineNum, type: 'badge_or_tag', code: t });
    }
  }
});

console.log('App.tsx Findings Count:', findings.length);
fs.writeFileSync('C:/Users/ADMIN/.gemini/antigravity/scratch/XIYORA/artifacts/xiyora/.agents/teamwork_preview_explorer_survey_1/app_findings.json', JSON.stringify(findings, null, 2));
