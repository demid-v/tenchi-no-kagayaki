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
      <Star position={[0, 0, 0]} scale={[200, 200, 0]} />
      <WetPlanet position={[-400, -200, 0]} scale={[100, 100, 1]} />
      {/* <DryPlanet position={[-2, 0, 2]} /> */}
      {/* <DeadPlanet position={[6, 0, -10]} /> */}
    </Suspense>
  );
};
