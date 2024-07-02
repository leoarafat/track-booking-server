import { NextFunction, Request, Response } from 'express';

export class NotFoundHandler {
  static handle(req: Request, res: Response, next: NextFunction) {
    res.status(404).json({
      success: false,
      message: 'Not Found',
      errorMessages: [
        {
          path: req.originalUrl,
          message: `This ${req.originalUrl} API Not Found`,
        },
      ],
    });
    next();
  }
}
