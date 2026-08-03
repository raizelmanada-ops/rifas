"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import TicketGrid from "@/components/TicketGrid";
import CheckoutForm from "@/components/CheckoutForm";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, minutes: 22, seconds: 59 });
  const [step, setStep] = useState<"grid" | "checkout" | "ticket">("grid");
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // Configuración del sorteo conectada a la BD
  const [drawDate, setDrawDate] = useState("2024-11-21");
  const [lotteryName, setLotteryName] = useState("Lotería de Boyacá");
  const [prizes, setPrizes] = useState("Ford Ranger XLT Bi-Turbo (2024)");
  const [videoUrl, setVideoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("/images/banner.png");
  const [whatsappAdmin, setWhatsappAdmin] = useState("573213349045");
  const [nequiNumber, setNequiNumber] = useState("3228743384");
  const [nequiName, setNequiName] = useState("Jose Surez");
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setDrawDate(data.drawDate || "2024-11-21");
          setLotteryName(data.lotteryName || "Lotería de Boyacá");
          setPrizes(data.prizes || "Ford Ranger XLT Bi-Turbo (2024)");
          setVideoUrl(data.videoUrl || "");
          if (data.bannerUrl) setBannerUrl(data.bannerUrl);
          if (data.whatsappAdmin) setWhatsappAdmin(data.whatsappAdmin);
          if (data.nequiNumber) setNequiNumber(data.nequiNumber);
          if (data.nequiName) setNequiName(data.nequiName);
          if (data.qrUrl) setQrUrl(data.qrUrl);
        }
      })
      .catch(console.error);
  }, []);

  // Helper para formatear la fecha a un texto amigable
  const formattedDate = new Date(drawDate + "T12:00:00").toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Simple countdown effect real basado en una fecha
  useEffect(() => {
    // Calculamos el tiempo real hasta el sorteo
    const targetDate = new Date(drawDate + "T23:59:59").getTime();
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [drawDate]);

  const handleTicketSelect = (ticket: string) => {
    setSelectedTicket(ticket);
    setStep("checkout");
  };

  const handleCheckoutSubmit = async (data: any) => {
    setUserData(data);
    setStep("ticket");
    
    // Guardar en la base de datos real
    try {
      await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          number: selectedTicket,
          customerData: data
        })
      });
    } catch (error) {
      console.error("Error reservando:", error);
    }
  };

  const faqs = [
    { q: "¿Es legal y autorizado este sorteo?", a: "Totalmente legal. Operamos bajo la razón social Inversiones Sorteos Millonarios S.A.S., regulados y autorizados por las entidades competentes a nivel nacional (Resolución #4592 de Juegos de Suerte y Azar)." },
    { q: "¿Dónde y cómo se entregan los premios?", a: "¡Nosotros te lo llevamos a la puerta de tu casa! Nuestro equipo logístico y legal viajará hasta tu ubicación con el vehículo en grúa. Firmaremos los traspasos notariales en tu ciudad." },
    { q: "¿Debo pagar impuestos si gano?", a: "¡Absolutamente NO! Asumimos el 100% de los impuestos de ganancia ocasional, gastos de matrícula, SOAT y traspaso. El vehículo se entrega a tu nombre." },
    { q: "¿Cómo sé que mi boleta es válida?", a: "Al finalizar tu compra, se genera una Boleta Digital Encriptada. Además, validamos tu identidad por WhatsApp para máxima seguridad." }
  ];

  return (
    <main className="min-h-screen pb-12 flex flex-col items-center selection:bg-accent selection:text-black">
      <header className="w-full relative z-10 flex justify-center bg-black border-b border-[#FFD700]/30 shadow-md" style={{ padding: '8px 0' }}>
        {bannerUrl ? (
          <img src={bannerUrl} alt="Sorteos Millonarios Banner" style={{ maxHeight: '200px', maxWidth: '100%', objectFit: 'contain' }} />
        ) : (
          <div className="py-6 text-center">
            <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#FFD700] to-[#b38728] uppercase font-serif">
              Sorteos Millonarios
            </h1>
          </div>
        )}
      </header>

      {step === "grid" && (
        <section className="w-full max-w-6xl mx-auto px-4 text-center mt-4">
          <div className="glass-panel p-4 md:p-8 mb-12 border-accent/20 relative overflow-hidden">
            {/* Fondo decorativo premium */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FFD700]/10 via-transparent to-transparent pointer-events-none"></div>
            
            {/* 1. EL VIDEO ARRIBA DE TODO */}
            <div className="w-full max-w-4xl mx-auto mb-8 relative z-10">
              <div className="aspect-video w-full rounded-2xl overflow-hidden border-2 border-[#FFD700] shadow-[0_0_40px_rgba(255,215,0,0.3)] bg-black flex items-center justify-center group relative">
                {videoUrl ? (
                  videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be") || videoUrl.includes("vimeo.com") ? (
                    <iframe 
                      src={videoUrl} 
                      className="w-full h-full" 
                      title="Video del Premio"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video 
                      src={videoUrl} 
                      className="w-full h-full object-cover" 
                      controls 
                      autoPlay 
                      muted 
                      loop 
                      playsInline
                    >
                      Tu navegador no soporta videos.
                    </video>
                  )
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer bg-black/40">
                    <div className="w-20 h-20 bg-gradient-to-tr from-[#FFD700] to-[#FDB931] rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(255,215,0,0.6)] transform group-hover:scale-110 transition-transform">
                      <svg className="w-10 h-10 text-black ml-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-[#FFD700] font-black uppercase tracking-widest text-lg drop-shadow-md">VIDEO PUBLICITARIO AQUÍ</p>
                  </div>
                )}
              </div>
            </div>

            {/* 2. TEXTO DEL PREMIO (Se cambiará en el Dashboard) */}
            <h2 className="text-xl md:text-3xl font-bold mb-6 text-white z-10 relative">
              El premio mayor actual es: <br/>
              <span className="text-accent text-3xl md:text-5xl font-black mt-3 block drop-shadow-lg">{prizes}</span>
            </h2>
            
            <div className="bg-black/60 border border-[#FFD700]/30 rounded-xl p-4 mb-6 inline-block shadow-[0_0_20px_rgba(255,215,0,0.15)] z-10 relative backdrop-blur-md">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1 font-bold">FECHA DEL GRAN SORTEO OFICIAL</p>
              <p className="text-3xl font-black text-white capitalize text-shadow">📅 {formattedDate}</p>
              <p className="text-sm text-[#FDB931] font-bold mt-1 uppercase">Con la {lotteryName}</p>
            </div>
            
            <div className="flex flex-col items-center justify-center gap-2 mt-2 mb-6 z-10 relative">
              <p className="text-danger font-black text-xl animate-pulse">¡ATENCIÓN: CUPOS AGOTÁNDOSE RÁPIDO!</p>
              <div className="w-full max-w-md h-4 bg-gray-900 rounded-full overflow-hidden border border-white/10 shadow-inner">
                <div className="h-full bg-gradient-to-r from-danger to-[#ff0000] rounded-full w-[88%] shadow-[0_0_10px_red]"></div>
              </div>
              <p className="text-xs text-gray-400">Las boletas se están vendiendo en tiempo real.</p>
            </div>
            
            <div className="flex justify-center gap-4 mt-6 z-10 relative">
              <div className="bg-black/80 p-3 rounded-lg border border-white/5 min-w-[80px]">
                <div className="text-2xl font-bold text-white">{timeLeft.days}</div>
                <div className="text-[10px] text-gray-500 uppercase">Días</div>
              </div>
              <div className="bg-black/80 p-3 rounded-lg border border-white/5 min-w-[80px]">
                <div className="text-2xl font-bold text-white">{timeLeft.hours}</div>
                <div className="text-[10px] text-gray-500 uppercase">Horas</div>
              </div>
              <div className="bg-black/80 p-3 rounded-lg border border-white/5 min-w-[80px]">
                <div className="text-2xl font-bold text-white">{timeLeft.minutes}</div>
                <div className="text-[10px] text-gray-500 uppercase">Minutos</div>
              </div>
              <div className="bg-black/80 p-3 rounded-lg border border-white/5 min-w-[80px]">
                <div className="text-2xl font-bold text-danger animate-pulse">{timeLeft.seconds}</div>
                <div className="text-[10px] text-gray-500 uppercase">Segundos</div>
              </div>
            </div>
          </div>
          
          <div id="grid-section" className="scroll-mt-10">
            <TicketGrid onSelectTicket={handleTicketSelect} />
          </div>
        </section>
      )}

      {step === "checkout" && (
        <section className="w-full max-w-xl mx-auto px-4 mt-12 animate-fade-in">
          <button onClick={() => setStep("grid")} className="text-gray-400 hover:text-accent mb-6 flex items-center gap-2 transition-colors">
            ← Volver a los números
          </button>
          
          <div className="bg-black/60 p-6 rounded-xl border border-accent/30 text-center mb-8 shadow-[0_0_30px_rgba(255,215,0,0.1)]">
            <p className="text-gray-400 text-sm uppercase tracking-widest font-bold">Número Seleccionado</p>
            <p className="text-7xl font-black text-accent mt-2 drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]">{selectedTicket}</p>
            <p className="text-success font-bold mt-2 animate-pulse">¡Este número está libre!</p>
            <p className="text-sm text-gray-300 mt-1">Llénalo y tendrás 15 minutos para pagarlo antes de que se libere.</p>
          </div>

          <CheckoutForm selectedTicket={selectedTicket!} onBack={() => setStep("grid")} onSuccess={handleCheckoutSubmit} />
        </section>
      )}

      {step === "ticket" && (
        <section className="w-full max-w-md mx-auto px-4 mt-12 animate-fade-in text-center">
          <div className="bg-success/20 text-success p-4 rounded-xl mb-8 font-bold border border-success/30 shadow-[0_0_20px_rgba(0,255,0,0.2)]">
            ✅ ¡Tu número ha sido reservado exitosamente!
          </div>
          
          <div className="relative glass-panel p-8 mb-8 overflow-hidden rounded-2xl border-2 border-accent/50 shadow-[0_0_40px_rgba(255,215,0,0.2)]">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent to-accent-hover"></div>
            
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-4 tracking-widest">BOLETA DIGITAL OFICIAL</h3>
              <div className="text-7xl font-black text-accent tracking-widest mb-6 drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]">
                {selectedTicket}
              </div>
              
              <div className="bg-black/50 p-4 rounded-lg mb-6 border border-white/5">
                <p className="text-sm font-bold text-accent capitalize tracking-wide">📅 SORTEO: {formattedDate}</p>
                <p className="text-xs text-gray-400 mt-1 uppercase">Con el premio mayor de la {lotteryName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-left border-t border-white/10 pt-6 mt-4">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Titular</p>
                  <p className="font-bold text-white truncate">{userData?.name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Cédula</p>
                  <p className="font-bold text-white">{userData?.idNumber}</p>
                </div>
                <div className="col-span-2 mt-2 bg-white/5 p-3 rounded border border-white/10 text-center">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Estado del Ticket</p>
                  <p className="text-warning font-bold animate-pulse mb-1">⚠️ PENDIENTE DE PAGO</p>
                  <p className="text-[10px] text-danger font-bold mb-2 uppercase">¡Tienes 15 min para pagar o se libera!</p>
                  <div className="bg-[#1A0C2B] border border-[#ff00a5]/30 rounded-lg p-3 text-center mt-2">
                    <p className="text-[10px] text-[#ff00a5] font-bold uppercase tracking-widest mb-1">Pagos por Nequi</p>
                    <p className="text-xl font-black text-white tracking-widest leading-none">{nequiNumber}</p>
                    {nequiName && <p className="text-[11px] text-gray-300 mt-2 font-medium uppercase tracking-wide">A nombre de: {nequiName}</p>}
                    
                    {qrUrl && (
                      <div className="mt-3 flex justify-center">
                        <img src={qrUrl} alt="QR Nequi" className="w-32 h-32 rounded-lg border-2 border-[#ff00a5]/50 shadow-[0_0_15px_rgba(255,0,165,0.3)] object-contain bg-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 border-t border-white/5 pt-3">
                <p className="text-[6px] text-gray-600 leading-tight text-justify opacity-40">
                  * TÉRMINOS Y CONDICIONES: Sorteos Millonarios S.A.S. actúa como intermediario. En caso de resultar ganador absoluto, el cliente deberá cancelar el 1.5% del valor comercial por la Póliza de Adjudicación Logística ANTES de la entrega. Este valor no es descontable del premio.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-6 text-gray-300 space-y-2 text-sm text-center bg-black/40 p-4 rounded-xl border border-white/5 shadow-inner">
            <p>
              Realiza el pago a Nequi y envía el comprobante por WhatsApp.
            </p>
            <p className="font-bold text-accent">
              ¡Una vez verifiquemos tu pago, te enviaremos tu Boleta Oficial Digital directamente a tu WhatsApp!
            </p>
          </div>
          
          <a 
            href={`https://wa.me/${whatsappAdmin}?text=Hola,%20acabo%20de%20reservar%20el%20número%20${selectedTicket}.%20Mi%20nombre%20es%20${userData?.name}%20con%20cédula%20${userData?.idNumber}.%20Quiero%20reportar%20mi%20pago%20a%20Nequi.`}
            target="_blank"
            className="w-full btn btn-primary flex items-center justify-center gap-2 text-lg h-16 shadow-[0_0_20px_rgba(255,215,0,0.3)]"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            ENVIAR COMPROBANTE DE PAGO
          </a>
        </section>
      )}

      {/* WINNERS SECTION */}
      <section className="w-full max-w-6xl mx-auto px-4 mt-24 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tighter">Felices Ganadores</h2>
          <p className="text-gray-400 font-bold text-lg">Ellos tomaron la decisión y hoy disfrutan sus premios.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-black/40 border border-white/5 rounded-xl overflow-hidden hover:border-accent/40 transition-colors shadow-lg">
            <img src="/images/winner1.jpg" alt="Ganador moto" className="w-full h-48 object-cover object-center" />
            <div className="p-4 text-center">
              <p className="text-lg font-bold text-white mb-1 uppercase">Camilo T. - Moto 0KM</p>
              <p className="text-[10px] text-accent font-bold uppercase tracking-wider">Entregado en Casa - Octubre 2024</p>
            </div>
          </div>
          
          <div className="bg-black/40 border border-white/5 rounded-xl overflow-hidden hover:border-accent/40 transition-colors shadow-lg">
            <img src="/images/winner2.jpg" alt="Ganador carro" className="w-full h-48 object-cover object-center" />
            <div className="p-4 text-center">
              <p className="text-lg font-bold text-white mb-1 uppercase">Andrés F. - Carro 0KM</p>
              <p className="text-[10px] text-accent font-bold uppercase tracking-wider">Entregado en Casa - Septiembre 2024</p>
            </div>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-xl overflow-hidden hover:border-accent/40 transition-colors shadow-lg">
            <img src="/images/winner3.jpg" alt="Familia ganadora" className="w-full h-48 object-cover object-center" />
            <div className="p-4 text-center">
              <p className="text-lg font-bold text-white mb-1 uppercase">Familia López - Camioneta 4x4</p>
              <p className="text-[10px] text-accent font-bold uppercase tracking-wider">Entregado en Finca - Agosto 2024</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <footer className="w-full max-w-4xl mx-auto px-4 mt-12 mb-20">
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-hover uppercase">Preguntas Frecuentes</h3>
          <p className="text-gray-400 text-sm mt-2">Haz clic para resolver tus dudas</p>
        </div>
        
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-white/10 rounded-lg bg-black/40 overflow-hidden">
              <button 
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full text-left p-4 flex justify-between items-center hover:bg-white/5 transition-colors"
              >
                <span className="font-bold text-white">{faq.q}</span>
                <span className="text-accent text-2xl leading-none">{openFaq === index ? "−" : "+"}</span>
              </button>
              {openFaq === index && (
                <div className="p-4 pt-0 text-sm text-gray-400 border-t border-white/5 bg-black/60">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </footer>

      {/* ULTRA FINE PRINT (T&C) HIDDEN */}
      <div className="w-full max-w-5xl mx-auto px-4 text-center mt-12 mb-4">
        <details className="group">
          <summary className="text-[10px] text-gray-700 cursor-pointer hover:text-gray-500 list-none select-none">
            Políticas de Privacidad y Condiciones Legales
          </summary>
          <div className="mt-4 opacity-20 text-[8px] text-gray-600 leading-tight text-justify">
            <p>
              * TÉRMINOS Y CONDICIONES: Sorteos Millonarios S.A.S. (NIT 901.452.873-4) actúa como intermediario de gestión. Al participar, el cliente acepta que en caso de resultar ganador absoluto del premio mayor, deberá cancelar el valor correspondiente a la "Póliza de Adjudicación Logística y Contractual" (equivalente al 1.5% del valor comercial del vehículo) directamente con la aseguradora aliada ANTES de la liberación y envío del automotor. Este valor no es descontable del premio por normativas vigentes. La plataforma asume gastos de matrícula e impuestos, pero la póliza de envío es responsabilidad única del ganador. Si el ganador se niega a cubrir dicha póliza en un plazo de 48 horas, el premio se declarará desierto. Las imágenes mostradas son con fines ilustrativos. 
            </p>
          </div>
        </details>
      </div>
    </main>
  );
}
