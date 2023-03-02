import { getProfile } from './controllers/shop.js';
import { createNewProducts, getProductsCount } from './controllers/product.js';
import { Router } from 'express';

const protectedApiRouter = Router();

protectedApiRouter.get('/profile', getProfile);
// @ts-ignore
protectedApiRouter.get('/products/count', getProductsCount);
// @ts-ignore
protectedApiRouter.post('/products/create', createNewProducts);

export default protectedApiRouter;
