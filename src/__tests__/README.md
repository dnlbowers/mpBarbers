# Testing Documentation

## 🧪 Comprehensive Testing Strategy

This directory contains the complete testing infrastructure for the MP Barbers application, implementing enterprise-grade testing practices with comprehensive coverage, performance monitoring, and accessibility validation.

### Testing Philosophy
- **Quality Assurance**: Every component and function is thoroughly tested
- **Accessibility First**: All UI components meet WCAG 2.1 AA standards
- **Performance Monitoring**: Tests include performance benchmarks and monitoring
- **User-Centric**: Tests focus on user interactions and business scenarios
- **Maintainable**: Clear, readable tests that serve as documentation

## 📁 Test Structure

```
src/
├── __tests__/
│   ├── setupTests.ts           # Global test configuration
│   ├── testUtils.tsx           # Reusable test utilities
│   └── testResultsProcessor.js # Custom test reporting
├── components/
│   └── __tests__/              # Component tests
├── hooks/
│   └── __tests__/              # Custom hook tests
├── services/
│   └── __tests__/              # Service layer tests
├── utils/
│   └── __tests__/              # Utility function tests
├── contexts/
│   └── __tests__/              # Context provider tests
└── jest.config.js              # Jest configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- Yarn package manager
- Jest and React Testing Library (included in dependencies)

### Running Tests
```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test --watch

# Run tests with coverage
yarn test --coverage

# Run specific test file
yarn test Button.test.tsx

# Run tests matching pattern
yarn test --testNamePattern="accessibility"
```

### Test Coverage
```bash
# Generate coverage report
yarn test --coverage --watchAll=false

# View coverage in browser
open coverage/lcov-report/index.html
```

## 🎯 Testing Categories

### 1. Unit Tests
**Purpose**: Test individual functions and components in isolation
**Location**: Adjacent to source files in `__tests__` directories
**Coverage**: 95%+ for utilities, 90%+ for business logic

**Examples**:
- Utility function validation
- Component prop handling
- Service method behavior
- Hook state management

### 2. Integration Tests
**Purpose**: Test component interactions and data flow
**Location**: Component and context test files
**Coverage**: Critical user paths and business workflows

**Examples**:
- Form submission workflows
- Context provider integration
- Service layer communication
- Component composition

### 3. Accessibility Tests
**Purpose**: Ensure WCAG 2.1 AA compliance
**Location**: Integrated into component tests
**Coverage**: All interactive elements and user interfaces

**Examples**:
- Screen reader compatibility
- Keyboard navigation
- Color contrast validation
- ARIA attribute verification

### 4. Performance Tests
**Purpose**: Validate rendering performance and memory usage
**Location**: Specialized performance test suites
**Coverage**: Critical components and business operations

**Examples**:
- Component render times
- Memory leak detection
- Bundle size validation
- API response times

## 🔧 Test Utilities

### Custom Render Functions
```typescript
// Render with providers
const result = renderWithProviders(<Component />);

// Render with accessibility testing
const result = await renderWithA11yTesting(<Component />);

// Run accessibility audit
await runAxeTest(container);
```

### Mock Data Factories
```typescript
// Generate test data
const bookingData = mockDataFactory.bookingFormData();
const contactData = mockDataFactory.contactFormData();
const service = mockDataFactory.service();
```

### Performance Testing
```typescript
// Measure render performance
const renderTime = measureRenderTime(() => render(<Component />));

// Test async operations
await testAsyncOperation(() => submitBooking(data));
```

## 📊 Test Configuration

### Jest Configuration
- **Environment**: jsdom for DOM testing
- **Setup**: Automated test environment setup
- **Mocking**: Comprehensive API and browser mocking
- **Coverage**: Detailed coverage reporting with thresholds
- **Performance**: Memory and execution time monitoring

### Coverage Thresholds
```javascript
// Global thresholds
global: {
  branches: 80,
  functions: 80,
  lines: 80,
  statements: 80
}

