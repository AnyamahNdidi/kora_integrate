
import express, { Application, Request, Response, NextFunction } from "express"
import cors from "cors"
import { HTTP, mainAppError } from "./error/errorDefinder"
import { errorHandler } from "./error/errorHandlers"
import userRouter from "./router/userRouter"



export const mainApp = (app:Application) => {
    app.use(express.json()).use(cors())
        .use("/api", userRouter)
        .all("*", (req:Request, res:Response, next:NextFunction) => {
        
            next( 
                new mainAppError({
                    message: `This route ${req.url} doesn't exist`,
                    status: HTTP.NOT_FOUND,
                    name: "Route Error",
                    isSuccess: false
                })


            
            )
            
    }).use(errorHandler)
}