import { Router, Request, Response, NextFunction } from 'express';
import { registerUser, listUsers } from './user.controller.js';
import { login } from './auth.controller.js';
import { userExtractor, requestLogger } from './auth.middleware.js';
import { deleteUserById } from './user.service.js';

const router = Router();

// Logger para todas las rutas de usuario
router.use(requestLogger);

// Registro de usuario
router.post('/', registerUser);

// Login
router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  login(req, res).catch(next);
});

// Listar usuarios (requiere autenticación)
router.get('/', userExtractor, (req: Request, res: Response, next: NextFunction) => {
  listUsers(req, res).catch(next);
});

// Eliminar usuario por id (requiere autenticación y ser el propio usuario)
router.delete('/:id', userExtractor, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    if (userId !== req.params.id) {
      res.status(403).json({ error: 'No autorizado' });
      return; 
    }
    
    await deleteUserById(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error); 
  }
});

export default router;
