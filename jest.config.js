/**
 * Modern Jest Configuration for React 18 + TypeScript
 * 
 * @author Uncle Bob & Steve McConnell approach
 * 
 * WHY: React 18 requires jsdom environment and modern testing setup
 * WHAT: Configures Jest for optimal testing with React 18 and TypeScript
 * HOW: Clean, maintainable configuration with performance optimizations
 */

module.exports = {
  // ENVIRONMENT: Use jsdom for browser-like environment
  testEnvironment: 'jsdom',
  
  // SETUP: Configure test setup files
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  
  // MODULES: Handle module resolution
  moduleNameMapping: {
    // CSS modules and assets
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'jest-transform-stub',
    
    // Path aliases (if you use them)
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@contexts/(.*)$': '<rootDir>/src/contexts/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1'
  },
  
  // EXTENSIONS: File extensions to process
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // PATTERNS: Test file patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(ts|tsx|js|jsx)',
    '<rootDir>/src/**/*.(test|spec).(ts|tsx|js|jsx)'
  ],
  
  // COVERAGE: Code coverage configuration
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/reportWebVitals.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/*.test.{ts,tsx}'
  ],
  
  // THRESHOLDS: Maintain high code quality
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // REPORTING: Clean test output
  verbose: true,
  
  // PERFORMANCE: Optimize test execution
  maxWorkers: '50%',
  
  // GLOBALS: Configure jsdom environment
  testEnvironmentOptions: {
    url: 'http://localhost:3000'
  },
  
  // ERROR HANDLING: Clear error messages
  errorOnDeprecated: false, // Set to false initially for smooth transition
  
  // CACHE: Improve performance
  cache: true,
  
  // CLEANUP: Reset modules between tests
  resetMocks: true,
  clearMocks: true,
  restoreMocks: true
};