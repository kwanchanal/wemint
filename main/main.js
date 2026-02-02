const navPills = document.querySelectorAll(".nav-pill");
const helloWord = document.querySelector(".hello-word");
const typingText = document.getElementById("typingText");
const heroSection = document.querySelector(".hero");
const closingText = document.getElementById("closingText");

/* ── Greeting rotation (Apple-style slide transition) ── */
const greetings = [
  "Hello",
  "สวัสดี",
  "你好",
  "こんにちは",
  "안녕하세요",
  "Aloha",
  "Bonjour",
  "Hola",
  "Ciao",
  "Привет",
];

let greetingIndex = 0;

function rotateGreeting() {
  if (!helloWord) return;
  helloWord.classList.add("is-exiting");

  setTimeout(() => {
    greetingIndex = (greetingIndex + 1) % greetings.length;
    helloWord.textContent = greetings[greetingIndex];
    helloWord.classList.remove("is-exiting");
    helloWord.classList.add("is-entering");
    void helloWord.offsetHeight;
    helloWord.classList.remove("is-entering");
  }, 350);
}

setInterval(rotateGreeting, 2000);

/* ── Closing pill text rotation ── */
const closingWords = ["Page", "Conversion"];
let closingIndex = 0;

function rotateClosing() {
  if (!closingText) return;
  closingText.classList.add("is-exiting");

  setTimeout(() => {
    closingIndex = (closingIndex + 1) % closingWords.length;
    closingText.textContent = closingWords[closingIndex];
    closingText.classList.remove("is-exiting");
    closingText.classList.add("is-entering");
    void closingText.offsetHeight;
    closingText.classList.remove("is-entering");
  }, 300);
}

setInterval(rotateClosing, 1200);

/* ── Typing animation ── */
const typingMessages = [
  "what can I help you today?",
  "create branded checkout page for me",
];

let typingMessageIndex = 0;
let typingCharIndex = 0;
let typingForward = true;

function runTyping() {
  if (!typingText) return;
  const currentMessage = typingMessages[typingMessageIndex];

  if (typingForward) {
    typingCharIndex += 1;
    typingText.textContent = currentMessage.slice(0, typingCharIndex);
    if (typingCharIndex === currentMessage.length) {
      typingForward = false;
      setTimeout(runTyping, 1100);
      return;
    }
  } else {
    typingCharIndex -= 1;
    typingText.textContent = currentMessage.slice(0, typingCharIndex);
    if (typingCharIndex === 0) {
      typingForward = true;
      typingMessageIndex = (typingMessageIndex + 1) % typingMessages.length;
      setTimeout(runTyping, 400);
      return;
    }
  }

  const speed = typingForward ? 50 : 30;
  setTimeout(runTyping, speed);
}

setTimeout(runTyping, 800);

/* ── Hero intro ── */
if (heroSection) {
  window.requestAnimationFrame(() => {
    heroSection.classList.add("is-visible");
  });
}

/* ── Nav pills ── */
navPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    navPills.forEach((item) => item.classList.remove("is-active"));
    pill.classList.add("is-active");
  });
});

