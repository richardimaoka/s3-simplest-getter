import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { loadConfig, ServerConfig } from "./index.js";

describe("Configuration Management", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment variables before each test
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original environment variables after each test
    process.env = originalEnv;
  });

  describe("loadConfig", () => {
    it("should load configuration with all required environment variables", () => {
      // Arrange
      process.env.PORT = "3000";
      process.env.AWS_REGION = "us-east-1";
      process.env.S3_BUCKET_NAME = "my-test-bucket";
      process.env.S3_FILE_NAME = "hello-world.txt";

      // Act
      const config = loadConfig();

      // Assert
      expect(config).toEqual({
        port: 3000,
        aws: {
          region: "us-east-1",
          bucketName: "my-test-bucket",
          fileName: "hello-world.txt",
        },
      });
    });

    it("should use default port when PORT is not provided", () => {
      // Arrange
      delete process.env.PORT;
      process.env.AWS_REGION = "us-east-1";
      process.env.S3_BUCKET_NAME = "my-test-bucket";
      process.env.S3_FILE_NAME = "hello-world.txt";

      // Act
      const config = loadConfig();

      // Assert
      expect(config.port).toBe(8080);
    });

    it("should parse PORT as number when provided as string", () => {
      // Arrange
      process.env.PORT = "5000";
      process.env.AWS_REGION = "us-east-1";
      process.env.S3_BUCKET_NAME = "my-test-bucket";
      process.env.S3_FILE_NAME = "hello-world.txt";

      // Act
      const config = loadConfig();

      // Assert
      expect(config.port).toBe(5000);
      expect(typeof config.port).toBe("number");
    });

    it("should throw error with clear message when AWS_REGION is missing", () => {
      // Arrange
      process.env.PORT = "3000";
      delete process.env.AWS_REGION;
      process.env.S3_BUCKET_NAME = "my-test-bucket";
      process.env.S3_FILE_NAME = "hello-world.txt";

      // Act & Assert
      expect(() => loadConfig()).toThrow(
        "Missing required environment variable: AWS_REGION"
      );
    });

    it("should throw error with clear message when S3_BUCKET_NAME is missing", () => {
      // Arrange
      process.env.PORT = "3000";
      process.env.AWS_REGION = "us-east-1";
      delete process.env.S3_BUCKET_NAME;
      process.env.S3_FILE_NAME = "hello-world.txt";

      // Act & Assert
      expect(() => loadConfig()).toThrow(
        "Missing required environment variable: S3_BUCKET_NAME"
      );
    });

    it("should throw error with clear message when S3_FILE_NAME is missing", () => {
      // Arrange
      process.env.PORT = "3000";
      process.env.AWS_REGION = "us-east-1";
      process.env.S3_BUCKET_NAME = "my-test-bucket";
      delete process.env.S3_FILE_NAME;

      // Act & Assert
      expect(() => loadConfig()).toThrow(
        "Missing required environment variable: S3_FILE_NAME"
      );
    });

    it("should throw error when PORT is not a valid number", () => {
      // Arrange
      process.env.PORT = "invalid-port";
      process.env.AWS_REGION = "us-east-1";
      process.env.S3_BUCKET_NAME = "my-test-bucket";
      process.env.S3_FILE_NAME = "hello-world.txt";

      // Act & Assert
      expect(() => loadConfig()).toThrow("PORT must be a valid number");
    });

    it("should throw error when AWS_REGION is empty string", () => {
      // Arrange
      process.env.PORT = "3000";
      process.env.AWS_REGION = "";
      process.env.S3_BUCKET_NAME = "my-test-bucket";
      process.env.S3_FILE_NAME = "hello-world.txt";

      // Act & Assert
      expect(() => loadConfig()).toThrow(
        "Missing required environment variable: AWS_REGION"
      );
    });

    it("should throw error when S3_BUCKET_NAME is empty string", () => {
      // Arrange
      process.env.PORT = "3000";
      process.env.AWS_REGION = "us-east-1";
      process.env.S3_BUCKET_NAME = "";
      process.env.S3_FILE_NAME = "hello-world.txt";

      // Act & Assert
      expect(() => loadConfig()).toThrow(
        "Missing required environment variable: S3_BUCKET_NAME"
      );
    });

    it("should throw error when S3_FILE_NAME is empty string", () => {
      // Arrange
      process.env.PORT = "3000";
      process.env.AWS_REGION = "us-east-1";
      process.env.S3_BUCKET_NAME = "my-test-bucket";
      process.env.S3_FILE_NAME = "";

      // Act & Assert
      expect(() => loadConfig()).toThrow(
        "Missing required environment variable: S3_FILE_NAME"
      );
    });

    it("should handle different AWS regions correctly", () => {
      // Arrange
      const regions = ["us-west-2", "eu-west-1", "ap-southeast-1"];

      regions.forEach((region) => {
        process.env.PORT = "3000";
        process.env.AWS_REGION = region;
        process.env.S3_BUCKET_NAME = "my-test-bucket";
        process.env.S3_FILE_NAME = "hello-world.txt";

        // Act
        const config = loadConfig();

        // Assert
        expect(config.aws.region).toBe(region);
      });
    });
  });

  describe("ServerConfig interface", () => {
    it("should have correct TypeScript interface structure", () => {
      // Arrange
      process.env.PORT = "3000";
      process.env.AWS_REGION = "us-east-1";
      process.env.S3_BUCKET_NAME = "my-test-bucket";
      process.env.S3_FILE_NAME = "hello-world.txt";

      // Act
      const config: ServerConfig = loadConfig();

      // Assert - TypeScript compilation will catch interface violations
      expect(typeof config.port).toBe("number");
      expect(typeof config.aws.region).toBe("string");
      expect(typeof config.aws.bucketName).toBe("string");
      expect(typeof config.aws.fileName).toBe("string");
    });
  });
});
