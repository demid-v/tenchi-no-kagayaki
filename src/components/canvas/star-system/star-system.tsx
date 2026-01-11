"use client";

import { useAtom, useAtomValue } from "jotai";
import dynamic from "next/dynamic";
import { Suspense, useMemo } from "react";

import { randomizeColors as randomizeColorsDeadPlanet } from "~/components/canvas/star-system/dead-planet";
import { randomizeColors as randomizeColorsDryPlanet } from "~/components/canvas/star-system/dry-planet";
import { randomizeColors as randomizeColorsGasPlanet } from "~/components/canvas/star-system/gas-planet";
import { randomizeColors as randomizeColorsGasPlanetWithRings } from "~/components/canvas/star-system/gas-planet-with-rings";
import { randomizeColors as randomizeColorsLavaPlanet } from "~/components/canvas/star-system/lava-planet";
import { randomizeColors as randomizeColorsWetPlanet } from "~/components/canvas/star-system/wet-planet";
import { currentStarSystemIdAtom, showOrbitsAtom } from "~/helpers/store";
import { getRandom } from "~/helpers/utils";

const GasPlanetWithRings = dynamic(
  () => import("~/components/canvas/star-system/gas-planet-with-rings"),
  {
    ssr: false,
  },
);

const GasPlanet = dynamic(
  () => import("~/components/canvas/star-system/gas-planet"),
  {
    ssr: false,
  },
);

const LavaPlanet = dynamic(
  () => import("~/components/canvas/star-system/lava-planet"),
  {
    ssr: false,
  },
);

const DeadPlanet = dynamic(
  () => import("~/components/canvas/star-system/dead-planet"),
  {
    ssr: false,
  },
);

const DryPlanet = dynamic(
  () => import("~/components/canvas/star-system/dry-planet"),
  {
    ssr: false,
  },
);

const Star = dynamic(() => import("~/components/canvas/star-system/star"), {
  ssr: false,
});

const WetPlanet = dynamic(
  () => import("~/components/canvas/star-system/wet-planet"),
  {
    ssr: false,
  },
);

const Orbit = dynamic(() => import("~/components/canvas/star-system/orbit"), {
  ssr: false,
});

