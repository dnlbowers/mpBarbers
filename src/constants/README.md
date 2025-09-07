# Constants Documentation

## 🏛️ Configuration Layer Architecture

This directory contains the centralized configuration and business constants that define the application's behavior, business rules, and operational parameters. Following **Clean Architecture** principles, these constants serve as the single source of truth for all business logic and configuration settings.

### Design Principles
- **Single Source of Truth**: Centralized configuration prevents inconsistencies
- **Immutability**: All constants use `as const` for type safety and immutability
- **Business Logic Separation**: Business rules isolated from implementation details
- **Type Safety**: Comprehensive TypeScript integration with domain types
- **Maintainability**: Easy updates to business rules without code changes

## 📦 Configuration Categories

### Business Services Configuration

#### SERVICES
**Purpose**: Complete service catalog with pricing and scheduling information
**Business Value**: Centralized service management for consistent pricing and availability
**Integration**: Used by booking system, pricing displays, and service selection

```typescript
const classicCut = SERVICES.find(s => s.id === 'classic-cut');
// { id: 'classic-cut', name: 'Classic Cut', price: 35, duration: 30, ... }
```

#### SERVICE_CATEGORIES
**Purpose**: Service categorization for organization and filtering
**Business Logic**: Enables service grouping and improved navigation
**UI Integration**: Powers service filtering and categorized displays

```typescript
const haircutCategory = SERVICE_CATEGORIES.haircut;
// { label: 'Hair Cuts', description: 'Professional haircut services', ... }
```

### Scheduling Configuration

#### TIME_SLOTS
**Purpose**: Available appointment time slots for booking system
**Business Rules**: 30-minute intervals with lunch break consideration
**Scheduling Integration**: Core component of availability calculation

```typescript
const morningSlots = TIME_SLOTS.filter(slot => slot < '12:00');
// ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30']
```

#### BUSINESS_HOURS
**Purpose**: Weekly operating schedule for appointment validation
**Operational Rules**: Defines when services are available
**System Integration**: Used by booking validation and availability checks

```typescript
const mondayHours = BUSINESS_HOURS.monday;
// { open: '09:00', close: '18:00', closed: false }
```

### Business Information

#### CONTACT_INFO
**Purpose**: Centralized business contact information
**SEO Integration**: Structured data for local business optimization
**Customer Communication**: Consistent contact details across all interfaces

```typescript
const businessAddress = CONTACT_INFO.address;
// { street: '123 Main Street', city: 'Downtown District', ... }
```

#### TEAM_MEMBERS
**Purpose**: Staff directory with specialties and hierarchy
**Business Value**: Builds customer trust and enables service personalization
**Content Management**: Powers about page and staff-related features

```typescript
const masterBarber = TEAM_MEMBERS.find(member => member.title.includes('Master'));
// { id: 'marcus', name: 'Marcus', title: 'Master Barber & Owner', ... }
```

### Social Proof Configuration

#### TESTIMONIALS
**Purpose**: Customer reviews and ratings for social proof
**Business Impact**: Increases conversion rates and builds trust
**Content Strategy**: Verified testimonials for credibility

```typescript
const recentTestimonials = TESTIMONIALS
  .filter(t => t.verified)
  .sort((a, b) => b.date.getTime() - a.date.getTime())
  .slice(0, 3);
```

### Application Configuration

#### APP_CONFIG
**Purpose**: Core application settings and business rules
**Operational Control**: Centralized configuration for easy updates
**Internationalization**: Locale and currency settings

```typescript
const bookingWindow = {
  minHours: APP_CONFIG.minBookingHoursAhead,
  maxDays: APP_CONFIG.maxBookingDaysAhead
};
```

#### BUSINESS_POLICIES
**Purpose**: Business rules and operational policies
**Legal Compliance**: Terms and conditions enforcement
**Operational Consistency**: Standardized policy application

```typescript
const cancellationPolicy = BUSINESS_POLICIES.booking.cancellationDeadlineHours;
// 24 hours advance notice required
```

### User Interface Configuration

#### NAVIGATION_ITEMS
**Purpose**: Primary navigation structure with accessibility
**UX Consistency**: Standardized navigation across components
**Accessibility**: ARIA labels for screen reader compatibility

