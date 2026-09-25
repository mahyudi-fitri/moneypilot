import type { Request, Response, NextFunction } from 'express';
import { ZodError, type ZodSchema } from 'zod';

export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };
}
