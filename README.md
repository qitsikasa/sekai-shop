# Sekai Shop

Tienda mock de merch oficial de Hatsune Miku: Colorful Stage! (Project Sekai), hecha como proyecto de práctica de desarrollo web.

## Características

- Tienda de productos con filtros por unidad, personaje y solo disponibles
- Compra desde el catálogo: el stock se descuenta automáticamente en la API
- Panel de administración: CRUD de productos, inventario en tabla y generación de 20 productos de prueba
- Acceso solo para un usuario de Google autorizado (ALLOWED_UID)
- Precios en BOB; configuración centralizada en `js/lib/config.js`

## Quickstart

No requiere instalación ni build: es HTML, CSS, JavaScript y Tailwind por CDN.

```bash
python -m http.server 8000
```

Abre http://localhost:8000/index.html en tu navegador.

Alternativa sin Python: abre el proyecto con un servidor estático como Live Server o `npx serve -s .`.

## Uso

### Tienda

- Desde el inicio o la tienda (`#shop`), revisa el catálogo y usa los filtros de la columna izquierda: unidad, personaje y "mostrar disponibles".
- Los productos agotados muestran el botón "Sin Stock".

### Compra

- Abre la modal de un producto, completa nombre y correo, y confirma la compra: el stock en la API baja uno.

### Administración

- Ingresa a `#admin` o usa el icono de usuario en la barra de navegación.
- Inicia sesión con Google; el panel permite ver el inventario, crear/editar/eliminar productos, ver detalles y "Generar 20 Datos Test".
- Sale con el botón Salir.

## Configuración

| Clave | Ubicación en código | Predeterminado | Descripción |
|-------|--------------------|----------------|-------------|
| `API_URL` | `SekaiConfig.API_URL` | configurado (mockapi.io) | Endpoint del listado de productos. Si contiene `TU_ID`, se usa modo local con stock en memoria y sin API. |
| `ALLOWED_UID` | `SekaiConfig.ALLOWED_UID` | — (obligatorio) | UID de Firebase del usuario autorizado al panel admin; otros usuarios son rechazados. |
| `UNIT_CHARACTERS` | `SekaiConfig.UNIT_CHARACTERS` | — (obligatorio) | Unidades y personajes por unidad; se usan en los filtros y en los datos de prueba. |
| `MERCH_TYPES` | `SekaiConfig.MERCH_TYPES` | — (obligatorio) | Tipos de merch con precio base; se usan al generar datos de prueba. |
| `FIREBASE_CONFIG` | `SekaiConfig.FIREBASE_CONFIG` | — (obligatorio) | Configuración de Firebase para el login de Google. |

El campo `currency` de cada producto (por defecto `BOB`) registra la moneda; la UI muestra el símbolo "Bs".

## Desarrollo

- Puntos de entrada: `index.html`; rutas con hash `#home`, `#shop`, `#admin`.
- `js/main.js` enruta las vistas y carga dinámicamente Firebase + `js/pages/admin.js` al entrar a `#admin`.
- `js/pages/shop.js` implementa la tienda; `js/lib/store.js` (estado), `js/lib/api.js` (API) y `js/lib/auth.js` (login).
- No hay linter ni tests: el proyecto no tiene toolchain configurado.

## Solución de problemas

- Productos vacíos: revisa la consola para errores de `fetch` a `SekaiConfig.API_URL`; el modo local muestra solo lo que se haya creado.
- Panel admin no abre: solo el UID `ALLOWED_UID` está autorizado; otros usuarios de Google son rechazados con un aviso.
- Compra fallida con "alguien más acaba de comprar el último": el stock cambió entre la lectura y la confirmación.
