require("dotenv").config()

const express = require("express")
const cors = require("cors")
const cloudinary = require("cloudinary").v2

const dbConnection = require("./app/config/dbStudent.config")

cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const app = express()

dbConnection()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//routes

const studentApiRouter = require("./app/routes/student.routes")
app.use("/api/v1/student", studentApiRouter)

app.use((err, req, res, next) => {
    return res.status(400).json({
        success: false,
        message: err.message
    })
})

const port = 5000 || process.env.PORT

app.listen(port, ()=>console.log("Successfully running on port - ", port))