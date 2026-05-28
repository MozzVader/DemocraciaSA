# 🍪 Cookie Clicker — Análisis Completo para Democracia S.A.

Fuente: `cc main.js` (17.359 líneas, ES5 JavaScript)

---

## 1. EDIFICIOS (21 buildings)

Cada edificio tiene su **precio base**, **CPS base**, y un factor de escalado de **1.15** por unidad comprada. Los precios y CPS se generan con fórmulas automáticas basadas en el índice del edificio:

### Constructor (línea 7982)
```js
Game.Object = function(name, commonName, desc, icon, iconColumn, art, price, cps, buyFunction)
```

### Fórmula de CPS automático (línea 8018)
```js
baseCps = Math.ceil((Math.pow(n, n*0.5+2)) * 10) / 10
// n = índice del edificio (0-19)
```

### Fórmula de precio automático (línea 8024)
```js
basePrice = (n + 9 + (n<5 ? 0 : Math.pow(n-5, 1.75)*5)) * Math.pow(10, n) * Math.max(1, n-14)
// Multiplicadores extra para late-game:
//   id >= 16: *= 10
//   id >= 17: *= 10
//   id >= 18: *= 10
//   id >= 19: *= 20
```

### Tabla completa de edificios

| ID | Edificio | Precio Base | CPS Base | Minigame |
|----|----------|-------------|----------|----------|
| 0 | Cursor | 15 | 0.1 | — |
| 1 | Grandma | 100 | 1 | — |
| 2 | Farm | 1,100 | 8 | Garden |
| 3 | Mine | 12,000 | 47 | — |
| 4 | Factory | 130,000 | 260 | — |
| 5 | Bank | 1.4M | 1,400 | Stock Market |
| 6 | Temple | 20M | 7,800 | Pantheon |
| 7 | Wizard tower | 330M | 44,000 | Grimoire |
| 8 | Shipment | 5.1B | 260,000 | — |
| 9 | Alchemy lab | 75B | 1.6M | — |
| 10 | Portal | 1T | 10M | — |
| 11 | Time machine | 14T | 65M | — |
| 12 | Antimatter condenser | 170T | 430M | — |
| 13 | Prism | 2.1Qa | 2.9B | — |
| 14 | Chancemaker | 26Qa | 21B | — |
| 15 | Fractal engine | 310Qa | 150B | — |
| 16 | Javascript console | 71Qi | 1.1T | — |
| 17 | Idleverse | 12Sx | 8.3T | — |
| 18 | Cortex baker | ~1.9Sx | 64T | — |
| 19 | You | ~540Sx | 510T | — |

### Fórmulas clave
- **Precio de N edificios:** `basePrice × 1.15^(cantidad - gratis)`
- **Venta:** devuelve **25%** del costo (mejorable con auras a 50%)
- **CPS por nivel:** `baseCps × (1 + nivel × 0.01)` — cada nivel = +1% para ese edificio
- **Factor de escalado:** `Game.priceIncrease = 1.15` (línea 7972)

---

## 2. SISTEMA DE UPGRADES (~650+ upgrades)

CC tiene **5 mecanismos distintos** para crear upgrades:

### A. Tiered Upgrades (por edificio, ×2 eficiencia)

Función generadora (línea 10150):
```js
Game.TieredUpgrade = function(name, desc, building, tier)
// Cost = building.basePrice × Game.Tiers[tier].price
// Auto-unlocks at Game.Tiers[tier].unlock buildings owned
// Effect: building is 2× as efficient
```

**11 tiers** por edificio, cada uno desbloquea al tener X de ese edificio:

