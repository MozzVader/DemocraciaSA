# Democracia S.A. — Tabla de Nombres de Elementos

## Descripcion

Este documento detalla la convencion de nombres utilizada en los elementos HTML, clases CSS y referencias JS del proyecto refactorizado. El objetivo fue reemplazar los nombres genericos heredados del paradigma React (componentes, stores, hooks) por nombres **semanticos, descriptivos y en espanol**, que reflejen la tematica del juego y faciliten la lectura directa del HTML.

---

## Convenciones Generales

| Patron | Ejemplo | Descripcion |
|---|---|---|
| **IDs en kebab-case** | `influencia-amount`, `button-zone-desktop` | Separados por guiones, descriptivos |
| **Clases CSS en kebab-case** | `generator-card`, `click-pulse` | Separados por guiones |
| **Prefijos tematicos** | `ticker-`, `modal-`, `notification-`, `quality-` | Agrupan elementos por seccion visual |
| **Sufijo `-desktop`** | `clicker-influencia-desktop` | Version desktop del mismo elemento mobile |
| **Sufijo `-D` en JS** | `dom.totalInfluenciaD` | Referencia JS al equivalente desktop |
| **Terminologia del juego** | `generadores`, `operaciones`, `logros` | Usa los nombres que ve el jugador |

---

## Estructura Principal (Layout)

### IDs de Elementos Estructurales

| Elemento | ID | Ubicacion en HTML | Referencia JS (`dom.*`) |
|---|---|---|---|
| Contenedor principal | `game-wrapper` (clase) | `<div class="game-wrapper">` | No referenciado en JS |
| Efectos de fondo | `background-effects` (clase) | `<div class="background-effects">` | No referenciado en JS |
| Header / Barra superior | `topbar` (clase) | `<header class="topbar">` | No referenciado directamente |
| Contenido principal | `game-main` (clase) | `<main class="game-main">` | No referenciado en JS |
| Contenedor inner | `game-main-inner` (clase) | `<div class="game-main-inner">` | No referenciado en JS |
| Footer / Barra inferior | `bottombar` (clase) | `<footer class="bottombar">` | No referenciado directamente |
| Area de notificaciones | `notification-area` | `<div id="notification-area">` | `dom.notification-notification-toastContainer` |

---

## Barra Superior (Header / Topbar)

### Recursos

| Funcion | ID | Clases CSS | Descripcion | Referencia JS |
|---|---|---|---|---|
| Cantidad de influencia | `influencia-amount` | `resource-amount resource-gold` | Muestra la influencia actual en el header | `dom.influenciaDisplay` |
| Tasa de influencia/s | `influencia-rate` | `resource-rate` | Muestra "+X/s" junto a la influencia | `dom.influenciaPerSec` |
| Cantidad de dinero | `dinero-amount` | `resource-amount resource-green` | Muestra el dinero actual | `dom.dineroDisplay` |
| Fase actual (badge) | `current-phase` | `phase-indicator` | Badge con la fase del juego | `dom.phaseLabel` |
| Ano actual | `current-year` | — | Ano dinamico en el copyright | Referenciado directo en `cacheDom()` |

---

## Rotativo de Noticias (Ticker)

| Funcion | ID | Clases CSS | Descripcion | Referencia JS |
|---|---|---|---|---|
| Titular de noticia | `ticker-headline` | `ticker-headline` | Texto de la noticia actual | `dom.headlineText` |

### Clases del Ticker

| Clase | Elemento | Descripcion |
|---|---|---|
| `ticker-bar` | `<div>` | Barra contenedora completa |
| `ticker-content` | `<div>` | Contenedor interno con flex |
| `ticker-badge` | `<div>` | Badge "EN VIVO" con el dot |
| `live-dot` | `<span>` | Punto rojo con animacion ping |
| `ticker-label` | `<span>` | Texto "ROTATIVO" |
| `ticker-headline-area` | `<div>` | Area donde aparece el titular |

---

## Clicker (Boton Principal)

### Version Mobile

