import express, { Application } from "express"
import mongoose from "mongoose"
import { mainApp } from "./mainApp"
import userRouter from "./router/userRouter"

const port: number = 3024

const app: Application = express()

mainApp(app)


const url: string = "mongodb+srv://testauth:ilovecoding12345@cluster0.kubrg.mongodb.net/kora?retryWrites=true&w=majority"




const server = app.listen(port, () => {
    console.log("server is ready")

    mongoose.connect(url).then(() => {
        console.log("data base has been connected")
    })
})

process.on("uncaughtException", (error: Error) => {
    console.log("stop here: uncaughtException  ")
    console.log(error)
    process.exit(1)
})


process.on("unhandledRejection", (reason:any) => {
    console.log("stopn here: unhandledRejection")
    console.log(reason)

    server.close(() => {
        process.exit(1)
    })
    
})