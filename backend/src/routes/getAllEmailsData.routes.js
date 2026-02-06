import {Router} from "express"
import { getAllMailsControllers } from "../../helpers/sendRemainderFees/SendRemainderFeesStudent.js";

const router =  Router()

router.route("/").get(getAllMailsControllers)

export  default router;
