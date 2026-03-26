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

### 7. Sincronizar Facturas SII

Sincroniza facturas **emitidas** (ventas) desde el SII. Crea/actualiza clientes (deudores) y sus facturas automáticamente.

```
POST /api/v1/collection/sii/sync/
```

**Headers:**

```
Authorization: Bearer <access_token>
X-Company-Id: <id>
```

**Body (opcional):**

```json
{
  "days_before": 60
}
```

| Campo        | Tipo | Default | Notas                                    |
| ------------ | ---- | ------- | ---------------------------------------- |
| `days_before`| int  | 60      | Días hacia atrás para buscar facturas    |

**Response exitoso:** `200 OK`

```json
{
  "message": "Sincronización completada exitosamente.",
  "invoices_synced": 45,
  "clients_synced": 12,
  "invoices_not_iterated": 0
}
```

| Campo                   | Tipo | Descripción                                      |
| ----------------------- | ---- | ------------------------------------------------ |
| `invoices_synced`       | int  | Total de facturas creadas/actualizadas            |
| `clients_synced`        | int  | Total de clientes nuevos creados                  |
| `invoices_not_iterated` | int  | Facturas no procesadas por límite de API Gateway  |

**Flujo interno:**

1. Obtiene credenciales SII del `RelationCompanyUser`
2. Genera períodos fiscales (YYYYMM) para los últimos N días
3. Consulta el SII por facturas emitidas (RCV, BHE, BTE)
4. Para cada factura: extrae `receiver_ruc` → crea/actualiza `Client`
5. Crea/actualiza `Invoice` con montos, fechas y tipo de documento

**Errores posibles:**

| Código | error_code            | Descripción                              |
| ------ | --------------------- | ---------------------------------------- |
| 400    | `NO_SII_CREDENTIALS`  | No hay credenciales SII configuradas    |
| 400    | `SYNC_FAILED`         | Error durante la sincronización          |
| 401    | —                     | Token JWT inválido o ausente             |
| 404    | —                     | `X-Company-Id` ausente o sin acceso      |

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

### 11. WhatsApp — Crear Instancia

Crea una instancia de WhatsApp en Evolution API y retorna el código QR para vincular.

```
POST /api/v1/collection/whatsapp/create-instance/
```

**Headers:**

```
Authorization: Bearer <access_token>
X-Company-Id: <id>
```

**Response exitoso:** `200 OK`

```json
{
  "sessionId": "789",
  "status": "qr",
  "qr": "2@ABC123...",
  "dataURL": "data:image/png;base64,iVBOR..."
}
```

| Campo      | Tipo   | Descripción                              |
| ---------- | ------ | ---------------------------------------- |
| `sessionId`| string | ID de la sesión (= relation_company_user)|
| `status`   | string | Estado: `qr`                             |
| `qr`       | string | Código QR en texto (para librerías QR)   |
| `dataURL`  | string | QR como imagen base64 (para `<img src>`) |

**Errores posibles:**

| Código | error_code              | Descripción                    |
| ------ | ----------------------- | ------------------------------ |
| 400    | `WHATSAPP_CREATE_FAILED`| Error al crear la instancia    |
| 401    | —                       | Token JWT inválido o ausente   |
| 404    | —                       | `X-Company-Id` ausente o sin acceso |

---

### 12. WhatsApp — Estado

Retorna el estado actual de la instancia WhatsApp. Si está en estado `qr`, incluye el QR actualizado.

```
GET /api/v1/collection/whatsapp/status/
```

**Headers:**

```
Authorization: Bearer <access_token>
X-Company-Id: <id>
```

**Response exitoso:** `200 OK`

Sin instancia:

```json
{
  "connected": false,
  "status": "none",
  "phone": null
}
```

Esperando QR:

```json
{
  "connected": false,
  "status": "qr",
  "phone": null,
  "qr": {
    "sessionId": "789",
    "status": "qr",
    "qr": "2@ABC123...",
    "dataURL": "data:image/png;base64,iVBOR..."
  }
}
```

Conectado:

```json
{
  "connected": true,
  "status": "ready",
  "phone": "+56912345678",
  "session_id": "789",
  "data": {
    "event": "connection.update",
    "data": {
      "state": "open",
      "wuid": "56912345678@s.whatsapp.net"
    }
  }
}
```

