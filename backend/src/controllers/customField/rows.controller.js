import Row from "../../models/customForm/rows.models.js";

export const saveReorderedRows = async (req, res, next) => {
  const { companyId, formId, reorderedRows } = req.body;

  try {
    if (!companyId || !formId || !reorderedRows) {
      console.error("Missing required parameters");
      return res
        .status(400)
        .json({ success: false, message: "Missing required parameters" });
    }

    // Determine the user's role
    const userRole = req.user.role;

    // Find the existing row data for the specific company, form, and role
    let rowData = await Row.findOne({ companyId, formId, role: userRole });

    if (rowData) {
      // Check if the new reordered rows are different from the existing ones
      const existingRowIds = rowData.rows.map((row) => row.id);
      const newRowIds = reorderedRows.map((row) => row.id);

      const hasChanges =
        JSON.stringify(existingRowIds) !== JSON.stringify(newRowIds) ||
        JSON.stringify(rowData.rows) !== JSON.stringify(reorderedRows);

      if (!hasChanges) {
        return res.status(200).json({
          success: true,
          message: "No changes made; rows for this role remain the same.",
          data: rowData,
        });
      }

      // Update the rows if there are changes
      rowData.rows = reorderedRows;

      // Save updated row data
      await rowData.save();

      return res.status(200).json({
        success: true,
        message: "Rows updated successfully!",
        data: rowData,
      });
    }

    // If the role is new, create a new row entry
    const newRowData = new Row({
      companyId,
      formId,
      rows: reorderedRows,
      role: userRole,
    });

    // Save the new row data
    await newRowData.save();

    res.status(201).json({
      success: true,
      message: "New rows saved successfully!",
      data: newRowData,
    });
  } catch (error) {
    console.error("Error saving rows:", error);
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
};

export const getRows = async (req, res, next) => {
  try {
    const rowData = await Row.find({});

    if (!rowData) {
      return res
        .status(404)
        .json({ success: false, message: "Rows not found" });
    }

    res.status(200).json({ success: true, rowData });
  } catch (error) {
    console.error("Error fetching rows:", error); // Log the full error
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
};

export const deleteRow = async (req, res, next) => {
  try {
    const id = req.params.id;
    // console.log(id);
    const rowData = await Row.findByIdAndDelete(id);
    // console.log(rowData);
    if (!rowData) {
      return res
        .status(404)
        .json({ success: false, message: "Row Data not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "RowData Has Been Deleted !!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
