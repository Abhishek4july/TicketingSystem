import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express()
const allowedOrigins = [
  "http://localhost:5173",
  "https://ticketingsystem1.netlify.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));


app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});



//Routes

import userRouter from './routes/user.routes.js'


// routes declarartion

app.use("/api/v1/users",userRouter)    //middleware


import adminRoutes from './routes/admin.routes.js'

app.use("/api/v1/admin",adminRoutes)

import generalRoutes from './routes/general.routes.js'


app.use('/api/v1/tickets',generalRoutes)



export {app}