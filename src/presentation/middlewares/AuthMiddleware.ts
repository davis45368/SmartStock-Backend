import { NextFunction, Request, Response } from 'express';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../infrastructure/config/supabase';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token de autenticación requerido.' });
    return;
  }

  const token = authHeader.slice(7);

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    res.status(401).json({ error: 'Token inválido o expirado.' });
    return;
  }

  req.user = data.user;
  next();
}
