const navToggle = document.querySelector(".header__nav-toggle");
const primaryNavigation = document.querySelector("#primary-navigation");

function setNavigationOpen(isOpen) {
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu",
  );
  primaryNavigation.classList.toggle("is-open", isOpen);
}

navToggle.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  setNavigationOpen(!isOpen);
});

primaryNavigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) setNavigationOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setNavigationOpen(false);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) setNavigationOpen(false);
});
