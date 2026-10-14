import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function me(req: Request, res: Response) {
  res.json({ user: req.user });
}
