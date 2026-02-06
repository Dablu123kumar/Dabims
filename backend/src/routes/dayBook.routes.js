import { Router } from "express";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";
import {
  addDayBookAccountController,
  getDayBookAccountsListsController,
  deleteDayBookAccountsListDataController,
  updateDayBookAccountController,
  getSingleDayBookAccountController,
  //  day book data controller start here
  addDayBookDataController,
  getDayBookDataController,
  getSingleDayBookDataController,
  deleteDayBookDataByIdController,
  updateDayBookDataByIdController,
} from "../controllers/dayBook/dayBookAccount.controllers.js";

const router = Router();
router.get("/singleAccountAccount/:id", getSingleDayBookAccountController);

router.get("/", requireSignIn, getDayBookAccountsListsController);
router.delete(
  "/:id",
  requireSignIn,
  isAdmin,
  deleteDayBookAccountsListDataController
);
router.put("/:id", requireSignIn, isAdmin, updateDayBookAccountController);

router.post("/addAccount", requireSignIn, isAdmin, addDayBookAccountController);

// day Book Data Start here ................................
router.get(
  "/singleAccountDayBookLists/:id",
  requireSignIn,
  getSingleDayBookDataController
);
router.post("/addData", requireSignIn, isAdmin, addDayBookDataController);
router.get("/data", requireSignIn, getDayBookDataController);
router.put("/data/:id", requireSignIn, updateDayBookDataByIdController);
router.delete("/data/:id", requireSignIn, deleteDayBookDataByIdController);

export default router;
