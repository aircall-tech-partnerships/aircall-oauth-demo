// ⚠️ EXAMPLE ONLY:
// This code is for demonstration purposes and is not production-ready.

const AIRCALL_API_URL = 'https://api.aircall.io/v1';

// Starts an outbound call from an Aircall user's phone.
// Aircall replies 204 No Content when the call starts.
export async function startOutboundCall(accessToken, userId, numberId, to) {
  const response = await fetch(`${AIRCALL_API_URL}/users/${userId}/calls`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ number_id: numberId, to }),
  });

  if (!response.ok) {
    const error = new Error(`Aircall API error: ${response.status}`);
    error.status = response.status;
    error.details = await response.text();
    throw error;
  }
}
