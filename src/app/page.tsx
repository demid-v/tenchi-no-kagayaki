"use client";

import { useAtomValue } from "jotai";
import dynamic from "next/dynamic";
import { Suspense } from "react";

import { JotaiProvider, sceneAtom } from "~/helpers/store";

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
  {
    ssr: false,
  },
);

const StarSystem = dynamic(
  () => import("~/components/canvas/star-system/scene"),
  {
    ssr: false,
  },
);

const GalaxyCluster = dynamic(
  () => import("~/components/canvas/galaxy-cluster/scene"),
  {
    ssr: false,
  },
);

const Galaxy = dynamic(() => import("~/components/canvas/galaxy/scene"), {
  ssr: false,
});

export default function Page() {
  return (
    <JotaiProvider>
      <View
        className="flex h-full w-full flex-col items-center justify-center"
        orbit
      >
        <Scene />
      </View>
    </JotaiProvider>
  );
}

const Scene = () => {
  const scene = useAtomValue(sceneAtom);

  return (
    <Suspense fallback={null}>
      <Common key={scene} />
      <group visible={scene === "starSystem"}>
        <StarSystem />
      </group>
      <group visible={scene === "galaxy"}>
        <Galaxy />
      </group>
      <group visible={scene === "galaxyCluster"}>
        <GalaxyCluster />
      </group>
    </Suspense>
  );
};
