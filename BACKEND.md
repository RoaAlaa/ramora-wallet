# Ramora Wallet - Backend Documentation

## Table of Contents
1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Technology Stack](#technology-stack)
4. [API Endpoints](#api-endpoints)
5. [Configuration](#configuration)
6. [Getting Started](#getting-started)

## Overview
The backend of Ramora Wallet is built using Node.js and Express.js, providing a RESTful API service that handles user authentication, wallet management, and bucket operations. The application uses MongoDB as its primary database.

## Project Structure
```
backend/
├── src/
│   ├── config/         # Configuration files (database, environment)
│   ├── controllers/    # Request handlers and business logic
│   ├── middlewares/    # Custom middleware functions
│   ├── models/         # Database models and schemas
│   ├── routes/         # API route definitions
│   ├── services/       # Business logic and external service integrations
│   ├── scripts/        # Utility scripts
│   └── server.js       # Main application entry point
```

## Technology Stack
- **Runtime Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **API Format**: RESTful
- **Cross-Origin Resource Sharing**: Enabled for localhost:3000 (Frontend)

## API Endpoints

### User Routes (`/api/users`)
- User authentication and management endpoints

### Bucket Routes (`/api/buckets`)
- Bucket management and operations

### Wallet Routes (`/api/wallet`)
- Wallet management and transaction endpoints

## Configuration
The backend server uses the following configuration:

- **Port**: 5001 (default) or specified in environment variables
- **Database**: MongoDB (connection configured in config/db.js)
- **CORS**: Enabled for frontend application (http://localhost:3000)
- **Environment Variables**: Configured via .env file

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB instance
- npm or yarn package manager

### Installation Steps
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Development
- The server will restart automatically on file changes when running in development mode
- API endpoints can be tested using tools like Postman or curl
- Check the console for server logs and error messages

## Security
- All sensitive routes are protected with authentication middleware
- Passwords are hashed before storage
- JWT tokens are used for session management
- CORS is configured to only allow requests from the frontend application

## Error Handling
The application implements centralized error handling with appropriate HTTP status codes and error messages.

## Database Models
The application uses MongoDB with Mongoose for data modeling. Key models include:
- User Model
- Wallet Model
- Bucket Model

## Middleware
Custom middleware functions handle:
- Authentication
- Request validation
- Error handling
- Logging

## Environment Variables
Required environment variables:
- `PORT`: Server port number
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation

## Logging
The application implements logging for:
- Server start/stop events
- API requests and responses
- Error events
- Database operations

## Contributing
1. Follow the existing code structure
2. Implement proper error handling
3. Add appropriate comments
4. Test new features thoroughly
5. Update documentation as needed

## Production Deployment
For production deployment:
1. Set appropriate environment variables
2. Enable production mode
3. Configure proper security headers
4. Set up monitoring and logging
5. Use process manager (e.g., PM2) 