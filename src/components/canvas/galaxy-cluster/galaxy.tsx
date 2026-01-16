"use client";

import { useAtom, useSetAtom } from "jotai";
import { useRef, useState } from "react";
import * as THREE from "three";
import { Vector4 } from "three";

import { currentGalaxyIdAtom, sceneAtom } from "~/helpers/store";
import useColors from "~/helpers/use-random-colors";
import useUpdate from "~/helpers/use-update";
import useUpdatePixels from "~/helpers/use-update-pixels";
import { generateColors, getRandom } from "~/helpers/utils";
import GalaxyShader from "~/templates/shader/galaxy";

const randomizeColors = () => {
  const seedColors = generateColors(7, getRandom(0.5, 0.8), 1.4);

  const colors = seedColors.map((color, i) => {
    const newColor = color
      .offsetHSL(0, 0, -(i / 7))
      .offsetHSL(0, 0, (1 - i / 6) * 0.6);

    return new Vector4(...newColor.toArray(), 1);
  });

  return colors;
};

const Galaxy = ({
  pixels = 100,
  galaxyId,
  colors,
  tilt,
  swirl,
  rotation,
  rotationSpeed,
  seed,
  scale,
  ...props
}: {
  pixels?: number;
  galaxyId: number;
  colors: Vector4[];
  tilt?: number;
  swirl?: number;
  rotation?: number;
  rotationSpeed?: number;
  seed?: number;
} & React.ComponentProps<"group">) => {
  const groupRef = useRef<THREE.Group>(null);
  const galaxyRef = useRef<THREE.ShaderMaterial>(null);

  const [scene, setScene] = useAtom(sceneAtom);

  useColors([{ object: galaxyRef, colors }]);
  useUpdate(groupRef);
  useUpdatePixels(groupRef);

  const [sceneScale, setSceneScale] = useState(scale);

  const setCurrentGalaxyId = useSetAtom(currentGalaxyIdAtom);

  return (
    <group
      {...props}
      ref={groupRef}
      onPointerOver={() => {
        if (!galaxyRef.current) return;

        galaxyRef.current.uniforms.brightness!.value = 1.5;
        setSceneScale((scale) => {
          return Array.isArray(scale)
            ? [scale[1] * 1.2, scale[1] * 1.2, scale[2]]
            : scale;
        });
      }}
      onPointerLeave={() => {
        if (!galaxyRef.current) return;

        galaxyRef.current.uniforms.brightness!.value = 1;
        setSceneScale(scale);
      }}
      onClick={() => {
        if (scene !== "galaxyCluster") return;

        setCurrentGalaxyId(galaxyId);
        setScene("galaxy");
      }}
      scale={sceneScale}
    >
      <mesh>
        <planeGeometry args={[1, 1]} />
        <GalaxyShader
          ref={galaxyRef}
          pixels={pixels}
          tilt={tilt}
          swirl={swirl}
          rotation={rotation}
          rotationSpeed={rotationSpeed}
          seed={seed}
        />
      </mesh>
    </group>
  );
};

export default Galaxy;
export { randomizeColors };
