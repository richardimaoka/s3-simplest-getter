import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import type { ServerConfig } from "../config/index.ts";

// Custom error classes for different S3 error scenarios
export class S3FileNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "S3FileNotFoundError";
  }
}

export class S3ServiceUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "S3ServiceUnavailableError";
  }
}

export class S3AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "S3AuthenticationError";
  }
}

export class S3InternalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "S3InternalError";
  }
}

export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;
  private fileName: string;

  constructor(config: ServerConfig) {
    this.s3Client = new S3Client({
      region: config.aws.region,
    });
    this.bucketName = config.aws.bucketName;
    this.fileName = config.aws.fileName;
  }

  async getHelloWorldFile(): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: this.fileName,
      });

      const response = await this.s3Client.send(command);

      // Handle missing Body in response
      if (!response.Body) {
        throw new S3InternalError("S3InternalError: No response body received");
      }

      // Transform the response body to string
      const content = await response.Body.transformToString();
      return content;
    } catch (error: any) {
      // Log error details for debugging
      console.error("S3 Error:", error);

      // Map AWS SDK errors to appropriate HTTP status codes
      if (error.name === "NoSuchKey" || error.name === "NoSuchBucket") {
        throw new S3FileNotFoundError(
          "S3FileNotFoundError: File or bucket not found"
        );
      }

      if (
        error.name === "NetworkingError" ||
        error.name === "ServiceUnavailable"
      ) {
        throw new S3ServiceUnavailableError(
          "S3ServiceUnavailableError: S3 service is unavailable"
        );
      }

      if (error.name === "AccessDenied" || error.name === "Forbidden") {
        throw new S3AuthenticationError("S3AuthenticationError: Access denied");
      }

      // Handle Body transformation errors or any other unexpected errors
      if (
        error instanceof S3FileNotFoundError ||
        error instanceof S3ServiceUnavailableError ||
        error instanceof S3AuthenticationError ||
        error instanceof S3InternalError
      ) {
        throw error;
      }

      // Default to internal error for any unexpected errors
      throw new S3InternalError("S3InternalError: Unexpected error occurred");
    }
  }
}
