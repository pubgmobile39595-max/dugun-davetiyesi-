/* ============================================================
   DÜĞÜN DAVETİYESİ
   ============================================================ */

// Elemanlar
const envelopeScreen = document.getElementById('envelopeScreen');
const openBtn = document.getElementById('openBtn');
const mainContent = document.getElementById('mainContent');
const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');

// ============================================================
// 1) ZARF AÇMA
// ============================================================
openBtn.addEventListener('click', () => {
  envelopeScreen.classList.add('hide');
  setTimeout(() => {
    mainContent.classList.add('show');
    musicBtn.classList.add('visible');
    document.body.style.overflow = 'auto';
  }, 400);
  playMusic();
});

document.body.style.overflow = 'hidden';

// ============================================================
// 2) GERİ SAYIM — TARİH 2027
// ============================================================
const weddingDate = new Date('2027-08-15T17:00:00').getTime();

const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

function pad(n) { return String(n).padStart(2, '0'); }

function updateCountdown() {
  const now = Date.now();
  const diff = weddingDate - now;

  if (diff <= 0) {
    daysEl.textContent = '00';
    hoursEl.textContent = '00';
    minutesEl.textContent = '00';
    secondsEl.textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  daysEl.textContent = pad(days);
  hoursEl.textContent = pad(hours);
  minutesEl.textContent = pad(minutes);
  secondsEl.textContent = pad(seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ============================================================
// 3) MÜZİK
// ============================================================
let isPlaying = false;

function playMusic() {
  bgMusic.volume = 0.4;
  bgMusic.play().then(() => {
    isPlaying = true;
    musicBtn.classList.add('playing');
  }).catch(() => {
    console.log('Müzik dosyası yok veya tarayıcı engelledi.');
  });
}

function pauseMusic() {
  bgMusic.pause();
  isPlaying = false;
  musicBtn.classList.remove('playing');
}

musicBtn.addEventListener('click', () => {
  if (isPlaying) pauseMusic();
  else playMusic();
});

// ============================================================
// 4) RSVP FORMU
// ============================================================
const rsvpForm = document.getElementById('rsvpForm');
const rsvpStatus = document.getElementById('rsvpStatus');

if (rsvpForm) {
  rsvpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(rsvpForm);
    rsvpStatus.textContent = '⏳ Gönderiliyor...';
    rsvpStatus.style.color = 'var(--text-dim)';

    try {
      const response = await fetch(rsvpForm.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        rsvpStatus.textContent = '✅ Teşekkürler! Bildiriminiz bize ulaştı. 💕';
        rsvpStatus.style.color = 'var(--gold-dark)';
        rsvpForm.reset();
      } else {
        rsvpStatus.textContent = '❌ Bir hata oluştu. Lütfen tekrar deneyin.';
        rsvpStatus.style.color = '#c0392b';
      }
    } catch (err) {
      rsvpStatus.textContent = '❌ Bağlantı hatası.';
      rsvpStatus.style.color = '#c0392b';
    }
  });
}

// ============================================================
// 5) SCROLL REVEAL
// ============================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.story__item, .event-card, .gallery__item, .countdown__box, .rsvp-form, .closing, .love-counter__box, .map-wrapper, .guestbook-form, .share-btn')
  .forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    revealObserver.observe(el);
  });

// ============================================================
// 6) AŞK SAYACI
// ============================================================
const firstMeetDate = new Date('2019-06-15T20:00:00').getTime();

const loveYears = document.getElementById('loveYears');
const loveDays = document.getElementById('loveDays');
const loveHours = document.getElementById('loveHours');
const loveMinutes = document.getElementById('loveMinutes');

function updateLoveCounter() {
  const now = Date.now();
  const diff = now - firstMeetDate;
  if (diff < 0) return;

  const totalMinutes = Math.floor(diff / (1000 * 60));
  const totalHours = Math.floor(diff / (1000 * 60 * 60));
  const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  const years = Math.floor(totalDays / 365);

  if (loveYears) {
    loveYears.textContent = years;
    loveDays.textContent = totalDays - (years * 365);
    loveHours.textContent = totalHours - (totalDays * 24);
    loveMinutes.textContent = totalMinutes % 60;
  }
}

if (loveYears) {
  updateLoveCounter();
  setInterval(updateLoveCounter, 30000);
}

// ============================================================
// 7) LIGHTBOX
// ============================================================
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightboxContent');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.gallery__item').forEach(item => {
  item.addEventListener('click', () => {
    const caption = item.querySelector('.gallery__caption').textContent;
    const bgImage = item.style.backgroundImage;

    lightboxContent.innerHTML = `
      <div style="text-align:center;color:#fff;max-width:90vw">
        <div style="width:min(80vw,600px);height:min(60vh,500px);background-image:${bgImage};background-size:cover;background-position:center;border-radius:12px;margin-bottom:20px"></div>
        <div style="font-family:var(--display);font-size:1.8rem">${caption}</div>
      </div>
    `;
    lightbox.classList.add('active');
  });
});

if (lightboxClose) {
  lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.classList.remove('active');
  });
}

