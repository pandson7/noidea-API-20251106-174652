const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = 'Products20251106174652';

const sampleProducts = [
  {
    id: 'prod-001',
    name: 'iPhone 15 Pro',
    category: 'Electronics',
    brand: 'Apple',
    price: 999.99,
    description: 'Latest iPhone with A17 Pro chip',
    specifications: {
      storage: '128GB',
      color: 'Natural Titanium',
      display: '6.1-inch Super Retina XDR'
    },
    availability: true,
    tags: ['smartphone', 'premium', 'ios']
  },
  {
    id: 'prod-002',
    name: 'MacBook Air M3',
    category: 'Electronics',
    brand: 'Apple',
    price: 1299.99,
    description: 'Lightweight laptop with M3 chip',
    specifications: {
      processor: 'Apple M3',
      memory: '8GB',
      storage: '256GB SSD',
      display: '13.6-inch Liquid Retina'
    },
    availability: true,
    tags: ['laptop', 'ultrabook', 'macos']
  },
  {
    id: 'prod-003',
    name: 'Samsung Galaxy S24',
    category: 'Electronics',
    brand: 'Samsung',
    price: 799.99,
    description: 'Android flagship with AI features',
    specifications: {
      storage: '128GB',
      color: 'Phantom Black',
      display: '6.2-inch Dynamic AMOLED 2X'
    },
    availability: true,
    tags: ['smartphone', 'android', 'flagship']
  },
  {
    id: 'prod-004',
    name: 'Nike Air Max 270',
    category: 'Footwear',
    brand: 'Nike',
    price: 150.00,
    description: 'Comfortable running shoes with Air Max technology',
    specifications: {
      size: 'Multiple sizes available',
      color: 'Black/White',
      material: 'Mesh and synthetic leather'
    },
    availability: true,
    tags: ['shoes', 'running', 'athletic']
  },
  {
    id: 'prod-005',
    name: 'Levi\'s 501 Original Jeans',
    category: 'Clothing',
    brand: 'Levi\'s',
    price: 89.99,
    description: 'Classic straight-leg jeans',
    specifications: {
      fit: 'Straight',
      material: '100% Cotton',
      wash: 'Medium Blue'
    },
    availability: true,
    tags: ['jeans', 'casual', 'classic']
  },
  {
    id: 'prod-006',
    name: 'IKEA BILLY Bookshelf',
    category: 'Furniture',
    brand: 'IKEA',
    price: 59.99,
    description: 'Adjustable shelves bookcase',
    specifications: {
      dimensions: '80x28x202 cm',
      material: 'Particleboard, Paper foil',
      color: 'White'
    },
    availability: true,
    tags: ['furniture', 'storage', 'bookshelf']
  },
  {
    id: 'prod-007',
    name: 'The Clean Code',
    category: 'Books',
    brand: 'Prentice Hall',
    price: 42.99,
    description: 'A Handbook of Agile Software Craftsmanship',
    specifications: {
      author: 'Robert C. Martin',
      pages: 464,
      format: 'Paperback',
      isbn: '978-0132350884'
    },
    availability: true,
    tags: ['programming', 'software', 'technical']
  },
  {
    id: 'prod-008',
    name: 'Sony WH-1000XM5',
    category: 'Electronics',
    brand: 'Sony',
    price: 399.99,
    description: 'Wireless noise-canceling headphones',
    specifications: {
      type: 'Over-ear',
      connectivity: 'Bluetooth 5.2',
      battery: '30 hours',
      features: 'Active Noise Canceling'
    },
    availability: false,
    tags: ['headphones', 'wireless', 'noise-canceling']
  }
];

async function seedDatabase() {
  console.log('Starting to seed database...');
  
  for (const product of sampleProducts) {
    try {
      const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: product
      });
      
      await docClient.send(command);
      console.log(`Added product: ${product.name}`);
    } catch (error) {
      console.error(`Error adding product ${product.name}:`, error);
    }
  }
  
  console.log('Database seeding completed!');
}

seedDatabase().catch(console.error);