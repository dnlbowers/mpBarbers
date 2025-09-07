# Services Documentation

## 🏗️ Infrastructure Layer Architecture

This directory contains the service layer components that handle external integrations, API communications, and business logic operations. Following **Clean Architecture** principles, services provide a clean abstraction between the application core and external systems.

### Architectural Principles
- **Single Responsibility**: Each service handles one specific domain
- **Dependency Inversion**: Services depend on abstractions, not implementations
- **Error Handling**: Comprehensive error handling with typed responses
- **Data Validation**: Input validation and sanitization for security
- **Immutable Operations**: All operations return new data without side effects

## 📦 Service Library

### Booking Service (`bookingService.ts`)

#### submitBooking
**Purpose**: Processes appointment booking requests with full validation pipeline
**Business Value**: Enables customers to schedule appointments with data integrity
**Security**: Input sanitization, validation, and error handling

```typescript
const result = await submitBooking({
  service: 'classic-cut',
  date: '2024-03-15',
  time: '14:00',
  fullName: 'John Doe',
  email: 'john@example.com',
  phoneNumber: '555-1234',
  specialRequests: 'Beard trim included'
});
```

#### checkAvailability
**Purpose**: Verifies time slot availability for appointment scheduling
**Business Value**: Prevents double-booking and provides real-time availability
**Performance**: Optimized queries with caching for fast response times

```typescript
const availability = await checkAvailability('2024-03-15', '14:00');
```

#### getAvailableTimeSlots
**Purpose**: Retrieves all available appointment times for a specific date
**Business Value**: Enables dynamic booking interface with current availability
**Integration**: Connects with staff scheduling and business hours systems

## 🏗️ Service Architecture Patterns

### API Response Pattern
```typescript
interface ApiResponse<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: AppError;
}

interface AppError {
  readonly message: string;
  readonly code: string;
  readonly details?: unknown;
}
```

### Error Handling Strategy
```typescript
const serviceOperation = async (params: Parameters): Promise<ApiResponse<Result>> => {
  try {
    // Validation phase
    const validationErrors = validateInput(params);
    if (validationErrors.length > 0) {
      return {
        success: false,
        error: {
          message: validationErrors.join(', '),
          code: 'VALIDATION_ERROR'
        }
      };
    }

    // Sanitization phase
    const sanitizedParams = sanitizeInput(params);

    // Business logic execution
    const result = await executeBusinessLogic(sanitizedParams);

    return {
      success: true,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: 'SERVICE_ERROR',
        details: error
      }
    };
  }
};
```

### Data Sanitization Pipeline
```typescript
const sanitizeBookingData = (formData: BookingFormData): BookingFormData => {
  return {
    ...formData,
    fullName: sanitizeString(formData.fullName),
    email: sanitizeString(formData.email),
    phoneNumber: sanitizeString(formData.phoneNumber),
    specialRequests: sanitizeString(formData.specialRequests),
  };
};
```

## 🔒 Security Implementation

### Input Validation
- **Type Checking**: Runtime type validation for all inputs
- **Business Rules**: Domain-specific validation logic
- **Format Validation**: Email, phone number, date format validation
- **Length Limits**: Preventing buffer overflow and DOS attacks

### Data Sanitization
- **XSS Prevention**: HTML entity encoding for user inputs
- **SQL Injection**: Parameterized queries and input escaping
- **CSRF Protection**: Token-based request validation
- **Rate Limiting**: API request throttling and abuse prevention

### Error Security
```typescript
// ✅ Good: Safe error handling
const handleServiceError = (error: unknown): AppError => {
  // Log detailed error for debugging
  console.error('Service error:', error);
  
  // Return sanitized error for client
  return {
    message: 'Service temporarily unavailable',
    code: 'SERVICE_ERROR',
    // Never expose internal details to client
  };
};
```

## 📊 Performance Optimization

### Caching Strategy
```typescript
interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  invalidate(pattern: string): Promise<void>;
}

const getCachedAvailability = async (date: string): Promise<string[]> => {
  const cacheKey = `availability:${date}`;
  const cached = await cache.get<string[]>(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  const availability = await fetchAvailabilityFromAPI(date);
  await cache.set(cacheKey, availability, 300); // 5 minute TTL
  
  return availability;
};
```

