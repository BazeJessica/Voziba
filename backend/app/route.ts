import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    name: 'Voziba Backend API',
    version: '1.0.0',
    framework: 'Next.js 15 (App Router)',
    database: 'MongoDB (Mongoose)',
    status: 'Operational',
    swaggerUi: '/docs',
    swaggerSpec: '/api/docs/spec',
    endpoints: {
      health: '/api/health',
      signup: 'POST /api/auth/signup',
      login: 'POST /api/auth/login',
      works: 'GET, POST /api/works',
      bookings: 'GET, POST /api/bookings',
      categories: 'GET /api/categories',
      seed: 'POST /api/seed (Initializes Database with sample records)',
    },
  });
}
