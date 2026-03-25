// Mock — sin conexión activa todavía
export function SiiStatusCard() {
  const connected = false; // TODO: leer desde contexto/sesión real

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 flex items-center justify-between gap-4">
      {/* Logo SII */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#0033A0] flex items-center justify-center shrink-0">
          <span className="text-white text-sm font-bold tracking-tight">SII</span>
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">
            Servicio de Impuestos Internos
          </p>
          <p className="text-xs text-gray-500 mt-0.5">sii.cl — Chile</p>
        </div>
      </div>

      {/* Estado */}
      <div className="flex items-center gap-2 shrink-0">
        {connected ? (
          <>
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm font-medium text-green-700">Conectado</span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-gray-300" />
            <span className="text-sm font-medium text-gray-500">Sin conectar</span>
          </>
        )}
      </div>
    </div>
  );
}
