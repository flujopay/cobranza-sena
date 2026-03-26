export type Canal = "email" | "sms" | "whatsapp";
export type NivelRiesgo = "verde" | "amarillo" | "naranja" | "rojo";

export type FacturaEjemplo = {
  folio: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  dias_mora: number | null; // null = no vencida
  monto: number;
};

export type Plantilla = {
  id: string;
  nombre: string;
  canal: Canal;
  nivelRiesgo: NivelRiesgo;
  asunto?: string; // solo email
  cuerpo: string;
  variables: string[];
  activa: boolean;
};

// ─── Datos de ejemplo para preview ───────────────────────────────────────────

export const PREVIEW_FACTURAS: FacturaEjemplo[] = [
  { folio: "F-00842", fecha_emision: "01/02/2026", fecha_vencimiento: "01/03/2026", dias_mora: 24, monto: 1_850_000 },
  { folio: "F-00901", fecha_emision: "15/02/2026", fecha_vencimiento: "17/03/2026", dias_mora: 8,  monto: 640_000  },
  { folio: "F-00934", fecha_emision: "01/03/2026", fecha_vencimiento: "31/03/2026", dias_mora: null, monto: 320_000 },
];

export const PREVIEW_VARS: Record<string, string> = {
  "{{nombre}}":           "Carlos Vega",
  "{{empresa_emisora}}":  "Servicios Alfa SpA",
  "{{rut_emisor}}":       "76.543.210-K",
  "{{total_facturas}}":   "3",
  "{{monto_total}}":      "2.810.000",
  "{{facturas_detalle}}": "ver tabla adjunta",
  "{{email_contacto}}":   "cobranza@alfa.cl",
  "{{telefono_contacto}}":"(+56) 2 2345 6789",
  "{{banco}}":            "Banco Estado",
  "{{cuenta}}":           "12345678",
  "{{dias_plazo}}":       "5",
  "{{fecha_limite}}":     "30/03/2026",
};

// ─── Plantillas ───────────────────────────────────────────────────────────────

