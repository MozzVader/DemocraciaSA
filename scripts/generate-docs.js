#!/usr/bin/env node
// ============================================
// DEMOCRACIA S.A. — Generador de documentación
// Lee los data files y genera .md automáticamente
// Uso: node scripts/generate-docs.js
// ============================================

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');
const DATA = path.join(ROOT, 'js', 'data');

// ── Helpers ──────────────────────────────────────────────────

/** Evalúa un archivo JS de datos y devuelve la variable global definida */
function loadData(filename, varName) {
  const src = fs.readFileSync(path.join(DATA, filename), 'utf8');
  let result;
  eval(src.replace('const ', 'var '));   // permitir const → var
  // la variable queda en scope
  switch (varName) {
    case 'LOGROS_DATA':             result = LOGROS_DATA; break;
    case 'GENERADORES':             result = GENERADORES; break;
    case 'OPERACIONES_DATA':        result = typeof OPERACIONES_DATA !== 'undefined' ? OPERACIONES_DATA : []; break;
    case 'OPERACIONES_CLICK_DATA':  result = typeof OPERACIONES_CLICK_DATA !== 'undefined' ? OPERACIONES_CLICK_DATA : []; break;
    case 'EVENTOS_DATA':            result = typeof EVENTOS_DATA !== 'undefined' ? EVENTOS_DATA : []; break;
    case 'NOTICIAS_DATA':           result = typeof NOTICIAS_DATA !== 'undefined' ? NOTICIAS_DATA : []; break;
    case 'TELEGRAMAS_DATA':         result = typeof TELEGRAMAS_DATA !== 'undefined' ? TELEGRAMAS_DATA : []; break;
    default: result = [];
  }
  return Array.isArray(result) ? result : [];
}

/** Formatea un número grande para lectura */
function fmtNum(n) {
  if (typeof n !== 'number' || n === 0) return String(n);
  const str = String(n);
  if (str.includes('e')) return n.toExponential(0);
  return str;
}

/** Retorna nombre legible de categoría */
function catLabel(cat) {
  const map = {
    pesos: 'Pesos en una run',
    pps: 'Pesos Por Segundo',
    clics: 'Clics (Lifetime)',
  };
  return map[cat] || cat;
}

// ── Generador: Logros ────────────────────────────────────────

function generateLogros(data) {
  if (!data.length) return null;

  // Agrupar por categoría
  const cats = {};
  let maxId = 0;
  data.forEach(a => {
    if (a.id > maxId) maxId = a.id;
    const c = a.cat || 'otro';
    if (!cats[c]) cats[c] = [];
    cats[c].push(a);
  });

  let md = '# Logros — Reference\n\n';
  md += '> **Archivo:** `js/data/logros.js`\n';
  md += '> **Total:** ' + data.length + ' logros | **Próximo ID disponible:** ' + (maxId + 1) + '\n\n';

  // ── Resumen por categoría ──
  md += '## Resumen por categoría\n\n';
  md += '| Categoría | IDs | Cantidad | Prefijo icono |\n';
  md += '|-----------|-----|----------|---------------|\n';

  Object.keys(cats).sort().forEach(cat => {
    const items = cats[cat];
    const minId = items[0].id;
    const maxCat = items[items.length - 1].id;
    const icono = items[0].icono || '-';
    // Derivar prefijo del icono (ej: 'peso-1' → 'peso-1..50')
    const prefix = icono.replace(/-\d+$/, '');
    md += '| ' + catLabel(cat) + ' | ' + minId + '-' + maxCat + ' | ' + items.length + ' | ' + prefix + '-1..' + items.length + ' |\n';
  });

  md += '\n';

  // ── Detalle completo por categoría ──
  Object.keys(cats).sort().forEach(cat => {
    md += '## ' + catLabel(cat) + ' (`' + cat + '`)\n\n';
    md += '| ID | Nombre | Icono | Condición |\n';
    md += '|----|--------|-------|-----------|\n';

    cats[cat].forEach(a => {
      md += '| ' + a.id + ' | ' + a.nombre + ' | `' + (a.icono || '-') + '` | ' + a.desc + ' |\n';
    });

    md += '\n';
  });

  return md;
}

// ── Generador: Generadores ──────────────────────────────────

