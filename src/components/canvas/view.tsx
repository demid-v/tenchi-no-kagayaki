"use client";

import { OrthographicCamera, View as ViewImpl } from "@react-three/drei";
import { useAtom, useAtomValue } from "jotai";
import { Suspense, useLayoutEffect, useRef } from "react";
import { OrthographicCamera as OrthographicCameraImpl } from "three";

import { Three } from "~/helpers/components/three";
import { currentStarSystemAtom, sceneAtom } from "~/helpers/store";

import Orbit from "./orbit-controls";

const Common = ({ color }: { color?: string }) => {
  const [scene, setScene] = useAtom(sceneAtom);

  const ref = useRef<OrthographicCameraImpl>(null);

  useLayoutEffect(() => {
    if (scene !== "starSystem" || ref.current === null) return;

    ref.current.zoom = 1;

    ref.current.position.set(0, 0, 1000);
    ref.current.rotation.set(0, 0, 0);

    ref.current.updateProjectionMatrix();
  }, [scene]);

  const position = useAtomValue(currentStarSystemAtom);
  const id = useAtomValue(currentStarSystemAtom);

  useLayoutEffect(() => {
    if (scene !== "galaxy" || ref.current === null || position === undefined)
      return;

    ref.current.zoom = 1;

    const { x, y } = position.star.position.clone();
    ref.current.position.set(x, y, 1000);
    ref.current.rotation.set(0, 0, 0);

    ref.current.updateProjectionMatrix();
  }, [scene, position]);

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
