document.addEventListener("DOMContentLoaded", () => {
  initGlobe();
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
    const spacing = Math.max(5, Math.round(size / 92));
    dotRadius = Math.max(1.6, spacing * 0.33);
    pixelSize = Math.max(3, Math.round(spacing * 0.85));
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
    score += blob(lat, lon, 0.6, 1.3, 0.5, 0.6, 1.2); // West/Central Asia
    score += blob(lat, lon, 0.5, 1.9, 0.45, 0.65, 1.15); // China
    score += blob(lat, lon, 0.38, 2.35, 0.38, 0.4, 0.9); // East Asia
    score += blob(lat, lon, 0.25, 2.7, 0.22, 0.22, 0.65); // Japan
    score += blob(lat, lon, 0.1, 2.0, 0.28, 0.34, 0.75); // SE Asia

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

      ctx.fillStyle = `rgba(208, 208, 208, ${alpha})`;
      ctx.fillRect(
        Math.round(p.x - pixelSize / 2),
        Math.round(p.y - pixelSize / 2),
        pixelSize,
        pixelSize
      );

      if (isLand) {
        ctx.fillStyle = `rgba(208, 208, 208, ${alpha * 0.35})`;
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

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function normalize(vec) {
  const len = Math.hypot(vec.x, vec.y, vec.z) || 1;
  return { x: vec.x / len, y: vec.y / len, z: vec.z / len };
}