| Tier | Nombre | Desbloquea a | Multiplicador de precio | Icon Row |
|------|--------|-------------|------------------------|----------|
| 1 | Plain | 1 edificio | ×10 | 0 |
| 2 | Berrylium | 5 | ×50 | 1 |
| 3 | Blueberrylium | 25 | ×500 | 2 |
| 4 | Chalcedhoney | 50 | ×50,000 | 13 |
| 5 | Buttergold | 100 | ×5M | 14 |
| 6 | Sugarmuck | 150 | ×500M | 15 |
| 7 | Jetmint | 200 | ×500B | 16 |
| 8 | Cherrysilver | 250 | ×500T | 17 |
| 9 | Hazelrald | 300 | ×500Qa | 18 |
| 10 | Mooncandy | 350 | ×500Qi | 19 |
| 11 | Astrofudge | 400 | ×5Sx | 28 |
| 12 | Alabascream | 450 | ×50Sp | 30 |
| 13 | Iridyum | 500 | ×500Oc | 31 |
| 14 | Glucosmium | 550 | ×5No | 34 |
| 15 | Glimmeringue | 600 | ×50No | 36 |
| synergy1 | Synergy I | 15 de cada uno | ×200,000 | 20 |
| synergy2 | Synergy II | 75 de cada uno | ×200B | 29 |
| fortune | Fortune | tick-based | ~7.7×10²⁵ | 32 |

**~175+ upgrades tiered** (11+ tiers × 16+ edificios)

> **Para Democracia S.A.**: Cada uno de tus 19 generadores podría tener 5-7 tiers que dupliquen su eficiencia, desbloqueados al tener X cantidad. Es el patrón principal de progression.

---

### B. Cookie Upgrades (~150+, multiplicadores de CPS)

Función generadora (línea 10095):
```js
Game.NewUpgradeCookie = function(obj)
// obj: {name, desc, power (CpS %), price, icon, require (parent), season, locked}
// Auto-pushes to Game.UnlockAt for cookie-earned unlocking
```

Cada uno da un `%` de CpS bonus. Se desbloquean por hitos de cookies totales ganadas.

**Cadenas principales:**
- **Base cookies** (no requirement): Plain, Sugar, Oatmeal raisin, Peanut butter, Coconut... (~50+)
- **Halloween cookies** (drops from wrinklers): Skull, Ghost, Bat, Slime, Pumpkin... (power 2)
- **Christmas cookies** (drops): Christmas tree, Snowflake, Snowman... (power 2)
- **Valentine cookies** (cadenas por temporada): Pure heart → Ardent heart → ... → Eternal heart
- **Macaron chain** (requires Box of macarons): Rose → Lemon → Chocolate → ... (power 3)
- **British tea biscuit chain** (requires Tin): British tea → Choc. British tea → ... (power 2)
- **Brand biscuit chain** (requires Box of brand): Caramoas → Sagalongs → ... (power 2-3)
- **Butter cookie chain** (requires Tin of butter cookies): Butter horseshoes → ... → Butter swirls (power 4)
- **Pastries chain** (requires Box of pastries): Profiteroles → ... → Butter croissant (power 4)
- **Butter biscuits** (achievement rewards): Milk → Dark → White → Ruby → Lavender → ... (power 10 cada uno)
- **Garden drops**: Wheat slims, Elderwort biscuits, Bakeberry cookies, Duketater cookies, Green yeast digestives

> **Para D.S.A.**: Los equivalentes serían upgrades que den +1% o +2% de PpS, desbloqueados al pasar ciertos umbrales de pesos. Forman cadenas donde comprar uno desbloquea el siguiente.

---

### C. Grandma Synergies (18 upgrades)

Función generadora (línea 10328):
```js
Game.GrandmaSynergy = function(name, desc, building)
// Cost = building.basePrice × Game.Tiers[2].price (500 multiplier)
// Effect: "X grandmas are twice as efficient; Y gain +1% CpS per X grandma"
```

Cada una conecta las Grandmas con un edificio distinto:

| Nombre | Edificio |
|---------|----------|
| Farmer grandmas | Farm |
| Miner grandmas | Mine |
| Worker grandmas | Factory |
| Cosmic grandmas | Shipment |
| Transmuted grandmas | Alchemy lab |
| Altered grandmas | Portal |
| Grandmas' grandmas | Time machine |
| Antigrandmas | Antimatter condenser |
| Rainbow grandmas | Prism |
| Banker grandmas | Bank |
| Priestess grandmas | Temple |
| Witch grandmas | Wizard tower |
| Lucky grandmas | Chancemaker |
| Metagrandmas | Fractal engine |
| Binary grandmas | Javascript console |
| Alternate grandmas | Idleverse |
| Brainy grandmas | Cortex baker |
| Clone grandmas | You |

