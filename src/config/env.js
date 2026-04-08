require("dotenv").config();

module.exports = {
    NODE_ENV: process.env.NODE_ENV || "development",

    PORT: process.env.PORT || 5000,

    
    DB_CLIENT: process.env.DB_CLIENT || "mysql2",
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    
    REDIS_URL: process.env.REDIS_URL,
    
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    
};