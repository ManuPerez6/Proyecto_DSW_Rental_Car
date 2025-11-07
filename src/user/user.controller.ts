import { Request, Response } from 'express';
import { register, getUsers, findUserById, deleteUserById } from './user.service.js';

export const registerUser = async (req: Request, res: Response) => {
  const { username, name, password } = req.body;
  try {
  const user = await register(username, name, password);
  res.status(201).json(user.toJSON());
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Listar usuarios (solo admins, controlado desde las rutas)
export const listUsers = async (_req: Request, res: Response) => {
  try {
    const users = await getUsers();
    res.json(users.map(user => user.toJSON()));
  } catch {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const requestedId = req.params.id;
    const requestingUser = req.user;

    // Si no hay usuario (por alguna razón), rechazamos con 401
    if (!requestingUser) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    // Permitir si es admin o si está pidiendo sus propios datos
    if (requestingUser.role !== 'admin' && requestingUser.id !== requestedId) {
      res.status(403).json({ error: 'No autorizado para ver este recurso' });
      return;
    }

    const user = await findUserById(requestedId);
    
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }
    
    res.json(user.toJSON());
  } catch (error: any) {
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
   try {
     const requestedId = req.params.id;
     const requestingUser = req.user;

     // Si no hay usuario en la request, devolver 401
     if (!requestingUser) {
       res.status(401).json({ error: 'No autorizado' });
       return;
     }

     // Permitir si es admin O si está eliminando su propia cuenta
     if (requestingUser.role !== 'admin' && requestingUser.id !== requestedId) {
       res.status(403).json({ error: 'No autorizado para eliminar este recurso' });
       return; 
     }
     
     const deletedUser = await deleteUserById(requestedId);
     if (!deletedUser) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
     }

     res.status(204).end();
   } catch (error: any) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
   }
};