> **Para D.S.A.**: Los **Militantes** (primer generador) podrían tener sinergias con TODOS los demás edificios — "Militantes son ×2 eficientes; [Edificio] gana +1% por cada Militante". Es una mecánica que conecta todo el juego y hace que el primer generador nunca se vuelva obsoleto.

---

### D. Synergy Upgrades (~40+, entre dos edificios)

Función generadora (línea 10167):
```js
Game.SynergyUpgrade = function(name, desc, building1, building2, tier)
// Cost = (B1.basePrice×10 + B2.basePrice×1) × tier.price
// Effect: B1 gains +5% CpS per B2; B2 gains +0.1% CpS per B1
// Requires: Synergies Vol. I (15 each) or Vol. II (75 each)
```

**Synergy I** (requiere 15 de cada edificio):

| Nombre | Edificio 1 | Edificio 2 |
|---------|-----------|-----------|
| Future almanacs | Farm | Time machine |
| Seismic magic | Mine | Wizard tower |
| Quantum electronics | Factory | Antimatter condenser |
| Contracts from beyond | Bank | Portal |
| Paganism | Temple | Portal |
| Arcane knowledge | Wizard tower | Alchemy lab |
| Fossil fuels | Shipment | Mine |
| Primordial ores | Alchemy lab | Mine |
| Infernal crops | Portal | Farm |
| Relativistic parsec-skipping | Time machine | Shipment |
| Extra physics funding | Antimatter condenser | Bank |
| Light magic | Prism | Wizard tower |
| Gemmed talismans | Chancemaker | Mine |
| Recursive mirrors | Fractal engine | Prism |
| Mice clicking mice | Fractal engine | Cursor |
| Script grannies | Javascript console | Grandma |
| Perforated mille-feuille cosmos | Idleverse | Portal |
| Thoughts & prayers | Cortex baker | Temple |
| Accelerated development | You | Time machine |

**Synergy II** (requiere 75 de cada edificio):

| Nombre | Edificio 1 | Edificio 2 |
|---------|-----------|-----------|
| Rain prayer | Farm | Temple |
| Asteroid mining | Mine | Shipment |
| Temporal overclocking | Factory | Time machine |
| Printing presses | Bank | Factory |
| God particle | Temple | Antimatter condenser |
| Magical botany | Wizard tower | Farm |
| Shipyards | Shipment | Factory |
| Gold fund | Alchemy lab | Bank |
| Abysmal glimmer | Portal | Prism |
| Primeval glow | Time machine | Prism |
| Chemical proficiency | Antimatter condenser | Alchemy lab |
| Mystical energies | Prism | Temple |
| Charm quarks | Chancemaker | Antimatter condenser |
| Infraverses and superverses | Idleverse | Fractal engine |
| Tombola computing | Javascript console | Chancemaker |
| Fertile minds | Cortex baker | Farm |
| Peer review | You | Javascript console |

> **Para D.S.A.**: Oro puro para sinergias temáticas argentinas:
> - Municipio ↔ Banco Público (gestión municipal y finanzas)
> - Ministerio ↔ Congreso (poder ejecutivo y legislativo)
> - FMI ↔ Banco Central (economía internacional y local)
> - campaña electoral ↔ Militante (política y base social)
> - Embajada ↔ FMI (diplomacia y finanzas internacionales)
> - etc.

---

### E. Kitten Upgrades (12, escalan con logros)

Descripción: "Cookie production multiplier +X% (milk-powered)". El multiplicador escala con total de leche (= logros desbloqueados / 25).

| # | Nombre | Costo | Tier |
|---|--------|-------|------|
| 1 | Kitten helpers | 9M | 1 |
| 2 | Kitten workers | 9B | 2 |
| 3 | Kitten engineers | 9T | 3 |
| 4 | Kitten overseers | 9Qa | 4 |
| 5 | Kitten managers | 9Qi | 5 |
| 6 | Kitten accountants | 9Sx | 6 |
| 7 | Kitten specialists | 9Sp | 7 |
| 8 | Kitten experts | 9Oc | 8 |
| 9 | Kitten consultants | 9No | 9 |
| 10 | Kitten assistants to the regional manager | 9Dc | 10 |
| 11 | Kitten marketeers | 9Tc | 11 |
| 12 | Kitten analysts | 9Qd | 12 |

