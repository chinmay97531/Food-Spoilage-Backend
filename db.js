import mongoose, { model, Schema } from "mongoose";
import { MONGODBURL } from "./config.js";

mongoose.connect(MONGODBURL);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const OtpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

const UserModel = model("User", userSchema);
const OtpModel = model("Otp", OtpSchema);

export { UserModel, OtpModel };