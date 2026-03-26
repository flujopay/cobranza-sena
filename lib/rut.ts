/**
 * Utilidades para RUT chileno
 * Formato válido de entrada: con o sin puntos, con guión
 * Ejemplos válidos: "12.345.678-9", "12345678-9", "76.543.210-K"
 */

/** Limpia el RUT dejando solo dígitos + dígito verificador sin puntos ni guión */
export function cleanRut(rut: string): string {
  return rut.replace(/[^0-9kK]/g, "").toUpperCase();
}

/** Calcula el dígito verificador para un cuerpo numérico dado */
function calcDv(body: string): string {
  let sum = 0;
  let factor = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const rest = 11 - (sum % 11);
  if (rest === 11) return "0";
  if (rest === 10) return "K";
  return String(rest);
}

/** Valida si un RUT chileno es válido (acepta con o sin formato) */
export function isValidRut(rut: string): boolean {
  const clean = cleanRut(rut);
  if (clean.length < 2) return false;
  const body = clean.slice(0, -1);
  const dv   = clean.slice(-1).toUpperCase();
  if (!/^\d+$/.test(body)) return false;
  const num = parseInt(body);
  if (num < 1000000 || num > 99999999) return false; // rango razonable
  return calcDv(body) === dv;
}

/** Formatea un RUT limpio a "XX.XXX.XXX-D" */
export function formatRut(rut: string): string {
  const clean = cleanRut(rut);
  if (clean.length < 2) return rut;
  const body = clean.slice(0, -1);
  const dv   = clean.slice(-1).toUpperCase();
  // Agregar puntos cada 3 dígitos desde la derecha
  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formatted}-${dv}`;
}
