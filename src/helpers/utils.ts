import { Vector3 } from "three";
import { Color } from "three";

const flip = () => Math.random() > 0.5;

const getRandom = (min = 0, max = 1) => Math.random() * (max - min) + min;

const generateColors = (numOfColors = 4, hueDiff = 0.9, saturation = 0.5) => {
  const a = new Vector3(0.5, 0.5, 0.5);
  const b = new Vector3(0.5, 0.5, 0.5).multiplyScalar(saturation);
  const c = new Vector3(
    getRandom(0.5, 1.5),
    getRandom(0.5, 1.5),
    getRandom(0.5, 1.5),
  ).multiplyScalar(hueDiff);
  const d = new Vector3(
    getRandom(0, 1),
    getRandom(0, 1),
    getRandom(0, 1),
  ).multiplyScalar(getRandom(1, 3));

  const n = Math.max(1, numOfColors - 1);

  const colors = new Array(numOfColors)
    .fill(0)
    .map((_, i) =>
      new Color().setRGB(
        a.x + b.x * Math.cos(6.28318 * (c.x * (i / n) + d.x)),
        a.y + b.y * Math.cos(6.28318 * (c.y * (i / n) + d.y)),
        a.z + b.z * Math.cos(6.28318 * (c.z * (i / n) + d.z)),
      ),
    );

  return colors;
};

const darken = (color: Color, p_amount: number) => {
  color = color.clone();

  color.r = color.r * (1 - p_amount);
  color.g = color.g * (1 - p_amount);
  color.b = color.b * (1 - p_amount);

  return color;
};

const lighten = (color: Color, p_amount: number) => {
  color = color.clone();

  color.r = color.r + (1 - color.r) * p_amount;
  color.g = color.g + (1 - color.g) * p_amount;
  color.b = color.b + (1 - color.b) * p_amount;

  return color;
};

export { flip, getRandom, generateColors, darken, lighten };
