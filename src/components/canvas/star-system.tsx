"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

import { getRandom } from "~/helpers/utils";

const DeadPlanet = dynamic(() => import("~/components/canvas/dead-planet"), {
  ssr: false,
});

const DryPlanet = dynamic(() => import("~/components/canvas/dry-planet"), {
  ssr: false,
});

const Star = dynamic(() => import("~/components/canvas/star"), { ssr: false });

const WetPlanet = dynamic(() => import("~/components/canvas/wet-planet"), {
  ssr: false,
});

export const StarSystem = () => {
  const starScale = getRandom(80, 150);

  const planets = [];

  const scale1 = getRandom(10, 50);
  const radius1 = getRandom(200, 300);

  planets.push(
    <DryPlanet
      key={1}
      radius={radius1}
      period={Math.PI * (2 / 3)}
      relativeSpeed={getRandom(Math.PI / 16, Math.PI / 8)}
      eccentricity={getRandom(0, 30)}
      orbitAngle={getRandom(0, Math.PI)}
      scale={[scale1, scale1, 0]}
    />,
  );

  const scale2 = getRandom(40, 60);
  const radius2 = getRandom(radius1 + 150, radius1 + 200);

  planets.push(
    <WetPlanet
      key={2}
      radius={radius2}
      period={-Math.PI * (2 / 3)}
      relativeSpeed={getRandom(Math.PI / 16, Math.PI / 8)}
      eccentricity={getRandom(0, 50)}
      orbitAngle={getRandom(0, Math.PI)}
      scale={[scale2, scale2, 0]}
    />,
  );

  const scale3 = getRandom(10, 30);
  const radius3 = getRandom(radius2 + 250, radius2 + 300);

  planets.push(
    <DeadPlanet
      key={3}
      radius={radius3}
      period={Math.PI * (1 / 3)}
      relativeSpeed={getRandom(Math.PI / 16, Math.PI / 8)}
      eccentricity={getRandom(0, 200)}
      orbitAngle={getRandom(0, Math.PI)}
      scale={[scale3, scale3, 0]}
    />,
  );

  return (
    <Suspense fallback={null}>
      <Star position={[0, 0, 0]} scale={[starScale, starScale, 0]} />
      {planets}
    </Suspense>
  );
};
