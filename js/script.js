// Scroll reveal using Intersection Observer
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15
  }
);

revealElements.forEach((el) => revealObserver.observe(el));

// Services: mobile — animate icons when card crosses viewport center band
(() => {
  const servicesRoot = document.getElementById("services");
  if (!servicesRoot) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const mqMobile = window.matchMedia("(max-width: 899px)");
  const cards = () => [...servicesRoot.querySelectorAll(".service-card")];

  const iconCenterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle(
          "service-card--icon-active",
          entry.isIntersecting
        );
      });
    },
    {
      threshold: 0,
      rootMargin: "-38% 0px -38% 0px"
    }
  );

  const syncObservation = () => {
    iconCenterObserver.disconnect();
    for (const card of cards()) {
      card.classList.remove("service-card--icon-active");
    }
    if (!mqMobile.matches) return;
    for (const card of cards()) {
      iconCenterObserver.observe(card);
    }
  };

  syncObservation();
  mqMobile.addEventListener("change", syncObservation);
})();

// Portfolio category filter
const filterButtons = document.querySelectorAll(".filter-btn");
const workItems = document.querySelectorAll(".work-item");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    workItems.forEach((item) => {
      const category = item.dataset.category;
      const shouldShow = selected === "all" || selected === category;
      item.classList.toggle("hidden", !shouldShow);
    });
  });
});

// Prevent form submission refresh in static demo
const form = document.querySelector(".contact-form");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });
}

// Mobile side menu
const menuToggle = document.querySelector(".menu-toggle");
const mobileClose = document.querySelector(".mobile-close");
const mobileOverlay = document.querySelector(".mobile-overlay");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileMenuLinks = document.querySelectorAll(".mobile-nav a");
let pageScrollLockY = 0;

