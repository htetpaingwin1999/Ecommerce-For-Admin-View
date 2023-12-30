import mongoose, { model, models, Schema } from "mongoose";

const clientSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email address"],
  },
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    minLength: [4, "Full name should be at least 4 characters long"],
    maxLength: [30, "Full name should be less than 30 characters"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  otp: {
    type: String,
    required: true,
  },
  OtpVerifiedAt: {
    type: Date,
  },
  otpExpiresAt: {
    type: Date,
    required: true,
  },
  remember_token: {
    type: String,
  },
});

export const Client = models?.Client || mongoose.model("Client", clientSchema);
