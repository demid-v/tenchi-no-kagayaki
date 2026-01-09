"use client";

import { useSetAtom } from "jotai";
import { useRef } from "react";
import * as THREE from "three";
import { Vector4 } from "three";

import { sceneAtom } from "~/helpers/store";
import useColors from "~/helpers/use-random-colors";
import useUpdate from "~/helpers/use-update";
import useUpdatePixels from "~/helpers/use-update-pixels";
import { generateColors, getRandom } from "~/helpers/utils";
import GalaxyShader from "~/templates/shader/galaxy";

const randomizeColors = () => {
  const seedColors = generateColors(7, getRandom(0.5, 0.8), 1.4);

  const colors = seedColors.map((color, index) => {
    const newCol = color.darken(index / 7.0).lighten((1.0 - index / 6.0) * 0.6);
    return new Vector4().fromArray(newCol.xyz().array()).setW(1);
  });

  return colors;
};

const Galaxy = ({
  pixels = 100,
  colors,
  tilt,
  swirl,
  rotation,
  ...props
}: {
  pixels?: number;
  colors: Vector4[];
  tilt?: number;
  swirl?: number;
  rotation?: number;
} & React.ComponentProps<"group">) => {
  const groupRef = useRef<THREE.Group>(null);
  const groundRef = useRef<THREE.ShaderMaterial>(null);

  const setScene = useSetAtom(sceneAtom);

  useColors([{ object: groundRef, colors }]);
  useUpdate(groupRef);
  useUpdatePixels(groupRef);

  return (
    <group
      ref={groupRef}
      onClick={() => {
        setScene("galaxy");
      }}
      {...props}
    >
      <mesh>
        <planeGeometry args={[1, 1]} />
        <GalaxyShader
          ref={groundRef}
          pixels={pixels}
          tilt={tilt}
          swirl={swirl}
          rotation={rotation}
        />
      </mesh>
    </group>
  );
};

export default Galaxy;
export { randomizeColors };
