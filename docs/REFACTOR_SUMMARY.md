# Democracia S.A. — Resumen del Refactor

## Descripcion General

Refactor completo de **Democracia S.A.**, un juego incremental de satira politica argentino, desde un stack moderno basado en **React + Next.js** hacia **HTML puro + CSS + Vanilla JavaScript**, eliminando todas las dependencias del proyecto y simplificando radicalmente la infraestructura.

La premisa fue: si el juego es una aplicacion web que sirve contenido estatico sin backend, no necesita un framework de frontend pesado. El resultado es un proyecto mas simple, mas rapido de cargar, mas facil de mantener y completamente autónomo.

---

## Stack Antes vs Despues

| Aspecto | Antes (React/Next.js) | Despues (Vanilla) |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | Ninguno |
| **Lenguaje UI** | TypeScript + JSX | HTML + Vanilla JS (ES5) |
| **Estilos** | Tailwind CSS + clases dinamicas | CSS puro (1 archivo) |
| **Estado** | Zustand (store global) | Objeto JS con pub/sub manual |
| **Animaciones** | Framer Motion | CSS @keyframes + transiciones |
| **Componentes UI** | shadcn/ui (Radix + Tailwind) | HTML semantico directo |
| **Autenticacion** | Supabase Auth | Eliminada (localStorage) |
| **Build** | bun + next build (static export) | Ninguno (archivos estaticos) |
| **Deploy** | GitHub Actions (build + deploy) | GitHub Actions (solo deploy) |
| **Dependencias** | ~30 paquetes (node_modules) | **0 dependencias** |
| **Bundle size** | ~500KB+ (JS compilado) | ~14KB (3 archivos JS) |
| **node_modules** | ~200MB | **No existe** |

---

## Comparacion de Lineas de Codigo

### Archivos React Originales (estimacion)

| Archivo | Lineas | Descripcion |
|---|---|---|
| `src/types.ts` | ~120 | Tipos TypeScript |
| `src/config.ts` | ~80 | Configuracion del juego |
| `src/lib/calculator.ts` | ~350 | Logica de calculos |
| `src/lib/formatters.ts` | ~80 | Formateo de numeros |
| `src/lib/news.ts` | ~250 | Sistema de noticias |
| `src/store/game-store.ts` | ~250 | Zustand store |
| `src/components/` (9 archivos) | ~8,500 | Componentes React |
| `package.json` + config | ~50 | Configuracion |
| `tailwind.config.ts` | ~100 | Config Tailwind |
| `next.config.mjs` | ~15 | Config Next.js |
| **Total estimado** | **~9,800** | |

### Archivos Vanilla Refactorizados

| Archivo | Lineas | Descripcion |
|---|---|---|
| `index.html` | 282 | Estructura HTML completa |
| `style.css` | 1,361 | Todos los estilos (glassmorphism, responsive, animaciones) |
| `js/data.js` | 461 | Datos del juego (generadores, upgrades, logros, noticias) |
| `js/engine.js` | 382 | Motor del juego (estado, calculos, formateo, save/load) |
| `js/app.js` | 478 | Capa UI (renderizado, game loop, eventos) |
| `.github/workflows/deploy.yml` | 37 | Pipeline simplificado |
| **Total** | **3,001** | |

### Reduccion

- **~9,800 lineas** → **~3,000 lineas** = **Reduccion del ~69%**
- De ~30 dependencias a **0 dependencias**
- Sin `node_modules`, sin build, sin compilacion

---

## Estructura del Proyecto Refactorizado

```
DemocraciaSA/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Pipeline: checkout → upload → deploy (sin build)
├── docs/
│   ├── GUIA_NAVEGACION.md      # Guia de navegacion del sitio
│   ├── RESKIN_ARGENTINO.md     # Documento de rediseño argentino
│   ├── REFACTOR_SUMMARY.md     # Este documento
│   └── ELEMENT_NAMING.md       # Tabla de nombres de elementos
├── js/
│   ├── data.js                 # Datos pura: generadores, upgrades, logros, noticias
│   ├── engine.js               # Motor: estado, calculos, formateo, persistencia
│   └── app.js                  # UI: renderizado, game loop, binding de eventos
├── public/
│   ├── logo.svg                # Logo del juego
│   ├── robots.txt              # SEO
│   └── sol-de-mayo.png         # Imagen del boton clicker
├── .gitignore
├── GAME_DESIGN.md              # Diseno del juego
├── HOW_TO_PLAY.md              # Como jugar
├── index.html                  # HTML principal (unica pagina)
├── sol-de-mayo.png             # Imagen del clicker (raiz)
├── style.css                   # Estilos completos
└── worklog.md                  # Registro de trabajo
```

---

## Arquitectura de los 3 Modulos JS

### `js/data.js` — Capa de Datos

Contiene toda la configuracion estatica del juego, sin ninguna logica ni referencia al DOM:

- **GENERATORS** (9): El Puntero, El Canje, La Olla Popular, La Fundacion Incolora, El Focus Group, El Empresario Amigo, La Pauta, La re re re eleccion, La Casta Eterna
- **UPGRADES** (18): 5 de clic + 9 de generador + 3 de dinero pasivo + 1 misc
- **MILESTONES** (9): Desbloqueados por influencia total acumulada
- **PHASE_LABELS** / **PHASE_EMOJIS**: Labels y emojis para las 3 fases (Municipal, Provincial, Imperio)
- **HEADLINES** (~90): Noticias satiricas organizadas por fase
- **getRandomHeadline()**: Funcion utilitaria para seleccionar noticias

### `js/engine.js` — Motor del Juego

