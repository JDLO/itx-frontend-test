# 📱 Mini-Aplicación E-Commerce MovilShop (Front-End Test)

Este proyecto consiste en una **Single Page Application (SPA)** desarrollada en **React** utilizando **JavaScript moderno (ES6)**. La aplicación simula una tienda en línea de dispositivos móviles que consume una API REST externa, aplicando un sistema de caché inteligente en el cliente y persistencia para el carrito de compras.

---

## 🛠️ Requisitos del Sistema y Scripts

El proyecto cuenta con los cuatro scripts obligatorios requeridos por la especificación técnica. Se ejecutan utilizando `npm run <script>`:

1. **`npm run dev`** (START - Modo Desarrollo):  
   Levanta el servidor local con soporte para *Hot Module Replacement (HMR)*. Incluye la configuración del proxy inverso para evitar problemas de CORS en el entorno local.
   
2. **`npm run build`** (BUILD - Compilación):  
   Optimiza, minifica y empaqueta la aplicación para entornos de producción dentro del directorio `/dist`.
   
3. **`npm run preview`** (TEST - Lanzamiento de Tests):  
   Ejecuta la suite de pruebas unitarias implementada con **Vitest** (comprobando el correcto funcionamiento del borrado de caché y tiempos de expiración).
   
4. **`npm run lint`** (LINT - Comprobación de Código):  
   Analiza estáticamente el código fuente con **ESLint** para garantizar la calidad del código, el cumplimiento de las reglas de React y evitar malas prácticas (como variables declaradas no usadas).

---

## 📐 Arquitectura y Decisiones Técnicas

Para asegurar una estructura escalable y limpia, y aprovechando la experiencia en arquitecturas estructuradas (como la de Angular), se ha organizado el código fuente (`/src`) bajo el patrón de separación de responsabilidades:

* **`/components`**: Componentes visuales y reutilizables de la interfaz (ej. `Header`, `SearchBar`).
* **`/views`**: Componentes que actúan como páginas principales de la SPA (`ProductListPage` para el listado y `ProductDetailPage` para la ficha técnica).
* **`/services`**: Centraliza la lógica de comunicación HTTP e integración con la API (`productService`), separando por completo las llamadas de red de los componentes visuales.
* **`/context`**: Gestión del estado global de la aplicación (`CartContext`). Provee un mecanismo similar al patrón de Servicios Inyectables de ámbito global (Singleton) para comunicar datos reactivos entre componentes distantes de la jerarquía.
* **`/hooks`**: Centralización de lógica de estado reutilizable si fuera necesario.

---

## 🌐 Solución a Desafíos Técnicos

### 1. Evasión de Bloqueos por CORS (Proxy de Desarrollo)
Durante el desarrollo local, las peticiones directas desde `localhost` hacia la API de Render sufrían bloqueos por las políticas de **CORS (Cross-Origin Resource Sharing)** del navegador. 
* **Solución:** Se configuró un proxy inverso en el servidor de desarrollo de **Vite** (`vite.config.js`). El código de React dispara las peticiones de manera relativa a `/api/*`. El servidor local las intercepta y las redirige por debajo (servidor a servidor) a la URL real `https://itx-frontend-test.onrender.com`. Esto anula el bloqueo del navegador de manera limpia sin alterar el entorno productivo.

### 2. Mecanismo de Caché con Expiración (1 Hora)
El documento exige optimizar las peticiones síncronas `GET` de listado y detalle evitando llamadas innecesarias al backend.
* **Solución:** Se implementó un módulo intermedio `cacheManager` en `src/services/cache.js`. Cada respuesta exitosa de la API se guarda en el `localStorage` del navegador acompañada de un *timestamp* (marca de tiempo en milisegundos). Al intentar cargar una vista, el servicio comprueba si el registro existe y si la diferencia contra el tiempo actual es menor a **3,600,000 ms (1 hora)**. Si es válida, sirve los datos locales de inmediato; si expiró, limpia la caché y revalida los datos consultando de nuevo al servidor.

### 3. Persistencia de Datos del Carrito
La API devuelve el contador total actualizado de productos tras realizar una petición `POST /api/cart`.
* **Solución:** Para asegurar que el número de productos sea visible en la cabecera desde cualquier ruta y persista tras recargar la pantalla, se acopló el estado del contexto global (`CartContext`) con lecturas e inyecciones automáticas hacia el `localStorage`.

---

## 🚀 Guía de Inicio Rápido

Sigue estos pasos para clonar y ejecutar el proyecto localmente:

### 1. Clonar el repositorio e instalar dependencias
```bash
git clone https://github.com/JDLO/itx-frontend-test
cd itx-frontend-test
npm install