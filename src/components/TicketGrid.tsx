"use client";

import { useState, useEffect, useMemo } from "react";

const fakeNames = [
  "Carlos M.", "Ana G.", "Luis F.", "María R.", "Jorge T.", "Elena V.", "Pedro S.", "Lucía C.", "Andrés P.", "Diana M.",
  "José L.", "Laura B.", "Camilo H.", "Valentina J.", "Felipe O.", "Isabella N.", "David Q.", "Sofía D.", "Santiago Z.", "Camila Y.",
  "Diego W.", "Mariana X.", "Juan E.", "Daniela U.", "Mateo K.", "Juliana A.", "Alejandro I.", "Valeria E.", "Sebastián O.", "Natalia C.",
  "Gabriel G.", "Carolina V.", "Nicolás H.", "Andrea B.", "Martín M.", "Paula J.", "Samuel P.", "Gabriela S.", "Julián R.", "Manuela T.",
  "Emilio F.", "Luisa L.", "Simón D.", "Victoria Z.", "Tomás Q.", "Catalina N.", "Jerónimo X.", "Isabel W.", "Matías U.", "Antonia K.",
  "Hernán P.", "Mónica V.", "Alberto M.", "Gloria S.", "Esteban R.", "Silvia G.", "Javier C.", "Marta H.", "Ricardo L.", "Lorena B."
];

