import asyncHandler from "../middlewares/asyncHandler.js";
import { userModel } from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import { generateToken } from "../utils/createToken.js";
import { generateOTP, getOTPExpirationTime, isOTPExpired } from "../utils/otp.utils.js";
import jwt from "jsonwebtoken";
import {
  BACKEND_URL,
  FRONTEND_URL,
  JWT_SECRET,
  USER_EMAIL,
} from "../config/config.js";
import { mailTransporter } from "../utils/mail_helpers.js";

// add user controller
export const addUsersControllers = asyncHandler(async (req, res, next) => {
  // console.log(req.headers);
  // console.log(req.body);
  try {
    const { fName, lName, email, password, phone, role } = req.body;

    switch (true) {
      case !fName:
        return res.status(401).json("Name is required!");
      case !lName:
        return res.status(401).json("Last Name is required!");
      case !email:
        return res.status(401).json("Email is required!");
      case !password:
        return res.status(401).json("Password is required!");
      case !phone:
        return res.status(401).json("Phone is required!");
      case !role:
        return res.status(401).json("User role is required");
    }

    const existedUser = await userModel.findOne({ email });
    if (existedUser) {
      return res.status(404).json({ error: "User already exists!" });
    }

    let hashPassword = await bcryptjs.hash(
      password,
      await bcryptjs.genSalt(10)
    );

    let user = new userModel({
      fName,
      lName,
      email,
      password: hashPassword,
      phone,
      role,
    });
    let token = generateToken(res, user._id);
    user.api_token = token;
    await user.save();
    // If all validations pass and user is saved, send a success response
    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    // Handle errors appropriately
    res.status(500).json({ error: error.message });
  }
});

export const registerUserController = asyncHandler(async (req, res, next) => {
  // console.log(req.headers);
  // console.log(req.body);
  try {
    let {
      email,
      first_name: fName,
      last_name: lName,
      password,
      password_confirmation,
    } = req.body;

    if (password_confirmation !== password) {
      return res.status(401).json({ error: "Passwords do not match!" });
    } else {
      password = password_confirmation;
    }

    switch (true) {
      case !fName:
        return res.status(401).json("Name is required!");
      case !lName:
        return res.status(401).json("Last Name is required!");
      case !email:
        return res.status(401).json("Email is required!");
      case !password:
        return res.status(401).json("Password is required!");
    }

    const existedUser = await userModel.findOne({ email });
    if (existedUser) {
      return res.status(404).json({ error: "User already exists!" });
    }

    let hashPassword = await bcryptjs.hash(
      password,
      await bcryptjs.genSalt(10)
    );

    let user = new userModel({
      fName,
      lName,
      email,
      password: hashPassword,
    });
    let token = generateToken(res, user._id);
    user.api_token = token;
    await user.save();
    // If all validations pass and user is saved, send a success response
    res.status(201).json(user);
  } catch (error) {
    // Handle errors appropriately
    res.status(500).json({ error: error.message });
  }
});

// login user controller - Step 1: Send OTP
export const loginUserController = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      res.status(401);
      throw new Error("Email is required !");
      return;
    }
    if (!password) {
      res.status(401);
      throw new Error("Password is required !");
      return;
    }

    // find the user
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("User not found!");
    }

    // compare password of the user
    let comparePassword = await bcryptjs.compare(password, user.password);
    if (!comparePassword) {
      res.status(404);
      throw new Error("Wrong credentials");
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiresAt = getOTPExpirationTime();

    // Save OTP to user document
    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    user.isOtpVerified = false;
    await user.save();

    // Send OTP via email
    const mailOptions = {
      from: USER_EMAIL,
      to: user.email,
      subject: "Your OTP for Login",
      html: `
        <h2>Welcome to Reliance Education</h2>
        <p>Your OTP for login is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 5 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    await mailTransporter.sendMail(mailOptions);

    // Return success response with user email (but no token yet)
    res.status(200).json({
      success: true,
      message: "OTP sent to your email",
      _id: user._id,
      email: user.email,
      first_name: user.fName,
      last_name: user.lName,
      requiresOTP: true,
    });
  } catch (error) {
    res.status(401);
    throw new Error(error);
  }
});

// Step 2: Verify OTP and complete login
export const verifyOTPAndLoginController = asyncHandler(async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    
    if (!email) {
      res.status(401);
      throw new Error("Email is required!");
    }
    if (!otp) {
      res.status(401);
      throw new Error("OTP is required!");
    }

    // Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("User not found!");
    }

    // Check if OTP is expired
    if (!user.otpExpiresAt || isOTPExpired(user.otpExpiresAt)) {
      res.status(401);
      throw new Error("OTP has expired. Please login again.");
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      res.status(401);
      throw new Error("Invalid OTP!");
    }

    // OTP verified successfully
    user.isOtpVerified = true;
    user.otp = null; // Clear OTP
    user.otpExpiresAt = null; // Clear expiration time
    
    // Generate token for successful login
    const token = generateToken(res, user._id);
    user.api_token = token;
    await user.save();

    // Token expires in 1 hour (3600000 milliseconds)
    const expiresAt = Date.now() + (60 * 60 * 1000);

    // Return user with token
    res.status(200).json({
      success: true,
      message: "Login successful!",
      _id: user._id,
      first_name: user.fName,
      role: user.role,
      email: user.email,
      api_token: token,
      expiresAt: expiresAt,
      last_name: user.lName,
      email_verified_at: user.createdAt,
      updated_at: user.updatedAt,
    });
  } catch (error) {
    res.status(401);
    throw new Error(error);
  }
});

// Resend OTP controller
export const resendOTPController = asyncHandler(async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      res.status(401);
      throw new Error("Email is required!");
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("User not found!");
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiresAt = getOTPExpirationTime();

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    // Send OTP via email
    const mailOptions = {
      from: USER_EMAIL,
      to: user.email,
      subject: "Your OTP for Login (Resend)",
      html: `
        <h2>Welcome to Reliance Education</h2>
        <p>Your new OTP for login is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 5 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    await mailTransporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "OTP resent to your email",
    });
  } catch (error) {
    res.status(401);
    throw new Error(error);
  }
});

