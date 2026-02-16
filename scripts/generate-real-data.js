const fs = require('fs');
const path = require('path');

const WORKSPACE = '/root/.openclaw/workspace';
const OUTPUT_DIR = path.join(__dirname, '../public');

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

async function generateRealData() {
  const memories = [];
  const stats = {
    totalMemories: 0,
    thisWeek: 0,
    activeRate: 0,
    sourceDistribution: { mem0: 0, supermemory: 0, file: 0, task: 0 },
    recentActivity: []
  };

  console.log('Generating real data from workspace...\n');

  // 1. Load mem0 from export
  console.log('1. Loading mem0 memories...');
  const mem0Cache = path.join(WORKSPACE, 'mem0-export.json');
  if (fs.existsSync(mem0Cache)) {
    const data = JSON.parse(fs.readFileSync(mem0Cache, 'utf-8'));
    data.forEach(m => {
      memories.push({
        id: m.id || generateId(),
        title: (m.content || '').substring(0, 60) + ((m.content || '').length > 60 ? '...' : ''),
        content: m.content || '',
        source: 'mem0',
        createdAt: m.created_at || new Date().toISOString(),
        tags: ['mem0', 'auto-captured']
      });
      stats.sourceDistribution.mem0++;
    });
    console.log(`   Found ${stats.sourceDistribution.mem0} mem0 memories`);
  }

  // 2. Load Supermemory from export
  console.log('2. Loading Supermemory entries...');
  const smCache = path.join(WORKSPACE, 'supermemory-export.json');
  if (fs.existsSync(smCache)) {
    const data = JSON.parse(fs.readFileSync(smCache, 'utf-8'));
    data.forEach(m => {
      memories.push({
        id: m.id || generateId(),
        title: (m.content || '').substring(0, 60) + ((m.content || '').length > 60 ? '...' : ''),
        content: m.content || '',
        source: 'supermemory',
        createdAt: new Date().toISOString(),
        tags: m.tags || ['supermemory', 'cloud-backup']
      });
      stats.sourceDistribution.supermemory++;
    });
    console.log(`   Found ${stats.sourceDistribution.supermemory} Supermemory entries`);
  }

  // 3. Load kanban tasks
  console.log('3. Loading kanban tasks...');
  const tasksFile = path.join(WORKSPACE, 'python-kanban/tasks.json');
  if (fs.existsSync(tasksFile)) {
    const tasks = JSON.parse(fs.readFileSync(tasksFile, 'utf-8'));
    tasks.forEach(task => {
      if (task.title && !task.title.includes('CANCELLED')) {
        memories.push({
          id: task.id?.toString() || generateId(),
          title: task.title,
          content: task.description || task.title,
          source: 'task',
          createdAt: new Date(task.createdAt || task.id || Date.now()).toISOString(),
          tags: [task.status || 'backlog', task.priority || 'medium', ...(task.tags || [])]
        });
        stats.sourceDistribution.task++;
      }
    });
    console.log(`   Found ${stats.sourceDistribution.task} tasks`);
  }

  // 4. Load daily memory files
  console.log('4. Loading daily memory files...');
  const memoryDir = path.join(WORKSPACE, 'memory');
  if (fs.existsSync(memoryDir)) {
    const files = fs.readdirSync(memoryDir).filter(f => f.match(/^\d{4}-\d{2}-\d{2}\.md$/));
    files.slice(-14).forEach(file => {
      const filePath = path.join(memoryDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const dateMatch = file.match(/(\d{4}-\d{2}-\d{2})/);
      const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];
      
      const sections = content.split(/^## /m).filter(s => s.trim());
      sections.forEach((section, idx) => {
        const lines = section.split('\n');
        const title = lines[0]?.trim() || `Entry ${idx + 1}`;
        if (title && title.length > 3) {
          memories.push({
            id: generateId(),
            title: title.substring(0, 80),
            content: section.substring(0, 500),
            source: 'file',
            createdAt: new Date(date).toISOString(),
            tags: ['daily-log', date]
          });
          stats.sourceDistribution.file++;
        }
      });
    });
    console.log(`   Found ${stats.sourceDistribution.file} file entries`);
  }

  // 5. Load MEMORY.md sections
  console.log('5. Loading MEMORY.md...');
  const memoryMd = path.join(WORKSPACE, 'MEMORY.md');
  if (fs.existsSync(memoryMd)) {
    const content = fs.readFileSync(memoryMd, 'utf-8');
    const sections = content.split(/^## /m).filter(s => s.trim());
    sections.forEach((section) => {
      const lines = section.split('\n');
      const title = lines[0]?.trim();
      if (title && title.length > 3) {
        memories.push({
          id: generateId(),
          title: title.substring(0, 80),
          content: section.substring(0, 500),
          source: 'file',
          createdAt: new Date().toISOString(),
          tags: ['memory-md', 'curated']
        });
        stats.sourceDistribution.file++;
      }
    });
  }

  // Calculate stats
  stats.totalMemories = memories.length;
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  stats.thisWeek = memories.filter(m => new Date(m.createdAt).getTime() > weekAgo).length;
  stats.activeRate = Math.round((stats.thisWeek / Math.max(stats.totalMemories, 1)) * 100);

  // Generate timeline
  const timeline = memories.map(m => ({
    id: m.id,
    type: m.source === 'task' ? 'task' : m.source === 'mem0' ? 'memory' : 'note',
    title: m.title,
    description: m.content.substring(0, 200),
    timestamp: m.createdAt,
    source: m.source,
    tags: m.tags
  }));

  // Sort
  memories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  timeline.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Write all files
  fs.writeFileSync(path.join(OUTPUT_DIR, 'memories.json'), JSON.stringify(memories, null, 2));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'timeline.json'), JSON.stringify(timeline, null, 2));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'stats.json'), JSON.stringify(stats, null, 2));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'mem0-data.json'), 
    JSON.stringify(memories.filter(m => m.source === 'mem0'), null, 2));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'supermemory-data.json'),
    JSON.stringify(memories.filter(m => m.source === 'supermemory'), null, 2));

  console.log(`\n✅ Generated ${memories.length} total memories`);
  console.log(`   mem0: ${stats.sourceDistribution.mem0}`);
  console.log(`   supermemory: ${stats.sourceDistribution.supermemory}`);
  console.log(`   files: ${stats.sourceDistribution.file}`);
  console.log(`   tasks: ${stats.sourceDistribution.task}`);
}

generateRealData().catch(console.error);
