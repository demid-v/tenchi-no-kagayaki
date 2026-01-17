import { useLayoutEffect } from "react";
import * as THREE from "three";

const useColors = (
  objects: {
    object: React.RefObject<THREE.ShaderMaterial | null>;
    colors: THREE.Vector4[];
  }[],
) => {
  useLayoutEffect(() => {
    for (const object of objects) {
      // eslint-disable-next-line react-hooks/immutability
      object.object.current!.uniforms.colors!.value = object.colors;
    }
  });
};

export default useColors;
