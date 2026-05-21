# DEMOCRACIA S.A. v2 — Game Design Document (Draft)

> *"La democracia es el peor sistema de gobierno... excepto todos los demás."*
> — Winston Churchill (probablemente sacado de contexto)

---

## 1. Vision General

Democracia S.A. es un juego incremental (idle/clicker) de satira politica argentina. El jugador asume el rol de un ciudadano comun que inicia su carrera politica desde el barrio y escala hasta la presidencia, y eventualmente, el escenario internacional.

**Diferencia clave con otros clickers:** tiene una historia, una progresion narrativa y una meta final. No es solo ver numeros crecer — es vivir el viaje del poder.

---

## 2. Experiencia Emocional

El juego busca generar **cuatro emociones en secuencia**, sin que el jugador note cuando cambio de una a otra:

```
RISA → ADICCION → REFLEXION → INDIGNACION
  │        │          │           │
  ▼        ▼          ▼           ▼
"Jajaja  "Un ratito  "Espera...  "...Nos
 que buen mas y       esto no    estamos
 chiste"  desbloqueo  es tan     riendo
          el bloque"  chiste"    de nosotros
                        │
                        ▼
                  (el jugador no
                  nota cuando dejo
                  de reir y empezo
                  a incomodarse)
```

### Regla de diseno: "Absurdo pero plausible"
Todo en el juego debe ser lo suficientemente ridiculo para ser gracioso, pero lo suficientemente realista para que el jugador piense *"esto podria salir en el noticiero manana"*. Esta regla aplica a:

- Nombres y descripciones de generadores
- Noticias del ticker
- Eventos aleatorios (telegramas)
- Logros y hitos
- Consecuencias de las decisiones del jugador

---

## 3. Setting

**Argentina. Sin tomar partido.**

La politica argentina es la fuente inagotable de contenido del juego. No importa el bando, el color o la ideologia — la corrupcion, la ineficiencia y el absurdo son transversales. El juego no ataca a ningun partido en particular; ataca al sistema en su totalidad.

---

## 4. Rol del Jugador

El jugador es un ciudadano comun que inicia su carrera politica desde abajo. No es un genio del mal, no es un filosofo de la democracia — es alguien que ve una oportunidad y la agarra.

La progresion es **lineal y narrativa**, cada cargo es una nueva fase con sus propios generadores, operaciones y eventos.

---

## 5. Moneda y Recursos

### Moneda principal: Pesos ($)

Porque en Argentina TODO el mundo siempre quiere mas pesos. La inflacion hace que los numeros grandes tengan sentido narrativo sin necesidad de justificacion:

| Fase | Ejemplo de escala | Contexto |
|------|-------------------|----------|
| Puntero | $5.000 | Comprar empanadas para el barrio |
| Empleado municipal | $50.000 | Sobornos puntuales |
| Concejal | $500.000 | Financiar una pequena campana |
| Intendente | $5M | Inaugurar una obra |
| Gobernador | $500M | Comprar un medio de comunicacion |
| Presidente | $50B | Pagar un mes de intereses del FMI |

La inflacion puede ser una **mecanica del juego**: si imprimis plata, tenes mas pero vale menos. Si no imprimis, tenes menos pero tu plata vale.

### Recurso secundario: Popularidad (%)

No se genera con clicks. Se gana y se pierde a traves de:
- Decisiones en eventos aleatorios (telegramas)
- Compras especificas (propaganda, obras)
- Acciones del jugador (que generadores compra, que operaciones elige)

La popularidad **no es necesaria para producir dinero**, pero es critica para:
- Ganar elecciones (los "boss fights" entre fases)
- Abrir o cerrar puertas en el Acto 2
- Determinar ciertas consecuencias narrativas

---

## 6. Estructura del Juego

### Acto 1: La Carrera

El jugador recorre la escalera del poder politico argentino. Cada cargo es una **fase completa** con sus propios generadores, operaciones, eventos y un "boss fight" (la eleccion).

### Acto 2: El Mundo (post-presidencia)

Se desbloquea al ganar la eleccion presidencial. El juego cambia de escala:
- El FMI y la deuda externa
- Geopolitica y relaciones internacionales
- Organismos internacionales (OEA, Naciones Unidas, Corte Internacional)
- Mercados financieros (bolsa, dolar, bonos, riesgo pais)
- La oposicion como fuerza activa con recursos propios

