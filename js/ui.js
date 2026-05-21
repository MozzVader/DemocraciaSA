// ============================================
// DEMOCRACIA S.A. V1 — UI Module
// Render dinámico, modals, mobile tabs, ticker
// ============================================

var UI = (() => {
  'use strict';

  // ── Referencias DOM ───────────────────────────────────────────
  var $genBody = null;     // .panel-body (dentro de panel-generators)
  var $moneyAmount = null; // .money-amount
  var $moneyRate = null;   // .money-rate
  var $infoMoney = null;   // .info-money (container para notation toast)

  // Cache de cards renderizadas por id de generador
  var genCards = {};

  // Notación toast cooldown (para no spam)
  var notationToastTimer = null;

  // ── Init ──────────────────────────────────────────────────────
  function init() {
    $genBody = document.getElementById('gen-list');
    $moneyAmount = document.getElementById('money-amount');
    $moneyRate = document.querySelector('.money-rate');
    $infoMoney = document.querySelector('.info-money');

    // NOTA: renderGeneradores() se llama DESPUÉS de Game.init() en init.js
    setupModals();
    setupMobileTabs();  // este llama a setupResize(panels) internamente
    setupNewsTicker();
    setupNotationClick();
    setupOpciones();
  }

  // ── Render de Generadores ─────────────────────────────────────
  function renderGeneradores() {
    if (!$genBody) return;

    var generadores = Game.getGeneradores();
    $genBody.innerHTML = '';

    for (var i = 0; i < generadores.length; i++) {
      var gen = generadores[i];
      var card = crearGenCard(gen);
      $genBody.appendChild(card);
      genCards[gen.id] = card;
    }
  }

  function crearGenCard(gen) {
    var card = document.createElement('div');
    card.className = 'gen-card';
    card.dataset.id = gen.id;

    if (!gen.revelado) {
      card.classList.add('hidden');
    }

    card.innerHTML =
      '<div class="gen-icon">' + gen.icono + '</div>' +
      '<div class="gen-info">' +
        '<div class="gen-top">' +
          '<span class="gen-name">' + gen.nombre + '</span>' +
          '<span class="gen-count">0</span>' +
        '</div>' +
        '<p class="gen-desc">' + gen.desc + '</p>' +
        '<div class="gen-bottom">' +
          '<span class="gen-cost"></span>' +
          '<span class="gen-output"></span>' +
        '</div>' +
      '</div>';

    // Click para comprar
    card.addEventListener('click', function () {
      Game.comprar(gen.id);
    });

    return card;
  }

  // ── Actualizar UI (se llama cada segundo) ────────────────────
  function actualizar() {
    var generadores = Game.getGeneradores();
    var pesos = Game.getPesos();
    var pps = Formulas.ppsTotal(generadores);
    var cantidadCompra = Game.getCantidadCompra();

    // Dinero principal
    if ($moneyAmount) {
      $moneyAmount.textContent = '$ ' + Formato.numero(pesos);
    }

    // Rate
    if ($moneyRate) {
      var clickPower = Game.getPesosPorClic();
      $moneyRate.textContent = '+' + Formato.numero(pps) + '/s \u00B7 ' + clickPower + '/click';
    }

    // Actualizar cada card
    for (var i = 0; i < generadores.length; i++) {
      var gen = generadores[i];
      var card = genCards[gen.id];
      if (!card) continue;

      // Visibilidad (gate)
      if (!gen.revelado && pesos >= gen.precioBase) {
        gen.revelado = true;
      }
      if (!gen.revelado) {
        card.classList.add('hidden');
        continue;
      }
      card.classList.remove('hidden');

      // Cantidad
      var $count = card.querySelector('.gen-count');
      if ($count) $count.textContent = gen.cantidad;

      // Precio y PPS según selector
      var $cost = card.querySelector('.gen-cost');
      var $output = card.querySelector('.gen-output');

      var qty = cantidadCompra;
      if (qty === -1) {
        qty = Formulas.maxComprable(gen, pesos);
        if (qty === 0) qty = 1; // mostrar precio de 1 si no puede comprar
      }

      var precio = Formulas.precioLote(gen, qty);
      var puedeComprar = pesos >= Formulas.precioLote(gen, getCantidadReal(gen, cantidadCompra, pesos));

      if ($cost) {
        $cost.textContent = '$ ' + Formato.numero(precio);
      }
      if ($output) {
        var ppsGen = gen.ppsBase * qty;
        $output.textContent = '+' + Formato.numero(ppsGen) + '/s';
      }

      // Estado visual
      if (puedeComprar) {
        card.classList.add('can-afford');
      } else {
        card.classList.remove('can-afford');
      }
    }
  }

  /**
   * Calcula la cantidad real que se compraría (para check de can-afford).
   */
  function getCantidadReal(gen, cantidadCompra, pesos) {
    if (cantidadCompra === -1) {
      return Formulas.maxComprable(gen, pesos);
    }
    return cantidadCompra;
  }

  // ── Click en money-amount para ciclar notación ───────────────
  function setupNotationClick() {
    if (!$moneyAmount) return;

    $moneyAmount.addEventListener('click', function () {
      var notaciones = ['corta', 'larga', 'cientifica'];
      var actual = Formato.getNotacion();
      var idx = notaciones.indexOf(actual);
      var siguiente = notaciones[(idx + 1) % notaciones.length];

      Formato.setNotacion(siguiente);
      syncNotationRadios();
      showNotationToast(siguiente);
      UI.actualizar();
    });
  }

  /** Muestra un toast brevemente con el nombre de la notación */
  function showNotationToast(notacion) {
    if (!$infoMoney) return;

    // Remover toast anterior si existe
    var prev = $infoMoney.querySelector('.notation-toast');
    if (prev) prev.remove();

    var nombres = { corta: 'Corta', larga: 'Larga', cientifica: 'Científica' };
    var toast = document.createElement('span');
    toast.className = 'notation-toast';
    toast.textContent = nombres[notacion] || notacion;
    $infoMoney.appendChild(toast);

    // Auto-remover después de la animación
    setTimeout(function () {
      if (toast.parentNode) toast.remove();
    }, 1500);
  }

  /** Sincroniza los radio buttons con la notación actual */
  function syncNotationRadios() {
    var actual = Formato.getNotacion();
    var radios = document.querySelectorAll('input[name="notacion"]');
    for (var i = 0; i < radios.length; i++) {
      radios[i].checked = (radios[i].value === actual);
    }
  }

  // ── Modal de Opciones ─────────────────────────────────────────
  function setupOpciones() {
    // Botón ⚙️ del header
    var btnSettings = document.getElementById('btn-settings');
    if (btnSettings) {
      btnSettings.addEventListener('click', function () {
        syncNotationRadios();
        openModal('modal-opciones');
      });
    }

    // Radio buttons de notación
    var radios = document.querySelectorAll('input[name="notacion"]');
    for (var i = 0; i < radios.length; i++) {
      radios[i].addEventListener('change', function () {
        Formato.setNotacion(this.value);
        UI.actualizar();
      });
    }

    // Guardar
    var optGuardar = document.getElementById('opt-guardar');
    if (optGuardar) {
      optGuardar.addEventListener('click', function () {
        Save.save();
        optGuardar.textContent = '✓ Guardado';
        optGuardar.style.color = '#4ade80';
        setTimeout(function () {
          optGuardar.textContent = 'Guardar juego';
          optGuardar.style.color = '';
        }, 1500);
      });
    }

    // Exportar save (usa prompt como Cookie Clicker — 100% confiable)
    var optExportar = document.getElementById('opt-exportar');
    if (optExportar) {
      optExportar.addEventListener('click', function () {
        var raw = localStorage.getItem('democracia_sa_save') || '';
        if (!raw) {
          optExportar.textContent = '✗ No hay datos para exportar';
          optExportar.style.color = '#ef4444';
          setTimeout(function () {
            optExportar.textContent = 'Exportar save';
            optExportar.style.color = '';
          }, 2000);
          return;
        }
        prompt('Copiá todo el texto de acá abajo:', raw);
      });
    }

    // Importar save
    var optImportar = document.getElementById('opt-importar');
    if (optImportar) {
      optImportar.addEventListener('click', function () {
        var saveStr = prompt('Pegá acá tu save exportado:');
        if (!saveStr || !saveStr.trim()) return;
        try {
          var data = JSON.parse(saveStr.trim());
          if (!data || !data.version) throw new Error('Save inválido');
          // Escribir y recargar inmediatamente (sin delay para evitar auto-save)
          localStorage.setItem('democracia_sa_save', JSON.stringify(data));
          location.reload();
        } catch (e) {
          optImportar.textContent = '✗ Save inválido';
          optImportar.style.color = '#ef4444';
          setTimeout(function () {
            optImportar.textContent = 'Importar save';
            optImportar.style.color = '';
          }, 2000);
        }
      });
    }

    // Reiniciar (abre el modal de confirmación)
    var optReiniciar = document.getElementById('opt-reiniciar');
    if (optReiniciar) {
      optReiniciar.addEventListener('click', function () {
        closeModal('modal-opciones');
        openModal('modal-reset');
      });
    }
  }

  // ── Modals ────────────────────────────────────────────────────
  function setupModals() {
    // Open: data-modal="modal-id"
    document.querySelectorAll('[data-modal]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openModal('modal-' + btn.dataset.modal);
      });
    });

    // Close: data-close="modal-id"
    document.querySelectorAll('[data-close]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        closeModal(btn.dataset.close);
      });
    });

    // Click backdrop
    document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
          overlay.classList.remove('open');
        }
      });
    });

    // Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(function (m) {
          m.classList.remove('open');
        });
      }
    });

    // Confirm reset button (dentro del modal)
    var btnConfirmReset = document.querySelector('#modal-reset .btn-danger');
    if (btnConfirmReset) {
      btnConfirmReset.addEventListener('click', function () {
        Game.resetJuego();
        closeModal('modal-reset');
      });
    }
  }

  function openModal(id) {
    var el = document.getElementById(id);
    if (el) el.classList.add('open');
  }

  function closeModal(id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove('open');
  }

  // ── Mobile Tabs ───────────────────────────────────────────────
  function setupMobileTabs() {
    var mobileTabs = document.getElementById('mobile-tabs');
    var panels = {
      generators: document.getElementById('panel-generators'),
      center: document.getElementById('panel-center'),
      upgrades: document.getElementById('panel-upgrades'),
    };

    if (mobileTabs) {
      mobileTabs.addEventListener('click', function (e) {
        var tab = e.target.closest('.mobile-tab');
        if (!tab) return;

        var panelName = tab.dataset.panel;

        mobileTabs.querySelectorAll('.mobile-tab').forEach(function (t) {
          t.classList.remove('active');
        });
        tab.classList.add('active');

        Object.entries(panels).forEach(function (entry) {
          var name = entry[0];
          var el = entry[1];
          if (el) {
            el.classList.toggle('mobile-active', name === panelName);
          }
        });
      });
    }

    // Activate first panel on mobile
    if (panels.generators && window.innerWidth < 1024) {
      panels.generators.classList.add('mobile-active');
    }

    // Resize handler (using the same panels reference)
    setupResize(panels);
  }

  // ── Resize Handler ────────────────────────────────────────────
  function setupResize(panelsParam) {
    if (!panelsParam) return;

    var isDesktop = window.innerWidth >= 1024;

    window.addEventListener('resize', function () {
      var wasDesktop = isDesktop;
      isDesktop = window.innerWidth >= 1024;

      if (wasDesktop !== isDesktop) {
        if (isDesktop) {
          Object.values(panelsParam).forEach(function (el) {
            if (el) el.classList.remove('mobile-active');
          });
        } else {
          var activeTab = document.querySelector('#mobile-tabs .mobile-tab.active');
          var panelName = activeTab ? activeTab.dataset.panel : 'generators';
          Object.entries(panelsParam).forEach(function (entry) {
            var name = entry[0];
            var el = entry[1];
            if (el) {
              el.classList.toggle('mobile-active', name === panelName);
            }
          });
        }
      }
    });
  }

  // ── News Ticker ───────────────────────────────────────────────
  function setupNewsTicker() {
    var headlines = [
      '"Senador pide investigar interferencia extranjera en las elecciones. Su financista es suizo."',
      '"Think Tank revela que bajar impuestos a los ricos genera empleo. Sorpresa: el estudio lo pag\u00f3 un rico."',
      '"El gobernador anuncia plan de transparencia. No incluye su propio financiamiento."',
      '"Consultora pol\u00edtica cobra $5M por manejo de crisis. La crisis es que los pagan demasiado."',
      '"Medio de comunicaci\u00f3n cambia su l\u00ednea editorial. El nuevo due\u00f1o es un amigo de la democracia."',
      '"Funcionario renuncia para trabajar en el sector privado. Al d\u00eda siguiente ingresa a empresa que regulaba."',
      '"La Corte falla 5-4 a favor del financiador del juez que escribi\u00f3 la opini\u00f3n de la mayor\u00eda."',
      '"Diputado aprueba ley de \u00e9tica p\u00fablica. \u00c9l es el primero en violarla."',
      '"Encuesta: el 73% de los ciudadanos conf\u00eda en las instituciones. La encuesta se pag\u00f3 con dinero p\u00fablico."',
      '"Lobby cobra $200/hora por reuniones con legisladores. La reuni\u00f3n dura 5 minutos."',
      '"Nueva auditor\u00eda revela que nadie sabe d\u00f3nde est\u00e1 el dinero, pero todos est\u00e1n de acuerdo en que se gast\u00f3 bien."',
      '"D\u00f3lar blue another day: la brecha ya es m\u00e1s ancha que la 9 de Julio."',
      '"La casta se renueva: cambian las caras, el sueldo y el auto, pero no el sistema."',
      '"Se aprob\u00f3 la ley de medios: ahora los amigos tienen m\u00e1s canales."',
      '"Opinolog\u00eda: dos economistas, tres opiniones, cero soluciones."',
      '"El debate presidencial dur\u00f3 dos horas. Los argentinos siguen esperando desde 1983."',
      '"Inflaci\u00f3n mensual: el gobierno prefiere hablar de inflaci\u00f3n interanual, suena m\u00e1s estable."',
      '"Nuevo aumento de tarifas: la promesa era que iba a bajar, pero qued\u00f3 en que sube menos que antes."',
      '"La oposici\u00f3n present\u00f3 un proyecto. El oficialismo lo aplaudi\u00f3. Nadie lo ley\u00f3."',
      '"Encuesta: el 87% de los argentinos est\u00e1 cansado de las encuestas."',
      '"Expertos recomiendan respirar hondo antes de mirar el resumen de la tarjeta."',
      '"Lanzan curso intensivo para entender promociones del supermercado."',
      '"Referente asegura que el pa\u00eds necesita di\u00e1logo, pero no \'con esos\'.',
      '"Economista heterodoxo explica que emitir no genera inflaci\u00f3n \'si se hace con cari\u00f1o\'.',
    ];

    var tickerEl = document.getElementById('ticker-headline');
    var currentHeadline = 0;

    if (tickerEl) {
      setInterval(function () {
        var next;
        do {
          next = Math.floor(Math.random() * headlines.length);
        } while (next === currentHeadline && headlines.length > 1);
        currentHeadline = next;

        tickerEl.style.opacity = '0';
        setTimeout(function () {
          tickerEl.textContent = headlines[currentHeadline];
          tickerEl.style.opacity = '1';
        }, 300);
      }, 8000);
    }
  }

  // ── API pública ───────────────────────────────────────────────
  return {
    init: init,
    actualizar: actualizar,
    renderGeneradores: renderGeneradores,
  };

})();
