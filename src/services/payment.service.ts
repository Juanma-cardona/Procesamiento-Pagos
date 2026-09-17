import type {
    IPayment,
    IPaymentProvider,
    IPaymentRequest,
    IPaymentService
} from "./interfaces/payment.interface";
import { PaymentStatus } from "./interfaces/payment.interface";

export class PaymentService implements IPaymentService {
    constructor(
        private readonly paymentProvider: IPaymentProvider
    ) {}

    async processPayment(request: IPaymentRequest): Promise<IPayment> {
        this.validateRequest(request);

        let providerResponse;
        try {
            providerResponse = await this.paymentProvider.sendPayment(
                request.userId,
                request.amount
            );
        } catch (error) {
            const reason = error instanceof Error ? error.message : "Error desconocido";
            throw new Error(`Error al procesar el pago con el proveedor: ${reason}`);
        }

        const status = providerResponse.approved
            ? PaymentStatus.APPROVED
            : PaymentStatus.REJECTED;

        return {
            userId: request.userId,
            amount: request.amount,
            status,
            providerReference: providerResponse.reference
        };
    }

    private validateRequest(request: IPaymentRequest): void {
        if (!request.userId || request.userId.trim() === "") {
            throw new Error("El usuario es obligatorio");
        }
        if (request.amount <= 0) {
            throw new Error("El monto debe ser mayor que 0");
        }
    }
}
