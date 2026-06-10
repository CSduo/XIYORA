import fs from 'node:fs';
import path from 'node:path';

const xmlPath = 'C:\\Users\\ADMIN\\.gemini\\antigravity\\scratch\\XIYORA\\temp_brief\\word\\document.xml';
const outputPath = 'C:\\Users\\ADMIN\\.gemini\\antigravity\\scratch\\XIYORA\\brief.txt';

try {
  const xml = fs.readFileSync(xmlPath, 'utf8');
  
  // A simple docx XML parser:
  // - w:p represents a paragraph
  // - w:t represents text
  
  // We can split by paragraphs
  const paragraphs = xml.split(/<w:p\b[^>]*>/);
  const textLines = [];
  
  for (const p of paragraphs) {
    // Extract all text inside <w:t> tags in this paragraph
    const tMatches = p.matchAll(/<w:t\b[^>]*>(.*?)<\/w:t>/g);
    let pText = '';
    for (const match of tMatches) {
      // Decode basic XML entities
      let text = match[1]
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'");
      pText += text;
    }
    if (pText.trim()) {
      textLines.push(pText.trim());
    }
  }
  
  fs.writeFileSync(outputPath, textLines.join('\n\n'), 'utf8');
  console.log(`Parsed successfully. Total paragraphs: ${textLines.length}`);
} catch (err) {
  console.error('Error parsing document.xml:', err);
}
