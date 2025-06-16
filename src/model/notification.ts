import mongoose, { Schema, Document } from "mongoose";

export interface Notification extends Document {
  title: string;
  message: string;
  fromUser: string;
  toUser: string;
  isRead: boolean;
  createdAt: Date;
}
export const NotificationSchema: Schema<Notification> = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  fromUser: { type: String, required: true },
  toUser: { type: String, required: true },
  isRead: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, default: Date.now },
});

const NotificationModel =
  (mongoose.models.Notifications as mongoose.Model<Notification>) ||
  mongoose.model<Notification>("Notifications", NotificationSchema);

export default NotificationModel;
