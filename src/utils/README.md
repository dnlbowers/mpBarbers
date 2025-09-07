# Utils Documentation

## 🔧 Pure Function Library Architecture

This directory contains utility functions that provide essential functionality across the application. Following **Clean Architecture** and **Functional Programming** principles, all utilities are pure functions with no side effects, ensuring predictable behavior and testability.

### Design Principles
- **Pure Functions**: No side effects, same input always produces same output
- **Single Responsibility**: Each function has one clear purpose
- **Immutability**: Functions don't modify input parameters
- **Type Safety**: Comprehensive TypeScript coverage
- **Performance**: Optimized algorithms for common operations

## 📦 Utility Categories

### Data Formatting

#### formatPrice
**Purpose**: Converts numeric values to localized currency strings
**Business Value**: Consistent price display across the application
**Internationalization**: Uses Intl.NumberFormat for locale support

```typescript
formatPrice(35.50); // "$35.50"
formatPrice(1250);  // "$1,250.00"
```

#### formatDuration
**Purpose**: Converts minutes to human-readable duration format
**Business Value**: Clear service duration communication to customers
**Logic**: Handles hours and minutes with proper pluralization

```typescript
formatDuration(30);  // "30 min"
formatDuration(90);  // "1h 30min"
formatDuration(120); // "2h"
```

### Date and Time Operations

#### generateTimeSlots
**Purpose**: Creates available appointment time slots for booking
**Business Logic**: Integrates with business hours and booking rules
**Performance**: Efficient slot generation with availability checking

```typescript
const slots = generateTimeSlots(new Date('2024-03-15'));
// Returns: [{ time: '09:00', available: true, date: Date }, ...]
```

#### getMinBookingDate / getMaxBookingDate
**Purpose**: Calculates booking date boundaries based on business rules
**Business Value**: Enforces booking policies and availability windows
**Configuration**: Uses APP_CONFIG for flexible business rules

### Form Validation

#### validateBookingForm
**Purpose**: Comprehensive booking form validation with business rules
**Security**: Input validation prevents malicious data submission
**UX**: Provides clear, actionable error messages

```typescript
const errors = validateBookingForm(formData);
if (errors.length === 0) {
  // Form is valid, proceed with submission
}
```

#### validateContactForm
**Purpose**: Contact form validation with flexible phone number support
**Business Logic**: Required fields with optional phone validation
**User Experience**: Progressive validation with helpful error messages

### Input Validation and Security

#### isValidEmail
**Purpose**: RFC-compliant email format validation
**Security**: Prevents malformed email addresses in system
**Reliability**: Uses tested regex pattern for consistent validation

```typescript
isValidEmail('user@example.com'); // true
isValidEmail('invalid-email');    // false
```

#### isValidPhoneNumber
**Purpose**: International phone number format validation
**Flexibility**: Supports multiple phone number formats
**Security**: Strips formatting while maintaining validation integrity

```typescript
isValidPhoneNumber('+1 (555) 123-4567'); // true
isValidPhoneNumber('555-123-4567');       // true
```

#### sanitizeString
**Purpose**: Input sanitization for XSS prevention
**Security**: Removes potentially dangerous HTML characters
**Data Integrity**: Preserves user intent while ensuring safety

```typescript
sanitizeString('<script>alert("xss")</script>Hello'); // 'Hello'
sanitizeString('  Normal text  '); // 'Normal text'
```

### Performance Optimization

#### debounce
**Purpose**: Performance optimization for expensive operations
**Use Cases**: Search inputs, API calls, resize handlers
**Memory Management**: Proper cleanup of timeout references

```typescript
const debouncedSearch = debounce((query: string) => {
  performExpensiveSearch(query);
}, 300);

// Usage in input handler
const handleSearchInput = (value: string) => {
  debouncedSearch(value); // Only calls after 300ms of inactivity
};
```

#### cn (Class Name Utility)
**Purpose**: Conditional CSS class combination
**Performance**: Efficient filtering and joining of class names
**Developer Experience**: Clean API for dynamic styling

