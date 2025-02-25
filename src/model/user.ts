import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  name: string;
  companyName: string;
  email: string;
  password: string;
  role: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
}

// Updated User schema
const UserSchema: Schema<User> = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  companyName: {
    type: String,
    required: [true, "Company Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  role: {
    type: String,
    default: "user",
    required: [true, "User Role is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "Verify Code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify Code Expiry is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
    required: [true, "User Verification Status is required"],
  },
});

const UserModel =
  (mongoose.models.Users as mongoose.Model<User>) ||
  mongoose.model<User>("Users", UserSchema);

export default UserModel;
