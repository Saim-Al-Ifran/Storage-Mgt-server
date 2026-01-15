require('dotenv').config();

const mongoDbUrl= process.env.MONGODB_URL;
const nodeEnv   = process.env.NODE_PRODUCTION;
const accessToken = process.env.JWT_SECRET_KEY;
const refreshToken = process.env.JWT_REFRESH_SECRET_KEY;
const cloudinaryCloudName= process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
const cloudinarySecretKey = process.env.CLOUDINARY_API_SECRET_KEY;



module.exports = {
    nodeEnv,
    accessToken,
    refreshToken,
    mongoDbUrl,
    cloudinaryCloudName,
    cloudinaryApiKey,
    cloudinarySecretKey
}