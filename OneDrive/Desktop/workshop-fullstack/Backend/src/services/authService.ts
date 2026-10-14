import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { HttpError } from '../httpError';
import { User } from '../models';
import { AuthUser } from '../types';

export async function login(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !password) {
    throw new HttpError(400, 'Email and password are required');
  }

  const user = await User.findOne({ where: { email: normalized } });
  if (!user || !user.isActive) {
    throw new HttpError(401, 'Invalid email or password');
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    throw new HttpError(401, 'Invalid email or password');
  }

  const payload: AuthUser = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role
  };
  const token = jwt.sign(payload, env.jwtSecret, { expiresIn: '12h' });
  return { token, user: payload };
}