| Campo        | Tipo        | Descripción                                    |
| ------------ | ----------- | ---------------------------------------------- |
| `connected`  | bool        | Si WhatsApp está conectado y listo              |
| `status`     | string      | `none`, `qr`, `ready`, `disconnected`          |
| `phone`      | string/null | Número de WhatsApp conectado                   |
| `session_id` | string/null | ID de la sesión (solo si `ready`)              |
| `data`       | object/null | Data completa del webhook (solo si `ready`)    |
| `qr`         | object/null | Datos del QR (solo si status=`qr`)             |

---

### 13. WhatsApp — Enviar Mensaje

Envía un mensaje de texto por WhatsApp. La instancia debe estar conectada (`ready`).

```
POST /api/v1/collection/whatsapp/send-message/
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
  "phone_number": "+56912345678",
  "message": "Hola, le recordamos que tiene una factura pendiente."
}
```

| Campo          | Tipo   | Obligatorio | Notas                           |
| -------------- | ------ | :---------: | ------------------------------- |
| `phone_number` | string |     Si      | Número con código de país       |
| `message`      | string |     Si      | Texto del mensaje               |

**Response exitoso:** `200 OK`

```json
{
  "key": {
    "remoteJid": "56912345678@s.whatsapp.net",
    "fromMe": true,
    "id": "BAE5F6A..."
  },
  "message": {
    "conversation": "Hola, le recordamos que tiene una factura pendiente."
  },
  "messageTimestamp": "1711234567",
  "status": "PENDING"
}
```

**Errores posibles:**

| Código | error_code                | Descripción                                   |
| ------ | ------------------------- | --------------------------------------------- |
| 400    | `MISSING_FIELDS`          | Faltan `phone_number` o `message`             |
| 400    | `WHATSAPP_NOT_CONNECTED`  | La instancia no está conectada                |
| 400    | `WHATSAPP_SEND_FAILED`    | Error al enviar el mensaje                    |
| 401    | —                         | Token JWT inválido o ausente                  |
| 404    | —                         | `X-Company-Id` ausente o sin acceso           |

---

### 14. WhatsApp — Eliminar Instancia

Elimina la instancia de WhatsApp y desvincula el número.

```
DELETE /api/v1/collection/whatsapp/delete-instance/
```

**Headers:**

```
Authorization: Bearer <access_token>
X-Company-Id: <id>
```

**Response exitoso:** `200 OK`

```json
{
  "status": "SUCCESS"
}
```

**Errores posibles:**

| Código | error_code                | Descripción                    |
| ------ | ------------------------- | ------------------------------ |
| 400    | `WHATSAPP_DELETE_FAILED`  | Error al eliminar la instancia |
| 401    | —                         | Token JWT inválido o ausente   |
| 404    | —                         | `X-Company-Id` ausente o sin acceso |

---

### 15. WhatsApp — Webhook (Evolution API)

Endpoint interno que recibe eventos de Evolution API. No lo consume el frontend directamente.

```
POST /api/v1/collection/whatsapp/webhook/?company_user_id=<id>
```

**Permiso:** Público (`AllowAny`)

**Eventos manejados:**

| Evento              | Acción                                                  |
| ------------------- | ------------------------------------------------------- |
| `qrcode.updated`    | Actualiza QR en DB + notifica por WebSocket             |
| `connection.update`  | Actualiza estado (ready/disconnected) + notifica WS    |

**Almacenamiento en `WhatsappCompanyUser`:**

Al recibir `connection.update` con `state=open`:
- `type` → `"ready"`
- `phone` → extraído de `wuid` (ej: `56912345678@s.whatsapp.net` → `+56912345678`), fallback a `phoneNumber`
- `data` → payload completo del webhook
- `session_id` → ID de la sesión (= `relation_company_user.id`)

**WebSocket channel:** `event_collection_whatsapp_{company_id}_{company_user_id}`

---

### 16. WhatsApp — Enviar por Criticidad (Plantilla Predefinida)

Envía un mensaje de WhatsApp de cobranza con plantilla predefinida según criticidad. El backend genera el texto automáticamente con formato WhatsApp (*negrita*, emojis).

```
POST /api/v1/collection/whatsapp/send-collection/
```

**Headers:**

```
Authorization: Bearer <access_token>
X-Company-Id: <company_id>
Content-Type: application/json
```

**Body:**

```json
{
  "criticality": "recordatorio",
  "client_id": 123,
  "invoice_ids": [456, 789],
  "contact_id": null,
  "phone_number": null,
  "dias_plazo": 5
}
```

