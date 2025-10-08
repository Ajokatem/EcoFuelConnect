# EcoFuelConnect 

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)](https://mongodb.com/)

EcoFuelConnect is a comprehensive platform designed to revolutionize sustainable fuel management and organic waste tracking. This innovative application empowers communities, organizations, and individuals to manage their environmental impact through efficient biogas production, fuel request management, organic waste logging, and educational content about sustainability practices.

##  Repository

**GitHub Repository**: [https://github.com/Ajokatem/EcoFuelConnect](https://github.com/Ajokatem/EcoFuelConnect)

##  Description

EcoFuelConnect addresses the critical need for sustainable energy solutions by connecting organic waste suppliers with biogas production facilities and fuel consumers. The platform creates a circular economy where organic waste is converted into clean energy, reducing both waste disposal problems and reliance on fossil fuels.

### Key Objectives:

- **Waste-to-Energy Conversion**: Transform organic waste into biogas fuel
- **Supply Chain Management**: Connect waste suppliers, processors, and fuel consumers
- **Environmental Impact Tracking**: Monitor carbon footprint reduction and sustainability metrics
- **Community Engagement**: Educate and involve communities in sustainable practices
- **Data-Driven Insights**: Provide analytics for optimizing waste-to-fuel processes

##  Features

- ** Dashboard**: Real-time environmental impact tracking and analytics
- ** Fuel Request Management**: Streamlined biogas ordering and delivery tracking
- ** Organic Waste Logging**: Log and track organic waste for biogas production
- ** Educational Content**: Learn about sustainable practices and biogas technology
- ** User Profile Management**: Customize your sustainability journey
- ** Reports & Analytics**: Generate detailed environmental impact and efficiency reports
- ** Organization Management**: Handle multiple users and facilities
- ** Notifications**: Real-time updates on fuel deliveries and waste collection
- ** Responsive Design**: Works seamlessly on desktop and mobile devices

##  Design & Mockups

### User Interface Screenshots

#### Dashboard

![Dashboard](./src/assets/img/Screenshot%202025-10-07%20203530.png)
_Real-time environmental impact tracking with interactive charts and metrics_

#### Fuel Request Management

![Fuel Request Management](./src/assets/img/Screenshot%202025-10-07%20203634.png)
_Streamlined biogas ordering and delivery tracking interface_

#### Organic Waste Logging

![Waste Logging](./src/assets/img/Screenshot%202025-10-07%20203611.png)
_Intuitive waste entry and tracking system_

#### Reports & Analytics

![Reports](./src/assets/img/Screenshot%202025-10-07%20203704.png)
_Comprehensive environmental impact reports and data visualization_

### Design System

- **Color Palette**: Eco-friendly greens with modern accent colors
- **Typography**: Clean, accessible fonts (Roboto, Inter)
- **Components**: Consistent React Bootstrap-based UI elements
- **Responsive Design**: Mobile-first approach with Bootstrap grid system

** [My Demo Vedeo Link](https://www.youtube.com/watch?v=sW48JUuQqi4) **

### Figma Mockups

** [View Complete Design System on Figma](https://www.figma.com/design/rkrA5Gt42i10TZiXX6y9bL/My-EcoFuelConnect-Figma-Design?node-id=0-1&p=f&t=vXRIdEezJ29p3K6U-0)**

- Wireframes and user flow diagrams
- High-fidelity mockups for all major screens
- Component library and design tokens
- Mobile and desktop responsive layouts

### Wireflow Diagram

** [Dataflow Diagram Link](https://docs.google.com/document/d/16N5GYfUQQ-1Dd_AYSLwRrCcueyaalxzD-4QWX8Tsvo4/edit?usp=sharing)**


```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React)       │◄──►│   (Express.js)  │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ • Dashboard     │    │ • Authentication│    │ • Users         │
│ • Fuel Requests │    │ • Fuel Requests │    │ • Waste Entries │
│ • Waste Logging │    │ • Waste Tracking│    │ • Transactions  │
│ • Reports       │    │ • Analytics API │    │ • Analytics     │
│ • User Profile  │    │ • Notifications │    │ • Organizations │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

##  Available Scripts

In the project directory, you can run:

### Development Scripts

```bash
# Start development server
npm start
# Runs the app in development mode at http://localhost:3000

# Run tests
npm test
# Launches the test runner in interactive watch mode

# Build for production
npm run build
# Builds the app for production to the `build` folder

# Compile SCSS
npm run build:scss
# Compiles and minifies SCSS files to CSS

# Start backend server
npm run server
# Starts the Express.js backend server on port 5000
```

### Production Scripts

```bash
# Clean install
npm run install:clean
# Removes node_modules and package-lock.json, then reinstalls

# Lint code
npm run lint
# Runs ESLint to check code quality

# Format code
npm run format
# Runs Prettier to format code consistently
```

##  Technology Stack

### Frontend

- **React** 18+ - Modern JavaScript library for building user interfaces
- **React Bootstrap** - Bootstrap components for React
- **React Router** 5.2.0 - Declarative routing for React applications
- **SCSS/Sass** - CSS preprocessor for advanced styling
- **Chartist.js** - Simple responsive charts for data visualization
- **FontAwesome** - Comprehensive icon library

### Backend

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework for Node.js
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - MongoDB object modeling for Node.js
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing library

### Development Tools

- **React Scripts** - Build tools and configurations
- **Sass** - CSS extension language
- **ESLint** - Code linting and formatting
- **Git** - Version control system

##  Environment Setup & Installation

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 16.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** package manager
- **Git** - [Download here](https://git-scm.com/)
- **MongoDB** (for local development) - [Download here](https://www.mongodb.com/try/download/community)
- **Code Editor** (VS Code recommended) - [Download here](https://code.visualstudio.com/)

### Installation Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Ajokatem/EcoFuelConnect.git
   cd EcoFuelConnect/eco-fuel-connect-app
   ```

2. **Install Dependencies**

   ```bash
   # Install frontend dependencies
   npm install --legacy-peer-deps

   # If you encounter peer dependency issues, use:
   npm install --legacy-peer-deps --force
   ```

3. **Environment Configuration**

   Create a `.env` file in the root directory and configure the following variables:

   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/ecofuelconnect

   # JWT Secret
   JWT_SECRET=your_jwt_secret_key_here

   # API Configuration
   REACT_APP_API_URL=http://localhost:5000/api

   # Environment
   NODE_ENV=development

   # Port Configuration
   PORT=3000
   BACKEND_PORT=5000
   ```

4. **Database Setup**

   ```bash
   # Start MongoDB service (Windows)
   net start MongoDB

   # Start MongoDB service (macOS/Linux)
   sudo systemctl start mongod

   # Or run MongoDB directly
   mongod --dbpath /path/to/your/database
   ```

5. **Start the Development Servers**

   ```bash
   # Start the frontend development server
   npm start

   # In a separate terminal, start the backend server
   cd backend
   node server.js
   ```

6. **Verify Installation**

   - Frontend: Open [http://localhost:3000](http://localhost:3000) in your browser
   - Backend API: Test at [http://localhost:5000/api](http://localhost:5000/api)

### Additional Setup Options

**Using Docker (Optional)**

```bash
# Build and run with Docker
docker-compose up --build

# Run in detached mode
docker-compose up -d
```

**Database Seeding (Optional)**

```bash
# Seed the database with sample data
npm run seed

# Reset database
npm run db:reset
```

##  Deployment Plan

### Production Deployment Options

#### Option 1: Cloud Platform Deployment (Recommended)

**Frontend Deployment (Vercel/Netlify)**

```bash
# Build for production
npm run build

# Deploy to Vercel
npx vercel --prod

# Or deploy to Netlify
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

**Backend Deployment (Heroku/Railway)**

```bash
# Deploy to Heroku
heroku create ecofuelconnect-api
git push heroku main

# Deploy to Railway
railway login
railway init
railway deploy
```

#### Option 2: Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build and deploy with Docker
docker build -t ecofuelconnect .
docker run -p 3000:3000 ecofuelconnect
```

#### Option 3: VPS/Dedicated Server

```bash
# Install PM2 for process management
npm install -g pm2

# Build for production
npm run build

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Environment Configuration for Production

```env
# Production Environment Variables
NODE_ENV=production
REACT_APP_API_URL=https://your-api-domain.com/api
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecofuelconnect
JWT_SECRET=your_super_secure_jwt_secret
PORT=80
SSL_CERT_PATH=/path/to/ssl/cert.pem
SSL_KEY_PATH=/path/to/ssl/key.pem
```

### Database Deployment

**MongoDB Atlas (Cloud)**

1. Create MongoDB Atlas account
2. Create new cluster
3. Configure network access and database users
4. Update connection string in environment variables

**Self-Hosted MongoDB**

```bash
# Install MongoDB on Ubuntu/Debian
sudo apt update
sudo apt install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### CI/CD Pipeline

**GitHub Actions Workflow**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18"
      - name: Install dependencies
        run: npm install --legacy-peer-deps
      - name: Run tests
        run: npm test
      - name: Build project
        run: npm run build
      - name: Deploy to production
        run: npm run deploy
```

### Monitoring & Maintenance

- **Error Tracking**: Sentry integration for error monitoring
- **Analytics**: Google Analytics for user behavior tracking
- **Performance**: Lighthouse CI for performance monitoring
- **Uptime**: UptimeRobot for availability monitoring
- **Backup**: Automated daily database backups
- **Security**: Regular security audits and dependency updates

### Scaling Considerations

- **Load Balancing**: nginx for handling multiple requests
- **Caching**: Redis for session storage and caching
- **CDN**: CloudFlare for static asset delivery
- **Database**: MongoDB sharding for large datasets
- **Microservices**: Split API into smaller services as needed

##  Contributing

We welcome contributions to EcoFuelConnect! Here's how you can help:

### How to Contribute

1. **Fork the Repository**

   ```bash
   git fork https://github.com/Ajokatem/EcoFuelConnect.git
   ```

2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**

   - Follow the existing code style and conventions
   - Add tests for new functionality
   - Update documentation as needed

4. **Test Your Changes**

   ```bash
   npm test
   npm run lint
   ```

5. **Submit a Pull Request**
   - Provide a clear description of your changes
   - Reference any related issues
   - Ensure all tests pass

### Development Guidelines

- Follow the [Style Guide](./STYLE_GUIDE.md)
- Write meaningful commit messages
- Keep pull requests focused and small
- Add tests for new features
- Update documentation for API changes

### Areas for Contribution

-  Bug fixes and error handling
-  New features and enhancements
-  Documentation improvements
-  UI/UX improvements
-  Performance optimizations
-  Test coverage expansion

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Contact & Support

### Project Maintainer

- **Email**: [a.biar@alustudent.com](mailto:a.biar@alustudent.com)
- **GitHub**: [@Ajokatem](https://github.com/Ajokatem)

### Project Links

- **Repository**: [https://github.com/Ajokatem/EcoFuelConnect](https://github.com/Ajokatem/EcoFuelConnect)
- **Issues**: [Report a Bug](https://github.com/Ajokatem/EcoFuelConnect/issues)
- **Discussions**: [Community Forum](https://github.com/Ajokatem/EcoFuelConnect/discussions)

### Support

-  Check the [Documentation](./docs/)
-  [Report Issues](https://github.com/Ajokatem/EcoFuelConnect/issues)
-  [Join Discussions](https://github.com/Ajokatem/EcoFuelConnect/discussions)
-  Email support: [a.biar@alustudent.com](mailto:a.biar@alustudent.com)

##  Acknowledgments

- Thanks to all contributors who have helped shape EcoFuelConnect
- Inspired by the global movement towards sustainable energy solutions
- Built with amazing open-source technologies and libraries

##  Project Status

-  **Frontend**: Fully functional React application
-  **Backend**: Express.js API with MongoDB integration
-  **Authentication**: JWT-based user authentication
-  **Database**: MongoDB with Mongoose ODM
-  **Mobile App**: In development
-  **AI Analytics**: Planned for future release
-  **IoT Integration**: Planned for smart sensors

---

**Made with  for a sustainable future**

_EcoFuelConnect - Transforming waste into energy, one connection at a time._
