import { asClass, createContainer, InjectionMode } from "awilix";
import { PaymentProvider } from "../providers/payment.provider";
import { PaymentService } from "../services/payment.service";

export const container = createContainer({
    injectionMode: InjectionMode.CLASSIC
});

container.register({
    paymentProvider: asClass(PaymentProvider).singleton(),
    paymentService: asClass(PaymentService).singleton()
});
