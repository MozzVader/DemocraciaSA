# 🧭 Guía de Navegación del Proyecto

> Cómo encontrar rápidamente qué archivo editar, qué componente controla cada parte de la interfaz, y cómo navegar el código fuente de DemocraciaSA.

---

## 📁 Regla N° 1: Todo está en `/src/components/game/`

Cada "pedazo visual" de tu juego es un **componente** y tiene su propio archivo:

| Lo que ves en pantalla | Archivo que lo controla |
|---|---|
| La barra superior (título, recursos, login) | `GameHeader.tsx` |
| El rotativo de noticias | `NewsTicker.tsx` |
| El botón gigante de influenciar | `InfluenceClicker.tsx` |
| La lista de generadores (militantes, influencers...) | `GeneratorPanel.tsx` |
| Las operaciones especiales (upgrades) | `UpgradesPanel.tsx` |
| Las estadísticas (sidebar izquierda) | `StatsPanel.tsx` (export `StatsPanel`) |
| Los logros/milestones | `StatsPanel.tsx` (export `MilestonesPanel`) |
| Los toasts de logro (abajo a la derecha) | `AchievementToast.tsx` |
| El diálogo de login/registro | `AuthDialog.tsx` |

> ⚠️ **Nota importante**: `MilestonesPanel` y `StatsPanel` viven en el **mismo archivo** (`StatsPanel.tsx`). Esto es porque están relacionados, pero pueden ser confusos. Si buscas "MilestonePanel" (singular) no lo vas a encontrar.

---

## 📁 Regla N° 2: La "maqueta" general está en `page.tsx`

El archivo `src/app/page.tsx` es el que **arma todo el layout**. No tiene la lógica de cada componente, pero define:

- **El orden** en que se muestran los componentes
- **El layout responsive** (móvil vs desktop)
- Los fondos decorativos
- El footer con botones de guardar/resetear

Por ejemplo, si quisieras agregar un componente nuevo entre el header y el rotativo, ahí es donde tenés que ir.

### Árbol visual completo

```
page.tsx
├── Fondos decorativos (gradientes)
├── GameHeader
├── NewsTicker
├── main (contenido principal)
│   ├── Móvil: InfluenceClicker → Tabs → StatsPanel
│   └── Desktop: [StatsPanel | Clicker + Generadores | Upgrades + Milestones]
├── Footer
└── AchievementToast
```

---

## 📁 Regla N° 3: Los DATOS del juego están en `/src/lib/`

Ahí están los archivos que **no renderizan nada** pero definen cómo funciona todo:

| Archivo | Qué hace |
|---|---|
| `config.ts` | Definiciones de generadores, upgrades, milestones, fases |
| `calculator.ts` | Cálculos (costos, producción, multiplicadores) |
| `save.ts` | Lógica de guardar/cargar |
| `cloud-save.ts` | Guardado en Supabase |
| `news.ts` | Títulos de noticias aleatorias |
| `supabase.ts` | Configuración del cliente Supabase |
| `types.ts` | Tipos TypeScript |

Si querés cambiarle el nombre a un generador, su emoji, su costo base, o agregar uno nuevo → `config.ts`.
Si querés cambiar cómo se calcula un costo → `calculator.ts`.

---

## 📁 Regla N° 4: Los ESTADOS están en `/src/store/`

| Archivo | Qué hace |
|---|---|
| `game-store.ts` | Estado del juego (recursos, compras, milestones, fases). Es el cerebro. |
| `auth-store.ts` | Estado de autenticación (login, registro, logout, Google OAuth) |

Estos usan **Zustand**, una librería de estado global. Cualquier componente puede leer y escribir en estos stores con `useGameStore()` o `useAuthStore()`.

---

## 📁 Regla N° 5: El loop del juego está en `/src/hooks/`

| Archivo | Qué hace |
|---|---|
| `use-game-loop.ts` | Inicializa el juego, el auth, y ejecuta el tick cada segundo |

Si querés cambiar cada cuánto se guarda automáticamente, o agregar lógica que se ejecute periódicamente, es ahí.

---

## 🔍 Cómo encontrar algo: Buscar texto visible

La técnica más útil para cualquier proyecto React es **buscar texto que veas en pantalla**. Abrí tu editor (VS Code) y usá `Ctrl + Shift + F` (buscar en todos los archivos).

### Ejemplos prácticos

| Lo que querés hacer | Qué buscar con Ctrl+Shift+F | Te lleva a... |
|---|---|---|
| Cambiar "Red de Influencia" | `Red de Influencia` | `GeneratorPanel.tsx` |
| Cambiar el color dorado del título | `DEMOCRACIA` | `GameHeader.tsx` |
| Cambiar el costo del primer generador | `Militante` | `config.ts` |
| Cambiar el estilo de las cards | `rgba(15,23,41,0.8)` | Todos los paneles |
| Modificar las noticias | `getRandomHeadline` | `news.ts` |
| Cambiar tamaño del botón de influenciar | `INFLUENCIAR` | `InfluenceClicker.tsx` |
| Cambiar color del progreso de democracia | `--progress-color` | `StatsPanel.tsx` y `globals.css` |
| Agregar un nuevo generador | (ir directamente a) `GENERATORS` | `config.ts` |
| Cambiar frecuencia del autosave | `AUTOSAVE` o `setInterval` | `use-game-loop.ts` |
| Modificar el diálogo de login | `Acceso Clasificado` | `AuthDialog.tsx` |
| Cambiar duración del toast de logro | `5000` o `duration` | `AchievementToast.tsx` |

