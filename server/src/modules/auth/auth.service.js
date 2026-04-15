import crypto from "crypto";
import bcrypt from "bcrypt";
import ApiError from "../../common/utils/api-errors.js";
import {
  generateResetToken,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../common/utils/jwt.utils.js";
// import User from '../auth/auth.model.js'
import { pool } from "../../common/config/db.js";
import { sendEmail } from "../../common/config/email.js";

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const register = async ({ name, email, password, role = 'customer' }) => {
  const saltRounds = 10;
  // check if user exists
  const existing = await pool.query(
    "SELECT * FROM myapp.users WHERE email = $1",
    [email],
  );

  if (existing.rows.length > 0) {
    throw ApiError.conflict("Email Already Exists");
  }

  // generate token
  const { rawToken, hashToken: hashedToken } = generateResetToken();

  const encpassword = await bcrypt.hash(password, saltRounds);
  // insert user
  const result = await pool.query(
    `INSERT INTO myapp.users
        (name, email, password, role, verification_token, refresh_token)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
    [name, email, encpassword, role, hashedToken, null],
  );

  const user = result.rows[0];

  // send email
  try {
    await sendEmail({
      to: email,
      subject: "Verify your Email",
      text: `Welcome ${name}! Please verify using token: ${rawToken}`,
      html: `<h1>Email Verification</h1>
                   <p>Welcome ${name}!</p>
                   <p>Token: <strong>${rawToken}</strong></p>`,
    });
  } catch (error) {
    console.error("Verification Email Failed:", error);
  }

  // remove sensitive fields
  delete user.password;
  delete user.verification_token;

  return user;
};

const login = async ({ email, password }) => {
  // 1. find user by email
  const result = await pool.query(
    "SELECT * FROM myapp.users WHERE email = $1",
    [email],
  );

  if (result.rows.length === 0) {
    throw ApiError.unauthorized("User not found");
  }

  const user = result.rows[0];

  // 2. compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw ApiError.unauthorized("Invalid Email or Password");
  }

  const accessToken = generateAccessToken({ id: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id });
  const hashedRefreshToken = hashToken(refreshToken);

  await pool.query(
    "UPDATE myapp.users SET refresh_token = $1 WHERE id = $2",
    [hashedRefreshToken, user.id],
  );

  delete user.password;

  return { user, accessToken, refreshToken };
};

// const refresh = async (token) => {
//   if (!token) {
//     throw ApiError.unauthorized("Unauthorized User");
//   }

//   const decoded = verifyRefreshToken(token);
//   const user = await User.findById(decoded.id).select("+refreshToken");
//   if (user.refreshToken !== hashToken(token)) {
//     throw ApiError.unauthorized("Invalid Refresh Token");
//   }

//   const accessToken = generateAccessToken({ id: user._id, role: user.role });
//   const refreshToken = generateRefreshToken({ id: user._id });

//   user.refreshToken = hashToken(refreshToken);
//   await user.save({ validateBeforeSave: false });

//   const userObj = user.toObject();
//   delete userObj.password;
//   delete userObj.refreshToken;

//   return { accessToken, refreshToken };
// };

// const logout = async (userId) => {
//   await User.findByIdAndUpdate(userId, {
//     refreshToken: null,
//   });
// };

// const forgotPassword = async (email) => {
//   const user = await User.findOne({ email });
//   if (!user) {
//     throw ApiError.notfound("No account with that email.");
//   }
//   const { rawToken, hashToken: resetHashToken } = generateResetToken();
//   user.resetPasswordToken = resetHashToken;
//   user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

//   await user.save();
//   // Send forgot password email
//   try {
//     await sendEmail({
//       to: email,
//       subject: "Reset your Password",
//       text: `You requested a password reset. Please use this token to reset your password: ${rawToken}`,
//       html: `<h1>Password Reset</h1><p>You requested a password reset.</p><p>Please use this token to reset your password: <strong>${rawToken}</strong></p>`,
//     });
//   } catch (error) {
//     console.error("Mail Sending Failed", error);
//   }
// };

// const resetPassword = async (rawtoken, newPassword) => {
//   const hashrawToken = hashToken(rawtoken);
//   const user = await User.findOne({ resetPasswordToken: hashrawToken }).select(
//     "+password",
//   );
//   if (!user) {
//     throw ApiError.notfound("Invalid token");
//   }
//   user.password = newPassword;
//   await user.save({ validateBeforeSave: false });
// };

// const getMe = async (userId) => {
//   const user = await User.findById(userId);
//   if (!user) throw ApiError.notfound("User not Found");
//   return user;
// };

// const verifyUser = async (token) => {
//   console.log(token);
//   const hashedToken = hashToken(token);
//   const user = await User.findOne({ verificationToken: hashedToken }).select(
//     "+verificationToken",
//   );
//   if (!user) throw ApiError.notfound("User not found");
//   user.isVerified = true;
//   user.verificationToken = undefined;
//   await user.save();
//   return user;
// };

// const greetHello = async () => {
//   return "hello";
// };

export {
  register,
  login,
  // logout,
  // refresh,
  // forgotPassword,
  // resetPassword,
  // getMe,
  // verifyUser,
  // greetHello,
};
