// ⚠️ EXAMPLE ONLY:
// This code is for demonstration purposes and is not production-ready.

import { Router } from 'express';

const router = Router();

// Install URI: Aircall sends the Admin here when they install the app.
router.get('/oauth/install', (req, res) => {
  const params = new URLSearchParams({ 
      client_id:     process.env.AIRCALL_CLIENT_ID, 
      redirect_uri:  process.env.AIRCALL_REDIRECT_URI, 
      response_type: 'code', 
      scope:         'public_api', 
      state:         generateSecureState() 
   });  

   res.redirect(`https://dashboard.aircall.io/oauth/authorize?${params}`); 
});






// Redirect URI: Aircall sends the Admin back here after they approve the app.
router.get('/oauth/callback', async (req, res) => {
  const { code, state } = req.query;  
   
   if (!verifyState(state)) return res.status(403).send('Invalid state');  

   // 👋 Exchange code for access_token. 
   const accessToken = await retrieveAccessToken(code);  

   await completeSetup(req.user, accessToken);  

   // Redirect to our success URL or you can also redirect to your own URL
   res.redirect('https://dashboard.aircall.io/oauth/success'); 
});











const retrieveAccessToken = async (code) => {
   try {
      const response = await fetch('https://api.aircall.io/v1/oauth/token', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            code,
            redirect_uri:  process.env.AIRCALL_REDIRECT_URI,
            client_id:     process.env.AIRCALL_CLIENT_ID,
            client_secret: process.env.AIRCALL_CLIENT_SECRET,
            grant_type:    'authorization_code'
         })
      });

      const data = await response.json();

      if (!response.ok) {
         throw new Error(data.message || 'Failed to retrieve access token');
      }

      return data.access_token;
   } catch (error) {
      console.error('Failed to retrieve access token:', error.message);
      throw error;
   }
};

export default router;