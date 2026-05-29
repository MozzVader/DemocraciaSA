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

    // Etapa 0 = oculto
    if (gen.etapa === 0) {
      card.classList.add('hidden');
    }

    // Etapa 1 = misterio ("???" + icono oscuro)
    if (gen.etapa === 1) {
      card.classList.add('gen-mystery');
      card.innerHTML =
        '<div class="gen-icon gen-icon-mystery"><img src="' + gen.icono + '" alt="???" draggable="false"></div>' +
        '<div class="gen-info">' +
          '<div class="gen-top">' +
            '<span class="gen-name">???</span>' +
          '</div>' +
          '<p class="gen-desc">Algo se avecina...</p>' +
          '<div class="gen-bottom">' +
            '<span class="gen-cost">???</span>' +
          '</div>' +
        '</div>';
      // No comprable en etapa misterio
      return card;
    }

    // Etapas 2 y 3 = nombre visible
    card.innerHTML =
      '<div class="gen-icon"><img src="' + gen.icono + '" alt="' + gen.nombre + '" draggable="false"></div>' +
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

    // Click para comprar (solo etapa 3)
    card.addEventListener('click', function () {
      if (gen.etapa >= 3) {
        Game.comprar(gen.id);
      }
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

      // Etapa 0 = oculto
      if (gen.etapa === 0) {
        card.classList.add('hidden');
        card.classList.remove('gen-mystery', 'gen-locked', 'can-afford');
        continue;
      }

      // Transiciones entre etapas visibles
      // Si estaba oculta y pasó a misterio/revelado: re-crear la card
      if (gen.etapa === 1 && !card.classList.contains('gen-mystery')) {
        // Recrear card como misterio
        var newCard = crearGenCard(gen);
        card.parentNode.replaceChild(newCard, card);
        genCards[gen.id] = newCard;
        newCard.classList.remove('hidden');
        continue;
      }
      if (gen.etapa >= 2 && card.classList.contains('gen-mystery')) {
        // Recrear card con nombre visible
        var newCard = crearGenCard(gen);
        card.parentNode.replaceChild(newCard, card);
        genCards[gen.id] = newCard;
        newCard.classList.remove('hidden');
        if (gen.etapa === 2) newCard.classList.add('gen-locked');
        continue;
      }

      card.classList.remove('hidden');

      // Etapa 1 = misterio (ya está renderizada como tal, solo mostrar/ocultar)
      if (gen.etapa === 1) {
        card.classList.add('gen-mystery');
        card.classList.remove('gen-locked', 'can-afford');
        continue;
      }

      card.classList.remove('gen-mystery');

      // Etapa 2 = revelado grisado (no comprable)
      if (gen.etapa === 2) {
        card.classList.add('gen-locked');
        card.classList.remove('can-afford');
        // Mostrar precio
        var $cost2 = card.querySelector('.gen-cost');
        if ($cost2) $cost2.textContent = '$ ' + Formato.numero(gen.precioBase);
        var $output2 = card.querySelector('.gen-output');
        if ($output2) $output2.textContent = '+' + Formato.numero(gen.ppsBase * Formulas.getMult(gen.id)) + '/s';
        continue;
      }

      // Etapa 3 = comprable (comportamiento normal)
      card.classList.remove('gen-locked');

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
        var ppsGen = gen.ppsBase * qty * Formulas.getMult(gen.id);
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

  /** Sincroniza el checkbox de billetes con el estado actual */
  function syncBilletesToggle() {
    var optBilletes = document.getElementById('opt-billetes');
    var panelCenter = document.getElementById('panel-center');
    if (optBilletes && panelCenter) {
      optBilletes.checked = !panelCenter.classList.contains('billetes-off');
    }
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
        syncBilletesToggle();
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

    // Toggle billetes
    var optBilletes = document.getElementById('opt-billetes');
    if (optBilletes) {
      optBilletes.addEventListener('change', function () {
        var panelCenter = document.getElementById('panel-center');
        if (panelCenter) {
          panelCenter.classList.toggle('billetes-off', !this.checked);
        }
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

    // Exportar save (base64 para que no sea trivial editar)
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
        try {
          var encoded = btoa(unescape(encodeURIComponent(raw)));
          prompt('Copiá todo el texto de acá abajo:', encoded);
        } catch (e) {
          // Fallback: exportar como texto plano
          prompt('Copiá todo el texto de acá abajo:', raw);
        }
      });
    }

    // Importar save (decodifica base64, fallback a JSON plano para saves viejos)
    var optImportar = document.getElementById('opt-importar');
    if (optImportar) {
      optImportar.addEventListener('click', function () {
        var saveStr = prompt('Pegá acá tu save exportado:');
        if (!saveStr || !saveStr.trim()) return;
        try {
          var jsonStr;
          // Intentar decodear base64 primero
          try {
            jsonStr = decodeURIComponent(escape(atob(saveStr.trim())));
          } catch (b64err) {
            // No es base64 — intentar JSON directo (saves viejos)
            jsonStr = saveStr.trim();
          }
          var data = JSON.parse(jsonStr);
          if (!data || !data.version) throw new Error('Save inválido');

          // Persistir en localStorage
          localStorage.setItem('democracia_sa_save', JSON.stringify(data));

          // Restaurar en memoria directamente (sin reload)
          if (typeof Game._restore === 'function') {
            Game._restore(data);
          }
          if (data.notacion) {
            Formato.setNotacion(data.notacion);
          }
          // Restaurar estado de billetes al importar
          if (data.billetes === false) {
            var pc = document.getElementById('panel-center');
            if (pc) pc.classList.add('billetes-off');
          } else {
            var pc2 = document.getElementById('panel-center');
            if (pc2) pc2.classList.remove('billetes-off');
          }

          // Re-render y cerrar modal
          UI.renderGeneradores();
          UI.actualizar();

          optImportar.textContent = '✓ Importado';
          optImportar.style.color = '#4ade80';
          setTimeout(function () {
            optImportar.textContent = 'Importar save';
            optImportar.style.color = '';
          }, 2000);
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
    var headlines = NOTICIAS_DATA || [];

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
      }, 12000);
    }
  }

  // ── Offline Notification ──────────────────────────────────────
  function showOfflineNotification(pesosGanados, segundos) {
    // Remover notificación anterior si existe
    var prev = document.querySelector('.offline-notification');
    if (prev) prev.remove();

    var banner = document.createElement('div');
    banner.className = 'offline-notification';
    banner.innerHTML =
      '<span class="offline-icon">&#x1F3DB;&#xFE0F;</span>' +
      '<div class="offline-text">' +
        '<strong>Progreso offline</strong><br>' +
        'Ganaste <span class="offline-money">$ ' + Formato.numero(pesosGanados) + '</span> ' +
        'mientras estuviste ausente ' + Formato.tiempo(segundos) + '.' +
      '</div>' +
      '<button class="offline-close">&times;</button>';

    document.querySelector('.game-wrapper').appendChild(banner);

    // Fade in
    requestAnimationFrame(function () {
      banner.classList.add('visible');
    });

    // Cerrar con botón X
    banner.querySelector('.offline-close').addEventListener('click', function () {
      dismissBanner(banner);
    });

    // Auto-dismiss a los 8 segundos
    setTimeout(function () {
      dismissBanner(banner);
    }, 8000);
  }

  function dismissBanner(banner) {
    if (!banner || !banner.parentNode) return;
    banner.classList.remove('visible');
    banner.classList.add('hiding');
    setTimeout(function () {
      if (banner.parentNode) banner.remove();
    }, 400);
  }

  // ── API pública ───────────────────────────────────────────────
  return {
    init: init,
    actualizar: actualizar,
    renderGeneradores: renderGeneradores,
    showOfflineNotification: showOfflineNotification,
  };

})();
