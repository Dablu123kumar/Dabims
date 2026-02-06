import { Router } from "express";
import {
  submitFormController,
  getAllSubmitFormData,
  deleteSingleFormDataController,
  updateSingleFormDataValueController,
  getSingleFormDataValueByIdController,
  submitUserFormController,
} from "../controllers/submitForm.controllers.js";
import { requireSignIn } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/")
  .post(requireSignIn, submitFormController)
  .get(getAllSubmitFormData);
router.post("/enquiry-form", submitUserFormController);
router
  .route("/:id")
  .delete(deleteSingleFormDataController)
  .get(getSingleFormDataValueByIdController)
  .put(updateSingleFormDataValueController);
// router.route("/:id").get(getSingle)

export default router;
