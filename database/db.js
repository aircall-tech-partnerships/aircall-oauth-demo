// ⚠️ EXAMPLE ONLY:
// This code is for demonstration purposes and is not production-ready.

import { DatabaseSync } from 'node:sqlite';

const sqlite = new DatabaseSync(process.env.DATABASE_PATH || 'database/app.db');

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS integrations (
    user_id       TEXT PRIMARY KEY,
    provider      TEXT,
    access_token  TEXT,
    account_id    TEXT,
    status        TEXT,
    scope         TEXT,
    webhooks_data TEXT,
    installed_at  TEXT
  )
`);

const integrations = {
  // Saves the user's integration. If the user reinstalls, their row is replaced.
  async save(record) {
    sqlite
      .prepare('INSERT OR REPLACE INTO integrations VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(
        String(record.user_id),
        record.provider,
        record.access_token,
        String(record.account_id),
        record.status,
        record.scope,
        JSON.stringify(record.webhooksData ?? null),
        record.installed_at.toISOString(),
      );
  },

  // Returns the integration saved for this user.
  async findByUserId(userId) {
    return sqlite.prepare('SELECT * FROM integrations WHERE user_id = ?').get(String(userId));
  },
};

export default { integrations };
