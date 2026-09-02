import { swaggerSpec } from '@/lib/swaggerSpec';
import SwaggerClient from './SwaggerClient';

export const metadata = {
  title: 'Voziba API Documentation - Swagger',
  description: 'Interactive OpenAPI Swagger documentation for Voziba Next.js backend API',
};

export default function DocsPage() {
  return <SwaggerClient spec={swaggerSpec} />;
}
