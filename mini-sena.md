# Contexto Clave

El agente de cobranza **vive dentro del aplicativo Sena**. El usuario ya tiene cuenta, ya pertenece a una empresa, ya tiene sus datos (RUT, nombre, etc.). No hay que "identificar al cliente" ni crear nada — **ya existe**.

Aplica **solo para empresas chilenas con Servicio de Impuestos Internos (SII)**.

---

## Flujo Completo

### Fase 1 — Configuración Inicial (Manual en Sena)

El usuario ya está logueado en Sena y pertenece a una empresa. La plataforma ya conoce sus datos.

Lo que necesita hacer:

1. **Ingresar RUT SII + Clave SII** — Credenciales del Servicio de Impuestos Internos para poder extraer facturas
2. **Seleccionar ERP** (Defontana, etc.) si aplica

Con esto, Sena puede conectarse al SII y extraer las facturas emitidas/vencidas.

### Fase 2 — Importación de Facturas (Automático vía N8N)

Una vez configuradas las credenciales SII:

- N8N consulta al SII / ERP y obtiene las facturas
- Filtra las **facturas vencidas**
- Calcula los **días de mora**
- Guarda la data en la DB de Sena

### Fase 3 — Carga de Contactos de Deudores (Manual en Sena)

Aquí hay un paso que **no es automático**: los deudores (clientes de la empresa) necesitan datos de contacto para poder ser gestionados.

El usuario debe subir la información mínima de cada deudor:

- **Nombre**
- **Email** y/o **Celular**

Sin al menos un canal de contacto (email o teléfono), el bot no puede gestionar a ese deudor. Esta carga se hace desde Sena (upload manual, CSV, o como se defina).

### Fase 4 — Motor de Score de Riesgo (Automático vía N8N)

Para cada deudor con facturas vencidas Y contacto, N8N calcula un score 0-100:

| Señal | Peso | Qué mide |
| --- | --- | --- |
| Días de mora | 35% | Cuánto tiempo lleva sin pagar |
| Tasa de respuesta | 25% | Si responde o ignora los mensajes |
| Promesas incumplidas | 25% | Si prometió pagar y no cumplió |
| Historial de pago | 15% | Proporción deuda vs. total facturado |

**Clasificación:**

- **Verde (0-29):** Recordatorio amable
- **Amarillo (30-54):** Cobranza activa
- **Naranja (55-74):** Cobranza intensiva
- **Rojo (75-100):** Escalamiento a recuperación

### Fase 5 — Generación de Mensaje + Selección de Canal (Automático vía N8N)

- **Claude (IA)** genera un mensaje personalizado según el nivel de riesgo y el contexto del deudor
- Se elige el canal según el nivel:

| Nivel | Canales |
| --- | --- |
| Verde | Email |
| Amarillo | Email + WhatsApp |
| Naranja | Email + WhatsApp + SMS |
| Rojo | Todos + Escalamiento |

### Fase 6 — Envío con Portal de Pago (Automático vía N8N)

Aquí entra el diferenciador de Sena: **no solo se envía un mensaje de cobranza, se envía un link al Portal de Pago**.

El flujo es similar al envío de estado de deuda que ya existe en la plataforma:

1. Se seleccionan las facturas vencidas del deudor
2. Se genera el **link al Portal de Pago** con esas facturas
3. El mensaje (email / WhatsApp / SMS) incluye el link
4. El deudor recibe el mensaje, hace clic, ve su deuda y **puede pagar directamente**

### Fase 7 — Seguimiento y Conciliación (Mixto: Sena + N8N)

Una vez enviado el mensaje con el portal de pago:

- **Si el deudor paga** a través del portal -> Sena detecta el pago (ya lo escucha internamente) -> Se concilia automáticamente la factura
- **Si el deudor responde** (WhatsApp, email) -> Se registra la respuesta -> Si hace promesa de pago, se registra
- **Si el deudor no responde / no paga** -> Se actualiza el score -> En la próxima ejecución el nivel sube y la estrategia se intensifica
- **Si una promesa se incumple** -> Se registra -> Impacta el score en la siguiente evaluación

### Fase 8 — Escalamiento (Score >= 75, Rojo)

Cuando el score llega a rojo:

1. Claude genera un **informe ejecutivo** del comportamiento del deudor
2. Se **suspende el crédito** en la plataforma
3. Se **notifica al equipo de recuperación (Recsa)** con el informe
4. Intervención humana desde este punto

---

## Cómo Trabajan Juntos: Sena (Plataforma) + N8N

| Responsable | Qué hace |
| --- | --- |
| **Sena (Plataforma)** | Login/cuenta, configuración SII, carga de contactos, Portal de Pago, detección de pagos, visualización de gestiones, suspensión de crédito |
| **N8N (Orquestador)** | Extrae facturas del SII, calcula score, decide estrategia, genera mensajes con IA, envía por los canales (email/WA/SMS), registra gestiones, ejecuta escalamientos |
| **Claude (IA)** | Genera mensajes personalizados de cobranza y reportes de escalamiento |
| **Portal de Pago** | El deudor paga directamente desde el link que recibe — Sena escucha el evento de pago y concilia |

---

## Requisitos Previos

1. Empresa chilena con acceso al SII
2. Credenciales SII configuradas en Sena
3. Contactos de deudores cargados (mínimo: nombre + email o celular)
4. Integraciones activas: SendGrid (email), Evolution API (WhatsApp), proveedor SMS