# Implementation Plan

- [x] 1. Set up project structure and TypeScript configuration

  - Create package.json with ESM configuration and required dependencies using pnpm
  - Set up TypeScript configuration for ESM and Node.js target
  - Create directory structure (src/, tests/, dist/)
  - Configure build and development scripts for pnpm
  - _Requirements: 1.1_

- [ ] 2. Implement configuration management (TDD approach)
- [x] 2.1 Write unit tests for configuration interface

  - Create test cases for configuration loading and validation
  - Test environment variable parsing with defaults
  - Test validation with clear error messages for missing variables
  - _Requirements: 1.2_

- [x] 2.2 Implement configuration interface and validation logic

  - Create configuration interface based on test requirements
  - Implement environment variable parsing with defaults
  - Add configuration validation with clear error messages
  - Ensure all tests pass
  - _Requirements: 1.2_

- [ ] 3. Implement S3 service layer (TDD approach)
- [x] 3.1 Write unit tests for S3Service class

  - Create test cases for getHelloWorldFile method with mocked AWS SDK
  - Test proper error handling and HTTP status code mapping (404, 503, 500)
  - Test comprehensive error logging scenarios
  - _Requirements: 1.1, 1.3, 1.4, 1.5, 1.6_

- [x] 3.2 Implement S3Service class

  - Create S3Service class with AWS SDK v3 client based on test requirements
  - Implement getHelloWorldFile method with proper error handling
  - Map AWS SDK errors to appropriate HTTP status codes
  - Add comprehensive error logging for debugging
  - Ensure all tests pass
  - _Requirements: 1.1, 1.3, 1.4, 1.5, 1.6_

- [ ] 4. Create manual verification guide for real S3 testing

  - Create README.md with S3 setup instructions
  - Document environment variable configuration
  - Provide step-by-step manual testing procedures
  - Include troubleshooting guide for common S3 issues
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [ ] 5. Create Express application with security middleware (TDD approach)
- [ ] 5.1 Write unit tests for Express route handlers

  - Create test cases for GET route handler that calls S3 service
  - Test proper content-type headers for text responses
  - Test centralized error handling middleware
  - _Requirements: 1.1, 1.2, 1.7_

- [ ] 5.2 Implement Express application

  - Set up Express app with helmet middleware for basic security headers
  - Implement single GET route handler that calls S3 service based on tests
  - Add proper content-type headers for text responses
  - Implement centralized error handling middleware
  - Ensure all tests pass
  - _Requirements: 1.1, 1.2, 1.7_

- [ ] 6. Implement main server entry point (TDD approach)
- [ ] 6.1 Write unit tests for server startup logic

  - Create test cases for server startup with configuration loading
  - Test graceful error handling for startup failures
  - Test server listening with configurable port
  - _Requirements: 1.1_

- [ ] 6.2 Implement server entry point

  - Create server startup logic with configuration loading based on tests
  - Add graceful error handling for startup failures
  - Implement server listening with configurable port
  - Add startup logging for debugging
  - Ensure all tests pass
  - _Requirements: 1.1_

- [ ] 7. Write integration tests

  - Create integration tests for complete request flow
  - Test all error scenarios (S3 unavailable, file not found, auth failures)
  - Verify correct HTTP status codes and error messages
  - Test end-to-end functionality with real HTTP requests
  - _Requirements: 1.3, 1.4, 1.5, 1.6_

- [ ] 8. Add development and build tooling
  - Configure nodemon for development with TypeScript support
  - Set up build process to compile TypeScript to JavaScript
  - Create pnpm scripts for development, build, and production start
  - Add environment variable template file (.env.example)
  - _Requirements: 1.1_
