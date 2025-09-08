import type { Service, BusinessHours, ContactInfo, TeamMember, Testimonial } from '../types';

/**
 * Business Service Catalog
 * 
 * @description Defines the complete service offerings with pricing, duration, and categorization.
 * This centralized service catalog ensures consistency across booking, pricing displays,
 * and service selection interfaces throughout the application.
 * 
 * @readonly Immutable service definitions prevent accidental modifications
 */
export const SERVICES: readonly Service[] = [
  // Hair Services
  {
    id: 'skin-fade',
    name: 'Skin fade',
    price: 12,
    duration: 30,
    description: 'Professional skin fade haircut',
    category: 'haircut',
  },
  {
    id: 'scissor-cut',
    name: 'Scissor cut',
    price: 14,
    duration: 30,
    description: 'Classic scissor cut styling',
    category: 'haircut',
  },
  {
    id: 'kids-cut-under-12',
    name: 'Kids Cut (under 12)',
    price: 10,
    duration: 30,
    description: 'Gentle haircuts for children under 12',
    category: 'kids',
  },
  // Beard Services
  {
    id: 'beard-grooming',
    name: 'Beard grooming',
    price: 6,
    duration: 15,
    description: 'Professional beard trimming and shaping',
    category: 'beard',
  },
  {
    id: 'hot-towel-beard-grooming',
    name: 'Hot towel beard grooming',
    price: 8,
    duration: 15,
    description: 'Beard grooming with relaxing hot towel treatment',
    category: 'beard',
  },
  {
    id: 'hot-towel-beard-clean-shave',
    name: 'Hot towel beard clean shave',
    price: 8,
    duration: 15,
    description: 'Traditional hot towel clean shave experience',
    category: 'beard',
  },
  // Extra Services
  {
    id: 'shampoo',
    name: 'Shampoo',
    price: 3,
    duration: 5,
    description: 'Professional hair wash and conditioning',
    category: 'extra',
  },
  {
    id: 'eyebrows-waxing',
    name: 'Eyebrows waxing',
    price: 3,
    duration: 5,
    description: 'Precise eyebrow shaping with wax',
    category: 'extra',
  },
  {
    id: 'ear-waxing',
    name: 'Ear waxing',
    price: 3,
    duration: 5,
    description: 'Clean ear hair removal service',
    category: 'extra',
  },
  {
    id: 'nose-waxing',
    name: 'Nose waxing',
    price: 3,
    duration: 5,
    description: 'Professional nose hair removal',
    category: 'extra',
  },
  {
    id: 'complete-waxing-service',
    name: 'Complete waxing service',
    price: 7,
    duration: 10,
    description: 'Comprehensive facial hair grooming',
    category: 'extra',
  },
  {
    id: 'black-mask',
    name: 'Black mask',
    price: 5,
    duration: 5,
    description: 'Deep cleansing black mask treatment',
    category: 'extra',
  },
] as const;

/**
 * Available Appointment Time Slots
 * 
 * @description Defines the standard appointment time slots available for booking.
 * These slots align with business operations and staff scheduling requirements,
 * ensuring optimal resource utilization and customer service delivery.
 * 
 * @business_rule 30-minute intervals with lunch break from 12:30-14:00
 */
export const TIME_SLOTS: readonly string[] = [
  '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
] as const;

/**
 * Business Operating Hours Configuration
 * 
 * @description Defines weekly operating schedule for appointment availability
 * and business information display. Used by booking system to validate
 * appointment requests and generate available time slots.
 * 
 * @business_rule Sunday closed, Saturday shorter hours, standard weekday schedule
 */
export const BUSINESS_HOURS: BusinessHours = {
  monday: { open: '00:00', close: '00:00', closed: true },
  tuesday: { open: '08:30', close: '19:00', closed: false },
  wednesday: { open: '08:30', close: '19:00', closed: false },
  thursday: { open: '08:30', close: '19:00', closed: false },
  friday: { open: '08:30', close: '19:00', closed: false },
  saturday: { open: '08:30', close: '19:00', closed: false },
  sunday: { open: '00:00', close: '00:00', closed: true },
} as const;

/**
 * Business Contact Information
 * 
 * @description Centralized contact details used across the application
 * for customer communication, location display, and business information.
 * Ensures consistency in contact data presentation and SEO optimization.
 * 
 * @seo Structured data integration for local business SEO
 */
export const CONTACT_INFO: ContactInfo = {
  address: {
    street: 'Triq il-karmnu 59',
    city: 'Birkirkara',
    state: 'Malta',
    zipCode: '',
  },
  phone: '7723 5750',
  email: 'Infompbarbershop@gmail.com',
  socialMedia: {
    facebook: 'https://www.facebook.com/profile.php?id=61577771502632',
  },
} as const;

/**
 * Team Member Directory
 * 
 * @description Staff directory with specialties and hierarchy information.
 * Used for about page display, service assignment, and team presentation.
 * Supports business credibility and helps customers choose appropriate barber.
 * 
 * @business_value Builds trust and allows customers to select preferred stylist
 */
