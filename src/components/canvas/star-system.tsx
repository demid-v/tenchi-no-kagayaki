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

  let radius = 0;

  let numOfPlanets =
    (getRandom() > 0.1 ? 1 : 0) +
    (getRandom() > 0.5 ? 1 : 0) +
    (getRandom() > 0.8 ? 1 : 0);

  for (let i = 0; i < numOfPlanets; i++) {
    const scale = getRandom(30, 40);
    radius = getRandom(200 + 100 * (i + 1), 300 + 100 * (i + 1));

    planets.push(
      <LavaPlanet
        key={`lava-planet-${i}`}
        pixels={pixels}
        radius={radius}
        period={Math.PI * (1 / 3)}
        relativeSpeed={getRandom(Math.PI / 16, Math.PI / 8)}
        eccentricity={getRandom(0, 10)}
        orbitAngle={getRandom(0, Math.PI)}
        scale={[scale, scale, 0]}
      />,
    );
  }

  numOfPlanets = getRandom() > 0.6 ? 1 : 0;

  for (let i = 0; i < numOfPlanets; i++) {
    const scale = getRandom(40, 50);
    radius = getRandom(radius + 150 * (i + 1), radius + 200 * (i + 1));

    planets.push(
      <DryPlanet
        key={`dry-planet-${i}`}
        pixels={pixels}
        radius={radius}
        period={Math.PI * (2 / 3)}
        relativeSpeed={getRandom(Math.PI / 16, Math.PI / 8)}
        eccentricity={getRandom(0, 30)}
        orbitAngle={getRandom(0, Math.PI)}
        scale={[scale, scale, 0]}
      />,
    );
  }

  numOfPlanets = getRandom() > 0.7 ? 1 : 0;

  for (let i = 0; i < numOfPlanets; i++) {
    const scale = getRandom(40, 60);
    radius = getRandom(radius + 150 * (i + 1), radius + 200 * (i + 1));

    planets.push(
      <WetPlanet
        key={`wet-planet-${i}`}
        pixels={pixels}
        radius={radius}
        period={-Math.PI * (2 / 3)}
        relativeSpeed={getRandom(Math.PI / 16, Math.PI / 8)}
        eccentricity={getRandom(0, 50)}
        orbitAngle={getRandom(0, Math.PI)}
        scale={[scale, scale, 0]}
      />,
    );
  }

  numOfPlanets = getRandom() > 0.3 ? 1 : 0;

  for (let i = 0; i < numOfPlanets; i++) {
    const scale = getRandom(50, 70);
    radius = getRandom(radius + 250 * (i + 1), radius + 300 * (i + 1));

    planets.push(
      <GasPlanet
        key={`gas-planet-${i}`}
        pixels={pixels}
        radius={radius}
        period={Math.PI * (1 / 3)}
        relativeSpeed={getRandom(Math.PI / 16, Math.PI / 8)}
        eccentricity={getRandom(0, 10)}
        orbitAngle={getRandom(0, Math.PI)}
        scale={[scale, scale, 0]}
      />,
    );
  }

  numOfPlanets = getRandom() > 0.3 ? 1 : 0;

  for (let i = 0; i < numOfPlanets; i++) {
    const scale = getRandom(80, 100);
    radius = getRandom(radius + 100 * (i + 1), radius + 150 * (i + 1));

    planets.push(
      <GasPlanetWithRings
        key={`gas-planet-with-rings-${i}`}
        pixels={pixels}
        radius={radius}
        period={Math.PI * (1 / 3)}
        relativeSpeed={getRandom(Math.PI / 16, Math.PI / 8)}
        eccentricity={getRandom(0, 10)}
        orbitAngle={getRandom(0, Math.PI)}
        scale={[scale, scale, 0]}
      />,
    );
  }

  numOfPlanets = (getRandom() > 0.1 ? 1 : 0) + (getRandom() > 0.9 ? 1 : 0);

  for (let i = 0; i < numOfPlanets; i++) {
    const scale = getRandom(10, 30);
    radius = getRandom(radius + 250 * (i + 1), radius + 300 * (i + 1));

    planets.push(
      <DeadPlanet
        key={`dead-planet-${i}`}
        pixels={pixels}
        radius={radius}
        period={Math.PI * (1 / 3)}
        relativeSpeed={getRandom(Math.PI / 16, Math.PI / 8)}
        eccentricity={getRandom(0, 200)}
        orbitAngle={getRandom(0, Math.PI)}
        scale={[scale, scale, 0]}
      />,
    );
  }

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
