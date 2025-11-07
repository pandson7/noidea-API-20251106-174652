const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  try {
    const { httpMethod, resource, pathParameters } = event;

    if (httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'CORS preflight' })
      };
    }

    if (httpMethod === 'GET') {
      if (resource === '/products') {
        return await getAllProducts();
      } else if (resource === '/products/{id}' && pathParameters?.id) {
        return await getProductById(pathParameters.id);
      }
    }

    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Not Found' })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};

async function getAllProducts() {
  try {
    const command = new ScanCommand({
      TableName: TABLE_NAME
    });

    const result = await docClient.send(command);
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result.Items || [])
    };
  } catch (error) {
    console.error('Error getting all products:', error);
    throw error;
  }
}

async function getProductById(id) {
  try {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { id }
    });

    const result = await docClient.send(command);
    
    if (!result.Item) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Product not found' })
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result.Item)
    };
  } catch (error) {
    console.error('Error getting product by ID:', error);
    throw error;
  }
}