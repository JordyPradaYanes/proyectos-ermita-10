/**
 * trivia.js — Trivia Multijugador
 */
(function () {
  'use strict';

  const DB = [
    { q: "¿Cuál es el planeta más grande del sistema solar?", opts: ["Tierra", "Marte", "Júpiter", "Saturno"], ans: 2 },
    { q: "¿Qué gas respiramos principalmente?", opts: ["Oxígeno", "Nitrógeno", "Dióxido de Carbono", "Hidrógeno"], ans: 1 }, // 78% Nitrogen!
    { q: "¿Cuál es el hueso más largo del cuerpo humano?", opts: ["Fémur", "Tibia", "Húmero", "Radio"], ans: 0 },
    { q: "¿Qué órgano bombea la sangre?", opts: ["Cerebro", "Pulmón", "Corazón", "Hígado"], ans: 2 },
    { q: "¿Fórmula química del agua?", opts: ["HO", "H2O2", "H2O", "CO2"], ans: 2 },
    { q: "¿Quién formuló la teoría de la relatividad?", opts: ["Newton", "Galileo", "Tesla", "Einstein"], ans: 3 },
    { q: "¿Qué partícula tiene carga negativa?", opts: ["Protón", "Neutrón", "Electrón", "Quark"], ans: 2 },
    { q: "¿Cuál es el metal más abundante en la corteza terrestre?", opts: ["Hierro", "Aluminio", "Cobre", "Oro"], ans: 1 },
    { q: "¿Qué tipo de onda es la luz?", opts: ["Mecánica", "Sonora", "Electromagnética", "Gravitacional"], ans: 2 },
    { q: "¿Cuál es el elemento químico más ligero?", opts: ["Helio", "Oxígeno", "Hidrógeno", "Carbono"], ans: 2 }
  ];

  let p1Name, p2Name;
  let p1Score = 0, p2Score = 0;
  let turn = 1; // 1 o 2
  let questions = [];
  let currentQIdx = 0;

  let $setup, $game, $win;
  let $p1Card, $p2Card, $p1Score, $p2Score, $turnLabel;
  let $qCounter, $qText, $options, $nextBtn;

  function shuffle(array) {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function start() {
    p1Name = document.getElementById('trivP1Name').value || 'Jugador 1';
    p2Name = document.getElementById('trivP2Name').value || 'Jugador 2';
    document.getElementById('trivP1Label').textContent = p1Name;
    document.getElementById('trivP2Label').textContent = p2Name;

    p1Score = p2Score = 0;
    updateScores();
    turn = 1;
    currentQIdx = 0;
    questions = shuffle(DB).slice(0, 10); // 10 preguntas (5 por jugador)

    $setup.hidden = true;
    $win.hidden = true;
    $game.hidden = false;
    
    loadQuestion();
  }

  function updateScores() {
    $p1Score.textContent = p1Score;
    $p2Score.textContent = p2Score;
    $p1Card.className = `triv-player ${turn === 1 ? 'active-turn' : ''}`;
    $p2Card.className = `triv-player ${turn === 2 ? 'active-turn' : ''}`;
    $turnLabel.textContent = `Turno de: ${turn === 1 ? p1Name : p2Name}`;
  }

  function loadQuestion() {
    updateScores();
    $nextBtn.hidden = true;
    const q = questions[currentQIdx];
    $qCounter.textContent = `Pregunta ${currentQIdx + 1} de ${questions.length}`;
    $qText.textContent = q.q;

    $options.innerHTML = '';
    q.opts.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'triv-opt-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => answer(idx, btn));
      $options.appendChild(btn);
    });
  }

  function answer(idx, btn) {
    const q = questions[currentQIdx];
    const btns = Array.from($options.children);
    btns.forEach(b => b.disabled = true);

    if (idx === q.ans) {
      btn.classList.add('correct');
      btn.innerHTML += ' <i class="fa-solid fa-check" style="float:right"></i>';
      if (turn === 1) p1Score++; else p2Score++;
      updateScores();
    } else {
      btn.classList.add('wrong');
      btn.innerHTML += ' <i class="fa-solid fa-xmark" style="float:right"></i>';
      btns[q.ans].classList.add('correct');
    }

    $nextBtn.hidden = false;
  }

  function nextTurn() {
    currentQIdx++;
    turn = turn === 1 ? 2 : 1;
    if (currentQIdx >= questions.length) {
      endGame();
    } else {
      loadQuestion();
    }
  }

  function endGame() {
    $game.hidden = true;
    $win.hidden = false;
    
    const title = document.getElementById('trivWinTitle');
    const desc = document.getElementById('trivWinDesc');

    if (p1Score > p2Score) {
      title.textContent = '¡Gana ' + p1Name + '!';
      desc.textContent = `${p1Name} vence con ${p1Score} puntos frente a ${p2Score}.`;
    } else if (p2Score > p1Score) {
      title.textContent = '¡Gana ' + p2Name + '!';
      desc.textContent = `${p2Name} vence con ${p2Score} puntos frente a ${p1Score}.`;
    } else {
      title.textContent = '¡Empate!';
      desc.textContent = `Ambos consiguieron ${p1Score} puntos.`;
    }
  }

  function init() {
    $setup = document.getElementById('triviaSetup');
    $game  = document.getElementById('triviaGame');
    $win   = document.getElementById('triviaWin');
    $p1Card = document.getElementById('trivP1Card');
    $p2Card = document.getElementById('trivP2Card');
    $p1Score = document.getElementById('trivP1Score');
    $p2Score = document.getElementById('trivP2Score');
    $turnLabel = document.getElementById('trivTurnLabel');
    $qCounter = document.getElementById('trivQCounter');
    $qText    = document.getElementById('trivQText');
    $options  = document.getElementById('trivOptions');
    $nextBtn  = document.getElementById('trivNextBtn');

    document.getElementById('trivStartBtn')?.addEventListener('click', start);
    $nextBtn?.addEventListener('click', nextTurn);
    document.getElementById('trivRestartBtn')?.addEventListener('click', () => {
      $win.hidden = true;
      $setup.hidden = false;
    });
  }

  window.MODULES.trivia = { init };
})();
