"use client";

import { useMemo } from "react";
import { Vector3 } from "three";

import Stars from "~/components/canvas/star-system/stars";
import { getRandom } from "~/helpers/utils";

import Galaxy, { randomizeColors } from "./galaxy";

const Cluster = () => {
  const size = 70;
  const complexity = 70;
  const variation = 50;
  const angleStep = (Math.PI * 2) / complexity;

  const galaxies = useMemo(
    () =>
      new Array(100).fill(0).map((_el, i) => {
        const angle = i * angleStep;
        const radius = size * (1 + (Math.random() - 0.5) * variation);

        const position = new Vector3(
          radius * Math.cos(angle),
          radius * Math.sin(angle),
          0,
        );

        const scale = getRandom(60, 100);
        const colors = randomizeColors();
        const rotation = getRandom(0, Math.PI / 2);
        const tilt = getRandom(1, 4);
        const swirl = getRandom(-13, -5);

        return (
          <Galaxy
            key={i}
            position={position}
            scale={[scale, scale, 1]}
            colors={colors}
            tilt={tilt}
            swirl={swirl}
            rotation={rotation}
          />
        );
      }),
    [],
  );

  return (
    <group>
      <Stars />
      {galaxies}
    </group>
  );
};

export default Cluster;