> **Para D.S.A.**: La futura mecánica de **popularidad** podría funcionar igual — más logros = más popularidad = más fuerte el bonus.

---

### F. Clicking / Mouse Upgrades (12 tiers)

| Nombre | Costo | Efecto |
|--------|-------|--------|
| Plastic mouse | 50K | +1% clicking power |
| Iron mouse | 5M | +1% clicking power |
| Titanium mouse | 500M | +1% clicking power |
| Adamantium mouse | 50B | +1% clicking power |
| Unobtainium mouse | 5T | +1% clicking power |
| Eludium mouse | 500T | +1% clicking power |
| Wishalloy mouse | 50Qa | +1% clicking power |
| Fantasteel mouse | 5Qi | +1% clicking power |
| Nevercrack mouse | 500Qi | +1% clicking power |
| Armythril mouse | 50Sx | +1% clicking power |
| Technobsidian mouse | 5Sp | +1% clicking power |
| Plasmarble mouse | 500Sp | +1% clicking power |

---

### G. Golden Cookie Upgrades

| Nombre | Costo | Efecto |
|--------|-------|--------|
| Lucky day | 777,777,777 | GC aparecen 2× más seguido, duran 2× más |
| Serendipity | 77.7B | GC aparecen 2× más seguido, duran 2× más |
| Get lucky | 77.7T | Efectos de GC duran 2× más |
| Heavenly luck | 77 (prestige) | GC aparecen +5% más seguido |
| Lasting fortune | 777 (prestige) | Efectos de GC +10% más largos |
| Decisive fate | 7,777 (prestige) | GC se quedan +5% más |
| Residual luck | 99,999 (prestige) | +10% CpS por GC upgrade mientras switch on |
| Distilled essence of redoubled luck | 7.7M (prestige) | 1% chance GC spawns doubled |

---

### H. Grandma Research Chain (Tech Tree)

Una cadena secuencial de upgrades desbloqueados uno por uno:

| Nombre | Costo | Efecto | Desbloquea |
|--------|-------|--------|------------|
| Bingo center/Research facility | 1Qa | Grandmas ×4; habilita research | Specialized chocolate chips |
| Specialized chocolate chips | 1Qa | Cookie prod. +1% | Designer cocoa beans |
| Designer cocoa beans | 2Qa | Cookie prod. +2% | Ritual rolling pins |
| Ritual rolling pins | 4Qa | Grandmas ×2 | Underworld ovens |
| Underworld ovens | 8Qa | Cookie prod. +3% | One mind |
| One mind | 16Qa | +0.02 base CpS por grandma; elderWrath=1 | Exotic nuts |
| Exotic nuts | 32Qa | Cookie prod. +4% | Communal brainsweep |
| Communal brainsweep | 64Qa | +0.02 base CpS por grandma; elderWrath=2 | Arcane sugar |
| Arcane sugar | 128Qa | Cookie prod. +5% | Elder Pact |
| Elder Pact | 256Qa | +0.05 base CpS por portal; elderWrath=3 | — |

> **Para D.S.A.**: Podría haber una cadena de investigación del Ministerio que desbloquee mecánicas progresivamente.

---

### I. Easter Eggs (20+ upgrades)

**Common Eggs** (1% CpS cada uno): Chicken, Duck, Turkey, Quail, Robin, Ostrich, Cassowary, Salmon roe, Frogspawn, Shark, Turtle, Ant larva

**Rare Eggs**:

| Nombre | Efecto |
|--------|--------|
| Golden goose egg | GC aparecen +5% más seguido |
| Faberge egg | Edificios/upgrades 1% más baratos |
| Wrinklerspawn | Wrinklers explotan +5% más cookies |
| Cookie egg | Clicking +10% más poderoso |
| Omelette | Otros eggs aparecen +10% más frecuente |
| Chocolate egg | Contiene mucha cantidad de cookies (bonus instantáneo) |
| Century egg | Continuamente ganas más CpS con el tiempo |
| "egg" | +9 CpS flat |

