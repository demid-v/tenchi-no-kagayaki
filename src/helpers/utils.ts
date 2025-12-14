export function flip() {
  return Math.random() > 0.5;
}

export const getRandom = (min: number, max: number) =>
  Math.random() * (max - min) + min;
