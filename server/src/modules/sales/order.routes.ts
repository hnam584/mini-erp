import { Router } from "express";
import {createOrder, getOrders, getOrderDetail} from './order.controller';

const router = Router();

router.get('/', getOrders);
router.post('/', createOrder);
router.get('/:id', getOrderDetail);

export default router;
