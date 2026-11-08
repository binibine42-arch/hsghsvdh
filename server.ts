import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Support image and PDF uploads in JSON payloads
  app.use(express.json({ limit: '50mb' }));

  const DATA_DIR = path.join(__dirname, 'data');
  const DATA_FILE = path.join(DATA_DIR, 'portfolio-data.json');

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // GET /api/portfolio - delivers the real-time server-persisted data to all visitors
  app.get('/api/portfolio', (req, res) => {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const content = fs.readFileSync(DATA_FILE, 'utf-8');
        return res.json(JSON.parse(content));
      }
    } catch (err) {
      console.error('Failed to read server portfolio data:', err);
    }
    return res.status(404).json({ error: 'Portfolio data not found' });
  });

  // POST /api/portfolio - saves changes made by admin directly to the server
  app.post('/api/portfolio', (req, res) => {
    try {
      const data = req.body;
      if (!data || !data.profile) {
        return res.status(400).json({ error: 'Invalid portfolio data payload' });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
      return res.json({ success: true, timestamp: Date.now() });
    } catch (err) {
      console.error('Failed to write server portfolio data:', err);
      return res.status(500).json({ error: 'Failed to save portfolio data' });
    }
  });

  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
