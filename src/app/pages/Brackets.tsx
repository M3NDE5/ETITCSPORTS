import { GitMerge } from "lucide-react";

export function Brackets() {
  return (
    <div className="space-y-6 min-h-[calc(100vh-8rem)] flex flex-col">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Llaves del Torneo</h1>
          <p className="mt-1 text-sm text-gray-500">Torneo Interfacultades 2026-I - Fase Final</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1 overflow-x-auto relative min-w-[800px]">
        
        {/* Simple Bracket representation */}
        <div className="flex h-full py-8 px-4 justify-between min-w-max w-full">
          
          {/* Quarter Finals */}
          <div className="flex flex-col justify-around w-64 space-y-12">
            <h3 className="text-center font-bold text-gray-500 mb-4">Cuartos de Final</h3>
            
            <div className="relative">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 flex flex-col shadow-sm">
                <div className="flex justify-between items-center py-2 px-3 border-b border-gray-200 font-bold text-gray-900">
                  <span>Ingeniería A</span>
                  <span>3</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 text-gray-500">
                  <span>Mecatrónica</span>
                  <span>1</span>
                </div>
              </div>
              <div className="absolute right-[-1rem] top-1/2 w-4 border-b-2 border-green-500"></div>
            </div>

            <div className="relative">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 flex flex-col shadow-sm">
                <div className="flex justify-between items-center py-2 px-3 border-b border-gray-200 text-gray-500">
                  <span>Sistemas B</span>
                  <span>0</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 font-bold text-gray-900">
                  <span>Eléctrica</span>
                  <span>2</span>
                </div>
              </div>
              <div className="absolute right-[-1rem] top-1/2 w-4 border-b-2 border-green-500"></div>
            </div>
          </div>

          {/* Connectors left */}
          <div className="flex flex-col justify-around w-8 relative">
             <div className="absolute right-0 top-1/4 bottom-3/4 w-8 border-t-2 border-r-2 border-b-2 border-green-500 rounded-r-lg"></div>
             <div className="absolute right-0 top-1/2 w-8 border-b-2 border-green-500"></div>
          </div>

          {/* Semi Finals */}
          <div className="flex flex-col justify-around w-64 z-10">
            <h3 className="text-center font-bold text-gray-500 mb-4">Semifinales</h3>
            <div className="relative">
              <div className="bg-white border-2 border-green-500 rounded-lg p-2 flex flex-col shadow-md">
                <div className="flex justify-between items-center py-2 px-3 border-b border-gray-200 font-bold text-gray-900">
                  <span>Ingeniería A</span>
                  <span className="text-green-600">-</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 font-bold text-gray-900">
                  <span>Eléctrica</span>
                  <span className="text-green-600">-</span>
                </div>
              </div>
              <div className="absolute left-[-2rem] top-1/2 w-8 border-b-2 border-green-500"></div>
              <div className="absolute right-[-2rem] top-1/2 w-8 border-b-2 border-gray-300"></div>
            </div>
          </div>

          {/* Connectors right */}
          <div className="flex flex-col justify-around w-8 relative">
             <div className="absolute right-0 top-1/2 w-8 border-b-2 border-gray-300"></div>
          </div>

          {/* Final */}
          <div className="flex flex-col justify-center w-64 z-10">
             <h3 className="text-center font-bold text-yellow-600 mb-4">Gran Final</h3>
             <div className="relative">
              <div className="bg-gradient-to-br from-yellow-50 to-white border-2 border-yellow-400 rounded-xl p-3 flex flex-col shadow-lg">
                <div className="flex justify-center items-center py-3 px-3 border-b border-yellow-100 text-gray-400 italic">
                  <span>Ganador Semifinal 1</span>
                </div>
                <div className="flex justify-center items-center py-3 px-3 text-gray-400 italic">
                  <span>Ganador Semifinal 2</span>
                </div>
              </div>
              <div className="absolute left-[-2rem] top-1/2 w-8 border-b-2 border-gray-300"></div>
            </div>
            
            <div className="mt-8 flex justify-center">
               <div className="bg-yellow-100 p-4 rounded-full border-4 border-yellow-400 shadow-inner">
                  <GitMerge className="w-12 h-12 text-yellow-500" />
               </div>
            </div>
            <p className="text-center mt-4 text-sm font-medium text-gray-500">Campeón por definir</p>
          </div>

        </div>
      </div>
    </div>
  );
}