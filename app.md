# Sena - Web App

Plataforma de gestión de cobranzas y cuentas por pagar. Permite a empresas administrar sus cuentas por cobrar, clientes, documentos, pagos y comunicaciones con deudores.

---

## Tabla de contenidos

- [Patrones Transversales](#patrones-transversales)
  - [CRM - Canales de comunicación](#crm---canales-de-comunicación)
  - [Notas](#notas)
  - [Campos Personalizables](#campos-personalizables)
- [1. Dashboard](#1-dashboard)
  - [1.1 KPIs principales](#11-kpis-principales)
  - [1.2 Secciones del Dashboard](#12-secciones-del-dashboard)
- [2. Por Cobrar](#2-por-cobrar)
  - [2.1 Clientes](#21-clientes)
  - [2.2 Documentos emitidos](#22-documentos-emitidos)
  - [2.3 Campañas](#23-campañas)
  - [2.4 Contactos](#24-contactos)
  - [2.5 Compromisos de pago](#25-compromisos-de-pago)
  - [2.6 Pagos recibidos](#26-pagos-recibidos)
- [3. Por Pagar](#3-por-pagar)
  - [3.1 Proveedores](#31-proveedores)
  - [3.2 Documentos recibidos](#32-documentos-recibidos)
  - [3.3 Aprobaciones](#33-aprobaciones)
  - [3.4 Contactos](#34-contactos)
  - [3.5 Compromisos de pago](#35-compromisos-de-pago)
  - [3.6 Pagos realizados](#36-pagos-realizados)
  - [3.7 Nóminas](#37-nóminas)
  - [3.8 Anticipos](#38-anticipos)
- [4. Herramientas](#4-herramientas)
  - [4.1 CRM (módulo dedicado)](#41-crm-módulo-dedicado)
  - [4.2 Flujos](#42-flujos)
  - [4.3 Importaciones y Exportaciones](#43-importaciones-y-exportaciones)
  - [4.4 Portal de Pagos](#44-portal-de-pagos)
  - [4.5 Conciliaciones](#45-conciliaciones)
  - [4.6 Gestión de Tareas](#46-gestión-de-tareas)
  - [4.7 Registros de Integración (pendiente de detalle)](#47-registros-de-integración-pendiente-de-detalle)
  - [4.8 Plantillas](#48-plantillas)
- [5. Configuración](#5-configuración)
  - [5.1 Mi Perfil](#51-mi-perfil)
  - [5.2 Mi Empresa](#52-mi-empresa)
  - [5.3 Suscripción](#53-suscripción)
  - [5.4 Gestión de Usuarios](#54-gestión-de-usuarios)
  - [5.5 Propiedades Personalizables](#55-propiedades-personalizables)
  - [5.6 Integraciones](#56-integraciones)
  - [5.7 Segmentos](#57-segmentos)
- [Notas generales](#notas-generales)

---

## Patrones Transversales

Todas las entidades principales de Sena (Clientes, Proveedores, Documentos, Contactos, Pagos, Compromisos de pago, Conciliaciones, Anticipos, Nóminas, etc.) comparten un patrón de comunicación y registro que se describe a continuación. Este patrón aplica tanto en el módulo Por Cobrar como en Por Pagar.

### CRM - Canales de comunicación

Permiten comunicarse directamente con los contactos del cliente o proveedor. La comunicación siempre se dirige a los contactos asociados a la entidad (relación en cascada: entidad → cliente/proveedor → contactos).

| Canal | Descripción |
|-------|-------------|
| SenaChat | Chat interno de la plataforma |
| Email | Envío de correos electrónicos |
| SMS | Mensajes de texto |
| Llamada | Llamadas telefónicas |
| WhatsApp | Mensajería por WhatsApp |

### Notas

Sistema de anotaciones internas para los usuarios de la plataforma. Cada entidad tiene su propio panel de notas donde los usuarios pueden dejar apuntes, observaciones o cualquier información relevante sobre el caso. Funciona como un bloc de notas colaborativo por entidad.

- Tabs: Historial (muestra notas y cambios del sistema), Documentos (archivos adjuntos)
- Campo de texto con opción de adjuntar archivos
- El historial registra automáticamente cambios del sistema (cambios de estado, campos, etc.) con fecha, hora y usuario responsable

### Campos Personalizables

Campos no estándar definidos por cada empresa en la configuración de empresa (Configuración → Propiedades Personalizables). Cada empresa puede insertar sus propios campos custom en las entidades soportadas. Los campos personalizables aparecen en la sección "Campos personalizables" o "Personalizables" del detalle de cada entidad, y cuentan con un botón "Nuevo campo" para agregar campos directamente desde el detalle.

Las entidades que soportan campos personalizables incluyen: Clientes, Proveedores, Documentos emitidos, Documentos recibidos, Pagos recibidos, Pagos realizados, Conciliaciones de clientes, Conciliaciones de proveedores, y Contactos.

Para más detalle sobre la gestión centralizada, ver sección [5.5 Propiedades Personalizables](#55-propiedades-personalizables).

---

## 1. Dashboard

Panel general con resumen de la información más relevante del negocio. Se divide en dos vistas principales mediante tabs:

- **Cuentas por cobrar**
- **Cuentas por pagar**

### 1.1 KPIs principales (Cuentas por cobrar)

| KPI | Descripción |
|-----|-------------|
| Cuentas por cobrar | Monto total pendiente (S/ y USD) |
| Ventas periodo | Monto total de ventas del periodo |
| DSO (Days Sales Outstanding) | Días promedio de cobro, con comparativa vs. mes anterior |

### 1.2 Secciones del Dashboard

- **Recupero en los últimos periodos**: Tasa de recupero sobre el total vencido. Gráfico de barras con buckets de antigüedad: Por vencer, 0-30, 31-60, 61-90, 91-120, +120 días. Muestra "Por vencer" vs "Total vencido".
- **Top 10 clientes morosos**: Lista de los 10 clientes con mayor deuda. Muestra: nombre, deuda (S/ y USD), cantidad de documentos. Selector para cambiar cantidad de clientes.
- **Total ventas por cobrar**: Barra de progreso con distribución porcentual:
  - Vencido
  - No vencido
  - Pagado
  - Archivado
- **Documentos emitidos por mes**: Gráfico de barras mensual. Categorías: Pagados, Por Vencer, Vencidos.
- **Facturación y pagos mensuales**: Gráfico de barras mensual. Categorías: Recibidos, Pagados.
- **Gestiones por usuario**: Tabla con actividad por usuario de la plataforma. Columnas: Usuario, Rol, Notas creadas, Llamadas realizadas, Emails enviados, SMS enviados, Comp. pago creados, Comp. pago aprobados, Conciliaciones creadas, Conciliaciones aprobadas, Conciliaciones autorizadas. Incluye filtros, ordenamiento, búsqueda y paginación.

---

## 2. Por Cobrar

Módulo principal de gestión de cobranza. Contiene las siguientes sub-secciones:

- **Clientes**
- **Documentos emitidos**
- **Campañas**
- **Contactos**
- **Compromisos de pago**
- **Pagos recibidos**

---

### 2.1 Clientes

Entidad central del módulo de cobranza. Representa a las empresas/personas a las que se les cobra.

#### Creación de clientes

Los clientes se pueden crear de tres formas:

1. **Individualmente**: Modal con campos:
   - RUC/RUT de la empresa (obligatorio)
   - Notas (opcional)
2. **Carga masiva**: Importación de múltiples clientes a la vez.
3. **Automáticamente al importar facturas**: Las facturas traen identificador tributario (RUC/RUT) y razón social, campos suficientes para crear un cliente de forma automática.

**Validación de identificador tributario al crear cliente manualmente:**

| País | Identificador | Validación |
|------|---------------|------------|
| Perú | RUC | Se consulta una API externa para validar que el RUC existe y obtener la razón social |
| Chile | RUT | Se consulta una API interna de servicio (a través de API Gateway) para validar que el RUT existe y obtener la razón social |

**Fallback**: Si las APIs externas fallan (por límites de uso, caídas, etc.), el sistema cuenta con **tablas de respaldo en base de datos** que almacenan RUCs/RUTs previamente cargados junto con su razón social. Estas tablas sirven como segunda fuente de validación.

#### Lista de clientes

Tabs de filtro: **General**, **Sin contactos**, **Pendientes**, **Activos**, **Finalizados**

Tabla con columnas: RUC, Razón Social, Alias, Último cambio, Total deuda, Total facturado, Total vigente, Total vencido, Total pagado, Etapa cliente (Vigente / En Mora), Estado cliente.

**Selector de moneda** (varía según país):
- **Perú**: Todos, PEN, USD (el sistema maneja las dos monedas, todos los montos se muestran en ambas)
- **Chile**: Solo CLP (sin selector)

Incluye filtros, ordenamiento, búsqueda, selección masiva ("Seleccionar todo"), paginación y botón "Crear cliente".

> **Nota**: Cuando un cliente no tiene contactos asociados, se muestra un indicador de advertencia "Sin contacto" en la lista.

#### Detalle del cliente

Panel lateral/modal que muestra toda la información del cliente:

**Cabecera:**
- Nombre comercial (alias)
- Razón social
- RUC
- Dirección
- Link "Ver análisis de deuda"
- Link "Ir al cliente" (abre vista completa)

**Acciones rápidas:**
- Crear Nota
- SenaChat
- Enviar Email
- Enviar SMS
- Llamar
- Más (opciones adicionales, incluye WhatsApp)

**Cuenta del cliente:**
- Estado actual (Vencido, etc.) con monto total
- Selector de moneda: Todos, PEN, USD (en Perú) / solo CLP (en Chile)
- Documentos Pendientes:
  - Vencido (monto + cantidad de documentos)
  - Vigente (monto + cantidad)
  - Deuda total (monto + cantidad)
- Movimientos de caja:
  - Pagado (monto + cantidad)
  - Conciliado (monto + cantidad)
  - Saldo (monto + cantidad)

**Panel de Notas (lateral derecho):**
- Tabs: Historial, Documentos
- Sección CRM
- Permite dejar anotaciones internas o adjuntar archivos
- Campo de texto con botón de envío y opción de adjuntar archivos

**Datos del cliente:**
- Gestión: Última actualización de sub-estado, Estado, Monto vigente, Sub etapa
- Identificación: RUC, Alias, Nombre legal, Dirección
- Botón "Editar" para modificar datos

**Cuentas bancarias:**
- Cuentas de cobro del cliente (para recibir pagos)
- Botón "Agregar cuenta de cobro"

**Campos personalizables:**
- Campos no estándar definidos por cada empresa en la configuración de empresa
- Cada empresa puede insertar sus propios campos custom
- Botón "Nuevo campo"
- Ejemplo: campo tipo "file", campo tipo "variable"

**Documentos relacionados:**
- Tabs: General, Revisión, Cobranza, Conciliación, Completadas
- Tabla con: Folio, Razón social, Receptor, RUC, Estado, Sub Estado, Emisión, Origen, Creación
- Filtros, ordenamiento, búsqueda y paginación

**Contactos relacionados:**
- Tabla con: Estado, Nombre, Apellido, Cargo, Área, Compañía, Emails, Teléfonos, Última gestión
- Los contactos sirven para comunicarse con el cliente a través de los canales disponibles
- Botón "Agregar Contacto" (con opciones adicionales)
- Filtros, ordenamiento, búsqueda y paginación

**Pagos relacionados:**
- Tabs: General, No Informado, Informado, Comprometido, Conciliado, Completado
- Botón "Crear Pago"
- Filtros, ordenamiento, búsqueda y paginación

**Conciliaciones relacionadas:**
- Tabs: Todas, Pendientes, Aprobadas, Rechazadas, Anuladas
- Botón "Crear conciliación"
- Tabla con: ID, Creado por, Razón social emisor, RUC Emisor, Fecha de creación, Monto pagos, Monto documentos, Responsable, Supervisor
- Filtros, ordenamiento, búsqueda y paginación

**Compromisos relacionados:**
- Botón "Crear compromiso de pago"
- Tabla con: Fecha de creación, Número de cuenta, Monto, Fecha, Empresa, Banco, Tipo, Glosa, Fecha pago estimada
- Filtros, ordenamiento, búsqueda y paginación

**Evaluación de riesgo crediticio (Sheriff):**
- Visible únicamente para empresas chilenas
- Muestra la última evaluación disponible (sin costo): nivel de riesgo, score, protestas y casos judiciales activos
- Si el cliente nunca fue evaluado, muestra estado vacío con botón "Evaluar"
- Botón "Evaluar ahora": lanza una nueva consulta (puede tener costo si el RUT es nuevo en toda la plataforma)
- Cuando el RUT es nuevo, el toast de confirmación lo indica explícitamente
- Historial colapsable con todas las evaluaciones anteriores: fecha, usuario, score y nivel de riesgo
- Clic en una evaluación del historial → abre el reporte completo

---

### 2.1.1 Riesgo crediticio Sheriff

Integración con Sheriff, plataforma chilena de evaluación de riesgo crediticio. Disponible únicamente para clientes con RUT chileno.

**Propósito**: antes de extender crédito o cerrar una venta a plazo, el equipo comercial obtiene en segundos el perfil financiero del cliente — protestas, casos judiciales, deuda bancaria, cumplimiento y score — sin salir de Sena.

#### Flujo de evaluación

1. El usuario abre el perfil de un cliente y accede a la sección de riesgo crediticio.
2. Si existe una evaluación previa, Sena la muestra al instante sin llamar a Sheriff (sin costo).
3. Si se pulsa **"Evaluar ahora"**, Sena consulta a Sheriff y persiste el resultado:
   - Si es la primera vez que ese RUT se evalúa en toda la plataforma → tiene costo real para Sena (`rut_was_new: true`).
   - Si otra empresa dentro de Sena ya lo evaluó antes → sin costo adicional (`rut_was_new: false`).
4. El resultado se muestra inmediatamente: nivel de riesgo, score y estadísticas clave.

> Si la evaluación falla (timeout, Sheriff en mantenimiento), la última evaluación exitosa sigue visible. Las evaluaciones fallidas quedan registradas en el historial con fines de auditoría.

#### Niveles de riesgo

| Nivel | Descripción |
|-------|-------------|
| Sin riesgo | Sin indicadores de riesgo detectados |
| Bajo | Perfil financiero sólido |
| Medio | Indicadores de riesgo moderado |
| Alto | Indicadores de riesgo significativos |
| Crítico | Riesgo crítico, máxima precaución |
| Desconocido | Sin datos suficientes (RUT no encontrado o sin historial) |

> "Desconocido" no equivale a riesgo alto — puede ser una empresa sin historial en plataformas de riesgo.

#### Reporte completo

Accesible desde el historial. Modal con 5 tabs:

**Resumen**
- Score Sheriff: número / máximo + badge de nivel de riesgo
- Desglose de sub-scores: Finanzas, Boletín Comercial, Judicial, Cobranza Laboral (barras con puntaje / máximo)
- Compliance: PEP Chile, Listas internacionales, Penal (cantidad de resultados por categoría)
- Identificación SII: razón social, actividades vigentes, tamaño empresa, inicio actividades
- Bienes: vehículos y propiedades (cantidad y tasación)

**Finanzas**
- Deuda directa: comercial, morosa, vigente, vencida, castigada, hipotecaria
- Deuda indirecta: vigente, vencida, castigada
- Leasing y línea de crédito
- Score financiero

**Boletin**
- Protestas Infocom, BolCom y Dicom: cantidad de casos y montos
- Score boletín

**Judicial**
- Casos activos, archivados, concluidos, total, quiebra, boletín concursal
- Casos civiles, cobranzas y laborales activos
- Score judicial

**Cobranza Laboral**
- Mora previsional, multas laborales, boletín laboral
- Score cobranza laboral

**Cabecera del reporte:**
- Score en formato `N / máximo` + nivel de riesgo separado
- Banner de alertas críticas cuando existen etiquetas activas (fraude, bloqueado, etc.)
- Chips de resumen: riesgo global y estado de compliance
- Aviso de reporte parcial si algún bloque de datos de Sheriff no pudo obtenerse

#### Modelo de costos

Sheriff cobra por RUT cargado por primera vez a nivel de plataforma. Si el mismo RUT ya fue evaluado por cualquier otra empresa dentro de Sena, no hay costo adicional para esa consulta.

| Escenario | Costo para Sena |
|-----------|-----------------|
| Primera evaluación de un RUT en toda la plataforma | Sena paga a Sheriff |
| Mismo RUT evaluado por otra empresa previamente | Sin costo |
| Re-evaluación del mismo RUT | Sin costo |

Esto significa que Sena puede tener margen positivo en consultas a RUTs ya conocidos en la plataforma.

#### Comportamientos importantes

- **Primera evaluación más lenta**: Sheriff debe registrar el RUT antes de consultarlo (1–3 s adicionales). Es comportamiento esperado.
- **Reporte parcial**: si Sheriff no pudo obtener algún bloque de datos (ej. "Boletin Dicom"), se muestra un aviso con los bloques omitidos. El resto del reporte sigue siendo válido.
- **Token automático**: los tokens de sesión con Sheriff se renuevan solos. El usuario nunca ve este error.
- **Historial siempre disponible**: aunque la evaluación más reciente falle, el último resultado exitoso sigue accesible.

---

### 2.2 Documentos emitidos

Representa las facturas y documentos tributarios emitidos a los clientes. Es una de las entidades más importantes del sistema, ya que sobre ella gira todo el flujo de cobranza.

**Descripción**: Accede a todas las documentos emitidas a tus clientes, con información clave, estados, etapas y el detalle con el historial de todas las gestiones.

#### Creación de documentos

Los documentos se pueden crear de dos formas:

1. **Individualmente**: Modal "Agregar nuevo documento" con campos:
   - Tipo de documento (selector): Factura, Boleta de venta, Letra de cambio, Nota de crédito, Recibo por honorarios, entre otros. Los tipos disponibles varían según el país.
   - Número de documento / Folio (obligatorio)
   - RUC del emisor (identificador tributario de quien emite)
   - RUC del receptor (selector de proveedor/cliente, obligatorio)
   - Moneda (PEN, USD, CLP, etc. - depende del país, puede manejar 1 o 2 monedas)
   - Monto total (obligatorio)
   - Fecha de vencimiento
   - Notas (opcional)
2. **Importación masiva**: A través del módulo de importación de Sena se pueden cargar miles de facturas de golpe. Al importarse, se generan automáticamente los registros de documentos y también se crean los clientes si no existen (usando RUC y razón social de la factura).

#### Lista de documentos emitidos

Tabs de filtro por estado: **General**, **Revisión**, **Cobranza**, **Conciliación**, **Completadas**

Tabla con columnas: Folio, Razón social, Receptor, RUC, Estado, Sub Estado, Emisión, Origen, Creación, Modificación, Número cuota, Etapa, Sub Etapa, Vencimiento, Monto facturado, Moneda.

**Funcionalidades de la lista:**
- Filtros avanzados, ordenamiento, búsqueda y paginación
- Selección individual y masiva de documentos ("Seleccionar todo")
- Acciones masivas sobre documentos seleccionados:
  - Cambiar Estado
  - Cambiar Sub Estado
  - Cambiar Ámbito
  - Cambiar ETA Documento
- Botón "Crear documento"
- Menú "Acciones"

#### Enviar estado de deuda

Funcionalidad clave que permite notificar a los clientes sobre sus deudas pendientes. Se accede seleccionando uno o más documentos desde la lista.

**Flujo:**
1. Se seleccionan documentos (pueden ser de distintos clientes)
2. Se abre modal "Enviar estado de deuda" con:
   - **Vista previa**: Tabla con los documentos seleccionados (Folio, Razón social, Receptor, RUC, Estado, Sub Estado, Emisión, Origen, Creación). Botón "Personalizar columnas" para ajustar qué columnas se muestran.
   - **Destinatarios**: Selección de contactos de cada cliente que recibirán el estado de cuenta. Opción "Seleccionar todos".
   - **Mensaje Personalizado**:
     - Campo "Asunto"
     - Editor de cuerpo del correo con formato rich text (negrita, cursiva, tachado, tablas, listas, alineación, insertar imagen)
     - Soporta variables como `{Nombre del Cliente}`
     - Plantilla por defecto: "Estimado/a {Nombre del Cliente}, Por favor encuentre detallado su estado de deuda..."
     - Límite: 1000 caracteres
   - **Edición del correo** (panel lateral):
     - Tamaño de la fuente
     - Fuente (ej: Arial)
     - Color del texto
     - Banner Empresa: imagen SVG, PNG o JPG (recomendado 600x150 px)
3. Botón "Enviar estado de deuda" para ejecutar el envío por email

#### Detalle del documento

Panel/modal que muestra toda la información de un documento específico:

**Cabecera:**
- Número de documento (ej: F003-00008055)
- Nombre receptor + identificador tributario
- Indicadores financieros:
  - Monto Total
  - Monto Pagado (resaltado en verde si hay pagos)
  - Por pagar (resaltado en rojo si hay deuda)
  - Emisión (fecha)
  - Vencimiento (fecha, resaltado en rojo si está vencido)
- Botones: "Ver documento" (visualizar PDF/archivo), "Descargar documento"
- Link "Ir al documento" (abre vista completa)

**Acciones rápidas (cascada al cliente):**
- Crear Nota
- SenaChat
- Enviar Email
- Enviar SMS
- Llamar
- Más (WhatsApp, etc.)

Estas acciones se comunican con el cliente dueño del documento, es una relación en cascada documento → cliente → contactos.

**Identificación:**
- ID Documento
- Periodo Contable
- Nombre Receptor
- Nombre Emisor
- ID Receptor (RUC)
- ID Emisor (RUC)
- Dirección Receptor
- Dirección Emisor
- País Emisión
- Fecha Actualización
- Tipo de documento
- Botón "Editar"
- "+ Visualizar nuevo campo"

**Panel de Notas (lateral derecho):**
- Tabs: Historial, Documentos
- Sección CRM
- Historial del sistema: registra automáticamente cambios de campos, estados, etc. con fecha, hora y usuario responsable
- Campo de texto para agregar notas manuales con opción de adjuntar archivos

**Campos personalizables:**
- Igual que en clientes, campos no estándar definidos por cada empresa
- Botón "Nuevo campo"
- Ejemplos de campos custom: avla, fono, email, fecha, t.doc, total, f.pago, moneda, nombre, cliente, cobrado, num doc, contacto, division, vendedor, dias pago, direccion, fecha ven, num unico, porcobrar, fecha venc, forma pago, codtipopago, credito 10%, desc. banco, num interno, razon social, detraccion %, moneda credito, monto credito, fecha recepcion, totalpercepcion, entre otros.

**Pagos conciliados relacionados:**
- Tabla con: ID Conciliación, Estado de Conciliación, ID Pago, Estado del pago, Monto total
- Filtros, ordenamiento, búsqueda y paginación

**Conciliaciones relacionadas:**
- Tabla con: ID, Creado por, Razón social Emisor, RUT Emisor, Fecha de creación, Monto pagos, Monto documentos, Responsable, Supervisor
- Filtros, ordenamiento, búsqueda y paginación

**Sección Caracterización:** *(colapsable, pendiente de más detalle)*

**Sección Gestión:** *(colapsable, pendiente de más detalle)*

#### Estados del documento

Los documentos siguen un flujo de estados que representa en qué etapa de gestión se encuentra:

| Estado | Sub Estados |
|--------|-------------|
| **Revisión** | Pendiente |
| **Cobranza** | Pausada, Gestión, Derivada, Observada, En compromiso |
| **Conciliación** | En pago |
| **Completada** | Pagada, Archivada, Rechazada |

#### Etapas del documento

Las etapas representan el estado temporal/financiero del documento, independiente del estado de gestión:

| Etapa | Sub Etapas | Detalle |
|-------|------------|---------|
| **Vigente** | Emitida, Por vencer, Vence | Documento dentro de plazo |
| **Vencida** | Mora Temprana, Mora Media, Mora Avanzada, Mora Castigada, Mora Dura | Documento fuera de plazo |
| **Pagada** | Pagada | Documento cancelado |
| **Inactiva** | Archivada, Rechazada | Documento fuera de gestión |

**Detalle de moras (sub-etapas de Vencida):**

| Sub Etapa | Días vencidos |
|-----------|---------------|
| Mora Temprana | 1 - 30 días |
| Mora Media | 31 - 60 días |
| Mora Avanzada | 61 - 90 días |
| Mora Castigada | 91 - 120 días |
| Mora Dura | 120+ días |

### 2.3 Campañas

Permite ejecutar comunicaciones masivas hacia los contactos de los clientes a través de distintos canales. Las campañas se vinculan con **Segmentos** (Configuración) y **Plantillas** (Herramientas) para conformar el flujo completo de comunicación masiva.

**Descripción**: Gestiona y ejecuta campañas de cobranza y comunicación hacia tus clientes, segmentando audiencias y personalizando mensajes por canal.

#### Vista de lista

Muestra las campañas creadas con dos vistas:

- **Campañas ejecutadas**: Campañas ya enviadas con sus métricas.
- **Campañas programadas**: Campañas con envío futuro pendiente de ejecución.

#### Tipos de campaña

Existen 6 tipos predefinidos que determinan el propósito de la comunicación:

| Tipo | Descripción |
|------|-------------|
| **Invitación del portal de facturas** | Invita a los contactos a acceder al portal de pagos donde pueden consultar y pagar sus facturas |
| **Notificación de recepción de factura** | Informa al contacto que una nueva factura ha sido registrada |
| **Recordatorios Preventivos (Pre Vencimiento)** | Envía recordatorios antes de la fecha de vencimiento del documento |
| **Cobranza Temprana** | Gestión de cobro para documentos vencidos con menos de 180 días |
| **Cobranza Avanzada** | Gestión de cobro para documentos vencidos con más de 180 días |
| **Campaña Genérica** | Comunicación libre sin tipo específico de cobranza |

#### Canales de envío

- **Email**: Requiere integración SMTP configurada (ver Integraciones).
- **WhatsApp**: Solo disponible vía **Business Platform** (Capso/Meta). No se puede usar el canal QR (Evolution API) para campañas masivas.
- **SMS**: Canal de mensajería de texto.

#### Creación de campaña (Wizard de 4 pasos)

##### Paso 1 — Tipo y Nombre de Campaña

- Selección del **tipo de campaña** (uno de los 6 tipos disponibles).
- Campo **nombre de la campaña** para identificarla en el listado.

##### Paso 2 — Configuración de Envío

- **Canal de envío**: Seleccionar entre Email, WhatsApp o SMS.
- **Modo de envío**:
  - **Inmediato**: La campaña se ejecuta al confirmar la creación.
  - **Programado**: Se configuran una o más frecuencias de envío. Cada frecuencia incluye:
    - **Fecha** de envío.
    - **Hora** de envío.
    - Se pueden agregar múltiples frecuencias para envíos recurrentes.

##### Paso 3 — Segmentación de audiencia

- Seleccionar un **segmento** existente (creado previamente en Configuración → Segmentos).
- Opción de **crear un nuevo segmento** directamente desde este paso.
- El segmento define qué clientes y contactos recibirán la campaña.

> **Relación clave**: Los segmentos agrupan clientes → contactos. La campaña se envía a los **contactos** del segmento seleccionado.

##### Paso 4 — Configuración del mensaje

- **Asunto** del mensaje (aplica para Email).
- **Banner**: Imagen opcional para acompañar el mensaje.
- **Editor de texto enriquecido**: Área de redacción con formato (negrita, cursiva, listas, etc.).
- **Variables dinámicas**: Se pueden insertar variables que se reemplazan automáticamente con datos del contacto/cliente/documento al momento del envío (ej. nombre del contacto, monto adeudado, fecha de vencimiento).
- **Límite de caracteres**: 1000 caracteres máximo para el cuerpo del mensaje.
- **Vista previa**: Panel lateral que muestra cómo se verá el mensaje final.

#### Barra inferior — Resumen de Campaña

Durante todo el wizard, una barra fija en la parte inferior muestra un **resumen progresivo** de las selecciones realizadas en cada paso:

- Tipo de campaña seleccionado.
- Canal y modo de envío.
- Segmento elegido.
- Vista previa del mensaje.

Esto permite al usuario revisar sus decisiones sin retroceder entre pasos.

### 2.4 Contactos

Representan a las personas de contacto dentro de cada empresa cliente. Son el destino de todas las comunicaciones que se realizan a través del CRM. Un cliente puede tener múltiples contactos.

**Descripción**: Accede a perfiles completos de los contactos de tus clientes, con información clave y el historial de todas las gestiones.

> **Nota**: Estos son los contactos de "Por Cobrar" (clientes). Existe un módulo equivalente en "Por Pagar" para contactos de proveedores.

#### Creación de contactos

Los contactos se pueden crear de tres formas:

1. **Manualmente**: Modal "Agregar Contacto" con campos:
   - Cliente (obligatorio - selector de a qué cliente pertenece)
   - Nombre (obligatorio)
   - Apellido (obligatorio)
   - Cargo (opcional)
   - Área (opcional)
   - Email (obligatorio)
   - Celular (obligatorio - con selector de código de país, ej: +51 para Perú)
2. **Carga masiva**: Importación mediante archivos Excel o CSV.
3. **Integración por API** (casos especiales): Igual que pagos y otros, algunas empresas proveen APIs de las cuales Sena extrae contactos.

**Campos esenciales**: Cliente al que pertenece, nombre, apellido, email, número de celular. Cargo y área son secundarios.

#### Lista de contactos

Tabla con columnas: Estado, Nombre, Apellido, Cargo, Área, Compañía, Email, Teléfono, Última gestión, Respuesta última gestión, Mejor respuesta, Fecha mejor respuesta.

Incluye filtros, ordenamiento, búsqueda, paginación y botón "+ Agregar Contacto".

> **Nota**: El campo "Estado" puede mostrar valores como "Sin usuario" cuando el contacto no tiene un usuario de portal asociado.

#### Detalle del contacto

Panel/modal con toda la información del contacto:

**Cabecera:**
- Nombre completo del contacto
- Compañía (nombre de la empresa cliente)
- RUC/RUT de la empresa
- Link "Ir al contacto" (abre vista completa)

**Acciones rápidas (CRM):**
- Crear Nota
- SenaChat
- Enviar Email
- Enviar SMS
- Llamar
- Más (WhatsApp, etc.)

**Información del contacto:**
- Nombre
- Apellido
- Cargo
- Área
- RUC de la empresa
- Nombre de la empresa
- Emails
- Teléfonos
- Última gestión
- Respuesta última gestión
- Botón "Editar"

**Panel de Notas (lateral derecho):** Notas + CRM (patrón transversal, ver sección [Patrones Transversales](#patrones-transversales))

**Campos personalizables:** *(colapsable)* - Campos custom definidos por empresa en configuración.

**Emails relacionados:**
- Un contacto puede tener múltiples correos electrónicos
- Tabla con: Nombre empresa, ID empresa, Email, Última gestión, Respuesta última gestión
- Acciones: editar, eliminar

**Números relacionados:**
- Un contacto puede tener múltiples números telefónicos
- Tabla con: Nombre empresa, ID empresa, Número (con código país), Última gestión, Respuesta última gestión
- Acciones: editar, eliminar

> **Nota**: Como mínimo un contacto necesita un email y un número telefónico para poder ser contactado correctamente a través de los canales de CRM.

### 2.5 Compromisos de pago

Representa un acuerdo formal donde se agrupan documentos pendientes de un cliente y se le compromete a realizar el pago en una fecha determinada. Es una herramienta de gestión de cobranza que permite formalizar la intención de pago del deudor sobre documentos específicos.

**Descripción**: Revisa el estado de tus transacciones, confirma detalles y sigue los pasos para completar cada operación de manera segura y eficiente.

> **Nota**: El "cliente" en este contexto es el deudor (cliente del usuario de Sena). El compromiso se le envía para que se comprometa a pagar los documentos agrupados.

#### Lista de compromisos de pago

Tabla con columnas: Fecha de creación, Número de cuenta, Monto, Empresa, Banco, Tipo, Glosa.

Incluye filtros, ordenamiento, búsqueda, selección masiva, paginación y botón "Crear compromiso de pago".

#### Creación de compromiso de pago

Wizard de 3 pasos mediante modal:

**Paso 1 de 3: Selección de cliente y documentos**
- "Elige al cliente y los documentos que deseas pagar. Verifica los montos y asegúrate de seleccionar todos los documentos necesarios."
- **Selector de cliente**: Dropdown con búsqueda. Muestra razón social, RUC y estado de deuda ("Con deuda"). Solo se puede seleccionar un cliente por compromiso.
- **Documentos del cliente**: Una vez seleccionado el cliente, se muestran sus documentos en tabs: General, Revisión, Cobranza, Conciliación, Completadas.
  - Tabla con: Folio, Razón social, Receptor, RUC, Estado (con indicador de tiempo, ej: "hace 0 días", "hace 5 días")
  - Selección individual y masiva ("Seleccionar todo")
  - Filtros, ordenamiento, búsqueda y paginación
- **Resumen a Pagar** (panel lateral derecho): Se actualiza en tiempo real al seleccionar documentos. Muestra cada documento seleccionado con su monto y el total agrupado por moneda (ej: "Total de documentos PEN (2): S/ 6,013.28").
- Navegación: Volver / Continuar

**Paso 2 de 3: Método de pago**
- "Selecciona la fecha en la que se realizará el pago."
- **Fecha de Transferencia**: Selector de calendario para elegir cuándo se efectuará el pago.
- **Aviso de procesamiento**: "Ten en cuenta que la transferencia se deberá efectuar en la fecha seleccionada durante el horario bancario (9:00 AM - 5:00 PM)"
- El panel "Resumen a Pagar" se mantiene visible con los documentos seleccionados.
- Navegación: Volver / Continuar

**Paso 3 de 3: Confirmación**
- "Revisa los datos de tu intención de pago antes de confirmarla. Asegúrate de que toda la información sea correcta para evitar inconvenientes."
- **Resumen del acuerdo**: "Revisa y confirma tu acuerdo de pago. Para completar el pago, realiza la transferencia utilizando los datos proporcionados."
- **Resumen de documentos** (colapsable): Lista de cada documento con su monto individual.
- Fecha estimada de pago
- Total a pagar (moneda)
- Botón: **"Confirmar y Crear intención de pago"**

**Resultado exitoso:**
- Modal de confirmación: "¡Intención de pago creada con éxito!"
- Muestra: Cuenta de destino, Fecha estimada de pago, Total a pagar
- **Código de Glosa generado**: Se genera un código numérico único (ej: 88371060) que el deudor debe incluir en el asunto de la transferencia bancaria para facilitar el procesamiento y la conciliación del pago.
- Acciones: "Ir al compromiso de pago" / "Cerrar"

#### Detalle del compromiso de pago

Modal/panel que muestra toda la información del compromiso:

**Cabecera:**
- ID del compromiso (ej: "Compromiso de pago #565")
- Estado del compromiso (badge: Pendiente, etc.)
- KPIs destacados:
  - Total a pagar (monto)
  - Fecha estimada de pago

**Datos del compromiso de transferencia:** *(editables)*
- Fecha estimada de pago
- Banco (ej: Banco de Crédito del Perú BCP)
- Número de cuenta
- Tipo de cuenta (ej: Cuenta Corriente)
- Nombre del beneficiario
- Correo electrónico
- Cliente
- Glosa (código numérico + indicación de incluirlo en el asunto de la transferencia)
- Estado del compromiso (badge)

**Código de Glosa** (alerta destacada en amarillo):
- "Asegúrate de incluir el número de Glosa XXXXX en el asunto de la transferencia para facilitar el procesamiento de tu pago."
- Es un identificador clave para vincular la transferencia bancaria con el compromiso en el sistema.

**Detalles del método de pago:**
- Método de pago (ej: Transferencia bancaria)
- Banco
- Número de cuenta
- Tipo de cuenta
- Nombre del beneficiario
- Fecha estimada de pago

**Detalle de Documentos:**
- Tabla con: Folio, Razón social, Receptor, RUC, Estado, Sub Estado, Emisión, Origen, Creación
- Total de documentos (cantidad) con monto total

**Pagos realizados:**
- Tabla con: ID, Emisor, Receptor, Origen, Folio, Sociedad, Monto Total, Monto Disponible, Monto No Disponible
- Puede estar vacía si aún no se han registrado pagos asociados

**Panel de Notas y CRM (lateral derecho):** Notas + CRM (patrón transversal, ver sección [Patrones Transversales](#patrones-transversales))

#### Relaciones del compromiso de pago

- **Compromiso → Cliente**: Cada compromiso está asociado a un cliente específico (deudor).
- **Compromiso → Documentos**: Agrupa uno o más documentos pendientes del cliente.
- **Compromiso → Pagos**: Los pagos realizados contra el compromiso se registran y vinculan.
- **Compromiso → Glosa**: El código de glosa generado permite vincular la transferencia bancaria real con el compromiso en el sistema.

### 2.6 Pagos recibidos

Representa los pagos que los clientes realizan para saldar sus deudas/documentos.

**Descripción**: Revisa el estado de tus pagos, confirma detalles y sigue los pasos para completar cada operación de manera segura y eficiente.

#### Creación de pagos

Los pagos se pueden ingresar de tres formas:

1. **Manualmente (uno a uno)**: Modal "Crear Pago" con campos:
   - Tipo de Pago (selector, ej: TRANS. BANCARIA)
   - Estado (selector, ej: Informado)
   - Receptor (obligatorio - selector de empresa/cliente receptor del pago)
   - Emisor (obligatorio - selector de quien emite el pago)
   - Identificador (obligatorio - número o código identificador del pago)
   - Fecha de Pago (obligatorio)
   - Moneda (PEN, USD, CLP, etc. - depende del país)
   - Monto (obligatorio)
   - Glosa (descripción del pago, obligatorio)
   - Notas (opcional)
2. **Carga masiva**: Importación mediante archivos Excel o CSV a través del módulo de importación.
3. **Integración por API** (casos especiales): Para clientes específicos, Sena consume sus APIs para traer pagos, clientes, facturas, contactos, etc. Es una integración personalizada, no estándar.

> **Nota**: Las formas más comunes son manual y carga masiva. La integración por API es para clientes muy específicos.

#### Lista de pagos recibidos

Tabs de filtro por estado: **No Informado**, **Informado**, **Comprometido**, **Conciliado**, **Archivado**, **Completado**

Tabla con columnas: ID, Emisor, Receptor, Origen, Folio, Sociedad, Monto Total, Monto Disponible, Monto No Disponible, Número de Documento, Glosa, Referencia, Fecha de Valor, Fecha Contable, Fecha de Valor.

Incluye filtros, ordenamiento, búsqueda, selección masiva ("Seleccionar todo"), paginación y botón "Crear Pago".

#### Estados del pago

| Estado | Descripción |
|--------|-------------|
| **No Informado** | El pago no está asociado a ningún cliente. No se sabe a quién pertenece. |
| **Informado** | Ya se identificó a qué cliente pertenece el pago. |
| **Comprometido** | El pago se pasa manualmente a este estado (compromiso de pago). |
| **Conciliado** | El pago está incluido en una conciliación. |
| **Archivado** | El pago no es válido o no aplica, se archiva. |
| **Completado** | El pago se confirma como correcto y se da por finalizado. |

#### Detalle del pago

**Cabecera:**
- Monto a pagar (monto principal destacado)

**Datos del compromiso de transferencia:**
- Emisor (quien paga, editable)
- Receptor (quien recibe)
- Monto
- Medio de pago
- Banco
- Cuenta destino
- Fecha de creación
- ID del pago
- Glosa
- Estado (badge con el estado actual)

**Detalle de Productos/Servicios:**
- Tabla con: Cantidad, Descripción, Precio Unitario (moneda), Total (moneda)
- Subtotal
- IGV (18% para Perú)
- Total a pagar

**Campos personalizables:** *(colapsable)* - Campos custom definidos por empresa en configuración.

**Conciliaciones relacionadas:**
- Tabs: Todas, Pendientes, Aprobadas, Rechazadas, Anuladas
- Tabla con: ID, Creado por, Razón social Emisor, RUC Emisor, Fecha de creación, Monto pagos, Monto documentos, Responsable, Supervisor, Estado, Modo
- Botón "Crear conciliación"
- Filtros, ordenamiento, búsqueda y paginación

**Panel de Notas (lateral derecho):** Notas + CRM (patrón transversal, ver sección [Patrones Transversales](#patrones-transversales))

#### Relaciones del pago

- **Pago → Cliente**: El pago está relacionado con el cliente (emisor del pago). A través del cliente se accede a sus contactos para comunicación vía CRM.
- **Pago → Conciliación**: Un pago puede estar en una o más conciliaciones.
- Puede haber pagos sin relación a un cliente (estado "No Informado").

---

## 3. Por Pagar

Módulo espejo de "Por Cobrar" orientado a la gestión de cuentas por pagar. Mientras en Por Cobrar la empresa emite documentos a sus clientes, en Por Pagar la empresa recibe documentos emitidos por sus proveedores que debe pagar.

**Descripción**: Administra las cuentas por pagar de tu empresa, incluyendo proveedores, documentos recibidos, aprobaciones, pagos y anticipos.

> **Principio general**: Todas las funcionalidades base documentadas en Por Cobrar (patrón CRM, Notas, campos personalizables, importación masiva, filtros, paginación, etc.) aplican de forma equivalente en Por Pagar. A continuación se documentan las diferencias y elementos propios de este módulo.

**Sub-secciones del sidebar:**

- **Proveedores** — Equivalente a Clientes
- **Documentos recibidos** — Equivalente a Documentos emitidos
- **Aprobaciones** — *Exclusivo de Por Pagar* (no existe en Por Cobrar)
- **Contactos** — Equivalente a Contactos (de proveedores)
- **Compromisos de pago** — Equivalente a Compromisos de pago
- **Pagos realizados** — Equivalente a Pagos recibidos
- **Nóminas** — *Exclusivo de Por Pagar*
- **Anticipos** — *Exclusivo de Por Pagar*

---

### 3.1 Proveedores

Representan a las empresas que proveen bienes o servicios a la empresa usuaria de Sena. Los proveedores emiten documentos (facturas) que la empresa debe pagar.

**Descripción**: Accede a la información de los proveedores, revisa su estado y realiza acciones sobre ellos.

#### Lista de proveedores

Tabs de filtro por estado: **General**, **Sin aprobadores**, **Pendientes**, **En aprobación**, **Finalizados**

Tabla con columnas: RUT, Razón Social, Alias, Último cambio, Porcentaje de negocio, Estructura propietaria, Estructura organizacional, Industria, Fecha sub estado, Total deuda, Total facturado, Total vigente, Total vencido, Total pagado.

- Selector de moneda: **Todos** | **CLP** | **UF** (en Chile) — varía según el país.
- Funcionalidades: Filtrar, Ordenar, Buscar, paginación (configurable: 15 por página), selección individual/masiva.
- Indicador de última actualización (ej. "Actualizado el 26/02/2026 09:54 AM").
- Botón **"Crear proveedor"**.

> **Diferencia con Clientes**: La lista de proveedores incluye tabs propios del flujo de aprobación ("Sin aprobadores", "Pendientes", "En aprobación", "Finalizados") que no existen en la lista de Clientes. Los montos se muestran en la moneda local + UF (en Chile).

#### Creación de proveedores

Modal **"Nuevo proveedor"** con:

- **RUT/RUC de la empresa** (campo obligatorio): Al ingresar el identificador tributario, se valida automáticamente:
  - **Perú**: Validación mediante API de SUNAT.
  - **Chile**: Validación mediante API gateway del Servicio de Impuestos Internos (SII).
  - **Otros países**: Sin validación automática (aún no implementada).
- **Notas** (opcional): Campo de texto con opción de adjuntar archivos.
- Botones: **Cancelar** | **Crear**.

Otras formas de crear proveedores:
- **Importación masiva**: A través de Herramientas → Importaciones y Exportaciones.
- **Integración por API**: Algunas empresas proporcionan su propia API de proveedores para consumo e importación directa (integraciones personalizadas).
- **Sincronización tributaria**: Al sincronizar con SUNAT/SII, los proveedores pueden crearse automáticamente a partir de los documentos recibidos.

#### Detalle del proveedor

Panel modal que muestra toda la información del proveedor. Estructura análoga al detalle de cliente con las siguientes secciones:

**Cabecera:**
- Identificador (RUT/RUC).
- Botón **"Ver análisis de deuda"**.
- Botón **"Pagar Facturas"** (exclusivo de proveedores — en clientes no existe).
- Link **"Ir al proveedor"** (abre vista completa).

**Acciones rápidas (CRM):**
- Crear Nota, SenaChat, Enviar Email, Enviar SMS, Llamar, Más (WhatsApp).

**Panel de Notas y CRM (lateral derecho):** Notas + CRM (patrón transversal, ver sección [Patrones Transversales](#patrones-transversales)).

**Cuenta del proveedor:**
- Estado actual (Vencido, etc.) con monto total.
- Selector de moneda: Todos, CLP, UF (varía según país).
- **Documentos Pendientes**: Vencido (monto + cantidad), Vigente (monto + cantidad), Deuda (monto + cantidad).
- **Movimientos de caja**: Pagado (monto + cantidad), Conciliado (monto + cantidad), Saldo (monto + cantidad).

**Caracterización de Proveedor:**
- Proporción B2B (editable).
- Tamaño empresa (editable).
- Estructura propietaria (editable).
- Estructura organizacional (editable).
- Sector industrial (editable).

> **Diferencia con Clientes**: Los proveedores incluyen el campo "Sector industrial" dentro de Caracterización, que no aparece en clientes.

**Identificación** (con botón "Editar"):
- RUT/RUC, Razón social, Grupo, Alias, Dirección empresa, Descripción, Slogan, Teléfono, Email, Última actualización.

**Personalizables:**
- Campos custom definidos en Configuración → Propiedades Personalizables para el objeto "Proveedor".
- Botón **"Nuevo campo"** para agregar campos directamente.

**Cuentas bancarias:**
- Cuentas destinadas a recibir pagos del proveedor.
- Botón **"+ Agregar cuenta"** / **"Agregar cuenta de cobro"**.

**Gestión:**
- Última actualización de sub estado, Estado, Monto vigente, Sub etapa, Cantidad pagada.

**Documentos relacionados:**
- Tabs: **General**, **Revisión**, **Aprobación**, **Conciliación**, **Completadas**.
- Tabla con: Folio, Origen, Estado, Sub estado, Emisión, Etapa, Sub Etapa, Vencimiento, Monto facturado.
- Botón **"Crear documento"**.
- Filtros, ordenamiento, búsqueda y paginación.

> **Diferencia con Clientes**: Los documentos de proveedores usan el tab "Aprobación" en lugar de "Cobranza", reflejando el flujo de aprobación de facturas recibidas.

**Contactos relacionados:**
- Tabla con: Estado, Nombre, Apellido, Cargo, Área, Compañía, Email, Teléfono, Última gestión.
- Acciones: **Sincronizar emails**, **Exportar**, **+ Importar**, **Agregar contacto**.
- Filtros, ordenamiento, búsqueda y paginación.

**Anticipos relacionados** *(exclusivo de proveedores)*:
- Tabs: **Pendientes**, **Aprobadas**, **Archivadas**, **Pagadas**, **Reconciliadas**.
- Tabla con: ID, Tipo, Estado, Identificador, Empresa, Responsable, Email, Descripción, Fecha estimada de pago.
- Botón **"Crear anticipo"**.
- Filtros, ordenamiento, búsqueda y paginación.

> **Nota**: Los anticipos son pagos adelantados que se realizan al proveedor antes de recibir el bien o servicio. Este concepto no existe en Por Cobrar (Clientes).

### 3.2 Documentos recibidos

Representa las facturas y documentos tributarios emitidos por los proveedores hacia la empresa. Es el equivalente de "Documentos emitidos" (Por Cobrar) pero desde la perspectiva de cuentas por pagar.

**Descripción**: Accede a todas las documentos recibidos de tus proveedores, con información clave, estados, etapas y el detalle con el historial de todas las aprobaciones.

> **Diferencia clave con Documentos emitidos**: En Por Cobrar, la empresa emite documentos a sus clientes. En Por Pagar, la empresa recibe documentos emitidos por sus proveedores. El flujo incluye un proceso de **Aprobación** en lugar de Cobranza.

#### Creación de documentos recibidos

Los documentos se pueden crear de dos formas:

1. **Manualmente**: Modal "Crear documento recibido" con campos:
   - Tipo de documento (selector): Factura, Boleta, Recibo por honorarios, Factura electrónica, entre otros. Los tipos disponibles varían según el país.
   - *Número de documento (obligatorio).
   - *RUT del emisor (selector de proveedor, obligatorio).
   - *Moneda (CLP, UF, PEN, USD, etc. — depende del país).
   - *Monto total (obligatorio).
   - Fecha de vencimiento.
   - Notas (opcional): Campo de texto con opción de adjuntar archivos.
   - Botones: **Cancelar** | **Guardar**.
2. **Importación masiva**: A través de Herramientas → Importaciones y Exportaciones. Al importar, si el proveedor no existe, se crea automáticamente.
3. **Sincronización tributaria**: Documentos recibidos pueden cargarse automáticamente al sincronizar con SUNAT (Perú) o SII (Chile).

#### Lista de documentos recibidos

Tabs de filtro por estado: **General**, **Revisión**, **Aprobación**, **Conciliación**, **Completadas**

> **Diferencia con Documentos emitidos**: Los documentos recibidos usan el tab **"Aprobación"** en lugar de "Cobranza", reflejando que estos documentos pasan por un flujo de aprobación interna antes de ser pagados.

Tabla con columnas: Folio, Origen, Estado, Sub estado, Emisión, Etapa, Sub Etapa, Vencimiento, Monto facturado, Monto deuda, Monto pagado, Tipo de documento, Estado SII.

**Funcionalidades de la lista:**
- Filtrar, Ordenar, Buscar, paginación (configurable: 15 por página).
- Selección individual y masiva.
- Indicador de última actualización.
- Botón **"Crear documento"**.
- Columna **"Estado SII"**: Indica el estado del documento en el Servicio de Impuestos Internos (Chile). No aplica a todos los países.

#### Estados del documento recibido

| Estado | Sub Estados |
|--------|-------------|
| **Revisión** | Pendiente |
| **Aprobación** | Pausada, Gestión, Derivada, Observada, En compromiso |
| **Conciliación** | En pago |
| **Completada** | Pagada, Archivada, Rechazada |

> **Diferencia con Documentos emitidos**: El segundo estado es **"Aprobación"** en vez de "Cobranza". Los sub-estados dentro de Aprobación son los mismos que en Cobranza.

#### Etapas del documento recibido

Las etapas y sub-etapas son idénticas a las de Documentos emitidos:

| Etapa | Sub Etapas | Detalle |
|-------|------------|---------|
| **Vigente** | Emitida, Por vencer, Vence | Documento dentro de plazo |
| **Vencida** | Mora Temprana, Mora Media, Mora Avanzada, Mora Castigada, Mora Dura | Documento fuera de plazo |
| **Pagada** | Pagada | Documento cancelado |
| **Inactiva** | Archivada, Rechazada | Documento fuera de gestión |

**Detalle de moras (sub-etapas de Vencida):**

| Sub Etapa | Días vencidos |
|-----------|---------------|
| Mora Temprana | 1 - 30 días |
| Mora Media | 31 - 60 días |
| Mora Avanzada | 61 - 90 días |
| Mora Castigada | 91 - 120 días |
| Mora Dura | 120+ días |

#### Detalle del documento recibido

Panel modal que muestra toda la información de un documento recibido. Estructura análoga al detalle de documentos emitidos.

**Cabecera:**
- Título: "Documento recibido" con link **"Ir al documento"**.
- Tipo y número de documento (ej. "Factura 2342").
- Identificador del proveedor (RUT/RUC).
- Indicadores financieros:
  - Monto Total.
  - Monto Pagado (resaltado en verde).
  - Por pagar (resaltado en rojo si hay deuda pendiente).
  - Emisión (fecha).
  - Vencimiento (fecha, resaltado en rojo si vencido).
- Botones: **"Ver documento"** (visualizar PDF) | **"Descargar documento"**.

**Acciones rápidas (CRM):**
- Crear Nota, SenaChat, Enviar Email, Enviar SMS, Llamar, Más (WhatsApp).
- Las acciones se comunican con el proveedor dueño del documento (cascada: documento → proveedor → contactos).

**Panel de Notas y CRM (lateral derecho):** Notas + CRM (patrón transversal, ver sección [Patrones Transversales](#patrones-transversales)).
- Historial del sistema registra automáticamente cambios (ej. "Factura creada con éxito").

**Identificación** (con botón "Editar"):
- ID Documento, Periodo Contable, Nombre Receptor (empresa usuaria), Nombre Emisor (proveedor), ID Receptor, ID Emisor, Dirección Receptor, Dirección Emisor, País Emisión, Fecha Actualización, Tipo de documento.

**Personalizables:**
- Campos custom definidos en Configuración → Propiedades Personalizables para el objeto "Documento recibido".
- Botón **"Nuevo campo"**.

**Sección Caracterización** (colapsable):
- Campos de categorización del documento.

**Sección Gestión** (colapsable):
- Campos de seguimiento de gestión del documento.

### 3.3 Aprobaciones

Módulo exclusivo de Por Pagar que centraliza el proceso de aprobación de documentos recibidos y anticipos. Los elementos que aparecen aquí son determinados por los flujos de aprobación configurados en Herramientas → Flujos.

**Descripción**: Centraliza y agiliza la gestión de aprobaciones en un solo lugar. Deriva, aprueba o rechaza solicitudes con total transparencia y control, optimizando los flujos de trabajo de tu equipo.

> **Requisito**: Para que funcione, debe existir un flujo de aprobación configurado en Herramientas → Flujos. El flujo define las etapas, responsables y condiciones que los documentos y anticipos deben seguir.

#### Lista de aprobaciones

Tabs de filtro: **Asignadas a mí**, **Aprobadas por mí**, **Aprobadas**, **Enviadas a pago**, **Rechazadas**

Tabla con columnas: ID, Fecha de Creación, Tipo de Documento (badge: "Anticipo", "Documento"), Documento (número), Razón social, Monto a Pagar, Última gestión.

**Funcionalidades**: Filtrar, Ordenar, Buscar, paginación (15 por página), selección individual/masiva ("Seleccionar todo").

> **Tab "Asignadas a mí"**: Muestra únicamente los documentos/anticipos donde el usuario actual es responsable de la etapa actual del flujo. Cada usuario solo ve lo que le corresponde aprobar.

#### Detalle de aprobación — Anticipo

Modal que muestra el anticipo en proceso de aprobación:

**Cabecera:**
- Tipo: "Anticipo" con badge identificador.
- Título del anticipo (ej. "Anticipo #111").
- Empresa proveedora y RUT.
- Monto.
- Vencimiento.
- Área para **adjuntar factura** (archivo .pdf o .xml).
- Glosa.

**Flujo de aprobación (panel izquierdo):**
- Visualización vertical del progreso del flujo paso a paso:
  - **Inicio** (check verde cuando completado).
  - **Etapas numeradas**: Cada etapa muestra su nombre, responsable(s) asignado(s) y estado:
    - "En curso" (badge naranja): Etapa actual pendiente de aprobación.
    - "Pendiente": Etapas futuras aún no alcanzadas.
    - Check verde: Etapas ya aprobadas.
  - **Fin** (check verde cuando todo completado).

**Panel derecho:**
- Campos contables:
  - Unidad de negocio (selector).
  - Cuenta contable (selector).
  - Centro de costos (selector).

**Información de pago:**
- Lista de cuentas bancarias del proveedor con selección por radio button.
- Botón **"+ Agregar cuenta"**.
- Cuenta favorita marcada con estrella.

**Panel de Notas y CRM**: Notas + CRM (patrón transversal, ver sección [Patrones Transversales](#patrones-transversales)).
- Historial con eventos del sistema (ej. "Datos de transferencia de Anticipo modificada por @Alejandro a cuenta bancaria...").
- Notas manuales con opción de Editar y Eliminar.

**Acciones (barra inferior):**
- Botón **"Rechazar"** (rojo): Rechaza la aprobación. El elemento vuelve al inicio del flujo.
- Botón **"Aprobar"** (verde): Aprueba la etapa actual y avanza a la siguiente etapa del flujo.

#### Detalle de aprobación — Documento

Modal similar al de anticipo pero para documentos recibidos (facturas):

**Cabecera:**
- Tipo: "Documento Electrónico" con badge (ej. "Factura electrónica").
- Título del documento (ej. "Factura electrónica #987987").
- Empresa proveedora y RUT.
- Indicadores financieros: Monto Facturado, Monto Pagado, Monto a Pagar, Emisión, Vencimiento.
- **Vista previa del PDF**: Miniatura del documento con botón "PDF generado" para descargar.

**Flujo de aprobación (panel izquierdo):**
- Mismo formato que anticipos: Inicio → Etapas → Fin, con checks verdes para aprobadas.

**Panel derecho:**
- Unidad de negocio, Cuenta contable, Centro de costos (selectores).

**Detalle de Productos/Servicios:**
- Tabla con: Cantidad, Descripción, Precio Unitario, Total.
- Subtotal, IVA (19%), **Total a pagar**.

**Información de pago:**
- Cuentas bancarias del proveedor con selección.

**Panel de Notas y CRM**: Historial del sistema registra cada evento (ej. "Factura electrónica aprobada por @Alejandro", "Factura electrónica enviada a pago por @Alejandro").

**Acciones:**
- **"Rechazar"**: Rechaza y reinicia el flujo.
- **"Aprobar"**: Aprueba y avanza a la siguiente etapa. Si es la última etapa, el documento/anticipo queda aprobado y puede ser enviado a pago.

#### Flujo completo: De aprobación a pago

1. Se crea un **documento recibido** o **anticipo** en Por Pagar.
2. El elemento entra al **flujo de aprobación** configurado en Herramientas → Flujos.
3. Aparece en **Aprobaciones** (Por Pagar) asignado al responsable de la primera etapa.
4. El responsable **aprueba** (avanza) o **rechaza** (vuelve al inicio) en cada etapa.
5. Si hay ramas condicionales (ej. monto > 100), el flujo sigue el camino correspondiente.
6. Una vez aprobado en todas las etapas, el elemento puede ser **enviado a pago**.
7. Se genera un **pago realizado** (sección 3.6) que luego puede ser conciliado.

### 3.4 Contactos

Representan a las personas de contacto dentro de cada empresa proveedora. Equivalente a Contactos de Por Cobrar pero vinculados a proveedores en lugar de clientes. Son el destino de todas las comunicaciones que se realizan a través del CRM hacia proveedores.

**Descripción**: Accede a perfiles completos de los contactos de tus proveedores, con información clave y el historial de todas las gestiones.

#### Lista de contactos

Tabla con columnas: Estado, Nombre, Apellido, Cargo, Área, Compañía, Emails, Teléfonos, Última gestión, Respuesta última gestión, Fecha mejor respuesta, Mejor respuesta.

**Funcionalidades**: Filtrar, Ordenar, Buscar, paginación (15 por página), selección individual/masiva.

**Acciones**:
- **Importar**: Carga masiva de contactos de proveedores (vía Importaciones y Exportaciones).
- **+ Agregar Contacto**: Creación manual.

#### Creación de contacto

Modal **"Agregar Contacto"** con campos:

- ***Proveedor** (selector, obligatorio): Selecciona a qué proveedor pertenece este contacto.
- ***Nombre** (obligatorio).
- ***Apellido** (obligatorio).
- Cargo (opcional).
- Área (opcional).
- ***Email** (obligatorio).
- Celular (opcional): Selector de código de país (ej. +56) + número de teléfono.
- Botones: **Cancelar** | **Agregar contacto**.

#### Detalle del contacto

Panel modal con link **"Ir al contacto"** para vista completa.

**Cabecera:**
- Nombre completo del contacto.
- Empresa asociada (nombre o "null" si no se ha completado) con identificador del proveedor (RUT/RUC).

**Acciones rápidas (CRM):**
- Crear Nota, SenaChat, Enviar Email, Enviar SMS, Llamar, Más (WhatsApp).

**Panel de Notas y CRM (lateral derecho):** Notas + CRM (patrón transversal, ver sección [Patrones Transversales](#patrones-transversales)).

**Información del contacto** (con botón "Editar"):
- Nombre, Apellido, Cargo, Área, Empresa, Emails, Teléfonos, Última gestión, Respuesta última gestión.

**Personalizables** (colapsable):
- Campos custom definidos en Configuración → Propiedades Personalizables para el objeto "Contacto".

**Emails:**
- Tabla con: Nombre empresa, ID empresa, Email, Última gestión, Respuesta última gestión.
- Botón **"+ Nuevo email"** para agregar emails adicionales.
- Filtrar, Ordenar, Buscar, paginación.

**Teléfonos:**
- Tabla con: Nombre empresa, ID empresa, Número, Última gestión, Respuesta última gestión.
- Filtrar, Ordenar, Buscar, paginación.

> **Nota**: Un contacto puede tener múltiples emails y múltiples teléfonos, cada uno asociado a una empresa proveedora diferente. Esto permite que un mismo contacto represente a una persona que trabaja con varios proveedores.

### 3.5 Compromisos de pago

*(Pendiente de detalle — equivalente a Compromisos de pago de Por Cobrar)*

### 3.6 Pagos realizados

Representa los pagos que la empresa realiza hacia sus proveedores para saldar documentos recibidos. Es el equivalente de "Pagos recibidos" (Por Cobrar) pero desde la perspectiva de cuentas por pagar.

**Descripción**: Revisa el estado de tus pagos, confirma detalles y sigue los pasos para completar cada operación de manera segura y eficiente.

> **Diferencia clave**: En Por Cobrar los pagos son "recibidos" (clientes pagan a la empresa). En Por Pagar los pagos son "realizados" (la empresa paga a proveedores). Los anticipos aprobados también se convierten en pagos realizados.

#### Lista de pagos realizados

Tabs de filtro por estado: **Pendientes**, **Nominados**, **Rechazados**, **Conciliado**, **Completado**

Tabla con columnas: ID, Emisor, Receptor, Origen (Documento, Anticipo, Pago), Folio, Sociedad, Monto Total, Monto Disponible, Monto No Disponible, Número de Documento, Glosa.

**Funcionalidades**: Filtrar, Ordenar, Buscar, paginación (15 por página), selección individual/masiva, indicador de última actualización.

Botón **"Crear Pago"**. Link **"¿Cómo crear un pago?"** (ayuda contextual).

> **Columna Origen**: Indica de dónde proviene el pago — "Documento" (pago directo de un documento recibido), "Anticipo" (anticipo aprobado convertido en pago), o "Pago" (pago manual).

#### Creación de pago

Modal **"Crear Pago"** con campos:

- **Tipo de Pago** (selector): Ej. TRANS. BANCARIA.
- **Estado** (selector): Ej. Informado.
- ***Emisor** (selector, obligatorio): Empresa que emite el pago (la empresa usuaria, preseleccionada).
- ***Receptor** (selector, obligatorio): Proveedor que recibe el pago.
- ***Identificador** (obligatorio): Número o código identificador del pago.
- ***Fecha de Pago** (obligatorio).
- ***Moneda** (selector): CLP, UF, PEN, USD, etc. según país.
- ***Monto** (obligatorio).
- ***Glosa** (obligatorio): Descripción del pago.
- **Notas** (opcional): Campo de texto con opción de adjuntar archivos.
- Botones: **Cancelar** | **Guardar**.

#### Estados del pago realizado

| Estado | Descripción |
|--------|-------------|
| **Pendiente** | Pago registrado pero aún no procesado |
| **Nominado** | Pago asignado/nominado para su procesamiento |
| **Rechazado** | Pago rechazado en el proceso de validación |
| **Conciliado** | Pago incluido en una conciliación con documentos |
| **Completado** | Pago confirmado como correcto y finalizado |

#### Detalle del pago realizado

Vista completa (página dedicada) con breadcrumb: Por Pagar > Pagos > Pago #[número].

**Cabecera:**
- **Monto a pagar**: Monto total destacado.

**Datos del compromiso de transferencia:**
- Emisor (quien paga, editable con icono de lápiz).
- Receptor (quien recibe).
- Monto.
- Medio de pago (ej. Transferencia).
- Banco (ej. Banco BICE).
- Cuenta destino (número de cuenta).
- Fecha de creación.
- ID del pago.
- Glosa.
- Estado (badge de color, ej. "Informado").

**Detalle de Productos/Servicios:**
- Tabla con: Cantidad, Descripción, Precio Unitario (moneda), Total (moneda).
- Subtotal.
- IVA (19% para Chile, 18% IGV para Perú).
- **Total a pagar**.

**Personalizables** (colapsable):
- Campos custom definidos en Configuración → Propiedades Personalizables para el objeto "Pagos realizados".

**Información de pago:**
- Lista de cuentas bancarias del proveedor (receptor).
- Cada cuenta muestra: Nombre titular, tipo de cuenta (ej. "CUENTA CORRIENTE SIMPLE"), número de cuenta.
- Radio button para seleccionar la cuenta destino del pago.
- Icono de estrella para marcar cuenta favorita.
- Botón **"+ Agregar cuenta"**.

**Conciliaciones relacionadas:**
- Tabs: **Todas**, **Pendientes**, **Aprobadas**, **Rechazadas**, **Anuladas**.
- Tabla con: ID, Creado por, Razón social Emisor, RUT Emisor, Fecha de creación, Monto pagos, Monto documentos, Responsable, Supervisor, Estado.
- Botón **"Crear conciliación"**.
- Filtros, ordenamiento, búsqueda y paginación.

**Panel de Notas y CRM (lateral derecho):** Notas + CRM (patrón transversal, ver sección [Patrones Transversales](#patrones-transversales)).
- Historial registra cambios de campos, actualizaciones y acciones del sistema con usuario responsable (ej. "Campo 'test' actualizado de: 'Sin datos previos' a '222' por @Alejandro").

#### Relaciones del pago realizado

- **Pago → Proveedor**: El pago está relacionado con el proveedor (receptor del pago). A través del proveedor se accede a sus contactos para comunicación vía CRM.
- **Pago → Conciliación**: Un pago puede estar en una o más conciliaciones.
- **Pago ← Anticipo**: Los anticipos aprobados se convierten en pagos realizados (origen "Anticipo").
- **Pago ← Documento**: Pagos generados directamente desde documentos recibidos (origen "Documento").

### 3.7 Nóminas

Agrupación de pagos realizados que se empaquetan para ser procesados por el banco. La nómina genera un archivo TXT con los códigos de cada pago, el cual se entrega al banco para que ejecute las transferencias correspondientes.

**Descripción**: Visualizá y gestioná tus nóminas según su estado: Todas, Creadas, En banco, Rechazadas o Aprobadas. Usá las opciones de orden, filtro y búsqueda para encontrar fácilmente la información. Si no hay registros, se mostrará un mensaje indicándolo.

> **Concepto clave**: Una nómina NO se crea desde esta sección directamente. Se crea desde **Pagos realizados** (sección 3.6) seleccionando uno o más pagos y usando la acción **"Pagar por nómina"** del menú "Acciones". Esto agrupa los pagos seleccionados en una nueva nómina.

Botón **"Configurar nómina"** (esquina superior derecha).

#### Lista de nóminas

Tabs de filtro por estado: **Todas**, **Creadas**, **En banco**, **Completadas**

Tabla con columnas: Nº Nómina (ej. NOM-106), Estado (badge: Creada, Completada), Tipo (ej. PROVEEDORES), Monto (ej. $107.100), Moneda (ej. CLP), Creado (fecha y hora), Modificado (fecha y hora).

**Funcionalidades**: Filtrar, Ordenar, Buscar, paginación (15 por página), selección individual/masiva, icono de descarga por fila (descarga el archivo TXT de la nómina).

#### Estados de la nómina

| Estado | Descripción |
|--------|-------------|
| **Creada** | Nómina generada con los pagos agrupados, pendiente de envío al banco |
| **En banco** | Nómina enviada al banco para su procesamiento |
| **Completada** | Banco confirmó que los pagos fueron ejecutados |

#### Detalle de la nómina

Modal con link **"Ir a la nómina"** para vista completa.

**Cabecera:**
- Número de nómina (ej. "NOM-106") con badge de estado (ej. "Creada").
- Botón **"Descargar (.txt)"**: Genera y descarga el archivo TXT con los códigos de pago para entregar al banco.

**Monto a pagar**: Monto total destacado (suma de todos los pagos agrupados).

**Información General:**
- ID de la nómina.
- Creado por (usuario que generó la nómina).
- Fecha de creación.
- Monto a pagar.
- Estado (badge de color).

**Panel de Notas y CRM (lateral derecho):** Notas + CRM (patrón transversal, ver sección [Patrones Transversales](#patrones-transversales)).
- Tabs: **Historial** | **Documentos**.
- Historial del sistema registra automáticamente eventos.

**Pagos asociados:**
- Tabla con los pagos que componen la nómina.
- Columnas: ID, Estado (badge: Nominado), Emisor, Receptor, Origen (badge: Factura, Anticipo, Pago), Folio, Monto Total, Nómina (número), Monto.
- Filtrar, Ordenar, Buscar, paginación (15 por página), selección individual.

**Aprobaciones relacionadas:**
- Tabla con las aprobaciones vinculadas a los pagos de la nómina.
- Columnas: ID, Fecha de Creación, Tipo de Documento (badge: Documento, Anticipo), Documento (número), Razón social.
- Filtrar, Ordenar, Buscar, paginación (15 por página).

#### Flujo: De pagos a nómina

1. Se seleccionan uno o más **pagos realizados** en la sección 3.6.
2. Se usa la acción **"Pagar por nómina"** desde el menú "Acciones".
3. Se crea la nómina con estado **"Creada"** agrupando los pagos seleccionados.
4. Los pagos agrupados cambian su estado a **"Nominado"**.
5. Se descarga el archivo **TXT** con los códigos de pago.
6. Se entrega el TXT al banco para procesamiento.
7. La nómina pasa a estado **"En banco"**.
8. Una vez confirmados los pagos por el banco, la nómina pasa a **"Completada"**.

### 3.8 Anticipos

Documentos que registran pagos adelantados realizados a proveedores antes de recibir el bien o servicio. Los anticipos son exclusivos de Por Pagar (no existen en Por Cobrar) y eventualmente se convierten en pagos a través del flujo de aprobación.

**Descripción**: Visualiza y gestiona tus anticipos según su estado: Todas, Creadas, Rechazadas o Aprobadas. Usa las opciones de orden, filtro y búsqueda para encontrar fácilmente la información.

> **Flujo clave**: Anticipo → Aprobación → Pago. Los anticipos necesitan pasar por el proceso de Aprobaciones (sección 3.3) para convertirse en pagos registrados.

#### Lista de anticipos

Tabs de filtro por estado: **Pendientes**, **Aprobadas**, **Archivadas**, **Pagadas**, **Reconciliadas**

Tabla con columnas: ID, Tipo, Estado, Identificador (RUT del proveedor), Empresa, Responsable, Email, Descripción, Fecha estimada de pago, Monto, Creado.

**Funcionalidades**: Filtrar, Ordenar, Buscar, paginación (15 por página), selección individual/masiva ("Seleccionar todo"), icono de copia por fila.

Botón **"Crear anticipo"**.

#### Creación de anticipo

Modal **"Crear anticipo"** con campos:

- ***RUT del proveedor** (selector, obligatorio): Selecciona a qué proveedor corresponde el anticipo.
- ***Monto** (obligatorio).
- ***Moneda** (selector, obligatorio): CLP, UF, PEN, USD, etc. según país.
- ***Número** (obligatorio): Número identificador del anticipo.
- ***Tipo** (selector, obligatorio): Tipo de anticipo (ej. "Anticipo").
- **Fecha** (selector "Fecha límite"): Fecha estimada de pago.
- **Descripción** (opcional): Texto libre.
- **Notas** (opcional): Campo de texto con opción de adjuntar archivos.
- Botón **"Guardar"**.

#### Detalle del anticipo

Vista completa (página dedicada, no modal) con breadcrumb: Por Pagar > Anticipos > Anticipo #[número].

**Cabecera:**
- Título: "Anticipo #[número]" con badge de estado (ej. "Pendiente").
- **Monto a pagar**: Monto total del anticipo.

**Información General:**
- ID del anticipo.
- Identificador (RUT/RUC del proveedor).
- Proveedor (nombre).
- Fecha de creación.
- Fecha de pago estimada.
- Monto a pagar.
- Estado (badge de color).

**Panel de Notas y CRM (lateral derecho):** Notas + CRM (patrón transversal, ver sección [Patrones Transversales](#patrones-transversales)).
- Historial del sistema registra automáticamente eventos (ej. "Anticipo creada con éxito").

> **Nota**: Actualmente los anticipos no soportan campos personalizables (Propiedades Personalizables). Esta funcionalidad podría implementarse a futuro.

---

## 4. Herramientas

Módulo principal que agrupa herramientas complementarias para la gestión de cobranza y operaciones. Contiene las siguientes sub-secciones:

- **CRM**
- **Flujos**
- **Importaciones y Exportaciones**
- **Portal de Pagos**
- **Conciliaciones**
- **Gestión de Tareas**
- **Registros de Integración** *(pendiente de detalle)*
- **Plantillas**

---

### 4.1 CRM (módulo dedicado)

Centro de comunicaciones unificado que agrupa todos los canales de contacto con clientes y proveedores. Es la vista centralizada del mismo patrón CRM transversal descrito en la sección [Patrones Transversales](#patrones-transversales), pero como herramienta independiente dentro de Herramientas.

> **Relación con el CRM transversal**: El CRM que aparece embebido en cada entidad (Clientes, Documentos, Contactos, Pagos, Compromisos de pago) es un atajo al mismo sistema. Este módulo en Herramientas es la vista completa y dedicada.

#### Vista principal

- **Dos tabs superiores**: **Clientes** | **Proveedores** — permiten alternar entre los contactos de clientes (Por Cobrar) y los contactos de proveedores (Por Pagar).
- **Panel izquierdo**: Lista de contactos con:
  - Filtrar, Ordenar, Buscar.
  - Cada contacto muestra: nombre, empresa asociada, estado de mensajes ("Sin mensajes") e indicador de actividad ("Sin actividad").
- **Panel derecho**: Al seleccionar un contacto, se despliega su panel de comunicación con los canales disponibles.

#### Canales de comunicación (tabs)

Al seleccionar un contacto, el panel derecho muestra las siguientes pestañas:

| Canal | Descripción | Acciones principales |
|-------|-------------|---------------------|
| **Todos** | Vista consolidada de todos los mensajes y gestiones del contacto, sin importar el canal | Lectura del historial unificado |
| **SenaChat** | Chat interno de la plataforma | Mensajería interna |
| **Mail** | Correo electrónico | **Redactar Correo** + **Nueva Gestión** |
| **SMS** | Mensajes de texto | Envío de SMS con input de texto + **Generar con IA** |
| **Llamada** | Llamadas telefónicas | **Iniciar Llamada** + **Nueva Gestión** |
| **WhatsApp** | Mensajería WhatsApp en tiempo real | Chat en tiempo real + **Generar con IA** |

#### Canal Mail — Detalle

El canal Mail ofrece dos acciones en la barra inferior:

##### Redactar Correo

Abre un modal "Nuevo Correo" con:

- **De**: Dirección del remitente (la cuenta SMTP configurada en Integraciones, ej. `hola@somossena.com`).
- **Para**: Dirección del contacto seleccionado (preseleccionada).
- **Cc**: Campo opcional para copias.
- **Asunto**: Campo libre.
- **Cuerpo del correo**: Editor de texto enriquecido con barra de herramientas:
  - Formato: negrita, cursiva, tachado.
  - Tipografía: selector de fuente (Sans Serif, etc.) y tamaño (12px, etc.).
  - Color de texto.
  - Listas (ordenadas y no ordenadas).
  - Alineación (izquierda, centro, derecha, justificado).
- **Adjuntos**: Botón para adjuntar archivos.
- **Botón "Enviar"** para despachar el correo.
- Estado inferior: "Redactando Correo...".

##### Nueva Gestión (Mail)

Abre un modal lateral "Nueva Gestión" con:

- Nombre del contacto.
- Selector de email del contacto (dropdown si tiene múltiples).
- Campo **Nota** para registrar observaciones de la gestión.
- Icono de **adjuntos** (clip).
- Icono de **configuración** (engranaje) → abre el modal de **Tipificaciones de Gestión**.
- Botones: **Descartar** | **Guardar gestión**.

#### Canal SMS — Detalle

- **Aviso importante**: Banner amarillo que indica "El SMS no puede enviarse fuera del horario de 7:00 am a 8:00 pm." (restricción del proveedor de SMS, aplica tanto en Perú como en Chile).
- **Input de mensaje**: Campo de texto "Escribe un mensaje..." con botón de envío.
- **Generar con IA**: Botón que abre un modal "Generar respuesta con IA" con tres modos:
  - **Redactar**: Genera un mensaje nuevo a partir de contexto.
  - **Reescribir**: Reformula un mensaje existente.
  - **Responder**: Genera una respuesta a un mensaje recibido.
  - Campos de configuración:
    - **Contexto**: Texto libre para dar indicaciones a la IA.
    - **Tono**: Selector (Formal, etc.).
    - **Largo**: Selector (Medio y Suficiente, etc.).
  - Botón **"Generar Respuesta"**.
- Historial de mensajes mostrado como burbujas de conversación con fecha y hora.

#### Canal Llamada — Detalle

Ofrece dos acciones en la barra inferior:

##### Iniciar Llamada

Al presionar "Iniciar Llamada":

- Se despliega un panel inferior con la interfaz de llamada:
  - Nombre del contacto y etiqueta "Gestión de llamada".
  - **Controles de llamada**: botones de pausa, llamar (verde) y colgar (rojo).
  - Selector de **número telefónico** del contacto (dropdown si tiene múltiples).
  - Campo **"Escribe aquí tus notas..."** para tomar notas durante la llamada.
  - Botón **"Guardar gestión"** para registrar la gestión al finalizar.
  - Estado inferior: "Llamada en curso...".

##### Nueva Gestión (Llamada)

Misma estructura que la gestión de Mail pero con selector de **número telefónico** en lugar de email:

- Nombre del contacto.
- Selector de teléfono del contacto.
- Campo Nota.
- Iconos de adjuntos y configuración (tipificaciones).
- Botones: **Descartar** | **Guardar gestión**.
- Botón **"Iniciar Llamada"** disponible desde la gestión.

#### Canal WhatsApp — Detalle

- Chat en **tiempo real** con el contacto vía su número de WhatsApp.
- Input de mensaje: "Escribe un mensaje..." con botón de envío.
- **Generar con IA**: Mismo modal de generación con IA disponible en SMS (Redactar, Reescribir, Responder con contexto, tono y largo).
- Historial de mensajes mostrado como conversación.

#### Tipificaciones de Gestión

Las gestiones de los canales **Mail** y **Llamada** pueden configurarse con tipificaciones personalizables. Se accede desde el icono de engranaje (configuración) dentro del modal "Nueva Gestión".

Modal **"Configurar tipificaciones de Gestión"** (indica el canal, ej. "Canal Email"):

##### Estructura de tipificaciones

- Botón **"+ Agregar Nivel"** para crear niveles jerárquicos.
- Cada nivel se muestra en una lista a la izquierda.
- Al seleccionar un nivel, se muestra el formulario de configuración a la derecha:
  - **Nombre**: Nombre del nivel/tipificación.
  - **Nivel padre**: Selector para establecer jerarquía (niveles anidados).
  - **Subnivel**: Campo de texto + botón "Agregar" para crear subniveles rápidamente.
  - **Obligatorio**: Checkbox para marcar si es requerido al guardar la gestión.

##### Opciones adicionales de la gestión

- **Personalizables**: Sección con botón "Nuevo campo" para agregar campos personalizados a la gestión (usa el mismo sistema de Propiedades Personalizables).
- **¿Vincular documentos a la gestión?** (toggle): Permite seleccionar y asociar facturas dentro de la gestión.
- **Crear compromiso de pago** (toggle): Permite seleccionar y asociar compromisos de pago dentro de la gestión.

Botones: **Cancelar** | **Guardar configuración**.

> **Nota**: Las tipificaciones se configuran por canal. La estructura de niveles permite crear árboles de clasificación para categorizar las gestiones realizadas (ej. Nivel 1: "Resultado de contacto" → Subniveles: "Contactado", "No contestó", "Buzón de voz", etc.).

---

### 4.2 Flujos

Permite diseñar y personalizar flujos de trabajo automatizados mediante un editor visual de nodos. Actualmente enfocado en flujos de aprobación para el módulo Por Pagar.

**Descripción**: Gestiona y personaliza flujos automatizados. Aprobaciones & nóminas, solicitudes de pedido y ventas.

#### Vista principal

Muestra las plantillas de flujos disponibles como tarjetas:

- **Flujo de aprobaciones y Nóminas**: "Organiza pasos y responsables para tus aprobaciones y personaliza tus nóminas."
  - Botón **"Personalizar"** para acceder al editor visual.

#### Editor visual de flujos (React Flow)

Al personalizar un flujo, se abre un editor visual tipo diagrama de nodos con dos tabs:

- **Flujo de aprobaciones de documentos**: Define el flujo de aprobación para documentos recibidos (Por Pagar).
- **Flujo de aprobaciones de anticipos**: Define el flujo de aprobación para anticipos (Por Pagar).

##### Estructura del flujo

Cada flujo tiene una estructura de nodos conectados:

1. **Nodo Inicio** (verde): Punto de entrada del flujo.
2. **Nodos de Etapa**: Pasos intermedios donde se ejecutan las aprobaciones.
3. **Nodos de Rama** (condicionales): Bifurcaciones basadas en condiciones (ej. monto > 100, monto < 100).
4. **Nodo Terminado** (verde): Punto final del flujo.
5. **Botones "+"**: Entre cada nodo, permiten agregar nuevas etapas o ramas.

##### Configuración de una Etapa

Al hacer clic en un nodo de etapa, se abre un panel lateral de configuración:

- **Nombre de la etapa** (editable con icono de lápiz).
- **Responsables**: Usuarios asignados a aprobar esta etapa. Se puede elegir más de uno.
  - **Solo uno aprueba**: Basta con que un responsable apruebe para avanzar.
  - **Todos aprueban**: Todos los responsables deben aprobar para avanzar.
  - Selector de responsables (usuarios del sistema).
- **Cuando sucede esta etapa**:
  - **Sucede siempre**: La etapa se ejecuta sin condiciones.
  - **Sucede con condiciones**: La etapa se ejecuta solo si se cumplen condiciones específicas (ej. monto mayor/menor a cierto valor).
- **Tiempo límite otorgado (SLA)**:
  - **Sin tiempo límite**: La etapa puede permanecer pendiente indefinidamente.
  - **Con tiempo límite**: Establece un plazo máximo para completar la etapa.
- **Notificación**:
  - **Desactivado**: No se enviarán notificaciones.
  - **Activado**: Se enviarán notificaciones a los responsables (aviso respecto al vencimiento).
- Botón **"Guardar cambios"**.

##### Ramas condicionales

Las ramas permiten bifurcar el flujo según condiciones:

- Cada rama tiene un nombre (ej. ">100", "< 100") y muestra "Sucede con condiciones (1 condición)".
- Después de una rama, se agregan etapas específicas para esa condición.
- Todas las ramas convergen de vuelta al flujo principal antes del nodo "Terminado".

Botón **"Guardar flujo"** para persistir la configuración completa del flujo.

> **Controles del editor**: Zoom in (+), Zoom out (-), Ajustar vista, Bloquear/desbloquear posiciones. Construido con React Flow.

> **Relación con Aprobaciones**: Los flujos definidos aquí determinan los pasos y condiciones que seguirán los documentos recibidos y anticipos en la sección Aprobaciones de Por Pagar (sección 3.3).

---

### 4.3 Importaciones y Exportaciones

Módulo centralizado para la carga masiva de datos y el registro de todas las exportaciones realizadas desde la plataforma.

**Descripción**: Revisa y administra los archivos importados por tu equipo, como contactos, documentos, clientes y pagos, para un mejor control de la información.

#### Tab Importaciones

Vista de lista con todas las importaciones realizadas.

**Tabla con columnas:**

| Columna | Descripción |
|---------|-------------|
| ID | Identificador único de la importación |
| Tipo | Tipo de importación (badge de color, ej. "Pago bbva descuento", "Pago scotiabank descuento") |
| Usuario | Usuario que ejecutó la importación |
| Fecha Inicio | Fecha y hora de inicio del proceso |
| Fecha Fin | Fecha y hora de finalización del proceso |
| Estado | Estado del proceso (ej. "Completo") |
| Observaciones | Resultado del análisis (ej. "Análisis completado: Se analizaron 20 registros.") |
| Resultado | URL del archivo de resultado generado (descargable) |

**Funcionalidades**: Filtrar, Ordenar, Buscar, paginación (configurable: 15 por página), icono de descarga por fila.

##### Crear Importación

Botón **"+ Importar Archivo"** que abre el modal "Crear Importación":

- **Tipo** (selector con búsqueda): Define qué tipo de datos se importarán. Tipos disponibles:
  - **Carga contactos de proveedor**: Importa contactos asociados a proveedores.
  - **Carga contactos de clientes**: Importa contactos asociados a clientes.
  - **PAGO BCP**: Archivo de pagos del banco BCP.
  - **PAGO BBVA**: Archivo de pagos del banco BBVA.
  - **PAGO INTERBANK**: Archivo de pagos del banco Interbank.
  - **PAGO SCOTIABANK**: Archivo de pagos del banco Scotiabank.
  - Tipos personalizados por empresa (formatos de pago propios del cliente).
- **Archivo adjunto**: Selección del archivo Excel (.xlsx) o CSV a importar.
- **Comentarios** (opcional): Notas adicionales sobre la importación.
- Botones: **Volver** | **Guardar importación**.

> **Nota sobre formatos**: Cada tipo de importación tiene su propio formato estándar de Excel. Para empresas con formatos propios de archivos de pago, se crean adaptadores personalizados que transforman su formato al estándar interno de Sena.

> **Nota sobre importación de datos**: Además de pagos y contactos, a través de este módulo también se importan documentos (facturas) y clientes/proveedores de forma masiva. Al importar documentos, si el cliente/proveedor no existe, se crea automáticamente.

#### Tab Exportaciones

Vista de lista que registra todas las exportaciones realizadas desde cualquier parte de la plataforma.

**Tabla con columnas:**

| Columna | Descripción |
|---------|-------------|
| ID | Identificador único de la exportación |
| HASH | Identificador hash único del proceso |
| Usuario | Usuario que solicitó la exportación |
| Fecha Inicio | Fecha y hora de inicio del proceso |
| Fecha Fin | Fecha y hora de finalización del proceso |
| Tipo | Tipo de exportación (ej. "sisqeco") |
| Filtros aplicados | Filtros que se usaron al momento de exportar |
| Estado | Estado del proceso (ej. "Completado") |
| Resultado | Cantidad de registros exportados (ej. "3 registros exportados") |
| Nombre Archivo | Nombre del archivo generado (ej. "pagos_20260219165511.xlsx", "facturas_20260128193221.xlsx") |

**Funcionalidades**: Filtrar, Ordenar, Buscar, paginación (configurable: 15 por página), icono de descarga por fila para descargar el archivo exportado.

> **Nota**: Las exportaciones se generan desde distintas vistas de la plataforma (listas de documentos, pagos, etc.) y quedan registradas aquí como historial centralizado. Los archivos se generan en formato `.xlsx` y se almacenan en la nube para su posterior descarga.

---

### 4.4 Portal de Pagos

Herramienta que permite a una empresa realizar pagos directos a sus proveedores a través de una pasarela de pago integrada. El portal guía al usuario en un proceso de 2 pasos para seleccionar al proveedor, los documentos a pagar y ejecutar el pago.

**Descripción**: Gestiona y realiza tus pagos fácilmente. Revisa el estado de tus transacciones, confirma detalles y sigue los pasos para completar cada operación de manera segura y eficiente.

Breadcrumb: Herramientas > Portal de Pagos

Link **"Guía de Ayuda"** (ayuda contextual).

#### Contexto de uso

El Portal de Pagos se activa a partir del flujo de cobro entre empresas dentro de Sena. El flujo completo es:

1. La **empresa cobradora** (Empresa A) gestiona sus cuentas por cobrar en Sena y envía un **estado de deuda** al contacto de su cliente (Empresa B) mediante correo electrónico.
2. El contacto de la Empresa B recibe el correo con un link de acceso al Portal de Pagos.
3. Al abrir el link:
   - Si el contacto **no tiene cuenta en Sena**, se le **crea automáticamente** una cuenta de empresa.
   - Si el contacto **ya tiene cuenta en Sena**, se le solicita iniciar sesión.
4. Una vez dentro, desde la perspectiva de la cuenta de la Empresa B, la Empresa A aparece como su **proveedor**.
5. El contacto de la Empresa B ingresa al **Portal de Pagos**, visualiza las facturas pendientes y selecciona las que desea pagar.
6. Elige el método de pago (**Khipu**) y completa la transacción directamente desde su banco.

> **Requisito para el proveedor (cobrador)**: La empresa que recibe el pago debe tener configurada la integración con Khipu (en Configuración → Integraciones) para que el flujo de pago funcione.

#### Pasarela de pago

| Pasarela | Estado | Descripción |
|----------|--------|-------------|
| **Khipu** | Disponible | Pasarela de pago que permite realizar transferencias electrónicas directamente desde el banco del pagador. Es el método de pago principal del portal. |

> **Requisito**: El proveedor (empresa que recibe el pago) debe tener su cuenta Khipu configurada y activa en Configuración → Integraciones. Si el proveedor no tiene Khipu configurado, la opción de pago aparece deshabilitada con el mensaje: _"Esta empresa aún no tiene Khipu configurado como método de cobro."_

#### Modelo de proyección: estados del documento tras el pago

El portal utiliza un **modelo de proyección** para manejar los estados de las facturas en ambos lados de la relación comercial. Los estados difieren intencionalmente entre pagador y receptor hasta que Khipu confirma la transacción:

| Momento | Estado en cuenta del **pagador** (Empresa B) | Estado en cuenta del **receptor** (Empresa A) |
|---------|----------------------------------------------|-----------------------------------------------|
| Después de ejecutar el pago | Factura marcada como **pagada** de inmediato | Factura permanece en estado **pendiente/revisión** |
| Khipu confirma el pago (callback `OK`) | Sigue como **pagada** | Factura se actualiza a **pagada** |
| Khipu rechaza el pago (callback `ERROR`) | Factura **regresa al estado anterior** (pendiente) | Sin cambios (nunca se actualizó) |

**Resumen del comportamiento:**
- El pagador (Empresa B) ve sus facturas como pagadas de inmediato tras ejecutar el pago.
- La empresa cobradora (Empresa A) las ve pendientes mientras espera la confirmación de Khipu.
- Cuando Khipu confirma: la Empresa A también las ve como pagadas.
- Si Khipu falla: las facturas en la cuenta de la Empresa B **vuelven a estado pendiente**.

> **Nota**: La diferencia de estado entre pagador y receptor es temporal y esperada. Es el comportamiento correcto del sistema durante el tiempo de confirmación de Khipu.

#### Wizard de pago (2 pasos)

##### Paso 1 de 2: Selección de proveedor y documentos

"Elige al proveedor y los documentos que deseas pagar. Verifica los montos y asegúrate de seleccionar todos los documentos necesarios."

**Selector de Proveedor/Cliente** (dropdown desplegable con búsqueda infinita):
- Lista de proveedores/clientes con: Razón social, RUT e indicador de deuda activa.
- Restricción: solo se pueden seleccionar documentos de **una misma moneda** por pago. Si el proveedor tiene facturas en distintas monedas, el botón "Seleccionar todo" queda deshabilitado con el mensaje: _"Tiene diferentes tipos de monedas"_.

**Tabla de documentos** (aparece al seleccionar un proveedor):

Tabla con columnas: Folio, Origen (Manual, SII), Estado, Sub Estado, Emisión (fecha), Etapa, Sub Etapa, Vencimiento (fecha).

- Selección individual/masiva con checkboxes.
- Filtrar, Ordenar, Buscar, paginación.

**Panel lateral "Resumen a Pagar"** (derecha, persistente en todos los pasos):
- Lista de documentos seleccionados con su monto individual.
- **Total de documentos [moneda] (N)**: Suma total a pagar.
- Texto por defecto cuando no hay selección: "Seleccione un documento o convenio para visualizar el monto total a pagar."

##### Paso 2 de 2: Método de pago y ejecución

"Selecciona el método de pago para completar la operación."

**Método de pago disponible: Khipu**
- Habilitado únicamente si el proveedor tiene Khipu configurado y activo.
- Al seleccionarlo se muestra: _"Al continuar, se abrirá una ventana segura de Khipu donde podrás completar el pago directamente desde tu banco."_
- Botón de acción: **"Pagar con Khipu"**.

**Flujo de ejecución al hacer clic en "Pagar con Khipu":**
1. Se crea la transacción en Khipu con el monto total y la referencia de los documentos seleccionados.
2. Se abre el **modal embebido de Khipu** dentro de la plataforma (sin redirecciones externas).
3. El usuario completa el pago directamente desde su banco dentro del modal.
4. Khipu responde con un callback:
   - `OK` → pago exitoso: se registra en Sena, las facturas del pagador se marcan como pagadas, el portal se reinicia.
   - `ERROR` → error en el pago: se muestra mensaje de error, el portal permanece en paso 2 para reintentar.
   - `WARNING` → pago en proceso: el banco está validando la transacción, se muestra aviso al usuario.
   - `CONTINUE` → acción requerida: el banco necesita una confirmación adicional del usuario (ej. autorización en app bancaria).

**Panel lateral "Resumen a Pagar"**: Se mantiene visible con los documentos y totales del paso anterior.

---

### 4.5 Conciliaciones

Módulo que permite hacer el match entre documentos (facturas) y pagos para ir descontando montos y mantener el control financiero. Las conciliaciones siempre son de un mismo cliente o proveedor — no se pueden mezclar documentos y pagos de distintas entidades. Además, los documentos y pagos deben ser de la misma moneda.

**Descripción**: Administra y crea conciliaciones para mantener el control entre tus pagos y documentos.

Breadcrumb: Herramientas > Conciliaciones

#### Vista principal

Dos tarjetas que separan los dos ámbitos de conciliación:

| Tipo | Descripción |
|------|-------------|
| **Conciliaciones de Proveedores** | Administra documentos y pagos de proveedores. Concilia documentos recibidos con pagos realizados (Por Pagar). |
| **Conciliaciones de Clientes** | Administra documentos y cobros de clientes. Concilia documentos emitidos (facturas) con pagos recibidos (Por Cobrar). |

Al seleccionar un tipo, se accede a la lista de conciliaciones correspondiente.

#### Lista de conciliaciones

Tabs de filtro por estado: **Todas**, **Pendientes**, **Aprobadas**, **Rechazadas**, **Anuladas**

Tabla con columnas: ID, Creado por, Razón social Emisor, RUT Emisor, Fecha de creación, Monto pagos, Monto documentos, Responsable, Supervisor, Estado.

**Funcionalidades**: Filtrar, Ordenar, Buscar, paginación (15 por página), selección individual, icono de acción por fila, indicador de última actualización.

Botón **"Crear conciliación"**. Link **"¿Cómo crear una conciliación?"** (ayuda contextual).

#### Sugerencias de conciliación

Banner superior que aparece cuando el sistema detecta matches automáticos: **"Tienes N sugerencias de conciliación"** — "Generadas automáticamente según tus reglas. Revisalas y aprueba en 1 clic."

**Acciones del banner:**
- **"Volver a generar"**: Recalcula las sugerencias.
- **"Descartar por hoy"**: Oculta las sugerencias por el día.
- **"Revisar"**: Abre la vista de revisión de sugerencias para aprobarlas.

> **Conciliaciones sugeridas — Estado actual**: Actualmente solo opera en **Etapa 1**, que sugiere matches **1 a 1** (una factura con un pago) de tipo **equilibrado** (montos iguales) para un mismo cliente o proveedor. Las etapas 2 y 3 (matches N a M, sobrepago, saldo pendiente) están previstas para implementación futura.

#### Tipos de conciliación (por saldo resultante)

| Tipo | Descripción |
|------|-------------|
| **Equilibrado** | La suma de documentos seleccionados es igual a la suma de pagos seleccionados. Saldo = $0. |
| **Saldo Pendiente** | La suma de documentos es mayor a la de pagos. Queda un saldo pendiente por cubrir con pagos adicionales. |
| **Sobrepago** | La suma de pagos es mayor a la de documentos. El pago excede lo facturado. |

#### Creación de conciliación (Conciliador)

Wizard de 2 pasos en página dedicada.

##### Paso 1 de 2: Selección de cliente/proveedor

"Selecciona al cliente que deseas conciliar sus pagos y documentos. Por defecto estarán ordenados según el Saldo."

Tabla con columnas: RUT, Razón Social, Facturado pendiente, Saldo, Pagado, Conciliado.

- Selección individual mediante radio button (solo uno a la vez).
- Filtrar, Ordenar, Buscar, paginación, indicador de última actualización.
- Botón **"Selecciona un proveedor/cliente para continuar"** (deshabilitado hasta seleccionar) → se convierte en **"Continuar"** al seleccionar.

##### Paso 2 de 2: Selección de documentos y pagos

"Selecciona los documentos y pagos que deseas conciliar. El sistema calculará automáticamente los totales y te mostrará los montos."

Vista dividida en dos paneles lado a lado:

**Panel izquierdo — Documentos:**
- Tabs: **Documentos** | **Compromisos de pago**
- Tabla con columnas: Folio, RUT Receptor, Monto, Fecha de vencimiento.
- Selección individual/masiva con checkboxes. Link **"Seleccionar todo (N)"**.
- Filtrar, Ordenar, Buscar, paginación (15 por página).

**Panel derecho — Pagos Sin Conciliar:**
- Tabla con columnas: ID, Emisor, Receptor, Origen (badge: Pago, Factura, Anticipo).
- Selección individual/masiva con checkboxes. Link **"Seleccionar todo (N)"**.
- Filtrar, Ordenar, Buscar, paginación (15 por página).

**Barra de resumen (inferior fija):**
- **Documentos Seleccionados**: Monto total y cantidad (ej. "$1.234 — Documentos Seleccionados (1)").
- **Pagos Seleccionadas**: Monto total y cantidad (ej. "$555 — Pagos Seleccionadas (1)"). Se resalta en rojo/verde según diferencia.
- **Saldo Pendiente**: Diferencia entre documentos y pagos (ej. "$679 — Saldo Pendiente"). Muestra icono de advertencia si no es equilibrado.
- Botones: **"Volver"** | **"Conciliar Elementos Seleccionados"**.

##### Modal de confirmación

Al presionar "Conciliar Elementos Seleccionados", se abre un modal de confirmación:

**"Confirmar Conciliación Cliente: [NOMBRE]"** — "Por favor revisa los detalles antes de confirmar la conciliación."

- **Aviso de Saldo Pendiente** (si aplica): Banner amarillo indicando "Existe un saldo pendiente de $[monto]. Es posible que se requieran pagos adicionales."
- **Documentos seleccionados**: Lista con detalle de cada documento y su monto. Total de documentos.
- **Pagos seleccionados**: Lista con detalle de cada pago y su monto. Total de pagos.
- **Saldo final**: Monto resultante con indicador "(Pendiente)" si no es equilibrado.
- **Notas** (opcional): Campo de texto con opción de adjuntar archivos.
- Botones: **"Cancelar"** | **"Confirmar Conciliación"**.

#### Estados de la conciliación

| Estado | Descripción |
|--------|-------------|
| **Pendiente** | Conciliación creada, pendiente de revisión y aprobación |
| **Aprobada** | Conciliación revisada y aprobada como correcta |
| **Rechazada** | Conciliación revisada y rechazada (con comentario del motivo) |
| **Anulada** | Conciliación previamente aprobada que fue anulada posteriormente |

#### Detalle de la conciliación

Vista completa (página dedicada) con breadcrumb: Herramientas > Conciliaciones > Cliente/Proveedor > Conciliación #[número].

**Cabecera:**
- Título: "Conciliación #[número]" con badge de estado (ej. "Rechazado").
- RUT del cliente/proveedor.
- Icono de descarga.

**KPIs (tarjetas):**
- **Monto Documentos (N)**: Total de los documentos incluidos.
- **Monto Pagado (N)**: Total de los pagos incluidos.
- **Saldo Equilibrado / Saldo Pendiente / Sobrepago**: Diferencia resultante. Muestra "$0" si es equilibrado, o el monto pendiente/excedente con indicador.

**Información General:**
- ID.
- RUT Cliente/Proveedor.
- Creado por (usuario).
- Supervisor (asignable).
- Responsable (asignable, editable con icono de lápiz).
- Razón social Emisor.
- Fecha de creación.
- Estado de conciliación (badge de color).

**Detalle de Documentos:**
- Tabla con: FA, N° Documento, Origen, Monto a Pagar.
- Total de documentos (suma).

**Detalle de Pagos:**
- Tabla con: ID, Documento SAP, Cta Cte, Sociedad, Monto, Fecha contable.
- Total de pagos (suma).

**Panel de Notas y CRM (lateral derecho):** Notas + CRM (patrón transversal, ver sección [Patrones Transversales](#patrones-transversales)).
- Tabs: **Historial** | **Documentos**.
- Historial del sistema registra automáticamente eventos (ej. "Conciliación creado con éxito", "Conciliación rechazada por @Alejandro con el comentario: [texto]").

#### Relaciones de la conciliación

- **Conciliación → Cliente/Proveedor**: Siempre pertenece a un único cliente o proveedor. No se mezclan entidades.
- **Conciliación → Documentos**: Incluye uno o más documentos emitidos (clientes) o recibidos (proveedores).
- **Conciliación → Pagos**: Incluye uno o más pagos recibidos (clientes) o realizados (proveedores).
- **Conciliación → Compromisos de pago**: Opcionalmente puede incluir compromisos de pago en lugar de o junto con documentos.
- **Moneda**: Los documentos y pagos conciliados deben ser de la misma moneda.

---

### 4.6 Gestión de Tareas

Módulo para crear y administrar tareas internas dentro del equipo. Cada tarea puede vincularse opcionalmente a un objeto específico de la plataforma (cliente, documento, conciliación, etc.), permitiendo contextualizar el trabajo asignado.

**Descripción**: Administra y crea tareas internas.

Breadcrumb: Herramientas > Gestión de Tareas

#### Lista de tareas

Tabs de filtro: **Todas**, **Asignadas a mí**, **Creadas por mí**

Tabla con columnas: Tarea, Objeto relacionado, Estado, Fecha límite, Recordatorio, Descripción, Comentario, Asignado a.

**Funcionalidades**: Filtrar, Ordenar, Buscar, paginación (15 por página), selección individual.

Botones: **"Crear tarea"** | **"Iniciar mis tareas"**.

> **Nota**: El botón "Crear tarea" también está disponible de forma global en el header de la plataforma, permitiendo crear tareas desde cualquier vista.

#### Creación de tarea

Modal **"Crear tarea"** con campos:

- **Objeto relacionado** (selector con búsqueda): Define a qué entidad de la plataforma se vincula la tarea. Opciones disponibles:

| Objeto relacionado | Descripción |
|--------------------|-------------|
| Gestión de tareas | Tarea independiente, sin vínculo a otro objeto (por defecto) |
| Cliente | Vinculada a un cliente específico |
| Proveedor | Vinculada a un proveedor específico |
| Documento emitido | Vinculada a una factura emitida |
| Documento recibido | Vinculada a una factura recibida |
| Contacto del cliente | Vinculada a un contacto de cliente |
| Contacto del proveedor | Vinculada a un contacto de proveedor |
| Pago del cliente | Vinculada a un pago recibido |
| Pago del proveedor | Vinculada a un pago realizado |
| Compromiso de pago del cliente | Vinculada a un compromiso de pago (Por Cobrar) |
| Compromiso de pago del proveedor | Vinculada a un compromiso de pago (Por Pagar) |
| Conciliación del cliente | Vinculada a una conciliación de cliente |
| Conciliación del proveedor | Vinculada a una conciliación de proveedor |
| Anticipo | Vinculada a un anticipo |
| Nómina | Vinculada a una nómina |

- **Registro específico** (selector con búsqueda, aparece al elegir un objeto distinto a "Gestión de tareas"): Permite seleccionar el registro particular al que se vincula la tarea (ej. "Conciliación #258", "Factura #1515").
- **Título** (campo de texto): Nombre descriptivo de la tarea.
- **Asignado a** (selector múltiple con búsqueda): Usuarios del sistema a quienes se asigna la tarea. Muestra nombre, email y rol de cada usuario. Se pueden asignar múltiples usuarios.
- **Fecha límite** (selector de fecha y hora): Fecha y hora límite para completar la tarea.
- **Prioridad** (selector): Nivel de prioridad de la tarea.
- **Recordatorio** (selector): Programación de recordatorio previo a la fecha límite. Opciones:

| Opción | Descripción |
|--------|-------------|
| Sin recordatorio | No se envía recordatorio |
| Fecha personalizada | Permite elegir fecha y hora específica para el recordatorio |
| 30 minutos antes | Recordatorio 30 min antes de la fecha límite |
| 1 hora antes | Recordatorio 1 hora antes |
| 1 día antes | Recordatorio 1 día antes |
| 1 semana antes | Recordatorio 1 semana antes |

- **Descripción de la tarea** (campo de texto): Detalle o instrucciones de la tarea.
- Botones: **"Cancelar"** | **"Crear tarea"**.

> **Nota**: Al seleccionar "Fecha personalizada" como recordatorio, aparece un selector adicional de fecha y hora para definir el momento exacto del recordatorio.

---

### 4.7 Registros de Integración (pendiente de detalle)

*(Sección pendiente de documentación detallada.)*

---

### 4.8 Plantillas

Gestión de plantillas de mensajes reutilizables para comunicaciones por distintos canales. Actualmente enfocado en plantillas de WhatsApp Business.

**Descripción**: Gestiona y personaliza plantillas para comunicaciones eficientes y profesionales. Edita y utiliza mensajes reutilizables para todo tipo de interacciones y canales.

Breadcrumb: Herramientas > Plantillas

#### Lista de plantillas

**Tabs:**
- Todas
- Plantillas de WhatsApp

Tabla con columnas: Nombre, Canal (ej: WhatsApp), Estado (badge: Activo), Fecha de creación, Fecha de actualización, Creado por.

Incluye filtros, ordenamiento, búsqueda, paginación, menú de acciones por fila (3 puntos) y botón "+ Crear plantilla".

#### Creación de plantilla WhatsApp

Página dedicada (no modal) para crear plantillas siguiendo los lineamientos de Meta.

Breadcrumb: Herramientas > Plantillas > Crear plantilla

**Campos:**
- **Nombre de la plantilla** (campo de texto, ej: "plantilla_de_bienvenida")
- **Header** (toggle on/off) - Encabezado opcional del mensaje
- **Cuerpo del Mensaje** (obligatorio) - Texto principal del mensaje
  - Botón "Insertar variable { }" para agregar variables dinámicas (ej: nombre del cliente, monto, etc.)
  - Link de ayuda: "¿Qué son las variables?"
- **Footer** (toggle on/off) - Pie de mensaje opcional
- **Botones** (toggle on/off) - Botones de acción opcionales en el mensaje

**Vista previa del mensaje** (panel lateral derecho):
- Simulación estilo burbuja de WhatsApp que muestra cómo se verá el mensaje al destinatario.
- Se actualiza en tiempo real conforme se edita la plantilla.

**Acciones:**
- "Descartar" - Cancelar sin guardar
- **"Enviar a Aprobación de Meta"** - Envía la plantilla a Meta (WhatsApp Business API) para su revisión y aprobación. Una vez aprobada por Meta, la plantilla queda disponible para su uso en campañas y comunicaciones.

#### Sincronización con Meta

Las plantillas pueden gestionarse de dos formas:
1. **Crear en Sena y enviar a Meta**: Se diseña la plantilla en Sena y se envía a aprobación de Meta.
2. **Sincronizar desde Meta**: Si ya existen plantillas aprobadas en Meta, se pueden sincronizar e importar a Sena para su uso dentro de la plataforma.

#### Relación con otros módulos

- **Plantillas → Campañas**: Las plantillas aprobadas se utilizan como contenido de los mensajes en las campañas de cobranza (ver sección 2.3).
- **Plantillas → CRM (WhatsApp)**: Las plantillas también se pueden usar en comunicaciones individuales por el canal WhatsApp del CRM.

---

## 5. Configuración

Módulo de administración de la plataforma. A diferencia de los demás módulos (Dashboard, Por Cobrar, Por Pagar, Herramientas), **Configuración no se puede desactivar**, ya que es desde donde se gestiona toda la parametrización del sistema.

Breadcrumb: Configuración > [sub-sección]

### 5.1 Mi Perfil

Gestión del perfil personal del usuario autenticado.

**Información Personal:**
- Foto de Perfil (formatos permitidos: PNG, JPG)
- Nombre
- Apellido
- Fecha de Nacimiento (selector de fecha)
- Género (selector)
- Teléfono de Contacto (con selector de código de país)
- Cargo
- Gestión
- Dirección Completa (con geolocalización)
- Botón "Guardar Cambios"

**Configuración cuenta:**
- Empresa (solo lectura - muestra la empresa asociada al usuario)
- Gerente
- Correo Electrónico
- Contraseña (editable, muestra indicador "Contraseña configurada")
- Inicio de Sesión (toggle)
- Redes Sociales (editable)
- Idioma (selector, ej: Español)
- Zona Horaria (selector, ej: America/Lima)
- Tareas (+ Añadir delegación)
- Botón "Guardar Cambios"

**Eliminar Cuenta:**
- Advertencia: "Borrar tu cuenta es una acción permanente. No se puede deshacer."
- Checkbox de confirmación: "Confirmar eliminación de la cuenta"
- Botón "Eliminar cuenta" (acción destructiva)

### 5.2 Mi Empresa

Gestión de la información y configuración de la empresa. Se divide en varias secciones:

#### Información empresa

- Nombre Comercial
- Nombre legal de la empresa (solo lectura)
- Nro. Identificación Fiscal (solo lectura)
- Email comercial
- Teléfono comercial
- Slogan de la empresa
- Descripción de la empresa
- Botones: "Revertir Cambios" / "Guardar Cambios"

#### Logotipo y marca

- **Banner Empresa**: Formato SVG, PNG o JPG (recomendado 1200x300 px)
- **Branding check** - Controla dónde se muestra el logo de la empresa:
  - Mostrar en notificaciones ("Mostrar logo en las notificaciones generales a los contactos")
  - Mostrar en correos de cobro ("Mostrar logo en las notificaciones generales a los contactos")
  - Mostrar en correos de pago ("Mostrar logo en las notificaciones generales a los contactos")
- Botones: "Revertir Cambios" / "Guardar Cambios"

#### Módulos activos

Permite activar o desactivar los módulos principales de la plataforma mediante toggles. Los módulos disponibles son:

| Módulo | Descripción | Desactivable |
|--------|-------------|--------------|
| Dashboard | Panel general con KPIs y resúmenes | Sí |
| Por Cobrar | Gestión de cuentas por cobrar | Sí |
| Por Pagar | Gestión de cuentas por pagar | Sí |
| Herramientas | Herramientas adicionales (incluye Portal de pagos, entre otros) | Sí |
| Configuración | Administración y parametrización del sistema | **No** (siempre visible) |

> **Nota**: Al desactivar un módulo, este deja de ser visible en la navegación lateral para los usuarios de la empresa.

#### Datos de transferencia bancaria

Gestión de las cuentas bancarias de la empresa. Se divide en dos tabs:

- **Cuenta de cobro**: Cuentas bancarias para recibir pagos de clientes.
- **Cuenta de pago**: Cuentas bancarias para realizar pagos a proveedores.

Incluye búsqueda (por nombre, banco, número) y botón "+ Agregar cuenta".

> **Nota**: "Carga los datos bancarios del titular para empezar a cobrar de forma segura y sin contratiempos. Puedes agregar varias y definir una por defecto." Estas cuentas se usan en los compromisos de pago y otros flujos financieros.

#### Campos personalizables

Vista resumida de los campos custom configurados por entidad. Es un acceso directo al mismo contenido que se gestiona en la sección dedicada **Propiedades Personalizables** (ver sección [5.5 Propiedades Personalizables](#55-propiedades-personalizables)).

#### Configuración de la Cuenta

- Propietario de la Cuenta (email del administrador principal)

### 5.3 Suscripción

Gestión del plan de suscripción de la empresa. Permite visualizar el plan actual, los consumos, los límites y cambiar de plan.

**Descripción**: Descubre el plan que mejor se adapta a tus necesidades y optimiza tu gestión de cobranzas.

Botón: "Ver historial de pagos"

#### Plan actual

Muestra el plan contratado con badge "Plan actual", su descripción y los límites incluidos como badges (ej: 20 Usuarios, 10 Clientes, 50 Documentos/mes, 20 SMS/mes, 60 minutos/mes).

#### Consumo actual

Barras de progreso que muestran el uso vs. el límite del plan. Se resaltan en rojo cuando se excede el límite:

| Métrica | Ejemplo |
|---------|---------|
| Documentos emitidos | 5838 de 50 Documentos emitidos |
| Usuarios | 3 de 20 usados |
| Clientes gestionados | 642 de 10 gestionados |
| Gestiones SMS | 0 de 20 enviadas |
| Gestiones llamadas | 0 de 60 minutos |
| Gestiones emails | 0 enviadas |

#### Planes disponibles

| Plan | Precio | Público objetivo | Contratación |
|------|--------|------------------|--------------|
| **Starter** | S/ 130.90 /mes | Para pequeñas empresas y primeros volúmenes | Autoservicio (Mercado Pago) |
| **Growth** | S/ 1,171.30 /mes | Para empresa en expansión | Contactar ventas |
| **Enterprise** | S/ 2,681.50 /mes | Para alto volumen y operaciones críticas | Contactar ventas |

**Características por plan:**

| Característica | Starter | Growth | Enterprise |
|----------------|---------|--------|------------|
| CRM básico de cobranza | Si | - | - |
| Automatización de recordatorios | Si | - | - |
| Conciliación manual | Si | - | - |
| Reportes básicos | Si | - | - |
| Soporte por email | Si | - | - |
| Segmentación inteligente | - | Si | - |
| Conciliación automática | - | Si | - |
| Portal de cliente | - | Si | - |
| Campañas automatizadas | - | Si | - |
| Reportería avanzada | - | Si | - |
| Soporte prioritario | - | Si | - |
| CRM avanzado multicanal | - | Si | - |
| Volumen ilimitado | - | - | Si |
| API completa | - | - | Si |
| Integración con Recsa | - | - | Si |
| Gestión humana especializada | - | - | Si |
| Multi-tenant y white label | - | - | Si |
| SLA garantizado | - | - | Si |
| Account Manager dedicado | - | - | Si |

> **Nota**: Las características son acumulativas. Growth incluye todo lo de Starter, y Enterprise incluye todo lo de Growth.

#### Mejorar Plan

Wizard de 2 pasos mediante modal:

**Paso 1 de 2: Selección del plan**
- "Confirma que la selección del plan sea la adecuada para tus necesidades."
- Muestra el plan seleccionado con nombre, descripción y precio.
- Panel "Resumen" con selector de plan y total a pagar mensual.
- Navegación: Cancelar / Continuar al pago

**Paso 2 de 2: Método de pago**
- "Revisa la información de pago para empezar la suscripción."
- Método disponible: **Mercado Pago** ("Paga con tu tarjeta de crédito o débito con Mercado Pago")
- Panel "Resumen" se mantiene visible con total a pagar.
- Navegación: Volver / "Pagar y suscribirse"

### 5.4 Gestión de Usuarios

Administración de los usuarios que tienen acceso a la plataforma dentro de la empresa.

**Descripción**: Administra usuarios, roles y permisos para controlar el acceso seguro a las funcionalidades de Sena.

Incluye link a "Guía de Ayuda".

#### Lista de usuarios

Tabla con columnas: ID, Nombre, Cargo, Responsable de grupo, Rol/es, Estado de invitación, Email, Identificador, Última gestión, Estado de actividad, Última conexión, Mejor respuesta.

**Estados de actividad:**
- **Activo**: Usuario conectado y usando la plataforma
- **Inactivo**: Usuario registrado pero sin actividad reciente
- **Desconectado**: Usuario sin conexión

Incluye filtros, ordenamiento, búsqueda, paginación y botón "Agregar Usuario".

#### Roles de usuario

| Rol | Descripción | Restricciones |
|-----|-------------|---------------|
| **Administrador** | Acceso completo a la webapp y gestión de usuarios | Sin restricciones. Ve todos los clientes, documentos, pagos, contactos, etc. |
| **Usuario** | Acceso completo a clientes, reportes y asignación de carteras | Solo ve los clientes y datos relacionados (documentos, pagos, contactos) que le han sido asignados. La visibilidad es en cascada: cliente → documentos → pagos → contactos. |
| **Invitado** | Acceso de solo lectura a ciertos clientes, informes y notas | Solo lectura. Igual que Usuario, solo ve lo que se le asigna. |

> **Nota**: Para usuarios con rol "Usuario" o "Invitado", es necesario asignarles clientes específicos. Al asignar un cliente, el usuario hereda visibilidad en cascada sobre todos los documentos, pagos, contactos y conciliaciones relacionados con ese cliente.

#### Permisos

Los permisos se configuran por módulo y son granulares. Cada módulo tiene un conjunto de permisos individuales:

| Módulo | Permisos disponibles (ejemplo) |
|--------|-------------------------------|
| Dashboard | 12 permisos |
| Configuración | 28 permisos |
| XCobrar (Por Cobrar) | 20 permisos |
| XPagar (Por Pagar) | 20 permisos |
| Herramientas | 8 permisos |

Los permisos se pueden expandir/colapsar por módulo y se seleccionan individualmente. Al seleccionar un rol, se precargan los permisos predeterminados de ese rol, pero se pueden ajustar manualmente.

#### Creación de usuario

Wizard de 4 pasos mediante modal "Agregar usuario":

**Paso 1 de 4: Carga de datos**
- "Agrega los datos del nuevo usuario."
- Campos:
  - *Nombre (obligatorio)
  - *Apellido (obligatorio)
  - Identificador (opcional)
  - *Email (obligatorio)
  - Cargo (opcional)
  - Descripción (opcional)

**Paso 2 de 4: Selección de rol**
- "Elige la categoría que más se adapta al nuevo usuario."
- Selección entre: Administrador, Usuario, Invitado (tarjetas con descripción de cada rol).

**Paso 3 de 4: Selección de permisos**
- "Selecciona los permisos que tendrá el usuario."
- Lista de permisos agrupados por módulo (Dashboard, Configuración, XCobrar, XPagar, Herramientas).
- Cada grupo es colapsable y muestra la cantidad de permisos seleccionados.

**Paso 4 de 4: Confirmación de datos**
- Revisión final de toda la información ingresada antes de crear el usuario.

#### Flujo de invitación

1. El administrador crea el usuario en Sena.
2. Se envía un correo de invitación al email registrado.
3. El usuario invitado accede a **app.sena.com**.
4. Ingresa su correo electrónico.
5. El sistema le ofrece dos opciones: "Crear cuenta" o "Seguir como invitado".
6. Si elige crear cuenta, completa los pasos de registro (contraseña, datos).
7. Una vez completado, accede a la plataforma con sus credenciales y los permisos asignados.

#### Detalle del usuario

Panel/modal que muestra toda la información de un usuario:

**Cabecera:**
- Nombre completo
- Empresa
- Rol (badge, ej: Administrador)
- Email
- Estado (badge: Activo, Inactivo, Desconectado)

**Información del usuario:**
- Nombre
- Apellido
- Email
- Teléfono
- Compañía
- Posición
- Identificador
- Posición/Rol (badge)
- Estado (badge)

**Permisos:**
- Selector de rol (badge editable)
- Lista de permisos por módulo (igual que en creación)
- Botón "Guardar Cambios"

### 5.5 Propiedades Personalizables

Sección dedicada a la gestión centralizada de todos los campos custom de la plataforma. Existe como opción independiente dentro de Configuración (además de estar accesible desde Mi Empresa).

**Descripción**: Crea, organiza y valida propiedades para cada entidad. Los cambios se reflejan en formularios, tablas, automatizaciones y reportes.

Breadcrumb: Configuración > Propiedades Personalizables

Incluye link "¿Cómo funciona?" con ayuda contextual.

**Filtro por tabs:**
- Todas
- Cuentas por cobrar
- Cuentas por pagar
- Herramientas

**Entidades (objetos) disponibles para campos personalizables:**

| Entidad | Descripción |
|---------|-------------|
| Clientes | Campos custom en registros de clientes (Por Cobrar) |
| Proveedores | Campos custom en registros de proveedores (Por Pagar) |
| Documentos emitidos | Campos custom en facturas/documentos emitidos |
| Documentos recibidos | Campos custom en facturas/documentos recibidos |
| Pagos recibidos | Campos custom en pagos de clientes |
| Pagos realizados | Campos custom en pagos a proveedores |
| Conciliaciones de clientes | Campos custom en conciliaciones de cobro |
| Conciliaciones de proveedores | Campos custom en conciliaciones de pago |

Cada entidad muestra la cantidad de propiedades configuradas (ej: "Documentos emitidos - 32 Propiedades") y se puede expandir/colapsar para ver el detalle.

Incluye búsqueda y botón "Crear propiedad".

**Creación de campo personalizable** (modal "Nueva propiedad"):
- "Las propiedades te permiten personalizar la información que registras en tus gestiones, como el tipo de contacto, motivo de no pago o responsable asignado."
- **Objeto destino** (selector): Cliente, Proveedor, Documentos emitidos, Documentos recibidos, Pagos recibidos, Pagos realizados. "Selecciona dónde se usará esta propiedad. Esto determina dónde aparecerá y qué validaciones aplican."
- **Nombre**: Nombre del campo personalizable
- **Tipo** (selector):

| Tipo | Descripción |
|------|-------------|
| Texto | Campo de texto libre |
| Listado | Selector con opciones predefinidas |
| Árbol de opciones (JSON) | Estructura jerárquica de opciones |
| Numérico | Campo numérico |
| Moneda | Campo de monto con moneda |
| Fecha | Selector de fecha |

- Botones: Cancelar / "Crear propiedad"

Una vez creada la propiedad, esta se inserta automáticamente como campo adicional en cada registro existente y futuro del objeto seleccionado. Los campos personalizables aparecen en la sección "Campos personalizables" del detalle de cada entidad.

### 5.6 Integraciones

Gestión de conexiones con servicios externos. Permite sincronizar canales de comunicación y servicios tributarios para potenciar las funcionalidades de la plataforma.

**Descripción**: Conexiones y Funcionalidades Disponibles.

Breadcrumb: Configuración > Integraciones

Cada integración se presenta como una tarjeta con nombre, descripción, botón de acción (Sincronizar/Sincronizar ahora) y link "Ver Historial".

#### Integración de Email (SMTP)

Permite conectar un proveedor de correo electrónico para que Sena envíe correos desde la cuenta del usuario. El correo sincronizado se utiliza como emisor (SMTP) en todas las comunicaciones por email de la plataforma (CRM, estados de deuda, notificaciones, etc.).

**Proveedores disponibles:**

| Proveedor | Descripción |
|-----------|-------------|
| **Outlook** | Gestiona tu Outlook directamente en Sena |
| **Gmail** | Gestiona tu Gmail directamente en Sena |
| **Zoho** | Gestiona tu Zoho directamente en Sena |

- Modal "Integrar Email": "Conecta tu correo de Gmail, Outlook y Zoho. Autoriza a Sena a gestionar envíos y notificaciones desde tu cuenta de manera segura y centralizada, para tener toda tu comunicación en un solo lugar."
- Aviso: "El correo sincronizado se utilizará en el CRM; todos los correos que envíes desde Sena saldrán desde esta cuenta."
- Cada proveedor tiene un botón "Sincronizar" individual.

> **Nota**: Se utiliza tanto en Por Cobrar (correos a clientes/deudores) como en Por Pagar (correos a proveedores).

#### Integración de WhatsApp

Sena ofrece dos modalidades de WhatsApp según el caso de uso:

| Modalidad | Descripción | Tecnología subyacente | Caso de uso |
|-----------|-------------|----------------------|-------------|
| **WhatsApp (con QR)** | Conecta tu WhatsApp o WhatsApp Business App mediante QR para chatear 1 a 1 con tus clientes | Evolution API | Comunicación individual (1 a 1) a través del CRM |
| **WhatsApp Business Platform** | Conecta WhatsApp a Meta para envíos masivos automatizados desde una cuenta comercial verificada | Capso (conecta con Meta) | Envíos masivos, campañas automatizadas, plantillas aprobadas por Meta |

- **WhatsApp (con QR)**: Se escanea un código QR desde el celular para vincular la sesión. Ideal para chat directo con contactos individuales.
- **WhatsApp Business Platform**: Requiere una cuenta comercial verificada en Meta. Se usa para campañas masivas y comunicaciones automatizadas. Las plantillas deben estar aprobadas por Meta (ver sección Plantillas en Herramientas).

#### Integración con Servicios Tributarios

Permite sincronizar con entidades tributarias del país para importar documentos (facturas, boletas, etc.) de forma automática. La disponibilidad depende del país:

| País | Servicio | Descripción |
|------|----------|-------------|
| **Perú** | SUNAT | Automatiza la gestión de tus obligaciones tributarias y el envío de comprobantes. Permite extraer documentos emitidos/recibidos directamente de SUNAT. |
| **Chile** | SII (Servicio de Impuestos Internos) | Sincronización con el servicio tributario interno de Chile. |
| **Colombia, Ecuador, México y otros** | No disponible | Actualmente no implementado. Sin integración con servicios tributarios. |

Cada integración tributaria incluye botón "Sincronizar" y link "Ver Historial" para consultar el registro de sincronizaciones previas.

> **Nota**: En el header de la plataforma se muestra una alerta "Sincronizar SUNAT" (o el servicio correspondiente) cuando hay sincronizaciones pendientes o recomendadas.

### 5.7 Segmentos

Permite crear agrupaciones dinámicas de clientes basadas en filtros y criterios. Los segmentos son la base para ejecutar campañas de cobranza dirigidas.

**Descripción**: Crea y administra segmentos dinámicos a partir de filtros sobre tus clientes. Usa los segmentos para enviar campañas o analizar comportamientos.

Breadcrumb: Configuración > Segmentos

**Estado vacío**: "Aún no tienes segmentos creados. Crea tu primer segmento filtrando tus clientes por sector, tamaño, categoría u otros criterios."

Botón: "+ Crear segmento"

#### Creación de segmento

Wizard de 2 pasos mediante modal "Crear segmento":

**Paso 1 de 2: Segmenta los clientes**
- "Nombra el segmento y utiliza los filtros para segmentar los clientes."
- **Nombre del segmento** (campo de texto, ej: "Segmento de clientes")
- **Tabla de clientes**: Muestra todos los clientes disponibles para seleccionar.
  - Columnas: RUC, Razón Social, Alias, Último cambio, Total deuda (S/ + USD), Total facturado (S/ + USD), Total vigente (S/ + USD)
  - Selección individual mediante checkboxes
  - Filtros, ordenamiento, búsqueda y paginación
- Navegación: Volver / Siguiente

**Paso 2 de 2: Selecciona los contactos**
- "Agregar o elimina los contactos asignados a cada cliente según lo necesites."
- Muestra los contactos de los clientes seleccionados en el paso anterior.
- Permite elegir qué contactos específicos de cada cliente serán parte del segmento.
- Si los clientes seleccionados no tienen contactos: "No hay clientes con contactos disponibles."
- Navegación: Volver / **"Finalizar y crear segmento"**

#### Relación con otros módulos

- **Segmento → Clientes**: Un segmento agrupa uno o más clientes.
- **Segmento → Contactos**: Dentro del segmento se seleccionan contactos específicos de los clientes incluidos.
- **Segmento → Campañas**: Los segmentos se utilizan como audiencia destino al crear campañas de cobranza (ver sección 2.3 Campañas en Por Cobrar).

---

## Notas generales

- La moneda principal es Soles (S/) con equivalencia en USD
- Las tablas en general incluyen: filtros, ordenamiento, búsqueda, paginación y opción de exportar
- Los reportes automáticos se pueden configurar para recibir resúmenes con KPIs, métricas y tendencias de un periodo
- El sistema maneja tres roles de usuario: Administrador (acceso total), Usuario (acceso asignado) e Invitado (solo lectura asignada)
- La plataforma opera bajo un modelo de suscripción mensual con tres niveles: Starter, Growth y Enterprise
- **Soporte multi-país**: La plataforma soporta actualmente Perú (PEN/USD, SUNAT, RUC) y Chile (CLP/UF, SII, RUT). Colombia, Ecuador, México y otros países aún no cuentan con integración tributaria. Las monedas, identificadores tributarios, validaciones y servicios de integración varían según el país de operación de cada empresa.
