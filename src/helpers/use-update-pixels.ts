import { useAtom } from "jotai";
import { useEffect } from "react";
import * as THREE from "three";

import { pixelsAtom } from "./store";

const useUpdatePixels = (
  object: React.RefObject<THREE.Group | THREE.Mesh | null>,
) => {
  const [pixels] = useAtom(pixelsAtom);

  useEffect(() => {
    if (!object.current) return;

    object.current.children.forEach((planet) => {
      if (!(planet instanceof THREE.Mesh)) return;

      planet.material.uniforms.pixels.value = pixels;
    });
  }, [object, pixels]);
};

export default useUpdatePixels;
