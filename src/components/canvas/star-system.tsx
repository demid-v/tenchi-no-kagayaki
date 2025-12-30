"use client";

import { useAtom } from "jotai";
import dynamic from "next/dynamic";
import { Suspense } from "react";

import { showOrbitsAtom } from "~/helpers/store";
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

const Trajectory = dynamic(() => import("~/components/canvas/trajectory"), {
  ssr: false,
});

const getPlanets = (pixels = 100) => {
  const planets = [];
  const orbits = [];

  let radius = 200;

  let numOfPlanets =
    (getRandom() > 0.1 ? 1 : 0) +
    (getRandom() > 0.5 ? 1 : 0) +
    (getRandom() > 0.8 ? 1 : 0);

  for (let i = 0; i < numOfPlanets; i++) {
    const scale = getRandom(30, 40);
    radius = getRandom(radius + 50 * i, radius + 150 * i);

    const eccentricity = getRandom(10, 40);
    const orbitAngle = getRandom(0, Math.PI);

    planets.push(
      <LavaPlanet
        key={`lava-planet-${i}`}
        pixels={pixels}
        radius={radius}
        period={Math.PI * (1 / 3)}
        relativeSpeed={getRandom(Math.PI / 16, Math.PI / 8)}
        eccentricity={eccentricity}
        orbitAngle={orbitAngle}
        scale={[scale, scale, 0]}
      />,
    );

    orbits.push(
      <Trajectory
        key={`lava-planet-orbit-${i}`}
        radius={radius}
        eccentricity={eccentricity}
        rotation={orbitAngle}
      />,
    );
  }

  numOfPlanets = getRandom() > 0.6 ? 1 : 0;

  for (let i = 0; i < numOfPlanets; i++) {
    const scale = getRandom(40, 50);
    radius = getRandom(radius + 150 * (i + 1), radius + 200 * (i + 1));

    const eccentricity = getRandom(radius / 10, radius / 3);
    const orbitAngle = getRandom(0, Math.PI);

    planets.push(
      <DryPlanet
        key={`dry-planet-${i}`}
        pixels={pixels}
        radius={radius}
        period={Math.PI * (2 / 3)}
        relativeSpeed={getRandom(Math.PI / 16, Math.PI / 8)}
        eccentricity={eccentricity}
        orbitAngle={orbitAngle}
        scale={[scale, scale, 0]}
      />,
    );

    orbits.push(
      <Trajectory
        key={`dry-planet-orbit-${i}`}
        radius={radius}
        eccentricity={eccentricity}
        rotation={orbitAngle}
      />,
    );
  }

  numOfPlanets = getRandom() > 0.7 ? 1 : 0;

  for (let i = 0; i < numOfPlanets; i++) {
    const scale = getRandom(40, 60);

    radius = Math.max(400, radius);
    radius = getRandom(radius + 150 * (i + 1), radius + 200 * (i + 1));

    const eccentricity = getRandom(radius / 10, radius / 2);
    const orbitAngle = getRandom(0, Math.PI);

    planets.push(
      <WetPlanet
        key={`wet-planet-${i}`}
        pixels={pixels}
        radius={radius}
        period={-Math.PI * (2 / 3)}
        relativeSpeed={getRandom(Math.PI / 16, Math.PI / 8)}
        eccentricity={eccentricity}
        orbitAngle={orbitAngle}
        scale={[scale, scale, 0]}
      />,
    );

    orbits.push(
      <Trajectory
        key={`wet-planet-orbit-${i}`}
        radius={radius}
        eccentricity={eccentricity}
        rotation={orbitAngle}
      />,
    );
  }

  numOfPlanets = getRandom() > 0.3 ? 1 : 0;

  for (let i = 0; i < numOfPlanets; i++) {
    const scale = getRandom(50, 70);
    radius = getRandom(radius + 250 * (i + 1), radius + 300 * (i + 1));

    const eccentricity = getRandom(radius / 7, radius / 2);
    const orbitAngle = getRandom(0, Math.PI);

    planets.push(
      <GasPlanet
        key={`gas-planet-${i}`}
        pixels={pixels}
        radius={radius}
        period={Math.PI * (1 / 3)}
        relativeSpeed={getRandom(Math.PI / 16, Math.PI / 8)}
        eccentricity={eccentricity}
        orbitAngle={orbitAngle}
        scale={[scale, scale, 0]}
      />,
    );

    orbits.push(
      <Trajectory
        key={`gas-planet-orbit-${i}`}
        radius={radius}
        eccentricity={eccentricity}
        rotation={orbitAngle}
      />,
    );
  }

  numOfPlanets = getRandom() > 0.3 ? 1 : 0;

  for (let i = 0; i < numOfPlanets; i++) {
    const scale = getRandom(80, 100);
    radius = getRandom(radius + 270 * (i + 1), radius + 350 * (i + 1));

    const eccentricity = getRandom(radius / 7, radius / 2);
    const orbitAngle = getRandom(0, Math.PI);

    planets.push(
      <GasPlanetWithRings
        key={`gas-planet-with-rings-${i}`}
        pixels={pixels}
        radius={radius}
        period={Math.PI * (1 / 3)}
        relativeSpeed={getRandom(Math.PI / 16, Math.PI / 8)}
        eccentricity={eccentricity}
        orbitAngle={orbitAngle}
        scale={[scale, scale, 0]}
      />,
    );

    orbits.push(
      <Trajectory
        key={`gas-planet-with-rings-orbit-${i}`}
        radius={radius}
        eccentricity={eccentricity}
        rotation={orbitAngle}
      />,
    );
  }

  numOfPlanets = (getRandom() > 0.1 ? 1 : 0) + (getRandom() > 0.9 ? 1 : 0);

  for (let i = 0; i < numOfPlanets; i++) {
    const scale = getRandom(10, 30);
    radius = getRandom(radius + 250 * (i + 1), radius + 300 * (i + 1));

    const eccentricity = getRandom(radius / 5, radius / 1.2);
    const orbitAngle = getRandom(0, Math.PI);

    planets.push(
      <DeadPlanet
        key={`dead-planet-${i}`}
        pixels={pixels}
        radius={radius}
        period={Math.PI * (1 / 3)}
        relativeSpeed={getRandom(Math.PI / 16, Math.PI / 8)}
        eccentricity={eccentricity}
        orbitAngle={orbitAngle}
        scale={[scale, scale, 0]}
      />,
    );

    orbits.push(
      <Trajectory
        key={`dead-planet-orbit-${i}`}
        radius={radius}
        eccentricity={eccentricity}
        rotation={orbitAngle}
      />,
    );
  }

  return { planets, orbits };
};

const starScale = getRandom(80, 150);
const { planets, orbits } = getPlanets();

const StarSystem = () => {
  const pixels = 100;

  const [showOrbits] = useAtom(showOrbitsAtom);

  return (
    <Suspense fallback={null}>
      <Star
        position={[0, 0, 0]}
        scale={[starScale, starScale, 0]}
        pixels={pixels}
      />
      {showOrbits && <group position={[0, 0, 0]}>{orbits}</group>}
      <group position={[0, 0, -1]}>{planets}</group>
    </Suspense>
  );
};

export default StarSystem;
