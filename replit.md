# Ride Comparison App

## Overview

This is a full-stack ride comparison application that allows users to compare ride prices across multiple ride-sharing services (Uber, Bolt, and Yango). Built with React on the frontend and Express.js on the backend, the app enables users to input pickup and drop-off locations, get current location automatically, and view a sorted comparison of available ride options with pricing, estimated arrival times, and service details.

## User Preferences

- Preferred communication style: Simple, everyday language
- Design preference: Vibrant, modern colors instead of black and white interface
- Authentication: Login/signup pages with demo credentials and profile editing functionality
- Profile navigation: Users requested back button and logout redirect to login page
- Guest Mode: Users can access search immediately without authentication, login required only when clicking "Compare Rides"
- Search Persistence: Search data should be preserved across authentication flow and restored after login/signup

## System Architecture

### Frontend Architecture
- **React with TypeScript**: Modern functional components using hooks for state management
- **Vite**: Fast build tool and development server with hot module replacement
- **Wouter**: Lightweight client-side routing library with guest/authenticated routing
- **TanStack Query**: Server state management for API calls, caching, and background refetching
- **shadcn/ui**: Comprehensive component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework with vibrant gradient color scheme
- **Authentication State**: useAuth hook for managing user sessions and profile data
- **Search Context**: React context for preserving search data across authentication flow

### Backend Architecture
- **Express.js**: RESTful API server with middleware for JSON parsing and logging
- **TypeScript**: Type-safe server-side development with ES modules
- **Zod**: Runtime type validation for API requests and responses
- **Custom Storage Interface**: Minimal storage abstraction (currently in-memory for ride comparisons)

### Data Layer
- **Drizzle ORM**: Type-safe database toolkit configured for PostgreSQL
- **Neon Database**: Serverless PostgreSQL database provider
- **Schema-first Design**: Shared type definitions between client and server using Zod schemas

### Key Features
- **Guest Mode Access**: Users can immediately search for rides without authentication
- **Smart Authentication Flow**: Login/signup required only when comparing rides, with search data preservation
- **Geolocation Integration**: Browser geolocation API for automatic current location detection
- **Multi-provider Comparison**: Real Uber API integration with mock data for Bolt and Yango
- **Search Context Persistence**: Search data preserved across authentication and restored after login
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Real-time Sorting**: Dynamic sorting by price, time, or service rating
- **Error Handling**: Comprehensive error states with retry mechanisms
- **Toast Notifications**: User feedback for actions and errors

### Authentication & Authorization
- **Passport.js Local Strategy**: Username/password authentication with bcrypt hashing
- **Session Management**: Express sessions with PostgreSQL storage
- **User Management**: Complete CRUD operations with profile editing
- **Demo Credentials**: username: 'demo', password: 'demo123' for testing
- **Protected Routes**: Authentication middleware for secure endpoints
- **Auto-redirect**: Seamless navigation between authenticated/non-authenticated states

### API Structure
- **Authentication Endpoints**:
  - POST /api/auth/login - User login with credentials
  - POST /api/auth/signup - New user registration
  - POST /api/auth/logout - User logout
  - GET /api/auth/user - Get current user profile
  - PUT /api/auth/profile - Update user profile
- **Ride Comparison**:
  - POST /api/rides/compare - Main endpoint for ride price comparison
- Request/response validation using shared Zod schemas
- Standardized error handling with status codes and messages
- Authentication middleware for protected routes

## External Dependencies

### Database
- **Neon PostgreSQL**: Serverless database with connection pooling
- **Drizzle Kit**: Database migrations and schema management

### Ride-Sharing APIs
- **Uber API**: Real-time ride estimates and pricing (requires UBER_SERVER_TOKEN)
- **Bolt API**: Mock implementation for demonstration
- **Yango API**: Mock implementation for demonstration

### Development Tools
- **ESBuild**: Fast bundling for production builds
- **TSX**: TypeScript execution for development server
- **Replit Integration**: Development environment with cartographer plugin

### UI Libraries
- **Radix UI**: Unstyled, accessible component primitives
- **Lucide React**: Icon library with consistent design
- **Embla Carousel**: Touch-friendly carousel component
- **Date-fns**: Date manipulation and formatting utilities

### Geolocation Services
- **Browser Geolocation API**: Native location detection
- **Geocoding Service**: Address to coordinates conversion (implementation needed)

### Monitoring & Error Handling
- **Custom Error Boundaries**: React error handling for graceful failures
- **Request Logging**: Automatic API request/response logging
- **Development Banner**: Replit environment detection and branding