/**
 * quimica.js — Simulador de Química Interactivo
 * Permite seleccionar elementos, combinarlos en el matraz de reacción,
 * explorar el catálogo completo con ecuaciones balanceadas y cargar recetas con 1 clic.
 */
(function () {
  'use strict';

  const ELEMENTS = [
    { symbol: 'H',  name: 'Hidrógeno', color: '#4cc9f0' },
    { symbol: 'O',  name: 'Oxígeno',   color: '#ef476f' },
    { symbol: 'C',  name: 'Carbono',   color: '#adb5bd' },
    { symbol: 'Na', name: 'Sodio',     color: '#ffd166' },
    { symbol: 'Cl', name: 'Cloro',     color: '#06d6a0' },
    { symbol: 'N',  name: 'Nitrógeno', color: '#6c63ff' },
    { symbol: 'Ca', name: 'Calcio',    color: '#ff9f1c' },
    { symbol: 'Fe', name: 'Hierro',    color: '#c77dff' },
  ];

  // Base de datos de reacciones químicas posibles
  const REACTIONS = {
    'H,H,O': {
      formula: 'H₂O',
      name: 'Agua',
      equation: '2H₂ + O₂ → 2H₂O',
      type: 'Enlace Covalente',
      icon: 'fa-droplet',
      elements: ['H', 'H', 'O'],
      desc: 'El solvente universal de la vida. Compone más del 70% de nuestro cuerpo y la Tierra.'
    },
    'H,H': {
      formula: 'H₂',
      name: 'Gas Hidrógeno',
      equation: 'H + H → H₂',
      type: 'Molécula Diatómica',
      icon: 'fa-wind',
      elements: ['H', 'H'],
      desc: 'El gas más liviano y abundante en todo el cosmos. Combustible de estrellas.'
    },
    'O,O': {
      formula: 'O₂',
      name: 'Oxígeno Molecular',
      equation: 'O + O → O₂',
      type: 'Gas Vital',
      icon: 'fa-lungs',
      elements: ['O', 'O'],
      desc: 'Molécula esencial para la respiración aeróbica de la gran mayoría de seres vivos.'
    },
    'Cl,Na': {
      formula: 'NaCl',
      name: 'Cloruro de Sodio (Sal de Mesa)',
      equation: '2Na + Cl₂ → 2NaCl',
      type: 'Enlace Iónico',
      icon: 'fa-cubes-stacked',
      elements: ['Na', 'Cl'],
      desc: 'Cristal iónico clásico formado por un metal electropositivo y un halógeno no metálico.'
    },
    'C,O,O': {
      formula: 'CO₂',
      name: 'Dióxido de Carbono',
      equation: 'C + O₂ → CO₂',
      type: 'Combustión / Oxidación',
      icon: 'fa-cloud',
      elements: ['C', 'O', 'O'],
      desc: 'Producto de la respiración celular y la combustión. Materia prima de la fotosíntesis.'
    },
    'C,O': {
      formula: 'CO',
      name: 'Monóxido de Carbono',
      equation: '2C + O₂ → 2CO',
      type: 'Combustión Incompleta',
      icon: 'fa-triangle-exclamation',
      elements: ['C', 'O'],
      desc: 'Gas incoloro, inodoro y altamente tóxico que compite con el oxígeno en la hemoglobina.'
    },
    'N,N': {
      formula: 'N₂',
      name: 'Nitrógeno Molecular',
      equation: 'N + N → N₂',
      type: 'Triple Enlace Covalente',
      icon: 'fa-wind',
      elements: ['N', 'N'],
      desc: 'Constituye aproximadamente el 78% del aire que respiramos. Enlace triple muy fuerte.'
    },
    'H,O,O': {
      formula: 'H₂O₂',
      name: 'Peróxido de Hidrógeno (Agua Oxigenada)',
      equation: 'H₂ + O₂ → H₂O₂',
      type: 'Oxidante / Desinfectante',
      icon: 'fa-flask',
      elements: ['H', 'O', 'O'],
      desc: 'Líquido oxidante utilizado como antiséptico y agente blanqueador.'
    },
    'Ca,O': {
      formula: 'CaO',
      name: 'Óxido de Calcio (Cal Viva)',
      equation: '2Ca + O₂ → 2CaO',
      type: 'Óxido Básico',
      icon: 'fa-cube',
      elements: ['Ca', 'O'],
      desc: 'Reacciona intensamente con agua liberando gran cantidad de calor (cal apagada).'
    },
    'H,H,H,N': {
      formula: 'NH₃',
      name: 'Amoníaco',
      equation: 'N₂ + 3H₂ → 2NH₃',
      type: 'Base / Síntesis Haber',
      icon: 'fa-smog',
      elements: ['N', 'H', 'H', 'H'],
      desc: 'Compuesto nitrogenado fundamental en la producción mundial de fertilizantes agrícolas.'
    },
    'C,H,H,H,H': {
      formula: 'CH₄',
      name: 'Metano',
      equation: 'C + 2H₂ → CH₄',
      type: 'Hidrocarburo Alcano',
      icon: 'fa-fire',
      elements: ['C', 'H', 'H', 'H', 'H'],
      desc: 'El hidrocarburo más simple. Principal componente del gas natural usado en hogares.'
    },
    'Fe,O,O,O': {
      formula: 'Fe₂O₃',
      name: 'Óxido de Hierro III (Herrumbre)',
      equation: '4Fe + 3O₂ → 2Fe₂O₃',
      type: 'Oxidación Metálica',
      icon: 'fa-circle-dot',
      elements: ['Fe', 'O', 'O', 'O'],
      desc: 'Pigmento pardo-rojizo que se forma cuando el hierro se expone al oxígeno y la humedad.'
    },
    'Cl,H': {
      formula: 'HCl',
      name: 'Ácido Clorhídrico',
      equation: 'H₂ + Cl₂ → 2HCl',
      type: 'Ácido Fuerte',
      icon: 'fa-vial-virus',
      elements: ['H', 'Cl'],
      desc: 'Ácido muy corrosivo presente en nuestro jugo gástrico para la digestión de proteínas.'
    },
    'Ca,Cl,Cl': {
      formula: 'CaCl₂',
      name: 'Cloruro de Calcio',
      equation: 'Ca + Cl₂ → CaCl₂',
      type: 'Sal Higroscópica',
      icon: 'fa-snowflake',
      elements: ['Ca', 'Cl', 'Cl'],
      desc: 'Sal que absorbe agua del ambiente con facilidad; se usa para derretir hielo en carreteras.'
    },
    'Cl,Cl': {
      formula: 'Cl₂',
      name: 'Gas Dicloro',
      equation: 'Cl + Cl → Cl₂',
      type: 'Halógeno Reactivo',
      icon: 'fa-biohazard',
      elements: ['Cl', 'Cl'],
      desc: 'Gas amarillo-verdoso altamente oxidante, usado para potabilizar agua y blanquear papel.'
    }
  };

  let selected = [];
  const discovered = new Set();

  let $grid, $flaskSelected, $result, $formula, $name, $desc, $history, $catalogGrid, $catalogSearch, $flaskZone;

  function renderElements() {
    $grid.innerHTML = '';
    ELEMENTS.forEach(el => {
      const btn = document.createElement('button');
      btn.className = 'element-btn';
      btn.setAttribute('aria-label', `Agregar ${el.name}`);
      btn.innerHTML = `
        <span class="el-symbol" style="color:${el.color}">${el.symbol}</span>
        <span class="el-name">${el.name}</span>
        <span class="el-count" id="qcount-${el.symbol}"></span>`;
      btn.addEventListener('click', () => addElement(el.symbol));
      $grid.appendChild(btn);
    });
  }

  function addElement(symbol) {
    if (selected.length >= 6) return;
    selected.push(symbol);
    updateFlask();
  }

  function updateFlask() {
    $flaskSelected.innerHTML = '';
    if (!selected.length) {
      $flaskSelected.innerHTML = '<span class="placeholder-text">Haz clic en los elementos para agregarlos</span>';
    } else {
      selected.forEach((sym, i) => {
        const tag = document.createElement('span');
        tag.className = 'element-tag';
        tag.textContent = sym;
        tag.title = 'Clic para quitar';
        tag.addEventListener('click', () => {
          selected.splice(i, 1);
          updateFlask();
          $result.hidden = true;
        });
        $flaskSelected.appendChild(tag);
      });
    }

    ELEMENTS.forEach(el => {
      const c = document.getElementById(`qcount-${el.symbol}`);
      if (!c) return;
      const n = selected.filter(s => s === el.symbol).length;
      c.textContent = n > 0 ? `×${n}` : '';
    });
  }

  function react() {
    if (!selected.length) return;

    // Efecto visual interactivo en el matraz
    if ($flaskZone) {
      $flaskZone.classList.remove('reacting');
      void $flaskZone.offsetWidth; // Reflow para reiniciar animación
      $flaskZone.classList.add('reacting');
      setTimeout(() => $flaskZone.classList.remove('reacting'), 700);
    }

    const key = [...selected].sort().join(',');
    const rxn = REACTIONS[key];

    if (rxn) {
      $formula.innerHTML = `<i class="fa-solid ${rxn.icon}"></i> ${rxn.formula}`;
      $name.textContent  = rxn.name;
      $desc.innerHTML    = `<strong>Ecuación:</strong> <span class="mono">${rxn.equation}</span><br>${rxn.desc}`;
      $result.hidden     = false;

      if (!discovered.has(key)) {
        discovered.add(key);
        addToHistory(rxn);
      }
    } else {
      $formula.innerHTML = '<i class="fa-solid fa-question"></i> Sin reacción';
      $name.textContent  = 'Combinación desconocida';
      $desc.textContent  = '¡Sigue explorando! Los elementos en estas proporciones no forman un compuesto estable en este simulador. Revisa el catálogo abajo para descubrir las recetas válidas.';
      $result.hidden     = false;
    }
  }

  function addToHistory(rxn) {
    const empty = $history.querySelector('.empty-state');
    if (empty) empty.remove();

    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `<i class="fa-solid ${rxn.icon}"></i><span class="history-formula">${rxn.formula}</span><span>${rxn.name}</span>`;
    $history.prepend(item);
  }

  function clearFlask() {
    selected = [];
    updateFlask();
    $result.hidden = true;
    ELEMENTS.forEach(el => {
      const c = document.getElementById(`qcount-${el.symbol}`);
      if (c) c.textContent = '';
    });
  }

  // Cargar una receta automáticamente al matraz y simularla
  function loadRecipe(elementsList) {
    selected = [...elementsList];
    updateFlask();
    react();
    // Desplazar suavemente hacia el matraz en pantallas pequeñas
    if (window.innerWidth < 900) {
      document.querySelector('.chem-lab')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Renderizar el catálogo completo de reacciones químicas
  function renderCatalog(filterText = '') {
    if (!$catalogGrid) return;
    $catalogGrid.innerHTML = '';

    const query = filterText.toLowerCase().trim();
    const rxnList = Object.values(REACTIONS);

    const filtered = rxnList.filter(rxn => {
      if (!query) return true;
      return rxn.name.toLowerCase().includes(query) ||
             rxn.formula.toLowerCase().includes(query) ||
             rxn.type.toLowerCase().includes(query) ||
             rxn.equation.toLowerCase().includes(query);
    });

    if (filtered.length === 0) {
      $catalogGrid.innerHTML = '<p class="empty-state" style="grid-column:1/-1;">No se encontraron reacciones para esa búsqueda.</p>';
      return;
    }

    filtered.forEach(rxn => {
      const card = document.createElement('div');
      card.className = 'catalog-card';
      card.innerHTML = `
        <div class="catalog-card-header">
          <span class="catalog-formula">${rxn.formula}</span>
          <span class="catalog-type-badge">${rxn.type}</span>
        </div>
        <div class="catalog-name">${rxn.name}</div>
        <div class="catalog-eq">${rxn.equation}</div>
        <div class="catalog-desc">${rxn.desc}</div>
        <button class="btn-load-recipe">
          <i class="fa-solid fa-flask-vial"></i> Cargar en matraz (${rxn.elements.join(' + ')})
        </button>
      `;

      card.querySelector('.btn-load-recipe').addEventListener('click', () => {
        loadRecipe(rxn.elements);
      });

      $catalogGrid.appendChild(card);
    });
  }

  function init() {
    $grid          = document.getElementById('elementsGrid');
    $flaskSelected = document.getElementById('flaskSelected');
    $result        = document.getElementById('reactionResult');
    $formula       = document.getElementById('resultFormula');
    $name          = document.getElementById('resultName');
    $desc          = document.getElementById('resultDesc');
    $history       = document.getElementById('historyList');
    $catalogGrid   = document.getElementById('catalogGrid');
    $catalogSearch = document.getElementById('catalogSearch');
    $flaskZone     = document.querySelector('.flask-zone');

    renderElements();
    renderCatalog();

    document.getElementById('btnReact').addEventListener('click', react);
    document.getElementById('btnClearChem').addEventListener('click', clearFlask);

    if ($catalogSearch) {
      $catalogSearch.addEventListener('input', e => {
        renderCatalog(e.target.value);
      });
    }
  }

  window.MODULES.quimica = { init };
})();
