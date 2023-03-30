import mongoose, { Schema } from "mongoose";

interface iProduct{
    title: string;
    amount: number;
    description: string;
    usersName: string;
    users:{}
}

interface userIProduct extends iProduct, mongoose.Document{ }

const cardModel = new mongoose.Schema({
    title: {
        type:String
    },
    amount: {
        type:Number
    },
    des: {
        type:String
    },
    usersName: {
        type:String
    },
    users: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"users"
    }
},
    {
    timestamps:true,
    })

    export default mongoose.model<userIProduct>("products",cardModel)