# Democracia S.A. — Data Reference

> Documentación auto-generada por `scripts/generate-docs.js`
> **NO editar manualmente** — se regenera en cada push a `main`

## Secciones

- [Logros](LOGROS.md) — 120 registros
- [Generadores](GENERADORES.md) — 19 registros
- [Operaciones](OPERACIONES.md) — 0 registros
- [Eventos](EVENTOS.md) — 0 registros
- [Noticias](NOTICIAS.md) — 24 registros

## Convenciones

### Logros
- **IDs secuenciales globales** (no se repiten entre categorías)
- **Iconos:** `assets/logros/{prefijo}-{n}.png` (48×48 px)
- **Categorías:** cada una tiene un `cat` único y un prefijo de icono
- **Condiciones:** `{ stat, val }` — el stat se compara con `>=` contra `val`
- **Stats disponibles:** `pesosTotales`, `pps`, `clics`, `clicsTotales`, `tiempoJugado`

### Generadores
- **IDs:** 0-based (0 a 18)
- **Precio:** se escala con `FACTOR_PRECIO` por cada unidad comprada
- **Iconos:** `assets/icons/gen-{id}.png`

