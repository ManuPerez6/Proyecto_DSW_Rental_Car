import { Router, Request, Response, NextFunction } from 'express';
import { registerUser, listUsers, getUserById, deleteUser} from './user.controller.js';
import { login } from './auth.controller.js';
import { userExtractor, isAdmin } from './auth.middleware.js';

const router = Router();

// Registro de usuario (Público)
router.post('/register', registerUser);

// Login (Público)
router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  login(req, res).catch(next);
});

// Listar usuarios (Requiere autenticación y ser ADMIN)
router.get('/', userExtractor, isAdmin, (req: Request, res: Response, next: NextFunction) => {
  listUsers(req, res).catch(next);
});

// Obtener usuario único por ID (Lógica de seguridad en el controlador)
router.get('/:id', userExtractor, (req: Request, res: Response, next: NextFunction) => {
  getUserById(req, res).catch(next); 
});

// Eliminar usuario por id (Lógica de seguridad en el controlador)
router.delete('/:id', userExtractor, async (req: Request, res: Response, next: NextFunction) => {
  deleteUser(req,res).catch(next);
});

export default router;