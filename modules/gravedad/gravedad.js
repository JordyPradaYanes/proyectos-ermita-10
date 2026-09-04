/**
 * gravedad.js — Laboratorio de Gravedad
 */
(function () {
  'use strict';

  let canvas, ctx;
  let g = 9.8; // aceleración de la gravedad
  let y = 0;   // posición vertical
  let v = 0;   // velocidad
  let t = 0;   // tiempo simulado
  let raf = null;
  let dropping = false;
  
  // Constantes visuales
  const radius = 15;
  const scale = 40; // píxeles por metro
  const maxH = 10;  // altura máxima en metros
  const topY = 20;  // margen superior en píxeles
  
  let $btn, $stats, $tLabel, $vLabel, $envBtns;

  function reset() {
    if (raf) cancelAnimationFrame(raf);
    dropping = false;
    y = topY;
    v = 0;
    t = 0;
    draw();
    $stats.hidden = true;
    $btn.disabled = false;
  }

  function draw() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Suelo
    const groundY = topY + maxH * scale;
    ctx.fillStyle = 'var(--clr-surface)';
    ctx.fillRect(0, groundY, W, H - groundY);
    ctx.strokeStyle = 'var(--clr-border)';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(W, groundY); ctx.stroke();
    
    // Regla de altura
    ctx.fillStyle = 'var(--clr-text-muted)';
    ctx.font = '12px var(--font-mono)';
    for (let i = 0; i <= maxH; i++) {
      const lineY = groundY - i * scale;
      ctx.fillText(i + 'm', 5, lineY + 4);
      ctx.fillRect(25, lineY, 10, 1);
    }

    // Objeto (esfera)
    ctx.beginPath();
    ctx.arc(W/2, y, radius, 0, Math.PI*2);
    ctx.fillStyle = 'var(--clr-accent)';
    ctx.fill();
    ctx.shadowColor = 'rgba(0, 212, 170, 0.5)';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  function loop() {
    // Delta time fijo para la simulación física (~60fps)
    const dt = 1/60;
    t += dt;
    
    // Física: v = v0 + a*t, y = y0 + v0*t + 0.5*a*t^2
    v += g * dt;
    // La posición en canvas aumenta hacia abajo
    y += v * scale * dt;

    const groundY = topY + maxH * scale - radius;
    
    if (y >= groundY) {
      y = groundY;
      draw();
      finishDrop();
      return;
    }

    draw();
    raf = requestAnimationFrame(loop);
  }

  function startDrop() {
    reset();
    dropping = true;
    $btn.disabled = true;
    loop();
  }

  function finishDrop() {
    dropping = false;
    $stats.hidden = false;
    $tLabel.textContent = t.toFixed(2);
    $vLabel.textContent = v.toFixed(2);
  }

  function init() {
    canvas = document.getElementById('gravityCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    
    $btn = document.getElementById('gravDropBtn');
    $stats = document.getElementById('gravStats');
    $tLabel = document.getElementById('gravTime');
    $vLabel = document.getElementById('gravVel');
    $envBtns = document.querySelectorAll('.env-btns button');

    $envBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (dropping) return;
        $envBtns.forEach(b => b.classList.remove('active-mode'));
        btn.classList.add('active-mode');
        g = parseFloat(btn.dataset.g);
      });
    });

    $btn.addEventListener('click', startDrop);
    
    const $resetBtn = document.getElementById('gravResetBtn');
    if ($resetBtn) {
      $resetBtn.addEventListener('click', reset);
    }
    
    reset();
  }

  function stop() {
    if (raf) { cancelAnimationFrame(raf); raf = null; }
  }

  window.MODULES.gravedad = { init, stop };
})();