```typescript
const buttonClass = cn(
  'btn',
  variant === 'primary' && 'btn-primary',
  disabled && 'btn-disabled',
  loading && 'btn-loading',
  className
);
```

### ID Generation

#### generateId
**Purpose**: Client-side unique identifier generation
**Use Cases**: Form keys, temporary IDs, cache keys
**Algorithm**: Timestamp + random components for uniqueness

```typescript
const bookingId = generateId(); // 'ly8qz3k4f9'
const formKey = `form-${generateId()}`; // 'form-ly8qz3k4f9'
```

## 🏗️ Utility Architecture Patterns

### Pure Function Design
```typescript
// ✅ Good: Pure function
const formatPrice = (price: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(price);
};

// ❌ Bad: Impure function with side effects
let lastFormattedPrice: string;
const formatPriceImpure = (price: number): string => {
  lastFormattedPrice = price.toString(); // Side effect
  console.log('Formatting price:', price); // Side effect
  return `$${price}`;
};
```

### Error Handling Strategy
```typescript
const safeValidation = <T>(
  validator: (input: T) => boolean,
  input: T,
  fallback = false
): boolean => {
  try {
    return validator(input);
  } catch (error) {
    console.warn('Validation error:', error);
    return fallback;
  }
};

// Usage
const isEmailValid = safeValidation(isValidEmail, userEmail, false);
```

### Functional Composition
```typescript
// Compose validation functions
const validateAndSanitize = (input: string): { valid: boolean; clean: string } => {
  const clean = sanitizeString(input);
  const valid = clean.length > 0;
  
  return { valid, clean };
};

// Pipeline pattern for data processing
const processBookingData = (formData: BookingFormData) => {
  return {
    ...formData,
    fullName: sanitizeString(formData.fullName),
    email: sanitizeString(formData.email),
    phoneNumber: sanitizeString(formData.phoneNumber)
  };
};
```

## 🧪 Testing Strategy

### Unit Testing Patterns
```typescript
describe('Utility Functions', () => {
  describe('formatPrice', () => {
    test('formats USD currency correctly', () => {
      expect(formatPrice(35.50)).toBe('$35.50');
      expect(formatPrice(1250)).toBe('$1,250.00');
    });

    test('handles zero and negative values', () => {
      expect(formatPrice(0)).toBe('$0.00');
      expect(formatPrice(-25)).toBe('-$25.00');
    });
  });

  describe('validateBookingForm', () => {
    const validData: BookingFormData = {
      service: 'haircut',
      date: '2024-03-15',
      time: '14:00',
      fullName: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '555-1234',
      specialRequests: ''
    };

    test('returns no errors for valid data', () => {
      const errors = validateBookingForm(validData);
      expect(errors).toHaveLength(0);
    });

    test('returns errors for missing required fields', () => {
      const invalidData = { ...validData, fullName: '' };
      const errors = validateBookingForm(invalidData);
      expect(errors).toContain('Please enter your full name');
    });
  });
});
```

### Property-Based Testing
```typescript
import { fc } from 'fast-check';

describe('Property-Based Tests', () => {
  test('sanitizeString preserves non-malicious content', () => {
    fc.assert(fc.property(
      fc.string().filter(s => !s.includes('<') && !s.includes('>')),
      (input) => {
        const result = sanitizeString(input);
        expect(result).toBe(input.trim());
      }
    ));
  });

  test('formatDuration always returns string with time units', () => {
    fc.assert(fc.property(
      fc.integer({ min: 1, max: 1440 }), // 1 minute to 24 hours
      (minutes) => {
        const result = formatDuration(minutes);
        expect(result).toMatch(/\d+(h|min)/);
      }
    ));
  });
});
```

## 🎯 Performance Considerations

### Memoization for Expensive Operations
```typescript
const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map();
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// Memoized expensive validation
const memoizedValidateEmail = memoize(isValidEmail);
```

