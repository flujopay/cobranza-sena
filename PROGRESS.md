# Mini Sena — Avances

## Stack

- **Next.js** 16.2.1 (App Router)
- **React** 19.2.4
- **TypeScript** 5
- **Tailwind CSS** 4

---

## Estructura de carpetas

```
mini-sena/
├── app/
│   ├── (auth)/                   # Route group — sin segmento de URL
│   │   ├── layout.tsx            # Layout compartido: fondo azul degradado
│   │   ├── login/page.tsx        # /login
│   │   └── registro/page.tsx     # /registro
│   ├── dashboard/page.tsx        # /dashboard (stub)
│   ├── globals.css               # Variables de color Sena + Tailwind
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Redirect → /login
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx         # Formulario cliente con useActionState
│   │   └── RegisterForm.tsx      # Formulario cliente con useActionState
│   └── ui/
│       ├── InputField.tsx        # Input reutilizable con label y error
│       ├── SenaLogo.tsx          # Logotipo Sena (wordmark + chevron SVG)
│       └── SubmitButton.tsx      # Botón submit con estado pending (useFormStatus)
├── lib/
│   └── actions/
│       └── auth.ts               # Server Actions: loginAction, registerAction
├── PROGRESS.md                   # Este archivo
└── ...
```

---

## Fase 1 — Autenticación (maquetación) ✅

### Login (`/login`)
- Fondo oscuro azul con glows radiales (identidad visual Sena).
- Card blanca centrada, bordes redondeados, sombra prominente.
- Logotipo Sena (wordmark + doble chevron blanco).
- Campos: **Correo electrónico**, **Contraseña**.
- Link "¿Olvidaste tu contraseña?" (stub).
- Botón **Continuar** con estado loading via `useFormStatus`.
- Validación server-side via Server Action con `useActionState`.
- Al éxito redirige a `/dashboard`.

### Registro (`/registro`)
- Misma identidad visual que Login.
- Campos: **RUT**, **Correo electrónico**, **Contraseña**, **Confirmar contraseña**.
- Validaciones individuales por campo con mensajes de error inline.
- Botón **Crear cuenta** con estado loading.
- Al éxito redirige a `/dashboard`.

### Componentes reutilizables
| Componente | Descripción |
|---|---|
| `SenaLogo` | Wordmark "sena" + icono SVG de doble chevron |
| `InputField` | Input con label, placeholder, error inline, focus ring azul |
| `SubmitButton` | Botón submit que lee `useFormStatus` para mostrar estado pending |

### Server Actions (`lib/actions/auth.ts`)
- `loginAction`: valida email + password, retorna errores o `{ message: "ok" }`.
- `registerAction`: valida RUT + email + password + confirmación.
- Ambas son stubs listos para integrar con backend / NextAuth / JWT.

---

## Próximos pasos

- [ ] Integrar autenticación real (NextAuth.js o JWT propio)
- [ ] Middleware de protección de rutas (`middleware.ts`)
- [ ] Dashboard con sidebar y navegación
- [ ] Módulo de configuración SII (Fase 1 del flujo de cobranza)
- [ ] Importación de facturas (Fase 2)