| Campo                | Tipo     | Obligatorio | Notas                                                    |
| -------------------- | -------- | :---------: | -------------------------------------------------------- |
| `criticality`        | string   |     Si      | `recordatorio`, `por_vencer`, `en_mora`, `critico`       |
| `client_id`          | integer  |     Si      | ID del cliente (deudor)                                  |
| `invoice_ids`        | int[]    |     Si      | IDs de facturas a incluir en el mensaje                  |
| `contact_id`         | integer  |     No      | ID del contacto. Si no se envía, usa el primer contacto con teléfono |
| `phone_number`       | string   |     No      | Número destino. Si no se envía, usa contacto → cliente   |
| `dias_plazo`         | integer  |     No      | Días de plazo para criticidad `critico` (default: 5)     |

**Datos auto-resueltos por el backend:**
- Contacto adecuado (el más antiguo con teléfono)
- Nombre del contacto (contacto → nombre del cliente)
- Nombre de la empresa
- Teléfono de la empresa
- Tabla de facturas (Folio, Vencimiento, Monto)
- Monto total
- **Link al portal de pagos** (generado automáticamente con `generate_payment_portal_link`)

**Plantillas por criticidad (WhatsApp):**

| Criticidad    | Emoji | Estilo del mensaje                                               |
| ------------- | ----- | ---------------------------------------------------------------- |
| `recordatorio`| 👋    | Saludo amigable, facturas pendientes, "puedes contactarnos aquí" |
| `por_vencer`  | ⚠️    | Aviso vencimiento, "gestiona el pago a la brevedad"              |
| `en_mora`     | 🔴    | Facturas vencidas, "coordinar plan de pago", teléfono            |
| `critico`     | ⚠️    | ÚLTIMO AVISO, gestión de cobranza, DICOM, fecha límite           |

**Response exitoso:** `200 OK`

```json
{
  "message": "WhatsApp de cobranza enviado exitosamente.",
  "whatsapp_text": "Hola Carlos Vega 👋\n\nTienes *3 factura(s)...",
  "phone_number": "+56912345678",
  "criticality": "recordatorio",
  "invoices_count": 3,
  "payment_portal_url": "https://app.somossena.com/verify?token=abc-123&company_id=1&redirect_to=..."
}
```

**Errores:**

| Código | error_code                | Descripción                                                 |
| ------ | ------------------------- | ----------------------------------------------------------- |
| 400    | `WHATSAPP_NOT_CONNECTED`  | La instancia de WhatsApp no está conectada                  |
| 400    | `WHATSAPP_SEND_FAILED`    | Error al enviar el mensaje                                  |
| 400    | `NO_INVOICES`             | No se encontraron facturas válidas                          |
| 400    | `NO_PHONE`                | No se encontró teléfono de destino                          |
| 404    | `CLIENT_NOT_FOUND`        | Cliente no encontrado o no pertenece a la empresa           |

---

### 17. SMS — Enviar por Criticidad (Plantilla Predefinida)

Envía un SMS de cobranza con plantilla predefinida según criticidad. El backend genera el texto automáticamente.

```
POST /api/v1/collection/sms/send-collection/
```

**Headers:**

```
Authorization: Bearer <token>
X-Company-Id: <id>
Content-Type: application/json
```

**Body:**

```json
{
  "criticality": "recordatorio",
  "client_id": 123,
  "invoice_ids": [1001, 1002, 1003],
  "contact_id": 456,
  "phone_number": "+56912345678",
  "country": "chile",
  "dias_plazo": 5
}
```

| Campo                | Tipo   | Obligatorio | Notas                                                             |
| -------------------- | ------ | :---------: | ----------------------------------------------------------------- |
| `criticality`        | string |     Si      | `recordatorio`, `por_vencer`, `en_mora`, `critico`                |
| `client_id`          | int    |     Si      | ID del cliente (deudor)                                           |
| `invoice_ids`        | array  |     Si      | Lista de IDs de facturas (para calcular monto total)              |
| `country`            | string |     Si      | `"chile"` o `"peru"`                                              |
| `contact_id`         | int    |     No      | ID del contacto. Si no se envía, usa el primer contacto con teléfono |
| `phone_number`       | string |     No      | Número destino. Si no se envía, usa el del contacto o cliente     |
| `dias_plazo`         | int    |     No      | Días de plazo (para `critico`, default: 5)                        |