| Funcion | ID | Clases CSS | Descripcion | Referencia JS |
|---|---|---|---|---|
| Contenedor mobile | — | `mobile-clicker` | Section completa del clicker mobile | No referenciado en JS |
| Influencia total | `clicker-influencia` | `influence-display` | Numero grande de influencia | `dom.totalInfluencia` |
| Tasa produccion | `clicker-rate` | — | "/s" debajo del numero | `dom.prodPerSec` |
| Poder de clic | `clicker-strength` | — | "/click" debajo del numero | `dom.clickPower` |
| Contador de clics | `click-counter` | — | "X clics totales" | `dom.totalClicks` |
| Zona del boton | `button-zone` | `button-zone` | Area clickable para floats | `dom.clickerArea` |
| Boton influenciar | `influence-button` | `influence-button` | El boton principal con el Sol | `dom.clickerBtn` |
| Numeros flotantes | `floating-numbers` | — | Contenedor de +N flotantes | `dom.floatsContainer` |

### Version Desktop

| Funcion | ID | Clases CSS | Descripcion | Referencia JS |
|---|---|---|---|---|
| Influencia total | `clicker-influencia-desktop` | `influence-display` | Numero grande (desktop) | `dom.totalInfluenciaD` |
| Tasa produccion | `clicker-rate-desktop` | — | "/s" (desktop) | `dom.prodPerSecD` |
| Poder de clic | `clicker-strength-desktop` | — | "/click" (desktop) | `dom.clickPowerD` |
| Contador de clics | `click-counter-desktop` | — | "X clics totales" (desktop) | `dom.totalClicksD` |
| Zona del boton | `button-zone-desktop` | `button-zone` | Area clickable (desktop) | `dom.clickerAreaD` |
| Boton influenciar | `influence-button-desktop` | `influence-button` | El boton principal (desktop) | `dom.clickerBtnD` |

### Clases del Clicker

| Clase | Elemento | Descripcion |
|---|---|---|
| `influence-center` | `<div>` | Contenedor centrado del clicker |
| `influence-label` | `<div>` | "INFLUENCIA TOTAL" label |
| `influence-display` | `<div>` | Numero grande dorado |
| `influence-details` | `<div>` | Linea con tasa y poder de clic |
| `button-zone` | `<div>` | Area del boton (posicion relativa para floats) |
| `click-pulse` | `<div>` | Animacion de pulso dorado detras del boton |
| `influence-button` | `<button>` | El boton circular con el Sol de Mayo |
| `influence-button-label` | `<span>` | Texto "INFLUENCIAR" |
| `click-counter-label` | `<div>` | "X clics totales" |
| `floating-number` | `<div>` | Clase para cada numero flotante (creado dinamicamente) |

---

## Tabs Mobile

| Funcion | ID | data-tab | Descripcion | Referencia JS |
|---|---|---|---|---|
| Tab Generadores | `tab-generators` | `generadores` | Boton tab "Generadores" | `dom.tabGeneradores` |
| Tab Operaciones | `tab-operations` | `operaciones` | Boton tab "Operaciones" | `dom.tabOperaciones` |
| Tab Logros | `tab-achievements` | `logros` | Boton tab "Logros" | `dom.tabLogros` |

### Paneles Mobile

| Funcion | ID | Descripcion | Referencia JS |
|---|---|---|---|
| Panel Generadores | `panel-generators` | Contenido de la tab Generadores | `dom.panelGeneradores` |
| Panel Operaciones | `panel-operations` | Contenido de la tab Operaciones | `dom.panelOperaciones` |
| Panel Logros | `panel-achievements` | Contenido de la tab Logros | `dom.panelLogros` |

### Clases de Tabs

| Clase | Elemento | Descripcion |
|---|---|---|
| `panel-tabs` | `<div>` | Barra contenedora de tabs |
| `panel-tab` | `<button>` | Cada boton tab |
| `panel-tab.active` | `<button>` | Tab activa (dorada) |
| `tab-panel` | `<div>` | Cada panel de contenido |

---

## Listas de Contenido (Generadores, Operaciones, Logros)

### Contenedores

| Funcion | ID | Version | Referencia JS |
|---|---|---|---|
| Lista de generadores | `generators-list` | Mobile | `dom.generatorList` |
| Lista de generadores | `generators-list-desktop` | Desktop | `dom.generatorListD` |
| Lista de operaciones | `operations-list` | Mobile | `dom.upgradeList` |
| Lista de operaciones | `operations-list-desktop` | Desktop | `dom.upgradeListD` |
| Lista de logros | `achievements-list` | Mobile | `dom.milestoneList` |
| Lista de logros | `achievements-list-desktop` | Desktop | `dom.milestoneListD` |

