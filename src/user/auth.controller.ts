import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByUsername } from './user.service.js';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await findUserByUsername(username);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const userForToken = {
    id: user._id,
    role: user.role,
    username: user.username
  };

  const secret = process.env.SECRET;
  if (!secret) {
    console.error('Missing SECRET environment variable');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const token = jwt.sign(
    userForToken,
    secret,
    { expiresIn: '1h' }
  );

  res.json({ id: user._id, token, username: user.username, name: user.name, role: user.role });
};