---

## 🎨 Tailwind CSS = las clases largas

Todo ese "alphabet soup" en las clases como `className="text-lg font-bold uppercase tracking-wider"` es **Tailwind CSS**. Cada clase es un estilo:

| Clase | Qué significa |
|---|---|
| `text-lg` | font-size grande |
| `font-bold` | negrita (font-weight: 700) |
| `uppercase` | mayúsculas (text-transform) |
| `px-4 py-3` | padding horizontal 4, vertical 3 |
| `border-b` | borde inferior |
| `opacity-60` | 60% de opacidad |
| `hover:bg-[#d4af37]/5` | al hacer hover, fondo dorado 5% de opacidad |
| `md:grid-cols-[280px_1fr_300px]` | grid de 3 columnas en desktop |
| `tracking-wider` | más espacio entre letras |
| `animate-ping` | animación de ping/pulso |

Los colores entre corchetes como `bg-[#d4af37]` son colores personalizados (en este caso, dorado).

---

## 🎨 Colores clave del juego

Estos son los colores principales usados en todo el proyecto. Buscalos para encontrar los estilos:

| Color | Uso |
|---|---|
| `#0a0a12` | Fondo principal (casi negro) |
| `#d4af37` | Dorado: accent principal, títulos, bordes activos |
| `rgba(15,23,41,0.8)` | Fondo de cards y paneles |
| `text-green-400` | Color del dinero |
| `text-red-400` | Rotativo, alertas |
| `border-border/30` | Bordes sutiles |

---

## 🧠 Conceptos clave de React (repaso rápido)

- **Componente**: Un archivo `.tsx` que retorna JSX (HTML-like). Cada componente es independiente y reutilizable. Se nombra con PascalCase: `GameHeader.tsx`.
- **Props**: Parámetros que un componente padre le pasa a un hijo. Ej: `<AuthDialog open={true} />`
- **Store (Zustand)**: Estado global. Cualquier componente puede leer/escribir con `useGameStore()`. Cambiás el store → se re-renderiza todo lo que lo usa.
- **useEffect**: Código que se ejecuta cuando algo cambia. Se usa para inicializar, reaccionar a cambios, y limpiar recursos.
- **useState**: Estado local de un componente. Solo ese componente puede leerlo y modificarlo.

---

## 📁 Mapa completo de carpetas

```
src/
├── app/
│   ├── layout.tsx          ← Layout raíz (fuentes, tema oscuro)
│   └── page.tsx            ← Página principal (arma el layout)
├── components/
│   └── game/
│       ├── AchievementToast.tsx   ← Toasts de logro
│       ├── AuthDialog.tsx         ← Diálogo login/registro
│       ├── GeneratorPanel.tsx     ← Panel de generadores
│       ├── GameHeader.tsx         ← Barra superior
│       ├── InfluenceClicker.tsx   ← Botón de influenciar
│       ├── NewsTicker.tsx         ← Rotativo de noticias
│       ├── StatsPanel.tsx         ← Stats + Milestones (dos exports)
│       └── UpgradesPanel.tsx      ← Panel de upgrades
├── hooks/
│   └── use-game-loop.ts    ← Loop del juego (tick cada segundo)
├── lib/
│   ├── calculator.ts       ← Cálculos del juego
│   ├── cloud-save.ts       ← Guardado en Supabase
│   ├── config.ts           ← Datos de generadores, upgrades, etc.
│   ├── news.ts             ← Noticias aleatorias
│   ├── save.ts             ← Guardado local
│   ├── supabase.ts         ← Cliente Supabase
│   └── types.ts            ← Tipos TypeScript
├── store/
│   ├── auth-store.ts       ← Estado de autenticación
│   └── game-store.ts       ← Estado del juego (Zustand)
└── styles/
    └── globals.css         ← Estilos globales + scrollbar custom
```

---

## 🛠️ Flujo de trabajo recomendado para editar algo

1. **Veo algo en el navegador que quiero cambiar** (ej: el texto de un botón, un color, un tamaño).
2. **Inspecciono el elemento** con click derecho → "Inspeccionar elemento" en el navegador. Ahí veo el HTML renderizado y las clases aplicadas.
3. **Busco un texto único** de ese elemento con `Ctrl+Shift+F` en VS Code. Busco algo que solo aparezca en ese componente.
4. **Llego al archivo correcto** y edito lo que necesite.
5. **El navegador se actualiza solo** con hot reload. No hace falta refrescar manualmente.

> 💡 Si en algún momento te trabás, decime "quiero cambiar X" y te digo exactamente en qué archivo y línea ir. Pero con esta guía y la técnica de `Ctrl+Shift+F` buscando texto visible, vas a poder encontrar el 90% de las cosas por tu cuenta.
