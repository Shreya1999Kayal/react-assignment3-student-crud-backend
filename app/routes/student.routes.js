const express = require("express")

const router = express.Router()

const studentController = require("../controllers/student.controllers.js")
const upload = require("../utils/studentuploadpic.utils.js")

//create student
/**
 * @swagger
 * /api/v1/student/create:
 *   post:
 *     summary: Create Student
 *     tags:
 *       - Student CRUD with Cloudinary swagger yaml api
 *     consumes:
 *       - multipart/form-data
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: formData
 *         name: name
 *         type: string
 *         required: true
 *         description: Student name (3 to 50 characters)
 *       - in: formData
 *         name: email
 *         type: string
 *         required: true
 *         description: Unique student email
 *       - in: formData
 *         name: age
 *         type: integer
 *         required: true
 *         description: Age between 3 and 19
 *       - in: formData
 *         name: course
 *         type: string
 *         required: true
 *         description: Course name (minimum 2 characters)
 *       - in: formData
 *         name: image
 *         type: file
 *         required: false
 *         description: Student image (png, jpg, jpeg, gif or webp, max 2 MB)
 *     responses:
 *       201:
 *         description: Student added successfully.
 *       400:
 *         description: Bad Request
 *       409:
 *         description: Student already exists.
 *       500:
 *         description: Server Error
 */
router.post("/create", upload.single("image"), studentController.createStudent)

//get all students
/**
 * @swagger
 * /api/v1/student/get:
 *   get:
 *     summary: Get all the students from Database
 *     tags:
 *       - Student CRUD with Cloudinary swagger yaml api
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Students fetched successfully.
 *       500:
 *         description: Server Error
 */
router.get("/get", studentController.getStudents)

//get a student
/**
 * @swagger
 * /api/v1/student/get/{id}:
 *   get:
 *     summary: Get the student from Database by id
 *     tags:
 *       - Student CRUD with Cloudinary swagger yaml api
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: MongoDB student id
 *     responses:
 *       200:
 *         description: Student details fetched successfully.
 *       400:
 *         description: Invalid student ID.
 *       404:
 *         description: Student not found.
 *       500:
 *         description: Server Error
 */
router.get("/get/:id", studentController.getStudentById)

//update a student
/**
 * @swagger
 * /api/v1/student/update/{id}:
 *   put:
 *     summary: Update the student from Database by id
 *     tags:
 *       - Student CRUD with Cloudinary swagger yaml api
 *     consumes:
 *       - multipart/form-data
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: MongoDB student id
 *       - in: formData
 *         name: name
 *         type: string
 *         required: false
 *         description: Student name (3 to 50 characters)
 *       - in: formData
 *         name: email
 *         type: string
 *         required: false
 *         description: Unique student email
 *       - in: formData
 *         name: age
 *         type: integer
 *         required: false
 *         description: Age between 3 and 19
 *       - in: formData
 *         name: course
 *         type: string
 *         required: false
 *         description: Course name (minimum 2 characters)
 *       - in: formData
 *         name: image
 *         type: file
 *         required: false
 *         description: New image (replaces the old one on Cloudinary)
 *     responses:
 *       200:
 *         description: Student updated successfully.
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Student not found.
 *       409:
 *         description: Another student already uses this email.
 *       500:
 *         description: Server Error
 */
router.put("/update/:id", upload.single("image"), studentController.updateStudent)

//delete a student
/**
 * @swagger
 * /api/v1/student/delete/{id}:
 *   delete:
 *     summary: Delete the student from Database by id
 *     tags:
 *       - Student CRUD with Cloudinary swagger yaml api
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: MongoDB student id
 *     responses:
 *       200:
 *         description: Student deleted successfully.
 *       400:
 *         description: Invalid student id.
 *       404:
 *         description: Student not found.
 *       500:
 *         description: Server Error
 */
router.delete("/delete/:id", studentController.deleteStudent)

module.exports = router