# Feature Components Documentation

## 🎯 Business Logic Layer Architecture

This directory contains page-specific feature components that implement core business functionality. Following **Clean Architecture** principles, these components orchestrate business logic, handle user interactions, and provide the primary application features.

### Design Principles
- **Business-Focused**: Each component represents a distinct business capability
- **Clean Separation**: UI presentation separated from business logic
- **Type Safety**: Comprehensive TypeScript integration
- **Performance Optimized**: Lazy loading and efficient rendering
- **Accessibility-First**: WCAG 2.1 AA compliance throughout

## 📦 Feature Component Library

### HomePage (`HomePage.tsx`)
**Purpose**: Landing page showcasing services, testimonials, and call-to-action
**Business Value**: First impression, service discovery, conversion optimization
**Key Features**: Hero section, service overview, social proof, booking CTA

```typescript
// Key business logic
- Service showcase with pricing
- Customer testimonials for social proof
- Strategic call-to-action placement
- SEO optimization for local search
```

### AboutPage (`AboutPage.tsx`)
**Purpose**: Team introduction and business credibility building
**Business Value**: Builds trust, showcases expertise, humanizes brand
**Key Features**: Team profiles, business story, specialties display

```typescript
// Key business logic
- Team member showcase with specialties
- Business history and values
- Credentials and experience highlights
- Trust-building social proof elements
```

### BookingPage (`BookingPage.tsx`)
**Purpose**: Core appointment booking functionality
**Business Value**: Primary revenue generation, customer acquisition
**Key Features**: Service selection, date/time picker, customer information form

```typescript
// Key business logic
- Multi-step booking process
- Real-time availability checking
- Form validation and data persistence
- Integration with booking service layer
```

### ContactPage (`ContactPage.tsx`)
**Purpose**: Customer communication and location information
**Business Value**: Customer support, location discovery, inquiry handling
**Key Features**: Contact form, business information, location details

```typescript
// Key business logic
- Contact form with validation
- Business hours and location display
- Multiple communication channels
- Local business information for SEO
```

## 🏗️ Component Architecture Patterns

### Business Logic Integration
```typescript
const BookingPage: React.FC = () => {
  // Context integration for state management
  const { state, updateBookingData, setError } = useApp();
  
  // Custom hooks for business logic
  const { submitBooking, checkAvailability } = useBookingService();
  const { trackPageView, trackEvent } = useAnalytics();
  
  // SEO optimization
  useSEO(SEO_CONFIGS.booking);
  
  useEffect(() => {
    trackPageView('booking_page');
  }, [trackPageView]);

  return (
    <div>
      {/* Component implementation */}
    </div>
  );
};
```

### Form State Management
```typescript
const useBookingForm = () => {
  const { state, updateBookingData } = useApp();
  const [errors, setErrors] = useState<ValidationErrors>({});
  
  const validateAndUpdate = useCallback((field: string, value: string) => {
    // Clear previous errors
    setErrors(prev => ({ ...prev, [field]: null }));
    
    // Update form data
    updateBookingData({ [field]: value });
    
    // Validate field
    const fieldErrors = validateField(field, value);
    if (fieldErrors.length > 0) {
      setErrors(prev => ({ ...prev, [field]: fieldErrors[0] }));
    }
  }, [updateBookingData]);

  return {
    formData: state.bookingData,
    errors,
    updateField: validateAndUpdate,
    isValid: Object.keys(errors).length === 0
  };
};
```

### Service Integration Pattern
```typescript
const useFeatureLogic = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const executeBusinessOperation = useCallback(async (data: BusinessData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await businessService.operation(data);
      
      // Analytics tracking
      analytics.track('business_operation_success', {
        operation: 'booking_submission',
        data: result
      });
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Operation failed';
      setError(errorMessage);
      
      // Error tracking
      analytics.track('business_operation_error', {
        operation: 'booking_submission',
        error: errorMessage
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    executeOperation: executeBusinessOperation
  };
};
```

## 🎯 Business Feature Implementation

### Multi-Step Booking Process
```typescript
type BookingStep = 'service' | 'datetime' | 'details' | 'confirmation';

const BookingWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<BookingStep>('service');
  const { formData, updateField, isStepValid } = useBookingForm();

  const steps: Record<BookingStep, React.ComponentType> = {
    service: ServiceSelection,
    datetime: DateTimeSelection,
    details: CustomerDetails,
    confirmation: BookingConfirmation
  };

  const nextStep = () => {
    if (!isStepValid(currentStep)) return;
    
    const stepOrder: BookingStep[] = ['service', 'datetime', 'details', 'confirmation'];
    const currentIndex = stepOrder.indexOf(currentStep);
    
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const CurrentStepComponent = steps[currentStep];
  
  return (
    <div>
      <BookingProgress currentStep={currentStep} />
      <CurrentStepComponent 
        data={formData}
        onUpdate={updateField}
        onNext={nextStep}
      />
    </div>
  );
};
```

### Real-Time Availability Checking
```typescript
const DateTimeSelection: React.FC = () => {
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const { checkAvailability } = useBookingService();

  const loadAvailableSlots = useCallback(async (date: string) => {
    setLoading(true);
    
    try {
      const slots = await generateTimeSlots(new Date(date));
      
      // Check availability for each slot
      const slotsWithAvailability = await Promise.all(
        slots.map(async (slot) => {
          const available = await checkAvailability(date, slot.time);
          return { ...slot, available: available.success && available.data };
        })
      );
      
      setAvailableSlots(slotsWithAvailability);
    } catch (error) {
      console.error('Failed to load available slots:', error);
    } finally {
      setLoading(false);
    }
  }, [checkAvailability]);

  return (
    <div>
      <DatePicker onDateChange={loadAvailableSlots} />
      {loading ? (
        <TimeSlotsSkeleton />
      ) : (
        <TimeSlotGrid slots={availableSlots} />
      )}
    </div>
  );
};
```

