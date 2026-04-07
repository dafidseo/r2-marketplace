exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS, GET'
  };
  
  // Allow OPTIONS for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { 
      statusCode: 204, 
      headers 
    };
  }
  
  // Allow GET for testing
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Function is working! Use POST method to create transaction.' })
    };
  }
  
  // Only accept POST for transactions
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed. Use POST.' })
    };
  }
  
  try {
    const data = JSON.parse(event.body);
    const serverKey = 'Mid-server-oAFqiqj7ePmPlV_tbQCzXVVM';
    
    console.log('Creating transaction for:', data.transaction_details.order_id);
    
    const response = await fetch('https://app.sandbox.midtrans.com/snap/v1/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(serverKey + ':').toString('base64')
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    console.log('Midtrans response:', result);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
