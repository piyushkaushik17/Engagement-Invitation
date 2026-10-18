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

const root = document.documentElement;
const envelopeScreen = document.getElementById('envelope-screen');
const invitation = document.getElementById('invitation');
const openButton = document.getElementById('open-envelope');
const story = document.getElementById('story');
const stage = document.getElementById('story-stage');
const scenes = [...document.querySelectorAll('[data-scene]')];
const dots = [...document.querySelectorAll('.chapter-dots [data-chapter]')];
const chapterNames = ['The beginning', 'Our families', 'The celebration', 'With love'];
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.getElementById('motion-button');
const music = document.getElementById('background-music');
const soundButton = document.getElementById('sound-button');
const film = document.getElementById('film-dialog');
const video = document.getElementById('invitation-video');
let motionEnabled = !motionPreference.matches;
let explicitMotionChoice = null;
let isOpen = false;
let opening = false;
let activeChapter = -1;
let renderedPosition = 0;
let chapterStep = 600;
let storyTop = 0;
let frame = 0;
let lastFrame = 0;
let focusChapter = null;
let openingTimer;
let departureTimer;
let entranceTimer;
let toastTimer;
let musicBeforeFilm = false;

document.body.classList.add('locked');
invitation.inert = true;
const guest = new URLSearchParams(location.search).get('to')?.trim().slice(0, 80);
if (guest) document.getElementById('guest-line').textContent = `Especially for ${guest}`;

function notify(message) {
  const toast = document.getElementById('toast');
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 5500);
}

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

function activateChapter(index) {
  if (index === activeChapter) return;
  const focusedScene = scenes.find(scene => scene.contains(document.activeElement));
  activeChapter = index;
  scenes.forEach((scene, sceneIndex) => {
    const active = sceneIndex === index;
    scene.classList.toggle('is-active', active);
    scene.inert = !active;
    scene.setAttribute('aria-hidden', String(!active));
  });
  dots.forEach((dot, dotIndex) => {
    if (dotIndex === index) dot.setAttribute('aria-current', 'step');
    else dot.removeAttribute('aria-current');
  });
  if (focusedScene && focusedScene !== scenes[index] && isOpen) dots[index].focus({ preventScroll: true });
  document.getElementById('chapter-number').textContent = String(index + 1).padStart(2, '0');
  document.getElementById('chapter-label').textContent = chapterNames[index];
  const last = index === scenes.length - 1;
  document.getElementById('next-label').textContent = last ? 'Back to the beginning' : 'Scroll to unfold';
  document.getElementById('next-chapter').setAttribute('aria-label', last ? 'Back to chapter 1' : `Next: ${chapterNames[index + 1]}`);
  document.querySelector('.scroll-arrow').textContent = last ? '↑' : '↓';
  stage.dataset.chapterIndex = String(index);
}

function paintStory(position) {
  const index = clamp(Math.round(position), 0, scenes.length - 1);
  activateChapter(index);
  scenes.forEach((scene, sceneIndex) => {
    const distance = sceneIndex - position;
    const progress = clamp(Math.abs(distance) / 0.88, 0, 1);
    const fade = 1 - progress * progress * (3 - 2 * progress);
    scene.style.setProperty('--scene-opacity', motionEnabled ? fade.toFixed(4) : String(sceneIndex === index ? 1 : 0));
    scene.style.setProperty('--scene-y', motionEnabled ? `${(distance * stage.clientHeight * 0.48).toFixed(2)}px` : '0px');
    scene.style.setProperty('--scene-scale', motionEnabled ? String(1 - Math.min(Math.abs(distance), 1) * 0.07) : '1');
  });
  stage.style.setProperty('--story-progress', String(position / (scenes.length - 1)));
  stage.style.setProperty('--world-shift', motionEnabled ? `${position * -29}px` : '0px');
  stage.style.setProperty('--world-turn', motionEnabled ? `${position * 65}deg` : '0deg');
  stage.style.setProperty('--garden-scale', motionEnabled ? String(1 + position * 0.055) : '1');
  if (focusChapter !== null && Math.abs(position - focusChapter) < 0.015) {
    scenes[focusChapter].querySelector('h1,h2').focus({ preventScroll: true });
    focusChapter = null;
  }
}

function renderStory(timestamp) {
  frame = 0;
  if (!isOpen || document.hidden) return;
  const target = clamp((window.scrollY - storyTop) / chapterStep, 0, scenes.length - 1);
  const elapsed = lastFrame ? Math.min(timestamp - lastFrame, 64) : 16;
  lastFrame = timestamp;
  const difference = target - renderedPosition;
  renderedPosition = motionEnabled ? renderedPosition + difference * (1 - Math.exp(-elapsed / 70)) : target;
  if (Math.abs(target - renderedPosition) < 0.0005) renderedPosition = target;
  paintStory(renderedPosition);
  if (Math.abs(target - renderedPosition) >= 0.0005) requestStoryFrame();
}

function requestStoryFrame() {
  if (!frame && isOpen && !document.hidden) frame = requestAnimationFrame(renderStory);
}

function pauseRendering() {
  cancelAnimationFrame(frame);
  frame = 0;
  lastFrame = 0;
}

function measureStory() {
  chapterStep = Math.max(600, stage.clientHeight * 1.05);
  story.style.setProperty('--scroll-span', `${chapterStep * (scenes.length - 1)}px`);
  storyTop = story.getBoundingClientRect().top + window.scrollY;
  requestStoryFrame();
}

