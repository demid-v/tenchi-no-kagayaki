"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as React from "react";
import { Vector2, Vector4 } from "three";
import * as THREE from "three";

import { flip } from "~/helpers/utils";
import fragmentShaderTemp from "~/templates/shader/glsl/planet-fragment.frag";
import vertexShaderTemp from "~/templates/shader/glsl/planet-vertex.vert";

export const PlanetShader = ({
  pixels = 100.0,
  lightPos = new Vector2(0.39, 0.7),
  lightIntensity = 0.1,
  colors,
  rotationSpeed = 0.1,
  rotation = 0.0,
  vertexShader = vertexShaderTemp,
  fragmentShader = fragmentShaderTemp,
  ref,
}: {
  pixels?: number;
  lightPos?: Vector2;
  lightIntensity?: number;
  colors?: Vector4[];
  rotationSpeed?: number;
  rotation?: number;
  position?: [number, number, number];
  vertexShader?: string;
  fragmentShader?: string;
  ref?: React.Ref<THREE.ShaderMaterial>;
}) => {
  const colorPalette = colors
    ? colors
    : [
        new Vector4(155 / 255, 158 / 255, 184 / 255, 1),
        new Vector4(71 / 255, 97 / 255, 124 / 255, 1),
        new Vector4(53 / 255, 57 / 255, 85 / 255, 1),
      ];

  const planetOptions = {
    uniforms: {
      pixels: { value: pixels },
      color1: { value: colorPalette[0] },
      color2: { value: colorPalette[1] },
      color3: { value: colorPalette[2] },
      lightIntensity: { value: lightIntensity },
      light_origin: { value: lightPos },
      time_speed: { value: rotationSpeed },
      rotation: { value: rotation },
      seed: { value: flip() ? Math.random() * 10 : Math.random() * 100 },
      time: { value: 0.0 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
  };

  return <shaderMaterial ref={ref} {...planetOptions} />;
};
