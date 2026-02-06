import mongoose from "mongoose";
import asyncHandler from "../../middlewares/asyncHandler.js";
import CourseFeesModel from "../../models/courseFees/courseFees.models.js";
import DayBookAccountModel from "../../models/day-book/DayBookAccounts.models.js";
import DayBookDataModel from "../../models/day-book/DayBookData.models.js";

export const addDayBookAccountController = asyncHandler(
  async (req, res, next) => {
    const { accountName, accountType, companyId } = req.body;
    try {
      switch (true) {
        case !accountName:
          return res.status(400).json({ error: "Account name is required" });
        case !accountType:
          return res.status(400).json({ error: "Account name is required" });
      }

      const existingAccountName = await DayBookAccountModel.findOne({
        accountName,
        companyId : new mongoose.Types.ObjectId(companyId)
      });

      if (existingAccountName) {
        return res
          .status(400)
          .json({ error: "DayBook Account already exists for this company" });
      }

      const newDayBookAccount = new DayBookAccountModel({
        accountName,
        accountType,
        companyId,
      });
      await newDayBookAccount.save();
      res.status(201).json(newDayBookAccount);
    } catch (error) {
        // ✅ Handle duplicate key error from MongoDB
    if (error.code === 11000) {
      return res.status(400).json({
        error: "DayBook Account already exists for this company",
      });
    }
      res.status(500).json({
        error: "Error while creating account in daybook" || error.message,
      });
    }
  }
);

export const getDayBookAccountsListsController = asyncHandler(
  async (req, res, next) => {
    try {
      const daybookAccounts = await DayBookAccountModel.find({});
      res.status(200).json(daybookAccounts);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error while getting day book accounts lists" });
    }
  }
);
export const getSingleDayBookAccountController = asyncHandler(
  async (req, res, next) => {
    try {
      const daybookAccounts = await DayBookAccountModel.findById(
        req.params.id
      ).populate("companyId");

      res.status(200).json(daybookAccounts);
    } catch (error) {
      res.status(500).json({
        error: "Error while getting single day book accounts account",
      });
    }
  }
);

export const deleteDayBookAccountsListDataController = asyncHandler(
  async (req, res, next) => {
    try {
      const daybookAccount = await DayBookAccountModel.findById(req.params.id);
      if (!daybookAccount) {
        return res.status(404).json({ error: "Not found day book account" });
      }
      await daybookAccount.deleteOne();
      res.status(200).json({ message: "Day book account deleted" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error while getting day book accounts lists" });
    }
  }
);

export const updateDayBookAccountController = asyncHandler(
  async (req, res, next) => {
    const { accountName, accountType } = req.body;
    try {
      const dayBookAccount = await DayBookAccountModel.findById(req.params.id);
      dayBookAccount.accountName = accountName || dayBookAccount.accountName;
      dayBookAccount.accountType = accountType || dayBookAccount.accountType;
      await dayBookAccount.save();
      res
        .status(200)
        .json({ message: "Day Book Account updated successfully" });
    } catch (error) {
      res.status(500).json({
        error: "Error while updating the day book account" || error.message,
      });
    }
  }
);

//  Day Book Data Controller start here -------------------------------------------------

export const addDayBookDataController = asyncHandler(async (req, res, next) => {
  const {
    accountName,
    dayBookAccountId,
    dayBookDatadate,
    debit,
    credit,
    naretion,
    linkDayBookAccountData,
    companyId,
  } = req.body;

  // console.log(req.body);

  try {
    const existingDataModel = await DayBookDataModel.find({ companyId }).sort();
    if (existingDataModel.length === 0) {
      return res.status(400).json({
        error:
          "Day Book Account Balance is not sufficient for this transaction",
      });
    }

    const totalBalance = existingDataModel.reduce((acc, cur) => {
      return acc + cur.credit - cur.debit + cur.studentLateFees;
    }, 0);

    if (parseInt(totalBalance) < debit === true) {
      return res.status(404).json({
        success: false,
        message: "Total balance is less than of debit amount!",
      });
    }

    const newDayBookData = new DayBookDataModel({
      ...req.body,
      linkDayBookAccountData: linkDayBookAccountData || null,
    });
    await newDayBookData.save();
    res
      .status(201)
      .json({ success: true, message: "day book data created successfully!!" });
  } catch (error) {
    res.status(500).json({
      error: "Error: while creating the day book data " || error,
    });
  }
});

export const getDayBookDataController = asyncHandler(async (req, res, next) => {
  try {
    const dayBookData = await DayBookDataModel.find({})
      .populate(["studentInfo", "linkDayBookAccountData"])
      .sort({ dayBookDatadate: 1 });
    res.status(200).json(dayBookData);
  } catch (error) {
    res.status(500).json({
      error: "Error: while getting the day book data " || error.message,
    });
  }
});
export const getSingleDayBookDataController = asyncHandler(
  async (req, res, next) => {
    try {
      const dayBookData = await DayBookDataModel.find({
        dayBookAccountId: req.params.id,
      })
        .populate(["linkDayBookAccountData", "dayBookAccountId"])
        .sort({
          dayBookDatadate: 1,
        });
      // console.log(dayBookData);
      res.status(200).json(dayBookData);
    } catch (error) {
      res.status(500).json({
        error: "Error: while getting the day book data " || error.message,
      });
    }
  }
);

export const deleteDayBookDataByIdController = asyncHandler(
  async (req, res, next) => {
    try {
      const singleDayBookData = await DayBookDataModel.findById(req.params.id);
      await singleDayBookData.deleteOne();
      res.status(200).json({
        success: true,
        message: "Day Book Data deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Error: while deleting the day book data " || error.message,
      });
    }
  }
);
export const updateDayBookDataByIdController = asyncHandler(
  async (req, res, next) => {
    try {
      const updateDayBookData = await DayBookDataModel.findById(req.params.id);

      updateDayBookData.dayBookDatadate =
        req.body.dayBookDatadate || updateDayBookData.dayBookDatadate;
      updateDayBookData.accountName =
        req.body.accountName || updateDayBookData.accountName;
      updateDayBookData.naretion =
        req.body.naretion || updateDayBookData.naretion;
      updateDayBookData.debit = req.body.debit || updateDayBookData.debit;
      updateDayBookData.credit = req.body.credit || updateDayBookData.credit;

      await updateDayBookData.save();

      res.status(200).json({
        success: true,
        message: "Day Book Data updated successfully",
      });
      // console.log(dayBookData);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Error: while deleting the day book data " || error.message,
      });
    }
  }
);

//  Day Book Data Controller End here -------------------------------------------------
