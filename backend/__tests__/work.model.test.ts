import { Work } from '../models/Work';

describe('Work Model Schema Unit Tests', () => {
  it('should initialize Work model with title, category and price', () => {
    expect(Work.modelName).toBe('Work');
    expect(Work.schema.path('title')).toBeDefined();
    expect(Work.schema.path('category')).toBeDefined();
    expect(Work.schema.path('price')).toBeDefined();
  });

  it('should validate priceType enum values', () => {
    const priceTypeEnum = (Work.schema.path('priceType') as any).enumValues;
    expect(priceTypeEnum).toContain('fixed');
    expect(priceTypeEnum).toContain('starting');
  });
});
