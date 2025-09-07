# Types Documentation

## 🎯 Type System Architecture

This directory contains the comprehensive TypeScript type definitions that form the foundation of the application's type safety system. Following **Clean Architecture** principles, these types represent domain entities, value objects, and interface contracts throughout the application.

### Type Design Principles
- **Domain-Driven Design**: Types reflect business domain concepts
- **Immutability**: All interfaces use readonly properties
- **Type Safety**: Comprehensive type coverage preventing runtime errors
- **Interface Segregation**: Focused, single-purpose type definitions
- **Composability**: Types designed for composition and extension

## 📦 Type Categories

### Domain Types

#### Business Entities
Core business objects representing real-world concepts:

```typescript
interface Service {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly duration: number; // minutes
  readonly description?: string;
  readonly category: ServiceCategory;
}

interface BookingDetails {
  readonly service: Service;
  readonly date: Date;
  readonly time: string;
  readonly customer: CustomerInfo;
  readonly specialRequests?: string;
}
```

#### Value Objects
Immutable objects representing business values:

```typescript
interface CustomerInfo {
  readonly fullName: string;
  readonly email: string;
  readonly phoneNumber: string;
}

interface ContactInfo {
  readonly address: BusinessAddress;
  readonly phone: string;
  readonly email: string;
  readonly socialMedia: SocialMediaLinks;
}
```

### Component Types

#### Props Interfaces
Type-safe component prop definitions:

```typescript
interface BaseComponentProps {
  readonly className?: string;
  readonly children?: React.ReactNode;
  readonly id?: string;
  readonly 'aria-label'?: string;
}

interface ButtonProps extends BaseComponentProps {
  readonly variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  readonly size?: 'sm' | 'md' | 'lg';
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly onClick?: () => void;
}
```

### API Types

#### Request/Response Patterns
Consistent API communication types:

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

### Form Types

#### Form Data Interfaces
Type-safe form handling:

```typescript
interface BookingFormData {
  service: string;
  date: string;
  time: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  specialRequests: string;
}

interface ContactFormData {
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
}
```

## 🏗️ Type Architecture Patterns

### Union Types for Business Logic
```typescript
// Service categories with business meaning
type ServiceCategory = 'haircut' | 'beard' | 'styling' | 'kids';

// Navigation states reflecting user journey
type NavigationTab = 'home' | 'about' | 'booking' | 'contact';

// Booking process steps for state management
type BookingStep = 'service' | 'datetime' | 'details' | 'confirmation';
```

### Generic Types for Reusability
```typescript
// Generic API response for any data type
interface ApiResponse<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: AppError;
}

// Generic form state for any form data
interface FormState<T> {
  readonly data: T;
  readonly errors: Partial<Record<keyof T, string>>;
  readonly isSubmitting: boolean;
  readonly isValid: boolean;
}
```

### Mapped Types for Flexibility
```typescript
// Make all properties optional for partial updates
type PartialUpdate<T> = Partial<T>;

// Extract only string properties for form fields
type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

// Create form validation rules from data types
type ValidationRules<T> = {
  readonly [K in keyof T]?: Array<(value: T[K]) => string | null>;
};
```

## 🔒 Type Safety Patterns

### Readonly Interfaces
All interfaces use readonly properties to prevent mutations:

```typescript
// ✅ Good: Immutable interface
interface Service {
  readonly id: string;
  readonly name: string;
  readonly price: number;
}

// ❌ Bad: Mutable interface
interface Service {
  id: string;        // Can be accidentally modified
  name: string;      // Can be accidentally modified
  price: number;     // Can be accidentally modified
}
```

### Discriminated Unions
Type-safe state management with discriminated unions:

```typescript
type LoadingState = 
  | { readonly status: 'idle' }
  | { readonly status: 'loading' }
  | { readonly status: 'success'; readonly data: unknown }
  | { readonly status: 'error'; readonly error: AppError };

const handleState = (state: LoadingState) => {
  switch (state.status) {
    case 'idle':
      return 'Ready to start';
    case 'loading':
      return 'Loading...';
    case 'success':
      return `Data: ${state.data}`; // TypeScript knows data exists
    case 'error':
      return `Error: ${state.error.message}`; // TypeScript knows error exists
  }
};
```

### Branded Types
Prevent primitive obsession with branded types:

```typescript
// Create branded types for domain-specific values
type BookingId = string & { readonly brand: 'BookingId' };
type CustomerId = string & { readonly brand: 'CustomerId' };
type ServiceId = string & { readonly brand: 'ServiceId' };

// Factory functions ensure type safety
const createBookingId = (id: string): BookingId => {
  // Validation logic here
  return id as BookingId;
};

// Prevents mixing different ID types
const processBooking = (bookingId: BookingId, customerId: CustomerId) => {
  // TypeScript prevents passing wrong ID type
};
```

## 🎯 Type Composition Patterns

