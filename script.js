// script.js
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  /* THEME TOGGLE (LIGHT/DARK) */
  const themeToggle = document.getElementById("theme-toggle");
  const storedTheme = localStorage.getItem("theme");

  if (storedTheme === "light") {
    body.classList.add("light-mode");
    if (themeToggle) themeToggle.innerHTML = "&#9790;";
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      body.classList.toggle("light-mode");
      const isLight = body.classList.contains("light-mode");
      localStorage.setItem("theme", isLight ? "light" : "dark");
      themeToggle.innerHTML = isLight ? "&#9790;" : "&#9788;";
    });
  }

  /* YEAR IN FOOTER */
  const yearSpans = document.querySelectorAll("#year");
  const currentYear = new Date().getFullYear();
  yearSpans.forEach((el) => (el.textContent = currentYear));

  /* SMOOTH SCROLL FOR ANCHOR LINKS */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (targetId === "#" || targetId === "#top") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const y = targetEl.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    });
  });

  /* COLLAPSIBLE RESEARCH SECTIONS */
  document.querySelectorAll(".collapsible-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const target = document.getElementById(targetId);
      if (!target) return;

      const isOpen = target.classList.contains("open");
      // Close others in the group
      const group = btn.closest(".collapsible-group");
      if (group) {
        group.querySelectorAll(".collapsible-content").forEach((c) => {
          if (c !== target) c.classList.remove("open");
        });
      }
      if (!isOpen) {
        target.classList.add("open");
      } else {
        target.classList.remove("open");
      }
    });
  });

  /* TOOLTIP FOR QUICK FACTS & DEFINITIONS */
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip-bubble";
  document.body.appendChild(tooltip);

  let tooltipVisible = false;

  function showTooltip(text, x, y) {
    tooltip.textContent = text;
    tooltip.style.left = `${x + 12}px`;
    tooltip.style.top = `${y + 12}px`;
    tooltip.style.opacity = "1";
    tooltip.style.transform = "translateY(0px)";
    tooltipVisible = true;
  }

  function hideTooltip() {
    tooltip.style.opacity = "0";
    tooltip.style.transform = "translateY(4px)";
    tooltipVisible = false;
  }

  document.querySelectorAll("[data-tooltip]").forEach((el) => {
    const text = el.getAttribute("data-tooltip") || "";
    el.addEventListener("mouseenter", (e) => {
      if (!text) return;
      const rect = el.getBoundingClientRect();
      showTooltip(text, rect.left, rect.top);
    });
    el.addEventListener("mousemove", (e) => {
      if (!tooltipVisible || !text) return;
      showTooltip(text, e.clientX, e.clientY);
    });
    el.addEventListener("mouseleave", () => {
      hideTooltip();
    });
    el.addEventListener("focus", (e) => {
      const rect = el.getBoundingClientRect();
      showTooltip(text, rect.left, rect.top);
    });
    el.addEventListener("blur", () => {
      hideTooltip();
    });
  });

  /* ANIMATED STAT COUNTERS */
  const counters = document.querySelectorAll(".stat-number");
  if (counters.length > 0) {
    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute("data-target"), 10);
      if (isNaN(target)) return;
      let current = 0;
      const duration = 1200;
      const startTime = performance.now();

      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        current = Math.floor(progress * target);
        el.textContent = current.toString();
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toString();
        }
      };

      requestAnimationFrame(step);
    };

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach((c) => observer.observe(c));
    } else {
      counters.forEach((c) => animateCounter(c));
    }
  }
});
