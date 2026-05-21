// ============================================
// DEMOCRACIA S.A. V1 — Calidad Democrática
// Fluctuación random con interpolación suave
// Puro teatro, no afecta gameplay
// ============================================

var Calidad = (() => {
  'use strict';

  // ── Estado ──────────────────────────────────────────────────
  var valorActual = 62;       // porcentaje mostrado (se interpola)
  var valorTarget = 62;       // hacia dónde se mueve
  var velocidadLerp = 0.08;   // qué tan rápido se acerca al target (0-1)
  var timerCambio = 0;        // ticks hasta próximo cambio de target
  var intervaloCambio = 150;  // ticks entre cambios de target (~15s a 100ms)

  // Comentarios según rango
  var comentarios = {
    rojo: [
      '"La democracia está en terapia intensiva."',
      '"No hay democracy. HayDemocrancy."',
      '"Si esto es democracia,想象 el resto."',
      '"Peligrando, peligrando..."',
    ],
    naranja: [
      '"La democracia está con gripecita, pero no es grave."',
      '"Se mecieron pero no cayeron."',
      '"Inestable como el dólar."',
      '"Tirando para el costado del abismo."',
    ],
    amarillo: [
      '"Medio mejor, medio peor."',
      '"Funciona, más o menos."',
      '"Como el colectivo: llega, pero tarde."',
      '"Ni bien ni mal, como siempre."',
    ],
    verde: [
      '"La democracia está de fiesta."',
      '"Todo normal, nada que ver."',
      '"Pulcritud institucional."',
      '"Funciona tan bien que da sospecha."',
    ],
  };

  var comentarioActual = '';

  // ── DOM refs ────────────────────────────────────────────────
  var $fill = null;
  var $value = null;
  var $comment = null;

  // ── Init ────────────────────────────────────────────────────
  function init() {
    $fill = document.getElementById('calidad-fill');
    $value = document.getElementById('calidad-value');
    $comment = document.getElementById('calidad-comment');

    // Estado inicial
    valorActual = 50 + Math.random() * 30; // 50-80%
    valorTarget = valorActual;
    actualizarVisual();

    // Generar primer comentario
    setComentario(getRango(valorActual));
  }

  // ── Tick (se llama desde el game loop) ──────────────────────
  function tick() {
    // Decidir si cambiar target
    timerCambio++;
    if (timerCambio >= intervaloCambio) {
      timerCambio = 0;
      cambiarTarget();
    }

    // Interpolar valor actual hacia target
    var diff = valorTarget - valorActual;
    if (Math.abs(diff) > 0.1) {
      valorActual += diff * velocidadLerp;

      // Clamp
      valorActual = Math.max(1, Math.min(100, valorActual));

      // Actualizar visual
      actualizarVisual();

      // Cambiar comentario si cambió de rango
      var nuevoRango = getRango(valorActual);
      if (!comentarioActual || getRangoTexto(comentarioActual) !== nuevoRango) {
        // Solo cambiar si el valor lleva un rato en el nuevo rango
        if (Math.abs(diff) < 5) {
          setComentario(nuevoRango);
        }
      }
    }
  }

  // ── Cambiar target aleatoriamente ──────────────────────────
  function cambiarTarget() {
    // Cambio entre -15 y +15, pero nunca fuera de 5-98
    var delta = (Math.random() - 0.45) * 30; // ligeramente sesgado a bajar
    valorTarget = valorActual + delta;
    valorTarget = Math.max(5, Math.min(98, valorTarget));

    // Variar velocidad (a veces rápido, a veces lento — más impredecible)
    velocidadLerp = 0.03 + Math.random() * 0.1;

    // Variar intervalo de próximo cambio
    intervaloCambio = 80 + Math.floor(Math.random() * 200); // 8-28s
  }

  // ── Determinar rango ───────────────────────────────────────
  function getRango(valor) {
    if (valor <= 30) return 'rojo';
    if (valor <= 50) return 'naranja';
    if (valor <= 75) return 'amarillo';
    return 'verde';
  }

  function getRangoTexto(rango) {
    return rango;
  }

  // ── Elegir comentario random del rango ─────────────────────
  function setComentario(rango) {
    var lista = comentarios[rango];
    if (!lista || lista.length === 0) return;

    var nuevo;
    // Elegir uno distinto al actual
    do {
      nuevo = lista[Math.floor(Math.random() * lista.length)];
    } while (nuevo === comentarioActual && lista.length > 1);

    if ($comment) {
      $comment.style.opacity = '0';
      setTimeout(function () {
        $comment.textContent = nuevo;
        $comment.style.opacity = '1';
      }, 300);
    }
    comentarioActual = nuevo;
  }

  // ── Actualizar DOM ─────────────────────────────────────────
  function actualizarVisual() {
    var valor = Math.round(valorActual);
    var rango = getRango(valorActual);

    // Barra
    if ($fill) {
      $fill.style.width = valor + '%';
      $fill.className = 'stat-nacional-fill rango-' + rango;
    }

    // Número
    if ($value) {
      $value.textContent = valor + '%';
      $value.className = 'stat-nacional-value rango-' + rango;
    }
  }

  // ── API pública ────────────────────────────────────────────
  return {
    init: init,
    tick: tick,
  };

})();
