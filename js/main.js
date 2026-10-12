const root = document.documentElement;
root.classList.add("js");

const menu = document.querySelector("#menu");
const toggle = document.querySelector(".menu-toggle");
const bar = document.querySelector("#scroll-bar");
const topbar = document.querySelector(".topbar");
const links = [...document.querySelectorAll(".menu a")];
const sections = links
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

toggle.addEventListener("click", () => {
  const open = menu.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
});

links.forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  });
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((item, index) => {
  item.style.animationDelay = `${Math.min(index % 3, 2) * 0.08}s`;
  if (reduceMotion) {
    item.classList.add("is-visible");
    return;
  }
  revealObserver.observe(item);
});

const setActive = () => {
  let current = null;
  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= 160) current = section;
  });
  links.forEach((link) => {
    link.classList.toggle(
      "is-active",
      current !== null && link.getAttribute("href") === `#${current.id}`
    );
  });
};

const onScroll = () => {
  const scrolled = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.width = `${height > 0 ? (scrolled / height) * 100 : 0}%`;
  topbar.classList.toggle("is-stuck", scrolled > 8);
  setActive();
};

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });
