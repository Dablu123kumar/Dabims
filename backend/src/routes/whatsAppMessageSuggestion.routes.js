import { Router } from "express";
import asyncHandler from "../middlewares/asyncHandler.js";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";
import WhatsAppSuggestionModel from "../models/email-remainder/WhatsappMessageSuggestions.models.js";

const router = Router();

router.post(
  "/status",
  requireSignIn,
  isAdmin,
  asyncHandler(async (req, res, next) => {
    //console.log(req.body);
    try {
      const whatsAppMessageSuggestions = await WhatsAppSuggestionModel.find({});
      whatsAppMessageSuggestions.forEach(
        async (whatsAppMessageSuggestion) =>
          await whatsAppMessageSuggestion.deleteOne()
      );
      const whatsAppSuggestion = new WhatsAppSuggestionModel(req.body);
      await whatsAppSuggestion.save();
      res.status(200).json({ message: "WhatsApp Message Suggestion Added" });
    } catch (error) {
      console.log(error);
    }
  })
);

router.get(
  "/status",
  requireSignIn,
  isAdmin,
  asyncHandler(async (req, res, next) => {
    try {
      const whatsAppMessageSuggestions = await WhatsAppSuggestionModel.find({});
      res.status(200).json(whatsAppMessageSuggestions);
    } catch (error) {
      console.log(error);
    }
  })
);

export default router;
