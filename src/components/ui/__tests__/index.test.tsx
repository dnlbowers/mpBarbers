/**
 * UI Components Index Tests
 * Quick coverage win for barrel exports
 */

describe('UI Index Exports', () => {
  test('should export all UI components', () => {
    const uiIndex = require('../index');
    
    expect(uiIndex.Button).toBeDefined();
    expect(uiIndex.Input).toBeDefined();
    expect(uiIndex.Card).toBeDefined();
    expect(uiIndex.ErrorBoundary).toBeDefined();
    expect(uiIndex.Skeleton).toBeDefined();
    expect(uiIndex.LoadingSpinner).toBeDefined();
    expect(uiIndex.LoadingOverlay).toBeDefined();
    expect(uiIndex.ServiceCardSkeleton).toBeDefined();
    expect(uiIndex.TestimonialSkeleton).toBeDefined();
    expect(uiIndex.TimeSlotsSkeleton).toBeDefined();
    
    // Verify they are actual functions/components
    expect(typeof uiIndex.Button).toBe('function');
    // For forwardRef components, the type might be object, so check if it's renderable
    expect(uiIndex.Input).toBeDefined();
    expect(typeof uiIndex.Input === 'function' || typeof uiIndex.Input === 'object').toBe(true);
    expect(typeof uiIndex.Card).toBe('function');
    expect(typeof uiIndex.ErrorBoundary).toBe('function');
  });
});
