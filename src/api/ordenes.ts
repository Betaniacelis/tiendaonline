import { supabase } from "@/integrations/supabase/client";

export type OrdenItem = {
  id: string;
  orden_id: string;
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
  productos?: {
    codigo: string;
    nombre: string;
  } | null;
};

export type Orden = {
  id: string;
  usuario_id: string;
  paypal_order_id: string | null;
  total: number;
  estado: string;
  fecha: string;
  orden_items?: OrdenItem[];
};

export async function getMisOrdenes(usuarioId: string): Promise<Orden[]> {
  const { data, error } = await supabase
    .from("ordenes")
    .select(
      `
      id,
      paypal_order_id,
      total,
      estado,
      fecha,
      orden_items (
        id,
        producto_id,
        cantidad,
        precio_unitario,
        productos (codigo, nombre)
      )
    `
    )
    .eq("usuario_id", usuarioId)
    .order("fecha", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Orden[];
}
