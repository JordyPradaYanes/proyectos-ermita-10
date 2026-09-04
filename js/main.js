/**
 * ================================================================
 * PORTAL DE CIENCIAS — js/main.js
 * Router SPA: carga cada módulo (HTML + CSS + JS) de forma
 * dinámica cuando el usuario navega al módulo correspondiente.
 * ================================================================
 */
'use strict';

/* Registro global de módulos — cada módulo.js lo pobla */
window.MODULES = {};

/* ── Configuración de los 10 módulos ──────────────────────────── */
const MODULE_CONFIG = {
  quimica:    { title: 'Simulador de Química',        icon: 'fa-flask'            },
  ondas:      { title: 'Simulador de Ondas',           icon: 'fa-wave-square'      },
  cuerpo:     { title: 'Explora el Cuerpo Humano',     icon: 'fa-heart-pulse'      },
  tabla:      { title: 'Tabla Periódica Interactiva',  icon: 'fa-table-cells'      },
  matematica: { title: 'Misión Matemática',             icon: 'fa-calculator'       },
  memoria:    { title: 'Memoria en Inglés',             icon: 'fa-clone'            },
  pitagoras:  { title: 'Teorema de Pitágoras',          icon: 'fa-drafting-compass' },
  trivia:     { title: 'Trivia Multijugador',           icon: 'fa-trophy'           },
  piramide:   { title: 'Pirámide Alimenticia',          icon: 'fa-layer-group'      },
  gravedad:   { title: 'Laboratorio de Gravedad',       icon: 'fa-earth-americas'   },
};

/* ── Estado del router ────────────────────────────────────────── */
let currentModule = null;
const loadedModules = new Set();

/* ── Elementos del DOM del shell ──────────────────────────────── */
const $topbarTitle   = document.getElementById('topbarTitle');
const $sidebar       = document.getElementById('sidebar');
const $overlay       = document.getElementById('sidebarOverlay');
const $menuBtn       = document.getElementById('menuBtn');
const $sidebarToggle = document.getElementById('sidebarToggle');
const $themeToggle   = document.getElementById('themeToggle');
const $moduleContent = document.getElementById('moduleContent');
const $loadingScreen = document.getElementById('loadingScreen');

/* ── FUNCIÓN PRINCIPAL: navegar a un módulo ───────────────────── */
async function navigate(key) {
  if (!MODULE_CONFIG[key]) return;

  // 1. Detener el módulo anterior
  if (currentModule && currentModule !== key) {
    window.MODULES[currentModule]?.stop?.();
  }
  currentModule = key;

  // 2. Actualizar navegación sidebar
  document.querySelectorAll('.nav-btn').forEach(btn => {
    const active = btn.dataset.module === key;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-current', active ? 'page' : 'false');
  });

  // 3. Actualizar título del topbar
  const cfg = MODULE_CONFIG[key];
  $topbarTitle.textContent = cfg.title;

  // 4. Cargar módulo si es la primera vez
  if (!loadedModules.has(key)) {
    showLoading(true);
    await loadModule(key);
    loadedModules.add(key);
    showLoading(false);
    // Llamar init() una única vez por módulo
    window.MODULES[key]?.init?.();
  }

  // 5. Ocultar todos los módulos y mostrar el objetivo
  document.querySelectorAll('.module-container').forEach(m => { m.hidden = true; });
  const target = document.getElementById(`mod-${key}`);
  if (target) target.hidden = false;

  // 6. Activar animaciones/lógica del módulo
  window.MODULES[key]?.start?.();

  // 7. Actualizar URL con hash
  history.pushState({ module: key }, '', `#${key}`);

  // 8. Cerrar sidebar en móvil
  closeSidebar();
}

/* ── Carga dinámica de HTML + CSS + JS de un módulo ──────────── */
async function loadModule(key) {
  const base = `modules/${key}/${key}`;

  // ── HTML: fetch e inyección
  const res = await fetch(`${base}.html`);
  if (!res.ok) throw new Error(`No se pudo cargar ${base}.html`);
  const html = await res.text();

  const wrapper = document.createElement('div');
  wrapper.id        = `mod-${key}`;
  wrapper.className = 'module-container';
  wrapper.hidden    = true;
  wrapper.innerHTML = html;
  $moduleContent.appendChild(wrapper);

  // ── CSS: inyectar <link> si no existe ya
  if (!document.querySelector(`link[data-module="${key}"]`)) {
    const link = document.createElement('link');
    link.rel           = 'stylesheet';
    link.href          = `${base}.css`;
    link.dataset.module = key;
    document.head.appendChild(link);
  }

  // ── JS: inyectar <script> y esperar que cargue
  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src            = `${base}.js`;
    script.dataset.module = key;
    script.onload  = resolve;
    script.onerror = () => reject(new Error(`No se pudo cargar ${base}.js`));
    document.head.appendChild(script);
  });
}

/* ── Helpers ──────────────────────────────────────────────────── */
function showLoading(visible) {
  $loadingScreen.hidden = !visible;
}

function closeSidebar() {
  $sidebar.classList.remove('open');
  $overlay.classList.remove('show');
}

function openSidebar() {
  $sidebar.classList.add('open');
  $overlay.classList.add('show');
}

/* ── Eventos del shell ────────────────────────────────────────── */
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => navigate(btn.dataset.module));
});

$menuBtn.addEventListener('click', openSidebar);
$sidebarToggle.addEventListener('click', closeSidebar);
$overlay.addEventListener('click', closeSidebar);

$themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  const isLight = document.body.classList.contains('light-theme');
  $themeToggle.innerHTML = isLight
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';
});

// Soporte para botón "atrás" del navegador
window.addEventListener('popstate', e => {
  const key = e.state?.module || 'quimica';
  navigate(key);
});

/* ── Carga inicial: leer hash de URL ─────────────────────────── */
const initKey = window.location.hash.replace('#', '');
navigate(MODULE_CONFIG[initKey] ? initKey : 'quimica');
