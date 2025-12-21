"use client";

import { useFrame } from "@react-three/fiber";
import dynamic from "next/dynamic";
import { Suspense, useRef } from "react";
import * as THREE from "three";

const DeadPlanet = dynamic(
  () => import("~/components/canvas/dead-planet").then((mod) => mod.DeadPlanet),
  { ssr: false },
);

const DryPlanet = dynamic(
  () => import("~/components/canvas/dry-planet").then((mod) => mod.DryPlanet),
  { ssr: false },
);

const Star = dynamic(
  () => import("~/components/canvas/star").then((mod) => mod.Star),
  { ssr: false },
);

const WetPlanet = dynamic(
  () => import("~/components/canvas/wet-planet").then((mod) => mod.WetPlanet),
  { ssr: false },
);

export const StarSystem = () => {
  const dryPlanetRef = useRef<THREE.Group>(null);
  const wetPlanetRef = useRef<THREE.Group>(null);
  const deadPlanetRef = useRef<THREE.Group>(null);

  useFrame(({ clock: { elapsedTime } }) => {
    if (
      !dryPlanetRef.current ||
      !wetPlanetRef.current ||
      !deadPlanetRef.current
    )
      return;

    dryPlanetRef.current.position.x =
      Math.cos(elapsedTime / 80) * Math.sqrt(150 * 150 * 2);
    dryPlanetRef.current.position.y =
      Math.sin(elapsedTime / 80) * Math.sqrt(150 * 150 * 2);

    wetPlanetRef.current.position.x =
      Math.cos(elapsedTime / 130) * Math.sqrt(250 * 250 + 250 * 250);
    wetPlanetRef.current.position.y =
      Math.sin(elapsedTime / 130) * Math.sqrt(250 * 250 + 250 * 250);

    deadPlanetRef.current.position.x =
      Math.cos(elapsedTime / 200) * Math.sqrt(400 * 400 * 2);
    deadPlanetRef.current.position.y =
      Math.sin(elapsedTime / 200) * Math.sqrt(400 * 400 * 2);
  });

  return (
    <Suspense fallback={null}>
      <Star position={[0, 0, 0]} scale={[120, 120, 0]} />
      <DryPlanet
        position={[-200, -200, 0]}
        scale={[40, 40, 0]}
        ref={dryPlanetRef}
      />
      <WetPlanet
        position={[-250, -250, 0]}
        scale={[50, 50, 0]}
        ref={wetPlanetRef}
      />
      <DeadPlanet
        position={[-400, 400, 0]}
        scale={[20, 20, 0]}
        ref={deadPlanetRef}
      />
    </Suspense>
  );
};
