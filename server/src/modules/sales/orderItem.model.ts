import mongoose, {Schema, Document, Types} from "mongoose";

export interface IOrderItem extends Document {
    order : Types.ObjectId;
    product : Types.ObjectId;
    quantity : number;
    priceAtSale : number;
    subtotal: number;
}

const orderItemSchema = new Schema<IOrderItem>(
    {
        order: {type: Schema.Types.ObjectId, ref : 'Order', required: true},
        product: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
        quantity : {type : Number, required: true, min: 1},
        priceAtSale : {type: Number, required: true, min: 0},
        subtotal: {type: Number, required: true, min : 0}
    }
);

export default mongoose.model<IOrderItem>('OrderItem', orderItemSchema)