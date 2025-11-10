import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReport extends Document {
  fristname: string;
  lastname?: string;
  topic: string;
  email?:string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema: Schema = new Schema(
  {
    fristname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
    },
    message: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Report: Model<IReport> = mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema);

export default Report;

