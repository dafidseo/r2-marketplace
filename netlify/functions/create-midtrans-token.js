exports.handler = async (event) => {
  const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
  
  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
      return {
          statusCode: 204,
          headers
      };
  }
  
  // Only accept POST method
  if (event.httpMethod !== 'POST') {
      return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method Not Allowed' })
      };
  }
  
  try {
      // Parse request body
      const transactionData = JSON.parse(event.body);
      
      // Midtrans Server Key (Sandbox)
      // Untuk production, ganti dengan server key production dan ubah URL ke production
      const serverKey = 'Mid-server-oAFqiqj7ePmPlV_tbQCzXVVM';
      
      // Call Midtrans API to create transaction token
      const response = await fetch('https://app.sandbox.midtrans.com/snap/v1/transactions', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Basic ' + Buffer.from(serverKey + ':').toString('base64')
          },
          body: JSON.stringify(transactionData)
      });
      
      const result = await response.json();
      
      // Check if token was created successfully
      if (result.token) {
          return {
              statusCode: 200,
              headers,
              body: JSON.stringify({
                  token: result.token,
                  redirect_url: result.redirect_url
              })
          };
      } else {
          // Return error from Midtrans
          return {
              statusCode: 400,
              headers,
              body: JSON.stringify({
                  error: result.status_message || 'Failed to create transaction',
                  details: result
              })
          };
      }
      
  } catch (error) {
      console.error('Error creating Midtrans token:', error);
      
      return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
              error: 'Internal server error',
              message: error.message
          })
      };
  }
};