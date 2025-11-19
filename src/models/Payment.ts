import mongoose , {Schema,Document,Model} from "mongoose";

export interface IPaymet extends Document{
    userID :string;
    CVID :string;
    amount :number;
    currency:string;
    genieTransactionId:string;
    status:string;
    rawRequest:Object;
    rawResponse:Object;
    callbackData:Object;
    createdAt: Date;
    updatedAt: Date;
}

const PaymentSchema :Schema = new Schema(
    {
        userID :{
            type :String,
            required : true
        },
        CVID:{
            type:String,
            required:true
        },
        amount : {
            type :Number,
            required : true
        },
        currency : {
            type : String,
            required : true,
            default : 'LKR'
        },
        genieTransactionId : {
            type : String
        },
        status: {
            type: String,
            required:true,
            enum: ["PENDING", "SUCCESS", "FAILED"],
            default: "PENDING",
        },
        rawRequest: { type: Object },  // data you sent to Genie
        rawResponse: { type: Object }, // data you got from Genie
    },{
        timestamps:true
    }
);

const Payment : Model<IPaymet> = (mongoose.models && mongoose.models['Payment'] as Model<IPaymet>) || mongoose.model<IPaymet>('Payment', PaymentSchema);

export default Payment;