import { configDotenv } from "dotenv";
configDotenv()

export const dbConfig = {
  uri: process.env.DB_URI,
  name: process.env.DB_NAME
}

if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES) {
  throw new Error("JWT secrets are not set in environment variables.");
}

export const AppConfig = {
    ipfs_api: process.env.IPFS_API,
    jwt_secret: process.env.JWT_SECRET,
    jwt_expires: process.env.JWT_EXPIRES
}