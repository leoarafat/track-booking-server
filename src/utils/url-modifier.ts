import config from '../config';

export const updateImageUrl = (url: string): string => {
  const newUrl = `${config.base_url}/${url}`;
  return newUrl;
};
