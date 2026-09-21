import { describe, expect, it, vi } from "vitest";
import { PaymentService } from "../../src/services/payment.service";
import { PaymentStatus } from "../../src/services/interfaces/payment.interface";
import type { IPaymentProvider } from "../../src/services/interfaces/payment.interface";

function createProviderMock(): IPaymentProvider {
    return {
        sendPayment: vi.fn()
    };
}

describe("PaymentService", () => {

    it("should process a payment as APPROVED when the provider approves it", async () => {
        // Arrange
        const providerMock = createProviderMock();
        (providerMock.sendPayment as ReturnType<typeof vi.fn>).mockResolvedValue({
            approved: true,
            reference: "PROV-123"
        });
        const service = new PaymentService(providerMock);

        // Act
        const result = await service.processPayment({ userId: "user-1", amount: 50000 });

        // Assert
        expect(result.status).toBe(PaymentStatus.APPROVED);
        expect(result.providerReference).toBe("PROV-123");
        expect(providerMock.sendPayment).toHaveBeenCalledWith("user-1", 50000);
        expect(providerMock.sendPayment).toHaveBeenCalledTimes(1);
    });

    it("should process a payment as REJECTED when the provider rejects it", async () => {
        // Arrange
        const providerMock = createProviderMock();
        (providerMock.sendPayment as ReturnType<typeof vi.fn>).mockResolvedValue({
            approved: false,
            reference: "PROV-456"
        });
        const service = new PaymentService(providerMock);

        // Act
        const result = await service.processPayment({ userId: "user-2", amount: 2_000_000 });

        // Assert
        expect(result.status).toBe(PaymentStatus.REJECTED);
        expect(result.status).not.toBe(PaymentStatus.APPROVED);
    });

    it("should throw an error when the user is not provided", async () => {
        // Arrange
        const providerMock = createProviderMock();
        const service = new PaymentService(providerMock);

        // Act & Assert
        await expect(
            service.processPayment({ userId: "", amount: 1000 })
        ).rejects.toThrow("El usuario es obligatorio");
        expect(providerMock.sendPayment).not.toHaveBeenCalled();
    });

    it("should throw an error when the amount is 0 (boundary value)", async () => {
        // Arrange
        const providerMock = createProviderMock();
        const service = new PaymentService(providerMock);

        // Act & Assert
        await expect(
            service.processPayment({ userId: "user-1", amount: 0 })
        ).rejects.toThrow("El monto debe ser mayor que 0");
    });

    it("should throw an error when the amount is negative", async () => {
        // Arrange
        const providerMock = createProviderMock();
        const service = new PaymentService(providerMock);

        // Act & Assert
        await expect(
            service.processPayment({ userId: "user-1", amount: -100 })
        ).rejects.toThrow("El monto debe ser mayor que 0");
    });

    it("should process the smallest valid amount successfully (boundary value)", async () => {
        // Arrange
        const providerMock = createProviderMock();
        (providerMock.sendPayment as ReturnType<typeof vi.fn>).mockResolvedValue({
            approved: true,
            reference: "PROV-789"
        });
        const service = new PaymentService(providerMock);

        // Act
        const result = await service.processPayment({ userId: "user-1", amount: 1 });

        // Assert
        expect(result.status).toBe(PaymentStatus.APPROVED);
    });

    it("should handle a provider error correctly", async () => {
        // Arrange
        const providerMock = createProviderMock();
        (providerMock.sendPayment as ReturnType<typeof vi.fn>).mockRejectedValue(
            new Error("Provider timeout")
        );
        const service = new PaymentService(providerMock);

        // Act & Assert
        await expect(
            service.processPayment({ userId: "user-1", amount: 1000 })
        ).rejects.toThrow("Error al procesar el pago con el proveedor: Provider timeout");
    });

});
