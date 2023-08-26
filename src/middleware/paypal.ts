import { Request, Response, NextFunction } from 'express';

export function validateFormAndCart(req: Request, res: Response, next: NextFunction) {
    if (!req.body || !req.body.form || !req.body.cart) {
      return res.status(400).json({ error: 'Invalid request. Please make sure all fields are present.' });
    }
  
    const { form } = req.body;
    const expectedFields = ['firstName', 'lastName', 'address1', 'address2', 'city', 'state', 'postalCode', 'country'];
    for (const field of expectedFields) {
      if (!form[field]) {
        return res.status(400).json({ error: `Field '${field}' not found in the form.` });
      }
    }
  
    const { cart } = req.body;
    if (!Array.isArray(cart)) {
      return res.status(400).json({ error: 'The "cart" field must be an array.' });
    }
  
    for (const item of cart) {
      const expectedItemFields = ['id', 'name', 'quantity', 'value'];
      for (const field of expectedItemFields) {
        if (!item[field]) {
          return res.status(400).json({ error: `Field '${field}' not found in a cart item.` });
        }
      }
    }

    next();
  }