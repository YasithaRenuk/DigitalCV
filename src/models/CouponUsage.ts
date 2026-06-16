import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICouponUsage extends Document {
  couponId: mongoose.Types.ObjectId | string;
  couponCode: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  cvId: string;
  paymentId: string;
  discountPercentage: number;
  discountAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CouponUsageSchema: Schema = new Schema(
  {
    couponId: {
      type: Schema.Types.ObjectId,
      ref: 'Coupon',
      required: true,
    },
    couponCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    userId: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
    },
    userName: {
      type: String,
    },
    cvId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CouponUsage: Model<ICouponUsage> = mongoose.models.CouponUsage || mongoose.model<ICouponUsage>('CouponUsage', CouponUsageSchema);

export default CouponUsage;
