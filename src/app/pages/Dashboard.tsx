import { Trophy, Users, CalendarDays, Activity } from "lucide-react";

export function Dashboard() {
  const stats = [
    {
      name: "Torneos Activos",
      value: "3",
      icon: Trophy,
      change: "+1 este mes",
      changeType: "positive",
    },
    {
      name: "Equipos Inscritos",
      value: "24",
      icon: Users,
      change: "+4 este mes",
      changeType: "positive",
    },
    {
      name: "Próximos Partidos",
      value: "8",
      icon: CalendarDays,
      change: "Esta semana",
      changeType: "neutral",
    },
    {
      name: "Goles Anotados",
      value: "142",
      icon: Activity,
      change: "Torneo actual",
      changeType: "neutral",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <item.icon className="h-6 w-6 text-green-600" aria-hidden="true" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {item.name}
                  </dt>
                  <dd>
                    <div className="text-2xl font-bold text-gray-900">
                      {item.value}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <span
                className={`text-sm ${
                  item.changeType === "positive"
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Próximos Partidos
          </h2>
          <div className="space-y-4">
            {[
              { id: 1, time: "14:00", team1: "Ingeniería A", team2: "Sistemas B", sport: "Fútbol", color: "bg-green-100 text-green-800" },
              { id: 2, time: "15:30", team1: "Mecatrónica", team2: "Industrial", sport: "Baloncesto", color: "bg-orange-100 text-orange-800" },
              { id: 3, time: "17:00", team1: "Eléctrica", team2: "Docentes", sport: "Voleibol", color: "bg-blue-100 text-blue-800" }
            ].map((match) => (
              <div
                key={match.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-900">{match.time}</div>
                    <div className="text-xs text-gray-500">Hoy</div>
                  </div>
                  <div className="h-8 w-px bg-gray-300"></div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900">{match.team1}</span>
                      <span className="text-sm text-gray-500 font-bold">vs</span>
                      <span className="font-medium text-gray-900">{match.team2}</span>
                    </div>
                    <span className={`inline-flex items-center w-max mt-1 px-2 py-0.5 rounded text-[10px] font-medium ${match.color}`}>
                      {match.sport}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-500 bg-white px-2 py-1 rounded border border-gray-200 shadow-sm hidden sm:block">
                  Cancha Principal
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Tabla Rápida (Torneo Interfacultades)
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pos
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipo
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PJ
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DG
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pts
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { pos: 1, name: "Ingeniería A", pj: 5, dg: "+8", pts: 13 },
                  { pos: 2, name: "Sistemas B", pj: 5, dg: "+5", pts: 12 },
                  { pos: 3, name: "Mecatrónica", pj: 5, dg: "+2", pts: 9 },
                  { pos: 4, name: "Eléctrica", pj: 5, dg: "-1", pts: 7 },
                  { pos: 5, name: "Industrial", pj: 5, dg: "-4", pts: 4 },
                ].map((team) => (
                  <tr key={team.pos}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      {team.pos}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                      {team.name}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-center">
                      {team.pj}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-center">
                      {team.dg}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-bold text-gray-900 text-center">
                      {team.pts}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}