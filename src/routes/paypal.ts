import { Router } from 'express';
import controller from '../controller';

const router = Router();

router.post('/capture', controller.paypal.captureOrder);

router.post('/create', controller.paypal.createOrder);

export default router;