### Interface Extension
```typescript
// Base component props
interface BaseComponentProps {
  readonly className?: string;
  readonly children?: React.ReactNode;
}

// Extended props for specific components
interface ButtonProps extends BaseComponentProps {
  readonly variant?: ButtonVariant;
  readonly onClick?: () => void;
}

interface InputProps extends BaseComponentProps {
  readonly value?: string;
  readonly onChange?: (value: string) => void;
}
```

### Type Intersection
```typescript
// Combine multiple type concerns
type InteractiveElement = {
  readonly onClick?: () => void;
  readonly onKeyDown?: (event: KeyboardEvent) => void;
};

type AccessibleElement = {
  readonly 'aria-label'?: string;
  readonly role?: string;
  readonly tabIndex?: number;
};

// Combine for comprehensive component props
type ButtonProps = BaseComponentProps & InteractiveElement & AccessibleElement & {
  readonly variant?: ButtonVariant;
};
```

### Conditional Types
```typescript
// Conditional type based on component variant
type ButtonProps<V extends ButtonVariant> = {
  readonly variant: V;
  readonly onClick: () => void;
} & (V extends 'loading' 
  ? { readonly loadingText?: string }
  : {}
);

// Usage provides type safety based on variant
const LoadingButton = (props: ButtonProps<'loading'>) => {
  // TypeScript knows loadingText is available
  return <button>{props.loadingText || 'Loading...'}</button>;
};
```

## 🧪 Type Testing

### Type-Level Testing
```typescript
// Utility types for testing type correctness
type Expect<T extends true> = T;
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) 
  ? true 
  : false;

// Test type definitions
type TestCases = [
  Expect<Equal<ServiceCategory, 'haircut' | 'beard' | 'styling' | 'kids'>>,
  Expect<Equal<keyof ButtonProps, 'variant' | 'size' | 'disabled' | 'onClick' | 'className'>>,
];
```

### Runtime Type Validation
```typescript
// Runtime type guards for API responses
const isService = (obj: unknown): obj is Service => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'price' in obj &&
    typeof (obj as Service).id === 'string' &&
    typeof (obj as Service).name === 'string' &&
    typeof (obj as Service).price === 'number'
  );
};

// Use type guards for safe API data handling
const processApiResponse = (response: unknown) => {
  if (isService(response)) {
    // TypeScript now knows response is Service type
    console.log(`Service: ${response.name} - $${response.price}`);
  }
};
```

## 📊 Type Documentation Best Practices

### JSDoc Integration
```typescript
/**
 * Represents a barbershop service offering
 * 
 * @interface Service
 * @property id - Unique service identifier
 * @property name - Display name for the service
 * @property price - Service price in cents to avoid floating point issues
 * @property duration - Service duration in minutes for scheduling
 * @property category - Service category for filtering and organization
 */
interface Service {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly duration: number;
  readonly category: ServiceCategory;
}
```

### Example Usage Documentation
```typescript
/**
 * @example
 * ```typescript
 * const haircut: Service = {
 *   id: 'classic-cut',
 *   name: 'Classic Cut',
 *   price: 3500, // $35.00 in cents
 *   duration: 30,
 *   category: 'haircut'
 * };
 * ```
 */
```

## 🔗 Type Dependencies

### Internal Type Relationships
```
Domain Types
├── Service → ServiceCategory
├── Booking → BookingDetails → CustomerInfo
├── Testimonial → Rating (number)
└── BusinessHours → TimeSlot

Component Types
├── BaseComponentProps (foundation)
├── ButtonProps extends BaseComponentProps
├── InputProps extends BaseComponentProps
└── CardProps extends BaseComponentProps

API Types
├── ApiResponse<T> (generic)
├── AppError (error handling)
└── Form Types → Domain Types
```

### External Dependencies
- **React**: React.ReactNode, React.ComponentProps
- **DOM**: Event types, HTML attributes
- **JavaScript**: Built-in types (Date, string, number)

## 🎯 Migration and Evolution

### Type Evolution Strategy
```typescript
// Version 1: Initial type
interface ServiceV1 {
  readonly id: string;
  readonly name: string;
  readonly price: number;
}

// Version 2: Extended type (backward compatible)
interface ServiceV2 extends ServiceV1 {
  readonly duration?: number; // Optional for backward compatibility
  readonly category?: ServiceCategory;
}

// Version 3: Breaking change with migration path
interface ServiceV3 {
  readonly id: string;
  readonly name: string;
  readonly pricing: {
    readonly amount: number;
    readonly currency: string;
  };
  readonly duration: number; // Now required
  readonly category: ServiceCategory; // Now required
}
```

### Deprecation Patterns
```typescript
/**
 * @deprecated Use ServiceV3 instead. Will be removed in v2.0.0
 * @see ServiceV3
 */
interface ServiceV2 extends ServiceV1 {
  readonly duration?: number;
}
```

---

**Next Steps**: Explore [Utils Documentation](../utils/README.md) for utility functions and helper methods.