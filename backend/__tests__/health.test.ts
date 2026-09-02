import { GET as healthGET } from '../app/api/health/route';

// Mock MongoDB connection to prevent requiring a live DB process in unit tests
jest.mock('../lib/db', () => ({
  connectDB: jest.fn().mockResolvedValue(true),
}));

describe('Health Check API Route', () => {
  it('should return 200 OK with database connected status', async () => {
    const response = await healthGET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('ok');
    expect(data.database).toBe('Connected');
    expect(data).toHaveProperty('timestamp');
  });
});