```typescript
const bookingNav = NAVIGATION_ITEMS.find(item => item.key === 'booking');
// { key: 'booking', label: 'Book Now', ariaLabel: 'Book an appointment online' }
```

#### ERROR_MESSAGES
**Purpose**: Centralized error message definitions
**User Experience**: Consistent, helpful error communication
**Internationalization**: Centralized strings for translation

```typescript
const validationErrors = ERROR_MESSAGES.validation;
// { required: 'This field is required', invalidEmail: '...', ... }
```

## 🏗️ Configuration Architecture Patterns

### Immutable Configuration
```typescript
// ✅ Good: Immutable configuration with type safety
export const SERVICE_CONFIG = {
  pricing: {
    currency: 'EUR',
    taxRate: 0.2,
    discountThreshold: 100
  },
  scheduling: {
    slotDuration: 30,
    bufferTime: 10,
    maxAdvanceBooking: 30
  }
} as const;

// Type-safe access
type ServiceConfig = typeof SERVICE_CONFIG;
type PricingConfig = ServiceConfig['pricing'];
```

### Hierarchical Configuration
```typescript
const FEATURE_FLAGS = {
  booking: {
    enabled: true,
    onlinePayment: false,
    multipleServices: true,
    staffSelection: false
  },
  notifications: {
    email: true,
    sms: false,
    push: false
  },
  analytics: {
    enabled: process.env.NODE_ENV === 'production',
    trackingId: process.env.REACT_APP_GA_ID
  }
} as const;
```

### Environment-Specific Configuration
```typescript
const createConfig = (env: string) => {
  const baseConfig = {
    name: 'MP BARBERS',
    version: '1.0.0'
  };

  const environmentConfig = {
    development: {
      ...baseConfig,
      apiUrl: 'http://localhost:3001',
      debug: true
    },
    production: {
      ...baseConfig,
      apiUrl: 'https://api.mpbarbers.com',
      debug: false
    }
  };

  return environmentConfig[env as keyof typeof environmentConfig] || environmentConfig.development;
};

export const APP_CONFIG = createConfig(process.env.NODE_ENV || 'development');
```

## 🔧 Business Rules Implementation

### Booking Rules Engine
```typescript
export const BOOKING_RULES = {
  validation: {
    minAdvanceHours: 2,
    maxAdvanceDays: 30,
    businessHoursOnly: true,
    requiresCustomerInfo: true
  },
  
  availability: {
    checkConflicts: true,
    allowOverbooking: false,
    staffCapacity: 4,
    bufferBetweenServices: 10 // minutes
  },
  
  modifications: {
    cancelDeadlineHours: 24,
    rescheduleDeadlineHours: 4,
    noShowPolicy: 'charge_full'
  }
} as const;

// Usage in booking validation
const isValidBookingTime = (date: Date, time: string): boolean => {
  const rules = BOOKING_RULES.validation;
  const now = new Date();
  const bookingDateTime = new Date(`${date.toDateString()} ${time}`);
  
  const hoursAhead = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  const daysAhead = Math.ceil(hoursAhead / 24);
  
  return hoursAhead >= rules.minAdvanceHours && daysAhead <= rules.maxAdvanceDays;
};
```

### Service Pricing Logic
```typescript
export const PRICING_RULES = {
  base: {
    currency: 'EUR',
    taxIncluded: true,
    roundingStrategy: 'none'
  },
  
  discounts: {
    multipleServices: {
      threshold: 2,
      percentage: 0.1
    },
    loyalty: {
      visitsRequired: 10,
      percentage: 0.15
    }
  },
  
  surcharges: {
    weekend: {
      days: ['saturday'],
      percentage: 0.1
    },
    rush: {
      enabled: false,
      percentage: 0.2
    }
  }
} as const;
```

## 📊 Configuration Management

