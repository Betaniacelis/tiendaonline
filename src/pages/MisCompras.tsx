import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { getMisOrdenes } from "@/api/ordenes";
import type { Orden } from "@/api/ordenes";
import { ShoppingBag, Package, CheckCircle, Clock, Calendar, DollarSign, TrendingUp, Star } from "lucide-react";

export default function MisCompras() {
  const { user } = useAuth();
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const fetchOrdenes = async () => {
      try {
        const data = await getMisOrdenes(user.id);
        setOrdenes(data);
      } catch {
        setOrdenes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrdenes();
  }, [user?.id]);

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'completada':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
      case 'pendiente':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'fallida':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'completada':
        return <CheckCircle className="h-4 w-4" />;
      case 'pendiente':
        return <Clock className="h-4 w-4" />;
      case 'fallida':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const totalGastado = ordenes.reduce((sum, orden) => sum + Number(orden.total), 0);
  const comprasCompletadas = ordenes.filter(o => o.estado === 'completada').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mb-6 shadow-lg">
            <ShoppingBag className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            Grace Divine Marketplace
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Mis Compras
          </h2>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Total Compras</p>
                  <p className="text-3xl font-bold">{ordenes.length}</p>
                </div>
                <ShoppingBag className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Completadas</p>
                  <p className="text-3xl font-bold">{comprasCompletadas}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Gastado</p>
                  <p className="text-3xl font-bold">${totalGastado.toLocaleString("es-ES")}</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Section */}
        <Card className="border-0 shadow-xl backdrop-blur-sm bg-white/80">
          <div className="h-2 bg-gradient-to-r from-orange-600 to-red-600" />
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
              Historial de Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-600">Cargando compras...</p>
              </div>
            ) : ordenes.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No tienes compras registradas
                </h3>
                <p className="text-gray-500 mb-6">
                  ¡Comienza comprando algunos productos!
                </p>
                <Button 
                  asChild 
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-medium shadow-lg transition-all duration-200 hover:shadow-xl"
                >
                  <Link to="/productos" className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Ver productos
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {ordenes.map((orden) => (
                  <div
                    key={orden.id}
                    className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative">
                      {/* Order Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg">
                            <Package className="h-6 w-6 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              {new Date(orden.fecha).toLocaleDateString("es-ES", {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                            <p className="font-mono text-sm text-gray-600">
                              Orden #{orden.id.slice(0, 8)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={`mb-2 ${getStatusColor(orden.estado)} flex items-center gap-1 w-fit`}>
                            {getStatusIcon(orden.estado)}
                            <span className="capitalize">{orden.estado}</span>
                          </Badge>
                          <p className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            ${Number(orden.total).toLocaleString("es-ES")}
                          </p>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Productos ({orden.orden_items?.length || 0})
                        </h4>
                        <div className="space-y-3">
                          {(orden.orden_items ?? []).map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-orange-50 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                  <Package className="h-4 w-4 text-orange-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {item.productos?.nombre ?? "Producto"}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Código: {item.productos?.codigo}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">
                                  ${Number(item.precio_unitario).toLocaleString("es-ES")} × {item.cantidad}
                                </p>
                                <p className="text-sm font-bold text-orange-600">
                                  ${(Number(item.precio_unitario) * item.cantidad).toLocaleString("es-ES")}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Footer */}
                      <div className="mt-4 pt-4 border-t flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {new Date(orden.fecha).toLocaleTimeString("es-ES", {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