**Datos auto-resueltos por el backend:**
- Contacto adecuado (el más antiguo con teléfono)
- **Link al portal de pagos** (generado automáticamente con `generate_payment_portal_link`)

**Plantillas SMS por criticidad:**

| Criticidad     | Mensaje generado                                                                                    |
| -------------- | --------------------------------------------------------------------------------------------------- |
| `recordatorio` | `{empresa}: Tiene 3 factura(s) pendiente(s) por $2.810.000. Consultas: (+56) 2 2345 6789`           |
| `por_vencer`   | `{empresa}: Tiene 3 factura(s) por $2.810.000 próximas a vencer. Evite recargos: (+56) 2 2345 6789` |
| `en_mora`      | `{empresa}: Tiene 3 factura(s) vencida(s) por $2.810.000. Regularice: (+56) 2 2345 6789`            |
| `critico`      | `URGENTE {empresa}: Deuda $2.810.000 (3 factura(s)) en proceso de cobranza legal. Contacte (+56) 2 2345 6789 antes del 30/03/2026.` |

El link al portal de pagos se genera automáticamente y se agrega como `\nPagar: {url}` al final.

**Proveedores por país:**

| País  | Proveedores (fallback)                                |
| ----- | ----------------------------------------------------- |
| Chile | Celmedia → AlteraGSM → LabsMobile → Infobip          |
| Perú  | Contactahabilidad → Infobip → LabsMobile              |

**Response exitoso:** `200 OK`

```json
{
  "message": "SMS de cobranza enviado exitosamente.",
  "sms_text": "Servicios Alfa SpA: Tiene 3 factura(s) pendiente(s) por $2.810.000...",
  "phone_number": "+56912345678",
  "criticality": "recordatorio",
  "invoices_count": 3,
  "payment_portal_url": "https://app.somossena.com/verify?token=abc-123&...",
  "success": true,
  "provider": "celmedia"
}
```

**Errores posibles:**

| Código | error_code          | Descripción                                         |
| ------ | ------------------- | --------------------------------------------------- |
| 400    | `SMS_SEND_FAILED`   | Todos los proveedores fallaron                      |
| 400    | `NO_INVOICES`       | No se encontraron facturas válidas                  |
| 400    | `NO_PHONE`          | No se encontró teléfono de destino                  |
| 404    | `CLIENT_NOT_FOUND`  | Cliente no encontrado o no pertenece a la empresa   |

---

### 18. SMS — Enviar Libre

Envía un SMS con texto libre (para casos personalizados).

```
POST /api/v1/collection/sms/send/
```

**Headers:**

```
Authorization: Bearer <token>
X-Company-Id: <id>
Content-Type: application/json
```

**Body:**

```json
{
  "phone_number": "+56912345678",
  "message": "Texto libre del SMS.",
  "country": "chile",
  "client_id": 123,
  "contact_id": 456
}
```

| Campo          | Tipo   | Obligatorio | Notas                                          |
| -------------- | ------ | :---------: | ---------------------------------------------- |
| `phone_number` | string |     Si      | Número con código de país (ej: `+56912345678`) |
| `message`      | string |     Si      | Texto del SMS                                  |
| `country`      | string |     Si      | `"chile"` o `"peru"`                           |
| `client_id`    | int    |     No      | ID del cliente (para logging)                  |
| `contact_id`   | int    |     No      | ID del contacto (para logging)                 |

**Response exitoso:** `200 OK`

```json
{
  "success": true,
  "provider": "celmedia",
  "message": "SMS enviado con éxito",
  "response": { ... }
}
```

---

### 19. Email — Enviar por Criticidad (Plantilla Predefinida)

Envía un correo de cobranza usando plantillas predefinidas según el nivel de criticidad. El backend construye el HTML completo: solo necesita `criticality`, `client_id` e `invoice_ids`.

```
POST /api/v1/collection/email/send-collection/
```

**Headers:**

```
Authorization: Bearer <token>
X-Company-Id: <id>
Content-Type: application/json
```

**Body:**

```json
{
  "criticality": "recordatorio",
  "client_id": 123,
  "invoice_ids": [1001, 1002, 1003],
  "contact_id": 456,
  "to_email": "carlos.vega@empresa.cl",
  "banco": "Banco Estado",
  "cuenta": "12345678",
  "dias_plazo": 5
}
```

