# Resultados de Code Coverage y Mutation Testing

Este documento cumple con el entregable de "Mutation Testing" de la guía:
resultado inicial, mutantes sobrevivientes, análisis y resultado final.

## 1. Resultado inicial

### Code coverage (`npm run test:coverage`)

```
 % Coverage report from v8
----------------------|---------|----------|---------|---------|-------------------
File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------------|---------|----------|---------|---------|-------------------
All files             |   85.71 |       90 |      75 |   85.71 |
 providers            |       0 |      100 |       0 |       0 |
  payment.provider.ts |       0 |      100 |       0 |       0 | 12-14
 services             |     100 |       90 |     100 |     100 |
  payment.service.ts  |     100 |       90 |     100 |     100 | 24
----------------------|---------|----------|---------|---------|-------------------
```

`payment.provider.ts` no tenía ninguna prueba unitaria propia, por eso su
cobertura era 0%.

### Mutation testing (`npm run stryker`)

```
Mutation testing  [] 100% (elapsed: <1m, remaining: n/a) 31/31 Mutants tested (4 survived, 0 timed out)

All files             |  61.29 |   82.61 |       19 |         0 |          4 |        8 |        0 |
 providers            |   0.00 |    0.00 |        0 |         0 |          0 |        7 |        0 |
 services             |  79.17 |   82.61 |       19 |         0 |          4 |        1 |        0 |
```

**Mutation score total: 61.29%**

### Mutantes sobrevivientes identificados

Los 4 mutantes sobrevivientes estaban todos en la misma línea de
`payment.service.ts`:

```ts
if (!request.userId || request.userId.trim() === "") {
```

| Mutante | Cambio aplicado |
|---|---|
| LogicalOperator | `\|\|` → `&&` |
| ConditionalExpression | `request.userId.trim() === ""` → `false` |
| MethodExpression | `request.userId.trim() === ""` → `request.userId === ""` |
| StringLiteral | `""` → `"Stryker was here!"` |

Además, los 7 mutantes de `payment.provider.ts` quedaron marcados como
`[NoCoverage]`, es decir, ni siquiera fueron ejecutados porque no existía
ninguna prueba que llamara a ese archivo.

### ¿Por qué las pruebas no los detectaron?

Ninguna prueba usaba un `userId` compuesto **solo por espacios en blanco**
(por ejemplo `"   "`). Con un valor así:

- `!request.userId` es `false` (una cadena con espacios es "truthy").
- `request.userId.trim() === ""` es `true`.

Solo ese caso obliga a que exista el operador `||` y la llamada a `.trim()`
tal como están escritos. Sin una prueba que cubra ese escenario, Stryker
puede alterar la condición de varias formas sin que ninguna prueba falle.

De forma similar, al no existir pruebas para `PaymentProvider`, cualquier
mutación sobre su lógica (invertir la comparación `amount < 1_000_000`,
vaciar el método, cambiar el `reference`, etc.) pasaba desapercibida.

## 2. Correcciones aplicadas

1. Se agregó el caso de prueba `should throw an error when the user is
   only whitespace` en `payment.service.spec.ts`, usando `userId: "   "`.
2. Se creó `test/providers/payment.provider.spec.ts` con 5 pruebas que
   cubren:
   - Aprobación cuando el monto está por debajo del límite.
   - Rechazo cuando el monto alcanza el límite (valor límite).
   - Rechazo cuando el monto supera el límite.
   - Aprobación para el monto mínimo válido (valor límite).
   - Formato del `reference` generado.

## 3. Resultado final

> Completar esta sección con la salida real de `npm run test:coverage` y
> `npm run stryker` después de aplicar las correcciones.

### Code coverage

```
(pegar aquí la salida de `npm run test:coverage`)
```

### Mutation testing

```
(pegar aquí la salida de `npm run stryker`)
```

**Mutation score total: ___%** (antes: 61.29%)

## 4. Comparación

| Métrica | Inicial | Final |
|---|---|---|
| Mutation score total | 61.29% | ___ |
| Mutantes sobrevivientes | 4 | ___ |
| Mutantes sin cobertura (`NoCoverage`) | 8 | ___ |
| Coverage `payment.provider.ts` | 0% | ___ |
| Coverage branches `payment.service.ts` | 90% | ___ |