**Las decisiones del Acto 1 te pesan en el Acto 2.** Si llegaste a presidente con 0% de popularidad, el FMI no te presta. Si quemaste todos los puentes, estas solo. Esto da **rejugabilidad**: queres volver para llegar al Acto 2 de otra forma.

### Evento de transicion: El Discurso de Asuncion

El momento que separa ambos actos. El ticker cambia. La UI se transforma. Todo indica que el juego cambio de escala. Es el "has ganado... pero ahora viene lo dificil" del incremental.

---

## 7. Las Fases (Acto 1)

Cada fase tiene:
- **3 generadores** nuevos (los de fases anteriores siguen activos)
- **Operaciones especiales** desbloqueables
- **Eventos aleatorios** tematicos
- **Una eleccion** como "boss fight" para avanzar

### Fase 1 — El Puntero

El arranque. Sos nadie en un barrio. Tu herramienta es la carnada y tu moneda es el favor.

**Clicker:** Click abstracto (el jugador imagina de donde viene el dinero)

| # | Generador | Descripcion | Quote |
|---|-----------|-------------|-------|
| 1 | El Vecino Comprometido | Viene a todos los actos, nunca falta. Siempre tiene una anecota del barrio. | "Yo estuve desde el principio, jefe" |
| 2 | El Canje de Favores | Trueque de favores entre vecinos. Hoy te ayudan vos, manana los ayudas... si hay manana. | "Hoy por vos, manana por mi" |
| 3 | La Moto del Puntero | Con 3 litros de nafta y una buena memoria, llegas a 400 casas por dia. | "A las 6 en punto arranco la vuelta" |

### Fase 2 — Empleado Municipal

Entraste al estado. Ya no pedis favores, los gestionas. Tramites, formularios, sello y firma.

| # | Generador | Descripcion | Quote |
|---|-----------|-------------|-------|
| 4 | El Tramite | La burocracia que genera trabajo... para vos. Cada papel que moves vale plata. | "Se gestiona en 48 horas habiles... o no" |
| 5 | El Amigote de Oficina | Siempre tiene un "contacto" que sabe como hacer las cosas. Ese contacto sos vos. | "Tengo un amigo que trabaja en... listo" |
| 6 | La Coima del Puesto | Un incentivo extra para agilizar el proceso. No es corruption, es eficiencia. | "Es un gasto de gestion acelerada" |

### Fase 3 — Concejal

Entraste al recinto. Ya tenes banca, voz y voto (aunque el voto ya te lo dicen como votar).

| # | Generador | Descripcion | Quote |
|---|-----------|-------------|-------|
| 7 | El Bloque | 9 votos alineados valen mas que una conviccion. El bloque se compra, no se debate. | "Hoy votamos todos lo mismo, como siempre" |
| 8 | El Lobbista | Te explica la ley y te cobra por explicarte. Despues te cobra por no explicarla. | "Tengo un proyecto que te va a interesar" |
| 9 | El Sobre Bajo el Piso | Lo que no esta en el acta, no existe. Lo que esta bajo el piso, tampoco. | "No se de donde salio, aparecio ahi" |

### Fase 4 — Intendente

Ahora mandas en un pueblo. Tenes presupuesto, obreros y una foto en la entrada del municipio.

| # | Generador | Descripcion | Quote |
|---|-----------|-------------|-------|
| 10 | La Obra Publica | Se inaugura en campana, se termina despues. O nunca. | "Esta obra generara 500 puestos de trabajo" |
| 11 | La Pauta Publicitaria | Noticias que hablan bien de vos por arte de magia. La magia se llama plata. | "Somos periodistas independientes" |
| 12 | El Contratista Amigo | Gana la licitacion... casualidad. Gana la siguiente... otra casualidad. | "Es la unica empresa que presento presupuesto" |

### Fase 5 — Gobernador

Provincia entera bajo tu control. Ministros, sindicalistas y empresarios forman fila en tu despacho.

| # | Generador | Descripcion | Quote |
|---|-----------|-------------|-------|
| 13 | El Ministro Sumiso | Firma lo que le pongas enfrente. Si pregunta, lo cambias. | "Usted manda, senor, yo acelero" |
| 14 | El Empresario Amigo | Te financia la campana, vos le das la obra. Un circulo virtuoso. | "El pais crece cuando crecemos juntos" |
| 15 | El Medio Propio | El canal que dice lo que vos queres que diga. Periodismo al servicio de la verdad... tu verdad. | "La unica voz imparcial de la provincia" |

### Fase 6 — Presidente

La cima del Acto 1. El pais es tuyo. Ahora tenes que lidiar con la realidad que creaste.

