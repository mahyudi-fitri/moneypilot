import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error('[error]', err.message);

  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: JSON.parse(err.message),
    });
  }

  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'A record with this value already exists' });
  }

  res.status(500).json({ error: 'Something went wrong' });
};
