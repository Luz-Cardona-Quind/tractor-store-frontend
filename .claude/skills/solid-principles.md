---
name: solid-principles
description: 'Validar principios SOLID: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion. Genera reporte de violaciones SOLID.'
maxContextLines: 300
user-invokable: true
disable-model-invocation: false
scope: 'angular'
---

# Skill: SOLID Principles

**Scope**: Arquitectura de código (clases, servicios, componentes)  
**Trigger**: Auto (validación arquitectura), manual "validar SOLID", "refactorizar"  
**Hand-off**: NONE (async validation - no bloquea)  
**Output**: Reporte de violaciones SOLID + sugerencias

---

## Propósito

Validar que código sigue **principios SOLID** correctamente. Genera reporte de violaciones encontradas y sugerencias de refactorización.

---

## Validaciones Obligatorias

### 1. Single Responsibility Principle (SRP)

**Regla**: Cada clase DEBE tener UNA sola razón para cambiar

```typescript
// ❌ MAL - Múltiples responsabilidades
class UserService {
  getUser(id: string): User { }
  saveUser(user: User): void { }
  sendEmail(user: User): void { } // ❌ Responsabilidad diferente
  generateReport(): Report { } // ❌ Responsabilidad diferente
}

// ✅ BIEN - Responsabilidad única
class UserService {
  getUser(id: string): User { }
  saveUser(user: User): void { }
}

class EmailService {
  sendEmail(user: User): void { }
}

class ReportService {
  generateReport(): Report { }
}
```

**Validar**:
- ✅ Cada clase tiene una responsabilidad clara
- ✅ NO hay clases que hacen múltiples cosas no relacionadas
- ✅ Servicios están separados por responsabilidad

---

### 2. Open/Closed Principle (OCP)

**Regla**: Abierto para extensión, cerrado para modificación

```typescript
// ❌ MAL - Modificar clase existente
class PaymentProcessor {
  processPayment(amount: number, type: string): void {
    if (type === 'credit') {
      // lógica credit
    } else if (type === 'paypal') {
      // lógica paypal
    }
  }
}

// ✅ BIEN - Extensión sin modificación
abstract class PaymentProcessor {
  abstract processPayment(amount: number): void;
}

class CreditCardProcessor extends PaymentProcessor {
  processPayment(amount: number): void {
    // lógica credit
  }
}

class PayPalProcessor extends PaymentProcessor {
  processPayment(amount: number): void {
    // lógica paypal
  }
}
```

**Validar**:
- ✅ Nuevas funcionalidades se agregan mediante extensión
- ✅ NO se modifica código existente para agregar features
- ✅ Se usan interfaces/abstract classes para extensión

---

### 3. Liskov Substitution Principle (LSP)

**Regla**: Objetos de subclases DEBEN ser sustituibles por objetos de superclases

```typescript
// ❌ MAL - Violación LSP
class Bird {
  fly(): void { }
}

class Penguin extends Bird {
  fly(): void {
    throw new Error('Penguins cannot fly'); // ❌ Rompe contrato
  }
}

// ✅ BIEN - Respetar contrato
abstract class Bird {
  abstract move(): void;
}

class FlyingBird extends Bird {
  move(): void {
    this.fly();
  }
  fly(): void { }
}

class Penguin extends Bird {
  move(): void {
    this.swim();
  }
  swim(): void { }
}
```

**Validar**:
- ✅ Subclases respetan contratos de superclases
- ✅ NO se lanzan excepciones inesperadas
- ✅ Comportamiento es predecible

---

### 4. Interface Segregation Principle (ISP)

**Regla**: Interfaces DEBEN ser pequeñas y específicas - evitar interfaces gordas

```typescript
// ❌ MAL - Interface gorda
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
}

class Human implements Worker {
  work(): void { }
  eat(): void { }
  sleep(): void { }
}

class Robot implements Worker {
  work(): void { }
  eat(): void { } // ❌ Robot no come
  sleep(): void { } // ❌ Robot no duerme
}

// ✅ BIEN - Interfaces segregadas
interface Workable {
  work(): void;
}

interface Eatable {
  eat(): void;
}

interface Sleepable {
  sleep(): void;
}

class Human implements Workable, Eatable, Sleepable {
  work(): void { }
  eat(): void { }
  sleep(): void { }
}

class Robot implements Workable {
  work(): void { }
}
```

**Validar**:
- ✅ Interfaces son pequeñas y específicas
- ✅ Clases NO implementan métodos que no usan
- ✅ Interfaces están segregadas por responsabilidad

---

### 5. Dependency Inversion Principle (DIP)

**Regla**: Depender de abstracciones (interfaces), no de implementaciones concretas

```typescript
// ❌ MAL - Dependencia de implementación concreta
class UserService {
  private storage = new LocalStorage(); // ❌ Dependencia concreta
  
  saveUser(user: User): void {
    this.storage.save(user);
  }
}

// ✅ BIEN - Dependencia de abstracción
interface Storage {
  save(data: any): void;
  get(key: string): any;
}

class UserService {
  constructor(private storage: Storage) { } // ✅ Dependencia de interfaz
  
  saveUser(user: User): void {
    this.storage.save(user);
  }
}

// Implementaciones
class LocalStorage implements Storage { }
class ApiStorage implements Storage { }
```

**Validar**:
- ✅ Dependencias son de interfaces/tokens, no clases concretas
- ✅ Inyección de dependencias usa interfaces
- ✅ NO hay `new` de clases concretas en servicios

---

## Comandos de Validación

### 1. Buscar Violaciones

```bash
# Buscar clases con múltiples responsabilidades (heurística: muchas líneas)
find src/app -name "*.ts" -exec wc -l {} \; | sort -rn | head -20

# Buscar uso de 'new' en servicios (posible violación DIP)
grep -r "new [A-Z]" src/app --include="*.service.ts"
```

### 2. Análisis Manual

Revisar:
- Clases con > 300 líneas (posible SRP)
- Múltiples `if/else` por tipo (posible OCP)
- Interfaces con > 10 métodos (posible ISP)
- `new` en servicios (posible DIP)

---

## Validation Checklist

- [ ] Single Responsibility: Cada clase tiene una responsabilidad
- [ ] Open/Closed: Extensión sin modificación
- [ ] Liskov Substitution: Subclases respetan contratos
- [ ] Interface Segregation: Interfaces pequeñas y específicas
- [ ] Dependency Inversion: Dependencias de abstracciones

---

## Output del Reporte

```
✅ VALIDACIÓN SOLID PRINCIPLES

📊 RESUMEN
   • Clases analizadas: 67
   • Violaciones encontradas: 5
   • Warnings: 12

❌ VIOLACIONES CRÍTICAS
   1. UserService: Múltiples responsabilidades (SRP)
   2. PaymentProcessor: Modificación en lugar de extensión (OCP)
   3. ApiService: Dependencia de implementación concreta (DIP)

⚠️ WARNINGS
   1. FormService: Interface gorda (12 métodos) - ISP
   2. BaseComponent: Subclases no respetan contrato - LSP
   3. DataService: 450 líneas - posible SRP

💡 SUGERENCIAS
   • Separar UserService en 3 servicios (SRP)
   • Crear interfaces para PaymentProcessor (OCP)
   • Inyectar Storage interface en lugar de LocalStorage (DIP)
```

---
