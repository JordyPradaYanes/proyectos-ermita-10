/**
 * pitagoras.js — Teorema de Pitágoras
 */
(function () {
  'use strict';

  let a = 3, b = 4;
  let canvas, ctx;

  function draw() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Escala adaptativa: el triángulo es siempre grande y protagonista
    const padX = 70;
    const padY = 65;
    const availW = W - padX * 2;
    const availH = H - padY * 2;
    
    // Usamos el máximo entre el valor actual y 8 para dar sensación de crecimiento pero sin que sea minúsculo
    const maxVal = Math.max(a, b, 7);
    const scale = Math.min(availW / maxVal, availH / maxVal);

    const triW = b * scale;
    const triH = a * scale;

    // Posicionamos el vértice de ángulo recto ptC (abajo a la izquierda del triángulo)
    const cx = (W - triW) / 2 + 10;
    const cy = (H + triH) / 2 - 10;

    const ptA = { x: cx, y: cy - triH }; // Arriba (vértice superior)
    const ptB = { x: cx + triW, y: cy }; // Derecha
    const ptC = { x: cx, y: cy };         // Ángulo recto

    // Cuadrícula sutil de fondo adaptada al paso de la escala
    ctx.strokeStyle = 'rgba(120, 130, 200, 0.08)';
    ctx.lineWidth = 1;
    const gridStep = Math.max(scale, 15);
    for (let x = 0; x < W; x += gridStep) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += gridStep) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Área sombreada del triángulo con gradiente
    const grad = ctx.createLinearGradient(ptC.x, ptA.y, ptB.x, ptC.y);
    grad.addColorStop(0, 'rgba(108, 99, 255, 0.25)');
    grad.addColorStop(1, 'rgba(0, 212, 170, 0.12)');

    ctx.beginPath();
    ctx.moveTo(ptA.x, ptA.y);
    ctx.lineTo(ptB.x, ptB.y);
    ctx.lineTo(ptC.x, ptC.y);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Ángulo recto (cuadrado indicador)
    const sq = Math.min(22, scale * 0.4);
    ctx.fillStyle = 'rgba(0, 212, 170, 0.15)';
    ctx.fillRect(ptC.x, ptC.y - sq, sq, sq);
    ctx.strokeStyle = 'var(--clr-accent)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ptC.x, ptC.y - sq);
    ctx.lineTo(ptC.x + sq, ptC.y - sq);
    ctx.lineTo(ptC.x + sq, ptC.y);
    ctx.stroke();

    // Punto en el ángulo recto
    ctx.beginPath();
    ctx.arc(ptC.x + sq / 2, ptC.y - sq / 2, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = 'var(--clr-accent)';
    ctx.fill();

    // Dibujar lados individuales con colores temáticos
    // Cateto a (vertical - rojo/rosa)
    ctx.strokeStyle = '#ef476f';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(ptC.x, ptC.y);
    ctx.lineTo(ptA.x, ptA.y);
    ctx.stroke();

    // Cateto b (horizontal - verde azulado)
    ctx.strokeStyle = '#00d4aa';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(ptC.x, ptC.y);
    ctx.lineTo(ptB.x, ptB.y);
    ctx.stroke();

    // Hipotenusa c (diagonal - violeta brillante con sombra)
    ctx.shadowColor = 'rgba(108, 99, 255, 0.5)';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = '#8b84ff';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(ptA.x, ptA.y);
    ctx.lineTo(ptB.x, ptB.y);
    ctx.stroke();
    ctx.shadowBlur = 0; // Reset sombra

    // Vértices (puntos decorativos)
    [ptA, ptB, ptC].forEach(pt => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    });

    // Etiquetas legibles con fondo tipo badge
    ctx.font = 'bold 15px var(--font-mono)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    function drawBadge(text, x, y, bgCol, textCol) {
      ctx.font = 'bold 14px "JetBrains Mono", monospace';
      const m = ctx.measureText(text);
      const padW = 10, padH = 6;
      const bw = m.width + padW * 2;
      const bh = 22;
      ctx.fillStyle = 'rgba(19, 22, 41, 0.9)';
      ctx.beginPath();
      ctx.roundRect(x - bw / 2, y - bh / 2, bw, bh, 6);
      ctx.fill();
      ctx.strokeStyle = bgCol;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = textCol;
      ctx.fillText(text, x, y);
    }

    // Etiqueta Cateto a (a la izquierda)
    drawBadge(`a = ${a}`, ptC.x - 44, ptC.y - triH / 2, '#ef476f', '#ff94b0');

    // Etiqueta Cateto b (abajo)
    drawBadge(`b = ${b}`, ptC.x + triW / 2, ptC.y + 26, '#00d4aa', '#5affdf');

    // Etiqueta Hipotenusa c (en el centro de la diagonal)
    const c = Math.sqrt(a * a + b * b);
    const midX = (ptA.x + ptB.x) / 2 + 30;
    const midY = (ptA.y + ptB.y) / 2 - 20;
    const cStr = Number.isInteger(c) ? `c = ${c}` : `c ≈ ${c.toFixed(2)}`;
    drawBadge(cStr, midX, midY, '#6c63ff', '#b4b0ff');
  }

  function update() {
    a = parseInt(document.getElementById('pythA').value);
    b = parseInt(document.getElementById('pythB').value);
    
    document.getElementById('valPythA').textContent = a;
    document.getElementById('valPythB').textContent = b;
    
    const c2 = a*a + b*b;
    const c = Math.sqrt(c2);

    document.getElementById('formA2').textContent = `${a}²`;
    document.getElementById('formB2').textContent = `${b}²`;
    document.getElementById('formA2val').textContent = a*a;
    document.getElementById('formB2val').textContent = b*b;
    document.getElementById('formSum').textContent = c2;
    document.getElementById('formC').textContent = Number.isInteger(c) ? c : c.toFixed(2);

    draw();
  }

  function init() {
    canvas = document.getElementById('pythagorasCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    
    document.getElementById('pythA').addEventListener('input', update);
    document.getElementById('pythB').addEventListener('input', update);
    
    update();
  }

  window.MODULES.pitagoras = { init };
})();
