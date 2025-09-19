import { S3Service } from "./services/s3Service.js";
import { loadConfig } from "./config/index.js";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  try {
    const config = loadConfig();
    const s3Service = new S3Service(config);
    const content = await s3Service.getHelloWorldFile();
    console.log("S3 File Content:", content);
  } catch (error) {
    console.error("Error fetching S3 file:", error);
    process.exit(1);
  }
}

main();
