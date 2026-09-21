import { describe, expect, it } from "vitest";
import { PaymentProvider } from "../../src/providers/payment.provider";

describe("PaymentProvider", () => {

    it("should approve the payment when the amount is below the limit", async () => {
        // Arrange
        const provider = new PaymentProvider();

        // Act
        const result = await provider.sendPayment("user-1", 50000);

        // Assert
        expect(result.approved).toBe(true);
        expect(result.reference).toContain("PROV-user-1-");
    });

    it("should reject the payment when the amount reaches the limit (boundary value)", async () => {
        // Arrange
        const provider = new PaymentProvider();

        // Act
        const result = await provider.sendPayment("user-2", 1_000_000);

        // Assert
        expect(result.approved).toBe(false);
    });

    it("should reject the payment when the amount is above the limit", async () => {
        // Arrange
        const provider = new PaymentProvider();

        // Act
        const result = await provider.sendPayment("user-3", 2_000_000);

        // Assert
        expect(result.approved).toBe(false);
    });

    it("should approve the payment for the smallest valid amount (boundary value)", async () => {
        // Arrange
        const provider = new PaymentProvider();

        // Act
        const result = await provider.sendPayment("user-4", 1);

        // Assert
        expect(result.approved).toBe(true);
    });

    it("should include the userId in the generated reference", async () => {
        // Arrange
        const provider = new PaymentProvider();

        // Act
        const result = await provider.sendPayment("special-user", 100);

        // Assert
        expect(result.reference.startsWith("PROV-special-user-")).toBe(true);
    });

});