| Campo                | Tipo   | Obligatorio | Notas                                                             |
| -------------------- | ------ | :---------: | ----------------------------------------------------------------- |
| `criticality`        | string |     Si      | `recordatorio`, `por_vencer`, `en_mora`, `critico`                |
| `client_id`          | int    |     Si      | ID del cliente (deudor)                                           |
| `invoice_ids`        | array  |     Si      | Lista de IDs de facturas a incluir                                |
| `contact_id`         | int    |     No      | ID del contacto. Si no se envía, usa el primer contacto con email |
| `to_email`           | string |     No      | Email destino. Si no se envía, usa email del contacto o cliente   |
| `banco`              | string |     No      | Nombre del banco (para `por_vencer`)                              |
| `cuenta`             | string |     No      | Número de cuenta bancaria (para `por_vencer`)                     |
| `dias_plazo`         | int    |     No      | Días de plazo (para `critico`, default: 5)                        |

**Niveles de criticidad y plantillas:**

| Criticidad     | Asunto generado                                              | Contenido                                      |
| -------------- | ------------------------------------------------------------ | ----------------------------------------------- |
| `recordatorio` | Recordatorio de facturas pendientes — {empresa}              | Tono amigable, tabla de facturas                |
| `por_vencer`   | {n} factura(s) próximas a vencer — Acción requerida          | Datos bancarios, urgencia moderada              |
| `en_mora`      | URGENTE: {n} factura(s) con mora — {monto}                   | Historial comercial, contacto directo           |
| `critico`      | Último aviso — Deuda de {monto} en proceso de gestión legal  | DICOM/Equifax, gestión judicial, plazo límite   |

**Datos que el backend resuelve automáticamente:**
- Contacto adecuado (el más antiguo con email)
- Nombre del contacto/deudor (desde `contact_id` o primer contacto del cliente)
- Nombre, email, teléfono, RUT de la empresa emisora (desde `company`)
- Tabla HTML con facturas (folio, vencimiento, días mora, monto)
- Monto total calculado
- Email destino (contacto → cliente → `to_email` override)
- **Link al portal de pagos** (generado automáticamente con `generate_payment_portal_link`, usado en botón "Ir al Portal de Pagos")

**Response exitoso:** `200 OK`

```json
{
  "message": "Correo de cobranza enviado exitosamente.",
  "subject": "Recordatorio de facturas pendientes — Servicios Alfa SpA",
  "to_email": "carlos.vega@empresa.cl",
  "criticality": "recordatorio",
  "invoices_count": 3,
  "payment_portal_url": "https://app.somossena.com/verify?token=abc-123&...",
  "details": { "message": "Email sent successfully" }
}
```

**Errores posibles:**

| Código | error_code          | Descripción                                         |
| ------ | ------------------- | --------------------------------------------------- |
| 400    | `EMAIL_SEND_FAILED` | Error al enviar el correo vía SendGrid             |
| 400    | `NO_INVOICES`       | No se encontraron facturas válidas                  |
| 400    | `NO_EMAIL`          | No se encontró email destino                        |
| 404    | `CLIENT_NOT_FOUND`  | Cliente no encontrado o no pertenece a la empresa   |

---

### 20. Email — Enviar Libre

Envía un correo electrónico con HTML personalizado (para casos que no encajan en las plantillas predefinidas).

```
POST /api/v1/collection/email/send/
```

**Headers:**

```
Authorization: Bearer <token>
X-Company-Id: <id>
Content-Type: application/json
```

**Body:**

```json
{
  "to_email": "carlos.vega@empresa.cl",
  "to_name": "Carlos Vega",
  "subject": "Asunto personalizado",
  "html_body": "<html>...contenido...</html>",
  "contact_id": 456
}
```

| Campo        | Tipo   | Obligatorio | Notas                              |
| ------------ | ------ | :---------: | ---------------------------------- |
| `to_email`   | string |     Si      | Email del destinatario             |
| `to_name`    | string |     Si      | Nombre del destinatario            |
| `subject`    | string |     Si      | Asunto del correo                  |
| `html_body`  | string |     Si      | HTML completo del correo           |
| `client_id`  | int    |     No      | ID del cliente (para logging)      |
| `contact_id` | int    |     No      | ID del contacto (para logging)     |

**Response exitoso:** `200 OK`

```json
{
  "message": "Correo enviado exitosamente.",
  "details": { "message": "Email sent successfully" }
}
```

