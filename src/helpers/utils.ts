import Color from "color";
import { Vector3 } from "three";

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
    getRandom(0.0, 1.0),
    getRandom(0.0, 1.0),
    getRandom(0.0, 1.0),
  ).multiplyScalar(getRandom(1.0, 3.0));

  const cols = [];
  for (let i = 0; i < numOfColors; i++) {
    cols.push(
      Color.hsv(
        a.x + b.x * Math.cos(6.28318 * (c.x * (i / numOfColors) + d.x)),
        a.y + b.y * Math.cos(6.28318 * (c.y * (i / numOfColors) + d.y)),
        a.z + b.z * Math.cos(6.28318 * (c.z * (i / numOfColors) + d.z)),
      ),
    );
  }

  return cols;
};

export { flip, getRandom, generateColors };
