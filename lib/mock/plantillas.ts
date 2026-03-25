export type Canal = "email" | "sms" | "whatsapp";
export type NivelRiesgo = "verde" | "amarillo" | "naranja" | "rojo";

export type Plantilla = {
  id: string;
  nombre: string;
  canal: Canal;
  nivelRiesgo: NivelRiesgo;
  asunto?: string; // solo email
  cuerpo: string;
  variables: string[]; // ej. ["{{nombre}}", "{{monto}}", "{{dias_vencida}}"]
  activa: boolean;
};

export const PLANTILLAS_MOCK: Plantilla[] = [
  // ─── Email ────────────────────────────────────────────────────────────────────
  {
    id: "email-verde-1",
    canal: "email",
    nivelRiesgo: "verde",
    nombre: "Recordatorio amigable",
    asunto: "Recordatorio de factura pendiente — {{empresa_emisora}}",
    cuerpo: `Estimado/a {{nombre}},

Esperamos que se encuentre bien. Le recordamos que tiene una factura pendiente de pago por \${{monto}} con vencimiento el {{fecha_vencimiento}}.

Si ya realizó el pago, por favor ignore este mensaje.

Para cualquier consulta estamos disponibles en {{email_contacto}} o {{telefono_contacto}}.

Saludos cordiales,
{{empresa_emisora}}`,
    variables: ["{{nombre}}", "{{monto}}", "{{fecha_vencimiento}}", "{{empresa_emisora}}", "{{email_contacto}}", "{{telefono_contacto}}"],
    activa: true,
  },
  {
    id: "email-amarillo-1",
    canal: "email",
    nivelRiesgo: "amarillo",
    nombre: "Aviso de vencimiento próximo",
    asunto: "Factura N°{{folio}} vence en {{dias_para_vencer}} días — Acción requerida",
    cuerpo: `Estimado/a {{nombre}},

Le informamos que la factura N°{{folio}} por un monto de \${{monto}} vence el {{fecha_vencimiento}} (en {{dias_para_vencer}} días).

Le solicitamos gestionar el pago a la brevedad para evitar recargos o suspensión de servicios.

Puede realizar el pago mediante transferencia bancaria a:
  • Banco: {{banco}}
  • Cuenta corriente: {{cuenta}}
  • RUT: {{rut_emisor}}

Ante cualquier consulta, contáctenos en {{email_contacto}}.

Atentamente,
{{empresa_emisora}}`,
    variables: ["{{nombre}}", "{{folio}}", "{{monto}}", "{{fecha_vencimiento}}", "{{dias_para_vencer}}", "{{banco}}", "{{cuenta}}", "{{rut_emisor}}", "{{empresa_emisora}}", "{{email_contacto}}"],
    activa: true,
  },
  {
    id: "email-naranja-1",
    canal: "email",
    nivelRiesgo: "naranja",
    nombre: "Aviso de mora",
    asunto: "URGENTE: Factura N°{{folio}} con {{dias_vencida}} días de mora",
    cuerpo: `Estimado/a {{nombre}},

Le comunicamos que la factura N°{{folio}} por \${{monto}} lleva {{dias_vencida}} días vencida sin registrar pago.

Esta situación puede afectar su historial comercial. Le instamos a regularizar su situación a la brevedad.

Para coordinar un plan de pago o aclarar cualquier situación, contáctenos:
  • Email: {{email_contacto}}
  • Teléfono: {{telefono_contacto}}
  • Horario: Lunes a Viernes de 9:00 a 18:00 hrs.

Si el pago fue realizado, por favor envíenos el comprobante a {{email_contacto}}.

{{empresa_emisora}}`,
    variables: ["{{nombre}}", "{{folio}}", "{{monto}}", "{{dias_vencida}}", "{{empresa_emisora}}", "{{email_contacto}}", "{{telefono_contacto}}"],
    activa: true,
  },
  {
    id: "email-rojo-1",
    canal: "email",
    nivelRiesgo: "rojo",
    nombre: "Último aviso — gestión de cobranza",
    asunto: "Último aviso — Deuda de \${{monto}} en proceso de gestión legal",
    cuerpo: `Estimado/a {{nombre}},

A pesar de nuestras comunicaciones previas, la factura N°{{folio}} por \${{monto}} continúa impaga con {{dias_vencida}} días de mora.

Le informamos que, de no regularizar su situación en un plazo de {{dias_plazo}} días corridos desde la fecha de este correo, procederemos con:
  1. Informe a DICOM/Equifax
  2. Inicio de gestión judicial de cobranza
  3. Cobro de intereses y costas judiciales

Para evitar estas consecuencias, contáctenos de inmediato:
  • Email: {{email_contacto}}
  • Teléfono: {{telefono_contacto}}

{{empresa_emisora}}
Área de Cobranza`,
    variables: ["{{nombre}}", "{{folio}}", "{{monto}}", "{{dias_vencida}}", "{{dias_plazo}}", "{{empresa_emisora}}", "{{email_contacto}}", "{{telefono_contacto}}"],
    activa: true,
  },

  // ─── SMS ─────────────────────────────────────────────────────────────────────
  {
    id: "sms-verde-1",
    canal: "sms",
    nivelRiesgo: "verde",
    nombre: "Recordatorio corto",
    cuerpo: "{{empresa_emisora}}: Tiene una factura de \${{monto}} con vencimiento el {{fecha_vencimiento}}. Consultas: {{telefono_contacto}}",
    variables: ["{{empresa_emisora}}", "{{monto}}", "{{fecha_vencimiento}}", "{{telefono_contacto}}"],
    activa: true,
  },
  {
    id: "sms-amarillo-1",
    canal: "sms",
    nivelRiesgo: "amarillo",
    nombre: "Aviso vencimiento",
    cuerpo: "{{empresa_emisora}}: Su factura N°{{folio}} de \${{monto}} vence en {{dias_para_vencer}} días. Evite recargos: {{telefono_contacto}}",
    variables: ["{{empresa_emisora}}", "{{folio}}", "{{monto}}", "{{dias_para_vencer}}", "{{telefono_contacto}}"],
    activa: true,
  },
  {
    id: "sms-naranja-1",
    canal: "sms",
    nivelRiesgo: "naranja",
    nombre: "Aviso mora",
    cuerpo: "{{empresa_emisora}}: Su factura N°{{folio}} tiene {{dias_vencida}} días de mora (\${{monto}}). Regularice: {{telefono_contacto}}",
    variables: ["{{empresa_emisora}}", "{{folio}}", "{{dias_vencida}}", "{{monto}}", "{{telefono_contacto}}"],
    activa: true,
  },
  {
    id: "sms-rojo-1",
    canal: "sms",
    nivelRiesgo: "rojo",
    nombre: "Último aviso SMS",
    cuerpo: "URGENTE {{empresa_emisora}}: Deuda \${{monto}} en proceso de cobranza legal. Contacte {{telefono_contacto}} antes del {{fecha_limite}}.",
    variables: ["{{empresa_emisora}}", "{{monto}}", "{{telefono_contacto}}", "{{fecha_limite}}"],
    activa: true,
  },

  // ─── WhatsApp ─────────────────────────────────────────────────────────────────
  {
    id: "wsp-verde-1",
    canal: "whatsapp",
    nivelRiesgo: "verde",
    nombre: "Recordatorio amigable WA",
    cuerpo: `Hola {{nombre}} 👋

Te recuerdo que tienes una factura pendiente con *{{empresa_emisora}}* por *\${{monto}}* con vencimiento el *{{fecha_vencimiento}}*.

Si ya realizaste el pago, ¡muchas gracias! Si no, puedes contactarnos aquí mismo.`,
    variables: ["{{nombre}}", "{{empresa_emisora}}", "{{monto}}", "{{fecha_vencimiento}}"],
    activa: true,
  },
  {
    id: "wsp-amarillo-1",
    canal: "whatsapp",
    nivelRiesgo: "amarillo",
    nombre: "Aviso vencimiento WA",
    cuerpo: `Hola {{nombre}} ⚠️

La factura N°*{{folio}}* por *\${{monto}}* vence en *{{dias_para_vencer}} días*.

Para evitar inconvenientes, te pedimos gestionar el pago a la brevedad. ¿Necesitas información de pago o tienes alguna consulta?`,
    variables: ["{{nombre}}", "{{folio}}", "{{monto}}", "{{dias_para_vencer}}"],
    activa: true,
  },
  {
    id: "wsp-naranja-1",
    canal: "whatsapp",
    nivelRiesgo: "naranja",
    nombre: "Aviso mora WA",
    cuerpo: `Hola {{nombre}} 🔴

Tu factura N°*{{folio}}* por *\${{monto}}* lleva *{{dias_vencida}} días vencida* sin registrar pago.

Queremos ayudarte a regularizar esta situación. ¿Podemos coordinar un plan de pago o tienes algún inconveniente?

Escríbenos aquí o llámanos al {{telefono_contacto}}.`,
    variables: ["{{nombre}}", "{{folio}}", "{{monto}}", "{{dias_vencida}}", "{{telefono_contacto}}"],
    activa: true,
  },
  {
    id: "wsp-rojo-1",
    canal: "whatsapp",
    nivelRiesgo: "rojo",
    nombre: "Último aviso WA",
    cuerpo: `⚠️ *ÚLTIMO AVISO* — {{empresa_emisora}}

Hola {{nombre}}, la deuda de *\${{monto}}* (factura N°{{folio}}) con *{{dias_vencida}} días de mora* está en proceso de gestión de cobranza.

Para evitar consecuencias legales y reporte a DICOM, contáctanos *antes del {{fecha_limite}}*.

📞 {{telefono_contacto}}`,
    variables: ["{{nombre}}", "{{empresa_emisora}}", "{{folio}}", "{{monto}}", "{{dias_vencida}}", "{{fecha_limite}}", "{{telefono_contacto}}"],
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
