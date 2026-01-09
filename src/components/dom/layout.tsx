"use client";

import { useAtomValue } from "jotai";
import dynamic from "next/dynamic";
import { useRef } from "react";

import Header from "~/components/canvas/header";
import { sceneAtom } from "~/helpers/store";

const Scene = dynamic(() => import("~/components/canvas/scene"), {
  ssr: false,
});

const Layout = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null);
  const scene = useAtomValue(sceneAtom);

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "auto",
        touchAction: "auto",
      }}
    >
      {(scene === "starSystem" || scene === "galaxyCluster") && <Header />}
      {children}
      <Scene
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
        }}
        eventSource={ref}
        eventPrefix="client"
      />
    </div>
  );
};

export { Layout };
