import mongoose from 'mongoose';
import Order from './order.model';
import OrderItem from './orderItem.model';
import Product from '../inventory/product.model';
import StockTransaction from '../inventory/stockTransaction.model';

interface OrderItemInput {
  productId: string;
  quantity: number;
}

export const createOrderService = async (items: OrderItemInput[], createdBy: string) => {
  // Validate đầu vào trước khi mở transaction — tránh mở session cho request rác
  if (!items || items.length === 0) {
    throw new Error('EMPTY_ORDER');
  }
  if (!createdBy) {
    throw new Error('MISSING_CREATED_BY');
  }
  for (const item of items) {
    if (item.quantity <= 0) {
      throw new Error('INVALID_QUANTITY');
    }
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) throw new Error('PRODUCT_NOT_FOUND');
      if (product.stock < item.quantity) throw new Error('INSUFFICIENT_STOCK');

      const subtotal = product.sellPrice * item.quantity;
      totalAmount += subtotal;

      orderItemsData.push({
        product: product._id,
        quantity: item.quantity,
        priceAtSale: product.sellPrice,
        subtotal,
      });

      product.stock -= item.quantity;
      await product.save({ session });

      await StockTransaction.create(
        [{ product: product._id, type: 'OUT', quantity: item.quantity, reason: 'Bán hàng' }],
        { session }
      );
    }

    const orderCode = `DH${Date.now()}`;
    const orderResult = await Order.create(
        [{ orderCode, createdBy, totalAmount, status: 'COMPLETED' }],
        { session }
    );
    const order = orderResult[0];

    const itemsWithOrderId = orderItemsData.map((item) => ({ ...item, order: order._id }));
    await OrderItem.insertMany(itemsWithOrderId, { session });

    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

// Lấy danh sách đơn hàng, kèm thông tin sản phẩm trong từng đơn
export const getAllOrdersService = async () => {
  const orders = await Order.find().sort({ createdAt: -1 });
  return orders;
};

// Lấy chi tiết 1 đơn hàng, kèm danh sách OrderItem + populate thông tin Product
export const getOrderDetailService = async (orderId: string) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error('ORDER_NOT_FOUND');

  const items = await OrderItem.find({ order: orderId }).populate('product');
  return { order, items };
};