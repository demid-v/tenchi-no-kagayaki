"use client";

import { OrthographicCamera, View as ViewImpl } from "@react-three/drei";
import { Suspense, useRef } from "react";

import { Three } from "~/helpers/components/three";

import Orbit from "./orbit-controls";

const Common = ({ color }: { color?: string }) => (
  <Suspense fallback={null}>
    {color && <color attach="background" args={[color]} />}
    <OrthographicCamera makeDefault far={-1000} near={1000} />
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
          {orbit && <Orbit />}
        </ViewImpl>
      </Three>
    </>
  );
};

View.displayName = "View";

export { Common, View };
