
require("dotenv").config({ quiet: true });

const express = require("express");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const swaggerUi = require("swagger-ui-express");

const dbConnection = require("./app/config/dbStudent.config");
const swaggerSpec = require("./app/config/swagger.config");

const app = express();

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/api-docs.json", (req, res) => {
    res.json(swaggerSpec);
});

// Routes
const studentApiRouter = require("./app/routes/student.routes");

app.use("/api/v1/student", studentApiRouter);

// Error handler
app.use((err, req, res, next) => {
    console.error(err);

    return res.status(err.status || 400).json({
        success: false,
        message: err.message || "Something went wrong."
    });
});

// Server configuration
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Connect MongoDB first
        await dbConnection();

        // Start server after successful DB connection
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Successfully running on port - ${PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();