---

### 21. Corridas del Bot — Crear

Crea una nueva corrida del bot de cobranza con `status=running`. N8N llama este endpoint al inicio de la ejecución.

```
POST /api/v1/collection/runs/
```

**Headers:**

```
Authorization: Bearer <token>
X-Company-Id: <id>
Content-Type: application/json
```

**Body:**

```json
{
  "triggered_by": "manual",
  "n8n_execution_id": "abc123"
}
```

| Campo              | Tipo   | Obligatorio | Notas                                    |
| ------------------ | ------ | :---------: | ---------------------------------------- |
| `triggered_by`     | string |     No      | `manual` (default) o `scheduled`         |
| `n8n_execution_id` | string |     No      | ID de ejecución de N8N                   |

**Response exitoso:** `201 Created`

```json
{
  "id": 1,
  "uuid": "a1b2c3d4-...",
  "status": "running",
  "started_at": "2026-03-26T12:00:00Z"
}
```

---

### 22. Corridas del Bot — Listar

Lista las corridas del bot de cobranza de la empresa, paginado.

```
GET /api/v1/collection/runs/
```

**Headers:**

```
Authorization: Bearer <token>
X-Company-Id: <id>
```

**Query params:**

| Param  | Tipo | Obligatorio | Notas                          |
| ------ | ---- | :---------: | ------------------------------ |
| `page` | int  |     No      | Página (default: 1, size: 20)  |

**Response exitoso:** `200 OK`

```json
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "uuid": "a1b2c3d4-...",
      "status": "completed",
      "started_at": "2026-03-26T12:00:00Z",
      "finished_at": "2026-03-26T12:05:30Z",
      "n8n_execution_id": "abc123",
      "debtors_processed": 15,
      "messages_email": 10,
      "messages_whatsapp": 3,
      "messages_sms": 2,
      "triggered_by": "manual",
      "error_message": null,
      "created": "2026-03-26T12:00:00Z"
    }
  ]
}
```

| Campo               | Tipo     | Notas                                        |
| -------------------- | -------- | -------------------------------------------- |
| `id`                 | int      | ID de la corrida                             |
| `uuid`               | string   | UUID único                                   |
| `status`             | string   | `running`, `completed` o `failed`            |
| `started_at`         | datetime | Inicio de la corrida                         |
| `finished_at`        | datetime | Fin de la corrida (null si aún en ejecución) |
| `n8n_execution_id`   | string   | ID de ejecución N8N (puede ser null)         |
| `debtors_processed`  | int      | Cantidad de deudores procesados              |
| `messages_email`     | int      | Emails enviados                              |
| `messages_whatsapp`  | int      | WhatsApps enviados                           |
| `messages_sms`       | int      | SMS enviados                                 |
| `triggered_by`       | string   | `manual` o `scheduled`                       |
| `error_message`      | string   | Mensaje de error (null si exitoso)           |
| `created`            | datetime | Fecha de creación del registro               |

---

### 23. Corridas del Bot — Actualizar

Actualiza una corrida existente. N8N llama este endpoint al finalizar la ejecución para marcar `status=completed` y actualizar contadores.

```
PATCH /api/v1/collection/runs/{id}/
```

**Headers:**

```
Authorization: Bearer <token>
X-Company-Id: <id>
Content-Type: application/json
```

**Body:**

```json
{
  "status": "completed",
  "debtors_processed": 15,
  "messages_email": 10,
  "messages_whatsapp": 3,
  "messages_sms": 2
}
```

| Campo               | Tipo     | Obligatorio | Notas                                              |
| -------------------- | -------- | :---------: | -------------------------------------------------- |
| `status`             | string   |     No      | `running`, `completed` o `failed`                  |
| `finished_at`        | datetime |     No      | Se auto-asigna si status es `completed` o `failed` |
| `n8n_execution_id`   | string   |     No      | ID de ejecución de N8N                             |
| `debtors_processed`  | int      |     No      | Cantidad de deudores procesados                    |
| `messages_email`     | int      |     No      | Emails enviados                                    |
| `messages_whatsapp`  | int      |     No      | WhatsApps enviados                                 |
| `messages_sms`       | int      |     No      | SMS enviados                                       |
| `error_message`      | string   |     No      | Mensaje de error                                   |

**Response exitoso:** `200 OK` (retorna el objeto completo de la corrida con los mismos campos del listado)

