import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProductoByCodigo } from "@/api/productos";
import { agregarAlCarrito } from "@/api/carrito";
import type { Producto } from "@/api/productos";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Package, ShoppingCart } from "lucide-react";

export default function ProductoDetalle() {
  const { codigo } = useParams<{ codigo: string }>();
  const { user } = useAuth();
  const { refresh } = useCart();
  const { toast } = useToast();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!codigo) return;
    const fetchProducto = async () => {
      try {
        const data = await getProductoByCodigo(codigo);
        setProducto(data);
      } catch {
        setError("No se pudo cargar el producto");
      } finally {
        setLoading(false);
      }
    };
    fetchProducto();
  }, [codigo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto max-w-2xl px-4 py-12">
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto max-w-2xl px-4 py-12">
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">{error || "Producto no encontrado"}</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/productos" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> Volver a Productos
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link to="/productos" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Volver a Productos
          </Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Package className="h-5 w-5" /> {producto.nombre}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Código</p>
              <p className="font-medium">{producto.codigo}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Precio</p>
              <p className="text-xl font-semibold text-primary">
                ${Number(producto.precio).toLocaleString("es-ES")}
              </p>
            </div>
            {producto.descripcion && (
              <div>
                <p className="text-xs text-muted-foreground">Descripción</p>
                <p className="text-sm">{producto.descripcion}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground">Fecha de registro</p>
              <p className="text-sm">
                {new Date(producto.created_at).toLocaleDateString("es-ES")}
              </p>
            </div>
            <div className="flex items-center gap-2 border-t pt-4">
              <Input
                type="number"
                min={1}
                max={99}
                value={cantidad}
                onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20"
              />
              <Button
                onClick={async () => {
                  if (!user?.id) return;
                  setAdding(true);
                  try {
                    await agregarAlCarrito(user.id, producto.id, cantidad);
                    await refresh();
                    toast({
                      title: "Agregado al carrito",
                      description: `"${producto.nombre}" (${cantidad}) se agregó correctamente.`,
                    });
                  } catch {
                    toast({
                      title: "Error",
                      description: "No se pudo agregar al carrito.",
                      variant: "destructive",
                    });
                  } finally {
                    setAdding(false);
                  }
                }}
                disabled={adding || !user?.id}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {adding ? "Agregando..." : "Agregar al carrito"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
