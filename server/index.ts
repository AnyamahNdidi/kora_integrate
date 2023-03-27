import express, { Application } from "express"
import mongoose from "mongoose"
import {mainApp} from "./mainApp"

const port: number = 3024

const app: Application = express()

mainApp(app)


const url: string = "mongodb+srv://testauth:ilovecoding12345@cluster0.kubrg.mongodb.net/ajchat?retryWrites=true&w=majority"




const server = app.listen(port, () => {
    console.log("server is ready")
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