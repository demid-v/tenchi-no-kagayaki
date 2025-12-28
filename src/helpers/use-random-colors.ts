import { useLayoutEffect } from "react";
import * as THREE from "three";

const useRandomColors = (
  objects: {
    object: React.RefObject<THREE.ShaderMaterial | null>;
    colors: THREE.Vector4[];
  }[],
) => {
  useLayoutEffect(() => {
    for (const object of objects) {
      object.object.current!.uniforms.colors!.value = object.colors;
    }
  });
};

export default useRandomColors;
