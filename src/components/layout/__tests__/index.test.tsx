/**
 * Layout Components Index Tests
 * Quick coverage win for barrel exports
 */

describe('Layout Index Exports', () => {
  test('should export all layout components', () => {
    const layoutIndex = require('../index');
    
    expect(layoutIndex.Layout).toBeDefined();
    expect(layoutIndex.Navigation).toBeDefined();
    expect(layoutIndex.Footer).toBeDefined();
    
    // Verify they are actual functions/components
    expect(typeof layoutIndex.Layout).toBe('function');
    expect(typeof layoutIndex.Navigation).toBeDefined();
    expect(typeof layoutIndex.Footer).toBe('function');
  });
});
