// ⚠️ EXAMPLE ONLY: 
// This code is for demonstration purposes and is not production-ready.

import { Router } from 'express';
import db from '../database/db.js';
import { startOutboundCall } from '../integrations/aircall/callService.js';

const router = Router();

// POST /api/calls  { "aircallUserId": 123, "numberId": 456, "to": "+18001231234" }
router.post('/', async (req, res) => {
  const { aircallUserId, numberId, to } = req.body;

  if (!aircallUserId || !numberId || !to) {
    return res.status(400).json({ error: 'aircallUserId, numberId and to are required' });
  }

  const integration = await db.integrations.findByUserId(req.user.id);
  if (!integration) {
    return res.status(404).json({ error: 'No Aircall integration found. Install the app first.' });
  }

  try {
    await startOutboundCall(integration.access_token, aircallUserId, numberId, to);
    res.json({ status: 'call started' });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message, details: error.details });
  }
});

export default router;
