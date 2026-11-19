# Aircall OAuth Demo

A minimal Express app that shows how to connect to Aircall with [OAuth](https://developer.aircall.io/docs/oauth) and then use the access token to [start an outbound call](https://developer.aircall.io/docs/outbound-calls).

> [!WARNING]
> **Example only. This is not a working app.**
>
> This is companion code for our YouTube tutorial on Aircall OAuth. It shows the shape of an integration, not a finished one, and is not production-ready. For example:
>
> - The logged-in user is faked (`req.user` is hard-coded in `server.js`). There is no real authentication.
> - The OAuth helpers in `setupService.js` (state check, webhooks, saving the token) are incomplete.
> - There is no error handling, input validation or security hardening beyond the basics.
>
> Use it to follow along with the video and as a reference for your own integration. Don't deploy it as is.

## Structure

```
server.js                             # Express server: mounts the routes and serves public/
routes/aircall.js                     # OAuth routes (install + callback)
routes/calls.js                       # Outbound call route
integrations/aircall/setupService.js  # OAuth helpers: verify state, get token, complete setup
integrations/aircall/callService.js   # Calls the Aircall API to start a call
database/db.js                        # SQLite database that stores each user's access token
public/index.html                     # Landing page
public/app.js                         # Client script
```

## Routes

| Method | Route | What it does |
|---|---|---|
| `GET` | `/` | Landing page |
| `GET` | `/api/health` | Health check, returns `{ "status": "ok" }` |
| `GET` | `/integrations/aircall/oauth/install` | **Install URI.** Aircall sends the Admin here when they install the app. Redirects to Aircall's authorize page. |
| `GET` | `/integrations/aircall/oauth/callback` | **Redirect URI.** Aircall sends the Admin back here with a `code`. Exchanges it for an access token and saves it. |
| `POST` | `/api/calls` | Starts an outbound call using the logged-in user's saved access token. |

### `POST /api/calls`

```bash
curl -X POST http://localhost:3000/api/calls \
  -H "Content-Type: application/json" \
  -d '{ "aircallUserId": 123, "numberId": 456, "to": "+18001231234" }'
```

| Field | Description |
|---|---|
| `aircallUserId` | ID of the Aircall user who places the call |
| `numberId` | ID of the Aircall number to call from (the user must be assigned to it) |
| `to` | Number to call, in E.164 format |

| Response | Meaning |
|---|---|
| `200` `{ "status": "call started" }` | Aircall started the call |
| `400` | A field is missing |
| `404` | No access token saved for this user. Install the app first. |
| Other | Aircall's own error (for example `405` if the user isn't available) |

> The app pretends a user is always logged in (`req.user` is set in `server.js`). Replace that with your real authentication.

## Setup

Requires Node.js 22.13 or later (the database uses Node's built-in SQLite).

1. Copy `.env.example` to `.env` and fill in your Aircall app's credentials:

   ```
   PORT=3000
   AIRCALL_CLIENT_ID=
   AIRCALL_CLIENT_SECRET=
   AIRCALL_REDIRECT_URI=http://localhost:3000/integrations/aircall/oauth/callback
   ```

2. Install and run:

   ```bash
   npm install
   npm run dev
   ```

3. Open http://localhost:3000.
