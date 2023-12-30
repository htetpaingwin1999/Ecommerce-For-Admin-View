import mongoose, { Schema, model, models } from "mongoose";

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isBlock: {
    type: Number,
    required: true,
    enum: [-1, 0, 1], // -1: Block, 0: Suspend, 1: Approve
    default: 0, // Default value can be changed as needed
  },
});

export const Admin =models?.Admin || model('Admin', adminSchema);