// get user by token
export const getUserByTokn = asyncHandler(async (req, res, next) => {
  try {
    const { api_token } = req.body;
    if (!api_token) {
      res.status(404);
      throw new Error("Please provide token");
    }
    const { userId } = jwt.verify(api_token, JWT_SECRET);
    // now find the user
    const user = await userModel.findById(userId).select("-password");
    res.status(200).send({
      id: user._id,
      first_name: user.fName,
      last_name: user.lName,
      email: user.email,
      email_verified_at: user.createdAt,
      created_at: user.createdAt,
      updated_at: user.createdAt,
      role: user.role,
      studentId: user.studentId || null,
      api_token: user.api_token,
    });
  } catch (error) {
    res.status(404);
    throw new Error(error);
    return;
  }
});

export const requsetUserPasswordController = asyncHandler(
  async (req, res, next) => {
    try {
      const { email } = req.body;
      // console.log(email);
      if (!email) {
        res.status(404);
        throw new Error("User not found..");
      }
      let user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).send({ message: "User not found.." });
      }
      // console.log("running");
      let token = jwt.sign({ id: user?._id }, JWT_SECRET, {
        expiresIn: "30d",
      });
      sendEmail(
        user.email,
        "Reset Password",
        `${BACKEND_URL}/reset-password/${user?._id}/${token}`
      );
      res.status(200).json({ success: true });
      // console.log(user);
      // const sendPassword = await bcr;
      // if (user) {
      //   return res.status(200).send(true);
      // }
      // res.status(404).send(false);
    } catch (error) {
      res.status(404);
      console.log(error);
    }
  }
);