### Contadores / Badges

| Funcion | ID | Descripcion | Referencia JS |
|---|---|---|---|
| Contador operaciones | `operations-counter` | "X/18" en mobile | `dom.upgradeBadge` |
| Contador operaciones | `operations-counter-desktop` | "X/18" en desktop | `dom.upgradeBadgeD` |

---

## Selector de Cantidad

| Funcion | Clase | data-attribute | Descripcion |
|---|---|---|---|
| Boton x1 | `quantity-option` | `data-amount="1"` | Comprar de a 1 |
| Boton x10 | `quantity-option` | `data-amount="10"` | Comprar de a 10 |
| Boton Max | `quantity-option` | `data-amount="-1"` | Comprar maximo posible |

Referencia JS: `dom.buyAmountBtns` (NodeList de todos los `.quantity-option`)

---

## Tarjetas (Generadas Dinamicamente)

### Tarjeta de Generador

| Clase | Descripcion |
|---|---|
| `generator-card` | Tarjeta base del generador |
| `generator-card.can-afford` | Tarjeta comprable (opaca y brillante) |
| `card-icon` | Emoji del generador |
| `card-details` | Contenedor de texto |
| `card-top` | Fila nombre + cantidad |
| `card-name` | Nombre del generador |
| `card-count` | Cantidad poseida |
| `card-quote` | Frase satirica |
| `card-bottom` | Fila costo + produccion |
| `card-price` | Costo de compra |
| `card-quantity` | Cantidad a comprar (entre parentesis) |
| `card-output` | Produccion por unidad |

Atributo: `data-gen-id` (ID del generador, ej: "puntero")

### Tarjeta de Operacion (Upgrade)

| Clase | Descripcion |
|---|---|
| `operation-card` | Tarjeta base de la operacion |
| `operation-card.can-afford` | Operacion comprable |
| `card-icon` | Emoji de la operacion |
| `card-details` | Contenedor de texto |
| `card-name` | Nombre de la operacion |
| `card-description` | Descripcion del efecto |
| `card-price` | Costo (con recurso si es dinero) |

Atributo: `data-upgrade-id` (ID del upgrade, ej: "click_1")

### Tarjeta de Logro (Milestone)

| Clase | Descripcion |
|---|---|
| `achievement-card` | Tarjeta base del logro |
| `achievement-card.unlocked` | Logro desbloqueado (opaca) |
| `achievement-icon` | Emoji del logro (o candado si no esta desbloqueado) |
| `achievement-details` | Contenedor de texto |
| `achievement-name` | Nombre del logro |
| `achievement-description` | Descripcion (o "???" si esta bloqueado) |
| `achievement-checkmark` | Check verde si esta desbloqueado |

---

## Panel de Estadisticas (Desktop)

| Funcion | ID | Descripcion | Referencia JS |
|---|---|---|---|
| Dinero actual | `stat-dinero` | Valor del dinero | `dom.statsDinero` |
| Dinero por segundo | `stat-dinero-rate` | "+$X/s" | `dom.statsDineroPerSec` |
| Produccion total | `stat-production-rate` | "X/s" | `dom.statsProduction` |
| Calidad democratica (%) | `quality-number` | Porcentaje de calidad | `dom.qualityValue` |
| Barra de calidad | `quality-meter` | Barra visual de calidad | `dom.qualityBar` |
| Frase de calidad | `quality-commentary` | Frase satirica sobre la calidad | `dom.qualityQuote` |
| Fase actual | `stat-current-phase` | Emoji + nombre de la fase | `dom.statsPhase` |
| Progreso logros | `achievements-progress` | "X/9" | `dom.milestonesCount` |
| Nombre proximo logro | `next-achievement-name` | Nombre del prox logro a desbloquear | `dom.nextMilestoneName` |
| Barra proximo logro | `next-achievement-bar` | Barra de progreso del prox logro | `dom.nextMilestoneBar` |
| Contenedor prox logro | `next-achievement-container` | Contenedor completo del prox logro | `dom.nextMilestoneContainer` |
| Tiempo de juego | `session-timer` | "Tiempo de juego: Xh Xm" | `dom.playTime` |

