import { useNavigate } from "react-router";
import { Trophy, Mail, Lock, LogIn, ArrowRight } from "lucide-react";

export function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-green-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-800/90 to-green-950/90 z-10" />
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1709133636649-7cb8959ddcb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjb21wbGV4JTIwc3RhZGl1bSUyMG11bHRpc3BvcnR8ZW58MXx8fHwxNzczMTE2ODc1fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Complejo deportivo"
        />
        
        <div className="relative z-20 flex flex-col justify-between p-12 w-full h-full text-white">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">ETITC Sports</h1>
              <p className="text-sm text-green-200">Plataforma Oficial</p>
            </div>
          </div>

          <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Vive la pasión del deporte en tu institución
            </h2>
            <p className="text-lg text-green-100/90 mb-8 leading-relaxed">
              Sistema integral para la gestión y monitoreo de torneos de fútbol, baloncesto, voleibol y tenis de mesa de la Escuela Tecnológica Instituto Técnico Central.
            </p>
            
            <div className="flex items-center space-x-4 text-sm text-green-200">
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2" />
                Torneos en vivo
              </div>
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2" />
                Estadísticas
              </div>
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2" />
                Comunidad
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:w-1/2 lg:px-20 xl:px-24 bg-gray-50 lg:bg-white">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="lg:hidden flex flex-col items-center text-center mb-8">
            <div className="h-16 w-16 rounded-2xl bg-green-600 flex items-center justify-center shadow-lg shadow-green-600/20 mb-4">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">ETITC Sports</h2>
            <p className="text-sm text-gray-500 mt-1">Gestión de torneos institucionales</p>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Bienvenido de nuevo
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Ingresa con tu correo institucional para continuar
            </p>
          </div>

          <div className="mt-8">
            <form className="space-y-5" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Correo electrónico institucional
                </label>
                <div className="mt-2 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-11 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 sm:text-sm transition-all"
                    placeholder="usuario@etitc.edu.co"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <div className="mt-2 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full pl-11 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 sm:text-sm transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Recordarme
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-green-600 hover:text-green-500 transition-colors">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm shadow-green-600/20 text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all items-center group"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Iniciar sesión
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </button>
              </div>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-gray-50 lg:bg-white text-gray-500">
                    ¿Eres organizador nuevo?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  className="w-full flex justify-center py-3 px-4 border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  Solicitar acceso como organizador
                </button>
              </div>
            </div>
            
            <p className="mt-10 text-center text-xs text-gray-400">
              &copy; 2026 Escuela Tecnológica Instituto Técnico Central. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}