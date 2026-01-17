"use client";

import { useSetAtom } from "jotai";
import { useEffect, useMemo } from "react";
import { Vector2, Vector3 } from "three";

import { initGalaxyAtom } from "~/helpers/store";
import { flip, getRandom } from "~/helpers/utils";

import Galaxy, { randomizeColors } from "./galaxy";

const rand = (coord: Vector2) => {
  coord = coord.divide(new Vector2(1.0, 1.0)).multiplyScalar(3);

  return (
    (Math.sin(coord.distanceTo(new Vector2(12.9898, 78.233))) *
      15.5453 *
      Math.random()) %
    1
  );
};

const Cluster = () => {
  const setGalaxy = useSetAtom(initGalaxyAtom);

  const galaxies = useMemo(
    () =>
      new Array(Math.floor(getRandom(10, 100))).fill(0).map((_, i) => {
        const coords = new Vector2(getRandom(), getRandom()).subScalar(0.5);
        coords.addScalar(rand(coords)).multiplyScalar(getRandom(300, 400));

        const position = new Vector3(...coords, 1);

        const scale = (() => {
          const r = getRandom();

          if (r < 0.1) {
            return getRandom() < 0.6 ? getRandom(10, 30) : getRandom(200, 300);
          }

          return getRandom(80, 100);
        })();

        const colors = randomizeColors();
        const rotation = getRandom(0, Math.PI / 2);
        const rotationSpeed = getRandom(0.01, 1);
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
              rotationSpeed={rotationSpeed}
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

  return <group>{galaxies.map((galaxy) => galaxy.element)}</group>;
};

export default Cluster;
