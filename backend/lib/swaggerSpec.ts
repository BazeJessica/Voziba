export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Voziba Artisanal Marketplace API',
    version: '1.0.0',
    description:
      'OpenAPI 3.0 Documentation for Voziba Next.js & MongoDB backend API. Manages users, artisanal handiworks, bookings, and craft categories.',
    contact: {
      name: 'Voziba Engineering Team',
      email: 'api@voziba.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local Development Server',
    },
  ],
  tags: [
    { name: 'System', description: 'System status & health endpoints' },
    { name: 'Authentication', description: 'User login & role-based registration' },
    { name: 'Handiworks', description: 'Artisanal craft listings & creation' },
    { name: 'Bookings', description: 'Custom client orders & booking management' },
    { name: 'Categories', description: 'Craft categories & taxonomy' },
    { name: 'Database', description: 'Database seeding operations' },
    { name: 'Benchmark', description: 'Performance and latency diagnostic endpoints' },
  ],
  paths: {
    '/api/health': {
      get: {
        summary: 'Check API and MongoDB connection health',
        tags: ['System'],
        responses: {
          '200': {
            description: 'Database connected and API healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    message: { type: 'string', example: 'Voziba Next.js API Server Running with MongoDB' },
                    database: { type: 'string', example: 'Connected' },
                    timestamp: { type: 'string', example: '2026-08-11T11:00:00.000Z' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/benchmark': {
      get: {
        summary: 'Benchmark API database latency and query response times',
        tags: ['Benchmark'],
        responses: {
          '200': {
            description: 'Performance & latency metrics calculated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'healthy' },
                    latency: {
                      type: 'object',
                      properties: {
                        dbPingMs: { type: 'number', example: 4 },
                        dbConnectTotalMs: { type: 'number', example: 12 },
                        worksQueryMs: { type: 'number', example: 8 },
                        categoriesQueryMs: { type: 'number', example: 5 },
                        bookingsQueryMs: { type: 'number', example: 6 },
                        usersQueryMs: { type: 'number', example: 3 },
                        totalServerLatencyMs: { type: 'number', example: 38 },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/signup': {
      post: {
        summary: 'Register a new Consumer or Business Owner user',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email'],
                properties: {
                  name: { type: 'string', example: 'Jessica Miller' },
                  email: { type: 'string', example: 'jessica@example.com' },
                  password: { type: 'string', example: 'password123' },
                  role: { type: 'string', enum: ['consumer', 'business_owner'], example: 'consumer' },
                  phone: { type: 'string', example: '+1 (555) 000-0000' },
                  businessName: { type: 'string', example: 'Miller Handcrafts Studio' },
                  category: { type: 'string', example: 'Woodworking' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Registration successful',
          },
          '400': { description: 'Missing required parameters' },
          '409': { description: 'Email already exists' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        summary: 'Log in with credentials and role selection',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: { type: 'string', example: 'jessica@example.com' },
                  role: { type: 'string', enum: ['consumer', 'business_owner'], example: 'business_owner' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Login successful' },
        },
      },
    },
    '/api/works': {
      get: {
        summary: 'List all handiwork craft listings',
        tags: ['Handiworks'],
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Filter by category name' },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search keyword' },
        ],
        responses: {
          '200': { description: 'List of craft listings' },
        },
      },
      post: {
        summary: 'Create a new handiwork listing',
        tags: ['Handiworks'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'creatorName', 'category', 'description', 'price', 'img'],
                properties: {
                  title: { type: 'string', example: 'Handcrafted Oak Stool' },
                  creatorName: { type: 'string', example: 'Elias & Co. Woodworks' },
                  category: { type: 'string', example: 'Woodworking' },
                  description: { type: 'string', example: 'Solid oak stool with natural finish.' },
                  price: { type: 'number', example: 250 },
                  priceType: { type: 'string', enum: ['fixed', 'starting'], example: 'fixed' },
                  img: { type: 'string', example: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Handiwork created successfully' },
        },
      },
    },
    '/api/bookings': {
      get: {
        summary: 'Retrieve custom order bookings',
        tags: ['Bookings'],
        parameters: [
          { name: 'email', in: 'query', schema: { type: 'string' }, description: 'Filter by customer email' },
          { name: 'creator', in: 'query', schema: { type: 'string' }, description: 'Filter by creator name' },
        ],
        responses: {
          '200': { description: 'List of bookings' },
        },
      },
      post: {
        summary: 'Create a new custom order booking',
        tags: ['Bookings'],
        responses: {
          '201': { description: 'Booking created successfully' },
        },
      },
    },
    '/api/categories': {
      get: {
        summary: 'List all craft categories',
        tags: ['Categories'],
        responses: {
          '200': { description: 'List of craft categories' },
        },
      },
    },
    '/api/seed': {
      get: {
        summary: 'Seed initial dummy dataset into MongoDB via GET request',
        tags: ['Database'],
        responses: {
          '200': { description: 'Database successfully seeded' },
        },
      },
      post: {
        summary: 'Seed initial dummy dataset into MongoDB via POST request',
        tags: ['Database'],
        responses: {
          '200': { description: 'Database successfully seeded' },
        },
      },
    },
  },
};
