/**
 * Core domain types for the MP Barbers application
 * These types represent the business entities and value objects
 */

export interface Service {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly duration: number; // in minutes
  readonly description?: string;
  readonly category: ServiceCategory;
}

export interface TimeSlot {
  readonly time: string;
  readonly available: boolean;
  readonly date: Date;
}

export interface BookingDetails {
  readonly service: Service;
  readonly date: Date;
  readonly time: string;
  readonly customer: CustomerInfo;
  readonly specialRequests?: string;
}

export interface CustomerInfo {
  readonly fullName: string;
  readonly email: string;
  readonly phoneNumber: string;
}

export interface ContactMessage {
  readonly name: string;
  readonly email: string;
  readonly phoneNumber?: string;
  readonly message: string;
  readonly timestamp: Date;
}

export interface TeamMember {
  readonly id: string;
  readonly name: string;
  readonly title: string;
  readonly bio?: string;
  readonly imageUrl?: string;
  readonly specialties: string[];
}

export interface Testimonial {
  readonly id: string;
  readonly customerName: string;
  readonly rating: number;
  readonly comment: string;
  readonly date: Date;
  readonly verified: boolean;
}

export interface BusinessHours {
  readonly [key: string]: {
    readonly open: string;
    readonly close: string;
    readonly closed: boolean;
  };
}

export interface ContactInfo {
  readonly address: {
    readonly street: string;
    readonly city: string;
    readonly state: string;
    readonly zipCode: string;
  };
  readonly phone: string;
  readonly email: string;
  readonly socialMedia: {
    readonly instagram?: string;
    readonly facebook?: string;
  };
}

// Enums and Union Types
export type ServiceCategory = 'haircut' | 'beard' | 'styling' | 'kids' | 'extra';

export type NavigationTab = 'home' | 'about' | 'services' | 'contact';

export type BookingStep = 'service' | 'datetime' | 'details' | 'confirmation';

// Form Types
export interface ContactFormData {
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
}

// Error Types
export interface AppError {
  readonly message: string;
  readonly code: string;
  readonly details?: unknown;
}

// API Response Types
export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: AppError;
}

// Component Props Types
export interface BaseComponentProps {
  readonly className?: string;
  readonly children?: React.ReactNode;
  readonly id?: string;
  readonly 'aria-label'?: string;
  readonly style?: React.CSSProperties;
}

export interface ButtonProps extends BaseComponentProps {
  readonly variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  readonly size?: 'sm' | 'md' | 'lg';
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly onClick?: () => void;
  readonly type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends BaseComponentProps {
  readonly type?: 'text' | 'email' | 'tel' | 'date' | 'time';
  readonly placeholder?: string;
  readonly value?: string;
  readonly onChange?: (value: string) => void;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly error?: string;
  readonly min?: string;
  readonly max?: string;
}