---

## 3. SISTEMA DE PRESTIGE (Heavenly Chips)

### Fórmula (líneas 4185-4188)
```js
Game.HCfactor = 3;
Game.HowMuchPrestige = function(cookies) {
    return Math.pow(cookies / 1000000000000, 1/3);  // raíz cúbica de (trillones)
};
```

**Prestige = floor((cookiesTotalesReseteadas / 10^12) ^ (1/3))**

### Fórmula inversa
```js
Game.HowManyCookiesReset = function(chips) {
    return Math.pow(chips, 3) * 1000000000000;
};
```

### Conversión a CpS (línea 5175)
```js
mult += prestige * 0.01 * heavenlyPower * GetHeavenlyMultiplier()
// Cada nivel de prestigio = +1% base CpS
```

### Heavenly Multiplier
Se puede desbloquear hasta +100% con 5 upgrades:

| Upgrade | Costo (HC) | Bonus |
|---------|-----------|-------|
| Heavenly chip secret | 11 | +5% |
| Heavenly cookie stand | 1,111 | +25% |
| Heavenly bakery | 111,111 | +25% |
| Heavenly confectionery | 11,111,111 | +25% |
| Heavenly key | 1,111,111,111 | +25% |

### Ranuras permanentes de upgrades (5 slots)

| Nombre | Costo (HC) |
|--------|-----------|
| Permanent upgrade slot I | 100 |
| Permanent upgrade slot II | 20,000 |
| Permanent upgrade slot III | 3,000,000 |
| Permanent upgrade slot IV | 400,000,000 |
| Permanent upgrade slot V | 50,000,000,000 |

### Dos caminos de prestigio

**Camino Angelical:**

| Nombre | Efecto |
|--------|--------|
| Angels | +10% CpS (15% si 100 de todo) |
| Archangels | +10% (25%) |
| Virtues | +10% (35%) |
| Dominions | +10% (45%) |
| Cherubim | +10% (55%) |
| Seraphim | +10% (65%) |
| God | +10% (75%) |

**Camino Demoníaco:**

| Nombre | Efecto |
|--------|--------|
| Belphegor | +2% CpS por min de esta ascensión |
| Mammon | +4% por min |
| Abaddon | +8% por min |
| Satan | +16% por min |
| Asmodeus | +32% por min |
| Beelzebub | +64% por min |
| Lucifer | +128% por min |

> **Para D.S.A.**: Tu fórmula `dólares = floor(sqrt(pesosTotales / 1e12))` es más generosa que CC (raíz cuadrada vs raíz cúbica). Los Dólares podrían usarse en la Casa de Cambio para comprar upgrades permanentes, como los Heavenly Chips.

---

## 4. GOLDEN COOKIES

### Spawn system (líneas 5534-5620)
- **Tiempo base:** 5-15 minutos
- **Fórmula de spawn:** `random() < ((time - minTime)/(maxTime - minTime))^5` — pesado hacia el máximo
- **Duración base:** ~13 segundos (×2 con Lucky day/Serendipity)

### Todos los efectos

| Efecto | Probabilidad | Duración | Multiplicador |
|--------|-------------|----------|--------------|
| Frenzy | Siempre en pool | 77s | ×7 CpS |
| Lucky (multiply) | Siempre en pool | Instantáneo | +15% del banco o 15min CpS |
| Ruin (wrath only) | Siempre en wrath pool | Instantáneo | −5% del banco o 10min CpS |
| Clot (wrath only) | Siempre en wrath pool | 66s | ×0.5 CpS |
| Blood frenzy (wrath) | 30% chance (wrath) | 6s | ×666 CpS |
| Click frenzy | 10% base | 13s | ×777 clicks |
| Dragon Harvest | Con aura | 60s | ×15 CpS |
| Dragonflight | Con aura | 10s | ×1111 clicks |
| Cookie chain | 3% (golden) / 30% (wrath) | Apilado | Dígitos crecientes |
| Cookie storm | 3% (golden) / 30% (wrath) | 7s | Spawns many mini-GCs |
| Cursed finger (wrath) | 10% (wrath) | 10s | Next click = 10s CpS |
| Building special | 25% (≥10 de un edificio) | 30s | ×(amount/10+1) un edificio |
| Free sugar lump | 0.05% | Instantáneo | +1 sugar lump |
| Blab (joke) | 0.01% | Instantáneo | Nada |

