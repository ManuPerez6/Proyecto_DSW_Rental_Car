import express from 'express';
import dotenv from 'dotenv';
import carRoutes from './car/car.routes.js'
import userRoutes from './user/user.routes.js';
import rentalRoutes from './rental/rental.routes.js';
import { errorHandler } from './user/auth.middleware.js';
import { connectDB } from './user/user.db.js';
import httpLogger from './middleware/logger/pino.logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

async function startServer() {
  // 1. Conectar a MongoDB y esperar a que esté lista
  await connectDB();

  // 2. Usar middlewares
  app.use(httpLogger);
  app.use(express.json());

  // 3. Montar rutas
  app.use('/api/users', userRoutes);
  app.use('/api/cars', carRoutes);
  app.use('/api/rentals', rentalRoutes);

  // 4. Manejo de errores global
  app.use(errorHandler);

  // 5. Iniciar el servidor
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

startServer();