---

## Botones del Footer

| Funcion | ID | Clases CSS | Descripcion | Referencia JS |
|---|---|---|---|---|
| Guia | `button-guide` | `bottombar-btn` | Abre dialogo de ayuda | `dom.footerGuide` |
| Guardar | `button-save` | `bottombar-btn` | Guarda manualmente | `dom.footerSave` |
| Reiniciar | `button-reset` | `bottombar-btn bottombar-btn-danger` | Abre dialogo de confirmacion | `dom.footerReset` |

---

## Dialogos (Modales)

### Dialogo de Guia

| Funcion | ID | Descripcion | Referencia JS |
|---|---|---|---|
| Backdrop del dialogo | `help-modal` | Fondo + ventana de guia | Referenciado directo en `openDialog()` |
| Boton cerrar | `help-close` | "Entendido" | Referenciado directo en `bindEvents()` |

### Dialogo de Confirmacion de Reset

| Funcion | ID | Descripcion | Referencia JS |
|---|---|---|---|
| Backdrop del dialogo | `confirm-modal` | Fondo + ventana de reset | Referenciado directo en `openDialog()` |
| Boton cancelar | `confirm-cancel` | "Cancelar" | Referenciado directo en `bindEvents()` |
| Boton aceptar | `confirm-accept` | "Reiniciar" | Referenciado directo en `bindEvents()` |

### Clases de Dialogos

| Clase | Elemento | Descripcion |
|---|---|---|
| `modal-backdrop` | `<div>` | Overlay oscuro completo |
| `modal-backdrop.open` | `<div>` | Dialogo visible (display: flex) |
| `modal-window` | `<div>` | Ventana del dialogo |
| `glass-modal` | `<div>` | Fondo con glassmorphism |
| `modal-gold-top` | `<div>` | Linea dorada superior decorativa |
| `modal-gold-bottom` | `<div>` | Linea dorada inferior decorativa |
| `modal-body` | `<div>` | Cuerpo del dialogo |
| `modal-title` | `<div>` | Titulo del dialogo |
| `modal-subtitle` | `<div>` | Subtitulo del dialogo |
| `modal-rule` | `<hr>` | Separador dorado |
| `modal-actions` | `<div>` | Contenedor de botones |
| `modal-btn` | `<button>` | Boton base |
| `modal-btn-cancel` | `<button>` | Boton cancelar (transparente) |
| `modal-btn-danger` | `<button>` | Boton peligroso (rojo) |
| `modal-btn-gold` | `<button>` | Boton primario (dorado) |

---

## Secciones de la Guia (Dentro del Dialogo)

| Clase | Elemento | Descripcion |
|---|---|---|
| `help-section` | `<div>` | Cada seccion de ayuda (icono + texto) |
| `help-icon` | `<div>` | Cuadrado con el emoji del tema |
| `help-topic` | `<div>` | Titulo del tema |
| `help-text` | `<div>` | Explicacion del tema |
| `help-footer` | `<div>` | Frase final del dialogo |

---

## Sistema de Notificaciones (Toasts)

### Clases

| Clase | Elemento | Descripcion |
|---|---|---|
| `notification-area` | `<div>` | Contenedor fijo abajo a la derecha |
| `notification-notification-toast` | `<div>` | Cada toast individual (creado dinamicamente) |
| `notification-exit` | `<div>` | Toast saliendo (animacion de salida) |
| `notification-accent` | `<div>` | Barra lateral dorada |
| `notification-icon` | `<div>` | Emoji del logro |
| `notification-body` | `<div>` | Cuerpo del toast |
| `notification-type` | `<div>` | "LOGRO DESBLOQUEADO" |
| `notification-heading` | `<div>` | Nombre del logro |
| `notification-text` | `<div>` | Descripcion del logro |
| `notification-reward` | `<div>` | Badge con la recompensa (verde) |
| `notification-timer` | `<div>` | Barra de progreso que se vacia |

---

## Columnas del Layout Desktop