function generateGeneradores(data) {
  if (!data.length) return null;

  let md = '# Generadores — Reference\n\n';
  md += '> **Archivo:** `js/data/generadores.js`\n';
  // Leer FACTOR_PRECIO del mismo archivo si existe
  let factorPrecio = '?';
  try {
    const genSrc = fs.readFileSync(path.join(DATA, 'generadores.js'), 'utf8');
    const match = genSrc.match(/FACTOR_PRECIO\s*=\s*([\d.]+)/);
    if (match) factorPrecio = match[1];
  } catch(e) {}

  md += '> **Total:** ' + data.length + ' generadores | **Factor de precio:** ' + factorPrecio + '\n\n';

  md += '| ID | Nombre | Precio Base | PPS Base | Icono |\n';
  md += '|----|--------|-------------|----------|-------|\n';

  data.forEach(g => {
    md += '| ' + g.id + ' | ' + g.nombre + ' | ' + fmtNum(g.precioBase) + ' | ' + fmtNum(g.ppsBase) + ' | `' + (g.icono || '-') + '` |\n';
  });

  md += '\n';

  return md;
}

// ── Generador: Operaciones (generadores) ────────────────────────

function generateOperaciones(data) {
  if (!data.length) return null;

  // Agrupar por generador
  const byGen = {};
  data.forEach(op => {
    const g = op.genId !== undefined ? op.genId : -1;
    if (!byGen[g]) byGen[g] = [];
    byGen[g].push(op);
  });

  let md = '# Operaciones — Reference\n\n';
  md += '> **Archivo:** `js/data/operaciones.js`\n';
  md += '> **Total:** ' + data.length + ' operaciones (tiered por generador)\n';
  md += '> **Mecánica:** Cada compra da **x2 PpS** al generador correspondiente\n\n';

  md += '## Resumen\n\n';
  md += '| Generador ID | Cantidad | Rango de IDs |\n';
  md += '|-------------|----------|-------------|\n';
  Object.keys(byGen).sort((a,b) => a - b).forEach(gid => {
    const items = byGen[gid];
    const minId = items[0].id;
    const maxId = items[items.length - 1].id;
    md += '| ' + gid + ' | ' + items.length + ' | ' + minId + '-' + maxId + ' |\n';
  });
  md += '\n';

  md += '## Detalle completo\n\n';
  md += '| ID | Nombre | Gen ID | Trigger | Precio | Bonus | Icono |\n';
  md += '|----|--------|--------|---------|--------|-------|-------|\n';
  data.forEach(op => {
    md += '| ' + op.id + ' | ' + op.nombre + ' | ' + (op.genId !== undefined ? op.genId : '-') + ' | ' + fmtNum(op.trigger) + ' | ' + fmtNum(op.precio) + ' | ' + (op.bonusText || '-') + ' | `' + (op.icono || '-') + '` |\n';
  });

  md += '\n';
  return md;
}

// ── Generador: Operaciones Click ───────────────────────────────

function generateOperacionesClick(data) {
  if (!data.length) return null;

  let md = '# Operaciones Click — Reference\n\n';
  md += '> **Archivo:** `js/data/operacionesClick.js`\n';
  md += '> **Total:** ' + data.length + ' operaciones click\n';
  md += '> **Mecánica:** Cada compra suma **+1% del PpS** al valor del click\n\n';

  md += '| ID | Nombre | Trigger (pesos/click) | Precio | Bonus | Icono |\n';
  md += '|----|--------|---------------------|--------|-------|-------|\n';
  data.forEach(op => {
    md += '| ' + op.id + ' | ' + op.nombre + ' | ' + fmtNum(op.trigger) + ' | ' + fmtNum(op.precio) + ' | ' + (op.bonusText || '-') + ' | `' + (op.icono || '-') + '` |\n';
  });

  md += '\n';
  return md;
}

// ── Generador: Telegramas ──────────────────────────────────

function generateTelegramas(data) {
  if (!data.length) return null;

  // Agrupar por tipo
  const byType = {};
  data.forEach(t => {
    const tipo = t.tipo || 'otro';
    if (!byType[tipo]) byType[tipo] = [];
    byType[tipo].push(t);
  });

  let md = '# Telegramas — Reference\n\n';
  md += '> **Archivo:** `js/data/telegramas.js`\n';
  md += '> **Total:** ' + data.length + ' telegramas\n';
  md += '> **Spawn:** buenos (peso 10) + malos (peso 10) + meta (peso 1)\n';
  md += '> **Timer:** 20s base para responder | Rechazar = sin efecto\n\n';

  md += '## Resumen por tipo\n\n';
  md += '| Tipo | Cantidad | Spawn peso | IDs |\n';
  md += '|------|----------|------------|-----|\n';
  const labels = { bueno: 'Bueno', malo: 'Malo', meta: 'Meta' };
  Object.keys(byType).sort().forEach(tipo => {
    const items = byType[tipo];
    const minId = Math.min(...items.map(t => t.id));
    const maxId = Math.max(...items.map(t => t.id));
    md += '| ' + (labels[tipo] || tipo) + ' | ' + items.length + ' | peso ' + items[0].peso + ' c/u | ' + minId + '-' + maxId + ' |\n';
  });
  md += '\n';

  md += '## Detalle completo\n\n';
  md += '| ID | Texto | Tipo | Efecto | Req Gen |\n';
  md += '|----|-------|------|--------|---------|\n';
  data.forEach(t => {
    let efectoStr = '-';
    if (t.efecto) {
      const e = t.efecto;
      switch (e.tipo) {
        case 'clickMult':         efectoStr = 'Click x' + e.mult + ' / ' + e.duracion + 's'; break;
        case 'ppsMult':            efectoStr = 'PpS x' + e.mult + ' / ' + e.duracion + 's'; break;
        case 'instantGenPPS':      efectoStr = 'Instant x' + e.mult + ' PpS gen-' + e.genId; break;
        case 'instantPesosPercent':efectoStr = '+' + e.percent + '% pesos actuales'; break;
        case 'addGenerator':       efectoStr = '+' + e.cantidad + ' gen-' + e.genId; break;
        case 'removePesosPercent': efectoStr = '-' + e.percent + '% pesos actuales'; break;
        case 'removePesosAcumPercent': efectoStr = '-' + e.percent + '% pesos acumulados'; break;
        case 'achievement':        efectoStr = 'Logro #' + e.logroId; break;
      }
    }
    md += '| ' + t.id + ' | ' + t.texto + ' | ' + t.tipo + ' | ' + efectoStr + ' | ' + (t.reqGenId !== undefined ? t.reqGenId : '-') + ' |\n';
  });

  md += '\n';
  return md;
}

