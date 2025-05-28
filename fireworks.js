// fireworks.js

const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];
let isRunning = false;

class Firework {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.particles = [];
    for (let i = 0; i < 100; i++) {
      this.particles.push(new Particle(x, y));
    }
  }

  update() {
    this.particles.forEach(p => p.update());
  }

  draw() {
    this.particles.forEach(p => p.draw());
  }

  isDone() {
    return this.particles.every(p => p.life <= 0);
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * 2 * Math.PI;
    const speed = Math.random() * 5 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.life = 60;
    this.opacity = 1;
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.05;
    this.life--;
    this.opacity = this.life / 60;
  }

  draw() {
    ctx.globalAlpha = this.opacity;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function launchFireworks() {
  fireworks.push(new Firework(canvas.width / 2, canvas.height / 2));
  if (!isRunning) {
    isRunning = true;
    animateFireworks();
  }
}

function animateFireworks() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)"; // 半透明背景保留煙火軌跡
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  fireworks.forEach(f => {
    f.update();
    f.draw();
  });

  fireworks = fireworks.filter(f => !f.isDone());

  if (fireworks.length > 0) {
    requestAnimationFrame(animateFireworks);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    isRunning = false;
  }
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