export default function TicketGrid({ onSelectTicket }: { onSelectTicket: (ticket: string) => void }) {
  const [search, setSearch] = useState("");
  const [occupiedTickets, setOccupiedTickets] = useState<Record<string, string>>({});
  const [displayTickets, setDisplayTickets] = useState<string[]>([]);
  const [recentPurchase, setRecentPurchase] = useState<string | null>(null);
  
  const totalTickets = 10000;
  
  useEffect(() => {
    // 1. Obtener los tickets REALES de la base de datos
    fetch('/api/tickets')
      .then(res => res.json())
      .then(realData => {
        
        // 2. Generar algunos falsos para rellenar (marketing)
        const fakeOccupied: Record<string, string> = { ...realData }; // Empezamos con los reales
        

        
        // Agregar unos 1000 falsos para dar volumen, pero SIN PISAR los reales
        let addedFake = 0;
        while (addedFake < 1000) {
          const randomNum = Math.floor(Math.random() * totalTickets).toString().padStart(4, '0');
          if (!fakeOccupied[randomNum]) {
            const randomName = fakeNames[Math.floor(Math.random() * fakeNames.length)];
            fakeOccupied[randomNum] = randomName;
            addedFake++;
          }
        }
        setOccupiedTickets(fakeOccupied);

        // 3. Generar la vista de 100 números (85 libres, 15 ocupados)
        const initialDisplay: string[] = [];
        
        // Forzar que si hay tickets reales recientes, algunos aparezcan en el tablero inicial
        const realKeys = Object.keys(realData);
        for (let i = 0; i < Math.min(5, realKeys.length); i++) {
          initialDisplay.push(realKeys[i]);
        }
        
        while (initialDisplay.length < 85) {
          const randomNum = Math.floor(Math.random() * totalTickets).toString().padStart(4, '0');
          if (!fakeOccupied[randomNum] && !initialDisplay.includes(randomNum)) {
            initialDisplay.push(randomNum);
          }
        }
        
        let occupiedCount = initialDisplay.filter(num => fakeOccupied[num]).length;
        while (occupiedCount < 15) {
          const randomNum = Math.floor(Math.random() * totalTickets).toString().padStart(4, '0');
          if (fakeOccupied[randomNum] && !initialDisplay.includes(randomNum)) {
            initialDisplay.push(randomNum);
            occupiedCount++;
          }
        }
        
        initialDisplay.sort();
        setDisplayTickets(initialDisplay);
      })
      .catch(console.error);

    // 3. Simular compras en VIVO (cada 4 a 10 segundos)
    const interval = setInterval(() => {
      setDisplayTickets(currentDisplay => {
        setOccupiedTickets(prevOccupied => {
          // Buscar un número verde (libre) que esté actualmente visible en pantalla
          const freeNumbersInView = currentDisplay.filter(num => !prevOccupied[num]);
          
          if (freeNumbersInView.length > 0) {
            // Elegir uno al azar y "comprarlo"
            const luckyNum = freeNumbersInView[Math.floor(Math.random() * freeNumbersInView.length)];

            const buyer = fakeNames[Math.floor(Math.random() * fakeNames.length)];
            
            const newOccupied = { ...prevOccupied };
            newOccupied[luckyNum] = buyer;
            
            // Mostrar alerta de compra
            setRecentPurchase(`¡${buyer} acaba de reservar el #${luckyNum}! 🔥`);
            setTimeout(() => setRecentPurchase(null), 3000);
            
            // Liberar uno antiguo al azar para mantener el balance visual (85/15)
            const occupiedInView = currentDisplay.filter(num => newOccupied[num] && newOccupied[num] !== buyer);
            if (occupiedInView.length > 15) {
              const numToFree = occupiedInView[Math.floor(Math.random() * occupiedInView.length)];
              delete newOccupied[numToFree];
            }
            
            return newOccupied;
          }
          return prevOccupied;
        });
        return currentDisplay;
      });
    }, Math.floor(Math.random() * 6000) + 4000);

    return () => clearInterval(interval);
  }, []);

  const searchResults = useMemo(() => {
    if (search.length < 2) return []; 
    const results = [];
    for (let i = 0; i < totalTickets; i++) {
      const numStr = i.toString().padStart(4, '0');
      if (numStr.includes(search)) {
        results.push(numStr);
        if (results.length >= 50) break;
      }
    }
    return results;
  }, [search]);

  // Si hay búsqueda, mostramos los resultados. Si no, mostramos la grilla mixta.
  const visibleGrid = search.length >= 2 ? searchResults : displayTickets;

  return (
    <div className="w-full relative">
      {/* Alerta de compra en vivo flotante */}
      {recentPurchase && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-black px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(34,197,94,0.6)] animate-bounce">
          {recentPurchase}
        </div>
      )}

      <div className="bg-black/40 border border-white/10 rounded-xl p-3 sm:p-6 mb-8 max-w-xl mx-auto">
        <h3 className="text-xl mb-4 font-bold text-white text-center">🔎 Elige tu número de 4 cifras</h3>
        <div className="relative w-full">
          <input 
            type="text" 
            name="ticketSearch"
            id="ticketSearch"
            inputMode="none"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            placeholder="Escribe tu número aquí..." 
            className="input-field w-full text-center text-2xl tracking-widest font-bold h-16"
            value={search}
            onChange={(e) => setSearch(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
          />
        </div>

        {/* Teclado numérico virtual integrado */}
        <div className="mt-6 grid grid-cols-3 gap-2 w-full max-w-[220px] mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button 
              key={num}
              type="button"
              onClick={() => { if (search.length < 4) setSearch(search + num); }}
              style={{ height: '50px', backgroundColor: '#1f2937', color: 'white', borderRadius: '10px', border: '1px solid #374151', fontSize: '20px', fontWeight: '900' }}
              className="w-full hover:bg-[#FFD700] hover:text-black transition-all shadow-md flex justify-center items-center"
            >
              {num}
            </button>
          ))}
          <button 
            type="button"
            onClick={() => setSearch("")}
            style={{ height: '50px', backgroundColor: '#7f1d1d', color: 'white', borderRadius: '10px', border: '1px solid #991b1b', fontSize: '12px', fontWeight: 'bold' }}
            className="w-full hover:bg-red-600 transition-all shadow-md flex justify-center items-center"
          >
            BORRAR
          </button>
          <button 
            type="button"
            onClick={() => { if (search.length < 4) setSearch(search + "0"); }}
            style={{ height: '50px', backgroundColor: '#1f2937', color: 'white', borderRadius: '10px', border: '1px solid #374151', fontSize: '20px', fontWeight: '900' }}
            className="w-full hover:bg-[#FFD700] hover:text-black transition-all shadow-md flex justify-center items-center"
          >
            0
          </button>
          <button 
            type="button"
            onClick={() => setSearch(search.slice(0, -1))}
            style={{ height: '50px', backgroundColor: '#713f12', color: 'white', borderRadius: '10px', border: '1px solid #854d0e', fontSize: '18px', fontWeight: 'bold' }}
            className="w-full hover:bg-yellow-600 transition-all shadow-md flex justify-center items-center"
          >
            ⌫
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-gray-300 font-bold">
            {search.length >= 2 ? "Resultados de búsqueda:" : "Tablero en VIVO (Verdes = Libres):"}
          </h4>
          
          <div className="flex gap-4 text-xs font-bold">
            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-success rounded-full inline-block"></span> Libre</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-danger rounded-full inline-block"></span> Ocupado</div>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-2 md:gap-3">
          {visibleGrid.map(num => {
            const isOccupied = occupiedTickets[num];
            return (
              <button
                key={num}
                disabled={!!isOccupied}
                onClick={() => onSelectTicket(num)}
                style={{ 
                  backgroundColor: isOccupied ? '#2a0808' : '#00ff66', 
                  color: isOccupied ? '#9ca3af' : '#000000',
                  borderColor: isOccupied ? '#ff3333' : '#00ff66'
                }}
                className={`ticket-btn relative overflow-hidden transition-all duration-300 h-16 sm:h-20 rounded-lg border flex flex-col items-center justify-center ${
                  isOccupied 
                  ? 'cursor-not-allowed opacity-60' 
                  : 'hover:scale-105 shadow-[0_0_10px_rgba(0,255,102,0.4)]'
                }`}
              >
                <span className="text-lg sm:text-2xl font-black leading-none">{num}</span>
                {!isOccupied && (
                  <span className="text-[9px] sm:text-[11px] uppercase font-bold tracking-widest mt-1 opacity-90">
                    Libre
                  </span>
                )}
                {isOccupied && (
                  <span className="text-[8px] sm:text-[10px] uppercase tracking-wider mt-0.5 opacity-70 px-1 text-center leading-tight truncate w-full">
                    {isOccupied}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        
        {visibleGrid.length === 0 && (
          <p className="text-gray-500 mt-4 text-center">No se encontraron números disponibles para esa combinación.</p>
        )}
      </div>
    </div>
  );
}
