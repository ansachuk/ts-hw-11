import axios from "axios";

const USER_KEY = "34948813-296850008c19dad8d09f83fef";
const BASE_URL = "https://pixabay.com/api/";
const IMAGE_TYPE = "photo";
const ORIENTATION = "horizontal";
const SAFE_SEARCH = "true";

const searchParams = new URLSearchParams({
  key: USER_KEY,
  image_type: IMAGE_TYPE,
  orientation: ORIENTATION,
  safesearch: SAFE_SEARCH,
  per_page: 40,
});

export async function fetchPhotos(q, page) {
  try {
    const res = await axios.get(
      `${BASE_URL}?${searchParams}&q=${q}&page=${page}`
    );
    console.log(res.data);
    return res.data;
  } catch (error) {}
}
