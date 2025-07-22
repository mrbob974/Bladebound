const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = null;
let enemies = [];
let sprites = {};
let lastAttack = 0;
const attackInterval = 1000;
const enemyTypes = ["orc", "troll", "necromancer"];

function selectClass(type) {
  player = {
    x: 100, y: 100, size: 48, type, hp: 100, speed: 2,
    sprite: sprites[type], attack: 10,
    range: ["archer", "mage"].includes(type) ? 120 : 40
  };
  document.getElementById("status").innerText = "Class selected: " + type;
  spawnEnemies();
}

function spawnEnemies() {
  enemies = [];
  for (let i = 0; i < 5; i++) {
    let kind = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    enemies.push({
      x: Math.random() * 900 + 50,
      y: Math.random() * 600 + 50,
      hp: 50 + Math.random() * 50,
      type: kind,
      sprite: sprites[kind],
      size: 48
    });
  }
}

function loadSprites(callback) {
  const names = ["archer", "mage", "miner", "soldier", "orc", "troll", "necromancer"];
  let loaded = 0;
  names.forEach(name => {
    const img = new Image();
    img.src = `assets/sprites/${name}.png`;
    img.onload = () => {
      sprites[name] = img;
      loaded++;
      if (loaded === names.length) callback();
    };
  });
}

function distance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function update() {
  if (!player) return;

  enemies.forEach(e => {
    let dx = player.x - e.x;
    let dy = player.y - e.y;
    let dist = Math.sqrt(dx ** 2 + dy ** 2);
    if (dist > 1) {
      e.x += dx / dist * 0.5;
      e.y += dy / dist * 0.5;
    }
  });

  const now = Date.now();
  if (now - lastAttack > attackInterval) {
    enemies.forEach(e => {
      if (distance(player, e) <= player.range) {
        e.hp -= player.attack;
      }
    });
    lastAttack = now;
  }

  enemies = enemies.filter(e => e.hp > 0);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (player) ctx.drawImage(player.sprite, player.x, player.y, player.size, player.size);
  enemies.forEach(e => {
    ctx.drawImage(e.sprite, e.x, e.y, e.size, e.size);
  });
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

loadSprites(() => {
  gameLoop();
});
