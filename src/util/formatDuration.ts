

function formatTime(seconds: number, delimeter: string = ':') {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  return [
    h,
    m > 9 ? m : (h ? '0' + m : m || '0'),
    s > 9 ? s : '0' + s
  ].filter(Boolean).join(delimeter);
}


export const formatDuration = (d: number) => {
  return formatTime(d / 1000, ':')
};


