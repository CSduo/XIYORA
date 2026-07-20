import fs from 'fs';
import path from 'path';

const ids = [
  'dcbc79c7-e354-45e6-b1ea-4b34931f2b97',
  '7524c0d8-f664-4ac7-9f8f-c79ec5d469a1',
  '38065475-c7d0-4890-8bc6-aad070af13fa',
  '46bffa43-e7f6-4b0b-9581-5f207942ec2a',
  '989b16ed-506f-484f-8669-70e61cb69a48'
];

ids.forEach(id => {
  let found = false;
  for (const filename of ['transcript_full.jsonl', 'transcript.jsonl']) {
    const p = `C:/Users/ADMIN/.gemini/antigravity/brain/${id}/.system_generated/logs/${filename}`;
    if (fs.existsSync(p)) {
      const lines = fs.readFileSync(p, 'utf8').trim().split('\n');
      for (let i = lines.length - 1; i >= 0; i--) {
        try {
          const obj = JSON.parse(lines[i]);
          if (obj.tool_calls) {
            const sendMsgCall = obj.tool_calls.find(tc => tc.name === 'send_message');
            if (sendMsgCall && sendMsgCall.args && sendMsgCall.args.Message) {
              const outPath = `C:/Users/ADMIN/.gemini/antigravity/scratch/XIYORA/scripts/report_${id}.md`;
              fs.writeFileSync(outPath, sendMsgCall.args.Message, 'utf8');
              console.log(`Saved report for ${id} to ${outPath} (${filename})`);
              found = true;
              break;
            }
          }
          if (obj.source === 'MODEL' && obj.content && obj.content.length > 500) {
            const outPath = `C:/Users/ADMIN/.gemini/antigravity/scratch/XIYORA/scripts/report_${id}_model.md`;
            fs.writeFileSync(outPath, obj.content, 'utf8');
            console.log(`Saved model content for ${id} to ${outPath} (${filename})`);
            found = true;
            break;
          }
        } catch (e) {}
      }
    }
    if (found) break;
  }
});
