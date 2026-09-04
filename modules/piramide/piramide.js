/**
 * piramide.js — Pirámide Alimenticia
 */
(function () {
  'use strict';

  const FOODS = [
    { id: 'f1', name: 'Pan', icon: 'fa-bread-slice', level: 4 },
    { id: 'f2', name: 'Arroz', icon: 'fa-bowl-rice', level: 4 },
    { id: 'f3', name: 'Manzana', icon: 'fa-apple-whole', level: 3 },
    { id: 'f4', name: 'Zanahoria', icon: 'fa-carrot', level: 3 },
    { id: 'f5', name: 'Leche', icon: 'fa-glass-water', level: 2 },
    { id: 'f6', name: 'Pescado', icon: 'fa-fish', level: 2 },
    { id: 'f7', name: 'Chocolate', icon: 'fa-cookie-bite', level: 1 },
    { id: 'f8', name: 'Gaseosa', icon: 'fa-bottle-water', level: 1 },
  ];

  let $dragZone, $levels, $btn, $feedback;

  function renderItems() {
    $dragZone.innerHTML = '';
    FOODS.forEach(f => {
      const el = document.createElement('div');
      el.className = 'food-item';
      el.draggable = true;
      el.id = f.id;
      el.dataset.correct = f.level;
      el.innerHTML = `<i class="fa-solid ${f.icon}"></i> ${f.name}`;
      
      el.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', el.id);
        el.classList.add('dragging');
      });
      el.addEventListener('dragend', () => el.classList.remove('dragging'));
      
      $dragZone.appendChild(el);
    });
  }

  function setupDragAndDrop() {
    const dropZones = document.querySelectorAll('.drop-zone');
    const allZones = [...dropZones, $dragZone];

    allZones.forEach(zone => {
      zone.addEventListener('dragover', e => {
        e.preventDefault();
        const parent = zone.closest('.pyr-level');
        if (parent) parent.classList.add('drag-over');
      });
      zone.addEventListener('dragleave', e => {
        const parent = zone.closest('.pyr-level');
        if (parent) parent.classList.remove('drag-over');
      });
      zone.addEventListener('drop', e => {
        e.preventDefault();
        const parent = zone.closest('.pyr-level');
        if (parent) parent.classList.remove('drag-over');
        
        const id = e.dataTransfer.getData('text/plain');
        const item = document.getElementById(id);
        if (item) {
          zone.appendChild(item);
          $feedback.innerHTML = '';
        }
      });
    });
  }

  function check() {
    let allCorrect = true;
    let placed = 0;
    
    document.querySelectorAll('.pyr-level').forEach(lvl => {
      const expected = lvl.dataset.level;
      const items = lvl.querySelectorAll('.food-item');
      items.forEach(item => {
        placed++;
        if (item.dataset.correct !== expected) {
          allCorrect = false;
          item.style.borderColor = 'var(--clr-error)';
          item.style.backgroundColor = 'rgba(239,71,111,0.1)';
        } else {
          item.style.borderColor = 'var(--clr-success)';
          item.style.backgroundColor = 'rgba(6,214,160,0.1)';
        }
      });
    });

    if (placed < FOODS.length) {
      $feedback.style.color = 'var(--clr-warning)';
      $feedback.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Aún faltan alimentos por ubicar.';
    } else if (allCorrect) {
      $feedback.style.color = 'var(--clr-success)';
      $feedback.innerHTML = '<i class="fa-solid fa-check-circle"></i> ¡Excelente! Has armado la pirámide correctamente.';
    } else {
      $feedback.style.color = 'var(--clr-error)';
      $feedback.innerHTML = '<i class="fa-solid fa-xmark"></i> Hay errores. Revisa los elementos marcados en rojo.';
    }
  }

  function init() {
    $dragZone = document.getElementById('pyrDragZone');
    $levels   = document.querySelectorAll('.pyr-level');
    $btn      = document.getElementById('pyrCheckBtn');
    $feedback = document.getElementById('pyrFeedback');

    document.querySelectorAll('.drop-zone').forEach(z => z.innerHTML = '');
    renderItems();
    setupDragAndDrop();
    $btn?.addEventListener('click', check);
  }

  window.MODULES.piramide = { init };
})();
