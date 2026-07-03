export const zeroPadHelper = (num: string | number, places: number) =>
  String(num).padStart(places, "0");

export const percentageHelper = (percent: number, total: number) =>
  ((percent / 100) * total).toFixed(2);
