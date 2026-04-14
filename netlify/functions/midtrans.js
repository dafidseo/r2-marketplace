exports.handler = async (event) => {
  const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
  
  // Handle preflight request (CORS)
  if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 204, headers };
  }
  
  // Hanya menerima POST
  if (event.httpMethod !== 'POST') {
      return { 
          statusCode: 405, 
          headers, 
          body: JSON.stringify({ error: 'Method Not Allowed' }) 
      };
  }
  
  try {
      const data = JSON.parse(event.body);
      const serverKey = 'Mid-server-oAFqiqj7ePmPlV_tbQCzXVVM';
      
      console.log("Processing order:", data.transaction_details?.order_id);
      console.log("Amount:", data.transaction_details?.gross_amount);
      
      const response = await fetch('https://app.sandbox.midtrans.com/snap/v1/transactions', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Basic ' + Buffer.from(serverKey + ':').toString('base64')
          },
          body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      console.log("Midtrans response status:", response.status);
      console.log("Midtrans response:", result);
      
      return {
          statusCode: 200,
          headers,
          body: JSON.stringify(result)
      };
  } catch (error) {
      console.error("Error:", error);
      return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: error.message })
      };
  }
};