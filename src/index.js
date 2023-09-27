import "modern-normalize";
import "./sass/index.scss";

import { Notify } from "notiflix";

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { makeSmoothScroll } from "./js/scroll";
import { fetchPhotos } from "./js/fetch-images";

const searchFormRef = document.querySelector("#search-form");
const galleryWrapperRef = document.querySelector(".gallery");
const showMoreBtnRef = document.querySelector(".show-more-btn");
const lightbox = new SimpleLightbox(".gallery a");

let currentPage = 1;
let currentQuerry = "";

searchFormRef.addEventListener("submit", onFormSubmit);
showMoreBtnRef.addEventListener("click", onShowMoreClick);

async function onFormSubmit(e) {
  e.preventDefault();

  currentPage = 1;
  currentQuerry = e.currentTarget.searchQuery.value;

  if (!currentQuerry) {
    Notify.failure("You mast enter query!");
    return;
  }

  const photos = await fetchPhotos(currentQuerry, currentPage);

  if (!photos.hits.length) {
    Notify.failure("We not found matches!");
    galleryWrapperRef.innerHTML = "";
    showMoreBtnRef.style.display = "none";
    return;
  }

  console.log(photos.hits[0]);
  Notify.success(`Hooray! We found ${photos.totalHits} images.`);

  showMoreBtnRef.style.display = "block";

  galleryWrapperRef.innerHTML = await makeGalleryElementsMarkup(photos.hits);
  lightbox.refresh();

  makeSmoothScroll(0.3);
}

function makeGalleryElementsMarkup(imagesArray) {
  return imagesArray
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<a href="${largeImageURL}" class="large-img-link photo-card">
      <div class="photo-card">
        <img
          width="400"
          heigth="300"
          src="${webformatURL}"
          alt="${tags}"
          loading="lazy"
        />
        <div class="info">
          <p class="info-item"><b>Likes</b> ${likes}</p>
          <p class="info-item"><b>Views</b> ${views}</p>
          <p class="info-item"><b>Comments</b> ${comments}</p>
          <p class="info-item"><b>Downloads</b> ${downloads}</p>
        </div>
      </div>
    </a>`
    )
    .join("");
}

async function onShowMoreClick(e) {
  currentPage += 1;
  const photos = await fetchPhotos(currentQuerry, currentPage);

  if (!photos.hits.length) {
    Notify.failure("Ooops...No images more!");
    showMoreBtnRef.style.display = "none";
    return;
  }

  galleryWrapperRef.insertAdjacentHTML(
    "beforeend",
    makeGalleryElementsMarkup(photos.hits)
  );

  lightbox.refresh();

  makeSmoothScroll(1.5);
}
