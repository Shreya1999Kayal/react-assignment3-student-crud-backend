
const Student = require("../models/Student");
const uploadOnCloudinary = require("../services/cloudinary");
const { deleteFromCloudinary } = require("../services/cloudinary");

const mongoose = require("mongoose");

class StudentController {

    // CREATE STUDENT
    async createStudent(req, res) {
        try {
            const { name, email, age, course } = req.body;

            //1. Validate required fields

            if (
                typeof name !== "string" || !name.trim() ||
                typeof email !== "string" || !email.trim() ||
                age === undefined || age === null || age === "" ||
                typeof course !== "string" || !course.trim()
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Name, email, age and course are required."
                });
            }

            // 2. Name validation
            const studentName = name.trim();

            if (studentName.length < 3 || studentName.length > 50) {
                return res.status(400).json({
                    success: false,
                    message: "Name must be between 3 and 50 characters."
                });
            }


            //3.Email validation
            // Normalize email
            const normalizedEmail = email.trim().toLowerCase();

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(normalizedEmail)) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide a valid email address."
                });
            }

            // Check existing student
            const isStudentExist = await Student.findOne({
                email: normalizedEmail
            });

            if (isStudentExist) {
                return res.status(409).json({
                    success: false,
                    message: "Student already exists."
                });
            }

            // 4.Age valiadation

            const normalizedAge = Number(age)

            if (!Number.isInteger(normalizedAge) || normalizedAge < 3 || normalizedAge > 19) {
                return res.status(400).json({
                    success: false,
                    message: "Student must be a whole number and between 3 and 19."
                });


            }

            // 5. Course validation
            const studentCourse = course.trim();

            if (studentCourse.length < 2) {
                return res.status(400).json({
                    success: false,
                    message: "Course name must contain at least 2 characters."
                });
            }


            // Default image
            let image = {
                url: "",
                public_id: ""
            };

            // Upload image to Cloudinary
            if (req.file) {
                const upload = await uploadOnCloudinary(
                    req.file.buffer,
                    "student-images"
                );

                if (!upload?.url || !upload?.public_id) {
                    throw new Error("Image upload failed.");
                }


                image = {
                    url: upload.url,
                    public_id: upload.public_id
                };
            }

            // Create student
            const data = new Student({ name, email, age, course, image })
            const studentdata = await data.save()

            return res.status(201).json({
                success: true,
                message: "Student added successfully.",
                data: studentdata
            })



        }
        catch (error) {

            console.error("Create Student Error:", error);

            return res.status(500).json({
                success: false,
                message: `Error - ${error.message}`
            });
        }
    }


    // GET - All Students
    async getStudents(req, res) {
        try {
            const students = await Student.find()
                .sort({ createdAt: -1 })
                .lean();

            return res.status(200).json({
                success: true,
                message: students.length
                    ? "Students fetched successfully."
                    : "No students found.",
                total: students.length,
                data: students
            });

        } catch (error) {
            console.error("Get Students Error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch students."
            });
        }
    }




    // GET - Student By ID (View and Edit)
    async getStudentById(req, res) {
        try {
            const { id } = req.params;

            // 1. Validate MongoDB ObjectId
            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid student ID."
                });
            }

            // 2. Find student by ID
            const student = await Student.findById(id).lean();

            // 3. Check student existence
            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: "Student not found."
                });
            }

            // 4. Send successful response
            return res.status(200).json({
                success: true,
                message: "Student details fetched successfully.",
                data: student
            });

        } catch (error) {
            console.error("Get Student By ID Error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch student details."
            });
        }
    }

    // PUT - Update Student
    async updateStudent(req, res) {
        let newUploadedImage = null;

        try {
            const { id } = req.params;

            // 1. Validate MongoDB ID
            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid student ID."
                });
            }

            // 2. Find existing student
            const prev = await Student.findById(id);

            if (!prev) {
                return res.status(404).json({
                    success: false,
                    message: "Student not found."
                });
            }

            const { name, email, age, course } = req.body;
            const updatedData = {};

            // 3. Validate and update name
            if (name !== undefined) {
                if (typeof name !== "string") {
                    return res.status(400).json({
                        success: false,
                        message: "Name must be a string."
                    });
                }

                const updateName = name.trim();

                if (updateName.length < 3 || updateName.length > 50) {
                    return res.status(400).json({
                        success: false,
                        message: "Name must be between 3 and 50 characters."
                    });
                }

                updatedData.name = updateName;
            }

            // 4. Validate and update email
            if (email !== undefined) {
                if (typeof email !== "string" || !email.trim()) {
                    return res.status(400).json({
                        success: false,
                        message: "Please provide a valid email address."
                    });
                }

                const updateEmail = email.trim().toLowerCase();

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailRegex.test(updateEmail)) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid email format."
                    });
                }

                const exist = await Student.findOne({
                    email: updateEmail,
                    _id: { $ne: id }
                });

                if (exist) {
                    return res.status(409).json({
                        success: false,
                        message: "Another student already uses this email."
                    });
                }

                updatedData.email = updateEmail;
            }

            // 5. Validate and update age
            if (age !== undefined) {
                if (age === "" || age === null) {
                    return res.status(400).json({
                        success: false,
                        message: "Age is required."
                    });
                }

                const studentAge = Number(age);

                if (
                    !Number.isInteger(studentAge) ||
                    studentAge < 3 ||
                    studentAge > 19
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "Age must be a whole number between 3 and 19."
                    });
                }

                updatedData.age = studentAge;
            }

            // 6. Validate and update course
            if (course !== undefined) {
                if (typeof course !== "string") {
                    return res.status(400).json({
                        success: false,
                        message: "Course must be a string."
                    });
                }

                const updateCourse = course.trim();

                if (updateCourse.length < 2) {
                    return res.status(400).json({
                        success: false,
                        message: "Course name must contain at least 2 characters."
                    });
                }

                updatedData.course = updateCourse;
            }

            // 7. Check if any field is provided
            if (Object.keys(updatedData).length === 0 && !req.file) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide at least one field to update."
                });
            }

            // 8. Upload new image
            if (req.file) {
                const uploaded = await uploadOnCloudinary(
                    req.file.buffer,
                    "student-images"
                );

                if (!uploaded?.url || !uploaded?.public_id) {
                    throw new Error("Image upload failed.");
                }

                newUploadedImage = uploaded;

                updatedData.image = {
                    url: uploaded.url,
                    public_id: uploaded.public_id
                };
            }

            // 9. Update student in MongoDB
            const updatedStudent = await Student.findByIdAndUpdate(
                id,
                { $set: updatedData },
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!updatedStudent) {
                return res.status(404).json({
                    success: false,
                    message: "Student not found."
                });
            }

            // 10. Delete old image after successful database update
            if (newUploadedImage && prev.image?.public_id) {
                try {
                    await deleteFromCloudinary(prev.image.public_id);
                } catch (imageError) {
                    console.error("Old image deletion failed:", imageError);
                }
            }

            return res.status(200).json({
                success: true,
                message: "Student updated successfully.",
                data: updatedStudent
            });

        } catch (error) {

            // Clean up newly uploaded image if database update failed
            if (newUploadedImage?.public_id) {
                try {
                    await deleteFromCloudinary(newUploadedImage.public_id);
                } catch (cleanupError) {
                    console.error("New image cleanup failed:", cleanupError);
                }
            }


            console.error("Update Student Error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to update student."
            });
        }
    }


    // DELETE - remove student and Cloudinary image
    async deleteStudent(req, res) {
        try {
            const { id } = req.params;

            // 1. Validate student ID
            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid student id."
                });
            }

            // 2. Find and delete student from MongoDB
            const deletedStudent = await Student.findByIdAndDelete(id);

            if (!deletedStudent) {
                return res.status(404).json({
                    success: false,
                    message: "Student not found."
                });
            }

            // 3. Delete image from Cloudinary
            let imageDeleted = true;

            if (deletedStudent.image?.public_id) {
                try {
                    await deleteFromCloudinary(deletedStudent.image.public_id);
                } catch (error) {
                    imageDeleted = false;
                    console.error("Cloudinary deletion failed:", error);
                }
            }

            // 4. Send response
            return res.status(200).json({
                success: true,
                message: imageDeleted
                    ? "Student deleted successfully."
                    : "Student deleted, but image cleanup failed."
            });

        } catch (error) {
            console.error("Delete Student Error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to delete student."
            });
        }
    }




}

module.exports = new StudentController();
