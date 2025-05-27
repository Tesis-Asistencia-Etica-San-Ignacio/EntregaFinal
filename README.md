## Repositorio público
- **URL**: https://github.com/Kose117/Tesis-entregaFinal.git
- **TAG**: v1.0.0
Documentación: consulte la carpeta docs/ del repositorio
Licencia: MIT

### Despliegue con Docker Compose
Para ejecutar el despliegue con Docker Compose, asegúrese de tener Docker Desktop instalado y en ejecución, y sitúese en la raíz del proyecto antes de lanzar los comandos:

```bash
git clone https://github.com/Tesis-Asistencia-Etica-San-Ignacio/EntregaFinal.git
cd EntregaFinal
git checkout v1.0.0
docker-compose up --build
```
Una vez que los contenedores estén activos, abra su navegador y acceda a
http://localhost:3000/auth
para comprobar que la aplicación se está ejecutando correctamente.


## Configuración de variables de entorno

### Backend

En la carpeta `Backend/`, crea un archivo `.env` con la siguiente plantilla (no incluyas los valores entre `< >`, reemplázalos por los tuyos):

```dotenv
# SMTP
SMTP_HOST=<tu_smtp_host>
SMTP_PORT=<tu_smtp_port>
SMTP_USER=<tu_smtp_user>
SMTP_PASS=<tu_smtp_pass>

# MONGO_URI=mongodb+srv://<usuario>:<password>@cluster.../…  
MONGO_URI=mongodb://<usuario>:<password>@mongo:27017/?authSource=admin

# API
CONVENTION_API=/api

# Puerto DENTRO del contenedor (coincide con mapping 8080:3000)
PORT=3000

# Frontend (para CORS, etc.)
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=<tu_jwt_secret>
JWT_SECRET_REFRESH=<tu_jwt_refresh_secret>

# Minio
MINIO_URL=http://minio:9000
MINIO_ROOT_USER=<tu_minio_user>
MINIO_ROOT_PASSWORD=<tu_minio_password>

#  API keys de IA
> Las siguientes son las únicas claves de API de inteligencia artificial compatibles con la aplicación en este momento:
GROQ_API_KEY=<tu_groq_api_key>
GEMINI_API_KEY=<tu_gemini_api_key>
```
### Frontend
En la carpeta `Frontend/`, crea un archivo `.env` con la siguiente plantilla:
```dotenv
VITE_BACKEND_URL=http://localhost:8080/api/

```
