# Ride Comparison App

## Overview

This is a full-stack ride comparison application that allows users to compare ride prices across multiple ride-sharing services (Uber, Bolt, and Yango). Built with React on the frontend and Express.js on the backend, the app enables users to input pickup and drop-off locations, get current location automatically, and view a sorted comparison of available ride options with pricing, estimated arrival times, and service details.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React with TypeScript**: Modern functional components using hooks for state management
- **Vite**: Fast build tool and development server with hot module replacement
- **Wouter**: Lightweight client-side routing library as an alternative to React Router
- **TanStack Query**: Server state management for API calls, caching, and background refetching
- **shadcn/ui**: Comprehensive component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design system variables

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
- **Geolocation Integration**: Browser geolocation API for automatic current location detection
- **Multi-provider Comparison**: Real Uber API integration with mock data for Bolt and Yango
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Real-time Sorting**: Dynamic sorting by price, time, or service rating
- **Error Handling**: Comprehensive error states with retry mechanisms
- **Toast Notifications**: User feedback for actions and errors

### Authentication & Authorization
- Currently no authentication system implemented
- All API endpoints are public access
- Session management infrastructure present but unused (connect-pg-simple)

### API Structure
- **POST /api/rides/compare**: Main endpoint for ride price comparison
- **GET /api/geocode**: Location search and geocoding functionality
- Request/response validation using shared Zod schemas
- Standardized error handling with status codes and messages

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