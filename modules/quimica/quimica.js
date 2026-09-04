/**
 * quimica.js — Simulador de Química Interactivo
 * ¡Bienvenidos al Laboratorio de Química Secreto! 🧪
 * Aquí vamos a mezclar elementos para ver qué pasa. ¡Cuidado con las explosiones!
 */
(function () {
  'use strict';

  // 🧪 ZONA DE HACKEO: ¡Nuevos Elementos!
  // Esta es una lista (Array) de los ingredientes mágicos.
  // Cada ingrediente tiene un símbolo (H), un nombre (Hidrógeno) y un color.
  // ¿Qué pasa si le cambias el color al Hidrógeno? ¡Prueba con '#ff0000' (rojo)!
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

  // 💥 ZONA DE HACKEO: ¡Invéntate una reacción!
  // Este es el recetario del laboratorio (un "Objeto" de JavaScript).
  // Si mezclas 'H,H,O' sale Agua. 
  // ¡Crea tu propia receta copiando una y cambiando la mezcla!
  const REACTIONS = {
    'H,H,O': {
      formula: 'H₂O',
      name: 'Agua',
      equation: '2H₂ + O₂ → 2H₂O',
      type: 'Enlace Covalente',
      icon: 'fa-droplet', // Este es un icono (una gotita)
      elements: ['H', 'H', 'O'], // Estos son los ingredientes de la receta
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

  // Variables para recordar qué hemos hecho
  let selected = []; // Una lista vacía donde meteremos los elementos que escojamos
  const discovered = new Set(); // Una caja fuerte para guardar los descubrimientos sin repetirlos

  // Variables para conectar el código con las partes de la pantalla
  let $grid, $flaskSelected, $result, $formula, $name, $desc, $history, $catalogGrid, $catalogSearch, $flaskZone;

  // Esta función dibuja los botoncitos de los elementos en la pantalla
  function renderElements() {
    $grid.innerHTML = ''; // Limpiamos la mesa antes de poner los botones
    ELEMENTS.forEach(el => { // Para cada elemento...
      const btn = document.createElement('button'); // ...creamos un botón
      btn.className = 'element-btn';
      btn.setAttribute('aria-label', `Agregar ${el.name}`);
      btn.innerHTML = `
        <span class="el-symbol" style="color:${el.color}">${el.symbol}</span>
        <span class="el-name">${el.name}</span>
        <span class="el-count" id="qcount-${el.symbol}"></span>`;
      
      // Cuando haces clic en el botón, llama a "addElement" (Añadir elemento)
      btn.addEventListener('click', () => addElement(el.symbol));
      $grid.appendChild(btn); // Lo ponemos en la pantalla
    });
  }

  // Mete un ingrediente al matraz
  function addElement(symbol) {
    if (selected.length >= 6) return; // ¡El matraz se llena si pones más de 6!
    selected.push(symbol); // Metemos el elemento a nuestra lista "selected"
    updateFlask(); // Actualizamos el dibujo del matraz
  }

  // Refresca la pantalla para mostrar qué hay dentro del matraz
  function updateFlask() {
    $flaskSelected.innerHTML = '';
    if (!selected.length) { // Si el matraz está vacío...
      $flaskSelected.innerHTML = '<span class="placeholder-text">Haz clic en los elementos para agregarlos</span>';
    } else { // Si hay cosas adentro...
      selected.forEach((sym, i) => {
        const tag = document.createElement('span');
        tag.className = 'element-tag';
        tag.textContent = sym;
        tag.title = 'Clic para quitar';
        
        // Si haces clic en un elemento dentro del matraz, ¡lo sacas!
        tag.addEventListener('click', () => {
          selected.splice(i, 1); // Lo borra de la lista
          updateFlask();
          $result.hidden = true; // Oculta los resultados viejos
        });
        $flaskSelected.appendChild(tag);
      });
    }

    // Actualiza los numeritos chiquitos en los botones de la tabla
    ELEMENTS.forEach(el => {
      const c = document.getElementById(`qcount-${el.symbol}`);
      if (!c) return;
      const n = selected.filter(s => s === el.symbol).length; // Cuenta cuántos pusimos
      c.textContent = n > 0 ? `×${n}` : '';
    });
  }

  // 🧪 ¡La función mágica que hace la explosión química!
  function react() {
    if (!selected.length) return; // Si no hay nada, no hace nada

    // Hacemos que el matraz tiemble un poquito en la pantalla
    if ($flaskZone) {
      $flaskZone.classList.remove('reacting');
      void $flaskZone.offsetWidth; // Un truco mágico para que vuelva a temblar
      $flaskZone.classList.add('reacting');
      setTimeout(() => $flaskZone.classList.remove('reacting'), 700); // Para de temblar después de un ratito
    }

    // Ordenamos nuestros ingredientes como un diccionario (A-Z) para buscarlos fácil
    const key = [...selected].sort().join(',');
    const rxn = REACTIONS[key]; // Buscamos en el recetario si existe esa mezcla

    if (rxn) { // ¡Si existe!
      $formula.innerHTML = `<i class="fa-solid ${rxn.icon}"></i> ${rxn.formula}`;
      $name.textContent  = rxn.name;
      $desc.innerHTML    = `<strong>Ecuación:</strong> <span class="mono">${rxn.equation}</span><br>${rxn.desc}`;
      $result.hidden     = false; // Muestra la respuesta

      if (!discovered.has(key)) { // Si nunca lo habíamos descubierto antes...
        discovered.add(key); // ¡Lo guardamos como nuevo descubrimiento!
        addToHistory(rxn); // Lo añadimos a tu historia de científico
      }
    } else { // Si mezclaste algo que no existe en nuestro recetario...
      $formula.innerHTML = '<i class="fa-solid fa-question"></i> Sin reacción';
      $name.textContent  = 'Combinación desconocida';
      $desc.textContent  = '¡Sigue explorando! Los elementos en estas proporciones no forman un compuesto estable en este simulador. Revisa el catálogo abajo para descubrir las recetas válidas.';
      $result.hidden     = false;
    }
  }

  // Agrega tu descubrimiento a la lista lateral
  function addToHistory(rxn) {
    const empty = $history.querySelector('.empty-state');
    if (empty) empty.remove(); // Borra el mensaje de "No hay nada"

    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `<i class="fa-solid ${rxn.icon}"></i><span class="history-formula">${rxn.formula}</span><span>${rxn.name}</span>`;
    $history.prepend(item); // Lo pone de primero en la lista
  }

  // ¡Vacia el matraz y limpia todo!
  function clearFlask() {
    selected = []; // La lista de ingredientes se queda vacía
    updateFlask(); // Refrescamos
    $result.hidden = true; // Escondemos resultados viejos
    ELEMENTS.forEach(el => {
      const c = document.getElementById(`qcount-${el.symbol}`);
      if (c) c.textContent = '';
    });
  }

  // Cargar una receta automáticamente al matraz como si tuviéramos un ayudante robot
  function loadRecipe(elementsList) {
    selected = [...elementsList]; // Copia los ingredientes de la receta
    updateFlask();
    react(); // ¡Y los mezcla!
    
    // Si estás en un teléfono o tablet pequeña, baja la pantalla solito
    if (window.innerWidth < 900) {
      document.querySelector('.chem-lab')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Dibuja el catálogo gigante de todas las reacciones que existen
  function renderCatalog(filterText = '') {
    if (!$catalogGrid) return;
    $catalogGrid.innerHTML = '';

    const query = filterText.toLowerCase().trim();
    const rxnList = Object.values(REACTIONS); // Saca todas las recetas del libro

    // Filtra las recetas por si escribiste algo en la cajita de búsqueda
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

    // Por cada receta, dibujamos una tarjetita
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

      // Cuando hacemos clic en "Cargar en matraz", llama al robot ayudante
      card.querySelector('.btn-load-recipe').addEventListener('click', () => {
        loadRecipe(rxn.elements);
      });

      $catalogGrid.appendChild(card);
    });
  }

  // Esta función prepara y arranca nuestro laboratorio por primera vez
  function init() {
    // Buscamos todas las partes de la pantalla por sus IDs
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

    renderElements(); // Dibuja los botones
    renderCatalog(); // Dibuja el libro de recetas

    // Conectamos los botones principales
    document.getElementById('btnReact').addEventListener('click', react);
    document.getElementById('btnClearChem').addEventListener('click', clearFlask);

    // Si escribimos algo en el buscador, busca rápido (sin presionar Enter)
    if ($catalogSearch) {
      $catalogSearch.addEventListener('input', e => {
        renderCatalog(e.target.value);
      });
    }
  }

  // Guarda nuestro laboratorio para que el menú principal sepa arrancarlo
  window.MODULES.quimica = { init };
})();
