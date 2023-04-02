import express from "express"

const router = express.Router()
// import {generateToken} from "../utils/geneateToken"

import { createUser, loginIn, getUsers, getOne,createPay,viewAdminPay,viewUserPay,checkInPayCard,checkInPayment,checkOutToBank } from "../controller/userController"

router.route("/").post(createUser)
router.route("/login").post(loginIn)
router.route("/all/user").get(getUsers)
router.route("/one/:id").get(getOne)
router.route("/one/create/:id").post(createPay)
router.route("/view/admin").get(viewAdminPay);

router.route("/view-user/:id").get(viewUserPay);

router.route("/pay/:id").post(checkInPayCard);
router.route("/checkout-pay/:id").post(checkInPayment);
router.route("/checkout-pay/:id").post(checkInPayment);

router.route("/user-payout").post(checkOutToBank);

export default router