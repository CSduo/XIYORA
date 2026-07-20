import fs from 'fs';

const id = '7524c0d8-f664-4ac7-9f8f-c79ec5d469a1';
const paths = [
  `C:/Users/ADMIN/.gemini/antigravity/brain/${id}/.system_generated/logs/transcript_full.jsonl`,
  `C:/Users/ADMIN/.gemini/antigravity/brain/${id}/.system_generated/logs/transcript.jsonl`
];

for (const p of paths) {
  if (fs.existsSync(p)) {
    console.log('Reading path:', p);
    const lines = fs.readFileSync(p, 'utf8').trim().split('\n');
    
    // Look for tool calls to send_message
    for (let i = lines.length - 1; i >= 0; i--) {
      try {
        const obj = JSON.parse(lines[i]);
        if (obj.tool_calls) {
          const call = obj.tool_calls.find(c => c.name === 'send_message');
          if (call && call.args && call.args.Message) {
            fs.writeFileSync(`C:/Users/ADMIN/.gemini/antigravity/scratch/XIYORA/scripts/db_report_extracted.md`, call.args.Message, 'utf8');
            console.log('Extracted and saved db_report_extracted.md!');
            process.exit(0);
          }
        }
      } catch (e) {
        console.error('Line error:', e);
      }
    }
  }
}
console.log('No send_message found.');
