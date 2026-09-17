export enum PaymentStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}

export interface IPaymentRequest {
    userId: string;
    amount: number;
}

export interface IPayment {
    userId: string;
    amount: number;
    status: PaymentStatus;
    providerReference?: string;
}

export interface IPaymentProviderResponse {
    approved: boolean;
    reference: string;
}

/**
 * Contrato del proveedor externo de pagos.
 * Debe ser mockeado en las pruebas unitarias: nunca se debe
 * depender de una implementación real durante las pruebas.
 */
export interface IPaymentProvider {
    sendPayment(userId: string, amount: number): Promise<IPaymentProviderResponse>;
}

export interface IPaymentService {
    processPayment(request: IPaymentRequest): Promise<IPayment>;
}
