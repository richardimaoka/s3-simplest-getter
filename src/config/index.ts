export interface ServerConfig {
  port: number;
  aws: {
    region: string;
    bucketName: string;
    fileName: string;
  };
}

export function loadConfig(): ServerConfig {
  // Parse port with default value
  const portStr = process.env.PORT;
  let port = 8080; // default port

  if (portStr) {
    const parsedPort = parseInt(portStr, 10);
    if (isNaN(parsedPort)) {
      throw new Error("PORT must be a valid number");
    }
    port = parsedPort;
  }

  // Validate required environment variables
  const awsRegion = process.env.AWS_REGION;
  const s3BucketName = process.env.S3_BUCKET_NAME;
  const s3FileName = process.env.S3_FILE_NAME;

  if (!awsRegion || awsRegion.trim() === "") {
    throw new Error("Missing required environment variable: AWS_REGION");
  }

  if (!s3BucketName || s3BucketName.trim() === "") {
    throw new Error("Missing required environment variable: S3_BUCKET_NAME");
  }

  if (!s3FileName || s3FileName.trim() === "") {
    throw new Error("Missing required environment variable: S3_FILE_NAME");
  }

  return {
    port,
    aws: {
      region: awsRegion,
      bucketName: s3BucketName,
      fileName: s3FileName,
    },
  };
}
