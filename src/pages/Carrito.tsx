import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PayPalButton } from "@/components/PayPalButton";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { obtenerMiCarrito, vaciarCarrito } from "@/api/carrito";
import type { CarritoConDetalles } from "@/api/carrito";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, Package, ArrowRight, Sparkles } from "lucide-react";

export default function Carrito() {
  const { user } = useAuth();
  const { refresh } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState<CarritoConDetalles | null>(null);
  const [loading, setLoading] = useState(true);
  const [vaciarLoading, setVaciarLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    const fetchCarrito = async () => {
      try {
        const data = await obtenerMiCarrito(user.id);
        setCarrito(data);
      } catch {
        setCarrito({ items: [], total: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchCarrito();
  }, [user?.id]);

  const handleVaciar = async () => {
    if (!user?.id) return;
    setVaciarLoading(true);
    try {
      await vaciarCarrito(user.id);
      setCarrito({ items: [], total: 0 });
      await refresh();
      toast({
        title: "Carrito vaciado",
        description: "Se han eliminado todos los productos del carrito.",
      });
    } catch {
      toast({
        title: "Error",
        description: "No se pudo vaciar el carrito.",
        variant: "destructive",
      });
    } finally {
      setVaciarLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-full mb-6 shadow-lg">
            <ShoppingCart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Grace Divine Marketplace
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Mi Carrito
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl backdrop-blur-sm bg-white/80">
              <div className="h-2 bg-gradient-to-r from-green-600 to-blue-600" />
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
                      <Package className="h-6 w-6 text-green-600" />
                    </div>
                    Productos en el Carrito
                  </CardTitle>
                  {carrito && carrito.items.length > 0 && (
                    <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white border-0 px-3 py-1">
                      {carrito.items.length} {carrito.items.length === 1 ? 'item' : 'items'}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-gray-600">Cargando carrito...</p>
                  </div>
                ) : !carrito || carrito.items.length === 0 ? (
                  <div className="text-center py-16">
                    <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Tu carrito está vacío
                    </h3>
                    <p className="text-gray-500 mb-6">
                      ¡Agrega algunos productos para comenzar!
                    </p>
                    <Button 
                      asChild 
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium shadow-lg transition-all duration-200 hover:shadow-xl"
                    >
                      <Link to="/productos" className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Ver productos
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {carrito.items.map((item) => {
                      const precio = item.productos?.precio ?? 0;
                      const subtotal = precio * item.cantidad;
                      return (
                        <div
                          key={item.id}
                          className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="relative flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-start gap-4">
                                <div className="p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
                                  <Package className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="flex-1">
                                  <Link
                                    to={`/productos/${item.productos?.codigo ?? ""}`}
                                    className="text-lg font-semibold text-gray-900 hover:text-green-600 transition-colors mb-1 block"
                                  >
                                    {item.productos?.nombre ?? "Producto"}
                                  </Link>
                                  <p className="text-sm text-gray-500 mb-2">
                                    Código: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{item.productos?.codigo}</span>
                                  </p>
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center border rounded-lg">
                                      <button
                                        type="button"
                                        className="p-2 hover:bg-gray-100 transition-colors rounded-l-lg"
                                        disabled={item.cantidad <= 1}
                                      >
                                        <Minus className="h-4 w-4" />
                                      </button>
                                      <span className="px-3 py-1 font-medium min-w-[3rem] text-center">
                                        {item.cantidad}
                                      </span>
                                      <button
                                        type="button"
                                        className="p-2 hover:bg-gray-100 transition-colors rounded-r-lg"
                                      >
                                        <Plus className="h-4 w-4" />
                                      </button>
                                    </div>
                                    <Badge className="bg-gradient-to-r from-green-100 to-blue-100 text-green-700 border-0">
                                      ${precio.toLocaleString("es-ES")} c/u
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-right ml-6">
                              <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                ${subtotal.toLocaleString("es-ES")}
                              </p>
                              <p className="text-sm text-gray-500">
                                ${precio.toLocaleString("es-ES")} × {item.cantidad}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="border-0 shadow-xl backdrop-blur-sm bg-white/80">
              <div className="h-2 bg-gradient-to-r from-blue-600 to-green-600" />
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  Resumen del Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {carrito && carrito.items.length > 0 && (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">${carrito.total.toLocaleString("es-ES")}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Envío</span>
                        <span className="font-medium text-green-600">Gratis</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Impuestos</span>
                        <span className="font-medium">$0</span>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Total</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                          ${carrito.total.toLocaleString("es-ES")}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            {carrito && carrito.items.length > 0 && (
              <>
                <Card className="border-0 shadow-xl backdrop-blur-sm bg-white/80">
                  <CardContent className="p-6 space-y-4">
                    <Button
                      variant="outline"
                      className="w-full h-12 border-red-200 hover:border-red-500 hover:bg-red-50 text-red-600 hover:text-red-700 transition-all duration-200 flex items-center gap-2"
                      onClick={handleVaciar}
                      disabled={vaciarLoading}
                    >
                      {vaciarLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                          <span>Vaciando...</span>
                        </div>
                      ) : (
                        <>
                          <Trash2 className="h-5 w-5" />
                          Vaciar Carrito
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      asChild
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium shadow-lg transition-all duration-200 hover:shadow-xl flex items-center gap-2"
                    >
                      <Link to="/productos">
                        <Package className="h-5 w-5" />
                        Seguir Comprando
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* PayPal Section */}
                <Card className="border-0 shadow-xl backdrop-blur-sm bg-gradient-to-r from-blue-600 to-green-600 text-white">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Pagar con PayPal</h3>
                      <p className="text-blue-100 text-sm mb-4">
                        Pago seguro con PayPal Sandbox
                      </p>
                    </div>
                    <PayPalButton
                      total={carrito.total}
                      carrito={carrito}
                      usuarioId={user!.id}
                      onSuccess={() => {
                        setCarrito({ items: [], total: 0 });
                        refresh();
                        toast({
                          title: "¡Pago completado!",
                          description: "Tu compra se ha procesado correctamente.",
                        });
                        navigate("/mis-compras");
                      }}
                      onError={(msg) => {
                        toast({
                          title: "Error de pago",
                          description: msg,
                          variant: "destructive",
                        });
                      }}
                    />
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
