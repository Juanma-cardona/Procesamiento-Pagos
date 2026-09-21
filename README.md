# Sistema de Procesamiento de Pagos — Evaluación Pruebas Unitarias (20%)

Ejercicio 3 de la guía "Evaluación Pruebas Unitarias". Aplicación de consola en
TypeScript que procesa pagos a través de un proveedor externo, siguiendo la
misma estructura y requisitos técnicos usados en el proyecto de ejemplo
(interfaces, inyección de dependencias con Awilix, pruebas con Vitest,
patrón AAA, mocks, code coverage y mutation testing).

## Estructura del proyecto

```
src/
├── config/
│   └── container.ts              # Configuración del contenedor Awilix
├── providers/
│   └── payment.provider.ts       # Implementación real del proveedor externo
├── services/
│   ├── interfaces/
│   │   └── payment.interface.ts
│   └── payment.service.ts        # Lógica de negocio (unidad bajo prueba)
└── index.ts                      # Punto de entrada (aplicación de consola)

test/
├── providers/
│   └── payment.provider.spec.ts
└── services/
    └── payment.service.spec.ts

docs/
└── mutation-testing.md           # Resultado inicial vs. final de coverage y mutation testing
```

## Reglas de negocio implementadas

- El usuario es obligatorio.
- El monto debe ser mayor que 0.
- Si el proveedor aprueba el pago → `APPROVED`.
- Si el proveedor rechaza el pago → `REJECTED`.
- Un pago rechazado nunca puede considerarse aprobado.
- Los errores del proveedor se capturan y se relanzan como un error
  controlado, sin dejar la excepción original sin manejar.

## Requisitos técnicos cubiertos

1. **Interfaces**: `IPaymentProvider`, `IPaymentService`, `IPayment`, etc.
2. **Inyección de dependencias**: `PaymentService` recibe `IPaymentProvider`
   por constructor; el contenedor Awilix (modo `CLASSIC`) resuelve la
   dependencia por nombre de parámetro.
3. **Pruebas unitarias con Vitest**: 16 pruebas en total, con casos
   exitosos, casos de error y valores límite (monto = 0, monto = 1,
   `userId` vacío o solo espacios).
4. **Patrón AAA** en cada prueba (Arrange / Act / Assert).
5. **Mocks**: el proveedor externo (`IPaymentProvider`) se mockea con
   `vi.fn()` en las pruebas de `PaymentService`; nunca se usa la
   implementación real. `PaymentProvider` en sí mismo se prueba de forma
   aislada en `payment.provider.spec.ts`.
6. **Code Coverage**: `npm run test:coverage` genera el reporte con Vitest
   (`text`, `html`, `lcov`). Resultado final: **100% statements/functions/
   lines**, 90% branches.
7. **Mutation Testing**: configurado con Stryker (`stryker.config.json`),
   apuntando a `src/services/*.ts` y `src/providers/*.ts`. Resultado final:
   **96.77%** de mutation score (0 mutantes sobrevivientes). Ver el detalle
   completo, incluyendo el resultado inicial y el análisis de los mutantes
   corregidos, en [`docs/mutation-testing.md`](docs/mutation-testing.md).

## Instalación

```bash
npm install
```

## Comandos

```bash
npm run dev             # Ejecuta la aplicación de consola
npm test                # Ejecuta las pruebas unitarias
npm run test:coverage   # Ejecuta las pruebas con reporte de cobertura
npm run stryker         # Ejecuta Mutation Testing
npm run build           # Compila el proyecto TypeScript
```

## Resultados

| Métrica | Resultado |
|---|---|
| Pruebas unitarias | 16 passed (16) |
| Coverage (statements / functions / lines) | 100% |
| Coverage (branches) | 90% |
| Mutation score (total) | 96.77% |
| Mutation score (de mutantes cubiertos) | 100.00% |
| Mutantes sobrevivientes | 0 |

Detalle completo del "antes vs. después" del mutation testing, incluyendo
qué mutantes sobrevivían inicialmente y por qué, en
[`docs/mutation-testing.md`](docs/mutation-testing.md).