const getPlanets = () => {
  const starScale = getRandom(40, 80);

  const star = <Star position={[0, 0, 2]} scale={[starScale, starScale, 1]} />;

  const planets = [];
  const orbits = [];

  let radius = starScale + 100;

  let numOfPlanets = Math.floor(getRandom(1, 4));

  for (let i = 0; i < numOfPlanets; i++) {
    const scale = getRandom(15, 20);
    radius = getRandom(radius + 25 * i, radius + 70 * i);

    const eccentricity = getRandom(radius / 50, radius / 20);
    const orbitAngle = getRandom(0, Math.PI);

    planets.push(
      <LavaPlanet
        key={`lava-planet-${i}`}
        colors={randomizeColorsLavaPlanet()}
        radius={radius}
        period={Math.PI * (1 / 3)}
        relativeSpeed={getRandom(Math.PI / 16, Math.PI / 8)}
        eccentricity={eccentricity}
        orbitAngle={orbitAngle}
        scale={[scale, scale, 1]}
      />,
    );

    orbits.push(
      <Orbit
        key={`lava-planet-orbit-${i}`}
        radius={radius}
        eccentricity={eccentricity}
        rotation={orbitAngle}
      />,
    );
  }

  numOfPlanets = Math.floor(getRandom(0, 3));

  for (let i = 0; i < numOfPlanets; i++) {
    const scale = getRandom(20, 25);
    radius = getRandom(radius + 50 * (i + 1), radius + 70 * (i + 1));

    const eccentricity = getRandom(radius / 10, radius / 3);
    const orbitAngle = getRandom(0, Math.PI);

    planets.push(
      <DryPlanet
        key={`dry-planet-${i}`}
        colors={randomizeColorsDryPlanet()}
        radius={radius}
        period={Math.PI * (2 / 3)}
        relativeSpeed={getRandom(Math.PI / 16, Math.PI / 8)}
        eccentricity={eccentricity}
        orbitAngle={orbitAngle}
        scale={[scale, scale, 1]}
      />,
    );

    orbits.push(
      <Orbit
        key={`dry-planet-orbit-${i}`}
        radius={radius}
        eccentricity={eccentricity}
        rotation={orbitAngle}
      />,
    );
  }

  numOfPlanets = Math.floor(getRandom(0, 4));

  for (let i = 0; i < numOfPlanets; i++) {
    const scale = getRandom(15, 20);

    radius = Math.max(200, radius);
    radius = getRandom(radius + 50 * (i + 1), radius + 70 * (i + 1));

    const eccentricity = getRandom(radius / 10, radius / 2);
    const orbitAngle = getRandom(0, Math.PI);

    planets.push(
      <WetPlanet
        key={`wet-planet-${i}`}
        colors={randomizeColorsWetPlanet()}
        radius={radius}
        period={-Math.PI * (2 / 3)}
        relativeSpeed={getRandom(Math.PI / 16, Math.PI / 8)}
        eccentricity={eccentricity}
        orbitAngle={orbitAngle}
        scale={[scale, scale, 1]}
      />,
    );

    orbits.push(
      <Orbit
        key={`wet-planet-orbit-${i}`}
        radius={radius}
        eccentricity={eccentricity}
        rotation={orbitAngle}
      />,
    );
  }

  numOfPlanets = Math.floor(getRandom(1, 4));

  for (let i = 0; i < numOfPlanets; i++) {
    const scale = getRandom(40, 50);

    radius = Math.max(100, radius);
    radius = getRandom(radius + 120 * (i + 1), radius + 150 * (i + 1));

    const eccentricity = getRandom(radius / 7, radius / 2);
    const orbitAngle = getRandom(0, Math.PI);

    planets.push(
      <GasPlanet
        key={`gas-planet-${i}`}
        colors={randomizeColorsGasPlanet()}
        radius={radius}
        period={Math.PI * (1 / 3)}
        relativeSpeed={getRandom(Math.PI / 16, Math.PI / 8)}
        eccentricity={eccentricity}
        orbitAngle={orbitAngle}
        scale={[scale, scale, 1]}
      />,
    );

    orbits.push(
      <Orbit
        key={`gas-planet-orbit-${i}`}
        radius={radius}
        eccentricity={eccentricity}
        rotation={orbitAngle}
      />,
    );
  }

  numOfPlanets = Math.floor(getRandom(0, 4));

  for (let i = 0; i < numOfPlanets; i++) {
    const scale = getRandom(40, 50);

    radius = Math.max(200, radius);
    radius = getRandom(radius + 130 * (i + 1), radius + 170 * (i + 1));

    const eccentricity = getRandom(radius / 7, radius / 2);
    const orbitAngle = getRandom(0, Math.PI);

    planets.push(
      <GasPlanetWithRings
        key={`gas-planet-with-rings-${i}`}
        colors={randomizeColorsGasPlanetWithRings()}
        radius={radius}
        period={Math.PI * (1 / 3)}
        relativeSpeed={getRandom(Math.PI / 16, Math.PI / 8)}
        eccentricity={eccentricity}
        orbitAngle={orbitAngle}
        scale={[scale, scale, 1]}
      />,
    );

    orbits.push(
      <Orbit
        key={`gas-planet-with-rings-orbit-${i}`}
        radius={radius}
        eccentricity={eccentricity}
        rotation={orbitAngle}
      />,
    );
  }

  numOfPlanets = Math.floor(getRandom(1, 4));

  for (let i = 0; i < numOfPlanets; i++) {
    const scale = getRandom(5, 15);
    radius = getRandom(radius + 120 * (i + 1), radius + 150 * (i + 1));

    const eccentricity = getRandom(radius / 5, radius / 1.2);
    const orbitAngle = getRandom(0, Math.PI);

    planets.push(
      <DeadPlanet
        key={`dead-planet-${i}`}
        colors={randomizeColorsDeadPlanet()}
        radius={radius}
        period={Math.PI * (1 / 3)}
        relativeSpeed={getRandom(Math.PI / 16, Math.PI / 8)}
        eccentricity={eccentricity}
        orbitAngle={orbitAngle}
        scale={[scale, scale, 1]}
      />,
    );

    orbits.push(
      <Orbit
        key={`dead-planet-orbit-${i}`}
        radius={radius}
        eccentricity={eccentricity}
        rotation={orbitAngle}
      />,
    );
  }

  return { star, planets, orbits };
};

const StarSystem = () => {
  const currentStarSystem = useAtomValue(currentStarSystemIdAtom);
  const { star, planets, orbits } = useMemo(getPlanets, [currentStarSystem]);

  const [showOrbits] = useAtom(showOrbitsAtom);

  return (
    <Suspense fallback={null}>
      {star}
      <group position={[0, 0, 1]} visible={showOrbits}>
        {orbits}
      </group>
      <group position={[0, 0, 2]}>{planets}</group>
    </Suspense>
  );
};

export default StarSystem;