> **Para D.S.A.**: Los Telegramas podrían tener efectos similares — "Frenesí Popular" (×7 PpS), "Auge Electoral" (×777 clicks), "Dinero del FMI" (bonus instantáneo de pesos), etc.

---

## 5. WRINKLERS

### Core mechanics
```js
suckRate = 1/20;  // Cada wrinkler come 5% del CpS
cpsSucked = min(1, sucking * suckRate);  // Cap al 100%
```

- **Hard limit:** 14 (normal max 10, 12 con Elder spice)
- **Shiny wrinklers:** 1/100 chance (dan ×3 al explotar)
- Solo aparecen durante Grandmapocalipsis (elderWrath > 0)

> **Para D.S.A.**: Tu mecánica de inflación podría funcionar parecido — la inflación "se come" un % de tu PpS, pero si la "controlás" (comprando Banco Central, etc.) recuperás más de lo que perdiste.

---

## 6. SUGAR LUMPS

### Tiempos de crecimiento
```
lumpMatureAge = 20 horas
lumpRipeAge = 23 horas
lumpOverripeAge = ripeAge + 1 hora
```

### Tipos de Sugar Lump

| Tipo | Probabilidad | Efecto |
|------|-------------|--------|
| Normal | ~87.7% | +1 lump |
| Bifurcated | ~10% | 50% chance de +2 lumps |
| Golden | 0.3% | +2-7 lumps, double cookies (cap 24h CpS) |
| Meaty | 10% × elderWrath | +0 a 2 lumps |
| Caramelized | 2% | +1-3 lumps, refills all lump cooldowns |

### Usos
- **Building levels:** +1% CpS por ese edificio (permanente entre ascensiones)
- **Minigame refills:** 15-min cooldown compartido
- **Pantheon slot swaps:** 1M cookie cost + 1 lump
- **Sugar baking:** +1% CpS per lump owned

---

## 7. LOGROS (~540+ achievements)

### Ubicación en el código
- Helper functions: línea 12,973
- Primer logro: línea 13,022
- Último logro: línea 14,050
- Total `new Game.Achievement()` explícitos: **206**
- 4 funciones generadoras crean cientos más

### Funciones generadoras

```js
// 1. Bank Achievement (cookies totales en una ascensión)
Game.BankAchievement = function(name)
// threshold = 10^floor(index × 1.5 + 2)

// 2. CPS Achievement
Game.CpsAchievement = function(name)
// threshold = 10^floor(index × 1.2)

// 3. Tiered Achievement (cantidad de un edificio)
Game.TieredAchievement = function(name, building, tier)
// Tiers 1-15, unlock amounts de 1 → 700

// 4. Production Achievement (producción de un edificio)
Game.ProductionAchievement = function(name, building, tier)
// pow = 10^(12 + buildingIndex + tierOffset), 3 tiers
```

### Categorías