// ── Generador: Eventos ──────────────────────────────────────

function generateEventos(data) {
  if (!data.length) return null;

  let md = '# Eventos — Reference\n\n';
  md += '> **Archivo:** `js/data/eventos.js`\n';
  md += '> **Total:** ' + data.length + ' eventos\n\n';

  md += '| ID | Nombre | Descripción |\n';
  md += '|----|--------|-------------|\n';
  data.forEach(ev => {
    md += '| ' + ev.id + ' | ' + ev.nombre + ' | ' + (ev.desc || '-') + ' |\n';
  });

  md += '\n';
  return md;
}

// ── Generador: Noticias ─────────────────────────────────────

function generateNoticias(data) {
  if (!data.length) return null;

  let md = '# Noticias — Reference\n\n';
  md += '> **Archivo:** `js/data/noticias.js`\n';
  md += '> **Total:** ' + data.length + ' noticias (ticker)\n\n';

  md += '| # | Headline |\n';
  md += '|---|----------|\n';
  data.forEach((n, i) => {
    // Puede ser string directo o objeto con .texto
    const texto = typeof n === 'string' ? n : (n.texto || n.nombre || '-');
    md += '| ' + (i + 1) + ' | ' + texto + ' |\n';
  });

  md += '\n';
  return md;
}

// ── Índice principal ────────────────────────────────────────

function generateIndex(sections) {
  let md = '# Democracia S.A. — Data Reference\n\n';
  md += '> Documentación auto-generada por `scripts/generate-docs.js`\n';
  md += '> **NO editar manualmente** — se regenera en cada push a `main`\n\n';
  md += '## Secciones\n\n';

  sections.forEach(s => {
    md += '- [' + s.title + '](' + s.file + ') — ' + (s.count !== null ? s.count + ' registros' : 'sin datos') + '\n';
  });

  md += '\n## Convenciones\n\n';
  md += '### Logros\n';
  md += '- **IDs secuenciales globales** (no se repiten entre categorías)\n';
  md += '- **Iconos:** `assets/logros/{prefijo}-{n}.png` (48×48 px)\n';
  md += '- **Categorías:** cada una tiene un `cat` único y un prefijo de icono\n';
  md += '- **Condiciones:** `{ stat, val }` — el stat se compara con `>=` contra `val`\n';
  md += '- **Stats disponibles:** `pesosTotales`, `pps`, `clics`, `clicsTotales`, `tiempoJugado`\n\n';
  md += '### Operaciones (generadores)\n';
  md += '- **IDs:** secuenciales globales (1 a 190)\n';
  md += '- **10 tiers por generador** (Patacón → Dólar Blue)\n';
  md += '- **Trigger:** se desbloquea cuando el generador tiene >= `trigger` unidades\n';
  md += '- **Precio:** escalado según tier y generador\n';
  md += '- **Bonus:** x2 PpS al generador correspondiente\n';
  md += '- **Iconos:** `assets/operaciones/{icono}.png`\n\n';
  md += '### Operaciones Click\n';
  md += '- **IDs:** 1001 a 1019\n';
  md += '- **Trigger:** se desbloquea cuando pesos por click >= `trigger`\n';
  md += '- **Precio:** trigger x 50\n';
  md += '- **Bonus:** +1% del PpS al valor del click\n';
  md += '- **Iconos:** `assets/operaciones/click-{tier}.png`\n\n';
  md += '### Telegramas\n';
  md += '- **IDs:** 1 a 45\n';
  md += '- **Tipos:** bueno (25), malo (5), meta (15)\n';
  md += '- **Pesos spawn:** bueno=10, malo=10, meta=1 (meta ~4.8%)\n';
  md += '- **Timer:** 20s base para responder\n';
  md += '- **Rechazar:** sin efecto\n';
  md += '- **Efectos:** clickMult, ppsMult, instantGenPPS, instantPesosPercent, addGenerator, removePesosPercent, removePesosAcumPercent, achievement, none\n\n';
  md += '### Generadores\n';
  md += '- **IDs:** 0-based (0 a 18)\n';
  md += '- **Precio:** se escala con `FACTOR_PRECIO` por cada unidad comprada\n';
  md += '- **Iconos:** `assets/icons/gen-{id}.png`\n\n';

  return md;
}

