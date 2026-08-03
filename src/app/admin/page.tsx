"use client";

import { useState } from "react";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"ventas" | "configuracion">("ventas");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAuthenticated(true);
    } else {
      alert("Contraseña incorrecta");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <form onSubmit={handleLogin} className="glass-panel max-w-sm w-full p-8 text-center">
          <h1 className="text-2xl text-accent mb-6">Acceso Administrativo</h1>
          <input 
            type="password" 
            placeholder="Contraseña" 
            className="input-field w-full mb-4 text-center"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary w-full">Ingresar</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-accent">Panel de Control</h1>
          <p className="text-sm text-gray-400">Gran Rifa Millonaria</p>
        </div>
        <button onClick={() => setIsAuthenticated(false)} className="text-gray-400 hover:text-white">Cerrar Sesión</button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="glass-panel p-4 flex flex-col items-center justify-center">
          <p className="text-gray-400 text-sm">Boletas Vendidas</p>
          <p className="text-3xl font-bold text-white mt-2">142</p>
        </div>
        <div className="glass-panel p-4 flex flex-col items-center justify-center">
          <p className="text-gray-400 text-sm">Ingresos Nequi (Aprox)</p>
          <p className="text-3xl font-bold text-success mt-2">$8.520.000</p>
        </div>
        <div className="glass-panel p-4 flex flex-col items-center justify-center">
          <p className="text-gray-400 text-sm">Reservas Pendientes</p>
          <p className="text-3xl font-bold text-warning mt-2">15</p>
        </div>
        <div className="glass-panel p-4 flex flex-col items-center justify-center">
          <p className="text-gray-400 text-sm">Porcentaje Vendido</p>
          <p className="text-3xl font-bold text-accent mt-2">1.4%</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setActiveTab("ventas")}
          className={`px-4 py-2 rounded-t-lg font-bold ${activeTab === "ventas" ? "bg-accent text-black" : "bg-black/50 text-gray-400 hover:text-white"}`}
        >
          Últimas Reservas (Clientes Reales)
        </button>
        <button 
          onClick={() => setActiveTab("configuracion")}
          className={`px-4 py-2 rounded-t-lg font-bold ${activeTab === "configuracion" ? "bg-accent text-black" : "bg-black/50 text-gray-400 hover:text-white"}`}
        >
          Configuración del Sorteo
        </button>
      </div>

      <div className="glass-panel p-6">
        {activeTab === "ventas" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="pb-3">Boleta</th>
                  <th className="pb-3">Cliente</th>
                  <th className="pb-3">WhatsApp</th>
                  <th className="pb-3">Cédula</th>
                  <th className="pb-3">Estado</th>
                  <th className="pb-3">Acción</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="py-4 font-bold text-accent">#0292</td>
                  <td className="py-4">Juan Pérez</td>
                  <td className="py-4">300 123 4567</td>
                  <td className="py-4">1045678901</td>
                  <td className="py-4"><span className="bg-warning/20 text-warning px-2 py-1 rounded text-xs font-bold">Por Confirmar</span></td>
                  <td className="py-4">
                    <button className="bg-success text-black px-3 py-1 rounded text-sm font-bold">Marcar Pagado</button>
                  </td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 font-bold text-accent">#4582</td>
                  <td className="py-4">María Gómez</td>
                  <td className="py-4">310 987 6543</td>
                  <td className="py-4">32165498</td>
                  <td className="py-4"><span className="bg-success/20 text-success px-2 py-1 rounded text-xs font-bold">Pagado</span></td>
                  <td className="py-4">
                    <button className="bg-gray-700 text-gray-300 px-3 py-1 rounded text-sm disabled">Completado</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "configuracion" && (
          <div className="max-w-2xl">
            <h2 className="text-xl mb-6">Ajustes de la Plataforma</h2>
            
            <div className="mb-8 border border-white/10 p-4 rounded-lg bg-black/30">
              <h3 className="font-bold text-accent mb-2">Premios de la Rifa Actual</h3>
              <p className="text-sm text-gray-400 mb-4">Modifica los premios que aparecerán en la página principal. Esto es útil cuando terminas un sorteo y empiezas uno nuevo de $60.000.</p>
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="bg-accent/20 text-accent font-bold px-2 py-1 rounded">1</span>
                  <input type="text" className="input-field w-full" defaultValue="Ford Ranger XLT Bi-Turbo (2024)" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-accent/20 text-accent font-bold px-2 py-1 rounded">2</span>
                  <input type="text" className="input-field w-full" defaultValue="Yamaha NMAX V3" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-accent/20 text-accent font-bold px-2 py-1 rounded">3</span>
                  <input type="text" className="input-field w-full" defaultValue="Yamaha XTZ 150" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-accent/20 text-accent font-bold px-2 py-1 rounded">4</span>
                  <input type="text" className="input-field w-full" defaultValue="Toyota Hilux AT 4x4" />
                </div>
                <input 
                  type="text" 
                  className="input-field w-full" 
                  value={config.prizes} 
                  onChange={(e) => setConfig({...config, prizes: e.target.value})} 
                />
                <button onClick={handleSaveConfig} className="btn btn-primary mt-2">Guardar Premios</button>
              </div>
            </div>
            
            <div className="mb-8 border border-white/10 p-4 rounded-lg bg-black/30">
              <h3 className="font-bold text-accent mb-2">Datos del Sorteo</h3>
              <p className="text-sm text-gray-400 mb-4">La fecha y la lotería con la que juega el premio mayor.</p>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col">
                  <label className="text-xs text-gray-400 mb-1">Fecha del Sorteo</label>
                  <input type="date" className="input-field w-full max-w-xs" value={config.drawDate} onChange={(e) => setConfig({...config, drawDate: e.target.value})} />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-gray-400 mb-1">Lotería Oficial</label>
                  <input type="text" className="input-field w-full max-w-xs" value={config.lotteryName} onChange={(e) => setConfig({...config, lotteryName: e.target.value})} />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-gray-400 mb-1">Video del Sorteo (URL de YouTube o .mp4)</label>
                  <input type="text" className="input-field w-full max-w-xs" value={config.videoUrl} onChange={(e) => setConfig({...config, videoUrl: e.target.value})} placeholder="Ej: /videos/moto.mp4" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-gray-400 mb-1">Imagen de Portada (Banner URL)</label>
                  <input type="text" className="input-field w-full max-w-xs" value={config.bannerUrl} onChange={(e) => setConfig({...config, bannerUrl: e.target.value})} placeholder="Ej: /images/banner.png" />
                  <p className="text-[10px] text-gray-500 mt-1">Sube la imagen a internet y pega el link aquí, o usa /images/banner.png.</p>
                </div>
                
                {/* Nuevos Campos de Contacto y Pago */}
                <h3 className="font-bold text-[#FFD700] mt-4 mb-2 border-b border-white/10 pb-2">Información de Pago y Contacto</h3>
                <div className="flex flex-col">
                  <label className="text-xs text-gray-400 mb-1">Número de WhatsApp (Administrador)</label>
                  <input type="text" className="input-field w-full max-w-xs" value={config.whatsappAdmin} onChange={(e) => setConfig({...config, whatsappAdmin: e.target.value})} placeholder="Ej: 573228743384" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-gray-400 mb-1">Cuenta de Nequi para Pagos</label>
                  <input type="text" className="input-field w-full max-w-xs" value={config.nequiNumber} onChange={(e) => setConfig({...config, nequiNumber: e.target.value})} placeholder="Ej: 3228743384" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-gray-400 mb-1">Nombre del Titular Nequi</label>
                  <input type="text" className="input-field w-full max-w-xs" value={config.nequiName || ""} onChange={(e) => setConfig({...config, nequiName: e.target.value})} placeholder="Ej: Jose Surez" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-gray-400 mb-1">Código QR Nequi (Opcional)</label>
                  <input type="text" className="input-field w-full max-w-xs" value={config.qrUrl || ""} onChange={(e) => setConfig({...config, qrUrl: e.target.value})} placeholder="Ej: /images/qr.png" />
                  <p className="text-[10px] text-gray-500 mt-1">Sube la foto del QR a public/images/ y pon la ruta, o pega un link.</p>
                </div>

                <button onClick={handleSaveConfig} className="btn btn-primary mt-4 max-w-xs">Guardar Configuración</button>
              </div>

              <div className="mt-12 pt-6 border-t border-red-500/30">
                <h3 className="font-bold text-red-500 mb-2">Zona de Peligro (Nuevo Sorteo)</h3>
                <p className="text-xs text-gray-400 mb-4">Usa este botón SOLO cuando vayas a empezar una nueva rifa. Borrará absolutamente todas las reservas y dejará la grilla vacía para empezar de cero.</p>
                <button 
                  onClick={async () => {
                    if (confirm("🚨 ¿ESTÁS COMPLETAMENTE SEGURO? Esto borrará todas las boletas vendidas actualmente. Esta acción no se puede deshacer.")) {
                      try {
                        await fetch('/api/tickets/reset', { method: 'DELETE' });
                        alert("✅ Sorteo reiniciado. La grilla está vacía.");
                      } catch(e) {
                        alert("Error al reiniciar.");
                      }
                    }
                  }} 
                  className="btn bg-red-600 hover:bg-red-700 text-white mt-2 max-w-xs"
                >
                  ⚠️ Reiniciar Sorteo (Borrar Todo)
                </button>
              </div>
            </div>

            <div className="mb-8 border border-white/10 p-4 rounded-lg bg-black/30">
              <h3 className="font-bold text-accent mb-2">WhatsApp de Recepción</h3>
              <p className="text-sm text-gray-400 mb-4">Número al que los clientes enviarán sus comprobantes de Nequi.</p>
              <div className="flex gap-2">
                <input type="text" className="input-field w-full max-w-xs" defaultValue="573017952235" />
                <button className="btn btn-primary">Guardar</button>
              </div>
            </div>
            
            <div className="mb-8 border border-white/10 p-4 rounded-lg bg-black/30">
              <h3 className="font-bold text-accent mb-2">Renovar Sorteo (Nueva Rifa)</h3>
              <p className="text-sm text-gray-400 mb-4">Utiliza esta opción cuando entregues el premio actual y quieras lanzar una rifa nueva. Esto vaciará la lista de clientes, liberará los 10,000 números y reiniciará las estadísticas.</p>
              <button className="btn bg-danger hover:bg-red-700 text-white font-bold px-6 py-2 rounded">
                ⚠️ Reiniciar Plataforma
              </button>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
