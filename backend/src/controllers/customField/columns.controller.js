import Column from "../../models/customForm/columns.models.js";

export const saveReorderedColumns = async (req, res, next) => {
  const { companyId, formId, reorderedColumns } = req.body;

  try {
    if (!companyId || !formId || !reorderedColumns) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required parameters" });
    }

    // Create an array of column objects with names and order
    const columns = reorderedColumns.map((name, index) => ({
      name,
      order: index + 1, // Order starts from 1
    }));

    // Determine the user's role
    const userRole = req.user.role;

    // Find the existing column document for the specific company, form, and role
    let columnData = await Column.findOne({
      companyId,
      formId,
      role: userRole,
    });

    if (columnData) {
      // Check if the new reordered columns are different from the existing ones
      const existingColumnNames = columnData.columns.map((col) => col.name);
      const newColumnNames = columns.map((col) => col.name);

      const hasChanges =
        JSON.stringify(existingColumnNames) !==
          JSON.stringify(newColumnNames) ||
        JSON.stringify(columnData.columns) !== JSON.stringify(columns);

      if (!hasChanges) {
        return res.status(200).json({
          success: true,
          message: "No changes made; columns for this role remain the same.",
          data: columnData,
        });
      }

      // Update the columns if there are changes
      columnData.columns = columns;

      // Save updated column data
      await columnData.save();

      return res.status(200).json({
        success: true,
        message: "Columns updated successfully!",
        data: columnData,
      });
    }

    // If the role is new, create a new column entry
    const newColumnData = new Column({
      companyId,
      formId,
      columns,
      role: userRole,
    });

    // Save the new column data
    await newColumnData.save();

    res.status(201).json({
      success: true,
      message: "New columns saved successfully!",
      data: newColumnData,
    });
  } catch (error) {
    console.error("Error saving columns:", error);
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
};

export const getColumns = async (req, res, next) => {
  // console.log(req.body);
  try {
    const columnData = await Column.find({});

    if (!columnData) {
      return res
        .status(404)
        .json({ success: false, message: "Columns not found" });
    }

    res.status(200).json({ success: true, columnData });
  } catch (error) {
    // console.error("Error fetching columns:", error); // Log the full error
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
};

export const deleteColumnsController = async (req, res, next) => {
  // console.log(req.params);
  try {
    const { id } = req.params;
    const columnData = await Column.findByIdAndDelete(id);
    if (!columnData) {
      return res
        .status(404)
        .json({ success: false, message: "Column not found !!" });
    }
    res
      .status(200)
      .json({ success: true, message: "Column deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
