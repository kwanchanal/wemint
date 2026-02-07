document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("is-ready");

  const ctaButtons = document.querySelectorAll(".nav__cta, .btn.primary, .pill");
  ctaButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.blur();
    });
  });

  initGlobe();
  initOrbits();
  initYouWord();
  initContactTyping();
  initNavMenu();
});

function initGlobe() {
  const canvas = document.querySelector(".globe-canvas");
  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let points = [];
  let width = 0;
  let height = 0;
  let radius = 0;
  let dotRadius = 2.2;
  let pixelSize = 3;
  let animationFrame = null;

  const light = normalize({ x: -0.4, y: -0.2, z: 1 });

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const size = Math.min(width, height);
    radius = size * 0.46;
    const spacing = Math.max(6, Math.round(size / 78));
    dotRadius = Math.max(1.6, spacing * 0.33);
    pixelSize = Math.max(2, Math.round(spacing * 0.55));
    points = buildPoints(radius, spacing);

    draw(0);
  };

  const buildPoints = (r, spacing) => {
    const list = [];
    for (let y = -r; y <= r; y += spacing) {
      for (let x = -r; x <= r; x += spacing) {
        const dist2 = x * x + y * y;
        if (dist2 > r * r) {
          continue;
        }
        const nx = x / r;
        const ny = y / r;
        const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
        const lat = Math.asin(ny);
        const lon = Math.atan2(nx, nz);
        list.push({ x, y, nx, ny, nz, lat, lon });
      }
    }
    return list;
  };

  const wrapLon = (value) => {
    const twoPi = Math.PI * 2;
    return ((value + Math.PI) % twoPi + twoPi) % twoPi - Math.PI;
  };

  const blob = (lat, lon, lat0, lon0, latScale, lonScale, weight) => {
    const dLat = (lat - lat0) / latScale;
    const dLon = wrapLon(lon - lon0) / lonScale;
    return Math.exp(-0.5 * (dLat * dLat + dLon * dLon)) * weight;
  };

  const continent = (lat, lon) => {
    // Hand-tuned gaussian blobs to resemble real continents.
    let score = 0;

    // North America (Alaska to Florida)
    score += blob(lat, lon, 1.05, -2.45, 0.3, 0.55, 1.0); // Alaska
    score += blob(lat, lon, 0.85, -2.15, 0.33, 0.55, 1.15); // Canada
    score += blob(lat, lon, 0.55, -2.0, 0.28, 0.45, 1.05); // US West/Central
    score += blob(lat, lon, 0.45, -1.65, 0.23, 0.33, 0.9); // US East
    score += blob(lat, lon, 0.2, -1.6, 0.19, 0.2, 0.65); // Mexico
    score += blob(lat, lon, 0.2, -1.25, 0.17, 0.2, 0.5); // Caribbean

    // South America
    score += blob(lat, lon, -0.18, -1.6, 0.42, 0.27, 1.0); // North SA
    score += blob(lat, lon, -0.62, -1.48, 0.46, 0.25, 0.95); // Brazil
    score += blob(lat, lon, -1.05, -1.33, 0.33, 0.2, 0.75); // South cone

    // Europe
    score += blob(lat, lon, 0.75, 0.0, 0.22, 0.23, 0.6); // UK
    score += blob(lat, lon, 0.7, 0.25, 0.24, 0.26, 0.75); // Central EU
    score += blob(lat, lon, 0.6, 0.55, 0.25, 0.28, 0.7); // East EU

    // Africa
    score += blob(lat, lon, 0.22, 0.35, 0.6, 0.38, 1.2); // North Africa
    score += blob(lat, lon, -0.25, 0.45, 0.7, 0.38, 1.25); // Central Africa
    score += blob(lat, lon, -0.8, 0.55, 0.45, 0.32, 0.9); // South Africa

    // Middle East / India
    score += blob(lat, lon, 0.35, 0.95, 0.28, 0.23, 0.8); // Middle East
    score += blob(lat, lon, 0.2, 1.35, 0.32, 0.24, 0.95); // India

    // Asia
    score += blob(lat, lon, 0.7, 1.45, 0.55, 0.7, 1.15); // Siberia
    score += blob(lat, lon, 0.6, 1.3, 0.5, 0.6, 1.2); // West/Central Asia
    score += blob(lat, lon, 0.5, 1.9, 0.45, 0.65, 1.2); // China
    score += blob(lat, lon, 0.38, 2.35, 0.38, 0.4, 0.95); // East Asia
    score += blob(lat, lon, 0.3, 2.5, 0.2, 0.2, 0.55); // Korea
    score += blob(lat, lon, 0.25, 2.7, 0.22, 0.22, 0.7); // Japan
    score += blob(lat, lon, 0.12, 2.05, 0.26, 0.32, 0.8); // SE Asia mainland
    score += blob(lat, lon, -0.05, 2.15, 0.2, 0.28, 0.7); // Malaysia
    score += blob(lat, lon, -0.2, 2.3, 0.25, 0.35, 0.8); // Indonesia
    score += blob(lat, lon, 0.2, 2.75, 0.2, 0.22, 0.6); // Philippines

    // Australia / NZ
    score += blob(lat, lon, -0.85, 2.35, 0.32, 0.4, 0.9);
    score += blob(lat, lon, -0.95, 2.8, 0.18, 0.18, 0.42); // NZ

    // Greenland
    score += blob(lat, lon, 1.15, -1.55, 0.2, 0.25, 0.6);

    // Antarctica belt
    score += blob(lat, lon, -1.35, 0.2, 0.22, 1.7, 0.95);

    return score;
  };

  const hash = (x, y) => {
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return n - Math.floor(n);
  };

  const draw = (time) => {
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2, height / 2);

    const t = time * 0.00035;

    for (const p of points) {
      const lon = p.lon + t * 1.6;
      const shape = continent(p.lat, lon);
      const isLand = shape > 1.05;
      const isCoast = !isLand && shape > 0.78;

      const shade = clamp(
        p.nx * light.x + p.ny * light.y + p.nz * light.z,
        0,
        1
      );
      const flickerSeed = hash(
        Math.round((p.lon + 3.1) * 18),
        Math.round(p.lat * 18)
      );
      const flicker = 0.84 + 0.16 * Math.sin(time * 0.002 + flickerSeed * 10);
      const alphaBase = isLand ? 0.9 : isCoast ? 0.55 : 0.38;
      const alpha = alphaBase * (0.55 + 0.45 * shade) * flicker;

      ctx.fillStyle = `rgba(182, 182, 182, ${alpha})`;
      ctx.fillRect(
        Math.round(p.x - pixelSize / 2),
        Math.round(p.y - pixelSize / 2),
        pixelSize,
        pixelSize
      );

      if (isLand) {
        ctx.fillStyle = `rgba(182, 182, 182, ${alpha * 0.35})`;
        ctx.fillRect(
          Math.round(p.x - pixelSize / 2),
          Math.round(p.y - pixelSize / 2),
          pixelSize,
          pixelSize
        );
      }
    }

    ctx.restore();
  };

  const tick = (time) => {
    draw(time);
    animationFrame = window.requestAnimationFrame(tick);
  };

  const start = () => {
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
    }

    if (reduceMotion.matches) {
      draw(0);
      return;
    }

    animationFrame = window.requestAnimationFrame(tick);
  };

  resize();
  start();

  const handleResize = () => {
    resize();
    start();
  };

  window.addEventListener("resize", handleResize);
  reduceMotion.addEventListener("change", start);
}

