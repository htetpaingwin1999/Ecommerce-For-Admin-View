import mongoose, { Schema, model, models } from "mongoose";

const EventSchema = new Schema({
  title: { type: String, required: true },
  image_link: { type: String, required: true },
  event_status: { type: Number, required: true}
}, {
  timestamps: true,
});

export const Event =  models?.Event || model('Event', EventSchema);