import { User } from '../models/User';

describe('User Model Schema Unit Tests', () => {
  it('should initialize User model with expected properties', () => {
    expect(User.modelName).toBe('User');
    expect(User.schema.path('email')).toBeDefined();
    expect(User.schema.path('role')).toBeDefined();
  });

  it('should validate consumer vs business_owner enum roles', () => {
    const roleEnum = (User.schema.path('role') as any).enumValues;
    expect(roleEnum).toContain('consumer');
    expect(roleEnum).toContain('business_owner');
  });
});
