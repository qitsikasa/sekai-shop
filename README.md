# Sekai Shop

Tienda de práctica con catálogo real de merch oficial de Hatsune Miku: Colorful Stage! (Project Sekai). El catálogo se guarda en **Cloud Firestore** y el acceso de administración usa **Firebase Authentication** con Google.

## Características

- Catálogo con filtros por unidad, personaje y disponibilidad.
- Compra desde el catálogo: el stock se descuenta con una transacción de Firestore.
- La compra pública solo puede modificar `stock` (-1); el resto de escrituras requiere admin.
- Panel de administración: CRUD de productos, tabla de inventario, detalle de producto y carga del catálogo real.
- Escrituras protegidas por reglas de Firestore; solo el UID autorizado puede crear, editar o borrar productos.
- Importación opcional de los productos existentes de MockAPI.
- Precios en BOB o JPY; el formato se adapta a la moneda de cada producto (`SekaiConfig.formatPrice`).

## Configuración de Firebase

1. En Firebase Console, abre el proyecto `proyectos-testing-f0a11`.
2. Habilita **Firestore Database** (modo producción o test; las reglas se encargan del acceso).
3. En Firestore → Reglas, pega el contenido de `firestore.rules` y publica.
4. En Authentication → Settings → Authorized domains, agrega `qitsikasa.github.io` (y `localhost` si desarrollas local).
5. Opcional: en Google Cloud, restringe la API key a los referrers de tu dominio y a las APIs que uses (Identity Toolkit y Cloud Firestore).

La configuración web de Firebase (`apiKey`, `projectId`, etc.) es pública por diseño; la seguridad depende de las reglas y restricciones, no de ocultarla.

## Quickstart

No requiere build. Sirve el proyecto con un servidor estático:

```bash
python -m http.server 8000
```

Abre http://localhost:8000 en el navegador. También puedes usar Live Server o `npx serve -s .`.

## Rutas

| Ruta | Vista |
|------|-------|
| `/` | Inicio |
| `#shop` | Tienda |
| `#admin` | Login/panel de administración |

## Uso

### Tienda

- Filtra por unidad, personaje o disponibilidad.
- Los productos agotados muestran "Sin Stock".

### Compra

- Abre la modal del producto, completa nombre y correo y confirma. El stock baja en Firestore mediante una transacción.

### Administración

- Entra a `#admin` o usa el icono de usuario.
- Inicia sesión con Google; solo `ALLOWED_UID` tiene permisos de escritura.
- Puedes crear, editar, eliminar, ver el detalle de cada producto, cargar el catálogo real de Creators Festa 2026 e importar lo que tengas en MockAPI.
- Cierra sesión con "Salir".

## Configuración

| Clave | Ubicación | Descripción |
|-------|-----------|-------------|
| `COLLECTION` | `SekaiConfig.COLLECTION` | Colección de Firestore donde se guardan los productos (`products`). |
| `LEGACY_API_URL` | `SekaiConfig.LEGACY_API_URL` | Endpoint de MockAPI para la importación opcional. Déjalo vacío si no lo usas. |
| `ALLOWED_UID` | `SekaiConfig.ALLOWED_UID` | UID de Firebase autorizado para administrar. Debe coincidir con `firestore.rules`. |
| `FIREBASE_CONFIG` | `SekaiConfig.FIREBASE_CONFIG` | Configuración del proyecto Firebase. |
| `UNIT_CHARACTERS` | `SekaiConfig.UNIT_CHARACTERS` | Unidades y personajes para filtros; incluye `Todos` para merch general. |
| `formatPrice` | `SekaiConfig.formatPrice` | Formatea precios según `currency` (`BOB`, `JPY`, `USD`). |
| `SekaiCatalog` | `js/lib/catalog.js` | Catálogo real de productos oficiales, precios e imágenes. |

## Desarrollo

- `index.html` contiene las vistas; `js/main.js` gestiona las rutas hash y carga `js/pages/admin.js` solo al entrar a `#admin`.
- `js/lib/firebase.js` inicializa la app y Firestore.
- `js/lib/catalog.js` contiene el catálogo real; las imágenes están en `assets/products/`.
- `js/lib/api.js` encapsula las operaciones de Firestore; `js/lib/store.js` mantiene el estado; `js/lib/auth.js` gestiona el login.
- `js/pages/shop.js` implementa tienda y compra; `js/pages/admin.js` implementa el panel.
- No hay linter ni tests configurados.

Las imágenes de `assets/products/` provienen de la página oficial de goods de Project Sekai Creators Festa 2026 y se usan solo con fines de demostración. © SEGA / Colorful Palette / CFM.

## Solución de problemas

- **`Missing or insufficient permissions`**: revisa que `firestore.rules` esté publicado y que `ALLOWED_UID` coincida con el UID real.
- **Catálogo vacío**: verifica que Firestore esté habilitado y que la colección `products` exista; usa "Cargar Catálogo Real" o "Importar MockAPI" desde admin.
- **No abre el login de Google**: agrega el dominio a Authorized domains en Firebase Authentication y revisa restricciones de la API key.
- **La compra falla**: el producto pudo quedarse sin stock; la transacción evita vender la última unidad dos veces.
