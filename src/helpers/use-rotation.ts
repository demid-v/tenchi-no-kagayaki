import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const useRotation = (
  object: React.RefObject<THREE.Group | null>,
  position: [number, number, number],
) => {
  const x = position[0];
  const y = position[1];

  const startPosition = Math.atan(y / x) + (x < 0 ? Math.PI : 0);
  const radius = Math.sqrt(x * x + y * y);

  const slowCoef = Math.pow(radius / 50, 2);

  useFrame(({ clock: { elapsedTime } }) => {
    if (!object.current) return;

    object.current.position.x =
      Math.cos(startPosition + elapsedTime / slowCoef) * radius;
    object.current.position.y =
      Math.sin(startPosition + elapsedTime / slowCoef) * radius;
  });
};

export default useRotation;
