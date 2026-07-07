import { Request, Response } from 'express';
import {
  getAllProducts,
  createNewProduct,
  updateProductById,
  deleteProductById,
  stockInService,
} from './product.service';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await createNewProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi tạo sản phẩm' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await updateProductById(req.params.id as string, req.body);
    res.json(product);
  } catch (err: any) {
    if (err.message === 'Not found') return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.status(400).json({ message: 'Lỗi khi cập nhật sản phẩm' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await deleteProductById(req.params.id as string);
    res.json({ message: 'Đã xóa sản phẩm' });
  } catch (err: any) {
    if (err.message === 'Not found') return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.status(500).json({ message: 'Lỗi khi xóa sản phẩm' });
  }
};

export const stockIn = async (req: Request, res: Response) => {
  try {
    const { productId, quantity, reason } = req.body;
    const product = await stockInService(productId, quantity, reason);
    res.json({ message: 'Nhập kho thành công', product });
  } catch (err: any) {
    if (err.message === 'Not found') return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.status(400).json({ message: 'Lỗi khi nhập kho' });
  }
};