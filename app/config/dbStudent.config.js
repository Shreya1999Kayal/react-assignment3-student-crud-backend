require("dotenv").config()

// console.log("Mongo_Url loaded:", !!process.env.Mongo_Url)
const mongoose = require("mongoose")


const dbConnection = async () => {
    try {
        const MONGO_URL = process.env.MONGO_URL

        if (!MONGO_URL) {
            throw new Error("Mongo db connection url is missing.")
        }

        const connected = mongoose.connect(MONGO_URL)

        if(connected){
            console.log("Database is successfully connected. ")
        }
        else{
            console.log("Database is not successfully connected. ")
        }
    }
    catch(err){
        console.log(err)
    }
}

module.exports = dbConnection