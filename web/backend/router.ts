import { getProfile } from './controllers/shop.js';
import { createNewProducts, getProductsCount } from './controllers/product.js';
import { Router } from 'express';
import { changeBillingPlan, getBillingPlans } from './controllers/billing.js';

const protectedApiRouter = Router();

// @ts-ignore
protectedApiRouter.get('/profile', getProfile);
// @ts-ignore
protectedApiRouter.get('/products/count', getProductsCount);
// @ts-ignore
protectedApiRouter.post('/products/create', createNewProducts);
// @ts-ignore
protectedApiRouter.get('/billing-plans', getBillingPlans);
// @ts-ignore
protectedApiRouter.post('/billing-plan-change', changeBillingPlan);

export default protectedApiRouter;
