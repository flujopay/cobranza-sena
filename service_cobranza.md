# Collection API — Mini Sena Cobranza

> **Base URL:** `/api/v1/collection/`
> **País:** Chile (exclusivo)

---

## Autenticación

Existen dos niveles de permisos:

| Permiso                         | Headers requeridos                                     | Uso                                               |
| ------------------------------- | ------------------------------------------------------ | ------------------------------------------------- |
| **Público**                     | Ninguno                                                | Register, Login                                   |
| **CollectionJWTBasePermission** | `Authorization: Bearer <token>`                        | Endpoints sin contexto de empresa (`me`)          |
| **CollectionJWTPermission**     | `Authorization: Bearer <token>` + `X-Company-Id: <id>` | Endpoints que operan sobre una empresa específica |

---

## Endpoints

### 1. Register

Crea una cuenta de usuario y registra una empresa con RUT chileno. El RUT se valida contra el SII (base local + ApiGateway). Un mismo usuario puede registrar múltiples empresas.

```
POST /api/v1/collection/auth/register/
```

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "email": "usuario@empresa.cl",
  "password": "MiPassword123!",
  "password_confirm": "MiPassword123!",
  "rut": "76.123.456-7",
  "phone": "+56912345678"
}
```

| Campo              | Tipo   | Obligatorio | Notas                                                                      |
| ------------------ | ------ | :---------: | -------------------------------------------------------------------------- |
| `email`            | string |     Si      | Se normaliza a minúsculas                                                  |
| `password`         | string |     Si      | Min 8 chars, mayúscula, minúscula, número, carácter especial               |
| `password_confirm` | string |     Si      | Debe coincidir con `password`                                              |
| `rut`              | string |     Si      | RUT chileno (ej: `76.123.456-7` o `76123456-7`). Se valida módulo 11 + SII |
| `phone`            | string |     No      | Teléfono de contacto                                                       |

**Response exitoso:** `201 Created`

```json
{
  "refresh_token": "eyJ...",
  "access_token": "eyJ...",
  "company_id": 24539
}
```

**Errores posibles:**

| Código | error_code           | Descripción                                                |
| ------ | -------------------- | ---------------------------------------------------------- |
| 400    | —                    | Errores de validación (password débil, RUT inválido, etc.) |
| 400    | `RUT_ALREADY_EXISTS` | Ya existe una empresa registrada con este RUT              |

Ejemplo error validación RUT:

```json
{
  "rut": ["RUT no encontrado en el Servicio de Impuestos Internos."]
}
```

Ejemplo error RUT duplicado:

```json
{
  "error_code": "RUT_ALREADY_EXISTS",
  "error_message": "Ya existe una empresa registrada con este RUT."
}
```

---

### 2. Login

Autentica un usuario con email y contraseña.

```
POST /api/v1/collection/auth/login/
```

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "email": "usuario@empresa.cl",
  "password": "MiPassword123!"
}
```

| Campo      | Tipo   | Obligatorio |
| ---------- | ------ | :---------: |
| `email`    | string |     Si      |
| `password` | string |     Si      |

**Response exitoso:** `200 OK`

```json
{
  "refresh_token": "eyJ...",
  "access_token": "eyJ...",
  "company_id": 24539
}
```

> `company_id` es la primera empresa Chile del usuario. Usar el endpoint `me` para obtener la lista completa de empresas.

**Errores posibles:**

| Código | error_code                | Descripción                         |
| ------ | ------------------------- | ----------------------------------- |
| 404    | `USER_NOT_FOUND`          | El email no tiene cuenta asociada   |
| 400    | `PASSWORD_LOGIN_DISABLED` | Cuenta vinculada a Google/Microsoft |
| 400    | `INVALID_CREDENTIALS`     | Contraseña incorrecta               |

Ejemplo:

