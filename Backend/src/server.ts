import express from 'express';
import {
  configureMiddlewares,
  errorHandlerMiddleware,
} from './presentation/middleware';
import config from './infrastructure/config';
import { database } from './infrastructure';
import { initMinioBucket } from './infrastructure/config/initMinio';

import {
  caseRouter,
  userRouter,
  evaluacionRouter,
  promptRouter,
  authRouter,
  fileRouter,
  pdfRouter,
  smtpRouter,
  ethicalRulesRouter,
  iaRouter,
  statsRouter
} from './presentation/routes';

// 1 Crear la aplicación Express
const app = express();

configureMiddlewares(app);


// 2 Definición de rutas protegidas para cada rol
app.use(`${config.api.conventionApi}/pdf`, pdfRouter);
app.use(`${config.api.conventionApi}/user`, userRouter);
app.use(`${config.api.conventionApi}/evaluacion`, evaluacionRouter);
app.use(`${config.api.conventionApi}/cases`, caseRouter);
app.use(`${config.api.conventionApi}/prompts`, promptRouter);
app.use(`${config.api.conventionApi}/auth`, authRouter);
app.use(`${config.api.conventionApi}/files`, fileRouter);
app.use(`${config.api.conventionApi}/smtp`, smtpRouter);
app.use(`${config.api.conventionApi}/ethicalRules`, ethicalRulesRouter);
app.use(`${config.api.conventionApi}/ia`, iaRouter);
app.use(`${config.api.conventionApi}/stats`, statsRouter)

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor Express funcionando correctamente');
});

// 3. Middleware para manejo de errores
app.use(errorHandlerMiddleware);

// Conectar la base de datos antes de iniciar el servidor
const startServer = async () => {

  try {
    await database.connect(); // Ensure DB is connected before starting the server
    await initMinioBucket('uploads');
    const server = app.listen(config.server.port, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${config.server.port}`);
    });
    server.setTimeout(10 * 1000);

  } catch (error) {
    console.error('❌ Error al iniciar la aplicación:', error);
    process.exit(1);
  }
};

// Iniciar la aplicación
startServer();

function cors(arg0: {
  origin: string; // o '*' para permitir todos los orígenes
  methods: string[]; allowedHeaders: string[];
}): any {
  throw new Error('Function not implemented.');
}

export { app };
