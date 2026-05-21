# Democracia S.A. v1 — Arquitectura

> Estructura del proyecto v1 (en desarrollo).
> Documento de referencia. Ultima actualizacion: Mayo 2026.

---

## Estructura de Archivos

```
/
├── index.html                  → Estructura principal de la pagina
│
├── css/
│   ├── main.css                → Reset, layout, tipografia, glassmorphism
│   ├── componentes.css         → Cards, botones, modales, tabs, toasts
│   ├── juego.css               → Clicker, generadores, operaciones, logros
│   ├── eventos.css             → Telegramas, elecciones, overlays
│   └── animaciones.css         → Float numbers, transiciones, effects
│
├── js/
│   ├── data/
│   │   ├── generadores.js      → Definicion de los 18 generadores (6 fases)
│   │   ├── operaciones.js      → Definicion de operaciones especiales
│   │   ├── logros.js           → Definicion de milestones/achievements
│   │   ├── noticias.js         → Headlines del ticker por fase
│   │   └── eventos.js          → Telegramas y sus consecuencias
│   │
│   ├── formulas.js             → Funciones puras de calculo (costos, produccion)
│   ├── formato.js              → formatNumber, formatTime, formatDinero
│   ├── engine.js               → Estado del juego, game loop, tick
│   ├── ui.js                   → Render, DOM updates, bindings de eventos
│   ├── telegramas.js           → Sistema de eventos aleatorios
│   ├── elecciones.js           → Sistema de elecciones (boss fights)
│   ├── save.js                 → localStorage + Supabase auth/save
│   └── init.js                 → Punto de entrada, carga de modulos, game start
│
├── assets/
│   └── icons/                  → SVGs de generadores, fases, UI
│
├── public/
│   ├── logo.svg                → Logo del juego
│   ├── robots.txt              → SEO
│   └── sol-de-mayo.png         → Asset del clicker (posible reutilizacion)
│
├── docs/
│   ├── GAME_DESIGN_V2.md       → Game Design Document (draft)
│   └── ARCHITECTURE.md         → Este documento
│
├── v0/                         → Codigo archivado (version previa vanilla)
│   ├── index.html
│   ├── style.css
│   ├── js/
│   └── docs/
│
├── .github/
│   └── workflows/
│       └── deploy.yml          → Deploy automatico a GitHub Pages
│
└── .gitignore
```

---

## Descripcion de Modulos

### CSS

| Archivo | Responsabilidad |
|---------|----------------|
| `main.css` | Reset, variables CSS, tipografia, layout general, glassmorphism, colores base |
| `componentes.css` | Botones, cards, modales, tabs, toasts, badges, inputs, scrollbars |
| `juego.css` | Clicker (centro), panel de generadores, operaciones, logros, estadisticas, ticker |
| `eventos.css` | Telegramas (slide-in con countdown), overlay de elecciones, transicion Acto 1→2 |
| `animaciones.css` | Float numbers, pulse del clicker, transiciones de UI, entrance/exit animations |

### JS — Data

| Archivo | Contenido |
|---------|-----------|
| `generadores.js` | Array de 18 generadores con: id, nombre, emoji, descripcion, quote, fase, costoBase, produccionBase, multiplicadorCosto |
| `operaciones.js` | Array de operaciones especiales con: id, nombre, emoji, descripcion, costo, recurso, efecto, requisito |
| `logros.js` | Array de milestones con: id, nombre, emoji, descripcion, requisito, recompensa |
| `noticias.js` | Array de headlines agrupadas por fase con: texto, fase |
| `eventos.js` | Array de telegramas con: titulo, descripcion, opciones (A/B), consecuencias, fase |

### JS — Logica

| Archivo | Responsabilidad |
|---------|----------------|
| `formulas.js` | Funciones puras: getGeneratorCost, getGeneratorCostBulk, getMaxBuyable, getProductionPerSecond, getClickPower, getDineroPerSecond, getCurrentPhase, getDemocraticQuality |
| `formato.js` | formatNumber (con sufijos K/M/B/T), formatPerSecond, formatDinero, formatTime |
| `engine.js` | Clase GameEngine: estado (state), tick(deltaMs), click(), buyGenerator(), purchaseUpgrade(), checkMilestones(), save(), load(), reset(). No toca el DOM. |
| `ui.js` | Toda la logica de renderizado y DOM: cacheDom(), renderHeader(), renderClicker(), renderGenerators(), renderUpgrades(), renderStats(), renderMilestones(), showToast(), openDialog(), closeDialog(). Se suscribe a engine.notify(). |
| `telegramas.js` | Sistema de eventos: scheduleNext(), showTelegrama(), handleChoice(), applyConsequences(), countdown timer |
| `elecciones.js` | Sistema de elecciones: checkElectionAvailable(), startElection(), resolveElection(), showElectionUI() |
| `save.js` | localStorage (load/save/delete) + Supabase (auth init, cloudSave, cloudLoad, signIn, signOut, OAuth). Incluye toda la logica de autenticacion. |
| `init.js` | Punto de entrada: carga data.js primero, luego inicializa engine, ui, save. Bindea eventos globales. Arranca game loop. |

---

## Orden de Carga (index.html)

```html
<!-- Data primero (sin dependencias) -->
<script src="js/data/generadores.js"></script>
<script src="js/data/operaciones.js"></script>
<script src="js/data/logros.js"></script>
<script src="js/data/noticias.js"></script>
<script src="js/data/eventos.js"></script>

<!-- Utilidades (sin dependencias de data) -->
<script src="js/formato.js"></script>
<script src="js/formulas.js"></script>

<!-- Core -->
<script src="js/engine.js"></script>

<!-- UI y sistemas -->
<script src="js/ui.js"></script>
<script src="js/telegramas.js"></script>
<script src="js/elecciones.js"></script>

<!-- Save (necesita supabase CDN cargado antes) -->
<script src="js/save.js"></script>

<!-- Init (ultimo, orquesta todo) -->
<script src="js/init.js"></script>
```

---

## Convenciones

- **Lenguaje**: Todo el codigo y datos en espanol
- **Naming**: camelCase para variables/funciones, UPPER_CASE para constantes, kebab-case para clases CSS
- **Modulos**: Cada archivo JS exporta un objeto o funciones al scope global (no ES modules, para compatibilidad directa con el browser)
- **DOM**: `ui.js` maneja todo el DOM. `engine.js` nunca toca el DOM.
- **Estado**: Unico source of truth es `engine.state`. Nunca se duplica estado en el UI.
- **Rendering**: Separacion entre render liviano (numeros cada tick) y render pesado (rebuild de cards solo en acciones)

---

## Archivo de Referencia

El Game Design Document completo esta en `docs/GAME_DESIGN_V2.md`.
