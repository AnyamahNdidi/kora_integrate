import mongoose, { AnyObject } from "mongoose";
import bcrypt from "bcrypt";

interface userData {
    name: string,
    email: string,
    password: string,
    product: any[],
    matchPassword(enterpassword: string): Promise<boolean>;
    _doc:any
}

interface iuserData extends userData, mongoose.Document{ }

const userModel = new mongoose.Schema({
    name: {
        type:String
    },

    email: {
        type:String
    },
    password: {
        type:String
    },
    product: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"products",
        }
    ]
},
    {
        timestamps:true
    }
)

userModel.methods.matchPassword = async function (enterpassword: any) {
     return await bcrypt.compare(enterpassword, this.password)
}
    


userModel.pre('save', async function (this:iuserData, next:any) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt: string = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model<iuserData>("users",userModel)