import mongoose from "mongoose";

const emailRemainderDatesSchema = new mongoose.Schema({
  firstDueDay: {
    type: Number,
    default: 9,
    // required: true,
  },
  secondDueDay: {
    type: Number,
    default: 15,
    // required: true,
  },
  thirdDueDay: {
    type: Number,
    default: 20,
    // required: true,
  },
});

const emailRemainderDatesModel = mongoose.model(
  "Remainder-Date",
  emailRemainderDatesSchema
);

export default emailRemainderDatesModel;