// ============================================================
// 8) WHATSAPP PAYLAŞ
// ============================================================
function shareWhatsApp() {
  const text = encodeURIComponent(
    '💍 Ayşe & Mehmet\'in düğününe davetlisiniz!\n' +
    '📅 15 Ağustos 2027\n' +
    '📍 Marmara Düğün Salonu, İstanbul\n\n' +
    'Davetiyeyi görmek için: ' + window.location.href
  );
  window.open(`https://wa.me/?text=${text}`, '_blank');
}

// ============================================================
// 9) LİNK KOPYALA
// ============================================================
function copyInvitationLink() {
  const url = window.location.href;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      showToast('✅ Davetiye linki kopyalandı!');
    }).catch(() => fallbackCopy(url));
  } else {
    fallbackCopy(url);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showToast('✅ Link kopyalandı!');
  } catch (e) {
    showToast('❌ Kopyalanamadı');
  }
  ta.remove();
}

const copyLinkBtn = document.getElementById('copyLinkBtn');
if (copyLinkBtn) copyLinkBtn.addEventListener('click', copyInvitationLink);

// ============================================================
// 10) TAKVİME EKLE
// ============================================================
function addToCalendar() {
  const title = encodeURIComponent('Ayşe & Mehmet Düğünü');
  const details = encodeURIComponent('Marmara Düğün Salonu, İstanbul');
  const location = encodeURIComponent('Marmara Düğün Salonu, İstanbul');
  const dates = '20270815T140000Z/20270815T200000Z';

  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  window.open(url, '_blank');
}

// ============================================================
// 11) ANI DEFTERİ
// ============================================================
const guestbookForm = document.getElementById('guestbookForm');
const guestbookNotes = document.getElementById('guestbookNotes');

function loadGuestNotes() {
  const saved = JSON.parse(localStorage.getItem('guestbook_dugun') || '[]');
  saved.forEach(n => addNoteToDOM(n.name, n.msg, false));
}

function addNoteToDOM(name, msg, save = true) {
  const note = document.createElement('div');
  note.className = 'guest-note';
  note.innerHTML = `
    <div class="guest-note__avatar">${escapeHtml(name.charAt(0).toUpperCase())}</div>
    <div class="guest-note__body">
      <strong>${escapeHtml(name)}</strong>
      <p>${escapeHtml(msg)}</p>
    </div>
  `;
  guestbookNotes.insertBefore(note, guestbookNotes.firstChild);

  if (save) {
    const saved = JSON.parse(localStorage.getItem('guestbook_dugun') || '[]');
    saved.unshift({ name, msg });
    localStorage.setItem('guestbook_dugun', JSON.stringify(saved.slice(0, 50)));
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}

if (guestbookForm) {
  loadGuestNotes();
  guestbookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('guestName').value.trim();
    const msg = document.getElementById('guestMsg').value.trim();
    if (!name || !msg) return;
    addNoteToDOM(name, msg);
    guestbookForm.reset();
    showToast('💕 Notunuz eklendi, teşekkürler!');
  });
}

// ============================================================
// 12) SÜRPRİZ — KONFETİ
// ============================================================
function surprise() {
  startConfetti();
  showToast('🎉 Tebrikler! Mutluluklar dileriz 💕');
}

function startConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  canvas.classList.add('active');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#d4a5a5', '#b8926a', '#d4b48a', '#e8c4c4', '#ffd33d', '#b88080', '#fff'];
  const confetti = [];

  for (let i = 0; i < 200; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vy: Math.random() * 3 + 2,
      vx: Math.random() * 2 - 1,
      rot: Math.random() * 360,
      rotSpeed: Math.random() * 8 - 4
    });
  }

  let frames = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti.forEach(c => {
      c.y += c.vy;
      c.x += c.vx;
      c.rot += c.rotSpeed;
      if (c.y > canvas.height) c.y = -10;

      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate((c.rot * Math.PI) / 180);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
      ctx.restore();
    });

    frames++;
    if (frames < 300) {
      requestAnimationFrame(animate);
    } else {
      canvas.classList.remove('active');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  animate();
}

// ============================================================
// 13) YAPRAKLAR — ANINDA BAŞLAT
// ============================================================
function createPetals() {
  const container = document.getElementById('petals');
  if (!container) return;
  container.innerHTML = '';

  const emojis = ['🌸', '🌺', '🍃', '🌹', '💮', '🌷', '💐'];
  const count = window.innerWidth < 600 ? 20 : 30;

  for (let i = 0; i < count; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    petal.style.left = Math.random() * 100 + '%';
    petal.style.animationDuration = (Math.random() * 5 + 8) + 's';
    petal.style.animationDelay = (Math.random() * 6) + 's';
    petal.style.fontSize = (Math.random() * 0.6 + 1.2) + 'rem';
    container.appendChild(petal);
  }
}

// Sayfa hazır olur olmaz başlat
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createPetals);
} else {
  createPetals();
}

// ============================================================
// 14) TOAST
// ============================================================
function showToast(message) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: var(--gold-dark);
    color: #fff;
    padding: 14px 28px;
    border-radius: 999px;
    font-family: var(--sans);
    font-size: 0.9rem;
    letter-spacing: 0.05em;
    box-shadow: 0 15px 40px rgba(139, 111, 78, 0.4);
    z-index: 3000;
    transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
    white-space: nowrap;
    max-width: 90vw;
    overflow: hidden;
    text-overflow: ellipsis;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(100px)';
    setTimeout(() => toast.remove(), 400);
  }, 2800);
    }
