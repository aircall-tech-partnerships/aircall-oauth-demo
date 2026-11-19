// ⚠️ EXAMPLE ONLY:
// This code is for demonstration purposes and is not production-ready.

const db = require('db'); // 👈 Replace this with your DB library

// Verify state helper
const verifyState = (state) => { }

// Create webhooks helper (See our webhooks tutorials)
const createWebhooks = (accessToken) => { }

// Retrieve access token
const retrieveAccessToken = async (code) => { }

// Complete setup 
const completeSetup = async (user, accessToken) => { 

   // Create webhooks so you are notified of Aircall events 
   const aircallWebhooks = await createWebhooks(accessToken);

   // Store integration related data in DB
   await db.integrations.save({ 
      provider:     'aircall', 
      access_token: accessToken, 
      user_id:      user.id, 
      account_id:   user.accountId, 
      status:       'active', 
      scope:        'public_api', 
      webhooksData:  aircallWebhooks, 
      installed_at: new Date(), 
   }); 
};  

// Exports
module.exports = { retrieveAccessToken, completeSetup, verifyState };