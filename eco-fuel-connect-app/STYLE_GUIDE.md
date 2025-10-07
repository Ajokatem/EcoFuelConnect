# EcoFuelConnect Style Guide

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Structure](#architecture--structure)
3. [React Component Guidelines](#react-component-guidelines)
4. [Styling Conventions](#styling-conventions)
5. [Color Palette](#color-palette)
6. [Typography](#typography)
7. [Components & UI Elements](#components--ui-elements)
8. [File Organization](#file-organization)
9. [Naming Conventions](#naming-conventions)
10. [Code Style](#code-style)
11. [Best Practices](#best-practices)

---

## Project Overview

**EcoFuelConnect** is a sustainable fuel management and organic waste tracking application built with React, focusing on environmental sustainability and community engagement.

### Technology Stack

- **React** 18+ - Frontend library
- **React Bootstrap** - UI components
- **React Router** 5.2.0 - Navigation and routing
- **SCSS/Sass** - Advanced styling with variables and mixins
- **Chartist** - Data visualization and charts
- **FontAwesome** - Icon library
- **Express** - Backend API
- **MongoDB/Mongoose** - Database

---

## Architecture & Structure

### Component Architecture

- **Functional Components**: Primary pattern using React hooks
- **Layout Components**: Admin layout wrapping all pages
- **Page Components**: Individual route components
- **Shared Components**: Navbar, Sidebar, Footer
- **Utility Components**: Charts, forms, modals

### Folder Structure

```
src/
├── components/          # Reusable components
│   ├── Footer/
│   ├── Navbars/
│   └── Sidebar/
├── layouts/             # Layout wrappers
├── pages/               # Route-specific pages
├── assets/              # Static assets
│   ├── css/
│   ├── scss/
│   ├── img/
│   └── fonts/
└── routes.js            # Route definitions
```

---

## React Component Guidelines

### Component Structure

```javascript
import React, { useState, useEffect } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  // Other React Bootstrap components
} from "react-bootstrap";

function ComponentName() {
  // State declarations
  const [state, setState] = useState(initialValue);

  // Effect hooks
  useEffect(() => {
    // Side effects
  }, [dependencies]);

  // Event handlers
  const handleEvent = () => {
    // Handler logic
  };

  // Render method
  return <Container fluid>{/* Component JSX */}</Container>;
}

export default ComponentName;
```

### Component Naming

- **PascalCase** for component names
- **camelCase** for functions and variables
- **kebab-case** for file names when multiple words

### State Management

- Use `useState` for local component state
- Use `useEffect` for side effects and lifecycle management
- Keep state as close to where it's used as possible

---

## Styling Conventions

### SCSS Architecture

```scss
// Main stylesheet structure
@import "components/variables";
@import "components/mixins";
@import "components/typography";
@import "components/misc";
@import "components/buttons";
@import "components/cards";
```

### CSS-in-JS Patterns

For dynamic styles, use inline styles with objects:

```javascript
const cardStyle = {
  backgroundColor: "white",
  padding: "30px 20px",
  borderRadius: "12px",
  boxShadow: "0 2px 15px rgba(40, 167, 69, 0.08)",
  border: "1px solid #f0f0f0",
  transition: "transform 0.2s ease",
};
```

### Responsive Design

- Mobile-first approach
- Use Bootstrap grid system
- Breakpoints: xs, sm, md, lg, xl
- Test on multiple screen sizes

---

## Color Palette

### Primary Colors

```scss
$primary-color: #3472F7      // Primary blue
$success-color: #87CB16      // Success green
$info-color: #1DC7EA         // Info cyan
$warning-color: #FF9500      // Warning orange
$danger-color: #FF4A55       // Danger red
```

### Brand Colors

```scss
$eco-green: #25805a          // Main brand green
$eco-light-green: #2d9467    // Lighter brand green
$eco-dark-green: #1e6b47     // Darker brand green
```

### Neutral Colors

```scss
$white-color: #FFFFFF
$black-color: #333333
$light-gray: #E3E3E3
$medium-gray: #DDDDDD
$dark-gray: #9A9A9A
$smoke-bg: #F5F5F5
```

### Gradients

```scss
// Main brand gradient
background: linear-gradient(135deg, #2d9467, #25805a);

// Light background gradient
background: linear-gradient(135deg, #d4f5e0 0%, #ffffff 100%);

// Footer gradient
background: linear-gradient(135deg, #1e6b47 0%, #25805a 100%);
```

---

## Typography

### Font Stack

```scss
font-family: "Roboto", "Helvetica Neue", Arial, sans-serif;
// Alternative: "Inter", "Segoe UI", sans-serif
```

### Font Weights

```scss
$font-weight-light: 300; // Headings
$font-weight-normal: 400; // Body text
$font-weight-bold: 700; // Emphasis
$font-weight-extra-bold: 800; // Strong emphasis
```

### Font Sizes

```scss
$font-size-h1: 52px;
$font-size-h2: 36px;
$font-size-h3: 28px;
$font-size-h4: 22px;
$font-size-base: 16px;
```

### Heading Guidelines

- **h1**: Page titles, main headings
- **h2**: Section headings
- **h3**: Sub-section headings
- **h4**: Component titles
- **h5-h6**: Minor headings

---

## Components & UI Elements

### Cards

```jsx
<Card className="shadow-lg border-0 mb-4">
  <Card.Header>
    <Card.Title as="h4">Card Title</Card.Title>
  </Card.Header>
  <Card.Body>{/* Card content */}</Card.Body>
</Card>
```

### Buttons

```jsx
// Primary actions
<Button variant="success" className="btn-fill">
  Primary Action
</Button>

// Secondary actions
<Button variant="outline-success">
  Secondary Action
</Button>

// Danger actions
<Button variant="danger" className="btn-fill">
  Delete
</Button>
```

### Form Controls

```jsx
<Form.Group className="mb-3">
  <Form.Label>Field Label</Form.Label>
  <Form.Control
    type="text"
    placeholder="Enter value"
    value={value}
    onChange={handleChange}
  />
</Form.Group>
```

### Navigation

```jsx
<Nav>
  <Nav.Item>
    <Nav.Link to="/path" className="nav-link">
      <i className="nc-icon nc-icon-name"></i>
      <p>Navigation Item</p>
    </Nav.Link>
  </Nav.Item>
</Nav>
```

---

## File Organization

### Import Order

1. React and React-related imports
2. Third-party libraries
3. Internal components
4. Styles and assets

```javascript
import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

import CustomComponent from "../components/CustomComponent";
import "./Component.scss";
```

### Asset Organization

```
assets/
├── css/                 # Compiled CSS
├── scss/               # Source SCSS files
│   ├── components/     # Component-specific styles
│   ├── mixins/        # SCSS mixins
│   └── eco-fuel-connect.scss  # Main stylesheet
├── img/               # Images and icons
└── fonts/             # Custom fonts
```

---

## Naming Conventions

### File Naming

- **Components**: `PascalCase.js` (e.g., `Dashboard.js`)
- **Styles**: `kebab-case.scss` (e.g., `eco-fuel-connect.scss`)
- **Images**: `kebab-case` (e.g., `recycle-symbol.png`)
- **Utilities**: `camelCase.js` (e.g., `apiHelpers.js`)

### CSS Class Naming

- **BEM methodology** where applicable
- **Bootstrap classes** for common utilities
- **Custom classes** with descriptive names

```scss
// BEM example
.card-stats {
  &__header {
  }
  &__body {
  }
  &--highlighted {
  }
}

// Utility classes
.text-eco-green {
  color: $eco-green;
}
.bg-eco-gradient {
  background: $eco-gradient;
}
```

### Variable Naming

```javascript
// State variables
const [isLoading, setIsLoading] = useState(false);
const [userData, setUserData] = useState(null);

// Event handlers
const handleSubmit = () => {};
const handleInputChange = () => {};

// Constants
const API_ENDPOINTS = {};
const CHART_CONFIG = {};
```

---

## Code Style

### JavaScript/JSX

- Use **2 spaces** for indentation
- **Single quotes** for strings
- **Semicolons** at end of statements
- **Arrow functions** for simple functions
- **Destructuring** for props and imports

```javascript
// Good
const { title, description } = props;
const handleClick = () => setVisible(!visible);

// Avoid
var title = props.title;
function handleClick() {
  return setVisible(!visible);
}
```

### SCSS

- Use **2 spaces** for indentation
- **Variables** for all colors and sizes
- **Mixins** for reusable patterns
- **Nested selectors** (max 3 levels deep)

```scss
// Good
.card {
  padding: $padding-base;
  background-color: $white-color;

  &__header {
    border-bottom: 1px solid $light-gray;
  }
}
```

---

## Best Practices

### Performance

- Use React DevTools for profiling
- Implement lazy loading for large components
- Optimize images (WebP format when possible)
- Minimize bundle size with proper imports

### Accessibility

- Use semantic HTML elements
- Include `alt` attributes for images
- Ensure proper color contrast ratios
- Support keyboard navigation
- Use ARIA labels where needed

### Error Handling

```javascript
// API calls
try {
  const response = await fetch("/api/data");
  const data = await response.json();
  setData(data);
} catch (error) {
  console.error("Failed to fetch data:", error);
  setError("Failed to load data");
}

// Form validation
const validateForm = (formData) => {
  const errors = {};
  if (!formData.email) {
    errors.email = "Email is required";
  }
  return errors;
};
```

### Testing

- Write unit tests for utilities
- Test component rendering and interactions
- Mock API calls in tests
- Test responsive behavior

### Security

- Validate all user inputs
- Sanitize data before rendering
- Use environment variables for sensitive data
- Implement proper authentication flows

---

## Development Workflow

### Git Workflow

- Use descriptive commit messages
- Create feature branches
- Review code before merging
- Keep commits small and focused

### Code Review Checklist

- [ ] Component follows established patterns
- [ ] Styles are consistent with design system
- [ ] Code is properly documented
- [ ] No console.log statements in production
- [ ] Responsive design works on all breakpoints
- [ ] Accessibility requirements met

---

## Resources

### Documentation

- [React Documentation](https://reactjs.org/docs)
- [React Bootstrap](https://react-bootstrap.github.io/)
- [Sass Documentation](https://sass-lang.com/documentation)
- [Chartist.js](https://gionkunz.github.io/chartist-js/)

### Tools

- **VS Code** with React/ES6 extensions
- **React DevTools** browser extension
- **Sass** compiler
- **ESLint** for code linting
- **Prettier** for code formatting

---

_This style guide should be updated as the project evolves and new patterns emerge._
