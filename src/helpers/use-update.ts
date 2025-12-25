import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const useUpdate = (object: React.RefObject<THREE.Group | null>) => {
  useFrame(({ clock: { elapsedTime }, gl, scene, camera }) => {
    if (!object.current) return;

    object.current.children.forEach((planet) => {
      if (!(planet instanceof THREE.Mesh)) return;
      if (planet.material.uniforms.time === undefined) return;

      planet.material.uniforms.time.value = elapsedTime;
    });

    gl.render(scene, camera);
  });
};

export default useUpdate;
