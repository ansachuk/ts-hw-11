export function makeSmoothScroll(coef: number): void {
	const cardHeight = document.querySelector<HTMLDivElement>(".gallery")?.firstElementChild?.getBoundingClientRect().height;

	window.scrollBy({
		top: cardHeight || 0 * coef,
		behavior: "smooth",
	});
}
