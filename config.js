const jwtSecret= require('crypto').randomBytes(32);

module.exports = {
    ISS: process.env.ISS || "localhost:3000",
    AUD: process.env.AUD || "localhost:3000",
    HOST: process.env.HOST || "localhost",
    PORT: process.env.HOST || 3000,
    JWT_SECRET: process.env.JWT_SECCRET || jwtSecret

}