const mongoose = require("mongoose")

const Schema = mongoose.Schema

const studentSchema = new Schema({
    name: {
        type: String,
        required: [true, "Student name is required. "],
        trim: true,
        minlength: [3, "Student name must be at least 3 characters."],
        maxlength: [50, "Student name must not exceed 50 characters. "]
    },
    email: {
        type: String,
        required: [true, "Student email is required. "],
        trim: true,
        unique: [true, "Student email must be unique. "],
        lowercase: [true, "Student email must be in lower case. "],
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please provide a valid email address."
        ],

    },
    age: {
        type: Number,
        required: [true, "Age is required."],
        min: [3, "Age must be at least 3."],
        max: [19, "Age cannot exceed 19."],
        validate: {
            validator: Number.isInteger,
            message: "Age must be a whole number."
        }
    },

    course: {
        type: String,
        required: [true, "Course is required."],
        trim: true,
        minlength: [2, "Course name must be at least 2 characters long."]
    },

    image: {
        url: {
            type: String,
            default: ""
        },
        public_id: {
            type: String,
            default: ""
        }
    }
},
    {
        timestamps: true,
        versionKey: false
    }
);

// Export Student Model
const Student = mongoose.model("Student", studentSchema);

module.exports = Student;