| Clase | Elemento | Descripcion |
|---|---|---|
| `desktop-layout` | `<div>` | Grid 3 columnas (oculto en mobile) |
| `sidebar-generators` | `<aside>` | Columna izquierda: generadores |
| `center-column` | `<div>` | Columna central: clicker + stats |
| `sidebar-upgrades` | `<aside>` | Columna derecha: operaciones + logros |
| `upgrades-section` | `<div>` | Seccion superior del sidebar derecho |
| `achievements-section` | `<div>` | Seccion inferior del sidebar derecho |

---

## Utilidades CSS

| Clase | Descripcion |
|---|---|
| `custom-scroll` | Scrollbar dorado personalizado |
| `can-afford` | Estado "comprable" (aplicado a cards) |
| `glass-dark` | Glassmorphism oscuro (header/footer) |
| `glass-subtle` | Glassmorphism sutil (ticker) |
| `glass-panel` | Glassmorphism panel (no usado actualmente) |
| `empty-notice` | Mensaje "sin operaciones disponibles" |
| `all-achievements-unlocked` | "Todos desbloqueados" |
| `section-header` | Header de seccion (titulo + selector) |
| `section-title` | Titulo de seccion dorado |
| `section-scroll` | Area scrolleable dentro de secciones |

---

## Animaciones CSS

| Animacion | Descripcion | Usado en |
|---|---|---|
| `ping` | Escala y desvanece | `click-pulse`, `live-dot` |
| `floatUp` | Sube y desvanece | `floating-number` |
| `dialogIn` | Escala desde 0.95 | `modal-window` |
| `notification-toastIn` | Entra desde abajo-derecha | `notification-notification-toast` |
| `notification-toastOut` | Sale hacia abajo-derecha | `notification-exit` |
| `notification-toastProgress` | Barra de progreso 100% → 0% | `notification-timer` |

---

## Mapeo Rapido: JS → HTML

Para encontrar rapidamente donde un elemento del DOM esta referenciado en JavaScript:

```
dom.influenciaDisplay     → #influencia-amount
dom.influenciaPerSec      → #influencia-rate
dom.dineroDisplay         → #dinero-amount
dom.phaseLabel            → #current-phase
dom.totalInfluencia       → #clicker-influencia
dom.prodPerSec            → #clicker-rate
dom.clickPower            → #clicker-strength
dom.totalClicks           → #click-counter
dom.clickerBtn            → #influence-button
dom.clickerArea           → #button-zone
dom.floatsContainer       → #floating-numbers
dom.totalInfluenciaD      → #clicker-influencia-desktop
dom.prodPerSecD           → #clicker-rate-desktop
dom.clickPowerD           → #clicker-strength-desktop
dom.totalClicksD          → #click-counter-desktop
dom.clickerBtnD           → #influence-button-desktop
dom.clickerAreaD          → #button-zone-desktop
dom.generatorList         → #generators-list
dom.upgradeList           → #operations-list
dom.milestoneList         → #achievements-list
dom.generatorListD        → #generators-list-desktop
dom.upgradeListD          → #operations-list-desktop
dom.milestoneListD        → #achievements-list-desktop
dom.statsDinero           → #stat-dinero
dom.statsDineroPerSec     → #stat-dinero-rate
dom.statsProduction       → #stat-production-rate
dom.qualityValue          → #quality-number
dom.qualityBar            → #quality-meter
dom.qualityQuote          → #quality-commentary
dom.statsPhase            → #stat-current-phase
dom.milestonesCount       → #achievements-progress
dom.nextMilestoneName     → #next-achievement-name
dom.nextMilestoneBar      → #next-achievement-bar
dom.nextMilestoneContainer → #next-achievement-container
dom.playTime              → #session-timer
dom.upgradeBadge          → #operations-counter
dom.upgradeBadgeD         → #operations-counter-desktop
dom.headlineText          → #ticker-headline
dom.buyAmountBtns         → .quantity-option (todos)
dom.footerSave            → #button-save
dom.footerGuide           → #button-guide
dom.footerReset           → #button-reset
dom.tabGeneradores        → #tab-generators
dom.tabOperaciones        → #tab-operations
dom.tabLogros             → #tab-achievements
dom.panelGeneradores      → #panel-generators
dom.panelOperaciones      → #panel-operations
dom.panelLogros           → #panel-achievements
```
