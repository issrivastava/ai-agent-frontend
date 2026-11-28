'use client';

/**
 * Dependency-free canvas confetti. A single fixed-position canvas is appended
 * to <body>, animated with requestAnimationFrame, then removed. Honours
 * prefers-reduced-motion and no-ops outside the browser (SSR / tests).
 */

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  color: string;
  shape: 'rect' | 'circle';
  life: number;
  maxLife: number;
};

const COLORS = ['#b33b75', '#ea7ba7', '#f2a1c4', '#7c3aed', '#f59e0b', '#10b981'];
const DURATION_MS = 1800;
const GRAVITY = 0.12;
const DRAG = 0.985;

let running = false;

export function fireConfetti(origin?: { x: number; y: number }) {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  if (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
    return;
  if (running) return;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  running = true;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText =
    'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999';
  document.body.appendChild(canvas);

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const resize = () => {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);

  const startX = origin?.x ?? window.innerWidth / 2;
  const startY = origin?.y ?? window.innerHeight * 0.35;
  const particles: Particle[] = Array.from({ length: 90 }, (_, index) => {
    const angle = (-90 + (Math.random() - 0.5) * 140) * (Math.PI / 180);
    const speed = 6 + Math.random() * 7;
    return {
      x: startX + (Math.random() - 0.5) * 40,
      y: startY + (Math.random() - 0.5) * 20,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.3,
      size: 5 + Math.random() * 5,
      color: COLORS[index % COLORS.length],
      shape: Math.random() > 0.3 ? 'rect' : 'circle',
      life: 0,
      maxLife: DURATION_MS * (0.7 + Math.random() * 0.3),
    };
  });

  const start = performance.now();
  let frame = 0;

  const tick = (now: number) => {
    const elapsed = now - start;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    let alive = false;
    for (const p of particles) {
      p.life = elapsed;
      if (elapsed > p.maxLife) continue;
      alive = true;
      p.vy += GRAVITY;
      p.vx *= DRAG;
      p.vy *= DRAG;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;

      const fade = Math.max(0, 1 - elapsed / p.maxLife);
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    if (alive) {
      frame = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      canvas.remove();
      running = false;
    }
  };

  frame = requestAnimationFrame(tick);
}