export const PLANTILLAS_MOCK: Plantilla[] = [
  // ─── Email ─────────────────────────────────────────────────────────────────
  {
    id: "email-verde-1",
    canal: "email",
    nivelRiesgo: "verde",
    nombre: "Recordatorio amigable",
    asunto: "Recordatorio de facturas pendientes — {{empresa_emisora}}",
    cuerpo: `Estimado/a {{nombre}},

Esperamos que se encuentre bien. Le recordamos que tiene {{total_facturas}} factura(s) pendiente(s) de pago con un total de \${{monto_total}}.

{{facturas_detalle}}

Si ya realizó algún pago, por favor ignore las líneas correspondientes.

Para cualquier consulta estamos disponibles en {{email_contacto}} o {{telefono_contacto}}.

Saludos cordiales,
{{empresa_emisora}}`,
    variables: ["{{nombre}}", "{{total_facturas}}", "{{monto_total}}", "{{facturas_detalle}}", "{{empresa_emisora}}", "{{email_contacto}}", "{{telefono_contacto}}"],
    activa: true,
  },
  {
    id: "email-amarillo-1",
    canal: "email",
    nivelRiesgo: "amarillo",
    nombre: "Aviso de vencimiento próximo",
    asunto: "{{total_facturas}} factura(s) próximas a vencer — Acción requerida",
    cuerpo: `Estimado/a {{nombre}},

Le informamos que tiene {{total_facturas}} factura(s) por un total de \${{monto_total}} próximas a vencer.

{{facturas_detalle}}

Le solicitamos gestionar el pago a la brevedad para evitar recargos o suspensión de servicios.

Puede realizar el pago mediante transferencia bancaria a:
  • Banco: {{banco}}
  • Cuenta corriente: {{cuenta}}
  • RUT: {{rut_emisor}}

Ante cualquier consulta, contáctenos en {{email_contacto}}.

Atentamente,
{{empresa_emisora}}`,
    variables: ["{{nombre}}", "{{total_facturas}}", "{{monto_total}}", "{{facturas_detalle}}", "{{banco}}", "{{cuenta}}", "{{rut_emisor}}", "{{empresa_emisora}}", "{{email_contacto}}"],
    activa: true,
  },
  {
    id: "email-naranja-1",
    canal: "email",
    nivelRiesgo: "naranja",
    nombre: "Aviso de mora",
    asunto: "URGENTE: {{total_facturas}} factura(s) con mora — ${{monto_total}}",
    cuerpo: `Estimado/a {{nombre}},

Le comunicamos que tiene {{total_facturas}} factura(s) vencidas sin registrar pago, por un total de \${{monto_total}}.

{{facturas_detalle}}

Esta situación puede afectar su historial comercial. Le instamos a regularizar su situación a la brevedad.

Para coordinar un plan de pago o aclarar cualquier situación, contáctenos:
  • Email: {{email_contacto}}
  • Teléfono: {{telefono_contacto}}
  • Horario: Lunes a Viernes de 9:00 a 18:00 hrs.

Si algún pago fue realizado, por favor envíenos el comprobante a {{email_contacto}}.

{{empresa_emisora}}`,
    variables: ["{{nombre}}", "{{total_facturas}}", "{{monto_total}}", "{{facturas_detalle}}", "{{empresa_emisora}}", "{{email_contacto}}", "{{telefono_contacto}}"],
    activa: true,
  },
  {
    id: "email-rojo-1",
    canal: "email",
    nivelRiesgo: "rojo",
    nombre: "Último aviso",
    asunto: "Último aviso — Deuda de ${{monto_total}} en proceso de gestión legal",
    cuerpo: `Estimado/a {{nombre}},

A pesar de nuestras comunicaciones previas, tiene {{total_facturas}} factura(s) por un total de \${{monto_total}} que continúan impagas.

{{facturas_detalle}}

Le informamos que, de no regularizar su situación en un plazo de {{dias_plazo}} días corridos desde la fecha de este correo, procederemos con:
  1. Informe a DICOM/Equifax
  2. Inicio de gestión judicial de cobranza
  3. Cobro de intereses y costas judiciales

Para evitar estas consecuencias, contáctenos de inmediato:
  • Email: {{email_contacto}}
  • Teléfono: {{telefono_contacto}}

{{empresa_emisora}}
Área de Cobranza`,
    variables: ["{{nombre}}", "{{total_facturas}}", "{{monto_total}}", "{{facturas_detalle}}", "{{dias_plazo}}", "{{empresa_emisora}}", "{{email_contacto}}", "{{telefono_contacto}}"],
    activa: true,
  },

  // ─── SMS ───────────────────────────────────────────────────────────────────
  {
    id: "sms-verde-1",
    canal: "sms",
    nivelRiesgo: "verde",
    nombre: "Recordatorio corto",
    cuerpo: "{{empresa_emisora}}: Tiene {{total_facturas}} factura(s) pendiente(s) por ${{monto_total}}. Consultas: {{telefono_contacto}}",
    variables: ["{{empresa_emisora}}", "{{total_facturas}}", "{{monto_total}}", "{{telefono_contacto}}"],
    activa: true,
  },
  {
    id: "sms-amarillo-1",
    canal: "sms",
    nivelRiesgo: "amarillo",
    nombre: "Aviso vencimiento",
    cuerpo: "{{empresa_emisora}}: Tiene {{total_facturas}} factura(s) por ${{monto_total}} próximas a vencer. Evite recargos: {{telefono_contacto}}",
    variables: ["{{empresa_emisora}}", "{{total_facturas}}", "{{monto_total}}", "{{telefono_contacto}}"],
    activa: true,
  },
  {
    id: "sms-naranja-1",
    canal: "sms",
    nivelRiesgo: "naranja",
    nombre: "Aviso mora",
    cuerpo: "{{empresa_emisora}}: Tiene {{total_facturas}} factura(s) vencida(s) por ${{monto_total}}. Regularice: {{telefono_contacto}}",
    variables: ["{{empresa_emisora}}", "{{total_facturas}}", "{{monto_total}}", "{{telefono_contacto}}"],
    activa: true,
  },
  {
    id: "sms-rojo-1",
    canal: "sms",
    nivelRiesgo: "rojo",
    nombre: "Último aviso",
    cuerpo: "URGENTE {{empresa_emisora}}: Deuda ${{monto_total}} ({{total_facturas}} factura(s)) en proceso de cobranza legal. Contacte {{telefono_contacto}} antes del {{fecha_limite}}.",
    variables: ["{{empresa_emisora}}", "{{total_facturas}}", "{{monto_total}}", "{{telefono_contacto}}", "{{fecha_limite}}"],
    activa: true,
  },

  // ─── WhatsApp ──────────────────────────────────────────────────────────────
  {
    id: "wsp-verde-1",
    canal: "whatsapp",
    nivelRiesgo: "verde",
    nombre: "Recordatorio amigable",
    cuerpo: `Hola {{nombre}} 👋

Tienes *{{total_facturas}} factura(s) pendiente(s)* con *{{empresa_emisora}}* por un total de *\${{monto_total}}*.

{{facturas_detalle}}

Si ya realizaste algún pago, ¡muchas gracias! Si no, puedes contactarnos aquí mismo.`,
    variables: ["{{nombre}}", "{{total_facturas}}", "{{monto_total}}", "{{facturas_detalle}}", "{{empresa_emisora}}"],
    activa: true,
  },
  {
    id: "wsp-amarillo-1",
    canal: "whatsapp",
    nivelRiesgo: "amarillo",
    nombre: "Aviso de vencimiento próximo",
    cuerpo: `Hola {{nombre}} ⚠️

Tienes *{{total_facturas}} factura(s)* por *\${{monto_total}}* próximas a vencer.

{{facturas_detalle}}

Para evitar inconvenientes, gestiona el pago a la brevedad. ¿Necesitas información de pago o tienes alguna consulta?`,
    variables: ["{{nombre}}", "{{total_facturas}}", "{{monto_total}}", "{{facturas_detalle}}"],
    activa: true,
  },
  {
    id: "wsp-naranja-1",
    canal: "whatsapp",
    nivelRiesgo: "naranja",
    nombre: "Aviso de mora",
    cuerpo: `Hola {{nombre}} 🔴

Tienes *{{total_facturas}} factura(s) vencida(s)* por un total de *\${{monto_total}}* sin registrar pago.

{{facturas_detalle}}

Queremos ayudarte a regularizar esta situación. ¿Podemos coordinar un plan de pago?

Escríbenos aquí o llámanos al {{telefono_contacto}}.`,
    variables: ["{{nombre}}", "{{total_facturas}}", "{{monto_total}}", "{{facturas_detalle}}", "{{telefono_contacto}}"],
    activa: true,
  },
  {
    id: "wsp-rojo-1",
    canal: "whatsapp",
    nivelRiesgo: "rojo",
    nombre: "Último aviso",
    cuerpo: `⚠️ *ÚLTIMO AVISO* — {{empresa_emisora}}

Hola {{nombre}}, tienes *{{total_facturas}} factura(s)* por un total de *\${{monto_total}}* en proceso de gestión de cobranza.

{{facturas_detalle}}

Para evitar consecuencias legales y reporte a DICOM, contáctanos *antes del {{fecha_limite}}*.

📞 {{telefono_contacto}}`,
    variables: ["{{nombre}}", "{{empresa_emisora}}", "{{total_facturas}}", "{{monto_total}}", "{{facturas_detalle}}", "{{fecha_limite}}", "{{telefono_contacto}}"],
    activa: true,
  },
];

export const CANAL_LABELS: Record<Canal, string> = {
  email: "Email",
  sms: "SMS",
  whatsapp: "WhatsApp",
};

export const RIESGO_LABELS: Record<NivelRiesgo, string> = {
  verde: "Recordatorio",
  amarillo: "Por Vencer",
  naranja: "En Mora",
  rojo: "Crítico",
};

export const RIESGO_COLORS: Record<NivelRiesgo, string> = {
  verde: "text-emerald-700 bg-emerald-50 border-emerald-200",
  amarillo: "text-yellow-700 bg-yellow-50 border-yellow-200",
  naranja: "text-orange-700 bg-orange-50 border-orange-200",
  rojo: "text-red-700 bg-red-50 border-red-200",
};
