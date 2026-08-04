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

const contactForm = document.querySelector(".contact-form");
const contactFields = [...contactForm.querySelectorAll("input[name], textarea[name]")]
  .filter((field) => ["name", "email", "phone", "subject", "message"].includes(field.name));

function clearFieldError(field) {
  field.classList.remove("is-invalid");
  field.removeAttribute("aria-invalid");
  field.removeAttribute("aria-describedby");
  document.getElementById(`${field.name}-error`)?.remove();
}

function clearFieldErrors() {
  contactFields.forEach(clearFieldError);
}

function showFieldErrors(errors) {
  const invalidFields = [];

  Object.entries(errors).forEach(([name, message]) => {
    const field = contactForm.elements.namedItem(name);
    if (!(field instanceof HTMLElement)) return;

    clearFieldError(field);
    field.classList.add("is-invalid");
    field.setAttribute("aria-invalid", "true");
    field.setAttribute("aria-describedby", `${name}-error`);

    const error = document.createElement("p");
    error.id = `${name}-error`;
    error.className = "field-error";
    error.textContent = message;
    field.insertAdjacentElement("afterend", error);
    invalidFields.push(field);
  });

  invalidFields[0]?.focus();
}

contactFields.forEach((field) => {
  field.addEventListener("input", () => clearFieldError(field));
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector("button");
  const note = form.querySelector(".form-note");
  const originalLabel = button.textContent;

  clearFieldErrors();
  button.disabled = true;
  button.textContent = "Sending...";
  note.className = "form-note";
  note.textContent = "";

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  fetch("/api/enquiries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then(async (response) => {
      const result = await response.json();
      if (!response.ok || !result.success) {
        const error = new Error(result.message || "The server could not accept the message.");
        error.fieldErrors = result.errors;
        throw error;
      }
      form.reset();
      note.textContent = result.message;
      note.classList.add("is-success");
    })
    .catch((error) => {
      if (error.fieldErrors) showFieldErrors(error.fieldErrors);
      note.textContent = error.message || "We could not send your message right now. Please try again in a moment.";
      note.classList.add("is-error");
    })
    .finally(() => {
      button.disabled = false;
      button.textContent = originalLabel;
    });
});


