"use client";

import { OrthographicCamera, View as ViewImpl } from "@react-three/drei";
import { useAtomValue } from "jotai";
import { Suspense, useRef } from "react";
import React from "react";
import { OrthographicCamera as OrthographicCameraImpl } from "three";

import { Three } from "~/helpers/components/three";
import {
  currentGalaxyAtom,
  currentStarSystemAtom,
  sceneAtom,
} from "~/helpers/store";

import Orbit from "./orbit-controls";

const Common = ({ color }: { color?: string }) => {
  const scene = useAtomValue(sceneAtom);

  const ref = useRef<OrthographicCameraImpl>(null);

  const currentStarSystem = useAtomValue(currentStarSystemAtom);
  const currentGalaxy = useAtomValue(currentGalaxyAtom);

  const { x, y, zoom } = (() => {
    if (scene === "galaxy" && currentStarSystem) {
      return {
        x: currentStarSystem.position.x,
        y: currentStarSystem.position.y,
        zoom: 5,
      };
    } else if (scene === "galaxyCluster" && currentGalaxy) {
      return {
        x: currentGalaxy.position.x,
        y: currentGalaxy.position.y,
        zoom: 3,
      };
    }

    return {
      x: 0,
      y: 0,
      zoom: 1,
    };
  })();

  return (
    <Suspense fallback={null}>
      {color && <color attach="background" args={[color]} />}
      <OrthographicCamera
        ref={ref}
        makeDefault
        position={[x, y, 1000]}
        zoom={zoom}
        near={0.1}
        far={2000}
        left={-1}
        right={1}
        top={1}
        bottom={-1}
      />
    </Suspense>
  );
};

const View = ({
  children,
  orbit,
  ...props
}: Readonly<
  {
    children: React.ReactNode;
    orbit?: boolean;
  } & React.HTMLAttributes<HTMLDivElement>
>) => {
  const localRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={localRef} {...props} />
      <Three>
        {/* @ts-expect-error Does accept null */}
        <ViewImpl track={localRef}>
          {children}
          {orbit && <Orbit />}
        </ViewImpl>
      </Three>
    </>
  );
};

View.displayName = "View";

export { Common, View };