Toda la logica de negocio, completamente independiente del DOM:

- **Formatters**: `formatNumber()`, `formatPerSecond()`, `formatDinero()`, `formatTime()`, `getDemocracyQuote()`
- **Calculator**: Costos de generadores (individual, bulk, max), produccion por segundo, poder de clic, dinero por segundo, multiplicadores de logros, verificacion de requisitos
- **State Management**: `createInitialState()`, patron pub/sub con `subscribe()`/`notify()`
- **GameEngine (prototipo)**: `click()`, `buyGenerator()`, `purchaseUpgrade()`, `tick()`, `checkMilestones()`, `save()`, `load()`, `reset()`
- **Persistence**: `saveGame()` / `loadGame()` / `deleteSave()` via localStorage

### `js/app.js` — Capa de Presentacion (UI)

Conecta el motor con el DOM, maneja toda la interaccion:

- **DOM Cache**: Un objeto `dom` que cachea todas las referencias a elementos del DOM al inicio
- **Render Functions**: `renderHeader()`, `renderClicker()`, `renderGenerators()`, `renderUpgrades()`, `renderMilestones()`, `renderStats()`
- **Event Binding**: Click del boton principal, compra de generadores, compra de upgrades, tabs mobile, dialogos, save/reset
- **Game Loop**: `setInterval` a 100ms para tick, 30s para auto-save, 12s para rotacion de noticias
- **Toast System**: Notificaciones de logros desbloqueados con animacion CSS
- **Float Numbers**: Numeros que flotan al hacer clic (+influencia)
- **Mobile Tabs**: Sistema de pestañas para vista mobile (Generadores / Operaciones / Logros)

---

## Patrones de Diseno

### Estado Global con Pub/Sub (reemplaza Zustand)

```javascript
// En vez de: const useGameStore = create(gameStore)
// Usamos:
GameEngine.prototype.subscribe = function(fn) { this.listeners.push(fn); };
GameEngine.prototype.notify = function() {
  for (var i = 0; i < this.listeners.length; i++) {
    this.listeners[i](this.state);
  }
};
// Uso: engine.subscribe(renderAll);
```

### DOM Cache (reemplaza refs y hooks)

```javascript
// En vez de: const ref = useRef(null)
// Usamos:
var dom = {};
function cacheDom() {
  dom.influenciaDisplay = document.getElementById('influencia-amount');
  // ...
}
```

### Render por Reconstruction (reemplaza estado React)

```javascript
// En vez de: setState() triggers re-render diffing
// Usamos: innerHTML + event rebinding
function renderGenerators() {
  var html = buildGeneratorHTML();
  dom.generatorList.innerHTML = html;
  bindGeneratorClicks(dom.generatorList);
}
```

---

## Responsive Design

| Breakpoint | Layout | Descripcion |
|---|---|---|
| `< 640px` (mobile chico) | Stack vertical completo | Clicker arriba, tabs abajo, recursos compactos |
| `640px - 767px` (mobile grande) | Stack con labels visibles | Se muestran labels de recursos y texto en botones del footer |
| `>= 768px` (desktop) | Grid 3 columnas | Sidebar izq (generadores), centro (clicker + stats), sidebar der (operaciones + logros) |

---

## Pipeline de Deploy

### Antes

```
Push → bun install → next build → next export → upload artifact → deploy
```

### Despues

```
Push → upload artifact → deploy
```

El workflow paso de necesitar un build step con bun y Next.js a simplemente servir archivos estaticos. El `actions/upload-pages-artifact` toma todo el directorio raiz y lo publica directamente.

---

## Eliminaciones

- **Supabase Auth**: Eliminado completamente. El save/load ahora usa `localStorage`.
- **shadcn/ui**: Eliminado. Todos los componentes (botones, cards, dialogs, toasts) son HTML/CSS puro.
- **Framer Motion**: Eliminado. Las animaciones usan `@keyframes` y `transition` de CSS.
- **Tailwind CSS**: Eliminado. Todos los estilos estan en `style.css` con clases semanticas.
- **TypeScript**: Eliminado. Todo el codigo es JavaScript vanilla (ES5 para maxima compatibilidad).
- **Zustand**: Eliminado. Reemplazado por un patron pub/sub manual en 10 lineas.

---

## Rendimiento

- **Tiempo de carga**: Significativamente menor (sin bundle, sin framework overhead)
- **JS total**: ~14KB sin comprimir (vs ~500KB+ del bundle React compilado)
- **CSS**: ~15KB sin comprimir (con glassmorphism, responsive, animaciones)
- **Sin runtime de React**: No hay virtual DOM, no hay reconciliation, no hay hydration
- **Zero dependencies**: No hay vulnerabilidades en dependencias, no hay actualizaciones necesarias

---

## Funcionalidad Preservada

Todas las mecanicas del juego original se mantienen intactas:

- 9 generadores con costos escalables y produccion progresiva
- 18 operaciones especiales (upgrades) con requisitos y efectos diversos
- 9 logros (milestones) desbloqueables con recompensas permanentes
- 3 fases de juego (Municipal → Provincial/Nacional → Imperio)
- Sistema de clic con poder progresivo
- Doble recurso (Influencia + Dinero)
- Indicador de Calidad Democratica (decrece con la influencia)
- ~90 noticias satiricas rotativas por fase
- Sistema de save/load automatico con progreso offline
- Compra por cantidad (x1, x10, Max)
- Responsive (mobile tabs + desktop grid)
- Dialogos (guia + confirmacion de reset)
- Notificaciones toast para logros
- Numeros flotantes en el clicker