| # | Categoría | Cantidad | Descripción |
|---|-----------|----------|-------------|
| 1 | BankAchievements (cookies en una ascensión) | 47 | Umbrales de 1 → 10^65+ |
| 2 | CpsAchievements (cookies/sec) | 48 | De 1/s → 10^38/s |
| 3 | Clicking | 15 | De 1K → 10^31 de clicks |
| 4 | Cursor milestones | 14 | Tener 1 → 1,000 cursors |
| 5 | Tiered building achievements | ~244+ | 14 tiers × 19 edificios (1→700) |
| 6 | Production achievements | ~60+ | 3 tiers × 19 edificios |
| 7 | Level 10 | 20 | Nivel 10 de cada edificio |
| 8 | Ascension | 21 | Ascender con X horneados / N veces |
| 9 | Golden cookie | 8 | 7 → 7777 GC clickeados |
| 10 | Building total milestones | 7 | 100 → 10,000 edificios total |
| 11 | Upgrade purchase milestones | 9 | 20 → 700 upgrades |
| 12 | Have X of everything | 15 | 100 → 700 de cada edificio |
| 13 | Combined milestones | 2 | X upgrades + Y buildings |
| 14 | Grandma-related | 4 | Vender grandma, tipos, 777 |
| 15 | Grandmapocalypse/Elder | 5 | Elder covenant, wrath cookie |
| 16 | Shadow/Secret | 8 | Cheat, name Orteil, add-on |
| 17 | Speed/Challenge | 5 | No-click, no-upgrade, speed bake |
| 18 | Holiday/Seasonal | 11 | Halloween, Valentine, Christmas |
| 19 | Easter/Eggs | 4 | Unlock 1/7/14/all eggs |
| 20 | Wrinkler | 4 | Burst/wrinkler poker |
| 21 | Sugar lumps | 9 | Tipos de harvest |
| 22 | Garden | 5 | Harvest plants, fill garden |
| 23 | Spell casting | 3 | 9/99/999 spells |
| 24 | Stock market | 9 | Profits, HQ, loans |
| 25 | Misc | ~10 | Cookie dunker, tiny cookie, etc. |
| 26 | Dungeon (legacy) | 4 | Bosses (removidos) |

---

## 8. MINIGAMES (4)

| Edificio | Minigame | Mecánica |
|----------|----------|----------|
| Farm | Garden | Plantar cosechas para bonuses |
| Bank | Stock Market | Comprar/vender bienes |
| Temple | Pantheon | Adorar dioses con slots (3 slots: Diamond + Ruby) |
| Wizard tower | Grimoire | Lanzar hechizos (usa "magia" = CpS) |

### Dioses del Panteón (referenciados en main.js)

| Dios | Slot | Efecto |
|-----|------|--------|
| Creation | Diamond (1/2/3) | Costo edificio ×0.93/0.95/0.98; Heavenly ×0.7/0.8/0.9 |
| Asceticism | Ruby (1/2/3) | Global CpS ×1.15/1.10/1.05 |
| Decadence | Diamond (1/2/3) | buildMult ×0.93/0.95/0.98; Building special ×1.07/1.05/1.02 |
| Industry | Ruby (1/2/3) | buildMult ×1.10/1.06/1.03; GC spawn ×1.10/1.06/1.03 |
| Labor | Diamond (1/2/3) | buildMult ×0.97/0.98/0.99; Click ×1.15/1.10/1.05 |
| Ages | Ruby (1/2/3) | Oscilando ±15% CpS (3h/12h/24h período) |
| Mother | Diamond (1/2/3) | milkMult ×1.10/1.05/1.03; GC spawn ×1.15/1.10/1.05 |
| Seasons | Ruby (1/2/3) | Temporadas modificadas |
| Order | Ruby (1/2/3) | Lump ripening −1h/−40min/−20min |
| Ruin | — | Buff de devastación al vender |
| Scorn | — | Fuerza wrath cookies |

---

## 9. CÁLCULO DE CPS (fórmula completa)

La función `CalculateGains` (línea 5155) calcula el CPS final en pasos:

### Paso 1: Minigame effects
Todos los minigames cargados aplican sus `effs` multiplicativos.

### Paso 2: Prestige multiplier
```js
mult += prestige * 0.01 * heavenlyPower * GetHeavenlyMultiplier()
// Cada nivel prestige = +1% base CpS
```

### Paso 3: Global multipliers
- cps eff desde minigames
- Heralds: ×(1 + 0.01 * heralds)
- Cookie upgrades: cada uno agrega `power * 0.01`
- Christmas upgrades: ×1.15, ×1.15, ×1.01, ×1.01, ×1.2
- Dragon scale: ×1.03, Wrinkler ambergris: ×1.06
- Dioses (Asceticism, Ages, etc.)
- Santa's legacy: ×(1 + (santaLevel+1) * 0.03)

### Paso 4: Milk & Kittens
```js
milkProgress = AchievementsOwned / 25  // max ~8.4 con todos los logros
// Kitten upgrades: mult *= (1 + milkProgress * bonus * milkMult)
```

