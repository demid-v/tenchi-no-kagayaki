"use client";

import { OrthographicCamera, View as ViewImpl } from "@react-three/drei";
import { Suspense, useRef } from "react";
import { OrthographicCamera as OrthographicCameraImpl } from "three";

import { Three } from "~/helpers/components/three";

import Orbit from "./orbit-controls";

const Common = ({ color }: { color?: string }) => {
  const ref = useRef<OrthographicCameraImpl>(null);

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
