import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './user/user.routes.js';
import { errorHandler } from './user/auth.middleware.js';
import { connectDB } from './user/user.db.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
// Conectar a MongoDB
connectDB();
app.use(express.json());
app.use('/api/users', userRoutes);
// Manejo de errores global
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
//# sourceMappingURL=app.js.map