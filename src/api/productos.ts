import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";

export type Producto = {
  id: string;
  codigo: string;
  nombre: string;
  precio: number;
  descripcion: string | null;
  stock: number;
  created_at: string;
};

export type ProductoInsert = TablesInsert<"productos"> & {
  stock?: number;
};

export async function listarProductos(): Promise<Producto[]> {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Producto[];
}

export async function getProductoByCodigo(codigo: string): Promise<Producto | null> {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("codigo", codigo)
    .maybeSingle();
  if (error) throw error;
  return data as Producto | null;
}

export async function crearProducto(input: ProductoInsert): Promise<Producto> {
  if (input.precio <= 0) {
    throw new Error("El precio debe ser mayor a 0");
  }
  if (input.stock !== undefined && input.stock < 0) {
    throw new Error("El stock no puede ser negativo");
  }
  const { data, error } = await supabase
    .from("productos")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data as Producto;
}

export async function actualizarProducto(id: string, input: Partial<ProductoInsert>): Promise<Producto> {
  if (input.precio !== undefined && input.precio <= 0) {
    throw new Error("El precio debe ser mayor a 0");
  }
  if (input.stock !== undefined && input.stock < 0) {
    throw new Error("El stock no puede ser negativo");
  }
  const { data, error } = await supabase
    .from("productos")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Producto;
}

export async function eliminarProducto(id: string): Promise<void> {
  const { error } = await supabase
    .from("productos")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
