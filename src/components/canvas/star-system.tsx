"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

import { getRandom } from "~/helpers/utils";

const GasPlanetWithRings = dynamic(
  () => import("~/components/canvas/gas-planet-with-rings"),
  {
    ssr: false,
  },
);

const GasPlanet = dynamic(() => import("~/components/canvas/gas-planet"), {
  ssr: false,
});

const LavaPlanet = dynamic(() => import("~/components/canvas/lava-planet"), {
  ssr: false,
});

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
  const pixels = 100;
  const starScale = getRandom(80, 150);

  const planets = [];

  let scale = getRandom(30, 40);
  let radius = getRandom(200, 300);

  planets.push(
    <LavaPlanet
      key={0}
      pixels={pixels}
      radius={radius}
      period={Math.PI * (1 / 3)}
      relativeSpeed={getRandom(Math.PI / 16, Math.PI / 8)}
      eccentricity={getRandom(0, 10)}
      orbitAngle={getRandom(0, Math.PI)}
      scale={[scale, scale, 0]}
    />,
  );

  scale = getRandom(40, 50);
  radius = getRandom(radius + 150, radius + 200);

  planets.push(
    <DryPlanet
      key={1}
      pixels={pixels}
      radius={radius}
      period={Math.PI * (2 / 3)}
      relativeSpeed={getRandom(Math.PI / 16, Math.PI / 8)}
      eccentricity={getRandom(0, 30)}
      orbitAngle={getRandom(0, Math.PI)}
      scale={[scale, scale, 0]}
    />,
  );

  scale = getRandom(40, 60);
  radius = getRandom(radius + 150, radius + 200);

  planets.push(
    <WetPlanet
      key={2}
      pixels={pixels}
      radius={radius}
      period={-Math.PI * (2 / 3)}
      relativeSpeed={getRandom(Math.PI / 16, Math.PI / 8)}
      eccentricity={getRandom(0, 50)}
      orbitAngle={getRandom(0, Math.PI)}
      scale={[scale, scale, 0]}
    />,
  );

  scale = getRandom(50, 70);
  radius = getRandom(radius + 250, radius + 300);

  planets.push(
    <GasPlanet
      key={3}
      pixels={pixels}
      radius={radius}
      period={Math.PI * (1 / 3)}
      relativeSpeed={getRandom(Math.PI / 16, Math.PI / 8)}
      eccentricity={getRandom(0, 10)}
      orbitAngle={getRandom(0, Math.PI)}
      scale={[scale, scale, 0]}
    />,
  );

  scale = getRandom(80, 100);
  radius = getRandom(radius + 100, radius + 150);

  planets.push(
    <GasPlanetWithRings
      key={4}
      pixels={pixels}
      radius={radius}
      period={Math.PI * (1 / 3)}
      relativeSpeed={getRandom(Math.PI / 16, Math.PI / 8)}
      eccentricity={getRandom(0, 10)}
      orbitAngle={getRandom(0, Math.PI)}
      scale={[scale, scale, 0]}
    />,
  );

  scale = getRandom(10, 30);
  radius = getRandom(radius + 250, radius + 300);

  planets.push(
    <DeadPlanet
      key={5}
      pixels={pixels}
      radius={radius}
      period={Math.PI * (1 / 3)}
      relativeSpeed={getRandom(Math.PI / 16, Math.PI / 8)}
      eccentricity={getRandom(0, 200)}
      orbitAngle={getRandom(0, Math.PI)}
      scale={[scale, scale, 0]}
    />,
  );

  return (
    <Suspense fallback={null}>
      <Star
        position={[0, 0, 0]}
        scale={[starScale, starScale, 0]}
        pixels={pixels}
      />
      {planets},
    </Suspense>
  );
};
