"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as React from "react";
import { Vector2, Vector4 } from "three";
import * as THREE from "three";

import { flip } from "~/helpers/utils";
import fragmentShader from "~/templates/shader/glsl/clouds-fragment.frag";
import vertexShader from "~/templates/shader/glsl/planet-vertex.vert";

import { PlanetShader } from "./planet";

export const CloudsShader = ({
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
  const colorPalette = colors
    ? colors
    : [
        new Vector4(0.882353, 0.94902, 1, 1),
        new Vector4(0.752941, 0.890196, 1, 1),
        new Vector4(0.368627, 0.439216, 0.647059, 1),
        new Vector4(0.25098, 0.286275, 0.45098, 1),
      ];

  const planetOptions = {
    uniforms: {
      light_origin: { value: lightPos },
      pixels: { value: 100.0 },
      seed: { value: flip() ? Math.random() * 10 : Math.random() * 100 },
      time_speed: { value: rotationSpeed },
      base_color: { value: colorPalette[0] },
      outline_color: { value: colorPalette[1] },
      shadow_base_color: { value: colorPalette[2] },
      shadow_outline_color: { value: colorPalette[3] },
      cloud_cover: { value: cloudCover },
      rotation: { value: rotation },
      stretch: { value: stretch },
      time: { value: 0.0 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
  };

  return <shaderMaterial ref={ref} {...planetOptions} />;
};
