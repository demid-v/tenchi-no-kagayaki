"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

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
  return (
    <Suspense fallback={null}>
      <Star position={[0, 0, 0]} scale={[120, 120, 0]} />
      <DryPlanet position={[-200, -90, 0]} scale={[40, 40, 0]} />
      <WetPlanet position={[-400, -200, 0]} scale={[50, 50, 0]} />
      <DeadPlanet position={[700, 500, 0]} scale={[20, 20, 0]} />
    </Suspense>
  );
};
