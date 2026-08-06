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

export default function TicketGrid({ onSelectTicket }: { onSelectTicket: (ticketDisplay: string, totalPrice: number) => void }) {
  const [search, setSearch] = useState("");
  const [occupiedTickets, setOccupiedTickets] = useState<Record<string, string>>({});
  const [displayTickets, setDisplayTickets] = useState<string[]>([]);
  const [recentPurchase, setRecentPurchase] = useState<string | null>(null);
  
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);
  
  const totalTickets = 10000;
  
  useEffect(() => {
    // 1. Obtener los tickets REALES de la base de datos
    fetch('/api/tickets')
      .then(res => res.json())
      .then(realData => {
        
        // 2. Generar algunos falsos para rellenar (marketing)
        const fakeOccupied: Record<string, string> = { ...realData }; 
        
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

        // 3. Generar la vista inicial
        const initialDisplay: string[] = [];
        
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

    // 3. Simular compras en VIVO
    const interval = setInterval(() => {
      setDisplayTickets(currentDisplay => {
        setOccupiedTickets(prevOccupied => {
          const freeNumbersInView = currentDisplay.filter(num => !prevOccupied[num]);
          
          if (freeNumbersInView.length > 0) {
            const luckyNum = freeNumbersInView[Math.floor(Math.random() * freeNumbersInView.length)];
            const buyer = fakeNames[Math.floor(Math.random() * fakeNames.length)];
            
            const newOccupied = { ...prevOccupied };
            newOccupied[luckyNum] = buyer;
            
            setRecentPurchase(`¡${buyer} acaba de reservar el #${luckyNum}! 🔥`);
            setTimeout(() => setRecentPurchase(null), 3000);
            
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

  const visibleGrid = search.length >= 2 ? searchResults : displayTickets;

  const toggleNumber = (num: string) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else {
      setSelectedNumbers([...selectedNumbers, num]);
    }
  };

  const selectRandom = (count: number) => {
    const newSelection = [...selectedNumbers];
    let added = 0;
    let attempts = 0;
    while (added < count && attempts < 10000) {
      attempts++;
      const randomNum = Math.floor(Math.random() * totalTickets).toString().padStart(4, '0');
      if (!newSelection.includes(randomNum) && !occupiedTickets[randomNum]) {
        newSelection.push(randomNum);
        added++;
      }
    }
    setSelectedNumbers(newSelection);
  };

  const clearSelection = () => {
    setSelectedNumbers([]);
  };

  const getPrice = (count: number) => {
    if (count === 0) return 0;
    if (count === 1) return 60000;
    if (count === 2) return 110000;
    if (count === 3) return 150000;
    if (count === 4) return 210000; 
    if (count >= 5) return count * 50000; 
    return count * 60000;
  };

  const handleCheckout = () => {
    if (selectedNumbers.length === 0) return;
    const count = selectedNumbers.length;
    const price = getPrice(count);
    const displayTicketsStr = selectedNumbers.join(", ");
    onSelectTicket(`${displayTicketsStr} (${count} Boleto${count > 1 ? 's' : ''})`, price);
  };

  return (
    <div className="w-full relative pb-20">
      {recentPurchase && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-40 bg-green-500 text-black px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(34,197,94,0.6)] animate-bounce">
          {recentPurchase}
        </div>
      )}

      <div className="bg-black/40 border border-white/10 rounded-xl p-3 sm:p-6 mb-8 max-w-xl mx-auto">
        <h3 className="text-xl mb-2 font-bold text-white text-center">🔎 Elige tus números</h3>
        
        {/* Máquina de la suerte */}
        <div className="mb-6 w-full box-border">
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest text-center mb-1">Máquina de la Suerte (Combos)</p>
          <p className="text-success text-xs font-black text-center mb-4 uppercase animate-pulse">
            🎁 ¡Elige un Combo y ahorra!
          </p>
          
          <div className="grid grid-cols-2 gap-3 w-full">
            <button onClick={() => selectRandom(1)} className="p-3 font-black rounded-xl border border-white/20 bg-black/50 text-white hover:bg-[#FFD700] hover:text-black transition-all shadow-md flex flex-col items-center justify-center">
              <span className="text-xl">+1 Boleto</span>
              <span className="text-sm font-normal opacity-80 mt-1">$60.000 COP</span>
            </button>
            
            <button onClick={() => selectRandom(2)} className="p-3 font-black rounded-xl border border-white/20 bg-black/50 text-white hover:bg-[#FFD700] hover:text-black transition-all shadow-md flex flex-col items-center justify-center">
              <span className="text-xl">+2 Boletos</span>
              <span className="text-sm font-normal opacity-80 mt-1">$110.000 COP</span>
              <span className="text-[10px] text-green-400 font-bold mt-0.5">(Ahorras 10k)</span>
            </button>
            
            <button onClick={() => selectRandom(3)} className="p-3 font-black rounded-xl border border-[#FFD700]/50 bg-black/50 text-white hover:bg-[#FFD700] hover:text-black transition-all shadow-md flex flex-col items-center justify-center relative overflow-hidden">
              <span className="text-xl">+3 Boletos</span>
              <span className="text-sm font-normal opacity-80 mt-1">$150.000 COP</span>
              <span className="text-[10px] text-[#FFD700] font-bold mt-0.5">(Ahorras 30k)</span>
            </button>
            
            <button onClick={() => selectRandom(5)} className="p-3 font-black rounded-xl border-2 border-success bg-success/10 text-white hover:bg-success hover:text-black transition-all shadow-[0_0_15px_rgba(0,255,102,0.2)] flex flex-col items-center justify-center">
              <span className="text-xl">+5 Boletos</span>
              <span className="text-sm font-normal opacity-90 mt-1">$250.000 COP</span>
              <span className="text-[10px] text-success font-black mt-0.5">(¡Llevas 5, pagas 4!)</span>
            </button>
          </div>
        </div>

        <div className="relative w-full">
          <input 
            type="text" 
            name="ticketSearch"
            id="ticketSearch"
            inputMode="none"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            placeholder="Buscar manualmente..." 
            className="input-field w-full text-center text-xl tracking-widest font-bold h-14"
            value={search}
            onChange={(e) => setSearch(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
          />
        </div>

        {/* Teclado numérico virtual integrado */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '8px', 
            width: '100%', 
            maxWidth: '240px', 
            margin: '1.5rem auto 0 auto' 
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button 
              key={num}
              type="button"
              onClick={() => { if (search.length < 4) setSearch(search + num); }}
              style={{ height: '40px', backgroundColor: '#1f2937', color: 'white', borderRadius: '10px', border: '1px solid #374151', fontSize: '18px', fontWeight: '900' }}
              className="w-full hover:bg-[#FFD700] hover:text-black transition-all shadow-md flex justify-center items-center"
            >
              {num}
            </button>
          ))}
          <button 
            type="button"
            onClick={() => setSearch("")}
            style={{ height: '40px', backgroundColor: '#7f1d1d', color: 'white', borderRadius: '10px', border: '1px solid #991b1b', fontSize: '12px', fontWeight: 'bold' }}
            className="w-full hover:bg-red-600 transition-all shadow-md flex justify-center items-center"
          >
            BORRAR
          </button>
          <button 
            type="button"
            onClick={() => { if (search.length < 4) setSearch(search + "0"); }}
            style={{ height: '40px', backgroundColor: '#1f2937', color: 'white', borderRadius: '10px', border: '1px solid #374151', fontSize: '18px', fontWeight: '900' }}
            className="w-full hover:bg-[#FFD700] hover:text-black transition-all shadow-md flex justify-center items-center"
          >
            0
          </button>
          <button 
            type="button"
            onClick={() => setSearch(search.slice(0, -1))}
            style={{ height: '40px', backgroundColor: '#713f12', color: 'white', borderRadius: '10px', border: '1px solid #854d0e', fontSize: '16px', fontWeight: 'bold' }}
            className="w-full hover:bg-yellow-600 transition-all shadow-md flex justify-center items-center"
          >
            ⌫
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-gray-300 font-bold text-sm">
            {search.length >= 2 ? "Resultados de búsqueda:" : "Tablero en VIVO:"}
          </h4>
          
          <div className="flex gap-4 text-xs font-bold">
            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-success rounded-full inline-block"></span> Libre</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-danger rounded-full inline-block"></span> Ocupado</div>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-2 md:gap-3">
          {visibleGrid.map(num => {
            const isOccupied = occupiedTickets[num];
            const isSelected = selectedNumbers.includes(num);
            
            return (
              <button
                key={num}
                disabled={!!isOccupied}
                onClick={() => toggleNumber(num)}
                style={{ 
                  backgroundColor: isOccupied ? '#2a0808' : (isSelected ? '#FFD700' : '#00ff66'), 
                  color: isOccupied ? '#9ca3af' : '#000000',
                  borderColor: isOccupied ? '#ff3333' : (isSelected ? '#ffffff' : '#00ff66')
                }}
                className={`ticket-btn relative overflow-hidden transition-all duration-300 h-16 sm:h-20 rounded-lg border flex flex-col items-center justify-center ${
                  isOccupied 
                  ? 'cursor-not-allowed opacity-60' 
                  : (isSelected ? 'scale-105 shadow-[0_0_15px_rgba(255,215,0,0.8)] border-2 border-white' : 'hover:scale-105 shadow-[0_0_10px_rgba(0,255,102,0.4)]')
                }`}
              >
                <span className="text-lg sm:text-2xl font-black leading-none">{num}</span>
                {!isOccupied && (
                  <span className="text-[9px] sm:text-[11px] uppercase font-bold tracking-widest mt-1 opacity-90">
                    {isSelected ? "¡ELEGIDO!" : "Libre"}
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

      {/* Botón flotante para pagar */}
      {selectedNumbers.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-black/95 border-t-4 border-[#FFD700] p-3 md:p-4 z-50 backdrop-blur-md">
          <div className="max-w-4xl mx-auto flex flex-wrap justify-between items-center gap-2">
            <div className="flex-1 min-w-[150px]">
              <p className="text-gray-300 text-xs font-bold mb-1">Tu Selección</p>
              <div className="flex items-center gap-3">
                <span className="text-xl md:text-2xl font-black text-white">{selectedNumbers.length} Boleto{selectedNumbers.length > 1 ? 's' : ''}</span>
                <span className="bg-[#FFD700] text-black px-3 py-1 rounded-lg font-black text-sm md:text-base">
                  ${getPrice(selectedNumbers.length).toLocaleString('es-CO')} COP
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button onClick={clearSelection} className="p-2 text-white bg-red-900/50 hover:bg-red-900 rounded-lg border border-red-500 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
              <button onClick={handleCheckout} className="bg-[#FFD700] hover:bg-yellow-400 text-black px-6 py-2 rounded-lg font-black uppercase text-sm md:text-base border-2 border-white/20 transition-all shadow-[0_0_15px_rgba(255,215,0,0.4)]">
                Pagar Ahora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
