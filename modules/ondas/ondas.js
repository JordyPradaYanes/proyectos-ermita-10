/**
 * ondas.js — Simulador de Ondas
 * Canvas animado con onda senoidal, cuadrada o triangular.
 * start() / stop() controlan el loop de animación.
 */
(function () {
  'use strict';

  let canvas, ctx;
  let freq = 1, amp = 80, speed = 1, type = 'sin';
  let phase = 0, raf = null;

  function waveValue(x) {
    const arg = x * freq * 0.05 + phase;
    if (type === 'sin')      return Math.sin(arg);
    if (type === 'square')   return Math.sign(Math.sin(arg));
    if (type === 'triangle') return (2 / Math.PI) * Math.asin(Math.sin(arg));
    return 0;
  }

  function draw() {
    const W = canvas.width, H = canvas.height, cy = H / 2;
    ctx.clearRect(0, 0, W, H);

    // Cuadrícula sutil
    ctx.strokeStyle = 'rgba(120,130,200,0.07)';
    ctx.lineWidth = 1;
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
    for (let x = 0; x < W; x += 80) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }

    // Eje de equilibrio
    ctx.strokeStyle = 'rgba(120,130,200,0.25)';
    ctx.setLineDash([5,5]);
    ctx.beginPath(); ctx.moveTo(0,cy); ctx.lineTo(W,cy); ctx.stroke();
    ctx.setLineDash([]);

    // Gradiente de la onda
    const grad = ctx.createLinearGradient(0,0,W,0);
    grad.addColorStop(0,'#6c63ff');
    grad.addColorStop(0.5,'#00d4aa');
    grad.addColorStop(1,'#6c63ff');

    ctx.beginPath();
    for (let x = 0; x <= W; x++) {
      const y = cy - waveValue(x) * amp;
      x === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    }
    ctx.strokeStyle = grad;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.lineTo(W, cy); ctx.lineTo(0, cy); ctx.closePath();
    ctx.fillStyle = 'rgba(108,99,255,0.07)'; ctx.fill();

    phase += 0.03 * speed;
    updateInfo();
  }

  function loop() { draw(); raf = requestAnimationFrame(loop); }

  function updateInfo() {
    const period = (1 / freq).toFixed(2);
    const lambda = (canvas.width / freq / 10).toFixed(1);
    const names  = { sin:'Senoidal', square:'Cuadrada', triangle:'Triangular' };
    const wl = document.getElementById('waveLength');
    const wp = document.getElementById('wavePeriod');
    const wt = document.getElementById('waveTypeLabel');
    if (wl) wl.textContent = `${lambda} u`;
    if (wp) wp.textContent = `${period} s`;
    if (wt) wt.textContent = names[type] || type;
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width  = Math.min(canvas.parentElement.clientWidth - 4, 900);
    canvas.height = 300;
  }

  function init() {
    canvas = document.getElementById('waveCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const $freq  = document.getElementById('sliderFreq');
    const $amp   = document.getElementById('sliderAmp');
    const $speed = document.getElementById('sliderSpeed');

    $freq?.addEventListener('input', () => { freq = parseFloat($freq.value); document.getElementById('valFreq').textContent = freq.toFixed(1); });
    $amp?.addEventListener('input',  () => { amp  = parseInt($amp.value);    document.getElementById('valAmp').textContent  = amp; });
    $speed?.addEventListener('input',() => { speed= parseFloat($speed.value);document.getElementById('valSpeed').textContent= speed.toFixed(1); });

    document.querySelectorAll('.wave-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.wave-type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        type = btn.dataset.wave;
      });
    });
  }

  function start() { if (!raf) loop(); }
  function stop()  { if (raf) { cancelAnimationFrame(raf); raf = null; } }

  window.MODULES.ondas = { init, start, stop };
})();
