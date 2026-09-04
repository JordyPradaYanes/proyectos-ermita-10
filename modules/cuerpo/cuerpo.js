/**
 * cuerpo.js — Explora el Cuerpo Humano
 * SVG interactivo con hotspots y panel de información detallada.
 */
(function () {
  'use strict';

  const ORGANS = {
    corazon: {
      icon: 'fa-heart', name: 'Corazón',
      function: 'Bombear sangre por todo el cuerpo mediante contracciones rítmicas. Late aproximadamente 100,000 veces al día.',
      fact: 'Un corazón adulto late entre 60 y 100 veces por minuto en reposo, bombeando unos 5 litros de sangre por minuto.',
      disease: 'Infarto de miocardio: obstrucción de las arterias coronarias que priva al corazón de oxígeno.',
    },
    pulmon: {
      icon: 'fa-lungs', name: 'Pulmones',
      function: 'Intercambiar gases: captar oxígeno (O₂) e introducirlo a la sangre, y expulsar dióxido de carbono (CO₂).',
      fact: 'Los pulmones tienen unos 300 millones de alvéolos. Si los extendieras, cubrirían una cancha de tenis.',
      disease: 'Asma: inflamación crónica que estrecha las vías respiratorias, causando dificultad para respirar.',
    },
    estomago: {
      icon: 'fa-circle', name: 'Estómago', // 'fa-stomach' is pro, use circle or similar
      function: 'Almacenar y mezclar los alimentos con jugos gástricos para comenzar la digestión química.',
      fact: 'El estómago produce un nuevo revestimiento mucoso cada dos semanas para no digerirse a sí mismo.',
      disease: 'Gastritis: inflamación del revestimiento del estómago.',
    },
    intestino: {
      icon: 'fa-arrows-spin', name: 'Intestinos',
      function: 'Absorber nutrientes (delgado) y agua (grueso) de los alimentos digeridos.',
      fact: 'El intestino delgado mide entre 6 y 7 metros de largo.',
      disease: 'Síndrome de intestino irritable: trastorno funcional con dolor abdominal.',
    },
    higado: {
      icon: 'fa-shield', name: 'Hígado',
      function: 'Desintoxicar la sangre, producir bilis y almacenar glucógeno.',
      fact: 'Es el único órgano que puede regenerarse a sí mismo a partir de un fragmento.',
      disease: 'Cirrosis: cicatrización del tejido hepático por daño crónico.',
    },
    rinon: {
      icon: 'fa-leaf', name: 'Riñones', // 'fa-kidneys' is pro
      function: 'Filtrar la sangre para eliminar desechos y agua en exceso a través de la orina.',
      fact: 'Filtran alrededor de 180 litros de sangre al día.',
      disease: 'Insuficiencia renal crónica: pérdida gradual de la función renal.',
    },
    cerebro: {
      icon: 'fa-brain', name: 'Cerebro',
      function: 'Centro de control. Procesa información sensorial, controla el movimiento y almacena memorias.',
      fact: 'Contiene ~86 mil millones de neuronas, cada una con hasta 10,000 conexiones sinápticas.',
      disease: 'Alzheimer: enfermedad degenerativa que causa pérdida de memoria progresiva.',
    },
  };

  function init() {
    const dots         = document.querySelectorAll('.organ-dot');
    const $placeholder = document.getElementById('organPlaceholder');
    const $detail      = document.getElementById('organDetail');
    const $icon        = document.getElementById('organIcon');
    const $title       = document.getElementById('organTitle');
    const $func        = document.getElementById('organFunction');
    const $fact        = document.getElementById('organFact');
    const $disease     = document.getElementById('organDisease');

    function showOrgan(key) {
      const organ = ORGANS[key];
      if (!organ) return;

      dots.forEach(d => d.classList.remove('active-organ'));
      document.querySelector(`.organ-dot[data-organ="${key}"]`)?.classList.add('active-organ');

      $icon.className = `organ-icon fa-solid ${organ.icon}`;
      $title.textContent   = organ.name;
      $func.textContent    = organ.function;
      $fact.textContent    = organ.fact;
      $disease.textContent = organ.disease;

      $placeholder.hidden = true;
      $detail.hidden = false;
    }

    dots.forEach(dot => {
      dot.addEventListener('click',  () => showOrgan(dot.dataset.organ));
      dot.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' ') showOrgan(dot.dataset.organ); });
    });

    document.querySelectorAll('.organ-lbl').forEach(lbl => {
      lbl.addEventListener('click', () => showOrgan(lbl.dataset.organ));
    });
  }

  window.MODULES.cuerpo = { init };
})();
