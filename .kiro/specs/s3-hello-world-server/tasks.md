# Implementation Plan

- [ ] 1. Set up project structure and TypeScript configuration
  - Create package.json with ESM configuration and required dependencies using pnpm
  - Set up TypeScript configuration for ESM and Node.js target
  - Create directory structure (src/, tests/, dist/)
  - Configure build and development scripts for pnpm
  - _Requirements: 1.1_

- [ ] 2. Implement configuration management
  - Create configuration interface and validation logic
  - Implement environment variable parsing with defaults
  - Add configuration validation with clear error messages for missing variables
  - Write unit tests for configuration loading and validation
  - _Requirements: 1.2_

- [ ] 3. Implement S3 service layer
  - Create S3Service class with AWS SDK v3 client
  - Implement getHelloWorldFile method with proper error handling
  - Map AWS SDK errors to appropriate HTTP status codes (404, 503, 500)
  - Add comprehensive error logging for debugging
  - Write unit tests with mocked AWS SDK calls
  - _Requirements: 1.1, 1.3, 1.4, 1.5, 1.6_

- [ ] 4. Create Express application with security middleware
  - Set up Express app with helmet middleware for basic security headers
  - Implement single GET route handler that calls S3 service
  - Add proper content-type headers for text responses
  - Implement centralized error handling middleware
  - _Requirements: 1.1, 1.2, 1.7_

- [ ] 5. Implement main server entry point
  - Create server startup logic with configuration loading
  - Add graceful error handling for startup failures
  - Implement server listening with configurable port
  - Add startup logging for debugging
  - _Requirements: 1.1_

- [ ] 6. Write comprehensive tests
  - Create unit tests for all components (config, S3 service, route handlers)
  - Write integration tests for complete request flow
  - Test all error scenarios (S3 unavailable, file not found, auth failures)
  - Verify correct HTTP status codes and error messages
  - _Requirements: 1.3, 1.4, 1.5, 1.6_

- [ ] 7. Add development and build tooling
  - Configure nodemon for development with TypeScript support
  - Set up build process to compile TypeScript to JavaScript
  - Create pnpm scripts for development, build, and production start
  - Add environment variable template file (.env.example)
  - _Requirements: 1.1_
