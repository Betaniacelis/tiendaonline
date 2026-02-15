import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import type { CarritoConDetalles } from "@/api/carrito";
import { crearOrdenPayPal, confirmarPago, carritoItemsToConfirmar } from "@/api/pagos";
import { vaciarCarrito } from "@/api/carrito";

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || "sb";

type PayPalButtonProps = {
  total: number;
  carrito: CarritoConDetalles;
  usuarioId: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
};

export function PayPalButton({
  total,
  carrito,
  usuarioId,
  onSuccess,
  onError,
}: PayPalButtonProps) {
  const items = carritoItemsToConfirmar(carrito.items);

  return (
    <PayPalScriptProvider
      options={{
        clientId: PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "capture",
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical", color: "gold", shape: "rect" }}
        createOrder={async () => {
          const { orderID } = await crearOrdenPayPal(total);
          return orderID;
        }}
        onApprove={async (data) => {
          try {
            await confirmarPago({
              orderID: data.orderID!,
              items,
              total,
            });
            await vaciarCarrito(usuarioId);
            onSuccess();
          } catch (err) {
            onError(err instanceof Error ? err.message : "Error al confirmar el pago");
          }
        }}
        onError={(err) => {
          onError(err?.message || "Error de PayPal");
        }}
      />
    </PayPalScriptProvider>
  );
}
