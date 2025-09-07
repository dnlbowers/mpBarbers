# Layout Components Documentation

## 🏗️ Application Structure Architecture

This directory contains the core layout components that provide the structural foundation for the MP Barbers application. Each component follows **Clean Architecture** principles with focus on semantic HTML, accessibility, and responsive design.

### Architectural Principles
- **Semantic HTML**: Proper HTML5 semantic elements
- **Accessibility-First**: WCAG 2.1 AA compliance with comprehensive ARIA support
- **Responsive Design**: Mobile-first, fluid layout system
- **Clean Separation**: Clear separation between layout logic and content
- **Performance Optimized**: Optimized rendering with React.memo

## 📦 Layout Component Library

### Core Layout Components

#### Layout (`Layout.tsx`)
**Purpose**: Main application layout wrapper providing consistent structure
**Responsibility**: Manages overall page structure, header, main content area, and footer
**Architecture**: Acts as the primary layout container following semantic HTML patterns

```typescript
<Layout>
  <PageContent />
</Layout>
```

#### Navigation (`Navigation.tsx`)
**Purpose**: Primary navigation component with accessible menu system
**Features**: 
- Responsive navigation with mobile hamburger menu
- Full keyboard navigation support
- ARIA-compliant menu structure
- Focus management for screen readers

```typescript
<Navigation 
  activeTab="home"
  onTabChange={handleNavigation}
  mobileMenuOpen={isMobileMenuOpen}
/>
```

#### Footer (`Footer.tsx`)
**Purpose**: Site footer with business information and secondary navigation
**Content**: Contact information, business hours, social media links
**Accessibility**: Proper heading hierarchy and landmark roles

## 🎯 Layout Architecture Patterns

### Semantic HTML Structure
All layout components follow proper semantic HTML5 structure:

```html
<body>
  <header role="banner">
    <nav role="navigation">
      <!-- Primary navigation -->
    </nav>
  </header>
  
  <main role="main">
    <!-- Page content -->
  </main>
  
  <footer role="contentinfo">
    <!-- Footer content -->
  </footer>
</body>
```

### Responsive Design System
- **Mobile-First**: Base styles optimized for mobile devices
- **Breakpoint Strategy**: Tailwind CSS responsive breakpoints (sm, md, lg, xl)
- **Fluid Layout**: Flexible grid system that adapts to content
- **Touch-Friendly**: Minimum 44px touch targets for interactive elements

### Accessibility Implementation

#### ARIA Landmarks
- `role="banner"` for header
- `role="navigation"` for primary navigation
- `role="main"` for main content area
- `role="contentinfo"` for footer

#### Keyboard Navigation
- Tab order follows logical content flow
- Skip links for screen reader users
- Focus indicators on all interactive elements
- Escape key support for mobile menu

#### Screen Reader Support
- Proper heading hierarchy (h1 → h2 → h3)
- Alt text for all decorative images
- aria-label for complex interactions
- Live regions for dynamic content updates

## 🔧 Component Integration

### Layout Composition Pattern
```typescript
const App: React.FC = () => {
  return (
    <Layout>
      <ErrorBoundary>
        <Router />
      </ErrorBoundary>
    </Layout>
  );
};
```

### Navigation State Management
```typescript
interface NavigationState {
  readonly activeTab: NavigationTab;
  readonly mobileMenuOpen: boolean;
}

const useNavigation = () => {
  // Navigation state management logic
};
```

## 📱 Responsive Behavior

### Mobile Experience
- **Collapsible Navigation**: Hamburger menu on mobile devices
- **Touch Optimization**: Larger touch targets and gesture support
- **Performance**: Optimized for mobile network conditions
- **Accessibility**: Voice-over and TalkBack support

### Desktop Experience
- **Full Navigation**: Horizontal navigation bar
- **Hover States**: Interactive hover effects
- **Keyboard Shortcuts**: Quick navigation support
- **Multi-column Layouts**: Efficient use of larger screens

## 🚀 Performance Optimizations

### Rendering Optimization
- **React.memo**: Memoized components to prevent unnecessary re-renders
- **Lazy Loading**: Dynamic imports for route-based code splitting
- **Bundle Splitting**: Separate chunks for layout and content
- **Image Optimization**: Responsive images with proper sizing

### Memory Management
- **Event Cleanup**: Proper cleanup of event listeners
- **State Isolation**: Minimal global state footprint
- **Component Lifecycle**: Efficient mount/unmount cycles

## 🧪 Testing Strategy

### Accessibility Testing
```typescript
// Example accessibility test
describe('Navigation Component', () => {
  test('has proper ARIA landmarks', () => {
    render(<Navigation />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});
```

### Responsive Testing
- **Viewport Testing**: Multiple screen sizes and orientations
- **Touch Testing**: Mobile device interaction patterns
- **Performance Testing**: Layout shift and rendering metrics

## 🎨 Styling Architecture

### Design System Integration
- **Consistent Spacing**: Tailwind spacing scale (4px base unit)
- **Typography Scale**: Harmonious font size and line height ratios
- **Color Palette**: Semantic color usage with accessibility contrast ratios
- **Component Variants**: Consistent styling patterns across components

### CSS Architecture
```scss
// Layout follows Tailwind utility-first approach
.layout-container {
  @apply min-h-screen flex flex-col;
}

.layout-header {
  @apply bg-white shadow-sm border-b border-gray-200;
}

.layout-main {
  @apply flex-1 bg-gray-50;
}
```

## 🔗 Component Dependencies

### Internal Dependencies
- `../../types`: TypeScript interfaces for layout props
- `../../hooks`: Navigation and responsive behavior hooks
- `../../utils`: Utility functions for class name management
- `../../constants`: Layout configuration and breakpoints

### External Dependencies
- **React**: Core React functionality and hooks
- **Tailwind CSS**: Utility-first CSS framework
- **Headless UI**: Accessible component primitives (if used)

## 🎯 Best Practices

### Code Organization
1. **Single Responsibility**: Each layout component has one clear purpose
2. **Composition**: Use component composition for flexible layouts
3. **Props Interface**: Clear TypeScript interfaces for all props
4. **Default Props**: Sensible defaults for optional properties

### Accessibility Standards
1. **Semantic HTML**: Use proper HTML5 semantic elements
2. **ARIA Support**: Comprehensive ARIA labels and roles
3. **Keyboard Navigation**: Full keyboard accessibility
4. **Screen Reader**: Optimized for assistive technologies

### Performance Considerations
1. **Memoization**: React.memo for layout stability
2. **Code Splitting**: Route-based lazy loading
3. **Image Optimization**: Responsive image handling
4. **Bundle Size**: Minimal external dependencies

---

**Next Steps**: Explore [Feature Components](../features/README.md) for page-specific business logic components.