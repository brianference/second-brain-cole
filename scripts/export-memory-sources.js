const fs = require('fs');
const path = require('path');

// We'll create these from the generate-real-data script output + add source-specific views

async function exportMemorySources() {
  // Read existing memories
  const memoriesPath = path.join(__dirname, '../public/memories.json');
  let memories = [];
  
  try {
    memories = JSON.parse(fs.readFileSync(memoriesPath, 'utf-8'));
  } catch (e) {
    console.error('Could not read memories.json');
    return;
  }

  // Filter by source
  const mem0Memories = memories.filter(m => m.source === 'mem0');
  const supermemoryMemories = memories.filter(m => m.source === 'supermemory');
  const fileMemories = memories.filter(m => m.source === 'file');
  const taskMemories = memories.filter(m => m.source === 'task');

  // Write source-specific files
  fs.writeFileSync(
    path.join(__dirname, '../public/mem0-data.json'),
    JSON.stringify(mem0Memories, null, 2)
  );
  
  fs.writeFileSync(
    path.join(__dirname, '../public/supermemory-data.json'),
    JSON.stringify(supermemoryMemories, null, 2)
  );

  console.log(`Exported:`);
  console.log(`  mem0: ${mem0Memories.length} memories`);
  console.log(`  supermemory: ${supermemoryMemories.length} memories`);
  console.log(`  files: ${fileMemories.length} memories`);
  console.log(`  tasks: ${taskMemories.length} memories`);
}

exportMemorySources();