| # | Generador | Descripcion | Quote |
|---|-----------|-------------|-------|
| 16 | La Casa de Moneda | ¿Problemas? Imprimi mas billetes. Si la gente pregunta, deciles que es "politica monetaria activa". | "No es inflacion, es un ajuste transitorio" |
| 17 | El FMI | Te prestan para que les devuelvas lo que te prestaron. Y despues te prestan para que devuelvas lo que les devolviste. | "El acuerdo es beneficioso para ambas partes" |
| 18 | El Mercado | Un tweet tuyo y el dolar sube o baja 10%. La bolsa se mueve con tus silencios. | "El presidente no se pronuncio sobre el tipo de cambio" |

---

## 8. Mecanicas Principales

### 8.1 El Click

El click genera pesos. **De donde viene? Del click.** El jugador elige en su imaginacion: es el sueldo del cargo, un soborno, un aporte de campana, una coima. No se explica, se asume.

### 8.2 Los Generadores

**18 generadores totales, 3 por fase.**

- Todos los generadores de fases anteriores **siguen activos y comprables** en fases nuevas
- Escala de precios exponencial: `Precio_n = Precio_base x 1.15^n` (igual que Cookie Clicker)
- La produccion base escala drasticamente entre fases (el primer generador de presidente produce mas que el tercero de intendente)
- Cada generador tiene: nombre, descripcion, quote satirico, emoji, costo base, produccion base

### 8.3 Las Operaciones Especiales (Upgrades)

Mejoras que se desbloquean al cumplir ciertas condiciones. Son unicas y permanentes. Ejemplos:

- Multiplicadores de click (+$ por click)
- Multiplicadores de generador (x2 Punteros, x2 Obras, etc.)
- Bonificaciones pasivas (+10% produccion total, etc.)
- Desbloqueo de mecanicas (acceso a propaganda, a obras publicas, etc.)

### 8.4 Las Elecciones (Boss Fights)

Cada cambio de fase requiere **ganar una eleccion**. No es solo "llegar a X pesos" — requiere:

- Suficientes generadores activos (operadores de campo)
- Operaciones compradas (propaganda, encuestas)
- Un minimo de popularidad
- Dinero para la campana

**Las elecciones pueden tener un componente de decision del jugador:** la forma en que llegas a la eleccion (limpia o sucia, con aparato o sin el) podria modificar multiplicadores y herramientas disponibles en la siguiente fase.

### 8.5 Logros (Milestones)

Se desbloquean automaticamente al acumular hitos. Cada logro otorga bonificaciones permanentes. Ejemplos:

- "Primer Puntero" — Tu primer operador te debe un favor
- "El Intendente Eterno" — Tu candidato gana una eleccion menor
- "El Que Pasa Facturas" — Descubris que podes cobrar por ambos lados
- "Atornillado al Sillon" — El sistema es tuyo. Los votantes creen que eligieron.

---

## 9. Eventos Aleatorios: Los Telegramas

Eventos que interrumpen periodicamente el gameplay con una **decision urgente**.

### Formato

```
┌──────────────────────────────────┐
│ ⚡ URGENTE                       │
│                                  │
│ Un medio filtro tus numeros.     │
│                                  │
│ ¿Que hacés?                      │
│                                  │
│ [Demandar una rectificacion]     │
│ [Dejar pasar, no es noticia]     │
│                                  │
│ Se resuelve solo en 15s...       │
│ ████████░░░░ 8s                  │
└──────────────────────────────────┘
```

### Reglas

- Entra desde la derecha con animacion — llama la atencion sin bloquear
- **Tiempo limitado** (countdown) — genera urgencia real
- **El jugador puede seguir clickeando** — no rompe el gameplay
- **Si no elige, se resuelve solo** — la inaccion tambien es una decision (y tiene consecuencias)
- Cada opcion tiene **consecuencias numericas + narrativas** (+dinero/-popularidad, desbloquear caminos, cerrar puertas)
- Aparecen cada cierto tiempo (no es spam, cada evento se siente especial)

### Ejemplos por fase

**Puntero:**
- "Un vecino filma un pozo en la calle. ¿Lo arreglas rapido o decis que es obra en progreso?"
  - Arreglar: -dinero, +popularidad
  - Ignorar: +dinero, -popularidad

**Concejal:**
- "Un medio nacional te quiere hacer una nota. ¿Aceptas o les mandas a la prensa municipal?"
  - Aceptar: +exposicion (pros y contras segun situacion)
  - Mandar a la municipal: seguro pero sin impacto

