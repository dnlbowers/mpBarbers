/**
 * Feature Components Index Tests
 * Quick coverage win for barrel exports
 */

describe('Features Index Exports', () => {
  test('should export all feature components', () => {
    const featuresIndex = require('../index');

    expect(featuresIndex.HomePage).toBeDefined();
    expect(featuresIndex.AboutPage).toBeDefined();
    expect(featuresIndex.ServicesPage).toBeDefined();
    expect(featuresIndex.ContactPage).toBeDefined();

    // Verify they are actual functions/components (could be object due to React.memo)
    expect(['function', 'object']).toContain(typeof featuresIndex.HomePage);
    expect(['function', 'object']).toContain(typeof featuresIndex.AboutPage);
    expect(['function', 'object']).toContain(typeof featuresIndex.ServicesPage);
    expect(['function', 'object']).toContain(typeof featuresIndex.ContactPage);
  });
});
