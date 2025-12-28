import { useLayoutEffect } from "react";
import * as THREE from "three";

const useRandomColors = (
  randomize = true,
  objects: {
    object: React.RefObject<THREE.ShaderMaterial | null>;
    colors: THREE.Vector4[];
  }[],
) => {
  useLayoutEffect(() => {
    if (!randomize) return;

    for (const object of objects) {
      object.object.current!.uniforms.colors!.value = object.colors;
    }
  });
};

export default useRandomColors;
