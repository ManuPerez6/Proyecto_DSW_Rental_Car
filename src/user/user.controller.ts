import { Request, Response } from 'express';
import { register, getUsers } from './user.service.js';

export const registerUser = async (req: Request, res: Response) => {
  const { username, name, password } = req.body;
  try {
    const user = await register(username, name, password);
    res.status(201).json(user.toJSON());
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const listUsers = async (_req: Request, res: Response) => {
  try {
    const users = await getUsers();
    res.json(users.map(user => user.toJSON()));
  } catch {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};