const openMobileMenu = (reason = "unknown") => {
  // #region agent log
  fetch("http://127.0.0.1:7849/ingest/944fce5c-6eb0-416e-84cc-406ec53da19f", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "cf552d"
    },
    body: JSON.stringify({
      sessionId: "cf552d",
      runId: "initial",
      hypothesisId: "H2",
      location: "js/script.js:openMobileMenu",
      message: "Menu open requested",
      data: { reason, menuOpenBefore: document.body.classList.contains("menu-open") },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion
  pageScrollLockY = window.scrollY;
  document.body.style.position = "fixed";
  document.body.style.top = `-${pageScrollLockY}px`;
  document.body.style.width = "100%";
  document.body.classList.add("menu-open");
  // #region agent log
  fetch("http://127.0.0.1:7849/ingest/944fce5c-6eb0-416e-84cc-406ec53da19f", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "cf552d"
    },
    body: JSON.stringify({
      sessionId: "cf552d",
      runId: "post-fix",
      hypothesisId: "H8",
      location: "js/script.js:openMobileMenuScrollLock",
      message: "Applied body scroll lock",
      data: { pageScrollLockY, bodyPosition: document.body.style.position },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion
  if (menuToggle) menuToggle.setAttribute("aria-expanded", "true");
  if (mobileMenu) mobileMenu.setAttribute("aria-hidden", "false");
  if (mobileOverlay) mobileOverlay.setAttribute("aria-hidden", "false");
};

const closeMobileMenu = (reason = "unknown") => {
  // #region agent log
  fetch("http://127.0.0.1:7849/ingest/944fce5c-6eb0-416e-84cc-406ec53da19f", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "cf552d"
    },
    body: JSON.stringify({
      sessionId: "cf552d",
      runId: "initial",
      hypothesisId: "H2",
      location: "js/script.js:closeMobileMenu",
      message: "Menu close requested",
      data: { reason, menuOpenBefore: document.body.classList.contains("menu-open") },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion
  document.body.classList.remove("menu-open");
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  window.scrollTo(0, pageScrollLockY);
  // #region agent log
  fetch("http://127.0.0.1:7849/ingest/944fce5c-6eb0-416e-84cc-406ec53da19f", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "cf552d"
    },
    body: JSON.stringify({
      sessionId: "cf552d",
      runId: "post-fix",
      hypothesisId: "H8",
      location: "js/script.js:closeMobileMenuScrollUnlock",
      message: "Released body scroll lock",
      data: { pageScrollLockY, bodyPosition: document.body.style.position },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion
  if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
  if (mobileMenu) mobileMenu.setAttribute("aria-hidden", "true");
  if (mobileOverlay) mobileOverlay.setAttribute("aria-hidden", "true");
};

if (menuToggle) {
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const SWIPE_MIN_X = 18;
  let touchStartX = 0;
  let touchStartY = 0;
  let toggleGestureMoved = false;
  let lastToggleTouchEndAt = 0;

  document.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    },
    { passive: true }
  );

  document.addEventListener(
    "touchmove",
    (e) => {
      const dx = e.touches[0].clientX - touchStartX;
      const dy = e.touches[0].clientY - touchStartY;
      const isHorizontalSwipe = Math.abs(dx) > SWIPE_MIN_X && Math.abs(dx) > Math.abs(dy);

      if (isHorizontalSwipe) {
        // #region agent log
        fetch("http://127.0.0.1:7849/ingest/944fce5c-6eb0-416e-84cc-406ec53da19f", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "cf552d"
          },
          body: JSON.stringify({
            sessionId: "cf552d",
            runId: "initial",
            hypothesisId: "H1",
            location: "js/script.js:touchmove",
            message: "Horizontal swipe detected",
            data: { dx, dy, targetClass: e.target?.className || "" },
            timestamp: Date.now()
          })
        }).catch(() => {});
        // #endregion
      }
    },
    { passive: true }
  );

  let toggleTouchStartX = 0;
  let toggleTouchStartY = 0;
  menuToggle.addEventListener(
    "touchstart",
    (e) => {
      toggleTouchStartX = e.touches[0].clientX;
      toggleTouchStartY = e.touches[0].clientY;
      toggleGestureMoved = false;
      // #region agent log
      fetch("http://127.0.0.1:7849/ingest/944fce5c-6eb0-416e-84cc-406ec53da19f", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "cf552d"
        },
        body: JSON.stringify({
          sessionId: "cf552d",
          runId: "initial",
          hypothesisId: "H6",
          location: "js/script.js:menuToggleTouchStart",
          message: "Menu toggle touchstart",
          data: { x: toggleTouchStartX, y: toggleTouchStartY },
          timestamp: Date.now()
        })
      }).catch(() => {});
      // #endregion
    },
    { passive: true }
  );

  menuToggle.addEventListener(
    "touchend",
    (e) => {
      const dx = e.changedTouches[0].clientX - toggleTouchStartX;
      const dy = e.changedTouches[0].clientY - toggleTouchStartY;
      toggleGestureMoved = Math.abs(dx) > SWIPE_MIN_X && Math.abs(dx) > Math.abs(dy);
      lastToggleTouchEndAt = Date.now();
      // #region agent log
      fetch("http://127.0.0.1:7849/ingest/944fce5c-6eb0-416e-84cc-406ec53da19f", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "cf552d"
        },
        body: JSON.stringify({
          sessionId: "cf552d",
          runId: "initial",
          hypothesisId: "H6",
          location: "js/script.js:menuToggleTouchEnd",
          message: "Menu toggle touchend",
          data: {
            dx,
            dy,
            absDx: Math.abs(dx),
            absDy: Math.abs(dy),
            toggleGestureMoved,
            lastToggleTouchEndAt
          },
          timestamp: Date.now()
        })
      }).catch(() => {});
      // #endregion
    },
    { passive: true }
  );

  menuToggle.addEventListener("click", (e) => {
    // #region agent log
    fetch("http://127.0.0.1:7849/ingest/944fce5c-6eb0-416e-84cc-406ec53da19f", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "cf552d"
      },
      body: JSON.stringify({
        sessionId: "cf552d",
        runId: "initial",
        hypothesisId: "H1",
        location: "js/script.js:menuToggleClick",
        message: "Menu toggle click",
        data: {
          isTouchDevice,
          now: Date.now(),
          toggleGestureMoved,
          lastToggleTouchEndAt,
          blocked:
            isTouchDevice &&
            toggleGestureMoved &&
            Date.now() - lastToggleTouchEndAt < 1200
        },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion
    if (
      isTouchDevice &&
      toggleGestureMoved &&
      Date.now() - lastToggleTouchEndAt < 1200
    ) {
      e.preventDefault();
      return;
    }

    openMobileMenu("toggle-click");
  });
}

const isTargetMenuToggle = (target) => {
  if (!target || typeof target.closest !== "function") return false;
  return Boolean(target.closest(".menu-toggle"));
};

document.addEventListener(
  "touchend",
  (e) => {
    // #region agent log
    fetch("http://127.0.0.1:7849/ingest/944fce5c-6eb0-416e-84cc-406ec53da19f", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "cf552d"
      },
      body: JSON.stringify({
        sessionId: "cf552d",
        runId: "initial",
        hypothesisId: "H4",
        location: "js/script.js:documentTouchEnd",
        message: "Document touchend",
        data: {
          targetClass: e.target?.className || "",
          onMenuToggle: isTargetMenuToggle(e.target),
          menuOpen: document.body.classList.contains("menu-open")
        },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion
  },
  { passive: true }
);

document.addEventListener(
  "click",
  (e) => {
    // #region agent log
    fetch("http://127.0.0.1:7849/ingest/944fce5c-6eb0-416e-84cc-406ec53da19f", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "cf552d"
      },
      body: JSON.stringify({
        sessionId: "cf552d",
        runId: "initial",
        hypothesisId: "H4",
        location: "js/script.js:documentClickCapture",
        message: "Document click (capture)",
        data: {
          targetClass: e.target?.className || "",
          onMenuToggle: isTargetMenuToggle(e.target),
          menuOpen: document.body.classList.contains("menu-open")
        },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion
  },
  true
);

const menuOpenObserver = new MutationObserver(() => {
  // #region agent log
  fetch("http://127.0.0.1:7849/ingest/944fce5c-6eb0-416e-84cc-406ec53da19f", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "cf552d"
    },
    body: JSON.stringify({
      sessionId: "cf552d",
      runId: "initial",
      hypothesisId: "H5",
      location: "js/script.js:bodyClassMutation",
      message: "Body class changed",
      data: {
        className: document.body.className,
        menuOpen: document.body.classList.contains("menu-open"),
        scrollY: window.scrollY
      },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion
});

menuOpenObserver.observe(document.body, {
  attributes: true,
  attributeFilter: ["class"]
});

if (mobileClose) {
  mobileClose.addEventListener("click", () => closeMobileMenu("mobile-close"));
}

if (mobileOverlay) {
  const closeFromOverlay = () => closeMobileMenu("overlay-dismiss");
  mobileOverlay.addEventListener("click", closeFromOverlay);
  mobileOverlay.addEventListener("touchend", (e) => {
    if (!document.body.classList.contains("menu-open")) return;
    e.preventDefault();
    closeFromOverlay();
  }, { passive: false });
}

mobileMenuLinks.forEach((link) => {
  link.addEventListener("click", () => closeMobileMenu("menu-link"));
});

let lastScrollLogAt = 0;
window.addEventListener(
  "scroll",
  () => {
    const menuOpen = document.body.classList.contains("menu-open");
    if (Date.now() - lastScrollLogAt < 200) return;
    lastScrollLogAt = Date.now();
    // #region agent log
    fetch("http://127.0.0.1:7849/ingest/944fce5c-6eb0-416e-84cc-406ec53da19f", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "cf552d"
      },
      body: JSON.stringify({
        sessionId: "cf552d",
        runId: "initial",
        hypothesisId: "H3",
        location: "js/script.js:windowScroll",
        message: "Window scroll event",
        data: { scrollY: window.scrollY, menuOpen },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion
  },
  { passive: true }
);

document.addEventListener(
  "touchmove",
  (e) => {
    if (!document.body.classList.contains("menu-open")) return;
    // #region agent log
    fetch("http://127.0.0.1:7849/ingest/944fce5c-6eb0-416e-84cc-406ec53da19f", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "cf552d"
      },
      body: JSON.stringify({
        sessionId: "cf552d",
        runId: "initial",
        hypothesisId: "H7",
        location: "js/script.js:touchMoveWhileMenuOpen",
        message: "Touchmove while menu open",
        data: {
          targetClass: e.target?.className || "",
          scrollY: window.scrollY,
          bodyOverflow: getComputedStyle(document.body).overflow
        },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion
  },
  { passive: true }
);

// Section backgrounds: tech-style particle network (canvas, one per section)
(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const main = document.querySelector("main");
  if (!main) return;

  const rgbPrimary = "38, 133, 190";

  const createSystem = (canvas, section) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    let particles = [];
    let w = 0;
    let h = 0;
    let linkDist = 130;

    const particleCount = () => {
      const area = w * h;
      return Math.min(120, Math.max(45, Math.floor(area / 8000)));
    };

    const initParticles = () => {
      const n = particleCount();
      particles = [];
      for (let i = 0; i < n; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.42,
          vy: (Math.random() - 0.5) * 0.42,
          r: Math.random() * 1.15 + 0.65
        });
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = section.clientWidth;
      h = section.offsetHeight;
      if (w < 1 || h < 1) return;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      linkDist = Math.min(150, Math.max(95, w * 0.24));
      initParticles();
    };

    const step = () => {
      if (w < 1 || h < 1 || particles.length === 0) return;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x <= 0 || p.x >= w) p.vx *= -1;
        if (p.y <= 0 || p.y >= h) p.vy *= -1;
        p.x = Math.max(0, Math.min(w, p.x));
        p.y = Math.max(0, Math.min(h, p.y));
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < linkDist && dist > 0) {
            const t = 1 - dist / linkDist;
            ctx.strokeStyle = `rgba(${rgbPrimary}, ${t * 0.5})`;
            ctx.lineWidth = 0.55;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx.fillStyle = `rgba(${rgbPrimary}, ${0.18 + p.r * 0.07})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    return { section, resize, step };
  };

  const systems = [];
  main.querySelectorAll(":scope > section").forEach((section) => {
    const canvas = document.createElement("canvas");
    canvas.className = "section-particles";
    canvas.setAttribute("aria-hidden", "true");
    section.prepend(canvas);
    const sys = createSystem(canvas, section);
    if (sys) systems.push(sys);
  });

  if (systems.length === 0) return;

  let rafId = 0;
  const tick = () => {
    for (const sys of systems) {
      sys.step();
    }
    rafId = requestAnimationFrame(tick);
  };

  const resizeObserver = new ResizeObserver(() => {
    for (const sys of systems) {
      sys.resize();
    }
  });
  systems.forEach((sys) => {
    resizeObserver.observe(sys.section);
    sys.resize();
  });

  rafId = requestAnimationFrame(tick);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      rafId = requestAnimationFrame(tick);
    }
  });
})();
