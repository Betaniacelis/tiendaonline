import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Shield, CalendarDays, ShoppingBag, Package, Star, Settings, LogOut } from "lucide-react";

export default function Profile() {
  const { user, profile, role, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-6 shadow-lg">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Grace Divine Marketplace
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Mi Perfil
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl backdrop-blur-sm bg-white/80 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-purple-600 to-blue-600" />
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
                    <User className="h-6 w-6 text-purple-600" />
                  </div>
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <User className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-purple-600 mb-1">Nombre completo</p>
                      <p className="font-semibold text-gray-900">{profile?.full_name || "No especificado"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-600 mb-1">Email</p>
                      <p className="font-semibold text-gray-900">{user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Shield className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-purple-600 mb-1">Rol</p>
                      <Badge 
                        className={`text-sm px-3 py-1 ${
                          role === "admin" 
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white" 
                            : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700"
                        }`}
                      >
                        {role === "admin" ? "👑 Administrador" : "🛒 Usuario"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <CalendarDays className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-600 mb-1">Miembro desde</p>
                      <p className="font-semibold text-gray-900">
                        {profile?.created_at ? new Date(profile.created_at).toLocaleDateString("es-ES", {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : "No disponible"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 shadow-xl backdrop-blur-sm bg-white/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Acciones Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-lg transition-all duration-200 hover:shadow-xl flex items-center gap-3"
                  onClick={() => window.location.href = '/productos'}
                >
                  <ShoppingBag className="h-5 w-5" />
                  Ver Productos
                </Button>
                
                <Button 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg transition-all duration-200 hover:shadow-xl flex items-center gap-3"
                  onClick={() => window.location.href = '/carrito'}
                >
                  <Package className="h-5 w-5" />
                  Mi Carrito
                </Button>
                
                <Button 
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium shadow-lg transition-all duration-200 hover:shadow-xl flex items-center gap-3"
                  onClick={() => window.location.href = '/mis-compras'}
                >
                  <Star className="h-5 w-5" />
                  Mis Compras
                </Button>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card className="border-0 shadow-xl backdrop-blur-sm bg-white/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="h-5 w-5 text-gray-600" />
                  Configuración
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full h-12 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 flex items-center gap-3"
                >
                  <Settings className="h-5 w-5" />
                  Editar Perfil
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full h-12 border-red-200 hover:border-red-500 hover:bg-red-50 text-red-600 hover:text-red-700 transition-all duration-200 flex items-center gap-3"
                  onClick={signOut}
                >
                  <LogOut className="h-5 w-5" />
                  Cerrar Sesión
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
