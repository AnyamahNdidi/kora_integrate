import jwt from "jsonwebtoken"

export const generateToken = (id:any) => {
    return jwt.sign({id}, "checken", { expiresIn: '1h' })
}