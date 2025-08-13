# UI Design System
*AirBnB-Inspired Design System for Job Portal*

## Design Philosophy

### Visual Identity
- **Approachable**: Warm, welcoming colors that reduce job search anxiety
- **Professional**: Clean, modern interface suitable for career decisions
- **Colorful**: Vibrant palette that energizes and motivates users
- **Trustworthy**: Consistent design that builds confidence

### Design Principles
1. **Clarity**: Information hierarchy is clear and scannable
2. **Accessibility**: WCAG 2.1 AA compliant design
3. **Consistency**: Unified patterns across all interfaces
4. **Responsiveness**: Mobile-first, touch-friendly design
5. **Performance**: Fast-loading, optimized assets

## Color Palette

### Primary Colors
```css
/* Coral - Primary Action Color */
--coral-50: #FFF5F5
--coral-100: #FED7D7
--coral-200: #FEB2B2
--coral-300: #FC8181
--coral-400: #F56565
--coral-500: #FF5A5F  /* Primary */
--coral-600: #E53E3E
--coral-700: #C53030
--coral-800: #9B2C2C
--coral-900: #742A2A

/* Teal - Secondary Action Color */
--teal-50: #E6FFFA
--teal-100: #B2F5EA
--teal-200: #81E6D9
--teal-300: #4FD1C7
--teal-400: #38B2AC
--teal-500: #00A699  /* Secondary */
--teal-600: #319795
--teal-700: #2C7A7B
--teal-800: #285E61
--teal-900: #234E52
```

### Supporting Colors
```css
/* Warm Yellow - Highlights & Alerts */
--yellow-50: #FFFBF0
--yellow-100: #FEF5E7
--yellow-200: #FED7AA
--yellow-300: #FDBA74
--yellow-400: #FB923C
--yellow-500: #FC642D  /* Warning/Highlight */
--yellow-600: #EA580C
--yellow-700: #C2410C
--yellow-800: #9A3412
--yellow-900: #7C2D12

/* Ocean Blue - Links & Information */
--blue-50: #EFF6FF
--blue-100: #DBEAFE
--blue-200: #BFDBFE
--blue-300: #93C5FD
--blue-400: #60A5FA
--blue-500: #008489   /* Info/Links */
--blue-600: #2563EB
--blue-700: #1D4ED8
--blue-800: #1E40AF
--blue-900: #1E3A8A
```

### Neutral Colors
```css
/* Grays - Text & Backgrounds */
--gray-50: #F9FAFB   /* Light backgrounds */
--gray-100: #F3F4F6  /* Card backgrounds */
--gray-200: #E5E7EB  /* Borders */
--gray-300: #D1D5DB  /* Disabled elements */
--gray-400: #9CA3AF  /* Placeholder text */
--gray-500: #767676  /* Secondary text */
--gray-600: #4B5563  /* Body text */
--gray-700: #374151  /* Headings */
--gray-800: #1F2937  /* Dark headings */
--gray-900: #111827  /* High contrast text */

/* Special Neutrals */
--white: #FFFFFF
--black: #000000
--charcoal: #222222  /* Alternative dark */
```

### Semantic Colors
```css
/* Success States */
--success-50: #F0FDF4
--success-500: #10B981
--success-600: #059669

/* Error States */
--error-50: #FEF2F2
--error-500: #EF4444
--error-600: #DC2626

/* Warning States */
--warning-50: #FFFBEB
--warning-500: #F59E0B
--warning-600: #D97706
```

## Typography

### Font Stack
```css
/* Primary Font - Clean, Modern Sans-serif */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;

/* Secondary Font - For headings when needed */
--font-secondary: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;

/* Monospace - For code or data */
--font-mono: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace;
```

### Type Scale
```css
/* Headings */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px - Body text */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
--text-6xl: 3.75rem;   /* 60px */

/* Line Heights */
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

### Typography Usage
```css
/* Heading Styles */
.heading-1 {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  color: var(--gray-900);
}

.heading-2 {
  font-size: var(--text-3xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);
  color: var(--gray-800);
}

.heading-3 {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
  color: var(--gray-800);
}

/* Body Text */
.body-large {
  font-size: var(--text-lg);
  font-weight: var(--font-normal);
  line-height: var(--leading-relaxed);
  color: var(--gray-600);
}

.body-normal {
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
  color: var(--gray-600);
}

.body-small {
  font-size: var(--text-sm);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
  color: var(--gray-500);
}
```

## Spacing System

### Spacing Scale
```css
--space-0: 0;
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-20: 5rem;    /* 80px */
--space-24: 6rem;    /* 96px */
--space-32: 8rem;    /* 128px */
```

### Layout Spacing
```css
/* Component Spacing */
--spacing-component-xs: var(--space-2);
--spacing-component-sm: var(--space-4);
--spacing-component-md: var(--space-6);
--spacing-component-lg: var(--space-8);
--spacing-component-xl: var(--space-12);

