(() => {
  "use strict";

  const EVENT_START = Date.parse("2026-11-28T00:00:00+05:30");
  const EVENT_END = Date.parse("2026-11-29T00:00:00+05:30");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const welcome = document.getElementById("welcome");
  const page = document.getElementById("page");
  const openButton = document.getElementById("open-invitation");
  const toastElement = document.getElementById("toast");
  let toastTimeout;
  let opening = false;
  let opened = false;

  function toast(message) {
    window.clearTimeout(toastTimeout);
    toastElement.textContent = message;
    toastElement.classList.add("show");
    toastTimeout = window.setTimeout(() => toastElement.classList.remove("show"), 5000);
  }

  function finishOpening() {
    welcome.hidden = true;
    welcome.classList.remove("opening", "departing");
    page.inert = false;
    page.removeAttribute("aria-hidden");
    document.body.classList.remove("sealed");
    opening = false;
    opened = true;
    openButton.disabled = false;
    const target = document.querySelector(location.hash === "#celebration" ? "#celebration-title" : "#names");
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    if (location.hash === "#celebration") target.scrollIntoView();
  }

  function openInvitation() {
    if (opening || opened) return;
    opening = true;
    openButton.disabled = true;
    if (reducedMotion.matches) {
      finishOpening();
      return;
    }
    welcome.classList.add("opening");
    window.setTimeout(() => welcome.classList.add("departing"), 1300);
    window.setTimeout(finishOpening, 2350);
  }

  function showEnvelope() {
    opened = false;
    window.scrollTo({ top: 0, behavior: "instant" });
    page.inert = true;
    page.setAttribute("aria-hidden", "true");
    document.body.classList.add("sealed");
    welcome.hidden = false;
    openButton.focus({ preventScroll: true });
  }

  openButton.addEventListener("click", openInvitation);
  document.getElementById("replay").addEventListener("click", showEnvelope);
  document.querySelector(".skip-link").addEventListener("click", () => {
    if (!opened) {
      // Skip links bypass the decorative opening, including in reduced-motion mode.
      finishOpening();
    }
  });
  const guestName = new URLSearchParams(location.search).get("to");
  if (guestName && guestName.trim()) {
    document.getElementById("guest").textContent = `Especially for ${guestName.trim().slice(0, 100)}`;
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(element => observer.observe(element));
    document.documentElement.classList.add("enhanced");
  }

  let parallaxPending = false;
  const hero = document.getElementById("beginning");
  window.addEventListener("scroll", () => {
    if (parallaxPending || reducedMotion.matches || window.scrollY > hero.offsetHeight) return;
    parallaxPending = true;
    requestAnimationFrame(() => {
      hero.style.setProperty("--parallax", `${Math.min(window.scrollY * 0.12, 100)}px`);
      parallaxPending = false;
    });
  }, { passive: true });

  const countdown = document.getElementById("countdown");
  const countdownNote = document.getElementById("countdown-note");
  const countdownTitle = document.getElementById("countdown-title");
  function updateCountdown() {
    const now = Date.now();
    const remaining = Math.max(0, Math.floor((EVENT_START - now) / 1000));
    const parts = {
      days: Math.floor(remaining / 86400),
      hours: Math.floor(remaining / 3600) % 24,
      minutes: Math.floor(remaining / 60) % 60,
      seconds: remaining % 60
    };
    for (const [key, value] of Object.entries(parts)) {
      document.getElementById(key).textContent = String(value).padStart(2, "0");
    }
    countdown.hidden = now >= EVENT_START;
    if (now < EVENT_START) {
      countdownNote.textContent = "Until 28 November begins · India Standard Time";
    } else if (now < EVENT_END) {
      countdownTitle.textContent = "Today, our always begins.";
      countdownNote.textContent = "It's our engagement day. We can't wait to celebrate with you.";
    } else {
      countdownTitle.textContent = "A beautiful beginning, forever treasured.";
      countdownNote.textContent = "28 November 2026 · Thank you for being part of our story.";
    }
  }
  updateCountdown();
  let countdownInterval = window.setInterval(updateCountdown, 1000);

  const musicButton = document.getElementById("music-toggle");
  const musicLabel = document.getElementById("music-label");
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  let audioContext;
  let masterGain;
  let musicInterval;
  let musicWanted = false;
  let noteIndex = 0;
  const liveVoices = new Set();
  // An original, quiet music-box pattern; no recordings or third-party music.
  const melody = [261.63, 329.63, 392, 523.25, 440, 329.63, 392, 329.63,
    220, 261.63, 349.23, 440, 392, 329.63, 293.66, 261.63];

  function setMusicUI(playing) {
    musicButton.setAttribute("aria-pressed", String(playing));
    musicButton.setAttribute("aria-label", playing ? "Pause gentle instrumental music" : "Play gentle instrumental music");
    musicLabel.textContent = playing ? "Sound on" : "Sound off";
  }

  function stopMusic() {
    window.clearInterval(musicInterval);
    musicInterval = undefined;
    if (masterGain && audioContext) {
      masterGain.gain.cancelScheduledValues(audioContext.currentTime);
      masterGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.08);
    }
    for (const oscillator of liveVoices) {
      oscillator.stop();
    }
    liveVoices.clear();
    setMusicUI(false);
  }

  function playNote() {
    if (!audioContext || audioContext.state !== "running" || !musicWanted) return;
    const now = audioContext.currentTime;
    const fundamental = melody[noteIndex % melody.length];
    for (const [multiple, volume] of [[1, 0.36], [2, 0.06], [3, 0.018]]) {
      const oscillator = audioContext.createOscillator();
      const envelope = audioContext.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = fundamental * multiple;
      envelope.gain.setValueAtTime(0, now);
      envelope.gain.linearRampToValueAtTime(volume, now + 0.016);
      envelope.gain.exponentialRampToValueAtTime(0.001, now + 2.6);
      oscillator.connect(envelope);
      envelope.connect(masterGain);
      liveVoices.add(oscillator);
      oscillator.onended = () => {
        liveVoices.delete(oscillator);
        oscillator.disconnect();
        envelope.disconnect();
      };
      oscillator.start(now);
      oscillator.stop(now + 2.7);
    }
    noteIndex += 1;
  }

  async function startMusic() {
    try {
      if (!audioContext) {
        audioContext = new AudioContextClass();
        masterGain = audioContext.createGain();
        masterGain.gain.value = 0;
        masterGain.connect(audioContext.destination);
      }
      await audioContext.resume();
      if (!musicWanted || document.hidden) return;
      if (audioContext.state !== "running") throw new Error(`Audio context is ${audioContext.state}`);
      masterGain.gain.setTargetAtTime(0.14, audioContext.currentTime, 0.2);
      window.clearInterval(musicInterval);
      playNote();
      musicInterval = window.setInterval(playNote, 620);
      setMusicUI(true);
    } catch (error) {
      musicWanted = false;
      stopMusic();
      console.error("Invitation music could not start:", error);
      toast("Music couldn't start in this browser. The invitation is still ready to enjoy.");
    }
  }

  musicButton.addEventListener("click", () => {
    musicWanted = !musicWanted;
    if (musicWanted) startMusic();
    else stopMusic();
  });
  if (AudioContextClass) musicButton.hidden = false;

  document.addEventListener("visibilitychange", () => {
    document.body.classList.toggle("tab-hidden", document.hidden);
    if (document.hidden) {
      window.clearInterval(countdownInterval);
      stopMusic();
    } else {
      updateCountdown();
      window.clearInterval(countdownInterval);
      countdownInterval = window.setInterval(updateCountdown, 1000);
      if (musicWanted) startMusic();
    }
  });
  window.addEventListener("pagehide", stopMusic);

  const shareDialog = document.getElementById("share-dialog");
  const shareInput = document.getElementById("share-url");
  const shareFeedback = document.getElementById("share-feedback");
  document.getElementById("share").addEventListener("click", async () => {
    if (location.protocol === "file:" || ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname)) {
      toast("Publish on GitHub Pages first, then share the live invitation link.");
      return;
    }
    const url = new URL(location.href);
    url.search = "";
    url.hash = "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Samridhi & Piyush — You're invited",
          text: "Join us for our engagement on 28 November 2026 at The Cove, Panchkula.",
          url: url.href
        });
        return;
      } catch (error) {
        if (error.name === "AbortError") return;
        console.warn("Native sharing unavailable; opening link sharing:", error);
      }
    }
    shareInput.value = url.href;
    shareFeedback.textContent = "";
    shareDialog.showModal();
    shareInput.focus();
    shareInput.select();
  });
  document.getElementById("close-share").addEventListener("click", () => shareDialog.close());
  document.getElementById("copy-link").addEventListener("click", async () => {
    try {
      if (!navigator.clipboard) {
        shareInput.focus();
        shareInput.select();
        shareFeedback.textContent = "Use your device's Copy command to copy the selected link.";
        return;
      }
      await navigator.clipboard.writeText(shareInput.value);
      shareFeedback.textContent = "Link copied. Send a little love along.";
    } catch (error) {
      console.warn("Clipboard access was denied:", error);
      shareInput.focus();
      shareInput.select();
      shareFeedback.textContent = "Copy wasn't allowed. Use your device's Copy command on the selected link.";
    }
  });
  document.getElementById("closing-actions").hidden = false;

  // Enhance only after everything above is ready; without JS the whole letter is readable.
  showEnvelope();
})();
