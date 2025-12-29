"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";

import Header from "./header";

const Scene = dynamic(() => import("~/components/canvas/scene"), {
  ssr: false,
});

const Layout = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null);

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
      <Header />
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
