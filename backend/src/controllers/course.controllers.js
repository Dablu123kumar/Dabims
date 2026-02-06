import asyncHandler from "../middlewares/asyncHandler.js";
import categoryModel from "../models/course/category.model.js";
import CourseTypeModel from "../models/course/courseType.models.js";
import CourseModel from "../models/course/courses.models.js";
import NumberOfYearsModel from "../models/course/numberOfYears.models.js";
import SubjectModel from "../models/subject/subject.models.js";

//----------------------------- Course Controller -----------------------------
export const createCourseController = asyncHandler(async (req, res, next) => {
  try {
    const { courseName, courseType, numberOfYears, category, courseFees } =
      req.body;
    const existedCourseName = await CourseModel.findOne({
      courseName: courseName,
    });

    if (existedCourseName) {
      return res.status(400).json("Course Name already exists");
    }

    let newCourse = new CourseModel({
      courseName,
      createdBy: req.user.fName + " " + req.user.lName,
      user: req.user._id,
      courseType,
      numberOfYears,
      category,
      courseFees,
    });
    await newCourse.save();
    res.status(200).json(newCourse);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export const getAllCourseController = asyncHandler(async (req, res, next) => {
  try {
    const courses = await CourseModel.find({})
      .populate(["category", "numberOfYears", "courseType", "user"])
      .sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export const updateCourseController = asyncHandler(async (req, res) => {
  try {
    const { courseName, courseType, numberOfYears, category, courseFees } =
      req.body;

    // Find the course by ID
    let findCourse = await CourseModel.findOne({ _id: req.params.id });

    // If the course is not found, return a 404 error
    if (!findCourse) {
      return res.status(404).json("Course not found");
    }

    // Update the course details with the provided values or keep the current values if not provided
    findCourse.courseName = courseName || findCourse.courseName;
    findCourse.courseType = courseType || findCourse.courseType;
    findCourse.courseFees = courseFees || findCourse.courseFees;
    findCourse.numberOfYears = numberOfYears || findCourse.numberOfYears;
    findCourse.category = category || findCourse.category;
    findCourse.user = req.user._id || findCourse.user;
    findCourse.createdBy =
      req.user.fName + " " + req.user.lName || findCourse.createdBy;

    // Save the updated course
    await findCourse.save();

    // Find subjects associated with the course
    let courseSubjects = await SubjectModel.find({ course: req.params.id });

    // Find the course type details
    let courseSubjectsTypes = await CourseTypeModel.findById(courseType);

    // Update the semYear for each subject associated with the course
    await Promise.all(
      courseSubjects.map(async (courseSubject) => {
        if (courseSubject.semYear) {
          courseSubject.semYear = courseSubject.semYear.replace(
            courseSubject.semYear.split(" ")[0],
            courseSubjectsTypes.courseType === "Annual"
              ? "Year"
              : courseSubjectsTypes.courseType
          );
        }
        await courseSubject.save();
      })
    );

    // Return a success response
    res.status(200).json("Updated Course Successfully");
  } catch (error) {
    // Return a 500 error with the error message
    res.status(500).json({ error: error.message });
  }
});
export const getSingleCourseController = asyncHandler(
  async (req, res, next) => {
    try {
      console.log("from course name", req.params.id);
      let findCourse = await CourseModel.findOne({ _id: req.params.id });
      console.log(findCourse);
      if (!findCourse) {
        return res.status(404).json("Course not found");
      }
      res.status(200).json(findCourse);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);

export const deleteCourseController = asyncHandler(async (req, res, next) => {
  try {
    let findCourse = await CourseModel.findOne({ _id: req.params.id });
    if (!findCourse) {
      return res.status(404).json("Course not found");
    }

    const courseSubjects = await SubjectModel.find({ course: req.params.id });
    // console.log(courseSubjects);
    courseSubjects?.map(
      async (courseSubject) => await courseSubject.deleteOne()
    );

    await findCourse.deleteOne();
    res.status(200).json("Course deleted Successfully");
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// ---------------------------Course Category Controller -------------------------
export const createCourseCategoryController = asyncHandler(
  async (req, res, next) => {
    try {
      const { category } = req.body;
      const existedCategory = await categoryModel.findOne({
        category: category,
      });
      //console.log(req.user);
      if (existedCategory) {
        return res
          .status(400)
          .json({ error: "Course Category already exists" });
      }
      let newCategory = new categoryModel({
        category,
        user: req.user._id,
        createdBy: req.user.fName + " " + req.user.lName,
      });
      await newCategory.save();
      res.status(200).json(newCategory);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);

export const getAllCourseCategoryController = asyncHandler(
  async (req, res, next) => {
    try {
      const allCategories = await categoryModel.find({});
      res.status(200).json(allCategories);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);

export const getSingleCourseCategoryController = asyncHandler(
  async (req, res, next) => {
    try {
      const singleCategory = await categoryModel.findOne({
        _id: req.params.id,
      });
      res.status(200).json(singleCategory);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);

export const deleteSingleCourseCategoryController = asyncHandler(
  async (req, res, next) => {
    try {
      const singleCategory = await categoryModel.findOne({
        _id: req.params.id,
      });

      if (!singleCategory) {
        return res.status(404).json("Category not found");
      }

      const deletionResult = await singleCategory.deleteOne();

      if (deletionResult.deletedCount > 0) {
        res.status(200).json("Deleted Single category successfully");
      } else {
        res.status(200).json("This category has already been deleted");
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

export const updateCourseCategoryController = asyncHandler(
  async (req, res, next) => {
    try {
      const { category } = req.body;
      const categoryFound = await categoryModel.findOne({
        _id: req.params.id,
      });

      if (!categoryFound) {
        return res.status(404).json("Category not found");
      }

      categoryFound.category = category || categoryFound.category;
      categoryFound.user = req.user._id || categoryFound.user;
      categoryFound.createdBy =
        req.user.fName + " " + req.user.lName || categoryFound.createdBy;

      let updatedCategory = await categoryFound.save();
      res.status(200).json(updatedCategory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// ============================= Course Type Controllers =======================================
export const createCourseTypeController = asyncHandler(
  async (req, res, next) => {
    try {
      const { courseType } = req.body;
      const existedCourseType = await CourseTypeModel.findOne({
        courseType: courseType,
      });

      if (existedCourseType) {
        res.status(400).json({ error: "CourseType already exists" });
        return;
      }

      let newCourseType = new CourseTypeModel({
        courseType,
        user: req.user._id,
        createdBy: req.user.fName + " " + req.user.lName,
      });

      await newCourseType.save();
      res.status(200).json(newCourseType);
    } catch (error) {
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  }
);

export const getAllCourseTypeController = asyncHandler(
  async (req, res, next) => {
    try {
      let courseType = await CourseTypeModel.find()
        .sort({ createdAt: -1 })
        .exec();
      res.status(200).json(courseType);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);

export const getCourseTypeController = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    let courseType = await CourseTypeModel.findById(id);

    res.status(200).json(courseType);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export const updateCourseTypeController = asyncHandler(
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { courseType } = req.body;
      let olCourseType = await CourseTypeModel.findById(id);
      olCourseType.courseType = courseType || olCourseType.courseType;
      olCourseType.user = req.user._id || olCourseType.user;
      olCourseType.createdBy =
        req.user.fName + " " + req.user.lName || olCourseType.createdBy;
      await olCourseType.save();
      res.status(200).json(olCourseType); // Corrected to olCourseType
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);
export const deleteCourseTypeController = asyncHandler(
  async (req, res, next) => {
    try {
      const { id } = req.params;
      //console.log(id);
      let deletedCourseType = await CourseTypeModel.findByIdAndDelete(id);
      res.status(200).json(deletedCourseType);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);

// ============================= Course Number of Years  Controllers =======================================
export const createCourseNumberOfYearController = asyncHandler(
  async (req, res, next) => {
    try {
      const { numberOfYears } = req.body;
      let existedNumberOfYears = await NumberOfYearsModel.findOne({
        numberOfYears,
      });
      if (existedNumberOfYears) {
        return res
          .status(400)
          .json({ error: "already exists number of years type" });
      }
      let newCourseNumberOfYears = new NumberOfYearsModel({
        numberOfYears,
        user: req.user._id,
        createdBy: req.user.fName + " " + req.user.lName,
      });
      await newCourseNumberOfYears.save();
      res.status(200).json(newCourseNumberOfYears);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);
export const getNumberOfYearsController = asyncHandler(
  async (req, res, next) => {
    try {
      let result = await NumberOfYearsModel.find({});
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);
export const getSingleNumberOfYearsController = asyncHandler(
  async (req, res, next) => {
    try {
      let result = await NumberOfYearsModel.findById(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);
export const deleteNumberOfYearsCourseController = asyncHandler(
  async (req, res, next) => {
    try {
      let result = await NumberOfYearsModel.findByIdAndDelete(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);

export const updateNumberOfYearsCourseController = asyncHandler(
  async (req, res, next) => {
    try {
      const { numberOfYears } = req.body;
      //console.log(req.params.id);
      let result = await NumberOfYearsModel.findById(req.params.id);

      if (!result) {
        return res.status(404).json({ error: "Course not found" });
      }

      result.numberOfYears = numberOfYears || result.numberOfYears;
      result.user = req.user._id || result.user;
      result.createdBy =
        req.user.fName + " " + req.user.lName || result.createdBy;

      try {
        let updated = await result.save();
        res.status(200).json(updated);
      } catch (saveError) {
        if (saveError.code === 11000) {
          // Handle duplicate key error
          return res
            .status(400)
            .json({ error: "Duplicate numberOfYears value" });
        }
        throw saveError; // Throw other save errors
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
