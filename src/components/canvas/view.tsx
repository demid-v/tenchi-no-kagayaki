"use client";

import { OrthographicCamera, View as ViewImpl } from "@react-three/drei";
import { useAtomValue } from "jotai";
import { Suspense, useLayoutEffect, useRef } from "react";
import { OrthographicCamera as OrthographicCameraImpl } from "three";

import { Three } from "~/helpers/components/three";
import { currentStarSystemAtom, sceneAtom } from "~/helpers/store";

import Orbit from "./orbit-controls";

const Common = ({ color }: { color?: string }) => {
  const scene = useAtomValue(sceneAtom);

  const ref = useRef<OrthographicCameraImpl>(null);

  useLayoutEffect(() => {
    if (scene !== "starSystem" || ref.current === null) return;

    ref.current.zoom = 1;

    ref.current.position.set(0, 0, 1000);
    ref.current.rotation.set(0, 0, 0);

    ref.current.updateProjectionMatrix();
  }, [scene]);

  const currentStarSystem = useAtomValue(currentStarSystemAtom);

  useLayoutEffect(() => {
    if (scene !== "galaxy" || ref.current === null) return;

    ref.current.zoom = currentStarSystem ? 5 : 1;

    const { x, y } = currentStarSystem?.star.position.clone() ?? { x: 0, y: 0 };

    ref.current.position.set(x, y, 1000);
    ref.current.rotation.set(0, 0, 0);

    ref.current.updateProjectionMatrix();
  }, [scene, currentStarSystem]);

  useLayoutEffect(() => {
    if (scene !== "galaxyCluster" || ref.current === null) return;

    ref.current.zoom = 1;

    ref.current.position.set(0, 0, 1000);
    ref.current.rotation.set(0, 0, 0);

    ref.current.updateProjectionMatrix();
  }, [scene]);

  return (
    <Suspense fallback={null}>
      {color && <color attach="background" args={[color]} />}
      <OrthographicCamera
        ref={ref}
        makeDefault
        left={-1}
        right={1}
        top={1}
        bottom={-1}
        near={0.1}
        far={2000}
        zoom={1}
        position={[0, 0, 1000]}
      />
    </Suspense>
  );
};

const View = ({
  children,
  orbit,
  ref,
  ...props
}: Readonly<
  {
    children: React.ReactNode;
    orbit?: boolean;
    ref?: React.Ref<HTMLInputElement>;
  } & React.HTMLAttributes<HTMLDivElement>
>) => {
  const localRef = useRef(null);

  return (
    <>
      <div ref={localRef} {...props} />
      <Three>
        {/* @ts-ignore */}
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
