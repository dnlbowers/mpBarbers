/**
 * Feature Components Index Tests
 * Quick coverage win for barrel exports
 */

describe('Features Index Exports', () => {
  test('should export all feature components', () => {
    const featuresIndex = require('../index');
    
    expect(featuresIndex.HomePage).toBeDefined();
    expect(featuresIndex.AboutPage).toBeDefined();
    expect(featuresIndex.BookingPage).toBeDefined();
    expect(featuresIndex.ContactPage).toBeDefined();
    
    // Verify they are actual functions/components
    expect(typeof featuresIndex.HomePage).toBe('function');
    expect(typeof featuresIndex.AboutPage).toBe('function');
    expect(typeof featuresIndex.BookingPage).toBe('function');
    expect(typeof featuresIndex.ContactPage).toBe('function');
  });
});
