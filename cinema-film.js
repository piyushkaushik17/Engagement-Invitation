(() => {
  "use strict";
  const clamp = value => Math.max(0, Math.min(1, value));
  const smooth = (a, b, value) => {
    const t = clamp((value - a) / (b - a));
    return t * t * (3 - 2 * t);
  };

  function create(canvas, reportFailure) {
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) throw new Error("The cinematic canvas isn't available.");
    const video = document.getElementById("palace-film");
    const portrait = matchMedia("(max-aspect-ratio: 1/1)");
    const fabric = document.createElement("canvas");
    fabric.width = 144;
    fabric.height = 216;
    const fabricContext = fabric.getContext("2d");
    const fabricImage = fabricContext.createImageData(fabric.width, fabric.height);
    let progress = 0;
    let currentProgress = 0;
    let introStart = null;
    let introFinished = false;
    let motion = true;
    let active = true;
    let frame = 0;
    let elapsed = 0;
    let previous = performance.now();
    let pausedAt = null;
    let width = innerWidth;
    let height = innerHeight;
    let playRejected = false;
    let frameNumber = 0;
    let lastClothFrame = -1;
    let seed = 28112026;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    const particles = Array.from({ length: width < 700 ? 80 : 130 }, () => ({
      x: random(), y: random(), size: 0.5 + random() * 2,
      depth: random(), speed: 0.007 + random() * 0.014, phase: random() * 10
    }));
    const petals = Array.from({ length: 14 }, () => ({
      x: random(), y: random(), scale: 3 + random() * 4,
      phase: random() * 10, speed: 0.018 + random() * 0.017
    }));

    function chooseFilm() {
      const file = portrait.matches ? "assets/palace-portrait.mp4" : "assets/palace-landscape.mp4";
      if (video.getAttribute("src") !== file) {
        video.src = file;
        video.load();
      }
    }
    async function playFilm() {
      if (!motion || !active || playRejected) return;
      try {
        await video.play();
      } catch (error) {
        if (error.name === "AbortError") return;
        playRejected = true;
        console.warn("Background film playback was blocked:", error);
        reportFailure(new Error("The palace film is paused by this browser. Tap Sound or reopen the invitation to retry."));
      }
    }
    video.addEventListener("error", () => {
      reportFailure(new Error("The palace film couldn't load. The illustrated invitation remains available."));
    });
    video.addEventListener("loadeddata", () => {
      canvas.dataset.filmReady = "true";
      if (motion && active) playFilm();
    });

    function makeSilk(time) {
      const pixels = fabricImage.data;
      const w = fabric.width, h = fabric.height;
      for (let y = 0; y < h; y++) {
        const wave = Math.sin(y / h * 4 + time * 0.4) * 1.7 + y / h * 5;
        for (let x = 0; x < w; x++) {
          const phase = x / w * 19 + wave + Math.sin(y / h * 3 - time * 0.28) * 0.7;
          const fold = Math.sin(phase);
          const sheen = Math.pow(Math.max(0, Math.sin(phase + 0.4)), 9);
          const diagonal = Math.sin(y / h * 10 + x / w * 6 + time * 0.25);
          const light = 0.86 + fold * 0.09 + sheen * 0.16 + diagonal * 0.03;
          const i = (y * w + x) * 4;
          pixels[i] = Math.min(255, 251 * light);
          pixels[i + 1] = Math.min(255, 238 * light);
          pixels[i + 2] = Math.min(255, 212 * light);
          pixels[i + 3] = 255;
        }
      }
      fabricContext.putImageData(fabricImage, 0, 0);
    }
    function drawSilk(opening) {
      const panelWidth = width * 0.53;
      const travel = opening * width * 0.67;
      const dy = height / fabric.height;
      for (let row = 0; row < fabric.height; row += 3) {
        const wave = Math.sin(row / fabric.height * 7 + elapsed * 0.55) * 11 * opening;
        ctx.drawImage(fabric, 0, row, fabric.width, 3, -travel + wave, row * dy, panelWidth, 3 * dy + 1);
        ctx.save();
        ctx.translate(width + travel - wave, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(fabric, 0, row, fabric.width, 3, 0, row * dy, panelWidth, 3 * dy + 1);
        ctx.restore();
      }
      if (opening < 0.7) {
        const light = ctx.createLinearGradient(width / 2 - 25, 0, width / 2 + 25, 0);
        light.addColorStop(0, "rgba(255,247,215,0)");
        light.addColorStop(0.5, `rgba(255,250,231,${0.2 * (1 - opening)})`);
        light.addColorStop(1, "rgba(255,247,215,0)");
        ctx.fillStyle = light;
        ctx.fillRect(width / 2 - 25, 0, 50, height);
      }
    }
    function drawParticles() {
      ctx.globalCompositeOperation = "screen";
      for (const particle of particles) {
        const x = (particle.x + Math.sin(elapsed * 0.14 + particle.phase) * 0.035) * width;
        const y = ((particle.y - elapsed * particle.speed) % 1 + 1) % 1 * height;
        const radius = particle.size * (0.7 + particle.depth);
        const alpha = (0.18 + Math.pow(Math.max(0, Math.sin(elapsed * 0.9 + particle.phase)), 7) * 0.65) * (0.4 + particle.depth);
        const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 5);
        glow.addColorStop(0, `rgba(255,249,216,${alpha})`);
        glow.addColorStop(0.22, `rgba(255,219,151,${alpha * 0.7})`);
        glow.addColorStop(1, "rgba(255,221,161,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, radius * 5, 0, Math.PI * 2);
        ctx.fill();
        if (alpha > 0.7) {
          ctx.strokeStyle = `rgba(255,246,202,${alpha * 0.5})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(x - radius * 4, y); ctx.lineTo(x + radius * 4, y);
          ctx.moveTo(x, y - radius * 4); ctx.lineTo(x, y + radius * 4);
          ctx.stroke();
        }
      }
      ctx.globalCompositeOperation = "source-over";
      for (const petal of petals) {
        const x = (petal.x + Math.sin(elapsed * 0.27 + petal.phase) * 0.1) * width;
        const y = ((petal.y + elapsed * petal.speed) % 1) * height;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(elapsed * 0.32 + petal.phase);
        ctx.scale(Math.max(0.15, Math.abs(Math.sin(elapsed * 0.48 + petal.phase))), 1);
        ctx.fillStyle = "rgba(248,224,205,.65)";
        ctx.beginPath();
        ctx.ellipse(0, 0, petal.scale, petal.scale * 0.53, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    function draw(now) {
      frame = 0;
      if (!active) return;
      const delta = Math.max(0, Math.min((now - previous) / 1000, 0.06));
      previous = now;
      if (motion) elapsed += delta;
      currentProgress += (progress - currentProgress) * (motion ? 1 - Math.exp(-delta * 4) : 1);
      const introTime = introStart === null ? 0 : (now - introStart) / 1000;
      const opening = introFinished ? 1 : smooth(4.7, 7.6, introTime);
      ctx.clearRect(0, 0, width, height);
      if (opening < 1) {
        const clothFrame = Math.floor(elapsed * 24);
        if (clothFrame !== lastClothFrame) { makeSilk(elapsed); lastClothFrame = clothFrame; }
        drawSilk(opening);
      }
      if (motion) drawParticles();
      const shift = Math.sin(currentProgress * Math.PI * 2) * 1.8;
      video.style.transform = `scale(${1.035 + currentProgress * 0.1}) translate3d(${shift}%,${currentProgress * -1.8}%,0)`;
      canvas.dataset.frame = String(++frameNumber);
      canvas.dataset.cameraZ = (17 - currentProgress * 34).toFixed(3);
      if (motion || Math.abs(progress - currentProgress) > 0.0001) frame = requestAnimationFrame(draw);
    }
    function wake() {
      if (!frame && active) {
        previous = performance.now();
        frame = requestAnimationFrame(draw);
      }
    }
    function resize() {
      width = innerWidth;
      height = innerHeight;
      const ratio = Math.min(devicePixelRatio, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      lastClothFrame = -1;
      chooseFilm();
      wake();
    }
    window.addEventListener("resize", resize);
    portrait.addEventListener("change", resize);
    resize();
    return {
      startIntro() {
        introFinished = false;
        introStart = performance.now();
        currentProgress = progress = 0;
        playRejected = false;
        if (motion) playFilm();
        wake();
      },
      finishIntro() { introFinished = true; if (motion) playFilm(); wake(); },
      reset() { introFinished = false; introStart = null; progress = currentProgress = 0; wake(); },
      setProgress(value) { progress = clamp(value); wake(); },
      setMotion(value) {
        motion = value;
        if (!motion) { introFinished = true; video.pause(); }
        else playFilm();
        wake();
      },
      setActive(value) {
        if (active === value) return;
        active = value;
        if (!active) {
          pausedAt = performance.now();
          cancelAnimationFrame(frame);
          frame = 0;
          video.pause();
        } else {
          if (pausedAt !== null && introStart !== null) introStart += performance.now() - pausedAt;
          pausedAt = null;
          if (motion) playFilm();
          wake();
        }
      },
      getStats() { return { renderer: "film-and-canvas", frame: frameNumber, progress: currentProgress, filmTime: video.currentTime }; }
    };
  }
  window.InvitationCinema = { create };
})();
