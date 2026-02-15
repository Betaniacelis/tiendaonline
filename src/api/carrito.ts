import { supabase } from "@/integrations/supabase/client";

export type CarritoItem = {
  id: string;
  producto_id: string;
  cantidad: number;
  productos: {
    id: string;
    codigo: string;
    nombre: string;
    precio: number;
    descripcion: string | null;
  } | null;
};

export type CarritoConDetalles = {
  items: CarritoItem[];
  total: number;
};

export async function agregarAlCarrito(
  usuarioId: string,
  productoId: string,
  cantidad: number
): Promise<void> {
  if (cantidad < 1) throw new Error("La cantidad debe ser al menos 1");

  const { data: existente } = await supabase
    .from("carritos")
    .select("id, cantidad")
    .eq("usuario_id", usuarioId)
    .eq("producto_id", productoId)
    .maybeSingle();

  if (existente) {
    const { error } = await supabase
      .from("carritos")
      .update({ cantidad: existente.cantidad + cantidad })
      .eq("id", existente.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("carritos").insert({
      usuario_id: usuarioId,
      producto_id: productoId,
      cantidad,
    });
    if (error) throw error;
  }
}

export async function obtenerMiCarrito(usuarioId: string): Promise<CarritoConDetalles> {
  const { data, error } = await supabase
    .from("carritos")
    .select(
      `
      id,
      producto_id,
      cantidad,
      productos (id, codigo, nombre, precio, descripcion)
    `
    )
    .eq("usuario_id", usuarioId);

  if (error) throw error;

  const items = (data ?? []) as CarritoItem[];
  const total = items.reduce((sum, item) => {
    const precio = item.productos?.precio ?? 0;
    return sum + precio * item.cantidad;
  }, 0);

  return { items, total };
}

export async function vaciarCarrito(usuarioId: string): Promise<void> {
  const { error } = await supabase
    .from("carritos")
    .delete()
    .eq("usuario_id", usuarioId);
  if (error) throw error;
}

export async function getCarritoCount(usuarioId: string): Promise<number> {
  const { data, error } = await supabase
    .from("carritos")
    .select("cantidad")
    .eq("usuario_id", usuarioId);
  if (error) throw error;
  return (data ?? []).reduce((sum, row) => sum + (row.cantidad ?? 0), 0);
}