export const TEAM_MEMBERS: readonly TeamMember[] = [
  {
    id: 'marcus',
    name: 'Marcus',
    title: 'Master Barber & Owner',
    specialties: ['Classic Cuts', 'Beard Styling', 'Hot Shaves'],
  },
  {
    id: 'ben',
    name: 'Ben',
    title: 'Senior Barber',
    specialties: ['Modern Cuts', 'Fade Techniques'],
  },
  {
    id: 'alex',
    name: 'Alex',
    title: 'Barber',
    specialties: ['Trendy Styles', 'Color Work'],
  },
  {
    id: 'james',
    name: 'James',
    title: 'Junior Barber',
    specialties: ['Kids Cuts', 'Basic Styling'],
  },
] as const;

/**
 * Customer Testimonials Collection
 * 
 * @description Verified customer reviews and ratings for social proof
 * and business credibility. Displays on homepage and about sections
 * to build trust and encourage bookings.
 * 
 * @business_value Social proof increases conversion rates and customer confidence
 */
export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: 'testimonial-1',
    customerName: 'Michael R.',
    rating: 5,
    comment: 'Best barbershop in town! The attention to detail is incredible. I won\'t go anywhere else.',
    date: new Date('2024-01-15'),
    verified: true,
  },
  {
    id: 'testimonial-2',
    customerName: 'David L.',
    rating: 5,
    comment: 'Professional, modern, and always on point. MP Barbers never disappoints.',
    date: new Date('2024-02-10'),
    verified: true,
  },
  {
    id: 'testimonial-3',
    customerName: 'Robert K.',
    rating: 5,
    comment: 'Clean, professional environment with skilled barbers. Highly recommend for quality service.',
    date: new Date('2024-02-20'),
    verified: true,
  },
  {
    id: 'testimonial-4',
    customerName: 'Thomas M.',
    rating: 5,
    comment: 'Consistently excellent service. The team knows their craft and pays attention to every detail.',
    date: new Date('2024-03-01'),
    verified: true,
  },
] as const;

/**
 * Application Configuration Settings
 * 
 * @description Core application settings that control business rules,
 * internationalization, and operational parameters. Centralized configuration
 * enables easy updates to business policies and localization settings.
 * 
 * @configuration Single source of truth for app-wide settings
 */
export const APP_CONFIG = {
  name: 'MP BARBERS',
  tagline: 'Sharp looks. Clean cuts.',
  maxBookingDaysAhead: 30,
  minBookingHoursAhead: 2,
  defaultCurrency: 'EUR',
  locale: 'en-US',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
} as const;

/**
 * Navigation Menu Configuration
 * 
 * @description Defines the primary navigation structure with accessibility
 * attributes and routing information. Ensures consistency across navigation
 * components and proper accessibility implementation.
 * 
 * @accessibility Includes ARIA labels for screen reader compatibility
 */
export const NAVIGATION_ITEMS = [
  { key: 'home', label: 'Home', ariaLabel: 'Go to home page' },
  { key: 'about', label: 'About', ariaLabel: 'Learn about our team and services' },
  { key: 'services', label: 'Services', ariaLabel: 'View our services and pricing' },
  { key: 'contact', label: 'Contact', ariaLabel: 'View contact information and location' },
] as const;

/**
 * Service Category Configuration
 * 
 * @description Service categorization for filtering and organization.
 * Used in service selection interfaces and content organization
 * throughout the application.
 * 
 * @business_logic Enables service filtering and improved user experience
 */
export const SERVICE_CATEGORIES = {
  haircut: {
    label: 'Hair Services',
    description: 'Professional haircut services',
    color: '#2563eb',
  },
  beard: {
    label: 'Beard Services',
    description: 'Beard trimming and shaving',
    color: '#dc2626',
  },
  kids: {
    label: 'Kids Services',
    description: 'Child-friendly services',
    color: '#7c3aed',
  },
  extra: {
    label: 'Extra Services',
    description: 'Additional grooming services',
    color: '#059669',
  },
} as const;

/**
 * Business Policies and Rules
 * 
 * @description Centralized business policies for booking, cancellation,
 * and service delivery. Ensures consistent policy enforcement across
 * the application and provides single source for business rule updates.
 * 
 * @legal Business terms and conditions enforcement
 */
export const BUSINESS_POLICIES = {
  booking: {
    advanceNoticeHours: 2,
    maxAdvanceBookingDays: 30,
    cancellationDeadlineHours: 24,
    rescheduleDeadlineHours: 4,
  },
  payment: {
    acceptedMethods: ['cash', 'card', 'contactless'],
    requiresDeposit: false,
    depositPercentage: 0,
  },
  service: {
    lateArrivalGraceMinutes: 10,
    noShowPolicyHours: 24,
    groupBookingMinSize: 3,
  },
} as const;

/**
 * Error Messages Configuration
 * 
 * @description Centralized error message definitions for consistent
 * user communication and easier internationalization. Provides
 * user-friendly error messages with actionable guidance.
 * 
 * @ux Consistent error messaging improves user experience
 */
export const ERROR_MESSAGES = {
  validation: {
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    invalidPhone: 'Please enter a valid phone number',
    pastDate: 'Please select a future date',
    outsideBusinessHours: 'Please select a time within business hours',
  },
  booking: {
    slotUnavailable: 'This time slot is no longer available',
    serviceUnavailable: 'This service is currently unavailable',
    systemError: 'Unable to process booking. Please try again.',
    networkError: 'Connection error. Please check your internet connection.',
  },
  general: {
    unknownError: 'An unexpected error occurred',
    sessionExpired: 'Your session has expired. Please refresh the page.',
    maintenanceMode: 'System maintenance in progress. Please try again later.',
  },
} as const;