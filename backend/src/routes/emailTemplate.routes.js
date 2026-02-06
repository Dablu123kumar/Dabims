import {Router} from  'express';
import { isAdmin, requireSignIn } from '../middlewares/auth.middleware.js';
import { addEmailTemplateController, getEmailTemplateController } from '../controllers/emailTemplate.controllers.js';

const router = Router()

router.post("/template",requireSignIn, isAdmin,addEmailTemplateController)
router.get("/allTemplates",requireSignIn,isAdmin,getEmailTemplateController) 

export default router;