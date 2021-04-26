const jwtSecret= require('crypto').randomBytes(32);

module.exports = {
    ISS: process.env.ISS || "localhost:3000",
    AUD: process.env.AUD || "localhost:3000",
    HOST: process.env.HOST || "localhost",
    PORT: process.env.HOST || 3000,
    JWT_SECRET: process.env.JWT_SECCRET || jwtSecret,
    CLIENT_SECRET: "2db1371b619fb464bf2fc63f99d207e262e9fdb3",
    CLIENT_ID: "5183673edbb937ffe495",
    GITHUBUSER_ENDPOINT: "https://api.github.com/user",
    GITHUBUSEREMAIL_ENDPOINT: "https://api.github.com/user/emails"
}