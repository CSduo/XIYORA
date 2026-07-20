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
  const p = `C:/Users/ADMIN/.gemini/antigravity/brain/${id}/.system_generated/logs/transcript_full.jsonl`;
  if (fs.existsSync(p)) {
    const lines = fs.readFileSync(p, 'utf8').trim().split('\n');
    console.log('\n=========================================');
    console.log('ID:', id);
    console.log('Lines count:', lines.length);
    
    // Find the send_message call
    for (let i = lines.length - 1; i >= 0; i--) {
      try {
        const obj = JSON.parse(lines[i]);
        if (obj.tool_calls) {
          const sendMsgCall = obj.tool_calls.find(tc => tc.name === 'send_message');
          if (sendMsgCall) {
            console.log('--- Send Message Found in Tool Calls:');
            console.log(JSON.stringify(sendMsgCall.args, null, 2));
            break;
          }
        }
        if (obj.source === 'MODEL' && obj.content && obj.content.includes('Message sent to')) {
          // Keep searching backwards for the message being sent
          continue;
        }
      } catch (e) {
        console.error('Error parsing line', i, e.message);
      }
    }
  } else {
    console.log('=== ID:', id, 'NOT FOUND at', p);
  }
});