### Dynamic Configuration Loading
```typescript
interface ConfigSource {
  local: () => Promise<Record<string, any>>;
  remote: (url: string) => Promise<Record<string, any>>;
  environment: () => Record<string, any>;
}

const configLoader = {
  async loadConfig(sources: (keyof ConfigSource)[] = ['environment', 'local']): Promise<AppConfig> {
    const configs = await Promise.all(
      sources.map(source => this.configSources[source]())
    );
    
    return configs.reduce((merged, config) => ({ ...merged, ...config }), {});
  },
  
  configSources: {
    environment: () => ({
      apiUrl: process.env.REACT_APP_API_URL,
      analytics: process.env.REACT_APP_ANALYTICS_ID
    }),
    
    local: async () => {
      try {
        const response = await fetch('/config.json');
        return response.json();
      } catch {
        return {};
      }
    },
    
    remote: async (url: string) => {
      const response = await fetch(url);
      return response.json();
    }
  }
};
```

### Configuration Validation
```typescript
const validateConfig = (config: unknown): config is AppConfig => {
  const required = [
    'name',
    'maxBookingDaysAhead',
    'minBookingHoursAhead',
    'defaultCurrency'
  ];
  
  return required.every(key => key in (config as object));
};

const safeConfig = (config: unknown): AppConfig => {
  if (validateConfig(config)) {
    return config;
  }
  
  console.warn('Invalid configuration, using defaults');
  return DEFAULT_CONFIG;
};
```

## 🧪 Testing Configuration

### Configuration Testing
```typescript
describe('Application Configuration', () => {
  test('services have required properties', () => {
    SERVICES.forEach(service => {
      expect(service).toHaveProperty('id');
      expect(service).toHaveProperty('name');
      expect(service).toHaveProperty('price');
      expect(service).toHaveProperty('duration');
      expect(service.price).toBeGreaterThan(0);
      expect(service.duration).toBeGreaterThan(0);
    });
  });
  
  test('business hours are consistent', () => {
    Object.values(BUSINESS_HOURS).forEach(hours => {
      if (!hours.closed) {
        expect(hours.open).toMatch(/^\d{2}:\d{2}$/);
        expect(hours.close).toMatch(/^\d{2}:\d{2}$/);
      }
    });
  });
  
  test('time slots are in chronological order', () => {
    for (let i = 1; i < TIME_SLOTS.length; i++) {
      const prev = TIME_SLOTS[i - 1];
      const curr = TIME_SLOTS[i];
      expect(curr > prev).toBe(true);
    }
  });
});
```

### Business Rules Testing
```typescript
describe('Business Rules', () => {
  test('booking advance time rules', () => {
    const minHours = APP_CONFIG.minBookingHoursAhead;
    const maxDays = APP_CONFIG.maxBookingDaysAhead;
    
    expect(minHours).toBeGreaterThan(0);
    expect(maxDays).toBeGreaterThan(0);
    expect(maxDays * 24).toBeGreaterThan(minHours);
  });
  
  test('service pricing consistency', () => {
    const prices = SERVICES.map(s => s.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    expect(minPrice).toBeGreaterThan(0);
    expect(maxPrice).toBeLessThan(1000); // Reasonable upper bound
  });
});
```

## 🎯 Best Practices

### Configuration Design
1. **Immutability**: Use `as const` for all configuration objects
2. **Type Safety**: Leverage TypeScript for configuration validation
3. **Single Source**: Centralize related configuration in one place
4. **Documentation**: Clear comments explaining business rules
5. **Validation**: Runtime validation for critical configuration

### Maintenance Strategies
```typescript
// ✅ Good: Versioned configuration with migration support
export const CONFIG_VERSION = '1.2.0';

export const LEGACY_CONFIG = {
  v1_0: {
    // Legacy configuration for migration support
  },
  v1_1: {
    // Previous version configuration
  }
};

// Configuration migration helper
const migrateConfig = (version: string, config: any): AppConfig => {
  // Migration logic based on version
  switch (version) {
    case '1.0.0':
      return migrateFromV1_0(config);
    case '1.1.0':
      return migrateFromV1_1(config);
    default:
      return config;
  }
};
```

### Performance Considerations
- **Lazy Loading**: Load configuration only when needed
- **Caching**: Cache expensive configuration calculations
- **Memoization**: Memoize configuration-based computations
- **Tree Shaking**: Structure exports for optimal bundling

---

**Next Steps**: Explore [Contexts Documentation](../contexts/README.md) for state management and application context patterns.