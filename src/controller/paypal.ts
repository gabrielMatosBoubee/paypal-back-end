import { Request, Response } from 'express';
import services from '../service';

const createOrder = async (_req: Request, res: Response) => {
    try {
        const order = await services.paypalApi.createOrder()
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({message: error})
    }
};

const captureOrder = async (req: Request, res: Response) => {
    const { orderID } = req.body;
    try {
        const  captureData = await services.paypalApi.capturePayment(orderID);
        res.status(200).json(captureData)
    } catch (error) {
        res.status(500).json({message: error})
    }
}

export default { createOrder, captureOrder };