export const resetPasswordController = asyncHandler(async (req, res, next) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;
    const verifiedPassword = jwt.verify(token, JWT_SECRET);
    if (!verifiedPassword) {
      return res.status(404).send({ message: "Invalid token" });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = await userModel.findByIdAndUpdate(id, {
      password: hashedPassword,
    });
    if (!user) {
      return res.status(404).send({ message: "User not found.." });
    }
    res.status(200).json({
      success: true,
      message: "Your Password Has been Updated SuccessFully!!",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server errror !!" });
  }
});

async function sendEmail(toEmails, subject, text, html, req) {
  const mailOptions = {
    from: USER_EMAIL,
    to: toEmails,
    subject: subject,
    text: text,
    html,
  };
  // const currentDateTime = moment().format("YYYY-MM-DD HH:mm:ss");

  try {
    const result = await mailTransporter.sendMail(mailOptions);
    console.log("Email sent successfully", result);
  } catch (error) {
    console.log("Email send failed with error:", error);
  }
}

export const getAllUsersController = asyncHandler(async (req, res, next) => {
  try {
    // Extract page and items_per_page from the query parameters
    const { page = 1, items_per_page = 10, search } = req.query;

    // Convert page and items_per_page to numbers
    const skip = (parseInt(page) - 1) * parseInt(items_per_page);
    const limit = parseInt(items_per_page);

    // Build the search query
    const searchQuery = {
      ...(search
        ? {
            $or: [
              { fName: new RegExp(search, "i") },
              { lName: new RegExp(search, "i") },
              { email: new RegExp(search, "i") },
              // Add more fields as needed
            ],
          }
        : {}),
      role: { $ne: "student" }, // Exclude users with the role "student"
    };

    // Use the skip and limit values in your MongoDB query to implement pagination
    let users = await userModel.find(searchQuery).skip(skip).limit(limit);

    users = users.map((user) => {
      return {
        id: user._id,
        fName: user?.fName,
        lName: user?.lName,
        email: user?.email,
        role: user?.role,
        phone: user?.phone,
      };
    });

    // Get the total count of users matching the search query
    const totalUsersCount = await userModel.countDocuments(searchQuery);

    // Construct pagination links
    const lastPage = Math.ceil(totalUsersCount / limit);
    const links = [
      {
        url: page > 1 ? `/?page=${page - 1}` : null,
        label: "&laquo; Previous",
        active: page > 1,
        page: page > 1 ? page - 1 : null,
      },
      ...Array.from({ length: lastPage }, (_, i) => ({
        url: `/?page=${i + 1}`,
        label: (i + 1).toString(),
        active: i + 1 === parseInt(page),
        page: i + 1,
      })),
      {
        url: page < lastPage ? `/?page=${parseInt(page) + 1}` : null,
        label: "Next &raquo;",
        active: page < lastPage,
        page: page < lastPage ? parseInt(page) + 1 : null,
      },
    ];

    // Respond with the array of users and pagination details
    res.status(200).json({
      data: users,
      payload: {
        pagination: {
          page: parseInt(page),
          first_page_url: "/?page=1",
          from: skip + 1,
          last_page: lastPage,
          links: links,
          next_page_url:
            page < lastPage ? `/?page=${parseInt(page) + 1}` : null,
          items_per_page: limit,
          prev_page_url: page > 1 ? `/?page=${page - 1}` : null,
          to: skip + users.length,
          total: totalUsersCount,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const editUserController = asyncHandler(async (req, res, next) => {
  const { fName, lName, email, role, password, phone } = req.body;
  try {
    let user = await userModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if the user performing the update is either SuperAdmin or the same user
    const isSuperAdmin = req.user.role === "SuperAdmin";
    const isSelf = req.user._id.toString() === req.params.id;
    const isAdminEditingSelf = isSelf && req.user.role === "Admin";
    // Check if the user performing the update is either SuperAdmin or the same user
    if (req.user.role === "SuperAdmin") {
      // SuperAdmin can update anyone, Admin can update non-SuperAdmin users
      if (req.user.role !== "SuperAdmin") {
        return res
          .status(400)
          .json({ error: "Cannot update SuperAdmin user." });
      }

      let hashPassword = password
        ? await bcryptjs.hash(password, 10)
        : user.password;
      user.fName = fName || user.fName;
      user.lName = lName || user.lName;
      user.email = email || user.email;
      user.role = role || user.role;
      user.phone = phone || user.phone;
      user.password = hashPassword;

      const token = generateToken(res, user._id);
      let updateUser = await user.save();

      return res.status(200).json({
        _id: updateUser._id,
        first_name: updateUser.fName,
        role: updateUser.role,
        email: updateUser.email,
        api_token: token,
        last_name: updateUser.lName,
        email_verified_at: updateUser.createdAt,
        updated_at: updateUser.updatedAt,
      });
    } else {
      return res.status(403).json({
        error: "Forbidden: You don't have permission to perform this action.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export const deleteUserController = asyncHandler(async (req, res, next) => {
  try {
    // console.log(req.params.id);
    // console.log(req.user._id.toString());
    // console.log(userId === req.user._id);
    let userId = req.params.id;
    if (userId === req.user._id.toString()) {
      res.json({ message: "You can not delete current user" });
      return;
    }
    let user = await userModel.findById(userId);
    if (user.role === "SuperAdmin") {
      res.status(404).json({
        message: "You can delete Super Admin",
      });
      return;
    }
    await userModel.findByIdAndDelete(userId);
    res.status(200).json({
      data: {
        message: "User deleted successfully",
      },
    });
  } catch (error) {
    res.status(404);
    throw new Error(error);
  }
});

// get user by id controller
export const getUserByIdController = asyncHandler(async (req, res, next) => {
  //console.log(req.params.id);
  try {
    let user = await userModel.findById(req.params.id);
    if (!user) {
      res.status(401);
      throw new Error("User not found!");
      return;
    }
    // "id": 1,
    // "name": "Emma Smith",
    // "avatar": "avatars/300-6.jpg",
    // "email": "smith@kpmg.com",
    // "position": "Art Director",
    // "role": "Administrator",
    // "last_login": "Yesterday",
    // "two_steps": false,
    // "joined_day": "10 Nov 2022, 9:23 pm",
    // "online": false

    // console.log(user);

    user.password = undefined;

    res.status(200).json({
      data: {
        id: user._id,
        fName: user.fName,
        lName: user.lName,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