function goToChapter(index, focus = false, instant = false) {
  const target = clamp(index, 0, scenes.length - 1);
  if (focus) focusChapter = target;
  window.scrollTo({
    top: storyTop + chapterStep * target,
    behavior: motionEnabled && !instant ? 'smooth' : 'instant'
  });
  requestStoryFrame();
}

document.querySelectorAll('[data-chapter]').forEach(button => button.addEventListener('click', event => {
  event.preventDefault();
  goToChapter(Number(button.dataset.chapter), button.classList.contains('skip-link'));
}));
document.getElementById('next-chapter').addEventListener('click', () => {
  goToChapter(activeChapter === scenes.length - 1 ? 0 : activeChapter + 1);
});
window.addEventListener('scroll', requestStoryFrame, { passive: true });
window.addEventListener('resize', measureStory, { passive: true });
if ('ResizeObserver' in window) new ResizeObserver(measureStory).observe(stage);
document.fonts?.ready.then(measureStory);
measureStory();
paintStory(0);

function syncMotion() {
  root.dataset.motion = motionEnabled ? 'on' : 'off';
  motionButton.setAttribute('aria-pressed', String(motionEnabled));
  motionButton.setAttribute('aria-label', motionEnabled ? 'Turn animations off' : 'Turn animations on');
  document.getElementById('motion-label').textContent = motionEnabled ? 'Motion on' : 'Motion off';
  pauseRendering();
  if (!motionEnabled && opening && !isOpen) {
    clearTimeout(openingTimer);
    revealInvitation();
  }
  if (!motionEnabled && envelopeScreen.classList.contains('departing')) finishOpening();
  if (isOpen) {
    renderedPosition = clamp((window.scrollY - storyTop) / chapterStep, 0, scenes.length - 1);
    paintStory(renderedPosition);
  }
}
motionButton.addEventListener('click', () => {
  motionEnabled = !motionEnabled;
  explicitMotionChoice = motionEnabled;
  syncMotion();
  notify(motionEnabled ? 'Animations on. Scroll or use the chapter dots to unfold the invitation.' : 'Animations off. All chapters remain available using the dots below.');
});
motionPreference.addEventListener('change', () => {
  if (explicitMotionChoice !== null) return;
  motionEnabled = !motionPreference.matches;
  syncMotion();
});
syncMotion();

function finishOpening() {
  if (!envelopeScreen.classList.contains('departing')) return;
  clearTimeout(departureTimer);
  envelopeScreen.hidden = true;
}

function revealInvitation() {
  if (isOpen) return;
  isOpen = true;
  root.classList.add('is-open', 'is-entering');
  invitation.inert = false;
  document.body.classList.remove('locked');
  window.scrollTo({ top: 0, behavior: 'instant' });
  renderedPosition = 0;
  measureStory();
  paintStory(0);
  envelopeScreen.classList.add('departing');
  document.getElementById('couple-names').focus({ preventScroll: true });
  entranceTimer = setTimeout(() => root.classList.remove('is-entering'), 2600);
  if (motionEnabled) departureTimer = setTimeout(finishOpening, 1400);
  else finishOpening();
}

envelopeScreen.addEventListener('transitionend', event => {
  if (event.target === envelopeScreen && event.propertyName === 'opacity') finishOpening();
});
openButton.addEventListener('click', () => {
  if (opening) return;
  opening = true;
  openButton.disabled = true;
  envelopeScreen.classList.add('opening');
  openingTimer = setTimeout(revealInvitation, motionEnabled ? 1050 : 0);
});
document.getElementById('replay-envelope').addEventListener('click', () => {
  music.pause();
  clearTimeout(openingTimer);
  clearTimeout(departureTimer);
  clearTimeout(entranceTimer);
  pauseRendering();
  isOpen = false;
  opening = false;
  focusChapter = null;
  invitation.inert = true;
  root.classList.remove('is-open', 'is-entering');
  envelopeScreen.hidden = false;
  envelopeScreen.classList.remove('opening', 'departing');
  document.body.classList.add('locked');
  window.scrollTo({ top: 0, behavior: 'instant' });
  renderedPosition = 0;
  paintStory(0);
  openButton.disabled = false;
  openButton.focus({ preventScroll: true });
});

function updateCountdown(now = Date.now()) {
  const start = new Date(EVENT.dayStart).getTime();
  const end = new Date(EVENT.dayEnd).getTime();
  const remaining = Math.max(0, Math.floor((start - now) / 1000));
  const values = {
    days: Math.floor(remaining / 86400),
    hours: Math.floor(remaining % 86400 / 3600),
    minutes: Math.floor(remaining % 3600 / 60),
    seconds: remaining % 60
  };
  Object.entries(values).forEach(([key, value]) => {
    document.getElementById(key).textContent = String(value).padStart(2, '0');
  });
  document.getElementById('countdown-caption').textContent = now < start ? 'Until our engagement day'
    : now < end ? "Today's the day. Let's celebrate!" : 'Our forever has begun. Thank you for your love.';
}
updateCountdown();
setInterval(updateCountdown, 1000);
document.addEventListener('visibilitychange', () => {
  root.classList.toggle('motion-paused', document.hidden);
  if (document.hidden) {
    music.pause();
    pauseRendering();
  } else {
    updateCountdown();
    measureStory();
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
  // Calendar content lines are folded at 75 UTF-8 octets, including continuation spaces.
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
  const url = new URL(location.href);
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
    } else notify('Copy the invitation link from your browser address bar to share it.');
  } catch (error) {
    if (error.name === 'AbortError') return;
    console.error('Sharing the invitation failed:', error);
    notify('Sharing was unavailable. Copy the link from your browser address bar.');
  }
});
