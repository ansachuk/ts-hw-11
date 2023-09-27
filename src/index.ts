import "modern-normalize";
import "./sass/index.scss";

import { Notify } from "notiflix";

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { makeSmoothScroll } from "./ts/scroll";
import { fetchPhotos, Photo } from "./ts/fetch-images";

const searchFormRef = document.querySelector<HTMLFormElement>("#search-form");
const galleryWrapperRef = document.querySelector<HTMLDivElement>(".gallery");
const showMoreBtnRef = document.querySelector<HTMLButtonElement>(".show-more-btn");

const lightbox = new SimpleLightbox(".gallery a");

let currentPage = 1;
let currentQuery = "";

const onFormSubmit = async (e: SubmitEvent) => {
	e.preventDefault();

	const input = (e.currentTarget as HTMLFormElement).elements[0] as HTMLInputElement;

	currentPage = 1;
	currentQuery = input.value;

	if (!currentQuery) {
		Notify.failure("You mast enter query!");
		return;
	}

	if (galleryWrapperRef && showMoreBtnRef) {
		const photos = await fetchPhotos(currentQuery, currentPage);

		if (!photos.hits.length) {
			Notify.failure("We not found matches!");
			galleryWrapperRef.innerHTML = "";
			showMoreBtnRef.style.display = "none";
			return;
		}

		Notify.success(`Hooray! We found ${photos.totalHits} images.`);

		showMoreBtnRef.style.display = "block";

		galleryWrapperRef.innerHTML = await makeGalleryElementsMarkup(photos.hits);
		lightbox.refresh();

		makeSmoothScroll(0.3);
	}
};

const makeGalleryElementsMarkup = (imagesArray: Photo[]) => {
	return imagesArray
		.map(
			({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
		<a href="${largeImageURL}" class="large-img-link photo-card">
			<div class="photo-card">
				<img width="400" heigth="300" src="${webformatURL}" alt="${tags}" loading="lazy" />
				<div class="info">
					<p class="info-item"><b>Likes</b> ${likes}</p>
					<p class="info-item"><b>Views</b> ${views}</p>
					<p class="info-item"><b>Comments</b> ${comments}</p>
					<p class="info-item"><b>Downloads</b> ${downloads}</p>
				</div>
			</div>
		</a>`,
		)
		.join("");
};

const onShowMoreClick = async () => {
	currentPage += 1;
	const photos = await fetchPhotos(currentQuery, currentPage);

	if (showMoreBtnRef && galleryWrapperRef) {
		if (!photos.hits.length) {
			Notify.failure("Ooops...No images more!");
			showMoreBtnRef.style.display = "none";
			return;
		}

		galleryWrapperRef.insertAdjacentHTML("beforeend", makeGalleryElementsMarkup(photos.hits));

		lightbox.refresh();

		makeSmoothScroll(1.5);
	}
};

searchFormRef?.addEventListener("submit", onFormSubmit);
showMoreBtnRef?.addEventListener("click", onShowMoreClick);
