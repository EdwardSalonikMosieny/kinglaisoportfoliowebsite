(function () {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-menu a");
  const year = document.getElementById("year");
  const reveals = document.querySelectorAll(".reveal");
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = lightbox.querySelector("img");
  const lightboxText = lightbox.querySelector("p");
  const lightboxClose = lightbox.querySelector(".lightbox-close");
  const faqButtons = document.querySelectorAll(".faq-item button");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  function closeMenu() {
    navToggle.setAttribute("aria-expanded", "false");
    navMenu.classList.remove("open");
    document.body.classList.remove("menu-open");
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      navMenu.classList.toggle("open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  const revealObserver = "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.14 }
      )
    : null;

  reveals.forEach((element) => {
    if (revealObserver) {
      revealObserver.observe(element);
    } else {
      element.classList.add("visible");
    }
  });

  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const activeObserver = "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navLinks.forEach((link) => {
              link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
            });
          });
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 }
      )
    : null;

  if (activeObserver) {
    sections.forEach((section) => activeObserver.observe(section));
  }

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const fullImage = item.dataset.full;
      const caption = item.dataset.caption || item.querySelector("img").alt;
      lightboxImg.src = fullImage;
      lightboxImg.alt = caption;
      lightboxText.textContent = caption;
      lightbox.hidden = false;
      lightboxClose.focus();
    });
  });

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = "";
  }

  lightboxClose.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      if (!lightbox.hidden) {
        closeLightbox();
      }
    }
  });

  faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const isOpen = item.classList.toggle("open");
      button.setAttribute("aria-expanded", String(isOpen));
      button.querySelector("span").textContent = isOpen ? "-" : "+";
    });
  });
})();
