docker build -t husi-frontend .

Mapea el puerto interno 80 (donde corre Nginx) al puerto 3000 de tu máquina:
docker run -d --name husi-frontend -p 3000:80 husi-frontend

ver logs en tiempo real
docker logs -f husi-frontend


detener
docker stop husi-frontend


eliminar
docker rm husi-frontend


ver contenedores en ejecucion 
docker ps