### Paso 5: Building CPS
```js
for each building:
    storedCps = cps(me) * (1 + level * 0.01) * buildMult
    storedTotalCps = amount * storedCps
    cookiesPs += storedTotalCps
```

### Paso 6: Egg multipliers
- 12 regular eggs: ×1.01 cada uno = ×1.12 total
- Century egg: hasta ×1.10 (aumenta con 100 días)
- Golden goose egg: ×0.01 por GC upgrade

### Paso 7: Sugar baking
```js
mult *= 1 + min(100, lumps) * 0.01  // +1% per lump, max +100%
```

### Paso 8: Dragon & Buffs
- Radiant Appetite aura: ×(1 + level) (level 1 = ×2)
- Dragon's Fortune: ×(1 + 1.23*level) por GC en pantalla
- Wrinklers: reducen CpS visible hasta 50% (chupando)
- Elder Covenant: ×0.95
- Golden Switch: ×1.5 + bonuses
- Shimmering Veil: ×(1 + veilBoost)
- Buff effects: Frenzy = ×7, Clot = ×0.5, etc.

---

## 10. HALLAZGOS CLAVE PARA DEMOCRACIA S.A.

### Cosas que podés copiar/adaptar:

1. **Tiered Upgrades por generador**: 5-7 niveles, cada uno desbloquea al tener X cantidad. Cada nivel ×2 eficiencia. Es el core del progression.

2. **Sinergias entre edificios**: Los más temáticos posibles. Municipio+Ministerio, FMI+Banco Central, etc. Con dos tiers (15 y 75 de cada uno).

3. **Upgrades tipo "cookie"**: Multiplicadores de PpS desbloqueados por hitos de pesos totales. Son la recompensa "suave" que siempre estás cerca de desbloquear.

4. **Golden Cookie-equivalent**: Telegramas con efectos aleatorios (Frenzy, Click Boost, etc.).

5. **Kitten-equivalent (Popularidad)**: Un multiplicador que escala con la cantidad de logros. Más logros = más poder = más PpS.

6. **Permanent upgrade slots**: En prestigio, 3-5 slots para mantener upgrades entre resets.

7. **Wrinkler-equivalent (Inflación)**: Se come % del PpS pero si la "explotás" recuperás con intereses.

8. **Grandma Synergies-equivalent**: Los Militantes conectados con todos los demás generadores.

9. **Tech Tree**: Una cadena de investigación progresiva (Ministerio?) que desbloquee mecánicas una por una.

10. **Fortune Upgrades**: Un upgrade por edificio, desbloqueado por tiempo de juego, que da +7% eficiencia y -7% precio.

---

## 11. ESTADÍSTICAS TOTALES DE CC

| Elemento | Cantidad |
|----------|----------|
| Edificios | 21 |
| Upgrades totales | ~650+ |
| Logros totales | ~540+ |
| Minigames | 4 |
| Temporadas | 5 |
| Dioses (Panteón) | 13+ |
| Hechizos (Grimoire) | 12+ |
| Tipos de Sugar Lump | 5 |
| Efectos de Golden Cookie | 15+ |

---

## 12. COMPARACIÓN CON DEMOCRACIA S.A.

| Mecánica | Cookie Clicker | Democracia S.A. |
|----------|----------------|-----------------|
| Moneda | Cookies | Pesos |
| Prestige | Heavenly Chips (raíz cúbica) | Dólares (raíz cuadrada — más generosa) |
| Tienda de prestige | — | Casa de Cambio |
| Logros | ~540+ | 120 + 190 pendientes |
| Upgrades | ~650+ | No implementado aún |
| Generadores | 21 | 19 |
| Factor de precio | ×1.15 | ¿ |
| Efectos aleatorios | Golden Cookies | ¿Telegramas? |
| Teatro político | — | Calidad Democrática |
| Inflación | — (Wrinklers se asemejan) | Planeado (mecánica real) |
| Minigames | 4 | No implementado aún |

---

*Análisis generado por Super Z a partir de `cc main.js` (17,359 líneas)*
