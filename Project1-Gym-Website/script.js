const header = document.querySelector(".header");
const progress = document.querySelector(".scroll-progress");
const backToTop = document.querySelector(".back-to-top");
const menuButton = document.querySelector(".menu-btn");
const navigation = document.querySelector(".nav-links");

function updateScrollUI() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;

  progress.style.width = `${percent}%`;
  header.classList.toggle("scrolled", window.scrollY > 24);
  backToTop.classList.toggle("show", window.scrollY > 600);
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();

menuButton.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("active");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  menuButton.querySelector("i").className = isOpen ? "ri-close-line" : "ri-menu-3-line";
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("active");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    menuButton.querySelector("i").className = "ri-menu-3-line";
  });
});

backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const counters = document.querySelectorAll(".counter");
const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(({ isIntersecting, target }) => {
    if (!isIntersecting) return;
    const goal = Number(target.dataset.target);
    const started = performance.now();
    const duration = 1200;
    const tick = (now) => {
      const ratio = Math.min((now - started) / duration, 1);
      target.textContent = Math.floor(goal * (1 - (1 - ratio) ** 3)).toLocaleString();
      if (ratio < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    observer.unobserve(target);
  });
}, { threshold: 0.45 });
counters.forEach((counter) => counterObserver.observe(counter));

if (window.AOS) {
  window.AOS.init({ duration: 700, once: true, offset: 80 });
}

document.querySelector(".contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector("button");
  const note = form.querySelector(".form-note");
  const originalLabel = button.textContent;

  button.disabled = true;
  button.textContent = "Sending…";
  note.className = "form-note";

  const formData = new FormData(form);
  formData.append("_url", window.location.href);

  fetch(form.action, {
    method: "POST",
    body: formData,
    headers: { Accept: "application/json" },
  })
    .then(async (response) => {
      if (!response.ok) throw new Error("The form service rejected the message.");
      const result = await response.json();
      if (!result.success) throw new Error("The form service could not accept the message.");
      form.reset();
      note.textContent = "Thanks — your message has been sent. We’ll be in touch shortly.";
      note.classList.add("is-success");
    })
    .catch(() => {
      note.textContent = "We couldn’t send your message right now. Please try again in a moment.";
      note.classList.add("is-error");
    })
    .finally(() => {
      button.disabled = false;
      button.textContent = originalLabel;
    });
});
