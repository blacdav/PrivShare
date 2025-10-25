import { configDotenv } from "dotenv"
configDotenv()

export const appConfig = {
    port: process.env.PORT,
    admin: process.env.ADMIN_EMAIL
}

export const dbConfig = {
    uri: process.env.DB_URI,
    name: process.env.DB_NAME
}

export const emailConfig = {
    email: process.env.EMAIL,
    pass: process.env.PASS
}

export const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
}

if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
  throw new Error("JWT secrets are not set in environment variables.");
}

export const jwtConfig = {
    access: process.env.JWT_ACCESS_SECRET,
    refresh: process.env.JWT_REFRESH_SECRET,
    expires: process.env.JWT_EXPIRES
}