**Intendente:**
- "Hay un paro de docentes. ¿Negocias o mandas a la gendarmeria?"
  - Negociar: -plata, +popularidad
  - Gendarmeria: -popularidad, +orden (multiplicador productivo)

**Presidente:**
- "El FMI exige ajuste. ¿Firmas o no?"
  - Firmar: restricciones pero estabilidad
  - No firmar: libertad pero riesgo de crisis

---

## 10. El Clicker Visual

Actualmente el juego usa el **Sol de Mayo** (el sol de la bandera argentina) como emoji principal del clicker.

**Propuesta:** que el clicker evolucione visualmente con cada fase:

| Fase | Clicker visual |
|------|----------------|
| Puntero | Un sobre manuscrito / panfleto |
| Empleado municipal | Un sello / formulario |
| Concejal | Un badge / pin de concejal |
| Intendente | Llaves del municipio |
| Gobernador | Banda de gobernador |
| Presidente | Baston presidencial / silla presidencial |

El clicker central evoluciona a medida que el jugador avanza, dandole una sensacion de progreso tangible.

---

## 11. Reglas de Balance

### Generadores

- **18 generadores totales** (3 por fase, 6 fases)
- Costo base escalado por fase (cada fase empieza mas caro)
- Multiplicador de costo: **1.15x** por unidad comprada (igual que CC)
- Produccion base escalada drasticamente entre fases
- Generadores de fases anteriores siguen disponibles

### Operaciones Especiales

- Desbloqueo por condiciones (total acumulado, cantidad de generadores, fases alcanzadas)
- Efectos permanentes una vez comprados
- Variedad de efectos: multiplicadores de click, de generador, de produccion total, bonificaciones pasivas

### Popularidad

- Empieza en 50% (neutral)
- Oscila entre 0% y 100%
- Se pierde y gana por eventos, decisiones y compras
- Afecta las elecciones pero NO la produccion de dinero
- En el Acto 2 se vuelve critica para relaciones internacionales

---

## 12. Preguntas Abiertas

Estos son temas que aun necesitan definicion antes de empezar a codificar:

- [ ] **Cuantas operaciones especiales totales?** (actualmente 18 en v1)
- [ ] **Cuantos logros/milestones?** (actualmente 9 en v1, probablemente mas)
- [ ] **Cuantas noticias en el ticker?** (actualmente ~90 en v1, probablemente mas por fase)
- [ ] **Con que frecuencia aparecen los telegramas?** (cada cuanto tiempo)
- [ ] **Cuanto tiempo tiene el jugador para responder un telegrama?** (15s? 20s? variable?)
- [ ] **El Acto 2 tiene cuantas fases?** (FMI, mercados, geopolitica, organismos?)
- [ ] **Hay "final" del juego o es infinito?** (o un "endgame" como CC?)
- [ ] **La popularidad se muestra como numero, barra, o ambos?**
- [ ] **Las elecciones tienen mini-juego o son automaticas al cumplir requisitos?**

---

## 13. Comparativa con Cookie Clicker

| Aspecto | Cookie Clicker | Democracia S.A. v2 |
|---------|----------------|---------------------|
| Moneda | Galletas | Pesos ($) |
| Generadores | 19 edificios | 18 generadores (3/fase) |
| Multiplicador costo | 1.15x/unidad | 1.15x/unidad |
| Clicker | Una galleta | Evoluciona con cada fase |
| Upgrades | Golden cookies + upgrades | Operaciones especiales + telegramas |
| Progresion | Continua/sin fin | Lineal con historia y meta |
| Narrativa | Minima (lore de grandma, etc.) | Central al juego |
| Emocion | Adiccion + humor negro | Risa + adiccion + reflexion + indignacion |
| Rejugabilidad | Logros y desafios | Decisiones que cambian el Acto 2 |
| "Boss fights" | No | Elecciones entre cada fase |
| Recurso secundario | Leche/edificios especiales | Popularidad |

---

## 14. Inspiracion y Referencias

- **Cookie Clicker** — Mecanicas base del incremental
- **Adventure Capitalist** — Progression de negocios
- **Papers, Please** — Deciones morales con peso narrativo
- **Reigns** — Eventos con decisiones A/B con consecuencias
- **Noticieros argentinos** — "Absurdo pero plausible"
- **La realidad** — La mejor fuente de contenido

---

*Documento en progreso. Ultima actualizacion: Mayo 2026.*
*Todo es sujeto a cambio hasta que no se empiece a codificar.*
