# noidea-API Project

A serverless REST API for accessing product specifications stored in DynamoDB, built with AWS CDK, API Gateway, and Lambda.

## Architecture

- **API Gateway**: REST API endpoints with CORS support
- **Lambda Function**: Node.js 20.x runtime handling API requests
- **DynamoDB**: NoSQL database with flexible JSON schema for product data
- **CDK**: Infrastructure as Code for deployment

## API Endpoints

### Base URL
```
https://9waknduln4.execute-api.us-east-1.amazonaws.com/prod/
```

### GET /products
Retrieve all products from the database.

**Response**: Array of product objects
**Status Codes**: 200 (success), 500 (server error)

**Example Request:**
```bash
curl "https://9waknduln4.execute-api.us-east-1.amazonaws.com/prod/products"
```

**Example Response:**
```json
[
  {
    "id": "prod-001",
    "name": "iPhone 15 Pro",
    "category": "Electronics",
    "brand": "Apple",
    "price": 999.99,
    "description": "Latest iPhone with A17 Pro chip",
    "specifications": {
      "storage": "128GB",
      "color": "Natural Titanium",
      "display": "6.1-inch Super Retina XDR"
    },
    "availability": true,
    "tags": ["smartphone", "premium", "ios"]
  }
]
```

### GET /products/{id}
Retrieve a specific product by ID.

**Parameters**: 
- `id` (path parameter): Product ID

**Response**: Single product object
**Status Codes**: 200 (success), 404 (not found), 500 (server error)

**Example Request:**
```bash
curl "https://9waknduln4.execute-api.us-east-1.amazonaws.com/prod/products/prod-001"
```

**Example Response:**
```json
{
  "id": "prod-001",
  "name": "iPhone 15 Pro",
  "category": "Electronics",
  "brand": "Apple",
  "price": 999.99,
  "description": "Latest iPhone with A17 Pro chip",
  "specifications": {
    "storage": "128GB",
    "color": "Natural Titanium",
    "display": "6.1-inch Super Retina XDR"
  },
  "availability": true,
  "tags": ["smartphone", "premium", "ios"]
}
```

**Error Response (404):**
```json
{
  "error": "Product not found"
}
```

## Product Data Schema

### Required Fields
- `id`: Unique product identifier (string)
- `name`: Product name (string)
- `category`: Product category (string)
- `brand`: Product brand (string)

### Optional Fields
- `price`: Product price (number)
- `description`: Product description (string)
- `specifications`: Flexible object with product-specific attributes
- `availability`: Product availability status (boolean)
- `tags`: Array of product tags (array of strings)

## Sample Data

The database includes 8 sample products across different categories:

1. **Electronics**: iPhone 15 Pro, MacBook Air M3, Samsung Galaxy S24, Sony WH-1000XM5
2. **Footwear**: Nike Air Max 270
3. **Clothing**: Levi's 501 Original Jeans
4. **Furniture**: IKEA BILLY Bookshelf
5. **Books**: The Clean Code

## Deployment

### Prerequisites
- AWS CLI configured with appropriate permissions
- Node.js 18+ installed
- AWS CDK CLI installed

### Deploy the Stack
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Deploy to AWS
npx cdk deploy --require-approval never
```

### Seed Sample Data
```bash
# Install AWS SDK dependencies
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb

# Run the seeding script
node seed-data.js
```

## AWS Resources Created

- **DynamoDB Table**: `Products20251106174652`
- **Lambda Function**: `ProductsHandler20251106174652`
- **API Gateway**: `ProductsApi20251106174652`
- **IAM Roles**: Execution role for Lambda with DynamoDB permissions

## Testing

### Test All Products Endpoint
```bash
curl "https://9waknduln4.execute-api.us-east-1.amazonaws.com/prod/products"
```

### Test Single Product Endpoint
```bash
curl "https://9waknduln4.execute-api.us-east-1.amazonaws.com/prod/products/prod-001"
```

### Test Error Handling
```bash
curl "https://9waknduln4.execute-api.us-east-1.amazonaws.com/prod/products/non-existent"
```

## Project Structure

```
├── bin/
│   └── noidea-api-20251106-174652.ts    # CDK app entry point
├── lib/
│   └── noidea-api-stack.ts              # CDK stack definition
├── src/
│   └── lambda/
│       ├── index.js                     # Lambda function handler
│       └── package.json                 # Lambda dependencies
├── specs/                               # Project specifications
├── seed-data.js                         # Database seeding script
├── package.json                         # Project dependencies
├── tsconfig.json                        # TypeScript configuration
├── cdk.json                            # CDK configuration
└── README.md                           # This file
```

## Cleanup

To remove all AWS resources:
```bash
npx cdk destroy --require-approval never
```

## Error Handling

The API implements proper error handling:
- **404**: Product not found
- **500**: Internal server error
- **CORS**: Enabled for cross-origin requests

All responses include appropriate HTTP status codes and JSON error messages.