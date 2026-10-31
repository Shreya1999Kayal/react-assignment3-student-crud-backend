const path = require("path")
const swaggerJsdoc = require("swagger-jsdoc")

const port = process.env.PORT || 5000

const options = {
    definition: {
        swagger: "2.0",
        info: {
            title: "Student Management API",
            version: "1.0.0",
            description: "Student CRUD api with Cloudinary image upload"
        },
        host: `localhost:${port}`,
        schemes: ["http"]
    },
    apis: [path.join(__dirname, "../routes/*.js").replace(/\\/g, "/")]
}

module.exports = swaggerJsdoc(options)