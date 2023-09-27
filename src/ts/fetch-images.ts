import axios from "axios";

enum SearchParams {
	USER_KEY = "34948813-296850008c19dad8d09f83fef",
	BASE_URL = "https://pixabay.com/api/",
	IMAGE_TYPE = "photo",
	ORIENTATION = "horizontal",
}

export type Photo = {
	collections: number;
	comments: number;
	downloads: number;
	id: number;
	imageHeight: number;
	imageSize: number;
	imageWidth: number;
	largeImageURL: string;
	likes: number;
	pageURL: string;
	previewHeight: number;
	previewURL: string;
	previewWidth: number;
	tags: string;
	type: string;
	user: string;
	userImageURL: string;
	user_id: number;
	views: number;
	webformatHeight: number;
	webformatURL: string;
	webformatWidth: number;
};
export type Data = {
	total: number;
	totalHits: number;
	hits: Photo[];
};
const searchParams = {
	key: SearchParams.USER_KEY,
	image_type: SearchParams.IMAGE_TYPE,
	orientation: SearchParams.ORIENTATION,
	safesearch: "true",
	per_page: "40",
};

const URLParams = new URLSearchParams(Object.entries(searchParams));

export const fetchPhotos = async (q: string, page: number): Promise<Data> => {
	try {
		const res = await axios.get(`${SearchParams.BASE_URL}?${URLParams}&q=${q}&page=${page}`);
		console.log("data", res.data);
		return res.data;
	} catch (error) {
		throw new Error();
	}
};
