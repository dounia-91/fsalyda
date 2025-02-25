import { FormItemDetails } from "@/types/types";
import mongoose, { Schema, Document } from "mongoose";
import { ReactElement } from "react";

export interface Form extends Document {
  title: string;
  formItemDetails: FormItemDetails[];
  formItems: ReactElement[];
  formItemsLength: number;
  createdAt: Date;
  companyName: string;
  usersWithAccess: string[];
}

export const FormSchema: Schema<Form> = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  formItemDetails: {
    type: [],
    required: true,
  },
  formItems: {
    type: [],
    required: true,
  },
  formItemsLength: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  companyName: {
    type: String,
    required: true,
  },
  usersWithAccess: {
    type: [],
    required: true,
  },
});

const FormModel =
  (mongoose.models.Forms as mongoose.Model<Form>) ||
  mongoose.model<Form>("Forms", FormSchema);

export default FormModel;
