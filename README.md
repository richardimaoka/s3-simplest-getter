# S3 Hello World Server

A minimal Express.js server built with TypeScript and ESM that serves a single "hello world" text file from Amazon S3.

## Prerequisites

- Node.js 18+ 
- pnpm package manager
- AWS Account with S3 access
- AWS CLI configured (optional but recommended)

## Quick Start

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Set up environment variables** (see [Environment Configuration](#environment-configuration))

3. **Build the project**
   ```bash
   pnpm build
   ```

4. **Start the server**
   ```bash
   pnpm start
   ```

## Environment Configuration

Create a `.env` file in the project root with the following variables:

```bash
# Server Configuration
PORT=8080                    # Optional, defaults to 8080

# AWS S3 Configuration
AWS_REGION=us-east-1         # Required: Your S3 bucket region
S3_BUCKET_NAME=your-bucket   # Required: Your S3 bucket name
S3_FILE_NAME=hello-world.txt # Required: The file name in S3

# AWS Credentials (if not using IAM roles/profiles)
AWS_ACCESS_KEY_ID=your-access-key     # Optional: AWS access key
AWS_SECRET_ACCESS_KEY=your-secret-key # Optional: AWS secret key
```

### Environment Variable Template

Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

## S3 Setup Instructions

### Step 1: Create S3 Bucket

1. **Using AWS Console:**
   - Go to [S3 Console](https://console.aws.amazon.com/s3/)
   - Click "Create bucket"
   - Enter bucket name (must be globally unique)
   - Select your preferred region
   - Keep default settings and create

2. **Using AWS CLI:**
   ```bash
   aws s3 mb s3://your-bucket-name --region us-east-1
   ```

### Step 2: Upload Hello World File

1. **Create the hello world file locally:**
   ```bash
   echo "Hello, World!" > hello-world.txt
   ```

2. **Upload to S3 using AWS Console:**
   - Navigate to your bucket
   - Click "Upload"
   - Select `hello-world.txt`
   - Click "Upload"

3. **Upload using AWS CLI:**
   ```bash
   aws s3 cp hello-world.txt s3://your-bucket-name/hello-world.txt
   ```

### Step 3: Configure IAM Permissions

Your AWS credentials need the following S3 permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject"
            ],
            "Resource": "arn:aws:s3:::your-bucket-name/*"
        }
    ]
}
```

## Manual Testing Procedures

### Test 1: Successful File Retrieval

1. **Setup:**
   - Ensure S3 bucket exists with hello-world.txt
   - Configure environment variables correctly
   - Start the server: `pnpm dev`

2. **Test:**
   ```bash
   curl http://localhost:8080/
   ```

3. **Expected Result:**
   - HTTP Status: 200
   - Response: "Hello, World!"
   - Content-Type: text/plain

### Test 2: File Not Found (404)

1. **Setup:**
   - Temporarily rename S3_FILE_NAME to non-existent file
   - Restart server

2. **Test:**
   ```bash
   curl -i http://localhost:8080/
   ```

3. **Expected Result:**
   - HTTP Status: 404
   - Error message about file not found

### Test 3: Bucket Not Found (404)

1. **Setup:**
   - Temporarily change S3_BUCKET_NAME to non-existent bucket
   - Restart server

2. **Test:**
   ```bash
   curl -i http://localhost:8080/
   ```

3. **Expected Result:**
   - HTTP Status: 404
   - Error message about bucket not found

### Test 4: Access Denied (500)

1. **Setup:**
   - Use AWS credentials without S3 permissions
   - Restart server

2. **Test:**
   ```bash
   curl -i http://localhost:8080/
   ```

3. **Expected Result:**
   - HTTP Status: 500
   - Generic error message (no sensitive details exposed)

### Test 5: Service Unavailable (503)

1. **Setup:**
   - Use invalid AWS region or simulate network issues
   - Restart server

2. **Test:**
   ```bash
   curl -i http://localhost:8080/
   ```

3. **Expected Result:**
   - HTTP Status: 503
   - Service unavailable error message

## Development Commands

```bash
# Install dependencies
pnpm install

# Run in development mode with hot reload
pnpm dev

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Build for production
pnpm build

# Start production server
pnpm start
```

## Troubleshooting

### Common Issues

**1. "Missing required environment variable" error**
- Ensure all required environment variables are set in `.env`
- Check for typos in variable names
- Restart the server after changing environment variables

**2. "Access Denied" errors**
- Verify AWS credentials are correct
- Check IAM permissions for S3 access
- Ensure bucket policy allows access

**3. "Bucket not found" errors**
- Verify bucket name is correct and exists
- Check that bucket is in the specified region
- Ensure bucket name doesn't contain typos

**4. "Network timeout" errors**
- Check internet connectivity
- Verify AWS region is correct
- Check if AWS services are experiencing outages

**5. Server won't start**
- Check if port is already in use
- Verify Node.js version (18+ required)
- Check for TypeScript compilation errors

### Debug Mode

Enable detailed logging by setting:
```bash
NODE_ENV=development
```

This will show detailed error logs including AWS SDK errors.

### Verify S3 Setup

Test your S3 setup independently:
```bash
# List bucket contents
aws s3 ls s3://your-bucket-name/

# Download file directly
aws s3 cp s3://your-bucket-name/hello-world.txt ./test-download.txt
```

## Project Structure

```
├── src/
│   ├── config/
│   │   ├── index.ts          # Configuration management
│   │   └── index.test.ts     # Configuration tests
│   ├── services/
│   │   ├── s3Service.ts      # S3 service implementation
│   │   └── s3Service.test.ts # S3 service tests
│   ├── app.ts                # Express application setup
│   └── index.ts              # Server entry point
├── tests/                    # Integration tests
├── dist/                     # Compiled JavaScript
├── .env.example              # Environment template
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── vitest.config.ts          # Test configuration
```

## Security Considerations

- Never commit AWS credentials to version control
- Use IAM roles when running on AWS infrastructure
- Implement least-privilege access for S3 permissions
- Consider using AWS Secrets Manager for production credentials
- Enable S3 bucket logging for audit trails
