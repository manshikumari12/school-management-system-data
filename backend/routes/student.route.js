const express = require("express");
const studentrouter = express.Router();

const {studentmodel} = require("../model/student.model");
const {
  authMiddleware,
  adminOnly,
  userOrAdmin,
} = require("../auth/auth");

/**
 * ➕ CREATE STUDENT (Admin only)
 * POST /api/students
 */
studentrouter.post(
    "/students",
    authMiddleware,
    adminOnly,
    async (req, res) => {
      try {
        const { name, email, age, course, status } = req.body;
  
        // Validation
        if (!name || !email) {
          return res
            .status(400)
            .json({ message: "Name and Email are required" });
        }
  
        // Check existing student
        const existingStudent = await studentmodel.findOne({ email });
        if (existingStudent) {
          return res
            .status(409)
            .json({ message: "Student already exists" });
        }
  
        // Create student
        const student = await studentmodel.create({
          name,
          email,
          age,
          course,
          status,
          createdBy: req.user.id, // 🔑 from JWT (admin id)
        });
  
        res.status(201).json({
          message: "Student created successfully",
          student,
        });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  );
  

/**
 * 📄 GET ALL STUDENTS (Admin only)
 * GET /api/students
 * 
 */

// GET ALL STUDENTS (Admin only)
// Student List:
// - Table view with actions (View/Edit/Delete)
// - Search by name/email
// - Pagination (server-side bonus point)
// - Delete confirmation


// GET /api/students?search=&page=&limit=
// Admin only
studentrouter.get("/students", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { search = "", page = 1, limit = 5 } = req.query;

    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    const skip = (page - 1) * limit;

    const total = await studentmodel.countDocuments(query);
    const students = await studentmodel
      .find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      students,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// studentrouter.get(
//   "/students",
//   authMiddleware,
//   adminOnly,
//   async (req, res) => {
//     try {
//       const students = await studentmodel.find();

//       res.status(200).json(students);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   }
// );

// studentrouter.get("/students", authMiddleware, adminOnly, async (req, res) => {
//   try {
//     const students = await studentmodel.find();
//     res.status(200).json(students);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

/**
 * 👀 GET SINGLE STUDENT (Admin + User)
 * GET /api/students/:id
 */
studentrouter.get("/students/:id", authMiddleware, userOrAdmin, async (req, res) => {
  try {
    const student = await studentmodel.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * ✏️ UPDATE STUDENT (Admin only)
 * PUT /api/students/:id
 */
studentrouter.put("/students/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const updatedStudent = await studentmodel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * 🗑 DELETE STUDENT (Admin only)
 * DELETE /api/students/:id
 */
studentrouter.delete("/students/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const deletedStudent = await studentmodel.findByIdAndDelete(req.params.id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {studentrouter};
