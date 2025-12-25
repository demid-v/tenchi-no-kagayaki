import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const useRotation = (
  object: React.RefObject<THREE.Group | null>,
  position: React.ComponentProps<"group">["position"],
) => {
  useFrame(({ clock: { elapsedTime } }) => {
    if (!object.current || !Array.isArray(position)) return;

    const x = position[0];
    const y = position[1];

    const startPosition = Math.atan(y / x) + (x < 0 ? Math.PI : 0);
    const radius = Math.sqrt(x * x + y * y);

    object.current.position.x =
      Math.cos(startPosition + elapsedTime / (radius / 2.5)) * radius;
    object.current.position.y =
      Math.sin(startPosition + elapsedTime / (radius / 2.5)) * radius;
  });
};

export default useRotation;
