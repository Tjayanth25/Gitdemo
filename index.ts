import express from "express";
import jwt from "jsonwebtoken";
import { UserModel,ContentModel } from "./db";
import { JWT_PASSWORD } from "./config";
import { userMiddleWare } from "./middleware";


const app = express();
app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {
    // TODO: zod validation , hash the password
    const username = req.body.username;
    const password = req.body.password;

    try {
        await UserModel.create({
            username: username,
            password: password
        }) 

        res.json({
            message: "User signed up"
        })
    } catch(e) {
        res.status(411).json({
            message: "User already exists"
        })
    }
})

app.post("/api/v1/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const existingUser = await UserModel.findOne({
        username,
        password
    })
    if (existingUser) {
        const token = jwt.sign({
            id: existingUser._id
        }, JWT_PASSWORD)

        res.json({
            token
        })
    } else {
        res.status(403).json({
            message: "Incorrrect credentials"
        })
    }
})

app.post("/api/v1/content", userMiddleWare,async (req,res) => {
    const link =req.body.link;
    const type =req.body.type; 
    await ContentModel.create({
         link,
         type, 
         //@ts-ignore
         userId:req.userId,
         tags:[]
    })
     res.json({
        message:"Content Added"
    })

})
app.get("/api/v1/content", userMiddleWare,async(req,res)=>{
    //@ts-ignore
    const userId =req.userId;
    const content = await ContentModel.find({
        userId:userId
    }).populate("userId","username")
    res.json({
        content
    })
})
app.delete("/api/v1/delete",userMiddleWare,async(req,res)=>{
    const contentId = req.body.contentId;

    await ContentModel.deleteMany({
        contentId,
        //@ts-ignore
        userId:req.userId 

    })
    res.json({
        message:"Deleted"
    })

})
app.post("/api/v1/share",(req,res)=>{

})
app.get("/api/v1/shareLink",(req,res)=>{

})
app.listen(3000);