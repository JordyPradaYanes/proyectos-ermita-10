/**
 * memoria.js — Juego de Memoria en Inglés
 */
(function () {
  'use strict';

  const VOCAB = [
    { en: 'Science',    es: 'Ciencia' },
    { en: 'Atom',       es: 'Átomo' },
    { en: 'Gravity',    es: 'Gravedad' },
    { en: 'Brain',      es: 'Cerebro' },
    { en: 'Heart',      es: 'Corazón' },
    { en: 'Planet',     es: 'Planeta' },
    { en: 'Energy',     es: 'Energía' },
    { en: 'Cell',       es: 'Célula' },
    { en: 'Light',      es: 'Luz' },
    { en: 'Water',      es: 'Agua' },
    { en: 'Space',      es: 'Espacio' },
    { en: 'Earth',      es: 'Tierra' },
  ];

  let cards = [];
  let flipped = [];
  let matched = 0;
  let attempts = 0;
  let time = 0;
  let timerInt = null;
  let playing = false;

  let $board, $att, $pairs, $time, $win, $winTime, $winAtt;

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function startTimer() {
    if (timerInt) clearInterval(timerInt);
    timerInt = setInterval(() => {
      time++;
      $time.textContent = time + 's';
    }, 1000);
  }

  function initGame() {
    $win.hidden = true;
    playing = true;
    matched = 0;
    attempts = 0;
    time = 0;
    $att.textContent = attempts;
    $pairs.textContent = '0 / 8';
    $time.textContent = '0s';

    // Seleccionar 8 pares aleatorios
    const selectedVocab = shuffle([...VOCAB]).slice(0, 8);
    const deck = [];
    selectedVocab.forEach((v, idx) => {
      deck.push({ id: idx, text: v.en, lang: 'en' });
      deck.push({ id: idx, text: v.es, lang: 'es' });
    });

    cards = shuffle(deck);
    renderBoard();
    startTimer();
  }

  function renderBoard() {
    $board.innerHTML = '';
    cards.forEach((card, i) => {
      const el = document.createElement('div');
      el.className = 'memory-card';
      el.dataset.idx = i;
      el.tabIndex = 0;
      el.setAttribute('role', 'button');
      el.innerHTML = `
        <div class="memory-card-inner">
          <div class="memory-card-front"><i class="fa-solid fa-question"></i></div>
          <div class="memory-card-back">${card.text}</div>
        </div>`;
      el.addEventListener('click', () => flipCard(el, card));
      el.addEventListener('keydown', e => { if (e.key==='Enter') flipCard(el, card); });
      $board.appendChild(el);
    });
  }

  function flipCard(el, card) {
    if (!playing || flipped.length >= 2 || el.classList.contains('flipped') || el.classList.contains('matched')) return;

    el.classList.add('flipped');
    flipped.push({ el, card });

    if (flipped.length === 2) {
      attempts++;
      $att.textContent = attempts;
      checkMatch();
    }
  }

  function checkMatch() {
    const [c1, c2] = flipped;
    if (c1.card.id === c2.card.id && c1.card.lang !== c2.card.lang) {
      // Match
      setTimeout(() => {
        c1.el.classList.add('matched');
        c2.el.classList.add('matched');
        matched++;
        $pairs.textContent = `${matched} / 8`;
        flipped = [];
        if (matched === 8) winGame();
      }, 500);
    } else {
      // No match
      setTimeout(() => {
        c1.el.classList.remove('flipped');
        c2.el.classList.remove('flipped');
        flipped = [];
      }, 1000);
    }
  }

  function winGame() {
    playing = false;
    clearInterval(timerInt);
    timerInt = null;
    $winTime.textContent = time + ' segundos';
    $winAtt.textContent = attempts;
    setTimeout(() => { $win.hidden = false; }, 500);
  }

  function pause() {
    if (timerInt) { clearInterval(timerInt); timerInt = null; }
  }

  function init() {
    $board = document.getElementById('memoryBoard');
    $att   = document.getElementById('memAttempts');
    $pairs = document.getElementById('memPairs');
    $time  = document.getElementById('memTimer');
    $win   = document.getElementById('memWin');
    $winTime = document.getElementById('memWinTime');
    $winAtt  = document.getElementById('memWinAttempts');

    document.getElementById('memRestart')?.addEventListener('click', initGame);
    document.getElementById('memWinRestart')?.addEventListener('click', initGame);

    initGame();
  }

  window.MODULES.memoria = { init, pause };
})();