```json
{
  "error_code": "INVALID_CREDENTIALS",
  "error_message": "Credenciales inválidas. Por favor, verifica tu contraseña."
}
```

---

### 3. Me (perfil del usuario)

Retorna los datos del usuario autenticado junto con la lista de todas sus empresas en Chile.

```
GET /api/v1/collection/users/me/
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response exitoso:** `200 OK`

```json
{
  "id": 6769,
  "email": "usuario@empresa.cl",
  "name": "Juan",
  "lastname": "Pérez",
  "photo": null,
  "country": 2,
  "companies": [
    {
      "id": 23193,
      "ruc": "90635000-9",
      "company_name": "TELEFONICA CHILE S.A. EMPRESAS",
      "comercial_name": "TELEFONICA CHILE S.A. EMPRESAS",
      "comercial_email": "usuario@empresa.cl",
      "comercial_phone": "+56912345678",
      "photo": null,
      "company_user_id": 456,
      "has_sii_credentials": false,
      "whatsapp": {
        "connected": false,
        "phone": null
      }
    },
    {
      "id": 24539,
      "ruc": "76123456-7",
      "company_name": "MI EMPRESA SPA",
      "comercial_name": "MI EMPRESA SPA",
      "comercial_email": "usuario@empresa.cl",
      "comercial_phone": "+56912345678",
      "photo": null,
      "company_user_id": 789,
      "has_sii_credentials": true,
      "whatsapp": {
        "connected": true,
        "phone": "+56912345678"
      }
    }
  ]
}
```

**Campos del usuario:**

| Campo       | Tipo        | Descripción                         |
| ----------- | ----------- | ----------------------------------- |
| `id`        | int         | ID del usuario                      |
| `email`     | string      | Email del usuario                   |
| `name`      | string      | Nombre                              |
| `lastname`  | string      | Apellido                            |
| `photo`     | string/null | URL de la foto de perfil            |
| `country`   | int/null    | ID del país del usuario             |
| `companies` | array       | Lista de empresas Chile del usuario |

**Campos de cada empresa:**

| Campo                 | Tipo        | Descripción                                                    |
| --------------------- | ----------- | -------------------------------------------------------------- |
| `id`                  | int         | ID de la empresa (usar como `X-Company-Id` en otros endpoints) |
| `ruc`                 | string      | RUT de la empresa                                              |
| `company_name`        | string      | Razón social (obtenida del SII)                                |
| `comercial_name`      | string      | Nombre comercial                                               |
| `comercial_email`     | string      | Email comercial                                                |
| `comercial_phone`     | string      | Teléfono comercial                                             |
| `photo`               | string/null | Logo de la empresa                                             |
| `company_user_id`     | int         | ID de la relación usuario-empresa (RelationCompanyUser)        |
| `has_sii_credentials` | bool        | Si tiene credenciales del SII configuradas                     |
| `whatsapp.connected`  | bool        | Si la instancia WhatsApp está conectada                        |
| `whatsapp.phone`      | string/null | Número de WhatsApp conectado                                   |

**Errores posibles:**

| Código | Descripción                  |
| ------ | ---------------------------- |
| 401    | Token JWT inválido o ausente |

---

### 4. Credenciales SII — Estado

Retorna si la empresa tiene credenciales del SII configuradas y el RUT asociado.

```
GET /api/v1/collection/sii/status/
```

**Headers:**

```
Authorization: Bearer <access_token>
X-Company-Id: <id>
```

**Response exitoso:** `200 OK`

```json
{
  "has_credentials": true,
  "rut": "12.345.678-9"
}
```

Sin credenciales:

```json
{
  "has_credentials": false,
  "rut": null
}
```

| Campo             | Tipo        | Descripción                              |
| ----------------- | ----------- | ---------------------------------------- |
| `has_credentials` | bool        | Si tiene credenciales SII configuradas   |
| `rut`             | string/null | RUT del usuario SII (null si no existe)  |

**Errores posibles:**

| Código | Descripción                                        |
| ------ | -------------------------------------------------- |
| 401    | Token JWT inválido o ausente                       |
| 404    | `X-Company-Id` ausente o usuario sin acceso        |

---

### 5. Credenciales SII — Guardar

Guarda o actualiza las credenciales del SII para la empresa seleccionada. El RUT se almacena en texto y la contraseña se cifra con Fernet.

```
POST /api/v1/collection/sii/save/
```

**Headers:**

```
Authorization: Bearer <access_token>
X-Company-Id: <id>
Content-Type: application/json
```

**Body:**

```json
{
  "rut": "12.345.678-9",
  "password": "mi-clave-sii"
}
```

| Campo      | Tipo   | Obligatorio | Notas                                      |
| ---------- | ------ | :---------: | ------------------------------------------ |
| `rut`      | string |     Si      | RUT del usuario en el portal SII           |
| `password` | string |     Si      | Contraseña del portal SII (se cifra)       |

**Response exitoso:** `200 OK`

```json
{
  "message": "Credenciales SII guardadas correctamente."
}
```

**Errores posibles:**

| Código | Descripción                                        |
| ------ | -------------------------------------------------- |
| 400    | Errores de validación (campos faltantes)           |
| 401    | Token JWT inválido o ausente                       |
| 404    | `X-Company-Id` ausente o usuario sin acceso        |

---

### 6. Credenciales SII — Eliminar

Elimina las credenciales del SII de la empresa seleccionada.

```
DELETE /api/v1/collection/sii/delete/
```

**Headers:**

```
Authorization: Bearer <access_token>
X-Company-Id: <id>
```

**Response exitoso:** `200 OK`

```json
{
  "message": "Credenciales SII eliminadas correctamente."
}
```

**Errores posibles:**

| Código | error_code        | Descripción                                 |
| ------ | ----------------- | ------------------------------------------- |
| 400    | `NO_CREDENTIALS`  | No hay credenciales SII configuradas        |
| 401    | —                 | Token JWT inválido o ausente                |
| 404    | —                 | `X-Company-Id` ausente o usuario sin acceso |

Ejemplo error sin credenciales:

```json
{
  "error_code": "NO_CREDENTIALS",
  "error_message": "No hay credenciales SII configuradas."
}
```

---

## Paginación

Todos los endpoints de listado usan paginación con los siguientes query params:

| Parámetro | Tipo | Default | Descripción                          |
| --------- | ---- | ------- | ------------------------------------ |
| `page`    | int  | 1       | Número de página                     |
| `limit`   | int  | 20      | Registros por página (máximo 100)    |
| `search`  | str  | —       | Búsqueda por campos relevantes       |

**Estructura de respuesta paginada:**

```json
{
  "count": 150,
  "page": 1,
  "limit": 20,
  "total_pages": 8,
  "results": [...]
}
```

---

### 7. Lista de Clientes

Retorna los clientes de la empresa con montos y conteos de facturas.

```
GET /api/v1/collection/clients/
```

**Headers:**

```
Authorization: Bearer <access_token>
X-Company-Id: <id>
```

**Query params:** `page`, `limit`, `search`

**Búsqueda por:** `ruc`, `company_name`, `comercial_name`, `comercial_email`, `comercial_phone`

**Ejemplo:** `GET /api/v1/collection/clients/?page=1&limit=10&search=telefonica`

**Response exitoso:** `200 OK`

```json
{
  "count": 45,
  "page": 1,
  "limit": 10,
  "total_pages": 5,
  "results": [
    {
      "id": 1234,
      "ruc": "90635000-9",
      "company_name": "TELEFONICA CHILE S.A.",
      "comercial_name": "TELEFONICA CHILE",
      "comercial_email": "contacto@telefonica.cl",
      "comercial_phone": "+56221234567",
      "ammount_total": "15000000.00",
      "ammount_paid": "10000000.00",
      "ammount_expired": "3000000.00",
      "ammount_current": "2000000.00",
      "ammount_debt": "5000000.00",
      "count_total": 25,
      "count_paid": 15,
      "count_expired": 5,
      "count_current": 5,
      "count_debt": 10,
      "created": "2025-01-15T10:30:00Z"
    }
  ]
}
```

| Campo             | Tipo        | Descripción                   |
| ----------------- | ----------- | ----------------------------- |
| `id`              | int         | ID del cliente                |
| `ruc`             | string      | RUT del cliente               |
| `company_name`    | string/null | Razón social                  |
| `comercial_name`  | string/null | Nombre comercial              |
| `comercial_email` | string/null | Email comercial               |
| `comercial_phone` | string/null | Teléfono comercial            |
| `ammount_total`   | decimal/null | Monto total facturado        |
| `ammount_paid`    | decimal/null | Monto pagado                 |
| `ammount_expired` | decimal/null | Monto vencido                |
| `ammount_current` | decimal/null | Monto vigente                |
| `ammount_debt`    | decimal/null | Monto deuda                  |
| `count_total`     | int/null    | Total de facturas             |
| `count_paid`      | int/null    | Facturas pagadas              |
| `count_expired`   | int/null    | Facturas vencidas             |
| `count_current`   | int/null    | Facturas vigentes             |
| `count_debt`      | int/null    | Facturas en deuda             |
| `created`         | datetime    | Fecha de creación             |

---

### 8. Lista de Facturas

Retorna las facturas emitidas por la empresa.

```
GET /api/v1/collection/invoices/
```

**Headers:**

```
Authorization: Bearer <access_token>
X-Company-Id: <id>
```

**Query params:** `page`, `limit`, `search`

**Búsqueda por:** `invoice_number`, `serial_number`, `issuer_ruc`, `receiver_ruc`, `client_business_name`, `client_comercial_name`, `management_state_name`

**Ejemplo:** `GET /api/v1/collection/invoices/?page=1&limit=20&search=12345`

**Response exitoso:** `200 OK`

```json
{
  "count": 230,
  "page": 1,
  "limit": 20,
  "total_pages": 12,
  "results": [
    {
      "id": 5678,
      "invoice_number": "F-001-12345",
      "serial_number": "001",
      "issue_date": "2025-03-01",
      "due_date": "2025-04-01",
      "total_amount": "1190000.00",
      "net_amount": "1000000.00",
      "vat": "190000.00",
      "paid_amount": "0.00",
      "pending_balance": "1190000.00",
      "issuer_ruc": "76123456-7",
      "receiver_ruc": "90635000-9",
      "client_business_name": "TELEFONICA CHILE S.A.",
      "client_comercial_name": "TELEFONICA CHILE",
      "management_state_name": "Por gestionar",
      "type_document_name": "Factura Electrónica",
      "currency_code": "CLP",
      "currency_symbol": "$",
      "created": "2025-03-01T08:00:00Z"
    }
  ]
}
```

| Campo                   | Tipo        | Descripción                    |
| ----------------------- | ----------- | ------------------------------ |
| `id`                    | int         | ID de la factura               |
| `invoice_number`        | string/null | Número de factura              |
| `serial_number`         | string/null | Número de serie                |
| `issue_date`            | date/null   | Fecha de emisión               |
| `due_date`              | date/null   | Fecha de vencimiento           |
| `total_amount`          | decimal/null | Monto total                   |
| `net_amount`            | decimal/null | Monto neto                    |
| `vat`                   | decimal/null | IVA                           |
| `paid_amount`           | decimal/null | Monto pagado                  |
| `pending_balance`       | decimal/null | Saldo pendiente               |
| `issuer_ruc`            | string/null | RUT emisor                     |
| `receiver_ruc`          | string/null | RUT receptor (cliente)         |
| `client_business_name`  | string/null | Razón social del cliente       |
| `client_comercial_name` | string/null | Nombre comercial del cliente   |
| `management_state_name` | string/null | Estado de gestión              |
| `type_document_name`    | string/null | Tipo de documento              |
| `currency_code`         | string/null | Código de moneda (CLP, USD)    |
| `currency_symbol`       | string/null | Símbolo de moneda ($, US$)     |
| `created`               | datetime    | Fecha de creación              |

---

### 9. Lista de Pagos

Retorna los pagos registrados de la empresa.

```
GET /api/v1/collection/payments/
```

**Headers:**

```
Authorization: Bearer <access_token>
X-Company-Id: <id>
```

**Query params:** `page`, `limit`, `search`

**Búsqueda por:** `client.ruc`, `client.company_name`, `account_number`, `email`, `created_by_name`, `created_by_email`

**Ejemplo:** `GET /api/v1/collection/payments/?page=2&limit=15&search=telefonica`

**Response exitoso:** `200 OK`

```json
{
  "count": 89,
  "page": 2,
  "limit": 15,
  "total_pages": 6,
  "results": [
    {
      "id": 9012,
      "amount": "500000.00",
      "payment_date_estimated": "2025-03-15",
      "validated": true,
      "client_ruc": "90635000-9",
      "client_name": "TELEFONICA CHILE S.A.",
      "type_payment_name": "Transferencia",
      "account_number": "12345678",
      "email": "pagos@telefonica.cl",
      "created_by_name": "Juan Pérez",
      "created_by_email": "juan@miempresa.cl",
      "created": "2025-03-10T14:30:00Z"
    }
  ]
}
```

| Campo                  | Tipo        | Descripción                    |
| ---------------------- | ----------- | ------------------------------ |
| `id`                   | int         | ID del pago                    |
| `amount`               | decimal/null | Monto del pago                |
| `payment_date_estimated` | date/null | Fecha estimada de pago         |
| `validated`            | bool        | Si el pago está validado       |
| `client_ruc`           | string/null | RUT del cliente                |
| `client_name`          | string/null | Nombre del cliente             |
| `type_payment_name`    | string/null | Tipo de pago                   |
| `account_number`       | string/null | Número de cuenta               |
| `email`                | string/null | Email asociado al pago         |
| `created_by_name`      | string/null | Nombre de quien creó el pago   |
| `created_by_email`     | string/null | Email de quien creó el pago    |
| `created`              | datetime    | Fecha de creación              |

---

### 10. Lista de Contactos

Retorna los contactos asociados a los clientes de la empresa.

```
GET /api/v1/collection/contacts/
```

**Headers:**

```
Authorization: Bearer <access_token>
X-Company-Id: <id>
```

**Query params:** `page`, `limit`, `search`

**Búsqueda por:** `name`, `lastname`, `email`, `phone`, `ruc`, `position`, `area`, `client.company_name`

**Ejemplo:** `GET /api/v1/collection/contacts/?page=1&limit=20&search=pedro`

**Response exitoso:** `200 OK`

```json
{
  "count": 120,
  "page": 1,
  "limit": 20,
  "total_pages": 6,
  "results": [
    {
      "id": 3456,
      "name": "Pedro",
      "lastname": "González",
      "email": "pedro.gonzalez@telefonica.cl",
      "phone": "+56912345678",
      "ruc": "12345678-9",
      "position": "Jefe de Finanzas",
      "area": "Finanzas",
      "client_ruc": "90635000-9",
      "client_name": "TELEFONICA CHILE S.A.",
      "created": "2025-02-20T09:15:00Z"
    }
  ]
}
```

| Campo         | Tipo        | Descripción                    |
| ------------- | ----------- | ------------------------------ |
| `id`          | int         | ID del contacto                |
| `name`        | string/null | Nombre                         |
| `lastname`    | string/null | Apellido                       |
| `email`       | string/null | Email                          |
| `phone`       | string/null | Teléfono                       |
| `ruc`         | string/null | RUT del contacto               |
| `position`    | string/null | Cargo                          |
| `area`        | string/null | Área                           |
| `client_ruc`  | string/null | RUT del cliente asociado       |
| `client_name` | string/null | Nombre del cliente asociado    |
| `created`     | datetime    | Fecha de creación              |

**Errores posibles (aplica a los 4 listados):**

| Código | Descripción                                        |
| ------ | -------------------------------------------------- |
| 401    | Token JWT inválido o ausente                       |
| 404    | `X-Company-Id` ausente o usuario sin acceso        |

---

## Lista de Endpoints

| #  | Método   | URL                                    | ViewSet                    | Permiso                      |
| -- | -------- | -------------------------------------- | -------------------------- | ---------------------------- |
| 1  | `POST`   | `/collection/auth/register/`           | `CobranzaAuthViewSet`      | Público (`AllowAny`)         |
| 2  | `POST`   | `/collection/auth/login/`              | `CobranzaAuthViewSet`      | Público (`AllowAny`)         |
| 3  | `GET`    | `/collection/users/me/`                | `CollectionUserViewSet`    | `CollectionJWTBasePermission`|
| 4  | `GET`    | `/collection/sii/status/`              | `SiiCredentialsViewSet`    | `CollectionJWTPermission`    |
| 5  | `POST`   | `/collection/sii/save/`                | `SiiCredentialsViewSet`    | `CollectionJWTPermission`    |
| 6  | `DELETE` | `/collection/sii/delete/`              | `SiiCredentialsViewSet`    | `CollectionJWTPermission`    |
| 7  | `GET`    | `/collection/clients/`                 | `CollectionClientViewSet`  | `CollectionJWTPermission`    |
| 8  | `GET`    | `/collection/invoices/`                | `CollectionInvoiceViewSet` | `CollectionJWTPermission`    |
| 9  | `GET`    | `/collection/payments/`                | `CollectionPaymentViewSet` | `CollectionJWTPermission`    |
| 10 | `GET`    | `/collection/contacts/`                | `CollectionContactViewSet` | `CollectionJWTPermission`    |

> **Base URL:** `/api/v1/collection/`

---

## Router Registration

```python
# config/api_router.py — Collection (Mini Sena Cobranza)
router.register("collection/auth", CobranzaAuthViewSet, basename="collection-auth")
router.register("collection/users", CollectionUserViewSet, basename="collection-users")
router.register("collection/sii", SiiCredentialsViewSet, basename="collection-sii")
router.register("collection/clients", CollectionClientViewSet, basename="collection-clients")
router.register("collection/invoices", CollectionInvoiceViewSet, basename="collection-invoices")
router.register("collection/payments", CollectionPaymentViewSet, basename="collection-payments")
router.register("collection/contacts", CollectionContactViewSet, basename="collection-contacts")
```

---

## Flujo recomendado para el frontend

```
1. POST /collection/auth/register/     → Obtiene tokens + company_id
   POST /collection/auth/login/        → Obtiene tokens + company_id

2. GET  /collection/users/me/          → Lista de empresas del usuario
   (Authorization: Bearer <token>)      → El usuario selecciona una empresa

3. GET  /collection/sii/status/        → Verifica si tiene credenciales SII
   POST /collection/sii/save/          → Guarda credenciales SII
   DELETE /collection/sii/delete/      → Elimina credenciales SII
   (Authorization: Bearer <token>)
   (X-Company-Id: <id>)

4. GET  /collection/clients/           → Lista de clientes
   GET  /collection/invoices/          → Lista de facturas
   GET  /collection/payments/          → Lista de pagos
   GET  /collection/contacts/          → Lista de contactos
   (Authorization: Bearer <token>)
   (X-Company-Id: <id>)
   (?page=1&limit=20&search=...)
```