import "dotenv/config";
import connectDB from "./db/index.js";
import { app } from "./app.js";

connectDB().then(()=>{
    app.listen(process.env.PORT || 8040, () => {
        console.log(`Server is running on port ${process.env.PORT || 8040}`);
    })
}).catch((error) => {
    console.error("Error connecting to database", error);
    process.exit(1); 
});




/*
import express from "express";
const app = express();

(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        app.on("error",(error)=>{
            console.log("Error connecting to database", error);
            throw error;
        })
        app.listen(process.env.PORT,()=>{
            console.log(`Server is running on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.log("Error connecting to database", error)
        throw error;
    }
})() */