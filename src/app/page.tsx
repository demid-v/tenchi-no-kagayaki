"use client";

import { useFrame } from "@react-three/fiber";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { Suspense } from "react";
import * as THREE from "three";

import {
  IcePlanet,
  LavaPlanet,
  ParadisePlanet,
  Star,
} from "~/components/canvas/planet";

const View = dynamic(
  () => import("~/components/canvas/view").then((mod) => mod.View),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <svg
          className="-ml-1 mr-3 h-5 w-5 animate-spin text-black"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    ),
  },
);

const Common = dynamic(
  () => import("~/components/canvas/view").then((mod) => mod.Common),
  { ssr: false },
);

const Planets = () => {
  const lavaPlanetRef = useRef<THREE.Mesh>(null);
  const paradisePlanetRef = useRef<THREE.Mesh>(null);
  const icePlanetRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock: { elapsedTime } }, delta) => {
    if (
      !lavaPlanetRef.current ||
      !paradisePlanetRef.current ||
      !icePlanetRef.current
    )
      return;

    lavaPlanetRef.current.position.x = Math.sin(elapsedTime / 10 - 500) * 500;
    lavaPlanetRef.current.position.z = Math.cos(elapsedTime / 10 - 500) * 500;

    paradisePlanetRef.current.position.x =
      Math.sin(elapsedTime / 60 - 700) * 700;
    paradisePlanetRef.current.position.z =
      Math.cos(elapsedTime / 60 - 700) * 700;

    icePlanetRef.current.position.x = Math.sin(elapsedTime / 100 - 900) * 900;
    icePlanetRef.current.position.z = Math.cos(elapsedTime / 100 - 900) * 900;
  });

  return (
    <>
      <LavaPlanet position={[-500, 0, 0]} ref={lavaPlanetRef} />
      <ParadisePlanet position={[-700, 0, 0]} ref={paradisePlanetRef} />
      <IcePlanet position={[-900, 0, 0]} ref={icePlanetRef} />
    </>
  );
};

export default function Page() {
  return (
    <View
      className="flex h-full w-full flex-col items-center justify-center"
      orbit
    >
      <Suspense fallback={null}>
        <Planets />
        <Star position={[0, 0, 0]} />
        <Common color="#000000" />
      </Suspense>
    </View>
  );
}
