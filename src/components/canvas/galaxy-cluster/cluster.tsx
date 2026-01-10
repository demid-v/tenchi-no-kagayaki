"use client";

import { useMemo } from "react";
import { Vector3, Vector4 } from "three";

import Stars from "~/components/canvas/star-system/stars";
import { getRandom } from "~/helpers/utils";

import Galaxy from "./galaxy";

const colors = [
  {
    x: 2.5661603318096935,
    y: 1.3217338600488582,
    z: 0.1854311991726568,
    w: 1,
  },
  {
    x: 0.7903623403922271,
    y: 0.40729294608464917,
    z: 0.04778203714739896,
    w: 1,
  },
  {
    x: 0.24034628780803818,
    y: 0.48069257561607637,
    z: 0.0801154068642051,
    w: 1,
  },
  {
    x: 0.34877614589751665,
    y: 0.6520406049983912,
    z: 0.25658637588454897,
    w: 1,
  },
  {
    x: 0.2991429547681756,
    y: 0.5162871206085727,
    z: 0.3525438754061504,
    w: 1,
  },
  {
    x: 0.18683005527941482,
    y: 0.30687282134215343,
    z: 0.26820413123021497,
    w: 1,
  },
  {
    x: 0.08051981653713189,
    y: 0.12834774983827418,
    z: 0.12763989900610032,
    w: 1,
  },
].map(({ x, y, z, w }) => new Vector4(x, y, z, w));
const seed = 86.29351845533343;

export { colors, seed };

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
        const rotation = getRandom(0, Math.PI / 2);
        const tilt = 1;
        const swirl = -9;

        return (
          <Galaxy
            key={i}
            position={position}
            scale={[scale, scale, 1]}
            colors={colors}
            tilt={tilt}
            swirl={swirl}
            rotation={rotation}
            seed={seed}
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
