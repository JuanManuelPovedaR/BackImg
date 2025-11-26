# backimg

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.20. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

--------------------------------------------------------------------
# Descripción del proyecto
--------------------------------------------------------------------

BackImg es un servidor backend ligero desarrollado en TypeScript con Bun.js para la gestión y almacenamiento de imágenes. Permite subir imágenes mediante endpoints RESTful y servirlas de manera eficiente con soporte CORS para aplicaciones web frontend. El proyecto está diseñado para ser simple, rápido y fácil de implementar.

Librerías y tecnologías utilizadas:

Bun.js - Runtime de JavaScript/TypeScript de alto rendimiento

TypeScript - Lenguaje de programación tipado

@types/bun - Definiciones de tipos para Bun.js

--------------------------------------------------------------------
# Estructura del proyecto
--------------------------------------------------------------------
text
backimg/
├── src/
│   └── main.ts              # Archivo principal del servidor
├── images/                  # Carpeta de almacenamiento de imágenes
├── node_modules/            # Dependencias del proyecto
├── TS main.ts              # Archivo TypeScript adicional
├── .gitignore              # Archivos ignorados por Git
├── bun.lock                # Lock file de dependencias
├── index.ts                # Punto de entrada del módulo
├── package.json            # Configuración y dependencias del proyecto
├── README.md               # Documentación del proyecto
└── tsconfig.json           # Configuración de TypeScript
Explicación de las carpetas
src/ - Contiene el código fuente principal de la aplicación

main.ts - Servidor principal que maneja todas las rutas y lógica de la aplicación

images/ - Directorio donde se almacenan físicamente todas las imágenes subidas

Las imágenes se guardan con nombres únicos generados por UUID

Soporta formatos: JPG, JPEG, PNG, GIF

node_modules/ - Dependencias instaladas del proyecto (generada automáticamente)

Configuración y entorno
El proyecto utiliza las siguientes configuraciones:

package.json:

json
{
  "name": "backimg",
  "module": "index.ts",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "bun src/main.ts"
  }
}
Servidor configurado en: Puerto 3001
Carpeta de imágenes: /images en el directorio raíz
Headers CORS: Configurados para permitir cualquier origen (*)

--------------------------------------------------------------------
# Cómo ejecutar el proyecto
--------------------------------------------------------------------

Entorno de desarrollo
Prerrequisitos:

Tener Bun.js instalado en el sistema

Node.js (opcional, pero recomendado)

Pasos para ejecutar:

bash
# Clonar el proyecto (si aplica)
git clone <url-del-repositorio>
cd backimg

# Instalar dependencias
bun install

# Ejecutar el servidor en modo desarrollo
bun run dev
# o directamente
bun src/main.ts
Verificación:

El servidor estará disponible en: http://localhost:3001

En la consola se mostrarán los enlaces locales de las imágenes existentes

--------------------------------------------------------------------
# Producción
-------------------------------------------------------------------- 

Compilación (opcional):

bash
bun build src/main.ts --outdir ./dist
Ejecución:

bash
bun dist/main.js
Recomendaciones
Asegúrate de que la carpeta images/ tenga permisos de escritura

Para producción, considera cambiar "Access-Control-Allow-Origin": "*" por dominios específicos

Las imágenes se almacenan localmente, considera implementar backup regular

--------------------------------------------------------------------
# Endpoints disponibles
--------------------------------------------------------------------

Feature	Ruta	Método	Descripción
Subir imagen	/upload	POST	Recibe un archivo multipart/form-data y devuelve la URL de la imagen
Ver imagen	/images/{filename}	GET	Sirve la imagen solicitada
Página principal	/	GET	Muestra información básica del servidor
Preflight CORS	Cualquier ruta	OPTIONS	Maneja solicitudes preflight CORS
Arquitectura del proyecto
text
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Cliente       │    │   Servidor       │    │   Sistema de    │
│   Frontend      │───▶│   BackImg        │───▶│   Archivos      │
│                 │    │   (Bun.serve)    │    │   (images/)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │ POST /upload          │                       │
         │ (multipart/form-data) │                       │
         │──────────────────────▶│    Bun.write()        │
         │                       │───────────────────────▶
         │                       │                       │
         │ 201 Created           │                       │
         │ (URL de la imagen)    │                       │
         │◀──────────────────────│                       │
         │                       │                       │
         │ GET /images/{file}    │                       │
         │──────────────────────▶│    Bun.file()         │
         │                       │───────────────────────▶
         │                       │                       │
         │ 200 OK                │                       │
         │ (Contenido imagen)    │                       │
         │◀──────────────────────│                       │

--------------------------------------------------------------------
# Patrones utilizados:
--------------------------------------------------------------------

Servidor HTTP Simple - Implementado directamente con Bun.serve

Gestión de Archivos - Almacenamiento directo en sistema de archivos

API RESTful - Endpoints claros para operaciones CRUD de imágenes

CORS - Configuración para permitir requests cross-origin

Flujo de datos:
Upload: Cliente → Multipart Form → Servidor → Sistema de archivos

Retrieve: Cliente → Request → Servidor → Sistema de archivos → Cliente

El proyecto sigue una arquitectura minimalista donde el servidor maneja directamente las operaciones de archivo sin capas intermedias complejas, ideal para proyectos pequeños y medianos.