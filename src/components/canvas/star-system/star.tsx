"use client";

import { useAtomValue } from "jotai";
import { useMemo, useRef } from "react";
import * as React from "react";
import * as THREE from "three";
import { Vector4 } from "three";

import { currentStarSystemAtom } from "~/helpers/store";
import useColors from "~/helpers/use-random-colors";
import useUpdate from "~/helpers/use-update";
import useUpdatePixels from "~/helpers/use-update-pixels";
import { generateColors, getRandom } from "~/helpers/utils";
import { StarShader } from "~/templates/shader/star";
import { StarBlobsShader } from "~/templates/shader/star-blobs";
import { StarFlaresShader } from "~/templates/shader/star-flares";

const randomizeColors = (initSeedColor?: Vector4) => {
  const seedColors = generateColors(4, getRandom(0.2, 0.4), 2.0);

  const cols = seedColors.slice(0, 4).map((color, i) => {
    if (initSeedColor && i === 1) return initSeedColor.setW(1);

    let newCol = color.darken((i / 4.0) * 0.9).lighten((1.0 - i / 4.0) * 0.8);
    if (i === 0) newCol = newCol.lighten(0.8);

    return new Vector4().fromArray(newCol.xyz().array()).setW(1);
  });

  const newCols = [cols[0]!, ...cols, cols[1]!, cols[0]!];

  return newCols;
};

const Star = ({
  pixels = 100,
  ...props
}: {
  pixels?: number;
} & React.ComponentProps<"group">) => {
  const groupRef = useRef<THREE.Group>(null);

  const blobsRef = useRef<THREE.ShaderMaterial>(null);
  const starRef = useRef<THREE.ShaderMaterial>(null);
  const flaresRef = useRef<THREE.ShaderMaterial>(null);

  const currentStarSystemColors = useAtomValue(currentStarSystemAtom)?.color;
  const colors = useMemo(
    () => randomizeColors(currentStarSystemColors),
    [currentStarSystemColors],
  );

  const blobs = colors.slice(0, 1);
  const star = colors.slice(1, 5);
  const flares = colors.slice(5, 8);

  useColors([
    { object: blobsRef, colors: blobs },
    { object: starRef, colors: star },
    { object: flaresRef, colors: flares },
  ]);

  useUpdate(groupRef);
  useUpdatePixels(groupRef);

  return (
    <group ref={groupRef} {...props}>
      <mesh scale={[2, 2, 1]}>
        <planeGeometry args={[1, 1]} />
        <StarBlobsShader pixels={pixels} ref={blobsRef} />
      </mesh>
      <mesh>
        <planeGeometry args={[1, 1]} />
        <StarShader pixels={pixels} ref={starRef} />
      </mesh>
      <mesh scale={[1.7, 1.7, 1]}>
        <planeGeometry args={[1, 1]} />
        <StarFlaresShader pixels={pixels} ref={flaresRef} />
      </mesh>
    </group>
  );
};

export default Star;
export { randomizeColors };
