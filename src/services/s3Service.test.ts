import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { S3Service } from "./s3Service.js";
import { ServerConfig } from "../config/index.js";

// Mock the AWS SDK
vi.mock("@aws-sdk/client-s3", () => ({
  S3Client: vi.fn(),
  GetObjectCommand: vi.fn(),
}));

describe("S3Service", () => {
  let s3Service: S3Service;
  let mockS3Client: { send: Mock };
  let config: ServerConfig;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Create mock S3 client
    mockS3Client = {
      send: vi.fn(),
    };

    // Mock S3Client constructor to return our mock
    (S3Client as any).mockImplementation(() => mockS3Client);

    // Create test configuration
    config = {
      port: 3000,
      aws: {
        region: "us-east-1",
        bucketName: "test-bucket",
        fileName: "hello-world.txt",
      },
    };

    // Create S3Service instance
    s3Service = new S3Service(config);
  });

  describe("constructor", () => {
    it("should create S3Client with correct configuration", () => {
      // Act
      new S3Service(config);

      // Assert
      expect(S3Client).toHaveBeenCalledWith({
        region: "us-east-1",
      });
    });
  });

  describe("getHelloWorldFile", () => {
    it("should return file content when S3 request succeeds", async () => {
      // Arrange
      const mockFileContent = "Hello, World!";
      const mockResponse = {
        Body: {
          transformToString: vi.fn().mockResolvedValue(mockFileContent),
        },
      };
      mockS3Client.send.mockResolvedValue(mockResponse);

      // Act
      const result = await s3Service.getHelloWorldFile();

      // Assert
      expect(result).toBe(mockFileContent);
      expect(GetObjectCommand).toHaveBeenCalledWith({
        Bucket: "test-bucket",
        Key: "hello-world.txt",
      });
      expect(mockS3Client.send).toHaveBeenCalledTimes(1);
    });

    it("should throw S3FileNotFoundError when file does not exist (NoSuchKey)", async () => {
      // Arrange
      const s3Error = new Error("NoSuchKey");
      s3Error.name = "NoSuchKey";
      mockS3Client.send.mockRejectedValue(s3Error);

      // Act & Assert
      await expect(s3Service.getHelloWorldFile()).rejects.toThrow(
        "S3FileNotFoundError"
      );
    });

    it("should throw S3FileNotFoundError when bucket does not exist (NoSuchBucket)", async () => {
      // Arrange
      const s3Error = new Error("NoSuchBucket");
      s3Error.name = "NoSuchBucket";
      mockS3Client.send.mockRejectedValue(s3Error);

      // Act & Assert
      await expect(s3Service.getHelloWorldFile()).rejects.toThrow(
        "S3FileNotFoundError"
      );
    });

    it("should throw S3ServiceUnavailableError for network connectivity issues", async () => {
      // Arrange
      const networkError = new Error("NetworkingError");
      networkError.name = "NetworkingError";
      mockS3Client.send.mockRejectedValue(networkError);

      // Act & Assert
      await expect(s3Service.getHelloWorldFile()).rejects.toThrow(
        "S3ServiceUnavailableError"
      );
    });

    it("should throw S3ServiceUnavailableError for service unavailable errors", async () => {
      // Arrange
      const serviceError = new Error("ServiceUnavailable");
      serviceError.name = "ServiceUnavailable";
      mockS3Client.send.mockRejectedValue(serviceError);

      // Act & Assert
      await expect(s3Service.getHelloWorldFile()).rejects.toThrow(
        "S3ServiceUnavailableError"
      );
    });

    it("should throw S3AuthenticationError for access denied errors", async () => {
      // Arrange
      const authError = new Error("AccessDenied");
      authError.name = "AccessDenied";
      mockS3Client.send.mockRejectedValue(authError);

      // Act & Assert
      await expect(s3Service.getHelloWorldFile()).rejects.toThrow(
        "S3AuthenticationError"
      );
    });

    it("should throw S3AuthenticationError for forbidden errors", async () => {
      // Arrange
      const forbiddenError = new Error("Forbidden");
      forbiddenError.name = "Forbidden";
      mockS3Client.send.mockRejectedValue(forbiddenError);

      // Act & Assert
      await expect(s3Service.getHelloWorldFile()).rejects.toThrow(
        "S3AuthenticationError"
      );
    });

    it("should throw S3InternalError for unexpected AWS SDK errors", async () => {
      // Arrange
      const unexpectedError = new Error("UnexpectedError");
      unexpectedError.name = "UnexpectedError";
      mockS3Client.send.mockRejectedValue(unexpectedError);

      // Act & Assert
      await expect(s3Service.getHelloWorldFile()).rejects.toThrow(
        "S3InternalError"
      );
    });

    it("should log error details for debugging purposes", async () => {
      // Arrange
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const s3Error = new Error("Test error for logging");
      s3Error.name = "TestError";
      mockS3Client.send.mockRejectedValue(s3Error);

      // Act
      try {
        await s3Service.getHelloWorldFile();
      } catch (error) {
        // Expected to throw
      }

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        "S3 Error:",
        expect.objectContaining({
          name: "TestError",
          message: "Test error for logging",
        })
      );

      consoleSpy.mockRestore();
    });

    it("should handle empty file content", async () => {
      // Arrange
      const mockResponse = {
        Body: {
          transformToString: vi.fn().mockResolvedValue(""),
        },
      };
      mockS3Client.send.mockResolvedValue(mockResponse);

      // Act
      const result = await s3Service.getHelloWorldFile();

      // Assert
      expect(result).toBe("");
    });

    it("should handle large file content", async () => {
      // Arrange
      const largeContent = "A".repeat(10000);
      const mockResponse = {
        Body: {
          transformToString: vi.fn().mockResolvedValue(largeContent),
        },
      };
      mockS3Client.send.mockResolvedValue(mockResponse);

      // Act
      const result = await s3Service.getHelloWorldFile();

      // Assert
      expect(result).toBe(largeContent);
      expect(result.length).toBe(10000);
    });

    it("should handle Body transformation errors", async () => {
      // Arrange
      const mockResponse = {
        Body: {
          transformToString: vi
            .fn()
            .mockRejectedValue(new Error("Transform failed")),
        },
      };
      mockS3Client.send.mockResolvedValue(mockResponse);

      // Act & Assert
      await expect(s3Service.getHelloWorldFile()).rejects.toThrow(
        "S3InternalError"
      );
    });

    it("should handle missing Body in response", async () => {
      // Arrange
      const mockResponse = {}; // No Body property
      mockS3Client.send.mockResolvedValue(mockResponse);

      // Act & Assert
      await expect(s3Service.getHelloWorldFile()).rejects.toThrow(
        "S3InternalError"
      );
    });
  });

  describe("error types", () => {
    it("should create custom error types with correct names and messages", async () => {
      // Test each error type by triggering them
      const errorTests = [
        { awsError: "NoSuchKey", expectedType: "S3FileNotFoundError" },
        { awsError: "NoSuchBucket", expectedType: "S3FileNotFoundError" },
        {
          awsError: "NetworkingError",
          expectedType: "S3ServiceUnavailableError",
        },
        { awsError: "AccessDenied", expectedType: "S3AuthenticationError" },
        { awsError: "UnknownError", expectedType: "S3InternalError" },
      ];

      for (const test of errorTests) {
        // Arrange
        const s3Error = new Error(`Test ${test.awsError}`);
        s3Error.name = test.awsError;
        mockS3Client.send.mockRejectedValue(s3Error);

        // Act & Assert
        try {
          await s3Service.getHelloWorldFile();
          expect.fail("Should have thrown an error");
        } catch (error: any) {
          expect(error.name).toBe(test.expectedType);
          expect(error.message).toContain(test.expectedType);
        }
      }
    });
  });
});