**Errores posibles:**

| Código | error_code      | Descripción              |
| ------ | --------------- | ------------------------ |
| 404    | `RUN_NOT_FOUND` | Corrida no encontrada    |

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
| 7  | `POST`   | `/collection/sii/sync/`                | `SiiCredentialsViewSet`    | `CollectionJWTPermission`    |
| 8  | `GET`    | `/collection/clients/`                 | `CollectionClientViewSet`  | `CollectionJWTPermission`    |
| 9  | `GET`    | `/collection/invoices/`                | `CollectionInvoiceViewSet` | `CollectionJWTPermission`    |
| 10 | `GET`    | `/collection/payments/`                | `CollectionPaymentViewSet` | `CollectionJWTPermission`    |
| 11 | `GET`    | `/collection/contacts/`                | `CollectionContactViewSet`   | `CollectionJWTPermission`    |
| 12 | `POST`   | `/collection/whatsapp/create-instance/`| `CollectionWhatsAppViewSet`  | `CollectionJWTPermission`    |
| 13 | `GET`    | `/collection/whatsapp/status/`         | `CollectionWhatsAppViewSet`  | `CollectionJWTPermission`    |
| 14 | `POST`   | `/collection/whatsapp/send-message/`   | `CollectionWhatsAppViewSet`  | `CollectionJWTPermission`    |
| 15 | `DELETE` | `/collection/whatsapp/delete-instance/`| `CollectionWhatsAppViewSet`  | `CollectionJWTPermission`    |
| 16 | `POST`   | `/collection/whatsapp/send-collection/`| `CollectionWhatsAppViewSet`  | `CollectionJWTPermission`    |
| 17 | `POST`   | `/collection/whatsapp/webhook/`        | `CollectionWhatsAppViewSet`  | Público (`AllowAny`)         |
| 18 | `POST`   | `/collection/sms/send-collection/`     | `CollectionSMSViewSet`       | `CollectionJWTPermission`    |
| 19 | `POST`   | `/collection/sms/send/`                | `CollectionSMSViewSet`       | `CollectionJWTPermission`    |
| 20 | `POST`   | `/collection/email/send-collection/`   | `CollectionEmailViewSet`     | `CollectionJWTPermission`    |
| 21 | `POST`   | `/collection/email/send/`              | `CollectionEmailViewSet`     | `CollectionJWTPermission`    |
| 22 | `POST`   | `/collection/runs/`                    | `CollectionRunViewSet`       | `CollectionJWTPermission`    |
| 23 | `GET`    | `/collection/runs/`                    | `CollectionRunViewSet`       | `CollectionJWTPermission`    |
| 24 | `PATCH`  | `/collection/runs/{id}/`               | `CollectionRunViewSet`       | `CollectionJWTPermission`    |

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
router.register("collection/whatsapp", CollectionWhatsAppViewSet, basename="collection-whatsapp")
router.register("collection/sms", CollectionSMSViewSet, basename="collection-sms")
router.register("collection/email", CollectionEmailViewSet, basename="collection-email")
router.register("collection/runs", CollectionRunViewSet, basename="collection-runs")
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

4. POST /collection/sii/sync/          → Sincroniza facturas emitidas + crea clientes
   (Authorization: Bearer <token>)
   (X-Company-Id: <id>)

5. POST /collection/whatsapp/create-instance/ → Crea instancia + QR
   GET  /collection/whatsapp/status/          → Polling hasta connected=true
   (Authorization: Bearer <token>)
   (X-Company-Id: <id>)
   → WebSocket: event_collection_whatsapp_{company_id}_{cu_id}

6. GET  /collection/clients/           → Lista de clientes
   GET  /collection/invoices/          → Lista de facturas
   GET  /collection/payments/          → Lista de pagos
   GET  /collection/contacts/          → Lista de contactos
   (Authorization: Bearer <token>)
   (X-Company-Id: <id>)
   (?page=1&limit=20&search=...)

7. POST /collection/sms/send-collection/       → Enviar SMS por criticidad (plantilla)
   POST /collection/email/send-collection/    → Enviar email por criticidad (plantilla)
   POST /collection/whatsapp/send-message/    → Enviar mensaje WhatsApp
   POST /collection/sms/send/                 → Enviar SMS libre
   POST /collection/email/send/               → Enviar email libre
   (Authorization: Bearer <token>)
   (X-Company-Id: <id>)
```