import mongoose, {Schema, Document, ObjectId, Types} from "mongoose";

export interface IOrder extends Document {
    orderCode: string; 
    createdBy: Types.ObjectId;
    totalAmount: number;
    status: 'PENDING' | 'COMPLETED' | 'CANCELED';
    createdAt: Date;
}

const orderSchema = new Schema<IOrder>(
    {
        orderCode: {type: String, required : true},
        createdBy: {type : Schema.Types.ObjectId, ref : 'User', required : true},
        totalAmount : {type : Number, required : true, min : 0},
        status : {type: String, enum : ['PENDING', 'COMPLETED', 'CANCELED'], required: true, default: 'PENDING'}
    },
    {timestamps: true}
);

export default mongoose.model<IOrder>('Order', orderSchema)