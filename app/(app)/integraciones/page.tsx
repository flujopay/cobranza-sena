import { IntegracionesGrid } from "@/components/integraciones/IntegracionesGrid";

export default function IntegracionesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-1">
          <span>Inicio</span>
          <span>/</span>
          <span className="text-gray-700 font-medium">Integraciones</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">Integraciones</h1>
        <p className="mt-1 text-sm text-gray-500">
          Conexiones y funcionalidades disponibles para tu Bot de Cobranza.
        </p>
      </div>

      <IntegracionesGrid />
    </div>
  );
}
