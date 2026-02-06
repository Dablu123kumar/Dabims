import asyncHandler from "../middlewares/asyncHandler.js";
import PaymentOptionsModel from "../models/payment-options/paymentoption.models.js";

export const createPaymentOptionController = asyncHandler(
  async (req, res, next) => {
    try {
      const { name, date } = req.body;
      if (!name) {
        return res
          .status(400)
          .json({ error: "Payment Option Name is required" });
      }
      const newPaymentOption = new PaymentOptionsModel({
        name,
        createdBy: req.user.fName + " " + req.user.lName,
        date,
      });
      const savedPaymentOptions = await newPaymentOption.save();
      res.status(201).json(savedPaymentOptions);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);

export const getAllPaymentOptionsListController = asyncHandler(
  async (req, res, next) => {
    try {
      const paymentOptions = await PaymentOptionsModel.find({});
      res.status(200).json(paymentOptions);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);

export const updatePaymentOptionController = asyncHandler(
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const paymentOption = await PaymentOptionsModel.findById(id);
      if (!paymentOption) {
        return res.status(404).json("Payment Option not found");
      }

      paymentOption.name = req.body.name || paymentOption.name;
      paymentOption.date = req.body.date || paymentOption.date;
      paymentOption.createdBy =
        req.user.fName + " " + req.user.lName || paymentOption.createdBy;
      let updatedPaymentOption = await paymentOption.save();
      res.status(200).json(updatedPaymentOption);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);

export const deletePaymentOptionController = asyncHandler(
  async (req, res, next) => {
    try {
      const paymentOption = await PaymentOptionsModel.findById(req.params.id);
      if (!paymentOption) {
        return res.status(404).json("Payment Option not found");
      }
      await paymentOption.deleteOne();
      res.status(200).json({ message: "Payment Option deleted" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);