### Lazy Evaluation Patterns
```typescript
const createTimeSlotGenerator = (businessHours: BusinessHours) => {
  return function* generateSlots(date: Date) {
    const daySchedule = businessHours[date.getDay()];
    
    for (const timeSlot of daySchedule.slots) {
      yield {
        time: timeSlot,
        available: isTimeSlotAvailable(date, timeSlot),
        date
      };
    }
  };
};

// Usage: Only generates slots as needed
const slotGenerator = createTimeSlotGenerator(BUSINESS_HOURS);
const firstFiveSlots = Array.from(slotGenerator(new Date())).slice(0, 5);
```

## 🔗 Integration Patterns

### Configuration Integration
```typescript
// Utils that depend on app configuration
const createBusinessRuleValidator = (config: AppConfig) => {
  return {
    validateBookingWindow: (date: Date): boolean => {
      const now = new Date();
      const minDate = new Date(now.getTime() + config.minBookingHours * 3600000);
      const maxDate = new Date(now.getTime() + config.maxBookingDays * 86400000);
      
      return date >= minDate && date <= maxDate;
    },
    
    validateServiceDuration: (duration: number): boolean => {
      return duration >= config.minServiceDuration && 
             duration <= config.maxServiceDuration;
    }
  };
};
```

### Type-Safe Utility Factories
```typescript
const createFormValidator = <T extends Record<string, any>>(
  rules: ValidationRules<T>
) => {
  return (data: T): ValidationResult<T> => {
    const errors: Partial<Record<keyof T, string>> = {};
    
    for (const [field, validators] of Object.entries(rules)) {
      const value = data[field as keyof T];
      
      for (const validate of validators) {
        const error = validate(value);
        if (error) {
          errors[field as keyof T] = error;
          break;
        }
      }
    }
    
    return {
      valid: Object.keys(errors).length === 0,
      errors,
      data
    };
  };
};
```

## 📊 Utility Metrics and Monitoring

### Performance Monitoring
```typescript
const withPerformanceTracking = <T extends (...args: any[]) => any>(
  fn: T,
  name: string
): T => {
  return ((...args: Parameters<T>) => {
    const start = performance.now();
    
    try {
      const result = fn(...args);
      const duration = performance.now() - start;
      
      // Log slow operations in development
      if (process.env.NODE_ENV === 'development' && duration > 10) {
        console.warn(`Slow utility function: ${name} took ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`Utility function error: ${name} failed after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  }) as T;
};

// Usage
export const formatPrice = withPerformanceTracking(
  (price: number) => /* implementation */,
  'formatPrice'
);
```

## 🎯 Best Practices

### Function Design
1. **Pure Functions**: No side effects, predictable outputs
2. **Single Responsibility**: One clear purpose per function
3. **Immutable Parameters**: Never modify input parameters
4. **Type Safety**: Comprehensive TypeScript coverage
5. **Error Handling**: Graceful handling of edge cases

### Code Quality
```typescript
// ✅ Good: Clear, focused utility function
const formatCurrency = (
  amount: number,
  currency = 'USD',
  locale = 'en-US'
): string => {
  if (typeof amount !== 'number' || !isFinite(amount)) {
    throw new Error('Amount must be a finite number');
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount);
};

// ❌ Bad: Complex function with multiple responsibilities
const processUserData = (userData: any) => {
  // Validation
  if (!userData.email) throw new Error('Email required');
  
  // Formatting
  userData.email = userData.email.toLowerCase();
  
  // Side effects
  localStorage.setItem('lastUser', userData.email);
  
  // API call
  return fetch('/api/users', { method: 'POST', body: JSON.stringify(userData) });
};
```

### Documentation Standards
- **JSDoc Comments**: Comprehensive function documentation
- **Type Annotations**: Clear parameter and return types
- **Usage Examples**: Practical implementation examples
- **Edge Cases**: Document behavior for edge cases

---

**Next Steps**: Explore [Constants Documentation](../constants/README.md) for application configuration and constants.