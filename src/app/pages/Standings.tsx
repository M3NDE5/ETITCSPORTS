import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";

export function Standings() {
  const standings = [
    { pos: 1, team: "Ingeniería A", p: 13, w: 4, d: 1, l: 0, f: 12, a: 4, gd: "+8", trend: "up" },
    { pos: 2, team: "Sistemas B", p: 12, w: 4, d: 0, l: 1, f: 10, a: 5, gd: "+5", trend: "same" },
    { pos: 3, team: "Mecatrónica", p: 9, w: 2, d: 3, l: 0, f: 8, a: 6, gd: "+2", trend: "up" },
    { pos: 4, team: "Eléctrica", p: 7, w: 2, d: 1, l: 2, f: 5, a: 6, gd: "-1", trend: "down" },
    { pos: 5, team: "Industrial", p: 4, w: 1, d: 1, l: 3, f: 4, a: 8, gd: "-4", trend: "down" },
    { pos: 6, team: "Docentes FC", p: 1, w: 0, d: 1, l: 4, f: 2, a: 12, gd: "-10", trend: "same" },
  ];

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tabla de Posiciones</h1>
          <p className="mt-1 text-sm text-gray-500">Torneo Interfacultades 2026-I - Fase de Grupos</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          <label htmlFor="group-select" className="sr-only">Seleccionar grupo</label>
          <select
            id="group-select"
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md shadow-sm"
          >
            <option>Grupo A</option>
            <option>Grupo B</option>
            <option>Grupo C</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pos
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipo
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" title="Partidos Jugados">
                  PJ
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" title="Partidos Ganados">
                  PG
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" title="Partidos Empatados">
                  PE
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" title="Partidos Perdidos">
                  PP
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" title="Goles a Favor">
                  GF
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" title="Goles en Contra">
                  GC
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" title="Diferencia de Goles">
                  DG
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-900 uppercase tracking-wider" title="Puntos">
                  PTS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {standings.map((team, index) => (
                <tr key={team.team} className={index < 2 ? "bg-green-50/50" : "hover:bg-gray-50"}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? "bg-green-600 text-white" : "text-gray-900"
                      }`}>
                        {team.pos}
                      </span>
                      {team.trend === "up" && <TrendingUp className="ml-2 w-4 h-4 text-green-500" />}
                      {team.trend === "down" && <TrendingDown className="ml-2 w-4 h-4 text-red-500" />}
                      {team.trend === "same" && <Minus className="ml-2 w-4 h-4 text-gray-400" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                        {index === 0 ? <Trophy className="w-4 h-4 text-green-600" /> : <span className="text-xs font-bold text-gray-400">{team.team.substring(0,2).toUpperCase()}</span>}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{team.team}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {team.w + team.d + team.l}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {team.w}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {team.d}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {team.l}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {team.f}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {team.a}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 text-center">
                    {team.gd}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-gray-900 text-center">
                    {team.p}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-wrap gap-4 text-sm text-gray-500">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-200 mr-2"></div>
          <span>Clasifican a cuartos de final (1ro y 2do)</span>
        </div>
        <div className="flex items-center ml-auto space-x-4">
          <span><strong className="text-gray-700">PJ:</strong> Partidos Jugados</span>
          <span><strong className="text-gray-700">PG:</strong> Partidos Ganados</span>
          <span><strong className="text-gray-700">PE:</strong> Partidos Empatados</span>
          <span><strong className="text-gray-700">PP:</strong> Partidos Perdidos</span>
          <span><strong className="text-gray-700">DG:</strong> Diferencia de Goles</span>
        </div>
      </div>
    </div>
  );
}