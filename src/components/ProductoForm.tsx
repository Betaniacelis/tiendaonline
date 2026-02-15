import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { crearProducto, actualizarProducto } from "@/api/productos";
import type { Producto, ProductoInsert } from "@/api/productos";
import { Package, Save, X } from "lucide-react";
import React from "react";

interface ProductoFormProps {
  producto?: Producto;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductoForm({ producto, onSuccess, onCancel }: ProductoFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProductoInsert>({
    codigo: producto?.codigo || "",
    nombre: producto?.nombre || "",
    precio: producto?.precio || 0,
    descripcion: producto?.descripcion || "",
    stock: producto?.stock || 0,
  });

  // Reset form when producto changes
  React.useEffect(() => {
    setFormData({
      codigo: producto?.codigo || "",
      nombre: producto?.nombre || "",
      precio: producto?.precio || 0,
      descripcion: producto?.descripcion || "",
      stock: producto?.stock || 0,
    });
  }, [producto]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (producto) {
        await actualizarProducto(producto.id, formData);
        toast({
          title: "Producto actualizado",
          description: "El producto se ha actualizado correctamente.",
        });
      } else {
        await crearProducto(formData);
        toast({
          title: "Producto creado",
          description: "El producto se ha creado correctamente.",
        });
      }
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar el producto.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ProductoInsert) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = field === "precio" || field === "stock" ? Number(e.target.value) : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="border-0 shadow-xl backdrop-blur-sm bg-white/80">
      <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600" />
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          {producto ? "Editar Producto" : "Nuevo Producto"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="codigo" className="text-sm font-medium text-gray-700">
                Código del Producto *
              </Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={handleChange("codigo")}
                placeholder="Ej: PROD001"
                required
                disabled={loading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-sm font-medium text-gray-700">
                Nombre del Producto *
              </Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={handleChange("nombre")}
                placeholder="Ej: iPhone 15 Pro"
                required
                disabled={loading}
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="precio" className="text-sm font-medium text-gray-700">
              Precio (USD) *
            </Label>
            <Input
              id="precio"
              type="number"
              step="0.01"
              min="0"
              value={formData.precio}
              onChange={handleChange("precio")}
              placeholder="0.00"
              required
              disabled={loading}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock" className="text-sm font-medium text-gray-700">
              Stock *
            </Label>
            <Input
              id="stock"
              type="number"
              min="0"
              value={formData.stock || 0}
              onChange={handleChange("stock")}
              placeholder="0"
              required
              disabled={loading}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion" className="text-sm font-medium text-gray-700">
              Descripción
            </Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion || ""}
              onChange={handleChange("descripcion")}
              placeholder="Describe el producto..."
              rows={4}
              disabled={loading}
              className="resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="flex items-center gap-2 h-11"
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {producto ? "Actualizar" : "Crear"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
