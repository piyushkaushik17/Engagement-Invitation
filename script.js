'use strict';

const EVENT = Object.freeze({
  title: 'Piyush & Samridhi — Engagement Ceremony',
  startDate: '20261128',
  endDate: '20261129',
  dayStart: '2026-11-28T00:00:00+05:30',
  dayEnd: '2026-11-29T00:00:00+05:30',
  venue: 'The Cove, Sector 5, Panchkula, Haryana, India',
  map: 'https://maps.app.goo.gl/BYGhpzSYVJ5wRxBEA'
});

const screen = document.getElementById('envelope-screen');
const invitation = document.getElementById('invitation');
const openButton = document.getElementById('open-envelope');
const music = document.getElementById('background-music');
const soundButton = document.getElementById('sound-button');
const film = document.getElementById('film-dialog');
const video = document.getElementById('invitation-video');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let opening = false;
let toastTimeout;
let musicBeforeFilm = false;
let revealObserver;
let sceneObserver;
let openingTimer;
let departureTimer;
let petalTimer;
let motionFrame = 0;
let motionTime = 0;
let motionScroll = 0;
let parallaxItems = [];
const revealSelector = [
  '.intro > .small-flower', '.intro > .eyebrow', '.intro > h2', '.intro > .body-copy',
  '.families > *', '.celebration-heading > *', '.date-card', '.venue-card',
  '.countdown-section > *', '.memory-frame > :not(noscript)', '.site-footer > *'
].join(',');
const revealItems = [...document.querySelectorAll(revealSelector)];
revealItems.forEach(item => {
  item.classList.add('reveal-item');
  const siblings = [...item.parentElement.children].filter(child => child.matches(revealSelector));
  item.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(item), 4) * 85}ms`);
});
document.querySelector('.date-card').style.setProperty('--reveal-x', '-14px');
document.querySelector('.venue-card').style.setProperty('--reveal-x', '14px');

document.body.classList.add('locked');
invitation.inert = true;
const guest = new URLSearchParams(window.location.search).get('to')?.trim().slice(0, 80);
if (guest) document.getElementById('guest-line').textContent = `Especially for ${guest}`;

function notify(message) {
  const toast = document.getElementById('toast');
  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimeout = setTimeout(() => toast.classList.remove('visible'), 5500);
}

function revealSections() {
  revealObserver?.disconnect();
  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    revealItems.forEach(item => item.classList.remove('awaiting'));
    return;
  }
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('awaiting');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -5% 0px' });
  revealItems.forEach(item => {
    item.classList.add('awaiting');
    revealObserver.observe(item);
  });
}

function layoutTop(element) {
  let top = 0;
  for (let current = element; current; current = current.offsetParent) top += current.offsetTop;
  return top;
}

function measureMotion() {
  const mobileScale = window.innerWidth <= 760 ? 0.55 : 1;
  parallaxItems = [...document.querySelectorAll('[data-parallax]')].map(element => ({
    element, top: layoutTop(element), height: element.offsetHeight,
    distance: Number(element.dataset.parallax) * mobileScale
  }));
  requestMotion();
}

function renderMotion(timestamp) {
  motionFrame = 0;
  if (!document.documentElement.classList.contains('is-open') || document.hidden) return;
  const scroll = Math.max(0, window.scrollY);
  const elapsed = motionTime ? Math.min(timestamp - motionTime, 64) : 16;
  motionTime = timestamp;
  const difference = scroll - motionScroll;
  motionScroll = reducedMotion.matches ? scroll : motionScroll + difference * (1 - Math.exp(-elapsed / 85));
  const height = window.innerHeight;
  const extent = Math.max(1, document.documentElement.scrollHeight - height);
  document.documentElement.style.setProperty('--journey-progress', String(Math.min(1, scroll / extent)));
  if (!reducedMotion.matches) {
    parallaxItems.forEach(item => {
      const relativeTop = item.top - motionScroll;
      if (relativeTop > height + 150 || relativeTop + item.height < -150) return;
      const progress = Math.max(-0.65, Math.min(0.65, (height / 2 - relativeTop - item.height / 2) / (height + item.height)));
      item.element.style.setProperty('--drift-y', `${(progress * item.distance).toFixed(2)}px`);
    });
  }
  if (!reducedMotion.matches && Math.abs(difference) > 0.25) requestMotion();
}

function requestMotion() {
  if (!motionFrame && document.documentElement.classList.contains('is-open') && !document.hidden) {
    motionFrame = requestAnimationFrame(renderMotion);
  }
}

function pauseMotion() {
  cancelAnimationFrame(motionFrame);
  motionFrame = 0;
  motionTime = 0;
}

function finishOpening() {
  if (!opening || !screen.classList.contains('departing')) return;
  clearTimeout(departureTimer);
  screen.hidden = true;
}

screen.addEventListener('transitionend', event => {
  if (event.target === screen && event.propertyName === 'opacity') finishOpening();
});
window.addEventListener('scroll', requestMotion, { passive: true });
window.addEventListener('resize', measureMotion, { passive: true });
invitation.addEventListener('focusin', event => {
  event.target.closest('.reveal-item')?.classList.remove('awaiting');
});
if ('IntersectionObserver' in window) {
  sceneObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    entry.target.classList.toggle('in-view', entry.isIntersecting);
  }));
  document.querySelectorAll('.hero,.memory-section').forEach(scene => sceneObserver.observe(scene));
}
if ('ResizeObserver' in window) new ResizeObserver(measureMotion).observe(invitation);
document.fonts?.ready.then(measureMotion);
reducedMotion.addEventListener('change', () => {
  pauseMotion();
  if (reducedMotion.matches) {
    revealObserver?.disconnect();
    revealItems.forEach(item => item.classList.remove('awaiting'));
    parallaxItems.forEach(item => item.element.style.removeProperty('--drift-y'));
    document.getElementById('petals').replaceChildren();
    if (opening && !screen.hidden) {
      clearTimeout(openingTimer);
      revealInvitation();
      finishOpening();
    }
  }
  motionScroll = window.scrollY;
  measureMotion();
});

function scatterPetals() {
  if (reducedMotion.matches) return;
  const container = document.getElementById('petals');
  clearTimeout(petalTimer);
  container.replaceChildren();
  for (let index = 0; index < 22; index++) {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.style.left = `${Math.random() * 95}%`;
    petal.style.animationDelay = `${Math.random() * 1.1}s`;
    petal.style.animationDuration = `${3 + Math.random() * 1.5}s`;
    container.append(petal);
  }
  petalTimer = setTimeout(() => container.replaceChildren(), 6000);
}

function revealInvitation() {
  revealSections();
  document.documentElement.classList.add('is-open');
  invitation.inert = false;
  document.body.classList.remove('locked');
  window.scrollTo({ top: 0, behavior: 'instant' });
  motionScroll = 0;
  motionTime = 0;
  measureMotion();
  screen.classList.add('departing');
  document.getElementById('couple-names').focus({ preventScroll: true });
  scatterPetals();
  // transitionend handles the handoff; the timer also covers interrupted transitions.
  if (reducedMotion.matches) finishOpening();
  else departureTimer = setTimeout(finishOpening, 1250);
}

function openInvitation() {
  if (opening) return;
  opening = true;
  openButton.disabled = true;
  screen.classList.add('opening');
  openingTimer = setTimeout(revealInvitation, reducedMotion.matches ? 0 : 1100);
}

openButton.addEventListener('click', openInvitation);
document.getElementById('replay-envelope').addEventListener('click', () => {
  music.pause();
  clearTimeout(openingTimer);
  clearTimeout(departureTimer);
  clearTimeout(petalTimer);
  pauseMotion();
  document.getElementById('petals').replaceChildren();
  screen.hidden = false;
  screen.classList.remove('opening', 'departing');
  document.documentElement.classList.remove('is-open');
  document.body.classList.add('locked');
  invitation.inert = true;
  opening = false;
  openButton.disabled = false;
  openButton.focus({ preventScroll: true });
});

function updateCountdown(now = Date.now()) {
  const start = new Date(EVENT.dayStart).getTime();
  const end = new Date(EVENT.dayEnd).getTime();
  let remaining = Math.max(0, Math.floor((start - now) / 1000));
  const values = {
    days: Math.floor(remaining / 86400),
    hours: Math.floor(remaining % 86400 / 3600),
    minutes: Math.floor(remaining % 3600 / 60),
    seconds: remaining % 60
  };
  Object.entries(values).forEach(([key, value]) => {
    document.getElementById(key).textContent = String(value).padStart(2, '0');
  });
  if (now >= start) {
    document.getElementById('countdown-caption').textContent = now < end
      ? "Today's the day. Let's celebrate!"
      : 'Our forever has begun. Thank you for your love.';
  } else {
    document.getElementById('countdown-caption').textContent = 'Counting down to our beautiful beginning';
  }
}
updateCountdown();
setInterval(updateCountdown, 1000);
document.addEventListener('visibilitychange', () => {
  document.documentElement.classList.toggle('motion-paused', document.hidden);
  if (document.hidden) {
    music.pause();
    pauseMotion();
  } else {
    updateCountdown();
    motionScroll = window.scrollY;
    measureMotion();
  }
});

function escapeCalendar(value) {
  return value.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
}

function calendarFile() {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Piyush and Samridhi//Engagement Invitation//EN',
    'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
    'UID:piyush-samridhi-engagement-20261128@invitation.local',
    `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${EVENT.startDate}`, `DTEND;VALUE=DATE:${EVENT.endDate}`,
    `SUMMARY:${escapeCalendar(EVENT.title)}`, `LOCATION:${escapeCalendar(EVENT.venue)}`,
    `DESCRIPTION:${escapeCalendar(`Together with the Kaushik & Sharma families, join us to celebrate our engagement. Ceremony time will be shared by the families.\nDirections: ${EVENT.map}`)}`,
    `URL:${EVENT.map}`, 'TRANSP:TRANSPARENT', 'END:VEVENT', 'END:VCALENDAR'
  ];
  // Fold by UTF-8 bytes, as calendar clients require lines no longer than 75 octets.
  const encoder = new TextEncoder();
  return lines.map(line => {
    let folded = '';
    let width = 0;
    for (const character of line) {
      const bytes = encoder.encode(character).length;
      if (width + bytes > 75) { folded += '\r\n '; width = 1; }
      folded += character;
      width += bytes;
    }
    return folded;
  }).join('\r\n') + '\r\n';
}

document.querySelectorAll('[data-calendar]').forEach(button => button.addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob([calendarFile()], { type: 'text/calendar;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Piyush-and-Samridhi-28-November-2026.ics';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
  notify('Calendar file ready. Open it to save the date; ceremony time will follow.');
}));

function syncMusicState() {
  const playing = !music.paused;
  soundButton.setAttribute('aria-pressed', String(playing));
  soundButton.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
  soundButton.title = playing ? 'Pause background music' : 'Play background music';
  document.getElementById('sound-label').textContent = playing ? 'Music on' : 'Music off';
}
music.volume = 0.35;
music.addEventListener('play', syncMusicState);
music.addEventListener('pause', syncMusicState);
music.addEventListener('error', () => notify('The music could not load. You can still enjoy the invitation.'));
soundButton.addEventListener('click', async () => {
  if (!music.paused) { music.pause(); return; }
  try { await music.play(); }
  catch (error) {
    console.error('Background music playback failed:', error);
    notify('Music could not start. Please tap the music button to try again.');
    syncMusicState();
  }
});

document.getElementById('watch-film').addEventListener('click', () => {
  musicBeforeFilm = !music.paused;
  music.pause();
  film.showModal();
  video.play().catch(error => {
    console.warn('Invitation video needs manual playback:', error);
    notify('Tap the video play control to start the invitation.');
  });
});
document.getElementById('close-film').addEventListener('click', () => film.close());
film.addEventListener('click', event => {
  if (event.target !== film) return;
  const bounds = film.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) film.close();
});
film.addEventListener('close', () => {
  video.pause();
  if (musicBeforeFilm && !document.hidden) music.play().catch(error => {
    console.warn('Background music could not resume:', error);
    notify('Tap the music button to resume background music.');
  });
});
video.addEventListener('error', () => notify('The video could not load. Please check your connection and try again.'));

document.getElementById('share-invitation').addEventListener('click', async () => {
  const url = new URL(window.location.href);
  url.hash = '';
  url.search = '';
  const text = "You're invited to Piyush & Samridhi's engagement! 28 November 2026 · The Cove, Panchkula.";
  if (!['http:', 'https:'].includes(url.protocol) || ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) {
    notify('Publish this folder on GitHub Pages first to share a public invitation link.');
    return;
  }
  try {
    if (navigator.share) await navigator.share({ title: EVENT.title, text, url: url.href });
    else if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url.href);
      notify('Invitation link copied. Send a little love!');
    } else {
      notify('Copy the invitation link from your browser address bar to share it.');
    }
  } catch (error) {
    if (error.name === 'AbortError') return;
    console.error('Sharing the invitation failed:', error);
    notify('Sharing was unavailable. Copy the link from your browser address bar.');
  }
});
