import {Request, Response} from 'express';
import {
    createOrderService,
    getAllOrdersService,
    getOrderDetailService
} from './order.service'

export const createOrder = async (req: Request, res : Response) => {
    try {
        const {items, createdBy} = req.body;
        const order = await createOrderService(items, createdBy);
        res.json(order);
    }
    catch (err : any) {
        const clientErrors = ['EMPTY ORDER', 'MISSING CREATED BY', 'INVALID QUANTITY', 'INSUFFICIENT STOCK'];
        if (clientErrors.includes(err.message)) return res.status(400).json({message : 'Lỗi dữ liệu đầu vào'});
        if (err.message === 'PRODUCT NOT FOUND') return res.status(404).json({message : 'Không tìm thấy'});
        res.status(500).json({message : 'Lỗi tạo đơn hàng'});
    }
}

export const getOrders = async (req: Request, res : Response) => {
    try {
        const orders = await getAllOrdersService();
        res.json(orders);
    }
    catch (err) {
        res.status(500).json({message : 'Lỗi khi lấy danh sách đơn hàng'});
    }
}

export const getOrderDetail = async (req : Request, res: Response) => {
    try {
        const order = await getOrderDetailService(req.params.id as string);
        res.json(order);
    }
    catch (err : any) {
        if (err.message === 'ORDER NOT FOUND') return res.status(404).json({message : 'Lỗi khi lấy thông tin đơn hàng'});
        res.status(500).json({message : 'Lỗi mất kết nối db'});
    }
}