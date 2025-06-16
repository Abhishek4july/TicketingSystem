import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
    path:'./.env'
})

import fs from "fs";
import path from "path";

const tempDir = path.join("public", "temp");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
  console.log("✅ Created missing folder: public/temp");
}

connectDB()
.then(()=>{
    app.listen(process.env.PORT||8000,()=>{
        console.log(`Server is running at Port : ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MONGODB connection failed !!!",err);
    
})