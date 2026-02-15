import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { listarProductos, eliminarProducto } from "@/api/productos";
import { agregarAlCarrito } from "@/api/carrito";
import type { Producto } from "@/api/productos";
import { ProductoForm } from "@/components/ProductoForm";
import { Package, Plus, ShoppingCart, Star, TrendingUp, Sparkles, Search, Edit, Trash2, X, Minus } from "lucide-react";

function ProductoCard({
  producto,
  userId,
  onAdded,
  toast: showToast,
  isAdmin,
  onEdit,
  onDelete,
}: {
  producto: Producto;
  userId: string | null;
  onAdded: () => Promise<void>;
  toast: ReturnType<typeof useToast>["toast"];
  isAdmin: boolean;
  onEdit?: (producto: Producto) => void;
  onDelete?: (producto: Producto) => void;
}) {
  const [cantidad, setCantidad] = useState(1);
  const [adding, setAdding] = useState(false);

  const handleAgregar = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) return;
    
    // Verificar stock disponible
    if (cantidad > producto.stock) {
      showToast({
        title: "Stock insuficiente",
        description: `Solo hay ${producto.stock} unidades disponibles.`,
        variant: "destructive",
      });
      return;
    }
    
    setAdding(true);
    try {
      await agregarAlCarrito(userId, producto.id, cantidad);
      await onAdded();
      showToast({
        title: "Agregado al carrito",
        description: `"${producto.nombre}" (${cantidad}) se agregó correctamente.`,
      });
    } catch {
      showToast({
        title: "Error",
        description: "No se pudo agregar al carrito.",
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative bg-white p-6">
        {/* Product header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Link to={`/productos/${producto.codigo}`} className="block">
              <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                {producto.nombre}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                Código: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{producto.codigo}</span>
              </p>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-0">
              Nuevo
            </Badge>
            {isAdmin && (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onEdit?.(producto);
                  }}
                  className="h-8 w-8 p-0 border-blue-200 hover:border-blue-500 hover:bg-blue-50"
                >
                  <Edit className="h-3 w-3 text-blue-600" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete?.(producto);
                  }}
                  className="h-8 w-8 p-0 border-red-200 hover:border-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3 text-red-600" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              ${Number(producto.precio).toLocaleString("es-ES")}
            </span>
            <span className="text-sm text-gray-500">USD</span>
          </div>
        </div>

        {/* Description preview */}
        {producto.descripcion && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {producto.descripcion}
          </p>
        )}

        {/* Stock info */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Stock disponible:</span>
            <Badge className={`${
              producto.stock > 10 
                ? 'bg-green-100 text-green-700 border-0' 
                : producto.stock > 0 
                ? 'bg-yellow-100 text-yellow-700 border-0' 
                : 'bg-red-100 text-red-700 border-0'
            }`}>
              {producto.stock > 0 ? `${producto.stock} unidades` : 'Agotado'}
            </Badge>
          </div>
        </div>

        {/* Action section */}
        <div className="border-t pt-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center border rounded-lg">
              <button
                type="button"
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                className="p-2 hover:bg-gray-100 transition-colors rounded-l-lg"
                disabled={cantidad <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-3 py-1 font-medium min-w-[3rem] text-center">
                {cantidad}
              </span>
              <button
                type="button"
                onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                className="p-2 hover:bg-gray-100 transition-colors rounded-r-lg"
                disabled={cantidad >= producto.stock}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            <Button
              size="sm"
              className="flex-1 h-10 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-lg transition-all duration-200 hover:shadow-xl"
              onClick={handleAgregar}
              disabled={adding || !userId}
            >
              {adding ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Agregando...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Agregar</span>
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Rating indicator */}
        <div className="flex items-center gap-1 mt-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3 w-3 ${
                  star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">(4.0)</span>
        </div>
      </div>
    </div>
  );
}

export default function Productos() {
  const { user, role } = useAuth();
  const { count, refresh } = useCart();
  const { toast } = useToast();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; producto: Producto | null }>({ open: false, producto: null });

  const isAdmin = role === "admin";

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await listarProductos();
        setProductos(data);
      } catch {
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  const filteredProductos = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (producto: Producto) => {
    setEditingProducto(producto);
    setShowForm(true);
  };

  const handleDelete = (producto: Producto) => {
    setDeleteDialog({ open: true, producto });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.producto) return;
    
    try {
      await eliminarProducto(deleteDialog.producto.id);
      setProductos(prev => prev.filter(p => p.id !== deleteDialog.producto?.id));
      toast({
        title: "Producto eliminado",
        description: "El producto se ha eliminado correctamente.",
      });
    } catch {
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialog({ open: false, producto: null });
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProducto(null);
    // Recargar productos
    listarProductos().then(setProductos);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProducto(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 shadow-lg">
            <Package className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Grace Divine Marketplace
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Nuestros Productos
          </h2>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-0 shadow-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Admin Actions */}
          {isAdmin && (
            <div className="flex justify-center mb-8">
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium shadow-lg transition-all duration-200 hover:shadow-xl flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Nuevo Producto
              </Button>
            </div>
          )}
        </div>

        {/* Product Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <ProductoForm
                producto={editingProducto || undefined}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, open }))}>
          <AlertDialogContent className="border-0 shadow-xl backdrop-blur-sm bg-white/80">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-semibold text-gray-900">
                ¿Eliminar Producto?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                Estás a punto de eliminar <strong>"{deleteDialog.producto?.nombre}"</strong>. 
                Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-gray-200 hover:bg-gray-50">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Productos</p>
                  <p className="text-3xl font-bold">{productos.length}</p>
                </div>
                <Package className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">En Oferta</p>
                  <p className="text-3xl font-bold">{Math.floor(productos.length * 0.3)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Best Sellers</p>
                  <p className="text-3xl font-bold">{Math.floor(productos.length * 0.2)}</p>
                </div>
                <Sparkles className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Section */}
        <Card className="border-0 shadow-xl backdrop-blur-sm bg-white/80">
          <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600" />
          <CardHeader className="pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                Catálogo de Productos
              </CardTitle>
              {role === "admin" && (
                <Button 
                  asChild
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-lg transition-all duration-200 hover:shadow-xl"
                >
                  <Link to="/productos/nuevo" className="flex items-center gap-2">
                    <Plus className="h-5 w-5" /> 
                    Nuevo Producto
                  </Link>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-600">Cargando productos...</p>
              </div>
            ) : filteredProductos.length === 0 ? (
              <div className="text-center py-16">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {searchTerm ? "No se encontraron productos" : "No hay productos registrados"}
                </h3>
                <p className="text-gray-500">
                  {searchTerm ? "Intenta con otra búsqueda" : "Comienza agregando productos al catálogo"}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProductos.map((producto) => (
                  <ProductoCard
                    key={producto.id}
                    producto={producto}
                    userId={user?.id || null}
                    onAdded={refresh}
                    toast={toast}
                    isAdmin={isAdmin}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
