/**
 * matematica.js — Misión Matemática
 */
(function () {
  'use strict';

  let score = 0, streak = 0, correct = 0;
  let timerLeft = 30, timerInterval = null;
  let answer = 0, difficulty = 'facil', running = false;

  let $score, $timer, $streak, $question, $input, $feedback, $finalScore, $correct, $resultIcon;
  let screens = {};

  function show(screenName) {
    Object.values(screens).forEach(s => { if(s) s.hidden = true; });
    if (screens[screenName]) screens[screenName].hidden = false;
  }

  function generateQuestion() {
    let a, b, op, result, questionStr;
    if (difficulty === 'facil') {
      a = Math.floor(Math.random() * 20) + 1;
      b = Math.floor(Math.random() * 20) + 1;
      op = Math.random() < 0.5 ? '+' : '-';
      result = op === '+' ? a + b : a - b;
      questionStr = `${a} ${op} ${b}`;
    } else if (difficulty === 'medio') {
      a = Math.floor(Math.random() * 15) + 2;
      b = Math.floor(Math.random() * 15) + 2;
      const ops = ['+', '-', '×'];
      op = ops[Math.floor(Math.random() * ops.length)];
      result = op === '+' ? a+b : op === '-' ? a-b : a*b;
      questionStr = `${a} ${op} ${b}`;
    } else {
      a = Math.floor(Math.random() * 12) + 2;
      b = Math.floor(Math.random() * 12) + 2;
      const ops = ['+', '-', '×', '÷'];
      op = ops[Math.floor(Math.random() * ops.length)];
      if (op === '÷') {
        result = b;
        a = b * (Math.floor(Math.random() * 10) + 2);
        questionStr = `${a} ÷ ${b}`;
      } else {
        result = op === '+' ? a+b : op === '-' ? a-b : a*b;
        questionStr = `${a} ${op} ${b}`;
      }
    }

    $question.textContent = `${questionStr} = ?`;
    answer = result;
    $input.value = '';
    $input.focus();
    $feedback.innerHTML = '';
    $feedback.className = 'math-feedback';
  }

  function checkAnswer() {
    const val = parseInt($input.value);
    if (isNaN(val)) return;

    if (val === answer) {
      streak++;
      const bonus = streak >= 3 ? 2 : 0;
      score += 10 + bonus;
      correct++;
      $feedback.innerHTML = streak >= 3 ? `<i class="fa-solid fa-check"></i> ¡Correcto! +${10+bonus} pts (racha ×${streak})` : '<i class="fa-solid fa-check"></i> ¡Correcto!';
      $feedback.className = 'math-feedback correct';
    } else {
      streak = 0;
      $feedback.innerHTML = `<i class="fa-solid fa-xmark"></i> Incorrecto. La respuesta era ${answer}`;
      $feedback.className = 'math-feedback wrong';
    }

    $score.textContent = score;
    $streak.innerHTML = `<i class="fa-solid fa-fire"></i> ${streak}`;
    setTimeout(generateQuestion, 600);
  }

  function startTimer() {
    timerLeft = 30;
    $timer.textContent = timerLeft;
    document.querySelector('.timer-card')?.classList.remove('urgent');

    timerInterval = setInterval(() => {
      timerLeft--;
      $timer.textContent = timerLeft;
      if (timerLeft <= 10) document.querySelector('.timer-card')?.classList.add('urgent');
      if (timerLeft <= 0) endGame();
    }, 1000);
  }

  function endGame() {
    clearInterval(timerInterval);
    timerInterval = null;
    running = false;
    show('result');
    $finalScore.textContent = score;
    $correct.textContent = correct;
    $resultIcon.className = 'fa-solid big-icon ' + (score >= 100 ? 'fa-trophy' : score >= 50 ? 'fa-medal' : 'fa-award');
  }

  function startGame(diff) {
    difficulty = diff;
    score = streak = correct = 0;
    running = true;
    $score.textContent = 0;
    $streak.innerHTML = '<i class="fa-solid fa-fire"></i> 0';
    show('play');
    generateQuestion();
    startTimer();
  }

  function pause() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  }

  function init() {
    $score    = document.getElementById('mathScore');
    $timer    = document.getElementById('mathTimer');
    $streak   = document.getElementById('mathStreak');
    $question = document.getElementById('mathQuestion');
    $input    = document.getElementById('mathInput');
    $feedback = document.getElementById('mathFeedback');
    $finalScore = document.getElementById('mathFinalScore');
    $correct    = document.getElementById('mathCorrect');
    $resultIcon = document.getElementById('mathResultIcon');

    screens = {
      start:  document.getElementById('mathStartScreen'),
      play:   document.getElementById('mathPlayScreen'),
      result: document.getElementById('mathResultScreen'),
    };

    document.getElementById('mathStartEasy')?.addEventListener('click', () => startGame('facil'));
    document.getElementById('mathStartMed')?.addEventListener('click',  () => startGame('medio'));
    document.getElementById('mathStartHard')?.addEventListener('click', () => startGame('dificil'));

    document.getElementById('mathSubmit')?.addEventListener('click', checkAnswer);
    $input?.addEventListener('keydown', e => { if (e.key === 'Enter') checkAnswer(); });

    document.getElementById('mathRestart')?.addEventListener('click', () => {
      show('start');
      document.querySelector('.timer-card')?.classList.remove('urgent');
    });

    show('start');
  }

  window.MODULES.matematica = { init, pause };
})();
