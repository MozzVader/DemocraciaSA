// ============================================
// DEMOCRACIA S.A. V1 — Lluvia de Billetes
// Dos layers: fondo (PPS) y frente (clicks)
// Efecto hoja: caída + rotación + vaivén
// ============================================

var Billetes = (() => {
  'use strict';

  // ── Config ──────────────────────────────────────────────────────
  var BILLETES = [
    'assets/billetes/billete-0.png',
    'assets/billetes/billete-1.png',
    'assets/billetes/billete-2.png',
  ];

  var MAX_BILLETES_BACK = 25;    // max billetes simultáneos en fondo
  var MAX_BILLETES_FRONT = 15;   // max billetes simultáneos en frente

  // ── Estado ──────────────────────────────────────────────────────
  var $containerBack = null;
  var $containerFront = null;
  var $panelCenter = null;
  var acumBack = 0;              // acumulador para spawn de fondo
  var billetesBack = [];
  var billetesFront = [];

  // ── Init ────────────────────────────────────────────────────────
  function init() {
    $containerBack = document.getElementById('billetes-back');
    $containerFront = document.getElementById('billetes-front');
    $panelCenter = document.getElementById('panel-center');
  }

  // ── Tick (desde game loop, 10x/seg) ─────────────────────────────
  function tick(pps) {
    // Layer de fondo basado en PPS
    if (pps > 0) {
      // Cada billete "vale" cierta cantidad de PPS
      // A más PPS, más frecuentes los billetes
      var frecuencia = Math.min(pps / 50, 15); // 0 a 15 billetes/seg
      acumBack += frecuencia * 0.1; // 0.1s por tick

      while (acumBack >= 1 && billetesBack.length < MAX_BILLETES_BACK) {
        acumBack -= 1;
        spawnBillete('back');
      }
      // Clamp acumulador para no explotar
      if (acumBack > 3) acumBack = 3;
    }
  }

  // ── Spawn por click (layer frontal) ─────────────────────────────
  function spawnClick(cantidad) {
    // 2 a 4 billetes por click
    var n = 2 + Math.floor(Math.random() * 3);
    for (var i = 0; i < n; i++) {
      if (billetesFront.length < MAX_BILLETES_FRONT) {
        spawnBillete('front', cantidad);
      }
    }
  }

  // ── Crear billete individual ────────────────────────────────────
  function spawnBillete(layer, clickPower) {
    var esFrente = (layer === 'front');
    var $container = esFrente ? $containerFront : $containerBack;
    if (!$container || !$panelCenter) return;

    var panelRect = $panelCenter.getBoundingClientRect();
    var panelW = panelRect.width;

    // Elegir imagen random
    var imgSrc = BILLETES[Math.floor(Math.random() * BILLETES.length)];

    // Crear elemento
    var el = document.createElement('img');
    el.src = imgSrc;
    el.className = 'billete billete-' + layer;
    el.draggable = false;
    el.alt = '';

    // Si no carga la imagen (todavía no existe), crear placeholder
    el.onerror = function() {
      this.style.display = 'none';
    };

    // Props random
    var size = esFrente ? 48 : 32;
    var x = Math.random() * (panelW - size);
    var duracion = esFrente ? (2.5 + Math.random() * 2) : (3.5 + Math.random() * 3);
    var rotacionFinal = (Math.random() - 0.5) * 720; // grados
    var rotacionInicio = (Math.random() - 0.5) * 180;
    var swingAmplitud = 20 + Math.random() * 40;
    var swingFreq = 1 + Math.random() * 2;
    var delay = Math.random() * 0.3;

    // Altura del panel (para calcular el fade-out antes del fondo)
    var panelH = panelRect.height;
    var fadeZone = 80; // px antes del fondo donde empieza a desaparecer

    // Aplicar estilos iniciales
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.left = x + 'px';
    el.style.top = '-40px';
    el.style.opacity = esFrente ? '0.9' : '0.4';

    $container.appendChild(el);

    // Registrar
    var registro = { el: el, startTime: performance.now(), duracion: duracion * 1000 };
    if (esFrente) {
      billetesFront.push(registro);
    } else {
      billetesBack.push(registro);
    }

    // Animar con requestAnimationFrame
    var startTime = performance.now() + (delay * 1000);

    function animar(now) {
      var t = (now - startTime) / (duracion * 1000);
      if (t < 0) {
        // Aún en delay
        requestAnimationFrame(animar);
        return;
      }
      if (t >= 1) {
        // Terminado — remover
        removerBillete(registro, esFrente);
        return;
      }

      // Progresión suave (ease-in para caída)
      var easeT = t * t * (3 - 2 * t); // smoothstep

      // Caída (Y)
      var y = easeT * (panelH + 40);

      // Vaivén lateral (sinusoide)
      var swing = Math.sin(t * Math.PI * 2 * swingFreq) * swingAmplitud * (1 - t * 0.5);

      // Rotación
      var rot = rotacionInicio + (rotacionFinal - rotacionInicio) * easeT;

      // Fade-out cerca del fondo
      var opacidad = esFrente ? 0.9 : 0.4;
      var fadeStart = 1 - (fadeZone / (panelH + 40));
      if (t > fadeStart) {
        var fadeT = (t - fadeStart) / (1 - fadeStart);
        opacidad *= (1 - fadeT);
      }

      // Aplicar transform
      el.style.transform = 'translateX(' + swing + 'px) translateY(' + y + 'px) rotate(' + rot + 'deg)';
      el.style.opacity = Math.max(0, opacidad);

      requestAnimationFrame(animar);
    }

    requestAnimationFrame(animar);
  }

  // ── Remover billete del DOM y del registro ──────────────────────
  function removerBillete(registro, esFrente) {
    if (registro.el && registro.el.parentNode) {
      registro.el.parentNode.removeChild(registro.el);
    }
    if (esFrente) {
      var idx = billetesFront.indexOf(registro);
      if (idx !== -1) billetesFront.splice(idx, 1);
    } else {
      var idx2 = billetesBack.indexOf(registro);
      if (idx2 !== -1) billetesBack.splice(idx2, 1);
    }
  }

  // ── Limpiar todo (para reset) ───────────────────────────────────
  function limpiar() {
    billetesBack.forEach(function(r) {
      if (r.el && r.el.parentNode) r.el.parentNode.removeChild(r.el);
    });
    billetesFront.forEach(function(r) {
      if (r.el && r.el.parentNode) r.el.parentNode.removeChild(r.el);
    });
    billetesBack = [];
    billetesFront = [];
    acumBack = 0;
  }

  // ── API pública ────────────────────────────────────────────────
  return {
    init: init,
    tick: tick,
    spawnClick: spawnClick,
    limpiar: limpiar,
  };

})();
