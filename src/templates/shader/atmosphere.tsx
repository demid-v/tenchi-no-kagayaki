"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as React from "react";
import { Vector2, Vector4 } from "three";
import * as THREE from "three";

import { flip } from "~/helpers/utils";
import fragmentShader from "~/templates/shader/glsl/atmosphere-fragment.frag";
import vertexShader from "~/templates/shader/glsl/planet-vertex.vert";

import { PlanetShader } from "./planet";

export const AtmosphereShader = ({
  pixels = 100.0,
  lightPos = new Vector2(0.39, 0.7),
  lightIntensity = 0.1,
  colors,
  land = 0.6,
  cloudCover = 0.546,
  stretch = 2.5,
  rotationSpeed = 0.1,
  rotation = 0.0,
  ref,
}: {
  pixels?: number;
  lightPos?: Vector2;
  lightIntensity?: number;
  colors?: [Vector4, Vector4, Vector4];
  land?: number;
  cloudCover?: number;
  stretch?: number;
  rotationSpeed?: number;
  rotation?: number;
  position?: [number, number, number];
  ref?: React.Ref<THREE.ShaderMaterial>;
}) => {
  const planetOptions = {
    uniforms: {
      color: { value: new Vector4(173 / 255, 216 / 255, 230 / 255, 0.25) },
      color2: { value: new Vector4(0 / 255, 127 / 255, 255 / 255, 0.35) },
      color3: { value: new Vector4(0 / 255, 0 / 255, 128 / 255, 0.45) },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
  };

  return <shaderMaterial ref={ref} {...planetOptions} />;
};
