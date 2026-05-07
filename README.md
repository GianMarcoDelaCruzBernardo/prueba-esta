# 🛍️ Proyecto Yalú - Librería Bazar

Sistema completo de e-commerce dockerizado: **Django REST API + React Frontend + PostgreSQL**

---

## 📋 Contenido del Proyecto

```
yalu-proyecto/
├── yalu-backend/          # Django REST API
├── yalu-frontend/         # React + Vite
├── docker-compose.yml     # Orquestación de servicios
├── init.sql              # Datos iniciales de PostgreSQL
├── .env.example          # Variables de entorno de ejemplo
└── README.md             # Este archivo
```

---

## 🎯 Requisitos Previos

- **Docker Desktop** instalado y corriendo
- Mínimo **4GB RAM** disponible
- Puertos **5173** (frontend), **8000** (backend) y **5432** (PostgreSQL) libres

---

## 🚀 Instalación Rápida (3 pasos)

### 1️⃣ Configurar variables de entorno

Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de Firebase:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=proyecto-yalu.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=proyecto-yalu
```

### 2️⃣ Levantar los servicios

```bash
docker-compose up -d
```

Esto levantará automáticamente:
- ✅ PostgreSQL (puerto 5432)
- ✅ Backend Django (puerto 8000)
- ✅ Frontend React (puerto 5173)

**Espera 2-3 minutos** la primera vez (descarga imágenes y ejecuta migraciones).

### 3️⃣ Acceder a la aplicación

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000/api/
- **Admin Django:** http://localhost:8000/admin/

---

## 👤 Crear Superusuario (Admin)

Para acceder al panel de administración:

```bash
docker exec -it yalu-backend python manage.py createsuperuser
```

Ingresa:
- Username: `admin`
- Email: `admin@yalu.pe`
- Password: (elige uno seguro)

Luego accede a: http://localhost:8000/admin/

---

## 📊 Base de Datos

### Datos Iniciales Incluidos

El script `init.sql` crea automáticamente:

**8 Categorías:**
- Lapices y plumas
- Libros y cuadernos
- Arte y pintura
- Geometría
- Manualidades
- Mochilas y estuches
- Calculadoras
- Papelería fina

**8 Marcas:**
- Faber Castell
- Stanford
- Artesco
- Pilot
- Layconsa
- Norma
- Vinifan
- Totto

**30 Productos de ejemplo**
Distribuidos en todas las categorías con precios, stock y descripciones.

### Verificar datos

```bash
docker exec -it yalu-db psql -U yalu_user -d yalu_db
```

Dentro de PostgreSQL:
```sql
SELECT COUNT(*) FROM catalogo_categoria;  -- Debe mostrar 8
SELECT COUNT(*) FROM catalogo_marca;      -- Debe mostrar 8
SELECT COUNT(*) FROM catalogo_producto;   -- Debe mostrar 30+
```

Salir: `\q`

---

## 🛠️ Comandos Útiles

### Ver logs en tiempo real

```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo frontend
docker-compose logs -f frontend
```

### Reiniciar un servicio

```bash
docker-compose restart backend
docker-compose restart frontend
```

### Parar todos los servicios

```bash
docker-compose down
```

### Parar y eliminar TODO (incluyendo volúmenes)

```bash
docker-compose down -v
```

⚠️ **CUIDADO:** Esto elimina la base de datos completa.

### Reconstruir después de cambios

Si modificas código:

```bash
docker-compose up -d --build
```

---

## 🔧 Desarrollo Local

### Ejecutar migraciones manualmente

```bash
docker exec -it yalu-backend python manage.py migrate
```

### Crear nueva app Django

```bash
docker exec -it yalu-backend python manage.py startapp nombre_app
```

### Instalar dependencias Python

1. Edita `yalu-backend/requirements.txt`
2. Reconstruye:
   ```bash
   docker-compose up -d --build backend
   ```

### Instalar dependencias Node.js

1. Edita `yalu-frontend/package.json`
2. Reconstruye:
   ```bash
   docker-compose up -d --build frontend
   ```

---

## 📱 App Android

La app Android **NO se dockeriza** (es código nativo).

### Conectar app Android a backend dockerizado

1. **Encuentra tu IP local:**
   ```bash
   ipconfig  # Windows
   ifconfig  # Mac/Linux
   ```

2. **Actualiza BASE_URL** en `app/build.gradle`:
   ```gradle
   buildConfigField "String", "BASE_URL", "\"http://TU-IP:8000/api/\""
   ```

3. **Actualiza ALLOWED_HOSTS** en `.env`:
   ```env
   ALLOWED_HOSTS=localhost,127.0.0.1,TU-IP
   ```

4. **Reinicia backend:**
   ```bash
   docker-compose restart backend
   ```

---

## 🌐 Producción

### Variables de entorno para producción

Edita `.env`:

```env
DEBUG=False
SECRET_KEY=genera-una-clave-segura-aqui
ALLOWED_HOSTS=tu-dominio.com,www.tu-dominio.com
DB_PASSWORD=cambia-esta-contraseña
CORS_ALLOWED_ORIGINS=https://tu-dominio.com
```

### Generar SECRET_KEY seguro

```python
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

---

## 🐛 Solución de Problemas

### Error: "Port already in use"

Otro servicio usa el puerto. Cambia los puertos en `docker-compose.yml`:

```yaml
ports:
  - "8001:8000"  # Backend en puerto 8001
  - "5174:5173"  # Frontend en puerto 5174
```

### Error: "Cannot connect to database"

Espera 30 segundos más. PostgreSQL tarda en iniciar la primera vez.

O verifica logs:
```bash
docker-compose logs db
```

### Frontend no carga

Verifica que las variables de Firebase estén correctas en `.env`.

### Backend devuelve 404

Verifica que la URL termine en `/`:
- ✅ `http://localhost:8000/api/catalogo/productos/`
- ❌ `http://localhost:8000/api/catalogo/productos`

---

## 📤 Compartir con tu Equipo

### Opción 1: Git (Recomendado)

```bash
git init
git add .
git commit -m "Proyecto Yalú dockerizado"
git remote add origin https://github.com/tu-usuario/yalu-proyecto.git
git push -u origin main
```

**Tu equipo:**
```bash
git clone https://github.com/tu-usuario/yalu-proyecto.git
cd yalu-proyecto
cp .env.example .env
# Editar .env con sus credenciales
docker-compose up -d
```

### Opción 2: Docker Hub

```bash
# Build y push
docker-compose build
docker tag yalu-backend tu-usuario/yalu-backend:latest
docker push tu-usuario/yalu-backend:latest
```

### Opción 3: Archivo .tar

```bash
docker save -o yalu-images.tar yalu-backend yalu-frontend postgres:15-alpine
```

**Tu equipo:**
```bash
docker load -i yalu-images.tar
docker-compose up -d
```

---

## 📞 Soporte

- **Documentación Django:** https://docs.djangoproject.com/
- **Documentación React:** https://react.dev/
- **Documentación Docker:** https://docs.docker.com/

---

## ✅ Checklist de Inicio

- [ ] Docker Desktop corriendo
- [ ] `.env` configurado con Firebase
- [ ] `docker-compose up -d` ejecutado
- [ ] Esperar 2-3 minutos
- [ ] Crear superusuario
- [ ] Acceder a http://localhost:5173
- [ ] Verificar productos en catálogo
- [ ] Login con Google funcionando

---

**¡Listo! Tu proyecto Yalú está dockerizado y listo para desarrollo** 🚀

*Última actualización: Abril 2026*
