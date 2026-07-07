import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import productRoutes from './modules/inventory/product.routes';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);

app.get('/api/health', (req, res) => {
    res.json({status : 'ok'});
})

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI as string).then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => console.error('MongoDB connection error: ',err));