export const fileType = (value: any) => {
  const type = value.split('/')[0];
  return type;
};
