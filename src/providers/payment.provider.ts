import type { IPaymentProvider, IPaymentProviderResponse } from "../services/interfaces/payment.interface";

/**
 * Implementación concreta (simulada) del proveedor externo de pagos.
 * En una aplicación real, aquí se haría la llamada HTTP al proveedor
 * (Stripe, PayU, Wompi, etc). No se utiliza en las pruebas unitarias:
 * las pruebas del PaymentService deben aislar esta dependencia con un mock.
 */
export class PaymentProvider implements IPaymentProvider {
    async sendPayment(userId: string, amount: number): Promise<IPaymentProviderResponse> {
        // Simulación simple: se aprueba cualquier monto menor a 1,000,000.
        const approved = amount < 1_000_000;

        return {
            approved,
            reference: `PROV-${userId}-${Date.now()}`
        };
    }
}
