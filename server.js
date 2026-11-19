// ⚠️ EXAMPLE ONLY:
// This code is for demonstration purposes and is not production-ready.

import express from 'express';
import aircallRoutes from './routes/aircall.js';
import callRoutes from './routes/calls.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Pretend a user is logged in. Replace this with your real authentication.
app.use((req, res, next) => {
  req.user = { id: 1, accountId: 1 };
  next();
});

app.use('/integrations/aircall', aircallRoutes);
app.use('/api/calls', callRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
