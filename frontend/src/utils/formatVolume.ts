export const formatVolume = (value: string | number) => {
  const num = Number(value);
  if (isNaN(num)) return "";
  return num.toString().replace(/\.0+$/, "");
};