function initContactTyping() {
  const typingText = document.getElementById("contactText");
  if (!typingText) {
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const typingMessages = [
    "Tell us how we can help you",
    "Don't Hesitate to contact us",
    "We'd love to hear from you",
  ];

  let typingMessageIndex = 0;
  let typingCharIndex = 0;
  let typingForward = true;

  if (reduceMotion.matches) {
    typingText.textContent = typingMessages[0];
    return;
  }

  const runTyping = () => {
    const currentMessage = typingMessages[typingMessageIndex];

    if (typingForward) {
      typingCharIndex += 1;
      typingText.textContent = currentMessage.slice(0, typingCharIndex);
      if (typingCharIndex === currentMessage.length) {
        typingForward = false;
        setTimeout(runTyping, 1200);
        return;
      }
    } else {
      typingCharIndex -= 1;
      typingText.textContent = currentMessage.slice(0, typingCharIndex);
      if (typingCharIndex === 0) {
        typingForward = true;
        typingMessageIndex = (typingMessageIndex + 1) % typingMessages.length;
        setTimeout(runTyping, 500);
        return;
      }
    }

    const speed = typingForward ? 45 : 28;
    setTimeout(runTyping, speed);
  };

  setTimeout(runTyping, 700);
}

function initNavMenu() {
  const navPill = document.querySelector(".nav__pill");
  const toggle = document.querySelector(".nav__toggle");
  const drawerLinks = document.querySelectorAll(".nav__drawer a");
  if (!navPill || !toggle) {
    return;
  }

  toggle.addEventListener("click", () => {
    const isOpen = navPill.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  drawerLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navPill.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function normalize(vec) {
  const len = Math.hypot(vec.x, vec.y, vec.z) || 1;
  return { x: vec.x / len, y: vec.y / len, z: vec.z / len };
}

function initOrbits() {
  const orbits = document.querySelectorAll(".orbit__avatar");
  const container = document.querySelector(".hero__orbit");
  if (!orbits.length || !container) {
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const config = [
    { spinSpeed: 8, speed: 36 },
    { spinSpeed: -6, speed: 30 },
    { spinSpeed: 5, speed: 34 },
    { spinSpeed: -7, speed: 38 },
    { spinSpeed: 9, speed: 32 },
    { spinSpeed: -5, speed: 40 },
  ];

  let basePositions = [];
  let velocities = [];
  let startTime = null;
  let lastRect = null;
  let lastTick = null;
  let animationFrame = null;

  const seedPositions = () => {
    const rect = container.getBoundingClientRect();
    const boundsW = window.innerWidth;
    const boundsH = window.innerHeight;
    const safeX = boundsW * 0.04;
    const safeY = boundsH * 0.08;
    const usableW = boundsW - safeX * 2;
    const usableH = boundsH - safeY * 2;

    basePositions = config.map((_, i) => {
      const x = safeX + (usableW * ((i * 37) % 100)) / 100;
      const y = safeY + (usableH * ((i * 53 + 17) % 100)) / 100;
      return { x, y };
    });

    basePositions[1] = { x: boundsW * 0.86, y: boundsH * 0.24 };
    basePositions[3] = { x: boundsW * 0.3, y: boundsH * 0.72 };
    basePositions[4] = { x: boundsW * 0.18, y: boundsH * 0.62 };

    velocities = config.map((c, i) => {
      const angle = ((i * 63 + 25) * Math.PI) / 180;
      return { vx: Math.cos(angle) * c.speed, vy: Math.sin(angle) * c.speed };
    });
  };

  const animate = (timestamp) => {
    if (!startTime) startTime = timestamp;
    if (!lastTick) lastTick = timestamp;
    const elapsed = (timestamp - startTime) / 1000;
    const dt = Math.min((timestamp - lastTick) / 1000, 0.05);
    lastTick = timestamp;

    const rect = container.getBoundingClientRect();
    const boundsW = window.innerWidth;
    const boundsH = window.innerHeight;
    if (
      !lastRect ||
      rect.width !== lastRect.width ||
      rect.height !== lastRect.height ||
      boundsW !== lastRect.boundsW ||
      boundsH !== lastRect.boundsH
    ) {
      seedPositions();
      lastRect = { width: rect.width, height: rect.height, boundsW, boundsH };
    }

    orbits.forEach((orbit, i) => {
      const c = config[i] || config[0];
      const selfAngle = elapsed * c.spinSpeed;
      const base = basePositions[i] || { x: boundsW / 2, y: boundsH / 2 };
      const v = velocities[i] || { vx: 0, vy: 0 };
      const orbitSize = orbit.getBoundingClientRect().width || 120;
      const minX = orbitSize / 2;
      const maxX = boundsW - orbitSize / 2;
      const minY = orbitSize / 2;
      const maxY = boundsH - orbitSize / 2;

      base.x += v.vx * dt;
      base.y += v.vy * dt;

      if (base.x <= minX || base.x >= maxX) {
        base.x = Math.max(minX, Math.min(maxX, base.x));
        v.vx *= -1;
      }
      if (base.y <= minY || base.y >= maxY) {
        base.y = Math.max(minY, Math.min(maxY, base.y));
        v.vy *= -1;
      }

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = base.x - centerX;
      const dy = base.y - centerY;

      orbit.style.setProperty("--orbit-x", `${dx}px`);
      orbit.style.setProperty("--orbit-y", `${dy}px`);
      orbit.style.setProperty("--spin", `${selfAngle}deg`);
    });

    animationFrame = window.requestAnimationFrame(animate);
  };

  const start = () => {
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
    }
    if (reduceMotion.matches) {
      seedPositions();
      return;
    }
    animationFrame = window.requestAnimationFrame(animate);
  };

  seedPositions();
  start();

  window.addEventListener("resize", start);
  reduceMotion.addEventListener("change", start);
}

function initYouWord() {
  const youWord = document.getElementById("youWord");
  if (!youWord) {
    return;
  }

  const words = [
    "YOU",
    "คุณ",
    "你",
    "당신",
    "あなた",
    "тебя",
    "tú",
    "te",
    "toi",
    "ʻoe",
  ];

  let index = 0;
  const interval = 2000;

  const rotate = () => {
    youWord.classList.add("is-exiting");

    window.setTimeout(() => {
      index = (index + 1) % words.length;
      youWord.textContent = words[index];
      youWord.classList.remove("is-exiting");
      youWord.classList.add("is-entering");
      void youWord.offsetHeight;
      youWord.classList.remove("is-entering");
    }, 350);
  };

  window.setInterval(rotate, interval);
}
