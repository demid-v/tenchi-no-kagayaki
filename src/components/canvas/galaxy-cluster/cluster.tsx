"use client";

import { useSetAtom } from "jotai";
import { useEffect, useMemo } from "react";
import { Vector3 } from "three";

import Stars from "~/components/canvas/star-system/stars";
import { initGalaxyAtom } from "~/helpers/store";
import { flip, getRandom } from "~/helpers/utils";

import Galaxy, { randomizeColors } from "./galaxy";

const Cluster = () => {
  const setGalaxy = useSetAtom(initGalaxyAtom);

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

        const scale = getRandom(60, 120);
        const colors = randomizeColors();
        const rotation = getRandom(0, Math.PI / 2);
        const tilt = getRandom(1, 3);
        const swirl = getRandom(-12, -6);
        const seed = flip() ? Math.random() * 10 : Math.random() * 100;

        return {
          key: i,
          position,
          colors,
          swirl,
          seed,
          element: (
            <Galaxy
              key={i}
              galaxyId={i}
              position={position}
              scale={[scale, scale, 1]}
              colors={colors}
              tilt={tilt}
              swirl={swirl}
              rotation={rotation}
              seed={seed}
            />
          ),
        };
      }),
    [],
  );

  useEffect(() => {
    galaxies.forEach((galaxy) => {
      setGalaxy({
        key: galaxy.key,
        position: galaxy.position,
        colors: galaxy.colors,
        swirl: galaxy.swirl,
        seed: galaxy.seed,
      });
    });
  }, [galaxies]);

  return (
    <group>
      <Stars />
      {galaxies.map((galaxy) => galaxy.element)}
    </group>
  );
};

export default Cluster;
