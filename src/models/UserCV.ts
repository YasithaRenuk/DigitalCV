import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserCV extends Document {
  username: string;
  password: string;
  cv: string | null;
  states: 'pending' | 'active' | 'deactive';
  start_date: Date;
  end_date: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserCVSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    cv: {
      type: String,
      default: null,
    },
    states: {
      type: String,
      enum: ['pending', 'active', 'deactive'],
      default: 'pending',
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserCV: Model<IUserCV> = mongoose.models.UserCV || mongoose.model<IUserCV>('UserCV', UserCVSchema);

export default UserCV;

