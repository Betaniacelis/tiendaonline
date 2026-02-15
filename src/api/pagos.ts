import { supabase } from "@/integrations/supabase/client";
import type { CarritoItem } from "./carrito";

export async function crearOrdenPayPal(total: number): Promise<{ orderID: string }> {
  const { data, error } = await supabase.functions.invoke("crear-orden-paypal", {
    body: { total },
  });

  if (error) throw error;

  const result = data as { orderID?: string; error?: string };
  if (result.error) {
    throw new Error(result.error);
  }
  if (!result.orderID) {
    throw new Error("No se recibió el ID de la orden de PayPal");
  }

  return { orderID: result.orderID };
}

export type ConfirmarPagoPayload = {
  orderID: string;
  items: Array<{
    producto_id: string;
    cantidad: number;
    precio: number;
  }>;
  total: number;
};

export async function confirmarPago(payload: ConfirmarPagoPayload): Promise<{ ordenId: string }> {
  const { data, error } = await supabase.functions.invoke("confirmar-pago", {
    body: payload,
  });

  if (error) throw error;

  const result = data as { success?: boolean; ordenId?: string; error?: string };
  if (result.error) {
    throw new Error(result.error);
  }
  if (!result.success || !result.ordenId) {
    throw new Error("Error al confirmar el pago");
  }

  return { ordenId: result.ordenId };
}

export function carritoItemsToConfirmar(
  items: CarritoItem[]
): Array<{ producto_id: string; cantidad: number; precio: number }> {
  return items
    .filter((i) => i.productos)
    .map((i) => ({
      producto_id: i.producto_id,
      cantidad: i.cantidad,
      precio: i.productos!.precio,
    }));
}
