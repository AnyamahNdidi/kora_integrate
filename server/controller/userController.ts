import { Request, Response } from "express"
import axios from "axios"
import mongoose from "mongoose"
import userModel from "../model/userModel"
import productModel from "../model/productModel"
import { generateToken } from "../utils/geneateToken"
import { asyncHandler } from "../asynsHandler"
import {mainAppError, HTTP } from "../../server/error/errorDefinder"

export const createUser = asyncHandler(async (req: Request, res: Response) => {
    
    try
    {
        const { name, email, password } = req.body

        if (!email || !name || !password )
        {
            return res.status(HTTP.BAD_REQUEST).json({ message:"all fields are required`"})
        }

        const existEmail = await userModel.findOne({ email })
        if (existEmail)
        {
            return res.status(HTTP.UNAUTHORIZED).json({ message: "email alreasy exist" })
        }
        const userCreated = await userModel.create({ name, email, password })

        return res.status(HTTP.CREATED).json({
            message: "user created",
            data: userCreated,
            token: generateToken(userCreated._id)
        })
        
    } catch (error)
    {
        new mainAppError({
            name: "Error created",
            message: "Account can not craeted",
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        })
    }    
})

export const loginIn = asyncHandler(async (req: Request, res: Response) => {

    try
    {
        const { email, password } = req.body
        
        const checkUser = await userModel.findOne({ email })

        if (checkUser)
        {
            const matchPassword = await checkUser.matchPassword(password)
            if (matchPassword)
            {
                const { password, ...info } = checkUser._doc
                res.status(HTTP.OK).json({
                    message: "login successful",
                    data: {
                        ...info,
                        token: generateToken(checkUser._id)
                    }
                })
            } else
            {
                 return res.status(HTTP.BAD_REQUEST).json({ message:"wrong password" })
            }

            
        } else
        {
            return res.status(HTTP.BAD_REQUEST).json({ message:"user not found" })
        }
        
    } catch (error)
    {
        new mainAppError({
            name: "Error created",
            message: "Login failed",
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        })
    }
})
 
export const getUsers = asyncHandler(async(req:Request, res:Response) => {
    
    try
    {
        const getAll = await userModel.find()

        res.status(HTTP.OK).json({
            message: "user not found",
            data:getAll
        })
        
    } catch (error)
    {
         new mainAppError({
            name: "Error created",
            message: "all user not found",
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        })
    }
})

export const getOne = asyncHandler(async(req:Request, res:Response) => {
    
    try
    {
        const getOneUser = await userModel.findById(req.params.id)

        res.status(HTTP.OK).json({
            message: "user not found",
            data:getOneUser
        })
        
    } catch (error)
    {
         new mainAppError({
            name: "Error created",
            message: "all user not found",
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        })
    }
})

export const createPay = asyncHandler(async (req: Request, res: Response) => { 

    try
    {
        const { title, amount, dec } = req.body
        const getUser = await userModel.findById(req.params.id)

        const createPay:any = await productModel.create({
            amount,
            title,
            dec,
            usersName:getUser?.name,

        })

        createPay.users = getUser
        createPay?.save()

        getUser?.product?.push(new mongoose.Types.ObjectId(createPay._id))
        getUser!.save()

        return res.status(HTTP.OK).json({
            message: "payment created successfully",
            data: createPay
        })
    
    } catch (error)
    {
         new mainAppError({
            name: "Error created",
            message: "payment can not be created",
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        })
}


})


export const viewAdminPay = async (req: Request, res: Response) => {
  try {
    const getUser = await productModel.find();

    return res.status(HTTP.OK).json({
      message: "success",
      data: getUser,
    });
  } catch (err) {
    new mainAppError({
            name: "Error created",
            message: "all user not found",
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        })
  }
};

export const viewUserPay = asyncHandler(async (req: Request, res: Response) => {
  try {
    console.log("data");
    const getUser = await userModel.findById(req.params.id).populate({
      path: "product",
      options: {
        sort: {
          createdAt: -1,
        },
      },
    });

    console.log("data: ", getUser);
    return res.status(HTTP.OK).json({
      message: "success",
      data: getUser,
    });
  } catch (err) {
    new mainAppError({
            name: "Error created",
            message: "all user not found",
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        })
  }
});

export const chexkOutPayCard = asyncHandler(async (req: Request, res: Response) => { 

    try
    {
        const { name, email, password } = req.body

        const secket = `sk_test_3AkN3azN8jGnNXMGnFi56PjFWmbq92yfLSrjQ5SN`
        
        const data = {
    "amount": "1000",
    "redirect_url": "https://korapay.com",
    "currency": "NGN",
    "reference": "fix-test-webhook-045",
    "narration": "Fix Test Webhook",
    "channels": [
        "card"
    ],
    "default_channel": "card",
    "customer": {
        "name": "Jycdmbhw Name",
        "email": "jycdmbhw@sharklasers.com"
    },
    "notification_url": "https://webhook.site/8d321d8d-397f-4bab-bf4d-7e9ae3afbd50",
    "metadata":{
        "key0": "test0",
        "key1": "test1",
        "key2": "test2",
        "key3": "test3",
        "key4": "test4"
    }
        }
                
    var config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.korapay.com/merchant/api/v1/charges/initialize',
        headers: { 
            Authorization:`Bearer ${secket}`
        },
        data : data
        };

        await axios(config)
        .then(function (response) {
        console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
        console.log(error);
        });
        
    } catch (error)
    {
        new mainAppError({
            name: "Error created",
            message: "payment not intialized",
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        })
    }
})