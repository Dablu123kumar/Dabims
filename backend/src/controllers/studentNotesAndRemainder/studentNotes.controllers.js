import studentNotesModel from "../../models/studentsNotesAndRemainder/studentNotes.models.js";

export const addStudentNotesController = async (req, res, next) => {
  try {
    // console.log(req);
    const { particulars, startTime, endTime, userId, companyId } = req.body;
    if (!particulars) {
      return res
        .status(400)
        .json({ success: false, message: "Particulars are required" });
    }
    const studentNotes = new studentNotesModel({
      particulars,
      startTime,
      // endTime,
      userId,
      companyId,
      addedBy: ` ${req.user.fName} ${req.user.lName}`,
    });
    await studentNotes.save();
    res
      .status(200)
      .json({ success: true, message: "Student notes added successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error !!" });
  }
};

export const getAllStudentNotesController = async (req, res, next) => {
  try {
    const allStudentNotes = await studentNotesModel.find({});
    res.status(200).json({ success: true, allStudentNotes });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error !!" });
  }
};

export const getSingleStudentNoteByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const singleStudentNote = await studentNotesModel.findById(id);
    if (!singleStudentNote) {
      return res
        .status(404)
        .json({ success: false, message: "Student note not found" });
    }
    res.status(200).json({ success: true, singleStudentNote });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error !!" });
  }
};

export const updateSingleStudentNoteByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedStudentNote = await studentNotesModel.findByIdAndUpdate(
      id,
      {
        ...req.body,
        addedBy: `${req.user.fName} ${req.user.lName}`, // Add addedBy directly in the update data
      },
      { new: true }
    );

    if (!updatedStudentNote) {
      return res
        .status(404)
        .json({ success: false, message: "Student note not found" });
    }

    res.status(200).json({ success: true, updatedStudentNote });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error !!" });
  }
};

export const deleteSingleStudentNoteByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedStudentNote = await studentNotesModel.findByIdAndDelete(id);
    if (!deletedStudentNote) {
      return res
        .status(404)
        .json({ success: false, message: "Student note not found" });
    }
    res.status(200).json({ success: true, deletedStudentNote });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error !!" });
  }
};
