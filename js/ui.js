// ============================================
// DEMOCRACIA S.A. V1 — UI Module
// Modals, mobile tabs, news ticker
// ============================================

(function () {
  'use strict';

  // ---- Mobile Tabs ----

  const mobileTabs = document.getElementById('mobile-tabs');
  const panels = {
    generators: document.getElementById('panel-generators'),
    center: document.getElementById('panel-center'),
    upgrades: document.getElementById('panel-upgrades'),
  };

  if (mobileTabs) {
    mobileTabs.addEventListener('click', (e) => {
      const tab = e.target.closest('.mobile-tab');
      if (!tab) return;

      const panelName = tab.dataset.panel;

      // Update tabs
      mobileTabs.querySelectorAll('.mobile-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      // Update panels
      Object.entries(panels).forEach(([name, el]) => {
        if (el) {
          el.classList.toggle('mobile-active', name === panelName);
        }
      });
    });
  }

  // Activate first panel on mobile
  if (panels.generators && window.innerWidth < 768) {
    panels.generators.classList.add('mobile-active');
  }

  // ---- Modals ----

  function openModal(id) {
    const overlay = document.getElementById(id);
    if (overlay) {
      overlay.classList.add('open');
    }
  }

  function closeModal(id) {
    const overlay = document.getElementById(id);
    if (overlay) {
      overlay.classList.remove('open');
    }
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-overlay.open').forEach((m) => {
      m.classList.remove('open');
    });
  }

  // Open buttons: data-modal="modal-id"
  document.querySelectorAll('[data-modal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modalId = 'modal-' + btn.dataset.modal;
      openModal(modalId);
    });
  });

  // Close buttons: data-close="modal-id"
  document.querySelectorAll('[data-close]').forEach((btn) => {
    btn.addEventListener('click', () => {
      closeModal(btn.dataset.close);
    });
  });

  // Click backdrop to close
  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
      }
    });
  });

  // Escape key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // Special: Login button opens login modal
  const btnLogin = document.getElementById('btn-login');
  if (btnLogin) {
    btnLogin.addEventListener('click', () => openModal('modal-login'));
  }

  // Special: Reset button opens reset modal
  const btnReset = document.getElementById('btn-reset');
  if (btnReset) {
    btnReset.addEventListener('click', () => openModal('modal-reset'));
  }

  // ---- Quantity Selector ----

  document.querySelectorAll('.quantity-selector').forEach((selector) => {
    selector.addEventListener('click', (e) => {
      const btn = e.target.closest('.qty-btn');
      if (!btn) return;

      selector.querySelectorAll('.qty-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ---- News Ticker ----

  const headlines = [
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
    '"Referente asegura que el pa\u00eds necesita di\u00e1logo, pero no \'con esos\'."',
    '"Economista heterodoxo explica que emitir no genera inflaci\u00f3n \'si se hace con cari\u00f1o\'."',
  ];

  const tickerEl = document.getElementById('ticker-headline');
  let currentHeadline = 0;

  if (tickerEl) {
    setInterval(() => {
      let next;
      do {
        next = Math.floor(Math.random() * headlines.length);
      } while (next === currentHeadline && headlines.length > 1);
      currentHeadline = next;

      tickerEl.style.opacity = '0';
      setTimeout(() => {
        tickerEl.textContent = headlines[currentHeadline];
        tickerEl.style.opacity = '1';
      }, 300);
    }, 8000);
  }

  // ---- Responsive: handle resize ----

  let isDesktop = window.innerWidth >= 768;

  function handleResize() {
    const wasDesktop = isDesktop;
    isDesktop = window.innerWidth >= 768;

    if (wasDesktop !== isDesktop) {
      if (isDesktop) {
        // Desktop: show all panels, remove mobile-active
        Object.values(panels).forEach((el) => {
          if (el) el.classList.remove('mobile-active');
        });
      } else {
        // Mobile: activate the currently selected tab
        const activeTab = mobileTabs?.querySelector('.mobile-tab.active');
        const panelName = activeTab?.dataset.panel || 'generators';
        Object.entries(panels).forEach(([name, el]) => {
          if (el) {
            el.classList.toggle('mobile-active', name === panelName);
          }
        });
      }
    }
  }

  window.addEventListener('resize', handleResize);

})();
