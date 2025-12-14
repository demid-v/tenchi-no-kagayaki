"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { Suspense } from "react";
import * as THREE from "three";

import {
  IcePlanet,
  LavaPlanet,
  ParadisePlanet,
} from "~/components/canvas/planet";

const Planet = dynamic(
  () => import("~/components/canvas/planet").then((mod) => mod.Planet),
  { ssr: false },
);

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
  return (
    <>
      <ParadisePlanet position={[-50, 0, 0]} />
      <IcePlanet position={[0, 0, 0]} />
      <LavaPlanet position={[50, 0, 0]} />
      <Common color="#000000" />
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
      </Suspense>
    </View>
  );
}
