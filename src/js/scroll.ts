export function makeSmoothScroll(coef) {
  const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * coef,
    behavior: "smooth",
  });
}
