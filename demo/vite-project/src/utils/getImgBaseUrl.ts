const getImgBaseUrl = (img: string) => {
  return new URL(`${img}`, import.meta.env.VITE_IMG_BASE_URL).href;
};

export default getImgBaseUrl;