### Social Proof Integration
```typescript
const TestimonialsSection: React.FC = () => {
  const [displayedTestimonials, setDisplayedTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    // Filter and sort testimonials for optimal social proof
    const topTestimonials = TESTIMONIALS
      .filter(t => t.verified && t.rating >= 5)
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 3);
    
    setDisplayedTestimonials(topTestimonials);
  }, []);

  return (
    <section aria-labelledby="testimonials-heading">
      <h2 id="testimonials-heading">What Our Customers Say</h2>
      <div className="testimonials-grid">
        {displayedTestimonials.map(testimonial => (
          <TestimonialCard 
            key={testimonial.id}
            testimonial={testimonial}
          />
        ))}
      </div>
    </section>
  );
};
```

## 🔧 Performance Optimization

### Lazy Loading Implementation
```typescript
// Lazy load heavy feature components
const BookingPage = lazy(() => import('./BookingPage'));
const AboutPage = lazy(() => import('./AboutPage'));

const FeatureRouter: React.FC = () => {
  const { state } = useApp();
  
  return (
    <Suspense fallback={<PageLoadingSkeleton />}>
      {state.activeTab === 'booking' && <BookingPage />}
      {state.activeTab === 'about' && <AboutPage />}
    </Suspense>
  );
};
```

### Image Optimization
```typescript
const OptimizedHeroImage: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div className="hero-image-container">
      {!loaded && <ImageSkeleton />}
      <img
        src="/images/hero-barbershop.webp"
        alt="Modern barbershop interior"
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={cn(
          'hero-image',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
      />
    </div>
  );
};
```

### Data Fetching Optimization
```typescript
const useOptimizedDataFetching = (key: string, fetcher: () => Promise<any>) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchRef = useRef<Promise<any> | null>(null);

  useEffect(() => {
    // Prevent duplicate requests
    if (fetchRef.current) {
      return;
    }

    fetchRef.current = fetcher()
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(error => {
        console.error(`Failed to fetch ${key}:`, error);
        setLoading(false);
      })
      .finally(() => {
        fetchRef.current = null;
      });
  }, [key, fetcher]);

  return { data, loading };
};
```

## 🧪 Testing Strategy

### Feature Testing
```typescript
describe('BookingPage', () => {
  test('should complete booking flow successfully', async () => {
    render(
      <AppProvider>
        <BookingPage />
      </AppProvider>
    );

    // Select service
    const serviceSelect = screen.getByRole('combobox', { name: /service/i });
    fireEvent.change(serviceSelect, { target: { value: 'classic-cut' } });

    // Select date
    const dateInput = screen.getByRole('textbox', { name: /date/i });
    fireEvent.change(dateInput, { target: { value: '2024-03-15' } });

    // Select time
    const timeButton = await screen.findByRole('button', { name: /14:00/i });
    fireEvent.click(timeButton);

    // Fill customer details
    const nameInput = screen.getByRole('textbox', { name: /full name/i });
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

    // Submit booking
    const submitButton = screen.getByRole('button', { name: /book appointment/i });
    fireEvent.click(submitButton);

    // Verify confirmation
    await waitFor(() => {
      expect(screen.getByText(/booking confirmed/i)).toBeInTheDocument();
    });
  });
});
```

### Business Logic Testing
```typescript
describe('Booking Business Logic', () => {
  test('should validate booking data correctly', () => {
    const validData: BookingFormData = {
      service: 'classic-cut',
      date: '2024-03-15',
      time: '14:00',
      fullName: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '555-1234',
      specialRequests: ''
    };

    const errors = validateBookingForm(validData);
    expect(errors).toHaveLength(0);
  });

  test('should handle availability checking', async () => {
    const mockCheckAvailability = jest.fn().mockResolvedValue({
      success: true,
      data: true
    });

    const availability = await mockCheckAvailability('2024-03-15', '14:00');
    
    expect(availability.success).toBe(true);
    expect(availability.data).toBe(true);
  });
});
```

## 🎯 Best Practices

### Component Design
1. **Single Responsibility**: Each feature component handles one business area
2. **Business Logic Separation**: Logic in custom hooks, UI in components
3. **Error Boundaries**: Graceful error handling for each feature
4. **Performance**: Lazy loading and optimization for large features
5. **Accessibility**: Full WCAG 2.1 AA compliance

### Code Quality
```typescript
// ✅ Good: Clean feature component structure
const FeaturePage: React.FC = () => {
  // Hooks for business logic
  const businessLogic = useFeatureLogic();
  const { state, actions } = useFeatureState();
  
  // SEO and analytics
  useSEO(featureConfig.seo);
  useAnalytics(featureConfig.analytics);
  
  // Performance monitoring
  const { startRender, endRender } = usePerformanceMonitor('FeaturePage');
  
  useEffect(() => {
    startRender();
    return endRender;
  }, [startRender, endRender]);

  return (
    <section>
      {/* Component implementation */}
    </section>
  );
};
```

### Integration Patterns
- **Context Integration**: Use application context for global state
- **Service Layer**: Business operations through service layer
- **Analytics**: Track user interactions and business metrics
- **SEO**: Optimize each page for search engines
- **Performance**: Monitor and optimize rendering performance

---

**Next Steps**: Review the complete documentation system and implementation for the MP Barbers application architecture.