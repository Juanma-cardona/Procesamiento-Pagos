import { container } from "./config/container";
import type { IPaymentService } from "./services/interfaces/payment.interface";

const paymentService = container.resolve<IPaymentService>("paymentService");

async function main() {
    try {
        const payment1 = await paymentService.processPayment({
            userId: "user-1",
            amount: 50000
        });
        console.log("Pago 1:", payment1);

        const payment2 = await paymentService.processPayment({
            userId: "user-2",
            amount: 2_000_000
        });
        console.log("Pago 2:", payment2);
    } catch (error) {
        console.error("Error procesando el pago:", error);
    }
}

main();