// ── Main ────────────────────────────────────────────────────

function main() {
  console.log('Generando documentación...\n');

  const sections = [];

  // Logros
  const logros = loadData('logros.js', 'LOGROS_DATA');
  const logrosMd = generateLogros(logros);
  sections.push({ title: 'Logros', file: 'LOGROS.md', count: logros.length });
  if (logrosMd) {
    fs.writeFileSync(path.join(DOCS, 'LOGROS.md'), logrosMd, 'utf8');
    console.log('  LOGROS.md — ' + logros.length + ' logros, próximo ID: ' + (Math.max(...logros.map(l => l.id)) + 1));
  }

  // Generadores
  const gens = loadData('generadores.js', 'GENERADORES');
  const gensMd = generateGeneradores(gens);
  sections.push({ title: 'Generadores', file: 'GENERADORES.md', count: gens.length });
  if (gensMd) {
    fs.writeFileSync(path.join(DOCS, 'GENERADORES.md'), gensMd, 'utf8');
    console.log('  GENERADORES.md — ' + gens.length + ' generadores');
  }

  // Operaciones (generadores)
  const ops = loadData('operaciones.js', 'OPERACIONES_DATA');
  const opsMd = generateOperaciones(ops);
  sections.push({ title: 'Operaciones (generadores)', file: 'OPERACIONES.md', count: ops.length });
  if (opsMd) {
    fs.writeFileSync(path.join(DOCS, 'OPERACIONES.md'), opsMd, 'utf8');
    console.log('  OPERACIONES.md — ' + ops.length + ' operaciones');
  }

  // Operaciones Click
  const clickOps = loadData('operacionesClick.js', 'OPERACIONES_CLICK_DATA');
  const clickOpsMd = generateOperacionesClick(clickOps);
  sections.push({ title: 'Operaciones Click', file: 'OPERACIONES_CLICK.md', count: clickOps.length });
  if (clickOpsMd) {
    fs.writeFileSync(path.join(DOCS, 'OPERACIONES_CLICK.md'), clickOpsMd, 'utf8');
    console.log('  OPERACIONES_CLICK.md — ' + clickOps.length + ' operaciones click');
  }

  // Telegramas
  const telegramas = loadData('telegramas.js', 'TELEGRAMAS_DATA');
  const telegramasMd = generateTelegramas(telegramas);
  sections.push({ title: 'Telegramas', file: 'TELEGRAMAS.md', count: telegramas.length });
  if (telegramasMd) {
    fs.writeFileSync(path.join(DOCS, 'TELEGRAMAS.md'), telegramasMd, 'utf8');
    console.log('  TELEGRAMAS.md — ' + telegramas.length + ' telegramas');
  }

  // Eventos
  const evs = loadData('eventos.js', 'EVENTOS_DATA');
  const evsMd = generateEventos(evs);
  sections.push({ title: 'Eventos', file: 'EVENTOS.md', count: evs.length });
  if (evsMd) {
    fs.writeFileSync(path.join(DOCS, 'EVENTOS.md'), evsMd, 'utf8');
    console.log('  EVENTOS.md — ' + evs.length + ' eventos');
  }

  // Noticias
  const noticias = loadData('noticias.js', 'NOTICIAS_DATA');
  const notMd = generateNoticias(noticias);
  sections.push({ title: 'Noticias', file: 'NOTICIAS.md', count: noticias.length });
  if (notMd) {
    fs.writeFileSync(path.join(DOCS, 'NOTICIAS.md'), notMd, 'utf8');
    console.log('  NOTICIAS.md — ' + noticias.length + ' noticias');
  }

  // Índice
  const indexMd = generateIndex(sections);
  fs.writeFileSync(path.join(DOCS, 'DATA_REFERENCE.md'), indexMd, 'utf8');
  console.log('  DATA_REFERENCE.md — índice generado');

  console.log('\nDocumentación generada en docs/');
}

main();