/* ── Orbit animation (self-rotation + floating drift) ── */
(function initOrbits() {
  const orbits = document.querySelectorAll(".orbit");
  const heroOrbits = document.querySelector(".hero-orbits");
  if (!orbits.length || !heroOrbits) return;

  const config = [
    { spinSpeed: 8,  speed: 36 },
    { spinSpeed: -6, speed: 30 },
    { spinSpeed: 5,  speed: 34 },
    { spinSpeed: -7, speed: 38 },
    { spinSpeed: 9,  speed: 32 },
    { spinSpeed: -5, speed: 40 },
  ];

  let basePositions = [];
  let velocities = [];

  function seedPositions() {
    const rect = heroOrbits.getBoundingClientRect();
    const safeX = rect.width * 0.12;
    const safeY = rect.height * 0.18;
    const usableW = rect.width - safeX * 2;
    const usableH = rect.height - safeY * 2;

    basePositions = config.map((_, i) => {
      const x = safeX + (usableW * ((i * 37) % 100)) / 100;
      const y = safeY + (usableH * ((i * 53 + 17) % 100)) / 100;
      return { x, y };
    });

    // Manual placements (1-based orbit index)
    basePositions[1] = {
      x: rect.width * 0.88,
      y: rect.height * 0.24,
    };
    basePositions[3] = {
      x: rect.width * 0.34,
      y: rect.height * 0.72,
    };
    basePositions[4] = {
      x: rect.width * 0.2,
      y: rect.height * 0.62,
    };

    velocities = config.map((c, i) => {
      const angle = ((i * 63 + 25) * Math.PI) / 180;
      return {
        vx: Math.cos(angle) * c.speed,
        vy: Math.sin(angle) * c.speed,
      };
    });
  }

  let startTime = null;
  let lastRect = null;
  let lastTick = null;

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    if (!lastTick) lastTick = timestamp;
    const elapsed = (timestamp - startTime) / 1000;
    const dt = Math.min((timestamp - lastTick) / 1000, 0.05);
    lastTick = timestamp;
    const rect = heroOrbits.getBoundingClientRect();
    if (!lastRect || rect.width !== lastRect.width || rect.height !== lastRect.height) {
      seedPositions();
      lastRect = rect;
    }

    orbits.forEach((orbit, i) => {
      const c = config[i];
      const selfAngle = elapsed * c.spinSpeed;
      const base = basePositions[i] || { x: rect.width / 2, y: rect.height / 2 };
      const v = velocities[i];
      const orbitSize = orbit.getBoundingClientRect().width || 180;
      const minX = orbitSize / 2;
      const maxX = rect.width - orbitSize / 2;
      const minY = orbitSize / 2;
      const maxY = rect.height - orbitSize / 2;

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

      const dx = base.x - rect.width / 2;
      const dy = base.y - rect.height / 2;

      orbit.style.setProperty("--orbit-x", `${dx}px`);
      orbit.style.setProperty("--orbit-y", `${dy}px`);
      orbit.style.setProperty("--spin", `${selfAngle}deg`);
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();

/* ── Bento scroll reveal ── */
(function initBentoReveal() {
  const tiles = document.querySelectorAll(".frame-tile");
  if (!tiles.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    {
      root: null,
      threshold: 0.2,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  tiles.forEach((tile) => observer.observe(tile));
})();

/* ── Frame 8 slider (no overlap) ── */
(function initFrame8Slider() {
  const slide = document.querySelector(".frame-8 .frame8-slide");
  if (!slide) return;
  const sources = [
    "../image/frame/frame9.png",
    "../image/frame/frame9-1.png",
    "../image/frame/frame9-2.png",
    "../image/frame/frame9-3.png",
  ];
  let index = 0;

  slide.addEventListener("animationiteration", () => {
    index = (index + 1) % sources.length;
    slide.src = sources[index];
  });
})();

/* ── Connecting orbit lines (SVG) ── */
(function initOrbitLines() {
  const svg = document.querySelector(".orbit-lines");
  if (!svg) return;
  const orbits = document.querySelectorAll(".orbit");
  if (orbits.length < 6) return;

  const connections = [
    [0, 2],
    [2, 1],
    [3, 4],
    [4, 5],
    [0, 3],
    [1, 5],
  ];

  const ns = "http://www.w3.org/2000/svg";
  const paths = connections.map(() => {
    const path = document.createElementNS(ns, "path");
    svg.appendChild(path);
    return path;
  });

  function updateLines() {
    const heroRect = svg.parentElement.getBoundingClientRect();
    const svgW = heroRect.width;
    const svgH = heroRect.height;
    svg.setAttribute("viewBox", `0 0 ${svgW} ${svgH}`);

    const centers = Array.from(orbits).map((orbit) => {
      const r = orbit.getBoundingClientRect();
      return {
        x: r.left - heroRect.left + r.width / 2,
        y: r.top - heroRect.top + r.height / 2,
      };
    });

    connections.forEach(([a, b], i) => {
      const p1 = centers[a];
      const p2 = centers[b];
      const mx = (p1.x + p2.x) / 2;
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const cx = mx - dy * 0.25;
      const cy = (p1.y + p2.y) / 2 + dx * 0.25;
      paths[i].setAttribute(
        "d",
        `M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`
      );
    });

    requestAnimationFrame(updateLines);
  }

  requestAnimationFrame(updateLines);
})();
