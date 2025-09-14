---
inclusion: manual
---

# Minimal Express.js Server Implementation Guidelines

## Technology Stack
- Use TypeScript for type safety and better development experience
- Use ESM (ES Modules) instead of CommonJS for modern module system
- Target modern Node.js versions that support ESM natively

## Middleware Philosophy
- Use only essential security-related middleware
- Avoid unnecessary middleware that doesn't contribute to security or core functionality
- Prioritize lightweight implementation over feature-rich middleware stacks

## Security Requirements
- Implement basic security headers to protect against common vulnerabilities
- Use minimal but effective security middleware (e.g., helmet for basic security headers)
- Avoid over-engineering security for simple use cases

## Implementation Constraints
- Keep dependencies minimal
- Focus on single responsibility - serving one file from S3
- Prefer built-in Node.js/Express capabilities over external libraries when possible