/* Section Spacing */
--spacing-section-sm: var(--space-16);
--spacing-section-md: var(--space-20);
--spacing-section-lg: var(--space-24);
--spacing-section-xl: var(--space-32);
```

## Components

### Buttons

#### Primary Button
```css
.btn-primary {
  background: linear-gradient(135deg, var(--coral-500), var(--coral-600));
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(255, 90, 95, 0.2);
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--coral-600), var(--coral-700));
  box-shadow: 0 4px 8px rgba(255, 90, 95, 0.3);
  transform: translateY(-1px);
}
```

#### Secondary Button
```css
.btn-secondary {
  background: var(--white);
  color: var(--coral-500);
  border: 2px solid var(--coral-500);
  border-radius: 8px;
  padding: 10px 22px;
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--coral-50);
  border-color: var(--coral-600);
  color: var(--coral-600);
}
```

### Cards

#### Job Card
```css
.job-card {
  background: var(--white);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--gray-200);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.job-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
  border-color: var(--coral-200);
}
```

#### Company Card
```css
.company-card {
  background: linear-gradient(135deg, var(--white), var(--gray-50));
  border-radius: 16px;
  padding: 32px;
  border: 1px solid var(--gray-100);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.company-card:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}
```

### Forms

#### Input Fields
```css
.input-field {
  background: var(--white);
  border: 2px solid var(--gray-200);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: var(--text-base);
  transition: all 0.2s ease;
  width: 100%;
}

.input-field:focus {
  outline: none;
  border-color: var(--coral-500);
  box-shadow: 0 0 0 3px rgba(255, 90, 95, 0.1);
}

.input-field:invalid {
  border-color: var(--error-500);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
```

#### Select Dropdowns
```css
.select-field {
  background: var(--white);
  border: 2px solid var(--gray-200);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: var(--text-base);
  appearance: none;
  background-image: url("data:image/svg+xml,..."); /* Custom arrow */
  background-repeat: no-repeat;
  background-position: right 12px center;
  transition: all 0.2s ease;
}
```

### Navigation

#### Header Navigation
```css
.nav-header {
  background: var(--white);
  border-bottom: 1px solid var(--gray-100);
  padding: 16px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.nav-link {
  color: var(--gray-700);
  text-decoration: none;
  font-weight: var(--font-medium);
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: var(--coral-500);
  background: var(--coral-50);
}

.nav-link.active {
  color: var(--coral-600);
  background: var(--coral-100);
}
```

### Status Indicators

#### Badges
```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.badge-success {
  background: var(--success-50);
  color: var(--success-600);
}

.badge-warning {
  background: var(--warning-50);
  color: var(--warning-600);
}

.badge-error {
  background: var(--error-50);
  color: var(--error-600);
}

.badge-info {
  background: var(--blue-50);
  color: var(--blue-600);
}
```

### Loading States

#### Skeleton Loaders
```css
.skeleton {
  background: linear-gradient(90deg, 
    var(--gray-100) 25%, 
    var(--gray-50) 50%, 
    var(--gray-100) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

#### Loading Spinners
```css
.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--gray-200);
  border-top: 3px solid var(--coral-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

## Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Small tablets */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Small laptops */
--breakpoint-xl: 1280px;  /* Laptops */
--breakpoint-2xl: 1536px; /* Large screens */
```

### Grid System
```css
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;
}

@media (min-width: 640px) {
  .container { padding: 0 24px; }
}

@media (min-width: 1024px) {
  .container { padding: 0 32px; }
}
```

## Animation Guidelines

### Micro-interactions
```css
/* Hover Animations */
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* Button Press */
.btn-press:active {
  transform: translateY(1px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

/* Fade In Animation */
.fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Transition Timing
- **Fast**: 0.15s - Small state changes
- **Normal**: 0.2s - Hover effects, button states
- **Slow**: 0.3s - Modal appearances, page transitions
- **Careful**: 0.5s+ - Large layout changes

## Accessibility

### Focus States
```css
.focus-visible {
  outline: 2px solid var(--coral-500);
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .btn-primary {
    border: 2px solid var(--gray-900);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Color Contrast
- **Normal Text**: 4.5:1 minimum ratio
- **Large Text**: 3:1 minimum ratio
- **UI Components**: 3:1 minimum ratio
- **Focus Indicators**: 3:1 minimum ratio

## Dark Mode Support

### Dark Color Palette
```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1a1a1a;
    --bg-secondary: #2d2d2d;
    --text-primary: #ffffff;
    --text-secondary: #a0a0a0;
    --border-color: #404040;
  }
}
```

This design system provides a comprehensive foundation for building a modern, accessible, and visually appealing job portal that captures the energy of AirBnB while maintaining the professionalism required for career-focused applications.