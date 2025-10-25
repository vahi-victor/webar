// server.js
import fs from 'fs';
import https from 'https';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup ES module paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ Serve files from root (index.html)
app.use(express.static(__dirname));

// ✅ Serve  model files (e.g., /assets/model.glb)
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/resources', express.static(path.join(__dirname, 'resources')));

// ✅ Serve  Target files (e.g., /targets/targets.mind)
app.use('/targets', express.static(path.join(__dirname, 'targets')));

// Load SSL certificates
const options = {
  key: fs.readFileSync('./certs/server.key'),
  cert: fs.readFileSync('./certs/server.cert'),
};

// Create HTTPS server
https.createServer(options, app)
  .listen(8080, () => {
    console.log('✅ HTTPS server running at https://localhost:8080');
  });
