import { Router } from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct, stockIn } from './product.controller';

const router = Router();

router.get('/', getProducts);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.post('/stock-in', stockIn);

export default router;