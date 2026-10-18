(() => {
  "use strict";
  const root = document.documentElement;
  const body = document.body;
  const main = document.getElementById("invitation");
  const sealScreen = document.getElementById("seal-screen");
  const openButton = document.getElementById("open-invitation");
  const skipIntro = document.getElementById("skip-intro");
  const strip = document.getElementById("filmstrip");
  const stage = document.getElementById("film-stage");
  const scenes = [...document.querySelectorAll("[data-scene]")];
  const titles = ["Our beginning", "Our families", "The engagement", "The venue", "With love"];
  const captions = ["A PROMISE OF FOREVER", "WITH LOVE & BLESSINGS", "28 NOVEMBER 2026", "THE COVE · PANCHKULA", "THE BEST IS YET TO COME"];
  const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
  const motionChoice = new URLSearchParams(location.search).get("motion");
  let motion = motionChoice === "on" ? true : motionChoice === "off" ? false : !motionPreference.matches;
  let motionExplicit = motionChoice === "on" || motionChoice === "off";
  let cinema;
  let opened = false;
  let introducing = false;
  let activeScene = -1;
  let progress = 0;
  let introFrame = 0;
  let introElapsed = 0;
  let previousIntroTime = 0;
  let scrollFrame = 0;
  let focusTimer;
  let toastTimer;
  const toastElement = document.getElementById("toast");
  const requestedScene = scenes.findIndex(scene => `#${scene.id}` === location.hash);

  function toast(text) {
    clearTimeout(toastTimer);
    toastElement.textContent = text;
    toastElement.classList.add("show");
    toastTimer = setTimeout(() => toastElement.classList.remove("show"), 5500);
  }
  function graphicsFailure(error) {
    console.error("Cinematic playback unavailable:", error);
    const message = error.message || "The cinematic background isn't available. The invitation and all details are still accessible.";
    if (!opened) {
      const note = document.getElementById("graphics-note");
      note.textContent = message;
      note.hidden = false;
    } else toast(message);
  }

  const smooth = (a, b, x) => {
    const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };
  function setStory(value) {
    progress = Math.max(0, Math.min(1, value));
    const position = progress * (scenes.length - 1);
    const current = Math.round(position);
    scenes.forEach((scene, index) => {
      const distance = Math.abs(index - position);
      const opacity = 1 - smooth(0.1, 0.83, distance);
      scene.style.opacity = String(opacity);
      scene.style.visibility = opacity > 0.001 ? "visible" : "hidden";
      scene.style.transform = motion ? `translateY(${(index - position) * 58}px)` : "none";
      scene.style.filter = motion && distance > 0.12 ? `blur(${Math.min(5, distance * 3)}px)` : "none";
      scene.inert = index !== current;
      scene.setAttribute("aria-hidden", String(index !== current));
      scene.classList.toggle("is-current", index === current);
    });
    if (current !== activeScene) {
      activeScene = current;
      document.getElementById("chapter-number").textContent = String(current + 1).padStart(2, "0");
      document.getElementById("chapter-label").textContent = titles[current];
      document.getElementById("scene-caption").textContent = captions[current];
      document.getElementById("next-label").textContent = current === scenes.length - 1 ? "BACK TO BEGINNING" : "SCROLL TO UNFOLD";
      document.querySelectorAll(".chapter-dots [data-chapter]").forEach(button => {
        if (Number(button.dataset.chapter) === current) button.setAttribute("aria-current", "step");
        else button.removeAttribute("aria-current");
      });
    }
    stage.style.setProperty("--chapter-light", String(0.1 + Math.min(position, 1) * 0.8));
    document.getElementById("scene-progress").style.transform = `scaleX(${progress})`;
    cinema?.setProgress(progress);
  }
  function updateStory() {
    scrollFrame = 0;
    const top = strip.getBoundingClientRect().top + scrollY;
    const travel = strip.offsetHeight - innerHeight;
    setStory(travel > 0 ? (scrollY - top) / travel : 0);
  }
  function onScroll() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateStory);
  }
  function finishOpening({ focus = true, followHash = false } = {}) {
    cancelAnimationFrame(introFrame);
    introFrame = 0;
    introducing = false;
    opened = true;
    introElapsed = 0;
    body.classList.remove("sealed", "introducing", "names-revealing");
    sealScreen.hidden = true;
    skipIntro.hidden = true;
    main.inert = false;
    main.removeAttribute("aria-hidden");
    cinema?.finishIntro();
    openButton.disabled = false;
    if (followHash && requestedScene > 0) goToScene(requestedScene, true);
    else if (focus) document.getElementById("names").focus({ preventScroll: true });
  }
  function introTick(now) {
    if (!introducing) return;
    introElapsed += Math.max(0, now - previousIntroTime);
    previousIntroTime = now;
    if (introElapsed >= 5500) sealScreen.hidden = true;
    if (introElapsed >= 6500) body.classList.add("names-revealing");
    if (introElapsed >= 10300) {
      finishOpening({ followHash: true });
      return;
    }
    introFrame = requestAnimationFrame(introTick);
  }
  function openInvitation() {
    if (opened || introducing) return;
    if (!motion) {
      finishOpening({ followHash: true });
      return;
    }
    introducing = true;
    openButton.disabled = true;
    body.classList.remove("sealed");
    body.classList.add("introducing");
    skipIntro.hidden = false;
    skipIntro.focus({ preventScroll: true });
    introElapsed = 0;
    previousIntroTime = performance.now();
    cinema?.startIntro();
    introFrame = requestAnimationFrame(introTick);
  }
  function showEnvelope() {
    clearTimeout(focusTimer);
    cancelAnimationFrame(introFrame);
    opened = false;
    introducing = false;
    body.classList.remove("introducing", "names-revealing");
    body.classList.add("sealed");
    main.inert = true;
    main.setAttribute("aria-hidden", "true");
    sealScreen.hidden = false;
    skipIntro.hidden = true;
    openButton.disabled = false;
    window.scrollTo({ top: 0, behavior: "instant" });
    setStory(0);
    cinema?.reset();
    if (!motion) cinema?.setMotion(false);
    openButton.focus({ preventScroll: true });
  }
  function goToScene(index, instant = false) {
    if (!opened) finishOpening({ focus: false });
    const i = Math.max(0, Math.min(scenes.length - 1, index));
    const top = strip.getBoundingClientRect().top + scrollY;
    const travel = strip.offsetHeight - innerHeight;
    window.scrollTo({ top: top + travel * i / (scenes.length - 1), behavior: instant || !motion ? "instant" : "smooth" });
    clearTimeout(focusTimer);
    focusTimer = setTimeout(() => {
      const heading = scenes[i].querySelector("h1,h2");
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }, instant || !motion ? 30 : 950);
  }
  function setMotion(value) {
    motion = value;
    root.dataset.motion = motion ? "on" : "off";
    document.getElementById("motion-toggle").setAttribute("aria-pressed", String(motion));
    document.getElementById("motion-label").textContent = motion ? "Motion on" : "Motion off";
    if (!motion && introducing) finishOpening();
    cinema?.setMotion(motion);
    setStory(progress);
  }
  document.getElementById("motion-toggle").addEventListener("click", () => {
    motionExplicit = true;
    setMotion(!motion);
    if (!opened && !introducing) cinema?.reset();
  });
  motionPreference.addEventListener("change", event => {
    if (!motionExplicit) setMotion(!event.matches);
  });
  openButton.addEventListener("click", openInvitation);
  skipIntro.addEventListener("click", () => finishOpening({ followHash: true }));
  document.getElementById("replay").addEventListener("click", showEnvelope);
  document.getElementById("skip-link").addEventListener("click", event => {
    event.preventDefault();
    finishOpening({ focus: false });
    goToScene(2, true);
  });
  document.querySelectorAll("[data-chapter]").forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      if (!opened && !introducing && button.classList.contains("wordmark")) openInvitation();
      else goToScene(Number(button.dataset.chapter));
    });
  });
  document.getElementById("next-scene").addEventListener("click", () => goToScene(activeScene === 4 ? 0 : activeScene + 1));
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  window.addEventListener("hashchange", () => {
    const index = scenes.findIndex(scene => `#${scene.id}` === location.hash);
    if (index !== -1) goToScene(index);
  });
  const guestName = new URLSearchParams(location.search).get("to");
  if (guestName?.trim()) document.getElementById("guest").textContent = `Especially for ${guestName.trim().slice(0, 100)}`;

  const EVENT_START = Date.parse("2026-11-28T00:00:00+05:30");
  const EVENT_END = Date.parse("2026-11-29T00:00:00+05:30");
  function updateCountdown() {
    const now = Date.now();
    const seconds = Math.max(0, Math.floor((EVENT_START - now) / 1000));
    const parts = [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
    ["days", "hours", "minutes", "seconds"].forEach((id, index) => {
      document.getElementById(id).textContent = String(parts[index]).padStart(2, "0");
    });
    document.getElementById("countdown").hidden = now >= EVENT_START;
    document.getElementById("countdown-note").textContent = now < EVENT_START
      ? "Until 28 November begins · India Standard Time"
      : now < EVENT_END ? "Today, our always begins. It's our engagement day."
        : "28 November 2026 · Thank you for being part of our beginning.";
  }
  updateCountdown();
  let countdownTimer = setInterval(updateCountdown, 1000);

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  let audioContext;
  let masterGain;
  let musicTimer;
  let musicWanted = false;
  let noteIndex = 0;
  const voices = new Set();
  const melody = [261.63, 329.63, 392, 523.25, 440, 329.63, 392, 329.63, 220, 261.63, 349.23, 440, 392, 329.63, 293.66, 261.63];
  const musicButton = document.getElementById("music-toggle");
  function setMusicUI(playing) {
    musicButton.setAttribute("aria-pressed", String(playing));
    musicButton.setAttribute("aria-label", playing ? "Pause gentle instrumental music" : "Play gentle instrumental music");
    document.getElementById("music-label").textContent = playing ? "Sound on" : "Sound off";
  }
  function stopMusic() {
    clearInterval(musicTimer);
    if (masterGain && audioContext) {
      masterGain.gain.cancelScheduledValues(audioContext.currentTime);
      masterGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.06);
    }
    for (const voice of voices) voice.stop();
    voices.clear();
    setMusicUI(false);
  }
  function playNote() {
    if (!audioContext || audioContext.state !== "running" || !musicWanted) return;
    const now = audioContext.currentTime;
    for (const [multiple, volume] of [[1, 0.34], [2, 0.055], [3, 0.015]]) {
      const voice = audioContext.createOscillator();
      const gain = audioContext.createGain();
      voice.type = "sine";
      voice.frequency.value = melody[noteIndex % melody.length] * multiple;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 3);
      voice.connect(gain);
      gain.connect(masterGain);
      voices.add(voice);
      voice.onended = () => { voices.delete(voice); voice.disconnect(); gain.disconnect(); };
      voice.start(now);
      voice.stop(now + 3.1);
    }
    noteIndex++;
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
      masterGain.gain.setTargetAtTime(0.16, audioContext.currentTime, 0.25);
      clearInterval(musicTimer);
      playNote();
      musicTimer = setInterval(playNote, 720);
      setMusicUI(true);
    } catch (error) {
      console.error("Music could not start:", error);
      musicWanted = false;
      stopMusic();
      toast("Music couldn't start in this browser. You can still enjoy the invitation.");
    }
  }
  musicButton.addEventListener("click", () => {
    musicWanted = !musicWanted;
    if (musicWanted) startMusic();
    else stopMusic();
  });
  musicButton.hidden = !AudioContextClass;

  document.addEventListener("visibilitychange", () => {
    body.classList.toggle("tab-hidden", document.hidden);
    cinema?.setActive(!document.hidden);
    if (document.hidden) {
      clearInterval(countdownTimer);
      stopMusic();
    } else {
      previousIntroTime = performance.now();
      updateCountdown();
      clearInterval(countdownTimer);
      countdownTimer = setInterval(updateCountdown, 1000);
      if (musicWanted) startMusic();
    }
  });
  window.addEventListener("pagehide", () => { stopMusic(); cinema?.setActive(false); });
  window.addEventListener("pageshow", () => cinema?.setActive(true));

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
        await navigator.share({ title: "Samridhi & Piyush — You're invited", text: "Our engagement · 28 November 2026 · The Cove, Panchkula.", url: url.href });
        return;
      } catch (error) {
        if (error.name === "AbortError") return;
        console.warn("Native sharing unavailable; showing link:", error);
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
        shareFeedback.textContent = "Use your device's Copy command on the selected link.";
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

  root.classList.add("cinematic");
  root.dataset.motion = motion ? "on" : "off";
  try {
    if (!window.InvitationCinema) throw new Error("The cinematic engine did not load.");
    cinema = window.InvitationCinema.create(document.getElementById("palace"), graphicsFailure);
    window.invitationCinema = cinema;
  } catch (error) {
    graphicsFailure(error);
  }
  document.getElementById("film-navigation").hidden = false;
  document.getElementById("motion-toggle").hidden = false;
  document.getElementById("closing-actions").hidden = false;
  setMotion(motion);
  showEnvelope();
})();
