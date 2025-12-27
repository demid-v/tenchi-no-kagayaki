"use client";

import { useRef } from "react";
import * as React from "react";
import * as THREE from "three";
import { Vector4 } from "three";

import useRandomColors from "~/helpers/use-random-colors";
import useUpdate from "~/helpers/use-update";
import { generateColors, getRandom } from "~/helpers/utils";
import { StarShader } from "~/templates/shader/star";
import { StarBlobsShader } from "~/templates/shader/star-blobs";
import { StarFlaresShader } from "~/templates/shader/star-flares";

const randomizeColors = () => {
  const seedColors = generateColors(4, getRandom(0.2, 0.4), 2.0);

  const cols = seedColors.slice(0, 4).map((color, index) => {
    let newCol = color
      .darken((index / 4.0) * 0.9)
      .lighten((1.0 - index / 4.0) * 0.8);

    if (index === 0) newCol = newCol.lighten(0.8);

    return new Vector4().fromArray(newCol.lch().array()).setW(1);
  });

  const newCols = [cols[0]!, ...cols, cols[1]!, cols[0]!];

  const blobs = newCols.slice(0, 1);
  const star = newCols.slice(1, 5);
  const flares = newCols.slice(5, 8);

  return { blobs, star, flares };
};

const randomColors = randomizeColors();

const Star = ({
  pixels = 100.0,
  ...props
}: {
  pixels?: number;
} & React.ComponentProps<"group">) => {
  const groupRef = useRef<THREE.Group>(null);

  const blobsRef = useRef<THREE.ShaderMaterial>(null);
  const starRef = useRef<THREE.ShaderMaterial>(null);
  const flaresRef = useRef<THREE.ShaderMaterial>(null);

  useRandomColors([
    { object: blobsRef, colors: randomColors.blobs },
    { object: starRef, colors: randomColors.star },
    { object: flaresRef, colors: randomColors.flares },
  ]);

  useUpdate(groupRef);

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
