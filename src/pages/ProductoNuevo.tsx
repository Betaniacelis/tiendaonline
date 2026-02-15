import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { crearProducto } from "@/api/productos";
import { useToast } from "@/hooks/use-toast";
import { Package, ArrowLeft } from "lucide-react";

const schema = z.object({
  codigo: z.string().min(1, "El código es requerido"),
  nombre: z.string().min(1, "El nombre es requerido"),
  precio: z.coerce.number().refine((n) => !isNaN(n) && n > 0, "El precio debe ser mayor a 0"),
  descripcion: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function ProductoNuevo() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      codigo: "",
      nombre: "",
      precio: undefined as unknown as number,
      descripcion: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (values.precio <= 0) {
      form.setError("precio", { message: "El precio debe ser mayor a 0" });
      return;
    }
    setLoading(true);
    try {
      await crearProducto({
        codigo: values.codigo,
        nombre: values.nombre,
        precio: values.precio,
        descripcion: values.descripcion || null,
      });
      toast({
        title: "Producto creado",
        description: `"${values.nombre}" se ha creado correctamente.`,
      });
      navigate("/productos");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al crear el producto";
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-xl px-4 py-12">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link to="/productos" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Volver a Productos
          </Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Package className="h-5 w-5" /> Nuevo Producto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="codigo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: PROD-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del producto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="precio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="0.00"
                          {...field}
                          value={field.value === undefined || field.value === null || isNaN(field.value) ? "" : field.value}
                          onChange={(e) => {
                            const v = e.target.value;
                            field.onChange(v === "" ? undefined : parseFloat(v));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="descripcion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción (opcional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descripción del producto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 pt-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creando..." : "Crear Producto"}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link to="/productos">Cancelar</Link>
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
