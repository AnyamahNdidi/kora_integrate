import express from "express"

const router = express.Router()
// import {generateToken} from "../utils/geneateToken"

import { createUser, loginIn, getUsers, getOne,createPay,viewAdminPay,viewUserPay,chexkOutPayCard } from "../controller/userController"

router.route("/").post(createUser)
router.route("/login").post(loginIn)
router.route("/all/user").get(getUsers)
router.route("/one/:id").get(getOne)
router.route("/one/create/:id").post(createPay)
router.route("/view/admin").get(viewAdminPay);

router.route("/view-user/:id").get(viewUserPay);

router.route("/pay").post(chexkOutPayCard);

export default router