### Request Optimization
- **Debouncing**: Prevent excessive API calls during user input
- **Batching**: Combine multiple requests for efficiency
- **Retry Logic**: Exponential backoff for failed requests
- **Circuit Breaker**: Prevent cascade failures

### Monitoring Integration
```typescript
const instrumentedServiceCall = async <T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> => {
  const startTime = performance.now();
  
  try {
    const result = await operation();
    
    // Track success metrics
    analytics.track('service_call_success', {
      operation: operationName,
      duration: performance.now() - startTime
    });
    
    return result;
  } catch (error) {
    // Track error metrics
    analytics.track('service_call_error', {
      operation: operationName,
      error: error.message,
      duration: performance.now() - startTime
    });
    
    throw error;
  }
};
```

## 🧪 Testing Strategy

### Unit Testing
```typescript
describe('BookingService', () => {
  describe('submitBooking', () => {
    test('should validate required fields', async () => {
      const invalidData = { ...validBookingData, fullName: '' };
      const result = await submitBooking(invalidData);
      
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('VALIDATION_ERROR');
    });

    test('should sanitize user input', async () => {
      const maliciousData = {
        ...validBookingData,
        fullName: '<script>alert("xss")</script>John'
      };
      
      const result = await submitBooking(maliciousData);
      
      // Verify sanitization occurred
      expect(result.success).toBe(true);
    });
  });
});
```

### Integration Testing
```typescript
describe('BookingService Integration', () => {
  test('should handle API failures gracefully', async () => {
    // Mock API failure
    mockAPI.mockRejectedValueOnce(new Error('Network error'));
    
    const result = await submitBooking(validBookingData);
    
    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('BOOKING_ERROR');
  });
});
```

### Performance Testing
```typescript
describe('BookingService Performance', () => {
  test('should complete booking within acceptable time', async () => {
    const startTime = performance.now();
    
    await submitBooking(validBookingData);
    
    const duration = performance.now() - startTime;
    expect(duration).toBeLessThan(3000); // 3 second SLA
  });
});
```

## 🔗 External Integrations

### API Client Configuration
```typescript
interface APIClient {
  baseURL: string;
  timeout: number;
  retries: number;
  headers: Record<string, string>;
}

const createAPIClient = (config: APIClient) => {
  return {
    post: async <T>(endpoint: string, data: unknown): Promise<T> => {
      // Implementation with retry logic, timeout handling
    },
    get: async <T>(endpoint: string): Promise<T> => {
      // Implementation with caching and error handling
    }
  };
};
```

### Third-Party Service Integration
- **Payment Processing**: Secure payment gateway integration
- **Email Notifications**: Transactional email service
- **SMS Notifications**: Appointment reminders and confirmations
- **Calendar Systems**: Staff scheduling and availability management

## 🎯 Best Practices

### Service Design
1. **Interface Segregation**: Small, focused service interfaces
2. **Dependency Injection**: Testable service dependencies
3. **Error Handling**: Comprehensive error classification and handling
4. **Logging**: Structured logging for debugging and monitoring
5. **Documentation**: Clear API documentation with examples

### Code Quality
```typescript
// ✅ Good: Clear service interface
interface BookingService {
  readonly submitBooking: (data: BookingFormData) => Promise<ApiResponse<string>>;
  readonly checkAvailability: (date: string, time: string) => Promise<ApiResponse<boolean>>;
  readonly getAvailableTimeSlots: (date: string) => Promise<ApiResponse<string[]>>;
}

// ✅ Good: Immutable response pattern
const createSuccessResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data
});

const createErrorResponse = (error: AppError): ApiResponse<never> => ({
  success: false,
  error
});
```

### Security Standards
1. **Input Validation**: Server-side validation for all inputs
2. **Output Encoding**: Proper encoding for all outputs
3. **Authentication**: Secure authentication and authorization
4. **Audit Logging**: Security event logging and monitoring
5. **Rate Limiting**: Protection against abuse and DOS attacks

---

**Next Steps**: Explore [Types Documentation](../types/README.md) for comprehensive type definitions and interfaces.