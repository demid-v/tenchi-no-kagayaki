"use client";

import {
  OrbitControls,
  PerspectiveCamera,
  View as ViewImpl,
} from "@react-three/drei";
import { Suspense, useRef } from "react";

import { Three } from "~/helpers/components/three";

export const Common = ({ color }: { color?: string }) => (
  <Suspense fallback={null}>
    {color && <color attach="background" args={[color]} />}
    <PerspectiveCamera
      makeDefault
      position={[window.innerWidth / window.innerHeight, 0, 1]}
    />
  </Suspense>
);

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
          {orbit && <OrbitControls />}
        </ViewImpl>
      </Three>
    </>
  );
};

View.displayName = "View";

export { View };
