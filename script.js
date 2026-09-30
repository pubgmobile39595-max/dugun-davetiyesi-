/* ============================================================
   DÜĞÜN DAVETİYESİ
   ============================================================ */

// --- Elemanlar ---
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

  // Müziği başlat (kullanıcı etkileşimi gerektiği için burada)
  playMusic();
});

// Sayfa ilk açıldığında scroll'u kilitle
document.body.style.overflow = 'hidden';

// ============================================================
// 2) GERİ SAYIM
// ============================================================
// Düğün tarihi — BURAYI DEĞİŞTİR
const weddingDate = new Date('2026-08-15T17:00:00').getTime();

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
// 3) MÜZİK KONTROLÜ
// ============================================================
let isPlaying = false;

function playMusic() {
  bgMusic.volume = 0.4;
  bgMusic.play().then(() => {
    isPlaying = true;
    musicBtn.classList.add('playing');
  }).catch(() => {
    // Müzik dosyası yoksa veya tarayıcı engelliyorsa sessizce geç
    console.log('Müzik başlatılamadı (dosya yok veya tarayıcı engeli).');
  });
}

function pauseMusic() {
  bgMusic.pause();
  isPlaying = false;
  musicBtn.classList.remove('playing');
}

musicBtn.addEventListener('click', () => {
  if (isPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
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
// 5) SCROLL REVEAL ANİMASYONU
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

document.querySelectorAll('.story__item, .event-card, .gallery__item, .countdown__box, .rsvp-form, .closing')
  .forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    revealObserver.observe(el);
  });

// ============================================================
// 6) GALERİ TIKLAMA (basit büyütme efekti)
// ============================================================
document.querySelectorAll('.gallery__item').forEach(item => {
  item.addEventListener('click', () => {
    item.style.transform = 'scale(1.15)';
    setTimeout(() => {
      item.style.transform = '';
    }, 300);
  });
});
