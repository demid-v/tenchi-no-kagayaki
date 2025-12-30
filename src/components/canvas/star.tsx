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

const standardColors = [
  // Yellow
  {
    blobs: [new Vector4(1.01, 1.01, 0.95)],
    star: [
      new Vector4(1.01, 1.01, 0.95),
      new Vector4(1.06, 0.79, 0.45),
      new Vector4(0.8, 0.34, 0.28),
      new Vector4(0.34, 0.07, 0.24),
    ],
    flares: [new Vector4(1.06, 0.79, 0.45), new Vector4(1.01, 1.01, 0.95)],
  },
  // Red
  {
    blobs: [new Vector4(1.01, 0.96, 0.98)],
    star: [
      new Vector4(1.01, 0.96, 0.98),
      new Vector4(1.06, 0.49, 0.59),
      new Vector4(0.89, 0.24, 0.25),
      new Vector4(0.54, 0.11, 0.09),
    ],
    flares: [new Vector4(1.06, 0.49, 0.59), new Vector4(1.01, 0.96, 0.98)],
  },
  // Blue
  {
    blobs: [new Vector4(1.01, 1.01, 0.99)],
    star: [
      new Vector4(1.01, 1.01, 0.99),
      new Vector4(0.77, 0.93, 0.97),
      new Vector4(0.38, 0.63, 0.89),
      new Vector4(0.09, 0.28, 0.58),
    ],
    flares: [new Vector4(0.77, 0.93, 0.97), new Vector4(1.01, 1.01, 0.99)],
  },
  // Purple
  {
    blobs: [new Vector4(1, 1.01, 1.01)],
    star: [
      new Vector4(1, 1.01, 1.01),
      new Vector4(0.76, 0.71, 0.84),
      new Vector4(0.4, 0.29, 0.45),
      new Vector4(0.11, 0.08, 0.11),
    ],
    flares: [new Vector4(0.76, 0.71, 0.84), new Vector4(1, 1.01, 1.01)],
  },
  // Pink
  {
    blobs: [new Vector4(1, 0.94, 0.96)],
    star: [
      new Vector4(1, 0.94, 0.96),
      new Vector4(1.05, 0.47, 0.82),
      new Vector4(0.85, 0.34, 0.85),
      new Vector4(0.38, 0.24, 0.58),
    ],
    flares: [new Vector4(1.05, 0.47, 0.82), new Vector4(1, 1.01, 1.01)],
  },
  // Cyan
  {
    blobs: [new Vector4(1.02, 0.97, 1.01)],
    star: [
      new Vector4(1.02, 0.97, 1.01),
      new Vector4(0.89, 1.01, 1.06),
      new Vector4(0.43, 0.86, 0.73),
      new Vector4(0.08, 0.33, 0.25),
    ],
    flares: [new Vector4(0.89, 1.01, 1.06), new Vector4(1, 1.01, 1.01)],
  },
];

const randomizeColors = () => {
  if (getRandom() > 0.3) {
    return standardColors[Math.floor(getRandom(0, standardColors.length))]!;
  }

  const seedColors = generateColors(4, getRandom(0.2, 0.4), 2.0);

  const cols = seedColors.slice(0, 4).map((color, i) => {
    let newCol = color.darken((i / 4.0) * 0.9).lighten((1.0 - i / 4.0) * 0.8);

    if (i === 0) newCol = newCol.lighten(0.8);

    return new Vector4().fromArray(newCol.hsv().array()).setW(1);
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
