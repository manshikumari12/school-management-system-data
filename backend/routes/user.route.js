const express=require("express")
const { usermodel } = require("../model/user.model")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
// const { blackmodel } = require("../models/blacklistmodel.")
const { authMiddleware ,  adminOnly,
  userOrAdmin} = require("../auth/auth")
// const { client } = require("../utils/reids")

const userroute=express.Router()

userroute.get("/",(req,res)=>{
    res.status(200).send("user route")
})


userroute.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ msg: "Name, email and password are required" });
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }

    // Password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters" });
    }

    // 2. Check existing user
    const existingUser = await usermodel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ msg: "User already exists" });
    }

    // 3. Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // 4. Role handling (simple & safe)
    let userRole = "user"; // default

    if (role === "admin") {
      userRole = "admin";
    }

    // 5. Create user
    const user = await usermodel.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });

    res.status(201).json({
      msg: "Registration successful",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});


userroute.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    // 2. Find user
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // 3. Password check
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Incorrect password" });
    }

    // 4. ROLE CHECK (EXACTLY AS YOU WANT)
    let role;

    if (user.role === "admin") {
      role = "admin";
    } else if (user.role === "user") {
      role = "user";
    } else {
      return res.status(403).json({ msg: "Invalid role assigned" });
    }

    // 5. Generate JWT
    const token = jwt.sign(
      { id: user._id, role: role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 6. Response
    res.status(200).json({
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: role,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});


  
  userroute.get("/userdata/:id", authMiddleware, userOrAdmin, async (req, res) => {
    try {
      const student = await usermodel.findById(req.params.id);
  
      if (!student) {
        return res.status(404).json({ msg: "Student not found" });
      }
  
      res.status(200).json({
        msg: "Student fetched",
        student
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Server error" });
    }
  });


userroute.get("/userdata", authMiddleware, userOrAdmin, async (req, res) => {
  try {
    const users = await usermodel.find();

    res.status(200).json({
      msg: "All users fetched",
      count: users.length,
      users,  
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});


// userroute.get("/logout",auth,async (req,res)=>{
//     try {
//         let token=await client.get('token');
//         let newblack=new blackmodel({token})
//         await newblack.save()
//         res.send({"msg":"logout successfull"})
//     } catch (error) {
//         res.send(error.message)
//     }
// })











module.exports={
    userroute
}