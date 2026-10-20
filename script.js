const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');
const tagline = document.getElementById('tagline');
const nameInput = document.getElementById('nameInput');
const taglineInput = document.getElementById('taglineInput');
const updateBtn = document.getElementById('updateBtn');
const hideBtn = document.getElementById('hideBtn');
const showBtn = document.getElementById('showBtn');
const controlsPanel = document.getElementById('controlsPanel');

canvas.width = 700;
canvas.height = 700;

const width = canvas.width;
const height = canvas.height;
const center = { x: width / 2, y: height / 2 - 20 };

let TEXT_TO_WRITE = nameInput.value.trim().toUpperCase();

// ইনপুট বক্স হাইড ও শো করার লজিক (স্ক্রিন রেকর্ডিংয়ের জন্য)
hideBtn.addEventListener('click', () => {
  controlsPanel.style.display = 'none';
  showBtn.style.display = 'block';
});

showBtn.addEventListener('click', () => {
  controlsPanel.style.display = 'flex';
  showBtn.style.display = 'none';
});

// অ্যানিমেশন স্টেট ভেরিয়েবল
let progress = 0;
let textProgress = 0;
let startTime = null;

// রিস্টার্ট অ্যানিমেশন ফংশন
function restartAnimation() {
  TEXT_TO_WRITE = nameInput.value.trim() !== "" ? nameInput.value.trim().toUpperCase() : "FJ";
  tagline.innerText = taglineInput.value.trim() !== "" ? taglineInput.value.trim() : "I LOVE YOU ❤️";
  
  progress = 0;
  textProgress = 0;
  startTime = null;
  tagline.classList.remove('show');
}

updateBtn.addEventListener('click', restartAnimation);

// ১. তারা তৈরি
let stars = [];
for (let i = 0; i < 140; i++) {
  stars.push({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2.5 + 0.5,
    alpha: Math.random(),
    speed: 0.01 + Math.random() * 0.03,
    color: ['#ffffff', '#80d8ff', '#ff80ab', '#ffff80'][Math.floor(Math.random() * 4)]
  });
}

// ২. ভাসমান নিয়ন লাভ পার্টিকেলস
let floatingHearts = [];
function createFloatingHeart() {
  if (floatingHearts.length < 30) {
    floatingHearts.push({
      x: Math.random() * width,
      y: height + 20,
      size: Math.random() * 16 + 10,
      speed: Math.random() * 1.5 + 0.6,
      alpha: Math.random() * 0.8 + 0.2,
      swing: Math.random() * 0.05,
      color: ['#ff0055', '#ff00aa', '#00f0ff', '#ffeb3b'][Math.floor(Math.random() * 4)]
    });
  }
}

// ৩. স্পার্কল কণা
let sparkles = [];
function addSparkle(x, y, color, count = 4) {
  for (let i = 0; i < count; i++) {
    sparkles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
      size: Math.random() * 4.5 + 1.5,
      color: color,
      life: 1
    });
  }
}

// ৪. লাভ ম্যাথমেটিক্যাল কার্ভ
function getHeartPoint(t) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
  return { x: center.x + x * 15, y: center.y + y * 15 };
}

function animate(timestamp) {
  if (!startTime) startTime = timestamp;
  let elapsed = (timestamp - startTime) / 1000;

  // ব্যাকগ্রাউন্ড ক্লিয়ার
  ctx.fillStyle = 'rgba(2, 0, 10, 0.25)';
  ctx.fillRect(0, 0, width, height);

  // তারা আঁকা
  stars.forEach(s => {
    s.alpha += s.speed;
    if (s.alpha > 1 || s.alpha < 0) s.speed = -s.speed;
    ctx.fillStyle = s.color;
    ctx.globalAlpha = Math.abs(s.alpha);
    ctx.fillRect(s.x, s.y, s.size, s.size);
    ctx.globalAlpha = 1.0;
  });

  // ভাসমান লাভ
  if (Math.random() < 0.09) createFloatingHeart();
  floatingHearts.forEach((h, index) => {
    h.y -= h.speed;
    h.x += Math.sin(h.y * h.swing) * 0.7;
    
    ctx.save();
    ctx.shadowBlur = 12;
    ctx.shadowColor = h.color;
    ctx.fillStyle = h.color;
    ctx.globalAlpha = h.alpha;
    ctx.font = `${h.size}px Arial`;
    ctx.fillText('❤️', h.x, h.y);
    ctx.restore();

    if (h.y < -30) floatingHearts.splice(index, 1);
  });

  let pulse = Math.sin(elapsed * 4) * 6;

  // ফেজ ১: নিয়ন লাভ ড্রয়িং
  if (progress <= Math.PI * 2) {
    progress += 0.008;
    
    ctx.beginPath();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#ff0055';
    ctx.shadowBlur = 35 + pulse;
    ctx.shadowColor = '#ff0077';

    for (let t = 0; t <= progress; t += 0.01) {
      let pt = getHeartPoint(t);
      if (t === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();

    let currentPt = getHeartPoint(progress);
    addSparkle(currentPt.x, currentPt.y, '#00f0ff', 5);
  } else {
    // স্থায়ী নিয়ন লাভ
    ctx.beginPath();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#ff0055';
    ctx.shadowBlur = 40 + pulse;
    ctx.shadowColor = '#ff0077';
    for (let t = 0; t <= Math.PI * 2; t += 0.01) {
      let pt = getHeartPoint(t);
      if (t === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();

    // ফেজ ২: ভেতরের টেক্সট অ্যানিমেশন
    drawAnimatedText();
  }

  // ফেজ ৩: নিচের ট্যাগলাইন (এখন লাভ ও ভেতরের টেক্সট সম্পূর্ণ হওয়ার পরেই আসবে - যেমন ৬ সেকেন্ড পর)
  if (textProgress >= 1 && elapsed > 6) {
    tagline.classList.add('show');
  }

  // স্পার্কল
  sparkles.forEach((p, idx) => {
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 0.02;
    if (p.life <= 0) sparkles.splice(idx, 1);
    else {
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 12;
      ctx.shadowColor = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    }
  });

  requestAnimationFrame(animate);
}

// গ্লোয়িং নিয়ন টেক্সট
function drawAnimatedText() {
  if (textProgress < 1) {
    textProgress += 0.006;
  }

  ctx.save();
  ctx.font = "bold 70px 'Cinzel', 'Montserrat', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const maxTextWidth = 380;
  const revealWidth = maxTextWidth * textProgress;
  
  ctx.beginPath();
  ctx.rect(center.x - maxTextWidth / 2, center.y - 80, revealWidth, 160);
  ctx.clip();

  // নিয়ন সাইয়ান গ্লো
  ctx.strokeStyle = "#00f0ff";
  ctx.lineWidth = 8;
  ctx.shadowBlur = 35;
  ctx.shadowColor = "#00f0ff";
  ctx.strokeText(TEXT_TO_WRITE, center.x, center.y);

  // সাদা ইনসাইড ফিল
  ctx.fillStyle = "#ffffff";
  ctx.shadowBlur = 15;
  ctx.shadowColor = "#ffffff";
  ctx.fillText(TEXT_TO_WRITE, center.x, center.y);

  ctx.restore();

  if (textProgress < 1 && textProgress > 0) {
    let sparkleX = (center.x - maxTextWidth / 2) + revealWidth;
    addSparkle(sparkleX, center.y, '#ffff00', 4);
  }
}

requestAnimationFrame(animate);