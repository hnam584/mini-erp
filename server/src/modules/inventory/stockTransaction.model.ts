import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IStockTransaction extends Document {
  product: Types.ObjectId;
  type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
  createdAt: Date;
}

const stockTransactionSchema = new Schema<IStockTransaction>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    type: { type: String, enum: ['IN', 'OUT'], required: true },
    quantity: { type: Number, required: true, min: 1 },
    reason: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<IStockTransaction>('StockTransaction', stockTransactionSchema);