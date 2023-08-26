import { Router } from 'express';
import controller from '../controller';
import { validateFormAndCart } from '../middleware/paypal';

const router = Router();

router.post('/capture', controller.paypal.captureOrder);

router.post('/create', validateFormAndCart, controller.paypal.createOrder);

export default router;