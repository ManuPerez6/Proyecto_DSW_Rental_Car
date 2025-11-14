import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import carRoutes from './car/car.routes.js'
import userRoutes from './user/user.routes.js';
import rentalRoutes from './rental/rental.routes.js';
import { errorHandler } from './user/auth.middleware.js';
import { connectDB } from './user/user.db.js';
import httpLogger from './middleware/logger/pino.logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 
};

async function startServer() {
  // 1. Conectar a MongoDB y esperar a que esté lista
  await connectDB();

  // 2. USAR MIDDLEWARES (CORS debe ir antes de las rutas)
  app.use(cors(corsOptions)); 
  app.use(httpLogger);
  app.use(express.json());

  // 4. Montar rutas
  app.use('/api/users', userRoutes);
  app.use('/api/cars', carRoutes);
  app.use('/api/rentals', rentalRoutes);

  // 5. Manejo de errores global
  app.use(errorHandler);

  // 6. Iniciar el servidor
  app.listen(PORT, () => {
    // Usamos .info() ya que httpLogger es una instancia de pino-http
    httpLogger.logger.info(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

startServer();