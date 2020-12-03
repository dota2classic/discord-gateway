export const formatDateFullStr = (value: string | number): string => {
  return new Date(value).toLocaleString("ru-RU", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour12: false
  });
};