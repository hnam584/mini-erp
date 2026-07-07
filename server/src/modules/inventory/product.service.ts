import Product from './product.model'
import StockTransaction from './stockTransaction.model'

export const getAllProducts = async () => {
    return await Product.find().sort({createdAt: -1});
}

export const createNewProduct = async (data: any) => {
    return await Product.create(data);
}

export const updateProductById = async (id : string, data : any) => {
    const product = await Product.findByIdAndUpdate(id, data, {new: true});
    if (!product) throw new Error('Not found');
    return product;
}

export const deleteProductById = async (id : string) => {
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new Error('Not found')
    return product;
}

export const stockInService = async (productId : string, quantity : number, reason : string) => {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Not found');

    product.stock += quantity;
    await product.save();

    await StockTransaction.create({
        product: productId,
        type: 'IN',
        quantity,
        reason,
    });

    return product;
}