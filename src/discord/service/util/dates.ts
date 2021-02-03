export const formatDateFullStr = (value: string | number): string => {
  return new Date(value).toLocaleString("ru-RU", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
};
