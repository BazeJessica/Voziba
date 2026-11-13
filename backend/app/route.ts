import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    name: 'Voziba Backend API',
    version: '1.0.0',
    framework: 'Next.js 15 (App Router)',
    database: 'MongoDB (Mongoose)',
    status: 'Ready for development',
    swaggerUi: '/docs',
    swaggerSpec: '/api/docs/spec',
  });
}