// Specific module thresholds
'./src/utils/': {
  branches: 90,
  functions: 95,
  lines: 95,
  statements: 95
}
```

### Accessibility Testing
- **Axe-core**: Automated accessibility rule checking
- **Screen Reader**: Semantic HTML and ARIA validation
- **Keyboard Navigation**: Complete keyboard accessibility testing
- **Color Contrast**: Automated contrast ratio validation

## 🧩 Test Patterns

### Component Testing Pattern
```typescript
describe('ComponentName', () => {
  describe('Rendering', () => {
    test('renders with default props', () => {
      render(<Component />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    test('handles click events', () => {
      const handleClick = jest.fn();
      render(<Component onClick={handleClick} />);
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    test('passes accessibility audit', async () => {
      const { container } = await renderWithA11yTesting(<Component />);
      // Accessibility validation performed automatically
    });
  });
});
```

### Hook Testing Pattern
```typescript
describe('useCustomHook', () => {
  test('returns expected values', () => {
    const { result } = renderHook(() => useCustomHook());
    expect(result.current.value).toBeDefined();
  });

  test('handles state updates', () => {
    const { result } = renderHook(() => useCustomHook());
    act(() => {
      result.current.updateValue('new value');
    });
    expect(result.current.value).toBe('new value');
  });
});
```

### Service Testing Pattern
```typescript
describe('ServiceName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('handles successful operations', async () => {
    const result = await serviceMethod(validData);
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  test('handles error conditions', async () => {
    const result = await serviceMethod(invalidData);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
```

## 📈 Performance Monitoring

### Automated Performance Tests
- **Render Time**: Components must render within 16ms
- **Memory Usage**: Memory leak detection and monitoring
- **Bundle Size**: Automated bundle size regression testing
- **API Performance**: Service response time validation

### Performance Thresholds
```typescript
// Component render time threshold
expect(renderTime).toBeLessThan(16); // 60fps threshold

// Memory usage threshold
expect(memoryUsage).toBeLessThan(50 * 1024 * 1024); // 50MB

// Bundle size threshold
expect(bundleSize).toBeLessThan(1024 * 1024); // 1MB
```

## 🔍 Debugging Tests

### Common Issues and Solutions

#### Test Failures
```bash
# Run specific failing test
yarn test --testNamePattern="failing test name"

# Run with verbose output
yarn test --verbose

# Debug test in watch mode
yarn test --watch --verbose
```

#### Performance Issues
```bash
# Analyze test performance
yarn test --detectOpenHandles --forceExit

# Monitor memory usage
yarn test --logHeapUsage
```

#### Accessibility Issues
```bash
# Run accessibility-focused tests
yarn test --testNamePattern="accessibility"

# Debug ARIA issues
yarn test --verbose Button.test.tsx
```

## 📊 Test Reporting

### Automated Reports
- **Coverage Reports**: HTML and LCOV formats
- **Performance Metrics**: Execution time and memory usage
- **Test Results**: JUnit XML for CI/CD integration
- **Accessibility Audit**: Detailed accessibility compliance reports

### Custom Reporting
- **Test Summary**: Comprehensive execution summary
- **Performance Trends**: Historical performance tracking
- **Failed Test Analysis**: Detailed failure analysis
- **Slow Test Identification**: Performance optimization targets

## 🎯 Best Practices

### Writing Tests
1. **Test Behavior, Not Implementation**: Focus on user interactions
2. **Use Descriptive Names**: Clear test descriptions that explain intent
3. **Follow AAA Pattern**: Arrange, Act, Assert for clear test structure
4. **Mock External Dependencies**: Isolate units under test
5. **Test Edge Cases**: Include error conditions and boundary cases

### Maintaining Tests
1. **Keep Tests DRY**: Use shared utilities and factories
2. **Update Tests with Code**: Maintain tests alongside code changes
3. **Refactor Tests**: Keep tests clean and maintainable
4. **Review Test Coverage**: Ensure adequate coverage for new features
5. **Monitor Performance**: Track test execution performance

### Accessibility Testing
1. **Test with Screen Readers**: Validate screen reader compatibility
2. **Check Keyboard Navigation**: Ensure complete keyboard accessibility
3. **Validate ARIA**: Proper ARIA labels and roles
4. **Test Color Contrast**: Meet WCAG contrast requirements
5. **Semantic HTML**: Use proper HTML elements and structure

## 🔄 Continuous Integration

### CI/CD Integration
- **Automated Test Execution**: Tests run on every commit
- **Coverage Reporting**: Coverage metrics tracked over time
- **Performance Monitoring**: Performance regression detection
- **Accessibility Validation**: Automated accessibility compliance checking

### Quality Gates
- **Minimum Coverage**: 80% overall, 90% for critical paths
- **Performance Thresholds**: No performance regressions
- **Accessibility Compliance**: Zero accessibility violations
- **Test Execution**: All tests must pass before deployment

## 📚 Additional Resources

### Testing Libraries
- **[Jest](https://jestjs.io/)**: JavaScript testing framework
- **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)**: React component testing
- **[Jest Axe](https://github.com/nickcolley/jest-axe)**: Accessibility testing
- **[MSW](https://mswjs.io/)**: API mocking library

### Documentation
- **[Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)**: Common testing patterns
- **[Accessibility Testing](https://web.dev/accessibility-testing/)**: Web accessibility testing guide
- **[Performance Testing](https://web.dev/rail/)**: Performance testing methodology

---

**Quality Assurance**: Comprehensive testing ensures reliability, accessibility, and performance of the MP Barbers application.