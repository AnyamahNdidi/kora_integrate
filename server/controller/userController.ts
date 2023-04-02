import { json, Request, Response } from "express"
import axios from "axios"
import mongoose from "mongoose"
import  crypto  from "crypto"
import { uuid } from "uuidv4";
import userModel from "../model/userModel"
import productModel from "../model/productModel"
import { generateToken } from "../utils/geneateToken"
import { asyncHandler } from "../asynsHandler"
import { mainAppError, HTTP } from "../../server/error/errorDefinder"


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
            message: "user found",
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

const secret = `sk_test_3AkN3azN8jGnNXMGnFi56PjFWmbq92yfLSrjQ5SN`
const dataUrl = "https://api.korapay.com/merchant/api/v1/charges/card"
const encrypt = "FVY2BQfJLqgroGkoKaFQ3orLgGQEDPow"



export const checkInPayCard = asyncHandler(async (req: Request, res: Response) => { 

    try
    {
        const { amount, dec , title} = req.body
        const userpay = await userModel.findById(req.params.id)
        
        
        const data = {
    "amount": `${amount}`,
    "redirect_url": "https://korapay.com",
    "currency": "NGN",
    "reference": `${uuid()}`,
    "narration": "Fix Test Webhook",
    "channels": [
        "card"
    ],
    "default_channel": "card",
    "customer": {
        "name": `${userpay?.name}`,
        "email": `${userpay?.email}`
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
            Authorization:`Bearer ${secret}`
        },
        data : data
        };

        await axios(config)
        .then(async function (response) {
            console.log(JSON.stringify(response.data));
            
            //  const { title, amount, dec } = req.body
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
            data: {
                paymentInfo: createPay,
                dataPayment:JSON.parse(JSON.stringify(response.data))
            }
        })

         
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

//function to encrypt the data


function encryptAES256(encryptionKey:any, paymentData:any) {  
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey, iv);
  const encrypted = cipher.update(paymentData);

  const ivToHex = iv.toString('hex');
  const encryptedToHex = Buffer.concat([encrypted, cipher.final()]).toString('hex');
  
  return `${ivToHex}:${encryptedToHex}:${cipher.getAuthTag().toString('hex')}`;
}

//this function allow you to desing your own front end model card for payment
//pay in

export const checkInPayment = asyncHandler(async (req: Request, res: Response) => {
    
    try
    {

        //     name: "Test Cards",
    // number: "5188513618552975",
    // cvv: "123",
    // expiry_month: "09",
    // expiry_year: "30",
    // pin: "1234", // optional
        const {
            amount,
            name,
            number,
            cvv,
            pin,
            expiry_month,
            expiry_year,
            title,
            dec

        } = req.body;
       
       
        const paymentData = {
    "reference": uuid(), // must be at least 8 characters
    "card": {
    
    name: name,
    number: number,
    cvv: cvv,
    expiry_month: expiry_month,
    expiry_year: expiry_year,
    pin: pin, // optional
    },
    "amount": amount,
    "currency": "NGN",
    "redirect_url": "https://merchant-redirect-url.com",
    "customer": {
        "name": "John Doe",
        "email": "johndoe@korapay.com"
    },
    "metadata": {
       "internalRef": "JD-12-67",
       "age": 15,
       "fixed": true,
    }
        }

        const StringData = JSON.stringify(paymentData)
        const buffData = Buffer.from(StringData, "utf-8")
        const encryptedData = encryptAES256(encrypt,  buffData)
        
                var config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: dataUrl,
                    headers: {
            Authorization:`Bearer ${secret}`
         },
                    data: {
            charge_data: `${encryptedData}`,
        }
        };

        await  axios(config)
        .then(async function (response) {
        // console.log(JSON.stringify(response.data));
            
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
            data: {
                paymentInfo: createPay,
                dataPayment:JSON.parse(JSON.stringify(response.data))
            }
        })

 
        })
        .catch(function (error) {
        console.log(error);
        });
                
    }catch(error){

         new mainAppError({
            name: "Error created",
            message: "payout cannot be created",
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        })
    }
    
})

export const checkOutToBank = asyncHandler(async (req:Request, res:Response) => {
    try
    {
                    var data = JSON.stringify({
            reference:  uuid(),
            destination: {
                type: "bank_account",
                amount: "100000",
                currency: "NGN",
                narration: "Test Transfer Payment",
                bank_account: {
                bank: "033",
                account: "0000000000"
                },
                customer: {
                name: "John Doe",
                email: "johndoe@korapay.com"
                }
            }
            });

            var config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api.korapay.com/merchant/api/v1/transactions/disburse',
                headers: { 
                "Content-Type": "application/json",
                 Authorization:`Bearer ${secret}`
            },
            data : data,
            };

            axios(config)
            .then(function (response) {
            return res.status(201).json({
          message: "success",
          data: JSON.parse(JSON.stringify(response.data)),
        });
            })
            .catch(function (error) {
            console.log(error);
            });
        
    } catch (error)
    {
         new mainAppError({
            name: "Error created",
            message: "ERROR IN CHECKOUT",
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        })
    }
})