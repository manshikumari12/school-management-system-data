const express=require("express")
const cors=require("cors")
const connection =require("./db")
const {userroute} =require("./routes/user.route");
const {studentrouter} = require("./routes/student.route");
require("dotenv").config()


const app=express()

app.use(cors())
app.use(express.json())



app.get("/",(req,res)=>{
    res.status(200).send("Home page")
})


app.use("/api",userroute);
app.use("/student",studentrouter)




app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log("db is connected")
    } catch (error) {
        console.log(error)
    }
    console.log("server is running")
})

