# Proyecto de Prueba Star Wars

Este es un proyecto de prueba que incluye tanto el **Frontend** como el **Backend** para la aplicación de Star Wars. El frontend está desarrollado en **React** y el backend en **Django**. El propósito de este proyecto es probar el funcionamiento conjunto de ambos servicios. 

### Requisitos
- Docker y Docker Compose deben estar instalados en tu sistema.

### Estructura del Proyecto

El proyecto está dividido en dos partes principales:
- **Frontend** (React)
- **Backend** (Django)

#### Servicios Utilizados
- **PostgreSQL** para la base de datos
- **Redis** como caché
- **Backend** con Django
- **Frontend** con React

### Instrucciones para Ejecutar

1. **Clona el repositorio**:
   ```bash
   git clone https://url_del_repositorio.git
   cd proyecto_star_wars
2. **Compilar y levantar el contenedort**:
   ```bash
   docker compose up --build
3. **Creamos nuestras migraciones**:
   ```bash
   docker-compose exec backend python manage.py migrate

4. **Cragamos datos iniciales **:
   ```bash
   docker-compose exec backend python manage.py populate_data
